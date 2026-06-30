// TYT Çalışma Takip Platformu - Veri Dosyası
// Program Başlangıcı: 1 Temmuz 2026 (Çarşamba)
// TYT Sınavı: ~13 Haziran 2026 (2027 TYT için revize edilebilir)
// Kullanıcılar
const USERS = {
  sultan: { password: 'sultan123', role: 'student', displayName: 'Sultan', avatar: 'S' },
  tugce: { password: 'tugce123', role: 'admin', displayName: 'Tuğçe', avatar: 'T' }
};

// Ders renkleri ve ikonları
const SUBJECT_META = {
  matematik: { label: 'Matematik', color: '#818cf8', bg: 'rgba(99,102,241,0.15)', icon: '📐', playlist: 'https://youtube.com/playlist?list=PLxSXQclq3muD0--rArSoslBCR0hqWa0MQ' },
  fizik:     { label: 'Fizik',     color: '#22d3ee', bg: 'rgba(6,182,212,0.15)',   icon: '⚡', playlist: 'https://youtube.com/playlist?list=PLhhV4F6NB0-uEPdZncMf_qb0tSKyBM-Lf' },
  kimya:     { label: 'Kimya',     color: '#34d399', bg: 'rgba(16,185,129,0.15)',  icon: '🧪', playlist: 'https://youtube.com/playlist?list=PL5kIOunpmSBNBWMQWLo0vjOZcNx5I_L7p' },
  biyoloji:  { label: 'Biyoloji', color: '#fbbf24', bg: 'rgba(245,158,11,0.15)',  icon: '🧬', playlist: 'https://youtube.com/playlist?list=PL87vBAl7SzvzqiYcuIxz7ptFykyE2qYS_' },
  geometri:  { label: 'Geometri', color: '#f472b6', bg: 'rgba(236,72,153,0.15)',  icon: '📏', playlist: 'https://youtube.com/playlist?list=PLuRXXArNKyygPtjf5vtGzXDF2MdnKxwyZ' },
};

// Tüm konular - YouTube playlist'lerinden alındı
const SUBJECTS = {
  matematik: [
    // Gün 1-3: Sayılar
    { id: 'mat_01', title: 'Doğal Sayılar ve Tam Sayılar - 1', day: 1 },
    { id: 'mat_02', title: 'Doğal Sayılar ve Tam Sayılar - 2', day: 1 },
    { id: 'mat_03', title: 'Doğal Sayılar | Bölüm Bitirme Testi', day: 2 },
    { id: 'mat_04', title: 'Doğal Sayılar | Efiğinado Testi', day: 2 },
    { id: 'mat_05', title: 'Bölme ve Bölünebilme - 1', day: 3 },
    { id: 'mat_06', title: 'Bölme ve Bölünebilme - 2', day: 3 },
    { id: 'mat_07', title: 'Bölme ve Bölünebilme | Bölüm Bitirme Testi', day: 4 },
    { id: 'mat_08', title: 'Bölme ve Bölünebilme | Efiğinado Testi', day: 4 },
    { id: 'mat_09', title: 'EBOB - EKOK - 1', day: 5 },
    { id: 'mat_10', title: 'EBOB - EKOK - 2', day: 5 },
    { id: 'mat_11', title: 'EBOB EKOK | Bölüm Bitirme Testi', day: 6 },
    { id: 'mat_12', title: 'EBOB EKOK | Efiğinado Testi', day: 6 },
    { id: 'mat_13', title: 'Rasyonel Sayılar - 1', day: 7 },
    { id: 'mat_14', title: 'Rasyonel Sayılar - 2', day: 7 },
    { id: 'mat_15', title: 'Rasyonel Sayılar | Bölüm Bitirme Testi', day: 8 },
    { id: 'mat_16', title: 'Rasyonel Sayılar | Efiğinado Testi', day: 8 },
    { id: 'mat_17', title: 'Ondalıklı Sayılar - 1', day: 9 },
    { id: 'mat_18', title: 'Ondalıklı Sayılar - 2', day: 9 },
    { id: 'mat_19', title: 'Ondalıklı Sayılar | Bölüm Bitirme Testi', day: 10 },
    { id: 'mat_20', title: 'Ondalıklı Sayılar | Efiğinado Testi', day: 10 },
    { id: 'mat_21', title: 'Üslü Sayılar - 1', day: 11 },
    { id: 'mat_22', title: 'Üslü Sayılar - 2', day: 11 },
    { id: 'mat_23', title: 'Üslü Sayılar | Bölüm Bitirme Testi', day: 12 },
    { id: 'mat_24', title: 'Üslü Sayılar | Efiğinado Testi', day: 12 },
    { id: 'mat_25', title: 'Köklü Sayılar - 1', day: 13 },
    { id: 'mat_26', title: 'Köklü Sayılar - 2', day: 13 },
    { id: 'mat_27', title: 'Köklü Sayılar | Bölüm Bitirme Testi', day: 14 },
    { id: 'mat_28', title: 'Köklü Sayılar | Efiğinado Testi', day: 14 },
    { id: 'mat_29', title: 'Çarpanlara Ayırma - 1', day: 15 },
    { id: 'mat_30', title: 'Çarpanlara Ayırma - 2', day: 15 },
    { id: 'mat_31', title: 'Çarpanlara Ayırma - 3', day: 16 },
    { id: 'mat_32', title: 'Çarpanlara Ayırma - 4', day: 16 },
    { id: 'mat_33', title: '1. Dereceden Denklemler - 1', day: 17 },
    { id: 'mat_34', title: '1. Dereceden Denklemler - 2', day: 17 },
    { id: 'mat_35', title: '1. Dereceden Denklemler - 3', day: 18 },
    { id: 'mat_36', title: '1. Dereceden Denklem | Bölüm Bitirme Testi', day: 18 },
    { id: 'mat_37', title: '1. Dereceden Denklem | Efiğinado Testi', day: 19 },
    { id: 'mat_38', title: 'Denklem Sistemleri - 1', day: 19 },
    { id: 'mat_39', title: 'Denklem Sistemleri - 2', day: 20 },
    { id: 'mat_40', title: 'Denklem Sistemleri | Bölüm Bitirme Testi', day: 20 },
    { id: 'mat_41', title: '1. Dereceden Eşitsizlikler - 1', day: 21 },
    { id: 'mat_42', title: '1. Dereceden Eşitsizlikler - 2', day: 21 },
    { id: 'mat_43', title: 'Mutlak Değer - 1', day: 22 },
    { id: 'mat_44', title: 'Mutlak Değer - 2', day: 22 },
    { id: 'mat_45', title: 'Mutlak Değer | Bölüm Bitirme Testi', day: 23 },
    { id: 'mat_46', title: 'Mutlak Değer | Efiğinado Testi', day: 23 },
    { id: 'mat_47', title: 'Sayı Basamakları - 1', day: 24 },
    { id: 'mat_48', title: 'Sayı Basamakları - 2', day: 24 },
    { id: 'mat_49', title: 'Sayı Basamakları | Bölüm Bitirme Testi', day: 25 },
    { id: 'mat_50', title: 'Sayı Basamakları | Efiğinado Testi', day: 25 },
    { id: 'mat_51', title: 'Modüler Aritmetik', day: 26 },
    { id: 'mat_52', title: 'Ardışık Sayılar - 1', day: 26 },
    { id: 'mat_53', title: 'Ardışık Sayılar - 2', day: 27 },
    { id: 'mat_54', title: 'Ardışık Sayılar | Efiğinado Testi', day: 27 },
    { id: 'mat_55', title: 'Çarpanlara Ayırma | Bölüm Bitirme Testi', day: 28 },
    { id: 'mat_56', title: 'Çarpanlara Ayırma | Efiğinado Testi', day: 28 },
    { id: 'mat_57', title: '1. Değerlendirme Noktası', day: 28, isCheckpoint: true },
    { id: 'mat_58', title: 'Oran Orantı - 1', day: 29 },
    { id: 'mat_59', title: 'Oran Orantı - 2', day: 29 },
    { id: 'mat_60', title: 'Oran Orantı | Bölüm Bitirme Testi', day: 30 },
    { id: 'mat_61', title: 'Oran Orantı | Efiğinado Testi', day: 30 },
    { id: 'mat_62', title: 'Sayı Problemleri - 1', day: 31 },
    { id: 'mat_63', title: 'Sayı Problemleri - 2', day: 31 },
    { id: 'mat_64', title: 'Sayı Problemleri - 3', day: 32 },
    { id: 'mat_65', title: 'Sayı Problemleri - 4', day: 32 },
    { id: 'mat_66', title: 'Sayı Problemleri | Bölüm Bitirme Testi-1', day: 33 },
    { id: 'mat_67', title: 'Sayı Problemleri | Bölüm Bitirme Testi-2', day: 33 },
    { id: 'mat_68', title: 'Sayı Problemleri | Efiğinado Testi-1', day: 34 },
    { id: 'mat_69', title: 'Sayı Problemleri | Efiğinado Testi-2', day: 34 },
    { id: 'mat_70', title: 'Kesir Problemleri - 1', day: 35 },
    { id: 'mat_71', title: 'Kesir Problemleri - 2', day: 35 },
    { id: 'mat_72', title: 'Kesir Problemleri | Efiğinado Testi', day: 36 },
    { id: 'mat_73', title: 'Yaş Problemleri - 1', day: 37 },
    { id: 'mat_74', title: 'Yaş Problemleri - 2', day: 37 },
    { id: 'mat_75', title: 'Yaş Problemleri | Bölüm Bitirme Testi', day: 38 },
    { id: 'mat_76', title: 'Yaş Problemleri | Efiğinado Testi', day: 38 },
    { id: 'mat_77', title: 'Yüzde Problemleri - 1', day: 39 },
    { id: 'mat_78', title: 'Yüzde Problemleri - 2', day: 39 },
    { id: 'mat_79', title: 'Yüzde Problemleri | Bölüm Bitirme Testi', day: 40 },
    { id: 'mat_80', title: 'Yüzde Problemleri | Efiğinado Testi', day: 40 },
    { id: 'mat_81', title: 'Kâr Zarar Problemleri - 1', day: 41 },
    { id: 'mat_82', title: 'Kâr Zarar Problemleri - 2', day: 41 },
    { id: 'mat_83', title: 'Kâr Zarar | Bölüm Bitirme Testi', day: 42 },
    { id: 'mat_84', title: 'Kâr Zarar | Efiğinado Testi', day: 42 },
    { id: 'mat_85', title: '1. Değerlendirme Denemesi Çözümleri', day: 42, isCheckpoint: true },
    { id: 'mat_86', title: 'Karışım Problemleri - 1', day: 43 },
    { id: 'mat_87', title: 'Karışım Problemleri - 2', day: 43 },
    { id: 'mat_88', title: 'Karışım Problemleri | Bölüm Bitirme Testi', day: 44 },
    { id: 'mat_89', title: 'Karışım Problemleri | Efiğinado Testi', day: 44 },
    { id: 'mat_90', title: 'Hareket Problemleri - 1', day: 45 },
    { id: 'mat_91', title: 'Hareket Problemleri - 2', day: 45 },
    { id: 'mat_92', title: 'Hareket Problemleri | Bölüm Bitirme Testi', day: 46 },
    { id: 'mat_93', title: 'Hareket Problemleri | Efiğinado Testi', day: 46 },
    { id: 'mat_94', title: 'İşçi Problemleri - 1', day: 47 },
    { id: 'mat_95', title: 'İşçi Problemleri - 2', day: 47 },
    { id: 'mat_96', title: 'İşçi Problemleri | Bölüm Bitirme Testi', day: 48 },
    { id: 'mat_97', title: 'İşçi Problemleri | Efiğinado Testi', day: 48 },
    { id: 'mat_98', title: 'Sıradı Problemler | Bölüm Bitirme Testi', day: 49 },
    { id: 'mat_99', title: 'Sıradı Problemler | Efiğinado Testi', day: 49 },
    { id: 'mat_100', title: '2. Değerlendirme Noktası', day: 49, isCheckpoint: true },
    { id: 'mat_101', title: 'Grafik Analizi', day: 50 },
    { id: 'mat_102', title: 'Veri Analizi (İstatistik)', day: 50 },
    { id: 'mat_103', title: 'Grafik ve Veri Analizi | Bölüm Bitirme Testi-1', day: 51 },
    { id: 'mat_104', title: 'Grafik ve Veri Analizi | Bölüm Bitirme Testi-2', day: 51 },
    { id: 'mat_105', title: 'Grafik ve Veri Analizi | Efiğinado Testi-1', day: 52 },
    { id: 'mat_106', title: 'Grafik ve Veri Analizi | Efiğinado Testi-2', day: 52 },
    { id: 'mat_107', title: 'Mantık - 1', day: 53 },
    { id: 'mat_108', title: 'Mantık - 2', day: 53 },
    { id: 'mat_109', title: 'Mantık | Bölüm Bitirme Testi', day: 54 },
    { id: 'mat_110', title: 'Mantık | Efiğinado Testi', day: 54 },
    { id: 'mat_111', title: 'Kümeler - 1', day: 55 },
    { id: 'mat_112', title: 'Kümeler - 2', day: 55 },
    { id: 'mat_113', title: 'Kümeler - 3', day: 56 },
    { id: 'mat_114', title: 'Kartezyen Çarpım', day: 56 },
    { id: 'mat_115', title: 'Küme Problemleri - 1', day: 57 },
    { id: 'mat_116', title: 'Küme Problemleri - 2', day: 57 },
    { id: 'mat_117', title: 'Kümeler | Bölüm Bitirme Testi', day: 58 },
    { id: 'mat_118', title: 'Kümeler | Efiğinado Testi', day: 58 },
    { id: 'mat_119', title: 'Fonksiyonlar - 1', day: 59 },
    { id: 'mat_120', title: 'Fonksiyonlar - 2', day: 59 },
    { id: 'mat_121', title: 'Fonksiyonlar - 3', day: 60 },
    { id: 'mat_122', title: 'Fonksiyonlar - 4', day: 60 },
    { id: 'mat_123', title: 'Fonksiyonlar - 5', day: 61 },
    { id: 'mat_124', title: 'Fonksiyonlar - 6', day: 61 },
    { id: 'mat_125', title: 'Fonksiyonlar - 7', day: 62 },
    { id: 'mat_126', title: 'Fonksiyonlar - 8', day: 62 },
    { id: 'mat_127', title: 'Fonksiyonlar | Bölüm Bitirme Testi-1', day: 63 },
    { id: 'mat_128', title: 'Fonksiyonlar | Bölüm Bitirme Testi-2', day: 63 },
    { id: 'mat_129', title: 'Fonksiyonlar | Efiğinado Testi-1', day: 64 },
    { id: 'mat_130', title: 'Fonksiyonlar | Efiğinado Testi-2', day: 64 },
    { id: 'mat_131', title: 'Permütasyon - 1', day: 65 },
    { id: 'mat_132', title: 'Permütasyon - 2', day: 65 },
    { id: 'mat_133', title: 'Kombinasyon - 1', day: 66 },
    { id: 'mat_134', title: 'Kombinasyon - 2', day: 66 },
    { id: 'mat_135', title: 'Binom Açılımı - 1', day: 67 },
    { id: 'mat_136', title: 'Binom Açılımı - 2', day: 67 },
    { id: 'mat_137', title: 'Perm. Komb. Binom | Bölüm Bitirme Testi', day: 68 },
    { id: 'mat_138', title: 'Perm. Komb. Binom | Efiğinado Testi', day: 68 },
    { id: 'mat_139', title: 'Olasılık - 1', day: 69 },
    { id: 'mat_140', title: 'Olasılık - 2', day: 69 },
    { id: 'mat_141', title: 'Olasılık | Bölüm Bitirme Testi', day: 70 },
    { id: 'mat_142', title: 'Olasılık | Efiğinado Testi', day: 70 },
  ],

  fizik: [
    { id: 'fiz_01', title: 'Fizik Bilimine Giriş - 1', day: 1 },
    { id: 'fiz_02', title: 'Fizik Bilimine Giriş - 2', day: 1 },
    { id: 'fiz_03', title: 'Fizik Bilimine Giriş Soru Çözümü', day: 2 },
    { id: 'fiz_04', title: 'Madde ve Özellikleri - 1', day: 2 },
    { id: 'fiz_05', title: 'Madde ve Özellikleri - 2', day: 3 },
    { id: 'fiz_06', title: 'Madde ve Özellikleri - 3', day: 3 },
    { id: 'fiz_07', title: 'Madde ve Öz. Soru Çözümü - 1', day: 4 },
    { id: 'fiz_08', title: 'Madde ve Öz. Soru Çözümü - 2', day: 4 },
    { id: 'fiz_09', title: 'Hareket - 1 | Konum, Yol, Yer Değiştirme', day: 5 },
    { id: 'fiz_10', title: 'Hareket - 2 | Hız ve İvme', day: 5 },
    { id: 'fiz_11', title: 'Hareket - 3 | Serbest Düşme ve Atış', day: 6 },
    { id: 'fiz_12', title: 'Hareket - 4 | Newton Yasaları', day: 6 },
    { id: 'fiz_13', title: 'Hareket Soru Çözümü - 1', day: 7 },
    { id: 'fiz_14', title: 'Hareket Soru Çözümü - 2', day: 7 },
    { id: 'fiz_15', title: 'Kuvvet - 1 | Bileşke Kuvvet', day: 8 },
    { id: 'fiz_16', title: 'Kuvvet - 2 | Sürtünme Kuvveti', day: 8 },
    { id: 'fiz_17', title: 'Kuvvet Soru Çözümü - 1', day: 9 },
    { id: 'fiz_18', title: 'Kuvvet Soru Çözümü - 2', day: 9 },
    { id: 'fiz_19', title: 'Enerji - 1 | İş ve Enerji', day: 10 },
    { id: 'fiz_20', title: 'Enerji - 2 | Enerji Türleri', day: 10 },
    { id: 'fiz_21', title: 'Enerji - 3 | Güç', day: 11 },
    { id: 'fiz_22', title: 'Enerji Soru Çözümü - 1', day: 11 },
    { id: 'fiz_23', title: 'Enerji Soru Çözümü - 2', day: 12 },
    { id: 'fiz_24', title: 'Basit Makineler - 1', day: 12 },
    { id: 'fiz_25', title: 'Basit Makineler - 2', day: 13 },
    { id: 'fiz_26', title: 'Basit Makineler Soru Çözümü', day: 13 },
    { id: 'fiz_27', title: 'Isı ve Sıcaklık - 1', day: 14 },
    { id: 'fiz_28', title: 'Isı ve Sıcaklık - 2', day: 14 },
    { id: 'fiz_29', title: 'Isı ve Sıcaklık - 3', day: 15 },
    { id: 'fiz_30', title: 'Isı ve Sıcaklık - 4', day: 15 },
    { id: 'fiz_31', title: 'Isı ve Sıcaklık Soru Çözümü - 1', day: 16 },
    { id: 'fiz_32', title: 'Isı ve Sıcaklık Soru Çözümü - 2', day: 16 },
    { id: 'fiz_33', title: 'Isı ve Sıcaklık Soru Çözümü - 3', day: 17 },
    { id: 'fiz_34', title: 'Isı ve Sıcaklık Soru Çözümü - 4', day: 17 },
    { id: 'fiz_35', title: 'Genleşme - 1', day: 18 },
    { id: 'fiz_36', title: 'Genleşme - 2', day: 18 },
    { id: 'fiz_37', title: 'Genleşme Soru Çözümü', day: 18 },
    { id: 'fiz_38', title: 'Elektrostatik - 1 | Elektrik Yükleri', day: 19 },
    { id: 'fiz_39', title: 'Elektrostatik - 2 | Elektriklenme Çeşitleri', day: 19 },
    { id: 'fiz_40', title: 'Elektrostatik - 3 | Elektroskop', day: 20 },
    { id: 'fiz_41', title: 'Elektrostatik - 4 | İletken ve Yalıtkanlar, Topraklama', day: 20 },
    { id: 'fiz_42', title: 'Elektrostatik - 5 | Coulomb Kuvveti', day: 21 },
    { id: 'fiz_43', title: 'Elektrostatik - 6 | Elektrik Alan', day: 21 },
    { id: 'fiz_44', title: 'Elektrostatik Soru Çözümü - 1', day: 22 },
    { id: 'fiz_45', title: 'Elektrostatik Soru Çözümü - 2', day: 22 },
    { id: 'fiz_46', title: 'Elektrik Akımı - 1 | Elektrik Akımı ve Potansiyel Fark', day: 23 },
    { id: 'fiz_47', title: 'Elektrik Akımı - 2 | Direnç', day: 23 },
    { id: 'fiz_48', title: 'Elektrik Devreleri - 1 | Ohm Yasası', day: 24 },
    { id: 'fiz_49', title: 'Elektrik Devreleri - 2 | Dirençlerin Bağlanması', day: 24 },
    { id: 'fiz_50', title: 'Elektrik Devreleri - 3 | Üreteçlerin Bağlanması', day: 25 },
    { id: 'fiz_51', title: 'Elektrik Devreleri Soru Çözümü - 1', day: 25 },
    { id: 'fiz_52', title: 'Elektrik Devreleri Soru Çözümü - 2', day: 25 },
    { id: 'fiz_53', title: 'Elektrik Devreleri - 4 | Elektriksel Güç ve Lambalar', day: 26 },
    { id: 'fiz_54', title: 'Elektriksel Güç ve Lambalar Soru Çözümü - 1', day: 26 },
    { id: 'fiz_55', title: 'Elektriksel Güç ve Lambalar Soru Çözümü - 2', day: 26 },
    { id: 'fiz_56', title: 'Manyetizma - 1 | Mıknatıs ve Manyetik Alan', day: 27 },
    { id: 'fiz_57', title: 'Manyetizma - 2 | Akım ve Manyetik Alan', day: 27 },
    { id: 'fiz_58', title: 'Manyetizma - 3 | Elektromıknatıs', day: 28 },
    { id: 'fiz_59', title: 'Manyetizma - 4 | Dünya\'nın Manyetik Alanı', day: 28 },
    { id: 'fiz_60', title: 'Manyetizma Soru Çözümü - 1', day: 29 },
    { id: 'fiz_61', title: 'Manyetizma Soru Çözümü - 2', day: 29 },
    { id: 'fiz_62', title: 'Basınç - 1 | Katı Basıncı', day: 30 },
    { id: 'fiz_63', title: 'Basınç Soru Çözümü - 1 | Katı Basıncı', day: 30 },
    { id: 'fiz_64', title: 'Basınç - 2 | Sıvı Basıncı - 1', day: 31 },
    { id: 'fiz_65', title: 'Basınç - 3 | Sıvı Basıncı - 2', day: 31 },
    { id: 'fiz_66', title: 'Basınç - 4 | Sıvı Basıncı - 3', day: 31 },
    { id: 'fiz_67', title: 'Basınç - 5 | Açık Hava Basıncı', day: 32 },
    { id: 'fiz_68', title: 'Basınç - 6 | Kapalı Kaplarda Gaz Basıncı', day: 32 },
    { id: 'fiz_69', title: 'Basınç - 7 | Basınç Ölçen Aletler', day: 33 },
    { id: 'fiz_70', title: 'Basınç - 8 | Akışkanların Basıncı', day: 33 },
    { id: 'fiz_71', title: 'Durgun Sıvı ve Akışkan Basıncı Soru Çözümü - 1', day: 34 },
    { id: 'fiz_72', title: 'Durgun Sıvı ve Akışkan Basıncı Soru Çözümü - 2', day: 34 },
    { id: 'fiz_73', title: 'Gaz Basıncı Soru Çözümü - 1', day: 34 },
    { id: 'fiz_74', title: 'Gaz Basıncı Soru Çözümü - 2', day: 34 },
    { id: 'fiz_75', title: 'Kaldırma Kuvveti - 1', day: 35 },
    { id: 'fiz_76', title: 'Kaldırma Kuvveti - 2', day: 35 },
    { id: 'fiz_77', title: 'Kaldırma Kuvveti Soru Çözümü - 1', day: 36 },
    { id: 'fiz_78', title: 'Kaldırma Kuvveti Soru Çözümü - 2', day: 36 },
    { id: 'fiz_79', title: 'Işık Şiddeti ve Işık Akısı | Optik - 1', day: 37 },
    { id: 'fiz_80', title: 'Aydınlanma Şiddeti | Optik - 2', day: 37 },
    { id: 'fiz_81', title: 'Aydınlanma Soru Çözümü | Optik', day: 37 },
    { id: 'fiz_82', title: 'Gölge - 1 | Optik', day: 38 },
    { id: 'fiz_83', title: 'Gölge - 2 | Optik', day: 38 },
    { id: 'fiz_84', title: 'Gölge Soru Çözümü | Optik', day: 38 },
    { id: 'fiz_85', title: 'Yansıma ve Yansıma Kanunları | Optik', day: 39 },
    { id: 'fiz_86', title: 'Düzlem Ayna - 1 | Optik', day: 39 },
    { id: 'fiz_87', title: 'Görüş Alanı | Düzlem Ayna - 2 | Optik', day: 40 },
    { id: 'fiz_88', title: 'Düzlem Ayna Soru Çözümü | Optik', day: 40 },
    { id: 'fiz_89', title: 'Çukur Aynada Özel Işınlar | Küresel Aynalar - 1', day: 41 },
    { id: 'fiz_90', title: 'Tümsek Aynada Özel Işınlar | Küresel Aynalar - 2', day: 41 },
    { id: 'fiz_91', title: 'Çukur Aynada Görüntü | Küresel Aynalar - 3', day: 42 },
    { id: 'fiz_92', title: 'Tümsek Aynada Görüntü | Küresel Aynalar - 4', day: 42 },
    { id: 'fiz_93', title: 'Küresel Aynalar Soru Çözümü | Optik', day: 43 },
    { id: 'fiz_94', title: 'Kırılma İndisi, Snell Yasası | Işın Kırılması', day: 44 },
    { id: 'fiz_95', title: 'Sınır Açısı ve Tam Yansıma | Işın Kırılması', day: 44 },
    { id: 'fiz_96', title: 'Küresel Yüzeylerden Geçiş | Optik', day: 45 },
    { id: 'fiz_97', title: 'Işın Kırılması Soru Çözümü | Optik', day: 45 },
    { id: 'fiz_98', title: 'Mercekler ve Odak Uzaklığının Bağlı Olduğu Faktörler', day: 46 },
    { id: 'fiz_99', title: 'İnce ve Kalın Kenarlı Merceklerde Özel Işınlar', day: 46 },
    { id: 'fiz_100', title: 'İnce ve Kalın Kenarlı Merceklerde Görüntü', day: 47 },
    { id: 'fiz_101', title: 'Mercekler Soru Çözümü | Optik', day: 47 },
    { id: 'fiz_102', title: 'Prizmalar | Optik', day: 48 },
    { id: 'fiz_103', title: 'Renkler | Optik', day: 48 },
    { id: 'fiz_104', title: 'Prizma ve Renkler Soru Çözümü | Optik', day: 49 },
    { id: 'fiz_105', title: 'Temel Kavramlar | Dalgalar - 1', day: 50 },
    { id: 'fiz_106', title: 'Dalgaların Sınıflandırılması | Dalgalar - 2', day: 50 },
    { id: 'fiz_107', title: 'Atmaların İlerlemesi ve Hızı | Yay Dalgaları - 1', day: 51 },
    { id: 'fiz_108', title: 'Atmaların Yansıması ve Girişimi | Yay Dalgaları - 2', day: 51 },
    { id: 'fiz_109', title: 'Atmaların Farklı Ortama Geçişi | Yay Dalgaları - 3', day: 52 },
    { id: 'fiz_110', title: 'Yay Dalgaları Soru Çözümü', day: 52 },
    { id: 'fiz_111', title: 'Doğrusal ve Dairesel Su Dalgaları | Su Dalgası - 1', day: 53 },
    { id: 'fiz_112', title: 'Doğrusal Su Dalgalarında Yansıma | Su Dalgası - 2', day: 53 },
    { id: 'fiz_113', title: 'Dairesel Su Dalgalarında Yansıma | Su Dalgası - 3', day: 53 },
    { id: 'fiz_114', title: 'Su Dalgalarının Hızı ve Kırılması | Su Dalgası - 4', day: 54 },
    { id: 'fiz_115', title: 'Su Dalgaları Soru Çözümü', day: 54 },
    { id: 'fiz_116', title: 'Ses ve Deprem Dalgaları', day: 55 },
    { id: 'fiz_117', title: 'Ses ve Deprem Dalgaları Soru Çözümü', day: 55 },
  ],

  kimya: [
    { id: 'kim_01', title: 'Simyadan Kimyaya', day: 1 },
    { id: 'kim_02', title: '1. Ünite - Kimyanın Çalışma Alanları', day: 1 },
    { id: 'kim_03', title: '1. Ünite - Kimyanın Sembolik Dili', day: 2 },
    { id: 'kim_04', title: '1. Ünite - İş Sağlığı ve Güvenliği - 1', day: 2 },
    { id: 'kim_05', title: '1. Ünite - İş Sağlığı ve Güvenliği - 2', day: 3 },
    { id: 'kim_06', title: '2. Ünite - Atom Modelleri', day: 3 },
    { id: 'kim_07', title: '2. Ünite - Atomun Yapısı', day: 4 },
    { id: 'kim_08', title: 'Periyodik Sistem', day: 4 },
    { id: 'kim_09', title: 'Elementlerin Sınıflandırılması', day: 5 },
    { id: 'kim_10', title: 'Periyodik Özellikler - 1', day: 5 },
    { id: 'kim_11', title: 'Periyodik Özellikler - 2', day: 6 },
    { id: 'kim_12', title: 'Kimyasal Türler Arası Etkileşimler', day: 6 },
    { id: 'kim_13', title: 'Güçlü Etkileşimler (İyonik Bağ)', day: 7 },
    { id: 'kim_14', title: 'İyonik Bağlı Bileşiklerin Adlandırılması', day: 7 },
    { id: 'kim_15', title: 'Kovalent Bağ', day: 8 },
    { id: 'kim_16', title: 'Kovalent Bağlı Bileşiklerin İsimlendirilmesi ve Metalik Bağ', day: 8 },
    { id: 'kim_17', title: 'Zayıf Etkileşimler', day: 9 },
    { id: 'kim_18', title: 'Fiziksel ve Kimyasal Değişimler', day: 9 },
    { id: 'kim_19', title: 'Maddenin Halleri', day: 10 },
    { id: 'kim_20', title: 'Katılar', day: 10 },
    { id: 'kim_21', title: 'Sıvılar', day: 11 },
    { id: 'kim_22', title: 'Gazlar', day: 11 },
    { id: 'kim_23', title: 'Doğa ve Kimya', day: 12 },
    { id: 'kim_24', title: 'Kimyanın Temel Kanunları', day: 12 },
    { id: 'kim_25', title: 'Sabit Oranlar Kanunları', day: 13 },
    { id: 'kim_26', title: 'Katlı Oranlar Kanunları', day: 13 },
    { id: 'kim_27', title: 'Mol Kavramı - 1', day: 14 },
    { id: 'kim_28', title: 'Mol Kavramı - 2', day: 14 },
    { id: 'kim_29', title: 'Mol Kavramı Soru Çözümü', day: 15 },
    { id: 'kim_30', title: 'Kimyasal Tepkime Türleri', day: 15 },
    { id: 'kim_31', title: 'Kimyasal Tepkimelerde Hesaplamalar - 1', day: 16 },
    { id: 'kim_32', title: 'Kimyasal Tepkimelerde Hesaplamalar - 2', day: 16 },
    { id: 'kim_33', title: 'Kimyasal Tepkimelerde Hesaplamalar - 3', day: 17 },
    { id: 'kim_34', title: 'Kimyasal Hesaplamalar Soru Çözümü', day: 17 },
    { id: 'kim_35', title: 'Karışımların Sınıflandırılması - 1', day: 18 },
    { id: 'kim_36', title: 'Karışımların Sınıflandırılması - 2', day: 18 },
    { id: 'kim_37', title: 'Çözünme Süreci', day: 19 },
    { id: 'kim_38', title: 'Çözeltilerde Derişim', day: 19 },
    { id: 'kim_39', title: 'Karışımlar - ÖSYM Ne Sordu?', day: 20 },
    { id: 'kim_40', title: 'Koligatif Özellikler', day: 20 },
    { id: 'kim_41', title: 'Ayırma ve Saflaştırma Teknikleri', day: 21 },
    { id: 'kim_42', title: 'Asitler ve Bazlar', day: 21 },
    { id: 'kim_43', title: 'Asitlerin ve Bazların Tepkimeleri - 1', day: 22 },
    { id: 'kim_44', title: 'Asitlerin ve Bazların Tepkimeleri - 2', day: 22 },
    { id: 'kim_45', title: 'Hayatımızdaki Asitler, Bazlar ve Tuzlar', day: 23 },
    { id: 'kim_46', title: 'Asitler, Bazlar ve Tuzlar - Ünite Değerlendirme', day: 23 },
    { id: 'kim_47', title: 'Kimya Her Yerde', day: 24 },
  ],

  biyoloji: [
    { id: 'bio_01', title: 'Enzimler ve Vitaminler Checkpoint', day: 1, isCheckpoint: true },
    { id: 'bio_02', title: 'Nükleik Asitler DNA ve RNA', day: 2 },
    { id: 'bio_03', title: 'ATP ve Metabolizma', day: 2 },
    { id: 'bio_04', title: 'Nükleik Asitler ve ATP Checkpoint', day: 3, isCheckpoint: true },
    { id: 'bio_05', title: 'Hücre Organelleri 1. Kısım', day: 3 },
    { id: 'bio_06', title: 'Hücre Organelleri 2. Kısım', day: 4 },
    { id: 'bio_07', title: 'Organeller Checkpoint', day: 4, isCheckpoint: true },
    { id: 'bio_08', title: 'Hücre Zarında Madde Alışverişleri 1. Kısım', day: 5 },
    { id: 'bio_09', title: 'Hücre Zarında Madde Alışverişleri 2. Kısım', day: 5 },
    { id: 'bio_10', title: 'Bilimsel Yöntem ve Çalışma Basamakları', day: 6 },
    { id: 'bio_11', title: 'Hücre Zarı ve Bilimsel Çalışma Checkpoint', day: 6, isCheckpoint: true },
    { id: 'bio_12', title: 'Canlıların Sınıflandırılması', day: 7 },
    { id: 'bio_13', title: 'Bakteri ve Arke', day: 7 },
    { id: 'bio_14', title: 'Bakteri ve Arke Checkpoint', day: 8, isCheckpoint: true },
    { id: 'bio_15', title: 'Protista', day: 8 },
    { id: 'bio_16', title: 'Bitki', day: 9 },
    { id: 'bio_17', title: 'Mantar', day: 9 },
    { id: 'bio_18', title: 'Protista, Bitki ve Mantar Checkpoint', day: 10, isCheckpoint: true },
    { id: 'bio_19', title: 'Omurgasızlar', day: 10 },
    { id: 'bio_20', title: 'Omurgalılar', day: 11 },
    { id: 'bio_21', title: 'Hayvanlar Checkpoint', day: 11, isCheckpoint: true },
    { id: 'bio_22', title: 'Hücre Bölünmeleri - Mitoz', day: 12 },
    { id: 'bio_23', title: 'Mitoz Checkpoint', day: 12, isCheckpoint: true },
    { id: 'bio_24', title: 'Hücre Bölünmeleri - Mayoz', day: 13 },
    { id: 'bio_25', title: 'Mayoz Checkpoint', day: 13, isCheckpoint: true },
    { id: 'bio_26', title: 'Eşeysiz Üreme', day: 14 },
    { id: 'bio_27', title: 'Eşeyli Üreme', day: 14 },
    { id: 'bio_28', title: 'Eşeysiz ve Eşeyli Üreme Checkpoint', day: 15, isCheckpoint: true },
    { id: 'bio_29', title: 'Kalıtıma Giriş', day: 15 },
    { id: 'bio_30', title: 'Mendel Genetiği', day: 16 },
    { id: 'bio_31', title: 'Mendel\'den Sapmalar', day: 16 },
    { id: 'bio_32', title: 'Eşeyin Belirlenmesi X ve Y Kromozomları', day: 17 },
    { id: 'bio_33', title: 'Kan Grupları', day: 17 },
    { id: 'bio_34', title: 'Genetik Çeşitlilik', day: 18 },
    { id: 'bio_35', title: 'Kalıtım Checkpoint', day: 18, isCheckpoint: true },
    { id: 'bio_36', title: 'Ekoloji Giriş', day: 19 },
    { id: 'bio_37', title: 'Besin Piramidi', day: 19 },
    { id: 'bio_38', title: 'Besin Zinciri ve Ağ', day: 20 },
    { id: 'bio_39', title: 'Ekoloji Checkpoint', day: 20, isCheckpoint: true },
    { id: 'bio_40', title: 'Madde Döngüleri', day: 21 },
    { id: 'bio_41', title: 'Güncel Çevre Sorunları', day: 21 },
    { id: 'bio_42', title: 'Döngüler ve Kirlilik Checkpoint', day: 22, isCheckpoint: true },
  ],

  geometri: [
    { id: 'geo_01', title: 'Temel Kavramlar 1 | 1. Gün - 1. Video', day: 1 },
    { id: 'geo_02', title: 'Temel Kavramlar 2 | 1. Gün - 2. Video', day: 1 },
    { id: 'geo_03', title: 'Üçgende Açı 1 | 2. Gün', day: 2 },
    { id: 'geo_04', title: 'Üçgende Açı 2 | 2. Gün - 2. Video', day: 2 },
    { id: 'geo_05', title: 'Üçgende Açı 3 | 2. Gün - 3. Video', day: 2 },
    { id: 'geo_06', title: 'Ek Çizimler 1 | 3. Gün', day: 3 },
    { id: 'geo_07', title: 'Ek Çizimler 2 | 3. Gün - 2. Video', day: 3 },
    { id: 'geo_08', title: 'Ek Çizimler 3 | 3. Gün - 3. Video', day: 3 },
    { id: 'geo_09', title: 'Dik Üçgen 1 | 4. Gün', day: 4 },
    { id: 'geo_10', title: 'Dik Üçgen 2 | 4. Gün - 2. Video', day: 4 },
    { id: 'geo_11', title: 'Dik Üçgen 3 | 5. Gün', day: 5 },
    { id: 'geo_12', title: 'Dik Üçgen 4 | 5. Gün - 2. Video', day: 5 },
    { id: 'geo_13', title: 'İkizkenar Üçgen 1 | 6. Gün', day: 6 },
    { id: 'geo_14', title: 'İkizkenar Üçgen 2 | 6. Gün - 2. Video', day: 6 },
    { id: 'geo_15', title: 'Eşkenar Üçgen 1 | 7. Gün', day: 7 },
    { id: 'geo_16', title: 'Eşkenar Üçgen 2 | 7. Gün - 2. Video', day: 7 },
    { id: 'geo_17', title: 'Üçgende Eşlik 1 | 10. Gün', day: 8 },
    { id: 'geo_18', title: 'Üçgende Eşlik 2 | 10. Gün - 2. Video', day: 8 },
    { id: 'geo_19', title: 'Üçgende Alan 1 | 13. Gün', day: 9 },
    { id: 'geo_20', title: 'Üçgende Alan 2 | 13. Gün - 2. Video', day: 9 },
    { id: 'geo_21', title: 'Üçgende Alan 3 | 14. Gün', day: 10 },
    { id: 'geo_22', title: 'Üçgende Alan 4 | 14. Gün - 2. Video', day: 10 },
    { id: 'geo_23', title: 'Üçgende Merkezler | 16. Gün', day: 11 },
  ],
};

// Çalışma programı - her gün hangi derslerden ne yapılacak
// PDF'e göre düzenlenmiş, 2 günde bir TYT Türkçe denemesi var
const STUDY_PLAN = generateStudyPlan();

function generateStudyPlan() {
  const plan = {};

  // Program 1 Temmuz 2026 Çarşamba başlıyor.
  // Gün 1=Çar, 2=Per, 3=Cum, 4=Cmt, 5=Paz, 6=Pzt, 7=Sal, 8=Çar, 9=Per, 10=Cum...
  // 10. günden itibaren her Cuma OFF günü: 10,17,24,31,38,45,52,59,66
  const OFF_DAYS = new Set();
  for (let d = 10; d <= 70; d += 7) OFF_DAYS.add(d);

  const matByDay = groupByDay(SUBJECTS.matematik);
  const fizByDay = groupByDay(SUBJECTS.fizik);
  const kimByDay = groupByDay(SUBJECTS.kimya);
  const bioByDay = groupByDay(SUBJECTS.biyoloji);
  const geoByDay = groupByDay(SUBJECTS.geometri);

  for (let planDay = 1; planDay <= 70; planDay++) {
    const tasks = [];

    // ── OFF GÜNÜ: Her Cuma (10. günden itibaren) ──
    if (OFF_DAYS.has(planDay)) {
      tasks.push({ type: 'genel_deneme', id: `genel_deneme_${planDay}`, title: 'TYT Genel Deneme', subject: 'genel_deneme' });
      tasks.push({ type: 'analiz',       id: `soru_analiz_${planDay}`,  title: 'Soru Analizi & Yanlış İnceleme', subject: 'genel_deneme' });
      plan[planDay] = tasks;
      continue;
    }

    // ── NORMAL GÜN ──

    // Her 2 günde bir TYT Türkçe Denemesi (OFF günü değilse)
    if (planDay % 2 === 0) {
      tasks.push({ type: 'deneme', id: `deneme_${planDay}`, title: 'TYT Türkçe Denemesi', subject: 'deneme' });
    }

    if (matByDay[planDay]) {
      matByDay[planDay].forEach(t => tasks.push({ ...t, type: 'video', subject: 'matematik' }));
    }
    if (planDay <= 55 && fizByDay[planDay]) {
      fizByDay[planDay].forEach(t => tasks.push({ ...t, type: 'video', subject: 'fizik' }));
    }
    if (planDay <= 24 && kimByDay[planDay]) {
      kimByDay[planDay].forEach(t => tasks.push({ ...t, type: 'video', subject: 'kimya' }));
    }
    if (planDay <= 22 && bioByDay[planDay]) {
      bioByDay[planDay].forEach(t => tasks.push({ ...t, type: 'video', subject: 'biyoloji' }));
    }
    if (planDay <= 11 && geoByDay[planDay]) {
      geoByDay[planDay].forEach(t => tasks.push({ ...t, type: 'video', subject: 'geometri' }));
    }

    plan[planDay] = tasks;
  }

  return plan;
}

function groupByDay(topics) {
  const byDay = {};
  topics.forEach(t => {
    if (!byDay[t.day]) byDay[t.day] = [];
    byDay[t.day].push(t);
  });
  return byDay;
}

// Başlangıç tarihi - Varsayılan: 1 Temmuz 2026
function getStartDate() {
  const saved = localStorage.getItem('tyt_start_date');
  if (saved) return new Date(saved);
  // Varsayılan: 1 Temmuz 2026
  const defaultStart = new Date('2026-07-01');
  defaultStart.setHours(0, 0, 0, 0);
  return defaultStart;
}

function setStartDate(date) {
  localStorage.setItem('tyt_start_date', date.toISOString());
}

// Bugünün plan günü (1-tabanlı)
function getTodayPlanDay() {
  const start = getStartDate();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.floor((today - start) / (1000 * 60 * 60 * 24));
  return Math.max(1, diff + 1);
}
