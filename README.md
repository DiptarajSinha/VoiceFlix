# 🎙️ VoiceFlix

**VoiceFlix** is a high-performance, voice-activated web interface inspired by Netflix. Control your entire cinematic browsing experience using only your voice—no clicking required.

![Interface Preview](https://img.shields.io/badge/UI-Netflix--Inspired-E50914?style=for-the-badge)
![Tech](https://img.shields.io/badge/Tech-Web_Speech_API-white?style=for-the-badge)
![Deployment](https://img.shields.io/badge/Deployed-Vercel-black?style=for-the-badge)

---

## 🚀 Features

- **Context-Aware Voice Commands**: The system understands where you are. Commands like "Select Movie 1" only work when results are visible.
- **Dynamic Search**: Integrated with the **TMDB API** to pull real-time movie data.
- **Voice Feedback**: The UI talks back to you, confirming searches and selections.
- **Responsive "Stalker" Theme**: A dark, premium aesthetic optimized for Desktop, Tablet, and Mobile.
- **Hands-Free Navigation**: Scroll up, scroll down, search, and close modals using voice triggers.

## 🛠️ Tech Stack

- **Frontend:** HTML5, CSS3 (Modern Grid/Flexbox)
- **Logic:** Vanilla JavaScript (ES6+)
- **APIs:** - Web Speech API (Recognition & Synthesis)
  - The Movie Database (TMDB) API
- **Deployment:** Vercel

## 🎤 How to Use

1. **Initialize**: Click anywhere on the screen to grant microphone permissions.
2. **Search**: Say *"Search for Interstellar"* or *"Find Action movies"*.
3. **Navigate**: Say *"Scroll Down"* or *"Scroll Up"*.
4. **Select**: Once results appear, say *"Select Movie Number 3"*.
5. **Exit**: Say *"Close"* or *"Go Home"* to reset.

## 📱 Mobile Fix (v2.0)
The latest update resolves the "Google is recording" conflict on mobile devices by synchronizing the visualizer pulse with the Speech Recognition state, ensuring 100% compatibility across Chrome for Android and iOS Safari.

---

## 👨‍💻 Author

**Diptaraj Sinha** GitHub: [@DiptarajSinha](https://github.com/DiptarajSinha)

---
*Disclaimer: This project is a portfolio piece and is not affiliated with Netflix.*