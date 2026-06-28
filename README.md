# Stellar Tip Jar & QR Generator

Bu proje, **Stellar White Belt (Level 1)** gereksinimlerini karşılayan, Freighter cüzdanı entegrasyonuna sahip, Stellar Testnet üzerinde çalışan premium tasarımlı bir bahşiş (tip) dApp uygulamasıdır.

## 🚀 Proje Özellikleri
- **Cüzdan Bağlantısı (Wallet Connection):** Freighter cüzdanı ile hızlı bağlantı kurma ve cüzdan bağlantısını kesme (Disconnect) özelliği.
- **Bakiye Sorgulama (Balance Handling):** Horizon API ile bağlı cüzdanın güncel XLM bakiyesini gerçek zamanlı sorgulama ve ekranda gösterme.
- **Bahşiş Gönderme Sistemi (Transaction Flow):** Testnet üzerinde alıcı adresine anlık XLM transferi gerçekleştirme ve imzalanması için Freighter cüzdanını tetikleme.
- **URL Parametre Desteği:** `?addr=<stellar_adresi>` biçimiyle alıcı adresini kilitleyip kişiselleştirilmiş bahşiş sayfası paylaşabilme.
- **Dinamik Avatar:** Robohash ile cüzdan adresine özel benzersiz ve sevimli robot profil resimleri.
- **QR Kod Oluşturucu:** Alıcı cüzdan adresini mobil tarayıcılar ve cüzdanlar için QR kod formatında otomatik sunma.
- **Friendbot (Testnet Faucet):** Bakiyesi 0 olan bağlı hesaplar için tek tıkla testnet XLM talep edebilme.

---

## 📸 Ekran Görüntüleri (Screenshots)

### 1. Cüzdan Bağlantı ve Bakiye Gösterim Durumu (Wallet Connected & Balance Displayed)
Cüzdan Freighter üzerinden bağlandığında, sağ üst köşede cüzdan adresi ve güncel XLM bakiyesi dinamik olarak görüntülenir. Alıcı cüzdanı için Robohash avatarı ve QR kod otomatik oluşturulur.

![Cüzdan Bağlantı ve Bakiye](assets/landing.png)

### 2. Başarılı İşlem ve Sonuç Bildirimi (Successful Transaction & Result Displayed)
Bahşiş başarıyla gönderildiğinde arayüzde bir tebrik animasyonu (konfeti) tetiklenir ve işlem sonucunu/özetini gösteren makbuz ekranı (Status Modal) açılır. StellarExpert bağlantısı ile işlem doğrulanabilir.

![Başarılı İşlem Bildirimi](assets/success.png)

---

## 🛠️ Yerel Kurulum & Çalıştırma (Setup Instructions)

Projeyi yerel bilgisayarınızda çalıştırmak için aşağıdaki adımları sırasıyla uygulayın:

### Gereksinimler
- Node.js (v18+) ve npm yüklü olmalıdır.
- Tarayıcınızda [Freighter Wallet](https://www.freighter.app/) uzantısı kurulu ve **Testnet** ağına ayarlanmış olmalıdır.

### Adımlar

1. Bu depoyu klonlayın ve proje dizinine girin:
   ```bash
   git clone <depo-adresi>
   cd steller_white_belt
   ```

2. Gerekli tüm bağımlılıkları yükleyin:
   ```bash
   npm install
   ```

3. Yerel geliştirici sunucusunu (Vite) başlatın:
   ```bash
   npm run dev
   ```

4. Tarayıcınızdan `http://localhost:5173` adresine gidin.

### Kişisel Bahşiş Sayfanızı Test Etme
Uygulamayı kendi cüzdan adresiniz için açmak isterseniz tarayıcıdaki URL'in sonuna adresinizi parametre olarak ekleyin:
`http://localhost:5173/?addr=GYOURSTELLARTESNETADDRESSHERE`