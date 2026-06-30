/* ===================================================
   TYT ÇALIŞMA TAKİP PLATFORMU - Ana Uygulama
   Kullanıcı: Sultan (öğrenci) | Tuğçe (yönetici)
   Veriler: localStorage'da kalıcı olarak saklanır
   =================================================== */

// ===== STATE =====
let currentUser = null;
let currentSubject = null;
let currentTopicFilter = 'all';

// ===== FIREBASE =====
let firebaseEnabled = false;
let fbDb = null;

async function initFirebase() {
  // firebaseConfig veya firebase SDK yüklü değilse atla
  if (typeof firebaseConfig === 'undefined') return false;
  if (typeof firebase === 'undefined') return false;
  if (firebaseConfig.apiKey.startsWith('BURAYA')) return false;
  try {
    if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
    fbDb = firebase.database();
    firebaseEnabled = true;
    showToast('☁️ Firebase bağlanтıldı — gerçek zamanlı senkronizasyon aktif!', 'info', 3000);
    await syncFromFirebase();
    setupRealtimeListeners();
    return true;
  } catch(e) {
    console.warn('Firebase bağlanamıyor, yerel mod kullanılıyor:', e);
    return false;
  }
}

async function syncFromFirebase() {
  try {
    const snap = await fbDb.ref('tyt').once('value');
    const data = snap.val() || {};
    if (data.progress) localStorage.setItem(STORAGE_KEY, JSON.stringify(data.progress));
    if (data.activity) {
      const arr = Array.isArray(data.activity)
        ? data.activity
        : Object.values(data.activity).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      localStorage.setItem(ACTIVITY_KEY, JSON.stringify(arr));
    }
    if (data.settings?.start_date) localStorage.setItem(START_DATE_KEY, data.settings.start_date);
  } catch(e) { console.warn('Firebase sync hatası:', e); }
}

function setupRealtimeListeners() {
  // Progress değişikliklerini dinle (Tığçe admin panelini anında güncelle)
  fbDb.ref('tyt/progress').on('value', (snap) => {
    const data = snap.val() || {};
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    updateSidebarProgress();
    const adminPage = document.getElementById('page-admin');
    if (adminPage?.classList.contains('active')) renderAdminPage();
    // Dashboard açıksa bugünün görevlerini güncelle
    const dashPage = document.getElementById('page-dashboard');
    if (dashPage?.classList.contains('active')) {
      const prog = loadProgress();
      renderMiniCalendar(prog);
      updateSidebarProgress();
    }
  });

  fbDb.ref('tyt/activity').on('value', (snap) => {
    const data = snap.val();
    if (!data) return;
    const arr = Array.isArray(data)
      ? data
      : Object.values(data).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    localStorage.setItem(ACTIVITY_KEY, JSON.stringify(arr));
  });

  fbDb.ref('tyt/settings').on('value', (snap) => {
    const data = snap.val();
    if (data?.start_date) localStorage.setItem(START_DATE_KEY, data.start_date);
  });
}

// ===== STORAGE HELPERS =====
const STORAGE_KEY = 'tyt_progress_v2';
const ACTIVITY_KEY = 'tyt_activity_log';
const START_DATE_KEY = 'tyt_start_date';

function loadProgress() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
  catch { return {}; }
}

function saveProgress(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  // Firebase'e de yaz
  if (firebaseEnabled && fbDb) {
    fbDb.ref('tyt/progress').set(data)
      .catch(e => console.warn('Firebase progress yazımı hatası:', e));
  }
}

function loadActivity() {
  try { return JSON.parse(localStorage.getItem(ACTIVITY_KEY)) || []; }
  catch { return []; }
}

function saveActivity(log) {
  const trimmed = log.slice(-200);
  localStorage.setItem(ACTIVITY_KEY, JSON.stringify(trimmed));
  // Firebase'e de yaz (array yerine obje olarak — Firebase array'leri sever)
  if (firebaseEnabled && fbDb) {
    const obj = {};
    trimmed.forEach((item, i) => { obj[i] = item; });
    fbDb.ref('tyt/activity').set(obj)
      .catch(e => console.warn('Firebase activity yazımı hatası:', e));
  }
}

function logActivity(type, subject, title) {
  const log = loadActivity();
  log.push({
    type, subject, title,
    timestamp: new Date().toISOString(),
    user: currentUser
  });
  saveActivity(log);
}

// ===== LOGIN =====
let loginMode = 'student';

function switchLoginTab(mode) {
  loginMode = mode;
  document.getElementById('tab-student').classList.toggle('active', mode === 'student');
  document.getElementById('tab-admin').classList.toggle('active', mode === 'admin');
  document.getElementById('login-username').value = '';
  document.getElementById('login-password').value = '';
  document.getElementById('login-error').classList.remove('show');
}

function doLogin() {
  const username = document.getElementById('login-username').value.trim().toLowerCase();
  const password = document.getElementById('login-password').value;

  // Doğrulama
  const user = USERS[username];
  if (!user || user.password !== password) {
    document.getElementById('login-error').classList.add('show');
    return;
  }

  // Rol kontrolü
  if (loginMode === 'admin' && user.role !== 'admin') {
    document.getElementById('login-error').classList.add('show');
    return;
  }
  if (loginMode === 'student' && user.role !== 'student') {
    document.getElementById('login-error').classList.add('show');
    return;
  }

  currentUser = { username, ...user };
  
  // Session'a kaydet (PWA ve APK'larda çıkış yapmaması için localStorage)
  localStorage.setItem('tyt_session', JSON.stringify({ username, role: user.role }));

  startApp();
}

function doLogout() {
  localStorage.removeItem('tyt_session');
  currentUser = null;
  document.getElementById('app').classList.remove('visible');
  document.getElementById('login-screen').classList.remove('hidden');
  document.getElementById('login-username').value = '';
  document.getElementById('login-password').value = '';
}

function checkSession() {
  try {
    const session = JSON.parse(localStorage.getItem('tyt_session'));
    if (session && USERS[session.username]) {
      const user = USERS[session.username];
      currentUser = { username: session.username, ...user };
      return true;
    }
  } catch {}
  return false;
}

// ===== APP INIT =====
function startApp() {
  document.getElementById('login-screen').classList.add('hidden');
  document.getElementById('app').classList.add('visible');

  // Sidebar güncelle
  document.getElementById('sidebar-avatar').textContent = currentUser.avatar;
  document.getElementById('sidebar-name').textContent = currentUser.displayName;
  document.getElementById('sidebar-role').textContent = currentUser.role === 'admin' ? 'Yönetici' : 'Öğrenci';

  // Yönetici navını göster
  if (currentUser.role === 'admin') {
    document.getElementById('nav-admin').style.display = 'flex';
  }

  // Dashboard'u yükle
  showPage('dashboard');
  updateSidebarProgress();

  // TYT tarihi: 14 Haziran 2026 (yaklaşık)
  updateCountdown();
}

// ===== PAGE ROUTING =====
function showPage(page) {
  // Tüm sayfaları gizle
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

  if (page === 'dashboard') {
    document.getElementById('page-dashboard').classList.add('active');
    document.getElementById('nav-dashboard').classList.add('active');
    renderDashboard();
  } else if (page === 'subject') {
    document.getElementById('page-subject').classList.add('active');
    if (currentSubject) document.getElementById(`nav-${currentSubject}`)?.classList.add('active');
    renderSubjectPage();
  } else if (page === 'deneme') {
    document.getElementById('page-deneme').classList.add('active');
    document.getElementById('nav-deneme').classList.add('active');
    renderDenemePage();
  } else if (page === 'admin' && currentUser?.role === 'admin') {
    document.getElementById('page-admin').classList.add('active');
    document.getElementById('nav-admin').classList.add('active');
    renderAdminPage();
  }
}

function showSubject(subjectKey) {
  currentSubject = subjectKey;
  currentTopicFilter = 'all';
  showPage('subject');
}

// ===== DASHBOARD RENDER =====
function renderDashboard() {
  const progress = loadProgress();

  // Karşılama
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Günaydın' : hour < 18 ? 'İyi Günler' : 'İyi Akşamlar';
  document.getElementById('dashboard-title').textContent = `${greeting}, ${currentUser.displayName}! 👋`;
  document.getElementById('today-date-display').textContent = formatDate(new Date());

  // Program başladı mı?
  const startDate = getStartDate();
  const today = new Date(); today.setHours(0,0,0,0);
  const programStarted = today >= startDate;
  const planDay = getTodayPlanDay();

  // Countdown planDay yazısı
  const planEl = document.getElementById('plan-day-text');
  if (planEl) planEl.textContent = programStarted ? `${planDay}.` : 'Henüz başlamadı';

  // Stats
  let totalCompleted = 0, totalTopics = 0;
  Object.keys(SUBJECTS).forEach(subj => {
    SUBJECTS[subj].forEach(t => {
      totalTopics++;
      if (progress[t.id]) totalCompleted++;
    });
  });

  const denemelerin = countDeneme(progress);
  document.getElementById('stat-completed').textContent = totalCompleted;
  document.getElementById('stat-total').textContent = totalTopics;
  document.getElementById('stat-streak').textContent = calculateStreak();
  document.getElementById('stat-deneme').textContent = denemelerin;

  // Mini takvim
  renderMiniCalendar(progress);

  // Bugünün görevleri
  if (!programStarted) {
    renderProgramNotStarted();
  } else {
    renderTodayTasks(progress, planDay);
  }

  // Subject cards
  renderSubjectCards(progress);

  // Deneme badge
  updateDenemeBadge(progress);
}

function renderProgramNotStarted() {
  const container = document.getElementById('today-tasks-list');
  const startDate = getStartDate();
  const today = new Date(); today.setHours(0,0,0,0);
  const daysLeft = Math.ceil((startDate - today) / (1000*60*60*24));
  container.innerHTML = `<div class="empty-state" style="padding:5rem 2rem">
    <div class="icon" style="font-size:6rem">🚀</div>
    <h3 style="font-size:2rem;margin-bottom:1rem">Program ${daysLeft === 1 ? 'Yarın Başlıyor!' : `${daysLeft} Gün Sonra Başlıyor`}</h3>
    <p style="font-size:1.5rem">Başlangıç: ${formatDate(startDate)}</p>
    <p style="margin-top:1rem;color:var(--text-muted)">Hazırlan, büyük yolculuk yakında başlıyor! 💪</p>
  </div>`;
  document.getElementById('today-pct-text').textContent = '—';
  document.getElementById('today-pct-fill').style.width = '0%';
}

function renderTodayTasks(progress, planDay) {
  const container = document.getElementById('today-tasks-list');
  const tasks = STUDY_PLAN[planDay] || [];

  if (tasks.length === 0) {
    container.innerHTML = `<div class="empty-state" style="padding:4rem">
      <div class="icon">🎉</div>
      <h3>Bugün görev yok!</h3>
      <p>Tebrikler! Programın ${planDay}. günündesin.</p>
    </div>`;
    return;
  }

  // Gruplama: ders bazında
  const grouped = {};
  tasks.forEach(task => {
    if (!grouped[task.subject]) grouped[task.subject] = [];
    grouped[task.subject].push(task);
  });

  let done = 0, total = tasks.length;
  let html = '';

  // OFF günü bannerı (sadece genel_deneme görevleri varsa)
  const isOffDay = tasks.every(t => t.subject === 'genel_deneme');
  if (isOffDay) {
    html += `<div style="
      margin:1.6rem 2.4rem;
      padding:2rem;
      background:linear-gradient(135deg,rgba(167,139,250,0.12),rgba(244,114,182,0.08));
      border:1px solid rgba(167,139,250,0.3);
      border-radius:14px;
      display:flex;align-items:center;gap:1.6rem
    ">
      <span style="font-size:3.6rem">🏖️</span>
      <div>
        <div style="font-size:1.6rem;font-weight:800;color:#a78bfa">Cuma — TYT Genel Deneme Günü</div>
        <div style="font-size:1.3rem;color:var(--text-secondary);margin-top:0.3rem">Bugün konu çalışması yok. Denemeyi çöz, yanlışlarını incele, dinlen! 💜</div>
      </div>
    </div>`;
  }

  Object.entries(grouped).forEach(([subj, items]) => {
    const metaMap = {
      deneme:       { label: 'TYT Türkçe Denemesi', icon: '📝', color: '#a78bfa' },
      genel_deneme: { label: 'TYT Genel Deneme',    icon: '🌟', color: '#f472b6' },
      ...SUBJECT_META
    };
    const meta = metaMap[subj] || { label: subj, icon: '📌', color: '#818cf8' };

    html += `<div class="task-group">
      <div class="task-group-header">
        <span>${meta.icon}</span>
        <span style="color:${meta.color}">${meta.label}</span>
      </div>`;

    items.forEach(task => {
      const isCompleted = !!progress[task.id];
      if (isCompleted) done++;

      const isReadOnly = currentUser.role === 'admin';
      const isCheckpoint = task.isCheckpoint;
      const isDeneme = task.type === 'deneme';

      let badgeText = isDeneme ? 'Deneme' : isCheckpoint ? 'Checkpoint' : 'Video';
      let badgeClass = isDeneme ? 'task-type-deneme' : isCheckpoint ? 'task-type-checkpoint' : 'task-type-video';

      html += `<div class="task-item ${isCompleted ? 'completed' : ''} ${badgeClass}" id="task-wrap-${task.id}">
        <div class="task-check ${isCompleted ? 'checked' : ''} ${isReadOnly ? 'readonly' : ''}" 
             id="task-check-${task.id}"
             onclick="${isReadOnly ? '' : `toggleTask('${task.id}', '${subj}', this)`}">
          ${isCompleted ? '✓' : ''}
        </div>
        <div class="task-title">${task.title}</div>
        <span class="task-badge">${badgeText}</span>
      </div>`;
    });

    html += `</div>`;
  });

  container.innerHTML = html;

  // İlerleme
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  document.getElementById('today-pct-text').textContent = `${done}/${total}`;
  document.getElementById('today-pct-fill').style.width = pct + '%';
}

function toggleTask(taskId, subject, el) {
  if (currentUser.role === 'admin') return;

  const progress = loadProgress();
  const wasCompleted = !!progress[taskId];

  if (!wasCompleted) {
    // Tamamlandı olarak işaretle
    progress[taskId] = { completedAt: new Date().toISOString(), user: currentUser.username };
    el.classList.add('checked');
    el.textContent = '✓';
    el.parentElement.classList.add('completed');
    logActivity('complete', subject, taskId);
    showToast('✅ Tamamlandı!', 'success');

    // Confetti
    if (Math.random() > 0.5) triggerConfetti();
  } else {
    // Geri al
    delete progress[taskId];
    el.classList.remove('checked');
    el.textContent = '';
    el.parentElement.classList.remove('completed');
    logActivity('undo', subject, taskId);
    showToast('↩️ Geri alındı', 'info');
  }

  saveProgress(progress);
  updateSidebarProgress();
  renderTodayProgress(progress);
}

function renderTodayProgress(progress) {
  const planDay = getTodayPlanDay();
  const tasks = STUDY_PLAN[planDay] || [];
  const done = tasks.filter(t => progress[t.id]).length;
  const total = tasks.length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  document.getElementById('today-pct-text').textContent = `${done}/${total}`;
  document.getElementById('today-pct-fill').style.width = pct + '%';

  // Stats
  let totalCompleted = 0;
  Object.keys(SUBJECTS).forEach(subj => {
    SUBJECTS[subj].forEach(t => {
      if (progress[t.id]) totalCompleted++;
    });
  });
  document.getElementById('stat-completed').textContent = totalCompleted;
  document.getElementById('stat-deneme').textContent = countDeneme(progress);
}

// ===== MINI CALENDAR =====
function renderMiniCalendar(progress) {
  const container = document.getElementById('mini-calendar');
  if (!container) return;

  const startDate = getStartDate();
  const today = new Date(); today.setHours(0,0,0,0);

  // Tamamlanan günleri bul (aktivitelerden)
  const activity = loadActivity();
  const completedDays = new Set();
  activity.filter(a => a.type === 'complete').forEach(a => {
    const d = new Date(a.timestamp);
    d.setHours(0,0,0,0);
    completedDays.add(d.getTime());
  });

  // Ay başı ve sonu
  const viewDate = new Date(today);
  const monthStart = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
  const monthEnd = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0);

  const monthName = viewDate.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' });
  const days = ['Pt','Sa','Çr','Pr','Cu','Ct','Pz'];

  let html = `<div class="cal-header">
    <span class="cal-month">${monthName.charAt(0).toUpperCase() + monthName.slice(1)}</span>
  </div>
  <div class="cal-days-header">${days.map(d => `<span>${d}</span>`).join('')}</div>
  <div class="cal-grid">`;

  // Boş hücreler (ayın ilk günü hangi güne denk geliyor)
  // tr-TR'de hafta Pazartesi başlar
  let firstDow = monthStart.getDay(); // 0=Sun
  firstDow = firstDow === 0 ? 6 : firstDow - 1; // Pt=0 ... Pz=6
  for (let i = 0; i < firstDow; i++) html += '<span class="cal-cell empty"></span>';

  for (let d = 1; d <= monthEnd.getDate(); d++) {
    const cellDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), d);
    cellDate.setHours(0,0,0,0);
    const isToday = cellDate.getTime() === today.getTime();
    const isStart = cellDate.getTime() === startDate.getTime();
    const isPast = cellDate < today;
    const isDone = completedDays.has(cellDate.getTime());
    const isFuture = cellDate > today;

    // Programın kaçıncı günü?
    const progDay = Math.floor((cellDate - startDate) / (1000*60*60*24)) + 1;
    const inPlan = progDay >= 1 && progDay <= 70;

    let cls = 'cal-cell';
    let tooltip = d + '';
    if (isToday) cls += ' cal-today';
    else if (isDone) cls += ' cal-done';
    else if (isStart && !isPast) cls += ' cal-start';
    else if (inPlan && isFuture) cls += ' cal-upcoming';
    else if (isPast && inPlan && !isDone) cls += ' cal-missed';

    if (inPlan) tooltip = `${d} — Program ${progDay}. gün`;
    if (isStart) tooltip = `${d} — Program Başlangıcı 🚀`;

    html += `<span class="${cls}" title="${tooltip}">${d}</span>`;
  }

  html += '</div><div class="cal-legend">';
  html += '<span class="leg"><span class="leg-dot" style="background:#818cf8"></span>Bugün</span>';
  html += '<span class="leg"><span class="leg-dot" style="background:#10b981"></span>Tamamlandı</span>';
  html += '<span class="leg"><span class="leg-dot" style="background:rgba(99,102,241,0.2)"></span>Plan Günü</span>';
  html += '</div>';

  container.innerHTML = html;
}

function renderSubjectCards(progress) {
  const container = document.getElementById('subject-cards');
  let html = '';

  Object.entries(SUBJECTS).forEach(([key, topics]) => {
    const meta = SUBJECT_META[key];
    const done = topics.filter(t => progress[t.id]).length;
    const total = topics.length;
    const pct = Math.round((done / total) * 100);

    html += `<div class="subject-card" onclick="showSubject('${key}')" 
              style="--card-color:${meta.bg}; border-top:3px solid ${meta.color}40">
      <div class="subject-card-header">
        <div class="subject-card-icon" style="background:${meta.bg}">
          ${meta.icon}
        </div>
        <div class="subject-card-info">
          <h3>${meta.label}</h3>
          <p>${total} video • <a href="${meta.playlist}" target="_blank" onclick="event.stopPropagation()" style="color:${meta.color};text-decoration:none">Playlist ↗</a></p>
        </div>
      </div>
      <div class="subject-progress-section">
        <div class="subject-progress-label">
          <span>İlerleme</span>
          <span class="subject-progress-pct" style="color:${meta.color}">${pct}%</span>
        </div>
        <div class="subject-progress-bar">
          <div class="subject-progress-fill" style="width:${pct}%;background:${meta.color}"></div>
        </div>
      </div>
      <div class="subject-card-footer">
        <span>${done}/${total} tamamlandı</span>
        <span style="color:${meta.color}">→ Konuları Gör</span>
      </div>
    </div>`;
  });

  container.innerHTML = html;
}

// ===== SUBJECT DETAIL =====
function renderSubjectPage() {
  if (!currentSubject) return;
  const meta = SUBJECT_META[currentSubject];
  const topics = SUBJECTS[currentSubject];
  const progress = loadProgress();

  // Header
  document.getElementById('subject-header-icon').textContent = meta.icon;
  document.getElementById('subject-header-title').textContent = meta.label;
  document.getElementById('subject-playlist-link').href = meta.playlist;

  const done = topics.filter(t => progress[t.id]).length;
  document.getElementById('subject-header-sub').textContent = `${done}/${topics.length} konu tamamlandı`;

  renderTopicsList(topics, progress);
}

function filterTopics(filter) {
  currentTopicFilter = filter;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  event.target.classList.add('active');

  const progress = loadProgress();
  renderTopicsList(SUBJECTS[currentSubject], progress);
}

function renderTopicsList(topics, progress) {
  const meta = SUBJECT_META[currentSubject];
  const container = document.getElementById('topics-list');
  let html = '';
  let shown = 0;

  topics.forEach((topic, index) => {
    const isCompleted = !!progress[topic.id];

    if (currentTopicFilter === 'done' && !isCompleted) return;
    if (currentTopicFilter === 'pending' && isCompleted) return;

    shown++;
    const isReadOnly = currentUser.role === 'admin';
    const isCheckpoint = topic.isCheckpoint;

    if (isCheckpoint) {
      html += `<div class="topic-item ${isCompleted ? 'completed' : ''}">
        <div class="topic-num" style="background:rgba(251,191,36,0.1);color:#fbbf24">🏁</div>
        <div class="topic-info">
          <div class="topic-title" style="color:#fbbf24">${topic.title}</div>
          <div class="topic-day">📅 ${topic.day}. Gün</div>
        </div>
        ${!isReadOnly ? `<button class="topic-check-btn ${isCompleted ? 'checked' : 'unchecked'}" 
          onclick="toggleTopicCheck('${topic.id}', '${currentSubject}', this)">
          ${isCompleted ? '✓ Tamamlandı' : 'Tamamla'}
        </button>` : 
        `<span style="font-size:1.2rem;color:${isCompleted ? '#34d399' : 'var(--text-muted)'}">${isCompleted ? '✓' : '—'}</span>`}
      </div>`;
    } else {
      html += `<div class="topic-item ${isCompleted ? 'completed' : ''}">
        <div class="topic-num" style="background:${meta.bg};color:${meta.color}">${index + 1}</div>
        <div class="topic-info">
          <div class="topic-title">${topic.title}</div>
          <div class="topic-day">📅 ${topic.day}. Gün</div>
        </div>
        ${!isReadOnly ? `<button class="topic-check-btn ${isCompleted ? 'checked' : 'unchecked'}" 
          onclick="toggleTopicCheck('${topic.id}', '${currentSubject}', this)">
          ${isCompleted ? '✓ Tamamlandı' : '▶ İzledim'}
        </button>` :
        `<span style="font-size:1.2rem;color:${isCompleted ? '#34d399' : 'var(--text-muted)'}">${isCompleted ? '✓ Bitti' : '⏳ Bekliyor'}</span>`}
      </div>`;
    }
  });

  if (shown === 0) {
    html = `<div class="empty-state"><div class="icon">🎉</div>
      <h3>${currentTopicFilter === 'done' ? 'Hiç tamamlanmamış' : 'Hepsi bitti!'}</h3></div>`;
  }

  container.innerHTML = html;
}

function toggleTopicCheck(topicId, subject, btn) {
  if (currentUser.role === 'admin') return;
  const progress = loadProgress();
  const isCompleted = !!progress[topicId];

  if (!isCompleted) {
    progress[topicId] = { completedAt: new Date().toISOString(), user: currentUser.username };
    btn.classList.remove('unchecked');
    btn.classList.add('checked');
    btn.textContent = '✓ Tamamlandı';
    btn.parentElement.classList.add('completed');
    logActivity('complete', subject, topicId);
    showToast('🎉 Harika! Video tamamlandı.', 'success');
    if (Math.random() > 0.6) triggerConfetti();
  } else {
    delete progress[topicId];
    btn.classList.remove('checked');
    btn.classList.add('unchecked');
    btn.textContent = '▶ İzledim';
    btn.parentElement.classList.remove('completed');
    logActivity('undo', subject, topicId);
    showToast('↩️ Geri alındı', 'info');
  }

  saveProgress(progress);
  updateSidebarProgress();

  // Header'ı güncelle
  const topics = SUBJECTS[subject];
  const done = topics.filter(t => progress[t.id]).length;
  document.getElementById('subject-header-sub').textContent = `${done}/${topics.length} konu tamamlandı`;
}

// ===== DENEME PAGE =====
function renderDenemePage() {
  const progress = loadProgress();
  const container = document.getElementById('deneme-grid');
  const startDate = getStartDate();
  let html = '';
  let deneNum = 0;

  for (let day = 2; day <= 70; day += 2) {
    deneNum++;
    const deneId = `deneme_${day}`;
    const isCompleted = !!progress[deneId];
    const dayDate = new Date(startDate);
    dayDate.setDate(dayDate.getDate() + day - 1);
    const planDay = getTodayPlanDay();
    const isPast = day <= planDay;
    const isReadOnly = currentUser.role === 'admin';

    html += `<div class="deneme-card">
      <div class="deneme-header">
        <div>
          <div class="deneme-number">📝 ${deneNum}. Deneme</div>
          <div class="deneme-date">${formatDate(dayDate)} · ${day}. Gün</div>
        </div>
        <div class="deneme-status ${isCompleted ? 'done' : 'pending'}">
          ${isCompleted ? '✓ Yapıldı' : '⏳ Bekliyor'}
        </div>
      </div>
      ${!isReadOnly && isPast ? `
        <button class="deneme-btn ${isCompleted ? 'completed-btn' : 'complete-btn'}"
                ${isCompleted ? 'disabled' : ''}
                onclick="toggleDeneme('${deneId}', this)">
          ${isCompleted ? '✓ Tamamlandı' : '✅ Yapıldı Olarak İşaretle'}
        </button>
      ` : isReadOnly ? `
        <div style="font-size:1.2rem;color:var(--text-muted);text-align:center;padding:0.8rem">
          ${isCompleted ? '✓ Sultan tamamladı' : day <= planDay ? '⏳ Henüz yapılmadı' : '📅 İlerideki gün'}
        </div>
      ` : `
        <div style="font-size:1.2rem;color:var(--text-muted);text-align:center;padding:0.8rem">📅 Henüz gelmedi</div>
      `}
    </div>`;
  }

  container.innerHTML = html;
}

function toggleDeneme(deneId, btn) {
  if (currentUser.role === 'admin') return;
  const progress = loadProgress();

  if (!progress[deneId]) {
    progress[deneId] = { completedAt: new Date().toISOString(), user: currentUser.username };
    btn.classList.remove('complete-btn');
    btn.classList.add('completed-btn');
    btn.textContent = '✓ Tamamlandı';
    btn.disabled = true;
    btn.previousElementSibling?.querySelector?.('.deneme-status')?.classList.add('done');
    logActivity('deneme', 'deneme', deneId);
    showToast('📝 Deneme tamamlandı! Çok iyi!', 'success');
    saveProgress(progress);
    updateSidebarProgress();
    updateDenemeBadge(progress);
    renderDenemePage(); // refresh
  }
}

function countDeneme(progress) {
  return Object.keys(progress).filter(k => k.startsWith('deneme_')).length;
}

function updateDenemeBadge(progress) {
  const count = countDeneme(progress);
  document.getElementById('deneme-badge').textContent = count;
}

// ===== ADMIN PAGE =====
function renderAdminPage() {
  const progress = loadProgress();
  const activity = loadActivity();

  // Date picker
  const startDate = getStartDate();
  const dateInput = document.getElementById('start-date-input');
  dateInput.value = formatDateInput(startDate);
  document.getElementById('start-date-current').textContent = `Mevcut: ${formatDate(startDate)}`;

  // Stats
  let totalDone = 0, totalAll = 0;
  const subjectStats = {};
  Object.entries(SUBJECTS).forEach(([key, topics]) => {
    const done = topics.filter(t => progress[t.id]).length;
    subjectStats[key] = { done, total: topics.length, pct: Math.round((done / topics.length) * 100) };
    totalDone += done;
    totalAll += topics.length;
  });

  const denemeDone = countDeneme(progress);
  const totalDeneme = 35;
  const overallPct = Math.round((totalDone / totalAll) * 100);
  const streak = calculateStreak();

  document.getElementById('admin-overview').innerHTML = `
    <div class="admin-card">
      <h3>📊 Genel İlerleme</h3>
      <div style="font-size:4.8rem;font-weight:900;color:#818cf8;line-height:1">${overallPct}%</div>
      <div style="font-size:1.3rem;color:var(--text-secondary);margin-top:0.4rem">${totalDone}/${totalAll} video</div>
      <div class="progress-bar" style="margin-top:1.2rem">
        <div class="progress-fill" style="width:${overallPct}%"></div>
      </div>
    </div>
    <div class="admin-card">
      <h3>🔥 Gün Serisi</h3>
      <div style="font-size:4.8rem;font-weight:900;color:#f59e0b;line-height:1">${streak}</div>
      <div style="font-size:1.3rem;color:var(--text-secondary);margin-top:0.4rem">ardışık gün</div>
    </div>
    <div class="admin-card">
      <h3>📝 Denemeler</h3>
      <div style="font-size:4.8rem;font-weight:900;color:#a78bfa;line-height:1">${denemeDone}</div>
      <div style="font-size:1.3rem;color:var(--text-secondary);margin-top:0.4rem">/ ${totalDeneme} deneme</div>
      <div class="progress-bar" style="margin-top:1.2rem">
        <div class="progress-fill" style="width:${Math.round((denemeDone/totalDeneme)*100)}%;background:linear-gradient(90deg,#7c3aed,#a78bfa)"></div>
      </div>
    </div>
    <div class="admin-card">
      <h3>📅 Bugün</h3>
      <div style="font-size:4.8rem;font-weight:900;color:#22d3ee;line-height:1">${getTodayCompleted(progress)}</div>
      <div style="font-size:1.3rem;color:var(--text-secondary);margin-top:0.4rem">video tamamlandı</div>
    </div>
  `;

  // Bar chart
  const colors = { matematik: '#818cf8', fizik: '#22d3ee', kimya: '#34d399', biyoloji: '#fbbf24', geometri: '#f472b6' };
  let barHtml = '';
  Object.entries(subjectStats).forEach(([key, stat]) => {
    const meta = SUBJECT_META[key];
    barHtml += `<div class="bar-row">
      <div class="bar-label">${meta.icon} ${meta.label}</div>
      <div class="bar-track">
        <div class="bar-fill" style="width:${stat.pct}%;background:${colors[key]}"></div>
      </div>
      <div class="bar-pct" style="color:${colors[key]}">${stat.pct}%</div>
    </div>`;
  });
  document.getElementById('admin-bar-chart').innerHTML = barHtml;

  // Daily chart (son 14 gün)
  renderDailyChart(activity);

  // Heatmap
  renderHeatmap(activity);

  // Activity log
  renderActivityLog(activity);
}

function getTodayCompleted(progress) {
  const today = new Date().toDateString();
  const activity = loadActivity();
  return activity.filter(a => new Date(a.timestamp).toDateString() === today && a.type === 'complete').length;
}

function renderDailyChart(activity) {
  const container = document.getElementById('admin-daily-chart');
  const dailyCounts = {};

  activity.filter(a => a.type === 'complete').forEach(a => {
    const dateStr = new Date(a.timestamp).toLocaleDateString('tr-TR', { month: 'short', day: 'numeric' });
    dailyCounts[dateStr] = (dailyCounts[dateStr] || 0) + 1;
  });

  // Son 14 gün
  const dates = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const label = d.toLocaleDateString('tr-TR', { month: 'short', day: 'numeric' });
    dates.push({ label, count: dailyCounts[label] || 0 });
  }

  const maxCount = Math.max(...dates.map(d => d.count), 1);
  let html = '<div style="display:flex;align-items:flex-end;gap:6px;height:100px">';
  dates.forEach(d => {
    const h = Math.max(4, Math.round((d.count / maxCount) * 90));
    const isToday = d.label === new Date().toLocaleDateString('tr-TR', { month: 'short', day: 'numeric' });
    html += `<div title="${d.label}: ${d.count} video" style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px">
      <div style="width:100%;height:${h}px;background:${isToday ? 'linear-gradient(to top,#6366f1,#818cf8)' : 'rgba(99,102,241,0.3)'};border-radius:4px 4px 0 0;transition:all 0.5s"></div>
      <span style="font-size:1rem;color:var(--text-muted);writing-mode:vertical-lr;transform:rotate(180deg)">${d.label.split(' ')[0]}</span>
    </div>`;
  });
  html += '</div>';
  container.innerHTML = html;
}

function renderHeatmap(activity) {
  const container = document.getElementById('heatmap-grid');
  const dailyCounts = {};
  activity.filter(a => a.type === 'complete').forEach(a => {
    const d = new Date(a.timestamp);
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    dailyCounts[key] = (dailyCounts[key] || 0) + 1;
  });

  let html = '';
  for (let i = 69; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    const count = dailyCounts[key] || 0;
    const level = count === 0 ? 0 : count <= 2 ? 1 : count <= 5 ? 2 : count <= 10 ? 3 : 4;
    const label = d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
    html += `<div class="heatmap-cell" data-level="${level}" data-tooltip="${label}: ${count} video"></div>`;
  }
  container.innerHTML = html;
}

function renderActivityLog(activity) {
  const container = document.getElementById('activity-log-list');
  const recent = [...activity].reverse().slice(0, 50);

  if (recent.length === 0) {
    container.innerHTML = `<div class="empty-state" style="padding:4rem">
      <div class="icon">📭</div>
      <h3>Henüz aktivite yok</h3>
    </div>`;
    return;
  }

  const colors = { matematik: '#818cf8', fizik: '#22d3ee', kimya: '#34d399', biyoloji: '#fbbf24', geometri: '#f472b6', deneme: '#a78bfa' };
  const icons = { matematik: '📐', fizik: '⚡', kimya: '🧪', biyoloji: '🧬', geometri: '📏', deneme: '📝' };

  let html = '';
  recent.forEach(a => {
    const color = colors[a.subject] || '#818cf8';
    const icon = icons[a.subject] || '✅';
    const time = new Date(a.timestamp);
    const timeStr = time.toLocaleString('tr-TR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
    const subjectName = SUBJECT_META[a.subject]?.label || 'Deneme';
    const actionText = a.type === 'complete' ? 'tamamladı' : a.type === 'deneme' ? 'yaptı' : 'geri aldı';

    html += `<div class="activity-item">
      <div class="activity-dot" style="background:${color}"></div>
      <div class="activity-text">
        <span class="activity-subject" style="color:${color}">${icon} ${subjectName}</span>
        — Sultan bir konuyu ${actionText}
        <div class="activity-time">${timeStr}</div>
      </div>
    </div>`;
  });

  container.innerHTML = html;
}

// ===== DATE PICKER (ADMIN) =====
function saveStartDate() {
  const input = document.getElementById('start-date-input').value;
  if (!input) return;
  const date = new Date(input);
  date.setHours(0, 0, 0, 0);
  const iso = date.toISOString();
  localStorage.setItem(START_DATE_KEY, iso);
  // Firebase'e de yaz ki Sultan tablette anında görsün
  if (firebaseEnabled && fbDb) {
    fbDb.ref('tyt/settings/start_date').set(iso)
      .catch(e => console.warn('Firebase settings hatası:', e));
  }
  document.getElementById('start-date-current').textContent = `Mevcut: ${formatDate(date)}`;
  showToast('📅 Başlangıç tarihi kaydedildi ve senkronize edildi!', 'success');
  updateCountdown();
}

// ===== SIDEBAR PROGRESS =====
function updateSidebarProgress() {
  const progress = loadProgress();
  let totalDone = 0, totalAll = 0;

  Object.entries(SUBJECTS).forEach(([key, topics]) => {
    const done = topics.filter(t => progress[t.id]).length;
    const total = topics.length;
    const pct = Math.round((done / total) * 100);
    const el = document.getElementById(`mini-pct-${key}`);
    if (el) el.textContent = pct + '%';
    totalDone += done;
    totalAll += total;
  });

  const overallPct = totalAll > 0 ? Math.round((totalDone / totalAll) * 100) : 0;
  document.getElementById('overall-pct-text').textContent = overallPct + '%';
  document.getElementById('overall-pct-fill').style.width = overallPct + '%';
}

// ===== STREAK CALCULATION =====
function calculateStreak() {
  const activity = loadActivity();
  if (activity.length === 0) return 0;

  const completedDays = new Set();
  activity.filter(a => a.type === 'complete').forEach(a => {
    const d = new Date(a.timestamp);
    completedDays.add(`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`);
  });

  let streak = 0;
  const today = new Date();

  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    if (completedDays.has(key)) {
      streak++;
    } else if (i > 0) {
      break;
    }
  }
  return streak;
}

// ===== COUNTDOWN =====
function updateCountdown() {
  // TYT 2027 — yaklaşık tarih (Haziran 2027)
  const tytDate = new Date('2027-06-14');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.ceil((tytDate - today) / (1000 * 60 * 60 * 24));
  const el = document.getElementById('tyt-countdown');
  if (el) el.textContent = diff > 0 ? diff : 'Sınav Günü!';

  // Plan günü
  const planDay = getTodayPlanDay();
  const planEl = document.getElementById('plan-day-text');
  if (planEl) planEl.textContent = `${planDay}.`;
}

// ===== HELPERS =====
function formatDate(date) {
  return new Date(date).toLocaleDateString('tr-TR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

function formatDateInput(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// ===== TOAST =====
function showToast(message, type = 'info', duration = 3000) {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// ===== MODAL =====
function closeModal() {
  document.getElementById('modal-overlay').classList.remove('show');
}

// ===== CONFETTI =====
function triggerConfetti() {
  const colors = ['#818cf8', '#22d3ee', '#34d399', '#fbbf24', '#f472b6', '#a78bfa'];
  for (let i = 0; i < 20; i++) {
    setTimeout(() => {
      const el = document.createElement('div');
      el.className = 'confetti-particle';
      el.style.left = Math.random() * 100 + 'vw';
      el.style.background = colors[Math.floor(Math.random() * colors.length)];
      el.style.animationDuration = (2 + Math.random() * 2) + 's';
      el.style.animationDelay = Math.random() * 0.5 + 's';
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 4000);
    }, i * 50);
  }
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', async () => {
  // Önce Firebase'i başlat (config varsa)
  await initFirebase();

  // Session kontrolü
  if (checkSession()) {
    startApp();
  }

  // Enter key login
  document.getElementById('login-password').addEventListener('keydown', e => {
    if (e.key === 'Enter') doLogin();
  });
});
