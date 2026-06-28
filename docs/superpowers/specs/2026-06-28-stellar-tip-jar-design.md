# Stellar Tip Jar (Bahşiş Kutusu) - Tasarım Belgesi

**Tarih:** 2026-06-28  
**Proje Adı:** Stellar Tip Jar & QR Generator  
**Teknoloji Yığını:** React, Vite, Tailwind CSS v4, `@stellar/stellar-sdk`, `@stellar/freighter-api`

---

## 1. Amaç & Kapsam
Bu proje, Stellar White Belt (Level 1) gereksinimlerini karşılayan ve Stellar Testnet üzerinde Freighter cüzdanı aracılığıyla bahşiş (XLM) gönderimini sağlayan modern, premium arayüzlü bir dApp uygulamasıdır. Kullanıcılar kendi cüzdan adreslerini paylaşıp bahşiş toplayabilir veya başkalarının adreslerine anında bahşiş gönderebilirler.

---

## 2. Gereksinimler & Özellikler

### Olmazsa Olmazlar (Must-Haves)
1. **Cüzdan Bağlantısı:** Freighter cüzdanı ile bağlanma ve cüzdanı ayırma (Disconnect) butonları.
2. **Bakiye Sorgulama:** Horizon Testnet API'si kullanılarak bağlı cüzdanın güncel XLM bakiyesini görüntüleme.
3. **Bahşiş Gönderme Formu:** Alıcı adresi ve XLM miktarı girilebilen, Freighter cüzdanı aracılığıyla Testnet üzerinde işlem başlatan form.
4. **İşlem Durumu (Feedback):** Yüklenme ekranı, başarılı işlemlerde Tx Hash/StellarExpert linki ve hata durumlarında detaylı hata mesajı gösterimi.
5. **Dinamik Alıcı Adresi:** URL parametresinde `?addr=stellar_adresi` varsa alıcı alanının otomatik olarak doldurulması ve kilitlenmesi.

### Premium Özellikler (Nice-to-Haves)
1. **Dinamik Avatar:** Alıcı adresine göre Robohash API ile otomatik oluşturulan eşsiz profil robot avatarları.
2. **Hızlı Bahşiş Seçenekleri:** 5 XLM, 10 XLM ve 20 XLM için hızlı seçim butonları.
3. **QR Kod:** Alıcı adresi için otomatik oluşturulan ve taranabilen QR kod gösterimi.
4. **Konfeti Animasyonu:** Başarılı transfer sonrasında `canvas-confetti` kütüphanesiyle görsel kutlama.
5. **Testnet Faucet Entegrasyonu:** Bakiyesi 0 olan bağlı cüzdanlar için tek tıkla testnet XLM talep etme (Friendbot).
6. **Modern Koyu Tema & Cam Efekti (Glassmorphism):** Tailwind v4 kullanılarak hazırlanan neon cam efektli karanlık mod tasarımı.

---

## 3. Teknik Mimari & Veri Akışı

### Bileşen Hiyerarşisi
* `App.jsx`: State yönetimi (bağlı cüzdan adresi, bakiye, alıcı adresi, işlem durumu, yüklenme durumu).
  * `Navbar.jsx`: Logo, Freighter bağlantı butonu ve XLM bakiye göstergesi.
  * `TipCard.jsx`: Bahşiş formu, avatar göstergesi, QR kod bileşeni ve hızlı miktar butonları.
  * `StatusModal.jsx`: Yüklenme animasyonu, başarı tebrik kartı (konfeti) ve hata mesajı penceresi.
  * `FaucetTrigger.jsx`: Bakiye sıfırken çıkan Friendbot tetikleyici buton.

### Stellar İşlem Akışı
1. Kullanıcı Freighter ile bağlanır -> `window.stellarPubkey` elde edilir.
2. Horizon sunucusundan (`https://horizon-testnet.stellar.org`) hesap detayları çekilir -> Bakiye state'i güncellenir.
3. Bahşiş formu doldurulup gönderildiğinde:
   * Alıcı adresi ve miktar doğrulanır.
   * `StellarSdk.TransactionBuilder` ile işlem nesnesi hazırlanır.
   * Freighter API'den `signTransaction` ile işlem imzalanır.
   * İmzalı işlem Horizon'a gönderilir (`submitTransaction`).
   * İşlem sonucu `StatusModal` bileşenine iletilir ve bakiye yeniden çekilir.

---

## 4. Doğrulama Planı

### Otomatik Test & Yapay Zeka Testleri
* Tarayıcı simülasyonları ile Freighter cüzdan bağlantısının tetiklendiği doğrulanacak.
* Gerekli girdi alanlarının boş veya hatalı formatta (geçersiz Stellar adresi vb.) gönderilmesi engellenecek.

### Manuel Test Senaryoları
1. `?addr=` parametresi olmadan ana sayfaya girildiğinde manuel adres giriş alanının aktif olduğunu doğrulama.
2. `?addr=GC...` parametresi ile girildiğinde alıcı adresinin kilitli geldiğini ve avatarın yüklendiğini doğrulama.
3. Cüzdan bağlama sonrası Freighter cüzdanındaki bakiye ile ekrandaki bakiyenin eşleştiğini kontrol etme.
4. Yetersiz bakiye durumunda işlemin başlatılmayıp hata mesajı verdiğini doğrulama.
5. Başarılı testnet transferi sonrasında konfeti patladığını ve StellarExpert bağlantısının doğru çalıştığını teyit etme.
