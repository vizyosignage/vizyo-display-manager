# Vizyo Digital Signage

**Vizyo Digital Signage**, **açık kaynak**, **platformdan bağımsız** bir **dijital signage içerik yönetim sistemi (CMS)**’dir.
Tek ekranlı self servis kullanımlardan, yerel ağ üzerindeki ekran gruplarına ve internet üzerinden merkezi olarak yönetilen büyük ölçekli yapılara kadar esnek bir şekilde çalışacak biçimde tasarlanmıştır.

Sistem şu özelliklere sahiptir:

* **Eklenti (plugin) tabanlı mimari**
* **Avalonia AXAML + C# Script** ile genişletilebilirlik
* **ABP Framework** ile geliştirilmiş **web tabanlı CMS**
* **Platforma duyarlı CMS / Client çalışma modeli**

---

## 🚀 Genel Bakış

Vizyo, kullanım senaryosuna bağlı olarak **CMS ve Client uygulamalarının birlikte veya ayrı** çalışabildiği **modüler ve ölçeklenebilir** bir mimari sunar.

### Desteklenen Çalışma Modları

* **Standalone (Self Servis)**
* **Yerel Ağ**
* **Merkezi / Hosting (Bulut veya Sunucu Tabanlı)**

---

## 🖥️ Çalışma Modları ve Platform Davranışı

### 🧩 Standalone (Self Servis Mod)

* **CMS ve Client uygulamaları aynı cihazda birlikte çalışır**
* Her ekran kendi içeriğini kendisi yönetir
* Sunucu veya internet bağlantısı gerekmez
* **Yalnızca Windows ve Linux masaüstü platformlarında desteklenir**

📌 Kullanım alanları:

* Kiosk sistemleri
* Tek ekranlı mağaza veya ofis ekranları

---

### 🔗 Yerel Ağ Modu

* Yerel ağdaki bir cihaz:

  * **CMS + Client** olarak çalışır (yerel sunucu)
* Diğer ekranlar:

  * **Sadece Client** olarak bağlanır
* İnternet bağlantısı gerekmez
* **CMS barındıran cihazların Windows veya Linux masaüstü çalıştırması gerekir**

📌 Kullanım alanları:

* Okullar
* Ofisler
* Tek lokasyon içindeki çok ekranlı kurulumlar

---

### 🌐 Merkezi / Hosting Modu

* CMS şu ortamlarda çalışır:

  * **Bir sunucu veya hosting ortamı**
  * **ABP Framework tabanlı Web CMS**
* Client uygulamaları CMS’e internet üzerinden bağlanır
* Ekranlar birden fazla lokasyondan yönetilebilir

📌 Kullanım alanları:

* Kurumsal dağıtımlar
* Zincir mağazalar
* Çok lokasyonlu signage ağları

---

## 📱 Platform Desteği

### 🖥️ Windows & Linux (Masaüstü)

* CMS ve Client **aynı cihazda birlikte çalışabilir**
* **Standalone** ve **Yerel Ağ** modları desteklenir
* Eklenti geliştirme ve CMS yönetimi yapılabilir

### 🤖 Android

* **Yalnızca Client uygulaması çalışır**
* Android üzerinde CMS çalışmaz
* İçerik yönetimi:

  * Yerel ağdaki bir CMS üzerinden veya
  * Merkezi (hosting) bir CMS üzerinden yapılır
* Hafif, stabil ve ekran odaklı kullanım için optimize edilmiştir

---

## 🧩 Eklenti (Plugin) Tabanlı Mimari

Vizyo, **tamamen genişletilebilir** olacak şekilde tasarlanmıştır.

* Kullanıcılar kendi eklentilerini geliştirebilir
* Eklenti teknolojileri:

  * **Avalonia UI (AXAML)** → Kullanıcı arayüzleri
  * **C# Script** → Mantık ve davranışlar
* Eklentiler ile:

  * Özel widget’lar
  * Dinamik, veri odaklı ekranlar
  * Etkileşimli signage bileşenleri
    geliştirilebilir
* Çekirdek sistem değiştirilmeden yeni işlevler eklenebilir

---

## 🌐 Web Tabanlı CMS (ABP Framework)

Vizyo Web CMS, **ABP Framework** kullanılarak geliştirilmiştir ve modern, kurumsal seviyede bir altyapı sunar.

### Neden ABP Framework?

ABP, **ASP.NET Core** için geliştirilmiş, **modern ve açık kaynak** bir uygulama framework’üdür. Yerleşik en iyi pratikler ve kurumsal seviye özellikler sunar.

### 🔑 Vizyo’da Kullanılan ABP Temel Özellikleri

* **Modüler Mimari**

  * Temiz sorumluluk ayrımı
  * Kolay genişletilebilirlik ve bakım

* **Multi-Tenancy (Çok Kiracılı Yapı)**

  * Tek CMS üzerinden birden fazla organizasyon veya müşteri yönetimi
  * SaaS ve büyük ölçekli dağıtımlar için idealdir

* **Rol ve Yetkilendirme Yönetimi**

  * İnce ayarlı erişim kontrolü
  * Yönetici, editör ve operatör gibi farklı roller

* **Kimlik Doğrulama ve Yetkilendirme**

  * JWT, OAuth2 ve OpenID Connect desteği
  * API’ler ve yönetim arayüzü için güvenli erişim

* **RESTful API Katmanı**

  * Yapılandırılmış backend API’leri
  * Client uygulamalarıyla sorunsuz iletişim

* **Hazır Yönetim Arayüzleri**

  * Kullanıma hazır yönetim panelleri
  * Hızlı geliştirme ve tutarlı kullanıcı deneyimi

* **Veritabanı Soyutlaması**

  * Birden fazla veritabanı sağlayıcısı desteği
  * Kolay geçiş ve ölçeklenebilirlik

* **Lokalizasyon**

  * Çok dilli destek
  * Global dağıtımlar için hazır altyapı

---

## 🏗️ Mimari Özeti

| Mod             | CMS Konumu           | Client       | Desteklenen Platformlar                             |
| --------------- | -------------------- | ------------ | --------------------------------------------------- |
| Standalone      | Aynı cihaz           | Aynı cihaz   | Windows, Linux                                      |
| Yerel Ağ        | Yerel ağda bir cihaz | Tüm ekranlar | CMS: Windows/Linux<br>Client: Windows/Linux/Android |
| Hosting / Bulut | Sunucu / Bulut       | Tüm ekranlar | Client: Windows/Linux/Android                       |

---

## 📦 Kurulum (Planlanıyor)

```bash
git clone https://github.com/vizyosignage/vizyo-display-manager.git
cd vizyo-display-manager
```

Kurulum ve dağıtım dokümantasyonu eklenecektir.

---

## 🛣️ Yol Haritası

* [ ] Masaüstü CMS + Client entegrasyonu
* [ ] Android Client optimizasyonu
* [ ] ABP tabanlı Web CMS
* [ ] İçerik zamanlama
* [ ] Medya yönetimi
* [ ] Eklenti SDK ve örnekler
* [ ] Uzaktan izleme

---

## 📄 Lisans

Bu proje açık kaynaklıdır.
Lisans bilgisi eklenecektir.

---

**Vizyo Digital Signage**
*Merkezi • Yerel • Self Servis • Platforma Duyarlı*
