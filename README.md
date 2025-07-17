# 🎧 Echoify

> _Yet Another YouTube Music Client. But like... better._

[![GitHub License](https://img.shields.io/github/license/ronitkrshah/echoify)](https://github.com/ronitkrshah/echoify)

Echoify is a **free**, **open-source**, and **tracker-free** YouTube Music client for Android. Think of it as the YT Music app, minus the ads, spying, and general bloatware vibes. Built with React Native and powered by good vibes and TypeScript errors.

---

## ⚡ TL;DR

If you:

- hate ads,
- don’t trust Google,
- have taste,
- and want a Material You-themed music player that doesn’t want your soul...

**Echoify** is for you.

---

## 🔥 Features That Slap™

- 🎨 **Material You Everything** – Echoify syncs with your Android wallpaper like it read your mind
- 🚫 **Ad-Free Playback** – Play music without a pharma ad between tracks
- 🔍 **Search Like a Pro** – Type. Hit enter. Boom. Song.
- 🧙 **Playlist Sorcery** – Create, edit, rename, vibe
- 📂 **Offline Playback** – Play your local files like it’s 2009
- 🕵️‍♂️ **No Google Login, No Trackers** – Not even a cookie crumb

---

## 📦 APK Releases

Because not everyone wants to clone repos and build like it’s a CS assignment:  
👉 [**Download the latest release**](https://github.com/ronitkrshah/echoify/releases)

---

## 📸 Screenshots

> It's Riyal

<p float="left">
  <img src="https://github.com/user-attachments/assets/490f2d0b-8f8f-4cd0-970f-4b1fd85aeb0c" width="240"/>
  <img src="https://github.com/user-attachments/assets/b73526a9-f77c-4089-ab1a-28f340153984" width="240"/>
  <img src="https://github.com/user-attachments/assets/0b912e24-90a1-4d32-ba1f-bf98b6b456ea" width="240"/>
  <img src="https://github.com/user-attachments/assets/b9def23c-bb52-47d0-b546-b5711f82ddcd" width="240"/>
  <img src="https://github.com/user-attachments/assets/a15e0dbb-c6ca-4974-8416-0f4b5d4dc61c" width="240"/>
</p>

---

## ❓ FAQ

**Q: Why is there a streaming delay or buffering?**  
**A:** Chill. Just enable *Gawd Mode* from the app settings — it’ll take about a minute, but after that, buttery smooth playback.


## 🧪 Dev Notes (a.k.a Pain Log)

Built with:

- ⚛️ React Native (the good, the bad, the bridge modules)
- 🟦 TypeScript (we fought the types and the types won)
- 🎵 YouTube Music backend wrappers (don’t ask)
- 📁 Local file support (because you _do_ have those old MP3s)

Contributions, PRs, stars, and good memes are welcome. Nubs welcome. Gawds too.

---

## 🏗️ Monorepo Structure

Echoify is built as a monorepo with both frontend and backend living under one cozy roof:

```
echoify/
├── app/ # React Native Android app
└── backend/ # Node.js backend (magic sauce)
```

## 👾 Nerd Zone

Want to run it yourself?

```bash

git clone https://github.com/ronitkrshah/echoify && cd echoify

# Backend
cd backend
yarn
node src/main.js

# Application
cd app
yarn
# -- Edit .env.development file and Backend URL before running your app
npx expo run:android
```
