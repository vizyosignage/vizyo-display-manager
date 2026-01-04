# Vizyo Digital Signage

**Vizyo Digital Signage** is an **open-source**, **cross-platform** **digital signage content management system (CMS)** designed to operate flexibly — from single self-service displays to local network screen groups and large-scale, centrally managed deployments over the internet.

The system features:

* A **plugin-based architecture**
* Extensibility using **Avalonia AXAML + C# Scripting**
* A **web-based CMS built with the ABP Framework**
* A **platform-aware CMS / Client execution model**

---

## 🚀 Overview

Vizyo provides a **modular and scalable architecture** where the **CMS and Client applications can run together or separately**, depending on the usage scenario.

### Supported Operation Modes

* **Standalone (Self-Service)**
* **Local Network**
* **Centralized / Hosting (Cloud or Server-Based)**

---

## 🖥️ Operation Modes & Platform Behavior

### 🧩 Standalone (Self-Service Mode)

* **CMS and Client applications run together on the same device**
* Each display manages its own content
* No server or internet connection required
* **Supported only on Windows and Linux desktop platforms**

📌 Use cases:

* Kiosk systems
* Single-screen retail or office displays

---

### 🔗 Local Network Mode

* One device on the local network runs as:

  * **CMS + Client** (local server)
* Other displays connect as:

  * **Client-only**
* No internet connection required
* **Devices hosting CMS must run Windows or Linux desktop**

📌 Use cases:

* Schools
* Offices
* Multi-screen installations within a single location

---

### 🌐 Centralized / Hosting Mode

* CMS runs on:

  * A **server or hosting environment**
  * **ABP Framework–based Web CMS**
* Client applications connect to the CMS over the internet
* Displays can be managed across multiple locations

📌 Use cases:

* Enterprise deployments
* Chain stores
* Multi-location signage networks

---

## 📱 Platform Support

### 🖥️ Windows & Linux (Desktop)

* CMS and Client can **run together on the same device**
* Supports **Standalone** and **Local Network** modes
* Plugin development and CMS management are available

### 🤖 Android

* **Client application only**
* No CMS runs on Android
* Content is managed via:

  * A CMS on the local network, or
  * A centralized (hosted) CMS
* Optimized for lightweight, stable, display-focused usage

---

## 🧩 Plugin-Based Architecture

Vizyo is designed to be **fully extensible**.

* Users can develop their own plugins
* Plugin technologies:

  * **Avalonia UI (AXAML)** for user interfaces
  * **C# Scripting** for logic and behavior
* Plugins can be used to build:

  * Custom widgets
  * Dynamic, data-driven displays
  * Interactive signage components
* The core system remains untouched while functionality is extended

---

## 🌐 Web-Based CMS (ABP Framework)

The Vizyo Web CMS is built using the **ABP Framework**, providing a modern and enterprise-ready foundation.

### Why ABP Framework?

ABP is a **modern, open-source application framework for ASP.NET Core**, offering built-in best practices and enterprise-grade features.

### 🔑 Key ABP Features Used in Vizyo

* **Modular Architecture**

  * Clean separation of concerns
  * Easy extensibility and maintainability

* **Multi-Tenancy**

  * Manage multiple organizations or customers from a single CMS
  * Ideal for SaaS and large-scale deployments

* **Role & Permission Management**

  * Fine-grained access control
  * Different roles for administrators, editors, and operators

* **Authentication & Authorization**

  * JWT, OAuth2, and OpenID Connect support
  * Secure access to APIs and management UI

* **RESTful API Layer**

  * Structured backend APIs
  * Seamless communication with client applications

* **Built-in Admin UI**

  * Ready-to-use management dashboards
  * Faster development and consistent UX

* **Database Abstraction**

  * Supports multiple database providers
  * Easy migration and scalability

* **Localization**

  * Multi-language support
  * Ready for global deployments

---

## 🏗️ Architecture Summary

| Mode            | CMS Location     | Client       | Supported Platforms                                 |
| --------------- | ---------------- | ------------ | --------------------------------------------------- |
| Standalone      | Same device      | Same device  | Windows, Linux                                      |
| Local Network   | One local device | All displays | CMS: Windows/Linux<br>Client: Windows/Linux/Android |
| Hosting / Cloud | Server / Cloud   | All displays | Client: Windows/Linux/Android                       |

---

## 📦 Installation (Planned)

```bash
git clone https://github.com/vizyosignage/vizyo-display-manager.git
cd vizyo-display-manager
```

Installation and deployment documentation will be added.

---

## 🛣️ Roadmap

* [ ] Desktop CMS + Client integration
* [ ] Android Client optimization
* [ ] ABP-based Web CMS
* [ ] Content scheduling
* [ ] Media management
* [ ] Plugin SDK & examples
* [ ] Remote monitoring

---

## 📄 License

This project is open-source.
License details will be added.

---

**Vizyo Digital Signage**
*Centralized • Local • Self-Service • Platform-Aware*
