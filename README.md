# 🎯 TYT Çalışma Takip Platformu

Bu proje, YKS-TYT sınavına hazırlanan bir öğrenci (Sultan) ile ilerlemeyi takip eden yönetici (Tuğçe) arasındaki süreci dijitalleştirmek için geliştirilmiş **PWA (Progressive Web App)** destekli ve **Firebase** tabanlı bir web uygulamasıdır.

## ✨ Özellikler

- **👥 Çift Rol Sistemi:** 
  - **Öğrenci (Sultan):** Günlük görevleri görür, tamamlar, geri alır. Yönetici paneline erişemez.
  - **Yönetici (Tuğçe):** Salt okunur (read-only) erişim. Öğrencinin ilerlemesini, tamamladığı görevleri ve sistemdeki anlık aktivite geçmişini görüntüler. Görevlere yanlışlıkla tıklayıp bozamaz.
- **☁️ Gerçek Zamanlı Senkronizasyon:** Firebase Realtime Database kullanılarak öğrencinin tabletten yaptığı işaretlemeler yöneticinin bilgisayarına veya telefonuna anında yansır.
- **📱 PWA Desteği:** Masaüstü, iOS ve Android cihazlara uygulama (APK) gibi yüklenebilir. Çevrimdışı önbellekleme (Service Worker) destekler. 
- **📅 Dinamik Çalışma Programı:** 1 Temmuz 2026 başlangıçlı, 70 günlük yapılandırılmış ders programı.
  - Her 2 günde bir Türkçe Denemesi.
  - 10. Günden itibaren her Cuma otomatik olarak "OFF Günü" (Sadece TYT Genel Deneme ve Soru Analizi).
- **🎨 Modern Arayüz:** Koyu tema (Dark mode), glassmorphism detaylar, özel mikro animasyonlar ve kutlama efektleri (Confetti) içeren premium UI/UX tasarımı.

## 🛠️ Kullanılan Teknolojiler

- **Frontend:** Vanilla HTML5, CSS3, JavaScript (ES6+)
- **Backend/Veritabanı:** Firebase Realtime Database
- **Hosting:** Netlify (Önerilen)

## 🚀 Kurulum ve Çalıştırma

1. Projeyi klonlayın:
   ```bash
   git clone https://github.com/KULLANICI_ADINIZ/tyt-takip.git
   ```
2. Firebase ayarlarınızı yapın:
   - Firebase Console'dan yeni bir proje oluşturun ve Realtime Database'i aktif edin.
   - Size verilen yapılandırma kodunu `firebase-config.js` dosyası içindeki `firebaseConfig` değişkenine yapıştırın.
3. Projeyi yerel sunucuda çalıştırın (Örn: Live Server veya Python):
   ```bash
   python -m http.server 8080
   ```
4. Tarayıcıdan `http://localhost:8080` adresine gidin.

---
*Bu proje Antigravity AI asistanı ile geliştirilmiştir.*
