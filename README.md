# 🦋 Butterfly AR Explorer • Common Banded Peacock (*Papilio crino*)

[![WebXR](https://img.shields.io/badge/WebXR-Immersive%20AR-blue.svg)](https://immersiveweb.dev/)
[![model-viewer](https://img.shields.io/badge/%3Cmodel--viewer%3E-v3.5.0-success.svg)](https://modelviewer.dev/)
[![glTF 2.0](https://img.shields.io/badge/glTF-2.0%20PBR-orange.svg)](https://www.khronos.org/gltf/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A lightweight, zero-dependency **Web Augmented Reality** application showcasing the **Common Banded Peacock** (*Papilio crino*), an iconic swallowtail butterfly documented at the **Srirangam Tropical Butterfly Conservatory** in Tiruchirappalli (Trichy) and the Western Ghats sanctuaries.

Experience lifelike biological locomotion as the butterfly takes off from a flower, rises into the air along a 3D garden arc, flutters with authentic wing oscillations, and lands in your real-world space.

---

## ✨ Features

- **Photorealistic 3D Biological Model:**
  - High-detail anatomical sculpting: segmented thorax/abdomen, 6 articulated legs, clubbed antennae, and compound eyes.
  - 2048×2048 PBR textures with iridescent emerald-blue / cyan scale dusting on velvet-black wings.
  - Draco-free uncompressed glTF binary (`butterfly.glb`) for 100% compatibility with Google Scene Viewer and Apple Quick Look.
- **Natural Biological Locomotion:**
  - **🎬 Garden Flight (Point A → Point B):** An 8-second seamless looping trajectory where the butterfly takes off from the left perch (-14 cm), ascends +14 cm into the air, banks into turns, and settles onto the right flower (+14 cm).
  - **🦋 Perched Close-Up:** Stationary in-place wingbeat cycle for detailed anatomical inspection.
- **2-Layer Universal AR Architecture:**
  1. **Layer 1 (Native Floor Tracking AR):** WebXR on Android Chrome, Google Scene Viewer, and Apple Quick Look on iOS Safari.
  2. **Layer 2 (Universal Live Camera AR):** Instant webcam/camera overlay mode that runs on **any smartphone or laptop** without requiring ARCore surface scanning.
- **Completely Offline-Ready & Zero Dependencies:**
  - Bundled `<model-viewer>` and `qrcode.js` inside `assets/js/` — no external CDNs required.
  - Zero heavy software footprint (no Blender required).

---

## 🚀 Quickstart

### 1. Run Locally
```bash
npm start
```
Open [http://localhost:8080](http://localhost:8080) in your browser.

### 2. View on Mobile Phone in AR
WebXR requires a secure HTTPS context. Expose your local server via Cloudflare Tunnel:
```bash
npm run tunnel
```
Open the generated `https://*.trycloudflare.com` URL on your phone (or scan the QR code on your desktop screen)!

---

## 📤 How to Push to a New GitHub Repository

You can push this standalone project to a new repository on your GitHub account in 3 simple steps:

### Step 1: Open a terminal inside this directory
```bash
cd d:\tecplore\butterfly-ar
```

### Step 2: Initialize Git & Commit
```bash
git init
git add .
git commit -m "feat: initial commit for Common Banded Peacock Web AR Explorer"
```

### Step 3: Create GitHub Repo & Push
Create a new empty repository on [GitHub](https://github.com/new) named `butterfly-ar` (or `papilio-crino-ar`), then run:

```bash
git branch -M main
git remote add origin https://github.com/<YOUR-USERNAME>/butterfly-ar.git
git push -u origin main
```

*(Alternatively, if using the GitHub CLI `gh`)*:
```bash
gh repo create butterfly-ar --public --source=. --remote=origin --push
```

---

## 🌿 Species Background: *Papilio crino*

- **Common Name:** Common Banded Peacock
- **Scientific Name:** *Papilio crino* (Fabricius, 1793)
- **Family:** Papilionidae (Swallowtail Butterflies)
- **Habitat:** Tropical dry deciduous forests, scrub jungles, and botanical conservatories across Tiruchirappalli (Trichy), Western Ghats, and Eastern Ghats.
- **Larval Host Plant:** Satinwood tree (*Chloroxylon swietenia*).
- **Physical Characteristics:** Velvet-black wings with a brilliant metallic green/cyan band that reflects sunlight through microscopic wing scale diffraction.

---

## 🧪 Testing

Run the automated verification suite:
```bash
npm test
```

---

## 📄 License

MIT License — free for educational, research, and commercial applications.
