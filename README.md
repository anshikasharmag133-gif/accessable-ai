# AccessAble AI – Understand Anything. Access Everything.

AccessAble AI is a full-stack, cognitive accessibility web platform built with React, TypeScript, Tailwind CSS, Express, and Google Gemini 3.8 Flash. It transforms complex paragraphs, academic jargon, and confusing instructions into clear, accessible prose, translates across 6 languages, reads text aloud with browser text-to-speech, and exports formatted offline PDFs.

---

## 🚀 Live Public HTTPS URLs (Open Directly in Google Chrome)

You can open and record the application directly in Google Chrome without the AI Studio sidebar or editor interface:

- **Shared App URL:**  
  [https://ais-pre-ilurv3jzpxfennbefxfmie-743974977610.asia-southeast1.run.app](https://ais-pre-ilurv3jzpxfennbefxfmie-743974977610.asia-southeast1.run.app)

- **Development App URL:**  
  [https://ais-dev-ilurv3jzpxfennbefxfmie-743974977610.asia-southeast1.run.app](https://ais-dev-ilurv3jzpxfennbefxfmie-743974977610.asia-southeast1.run.app)

> **For Screen Recording / Demo:**  
> Simply open either link in Google Chrome, press `F11` (or click Chrome's Fullscreen mode), and demo all features seamlessly.

---

## 💻 Running the App Standalone Locally (Windows / macOS / Linux)

### Prerequisites
- **Node.js** (v18.0.0 or higher recommended)
- **npm** (included with Node.js)
- A **Google Gemini API Key** (from [Google AI Studio](https://aistudio.google.com/))

### Step-by-Step Local Setup

1. **Open your Terminal or Command Prompt:**
   - On Windows: Press `Win + R`, type `cmd` or open `PowerShell`.
   - Navigate to the project directory:
     ```bash
     cd path/to/accessable-ai
     ```

2. **Install all dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   - Create a file named `.env` in the root folder:
     ```env
     GEMINI_API_KEY="your_actual_gemini_api_key_here"
     PORT=3000
     ```

4. **Start the local development server:**
   ```bash
   npm run dev
   ```

5. **Open in Google Chrome:**
   - Launch Google Chrome and navigate to:
     ```text
     http://localhost:3000
     ```

---

## 📦 Production Build & Testing

To test the compiled production build locally:

```bash
# 1. Build the frontend client
npm run build

# 2. Start the production server
npm start
```
The server will serve the optimized production assets from `dist` and handle the `/api/*` endpoints.

---

## 🌐 Deploying to Public Hosting Platforms

You can easily push this repository to GitHub and host it on any modern cloud platform.

### Option A: Deploy to Render (Recommended for Full-Stack)
1. Push your repository to **GitHub**.
2. Go to [render.com](https://render.com) and create a **New Web Service**.
3. Connect your GitHub repository.
4. Configure the service:
   - **Environment:** `Node`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
5. Under **Environment Variables**, add:
   - `GEMINI_API_KEY`: Your Google Gemini API key
6. Click **Deploy Web Service**. Render provides a free `https://your-app.onrender.com` URL.

### Option B: Deploy to Railway / Fly.io / Cloud Run
- Set the build command to `npm install && npm run build`.
- Set start command to `npm start`.
- Configure `GEMINI_API_KEY` as an environment variable in the dashboard.

---

## 🔒 Security & API Key Handling

- **Zero Client Exposure:** The `@google/genai` SDK is used exclusively inside `server.ts`.
- **Backend Proxy Endpoints:**
  - `POST /api/simplify`: Rewrites text across 3 comprehension levels.
  - `POST /api/translate`: Translates across 6 languages with native script preservation.
  - `POST /api/explain`: Produces a 3-part structured conceptual breakdown.
  - `GET /api/health`: Health status and configuration monitor.
- **Untrusted Input Guardrails:** System prompts enforce that user-provided text is treated purely as passive data to simplify, preventing prompt injections.

---

## ✨ Verified Features

1. **Text Simplifier:** 3 reading levels (*Simple*, *Very Simple*, *Student-Friendly*), character/word counter, one-click copy, and PDF export.
2. **Multilingual Translator:** English, Hindi, Punjabi, Spanish, French, and Bengali with native script and audio.
3. **Text-to-Speech (TTS) Studio:** Browser Web Speech API with real-time word-level highlighting, interactive Read-Along view, installed voice detection, BCP-47 language matching (Hindi, Punjabi, Spanish, etc.), 0.5x–2.0x reading speed slider, and 0.5x–1.5x voice pitch modulation slider.
4. **Explain It Simply:** 3-part plain-English breakdown (Simple Explanation, Key Points, Real-World Example, and Caution notice) with PDF export.
5. **Accessibility Suite:** 6 distinct typography options (Default System Sans, Arial, Verdana, Georgia, OpenDyslexic, Monospace) with live interactive previews, font scaling (Small to Extra Large), High Contrast mode, Light/Dark mode, Reduced Motion toggle, and localStorage persistence.
6. **Download as PDF:** Client-side offline PDF generation using `jsPDF` for both simplified texts and structured explanations.
