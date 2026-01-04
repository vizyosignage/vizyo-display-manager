# Vizyo Digital Signage

**Vizyo Digital Signage**, **açık kaynak**, **platformdan bağımsız** bir **dijital signage içerik yönetim sistemi (CMS)**’dir.
Tek ekranlı self servis kullanımdan, yerel ağ üzerinde çalışan ekran gruplarına ve internet üzerinden yönetilen büyük ölçekli yapılara kadar esnek bir mimari sunar.

Sistem;

* **Eklenti (plugin) tabanlı yapı**
* **Avalonia AXAML + C# Script** ile genişletilebilirlik
* **ABP Framework** tabanlı web CMS
* **Platforma göre ayrılmış CMS / Client çalışma modeli**

özelliklerine sahiptir.

---

## 🚀 Genel Bakış

Vizyo, kullanım senaryosuna göre **CMS ve Client uygulamalarını birlikte veya ayrı** çalıştırabilen bir yapıdadır.

### Desteklenen Çalışma Modları

* **Standalone (Self Servis)**
* **Yerel Ağ (Lokal Network)**
* **Merkezi / Hosting (Bulut veya Sunucu)**

---

## 🖥️ Çalışma Modları ve Platform Davranışı

### 🧩 Standalone (Self Servis Mod)

* **CMS ve Client uygulaması aynı cihazda birlikte çalışır**
* Her ekran kendi içeriğini kendisi yönetir
* Sunucu ve internet gerekmez
* **Sadece Windows ve Linux desktop sürümlerinde desteklenir**

📌 Kullanım alanları:

* Kiosk sistemleri
* Tek ekranlı mağaza / ofis ekranları

---

### 🔗 Yerel Ağ (Lokal Network Modu)

* Aynı ağdaki ekranlardan biri:

  * **CMS + Client** olarak çalışır (yerel sunucu)
* Diğer ekranlar:

  * **Sadece Client** olarak bağlanır
* İnternet bağlantısı gerekmez
* **CMS barındıran cihazlar yalnızca Windows ve Linux desktop** olabilir

📌 Kullanım alanları:

* Okullar
* Ofisler
* Bina içi çoklu ekran sistemleri

---

### 🌐 Merkezi / Hosting Modu

* CMS:

  * **Sunucu veya hosting ortamında**
  * **ABP Framework tabanlı Web CMS**
* Client uygulamalar:

  * İnternet üzerinden CMS’e bağlanır
* Farklı lokasyonlardaki ekranlar merkezi olarak yönetilir

📌 Kullanım alanları:

* Kurumsal yapılar
* Zincir mağazalar
* Çok lokasyonlu ekran ağları

---

## 📱 Platform Desteği

### 🖥️ Windows & Linux (Desktop)

* CMS + Client **aynı cihazda birlikte çalışabilir**
* Self servis ve lokal network modları desteklenir
* Eklenti geliştirme ve CMS yönetimi yapılabilir

### 🤖 Android

* **Sadece Client uygulaması çalışır**
* CMS barındırılmaz
* İçerik yönetimi:

  * Yerel ağdaki bir CMS üzerinden
  * veya merkezi (hosting) CMS üzerinden yapılır
* Hafif, stabil ve ekran odaklı kullanım için tasarlanmıştır

---

## 🧩 Eklenti (Plugin) Tabanlı Mimari

* Kullanıcılar kendi eklentilerini geliştirebilir
* Eklenti teknolojileri:

  * **Avalonia UI (AXAML)** → Arayüz
  * **C# Script** → İş mantığı
* Eklentiler ile:

  * Özel widget’lar
  * Dinamik veri ekranları
  * Etkileşimli içerikler
    oluşturulabilir
* Çekirdek sistem değiştirilmeden genişletilebilir

---

## 🌐 Web Tabanlı CMS (ABP Framework)

Vizyo Web CMS, **ABP Framework** kullanılarak geliştirilmiştir.

### ABP’nin Vizyo’ya Sağladığı Avantajlar

* Modüler mimari
* Multi-Tenancy (çok kiracılı yapı)
* Rol ve yetkilendirme sistemi
* Güvenli kimlik doğrulama (JWT, OAuth2, OpenID Connect)
* RESTful API altyapısı
* Hazır yönetim panelleri
* Çok dilli destek
* Veritabanı bağımsızlığı

---

## 🏗️ Özet Mimari Tablosu

| Mod           | CMS Nerede         | Client       | Desteklenen Platformlar                             |
| ------------- | ------------------ | ------------ | --------------------------------------------------- |
| Standalone    | Aynı cihaz         | Aynı cihaz   | Windows, Linux                                      |
| Lokal Network | Yerel ağda 1 cihaz | Tüm ekranlar | CMS: Windows/Linux<br>Client: Windows/Linux/Android |
| Hosting       | Sunucu / Cloud     | Tüm ekranlar | Client: Windows/Linux/Android                       |

---

## 📦 Kurulum (Planlanıyor)

```bash
git clone https://github.com/kullanici-adi/vizyo-digital-signage.git
cd vizyo-digital-signage
```

Kurulum ve dağıtım dokümantasyonu eklenecektir.

---

## 🛣️ Yol Haritası

* [ ] Desktop CMS + Client entegrasyonu
* [ ] Android Client optimizasyonu
* [ ] ABP Web CMS
* [ ] İçerik planlama
* [ ] Medya yönetimi
* [ ] Eklenti SDK
* [ ] Uzaktan izleme

---

## 📄 Lisans

Bu proje açık kaynaklıdır.
Lisans bilgisi eklenecektir.

---

**Vizyo Digital Signage**
*Merkezi • Yerel • Self Servis • Platforma Duyarlı*
