# Mindful Tech - Smartphone Addiction Intervention

A mindfulness-based web application designed to help users regain control of their attention and reduce smartphone addiction. This project adapts **Mindfulness-Based Relapse Prevention (MBRP)** protocols into an interactive AI coaching experience.

## 🌟 Key Features

*   **Scientific Assessment**: Built-in **SAS-SV (Smartphone Addiction Scale: Short Version)** to evaluate risk levels.
*   **AI Mindfulness Coach**: Powered by **Google Gemini 2.5 Pro**, offering personalized guidance for:
    *   *Urge Surfing* (Managing cravings)
    *   *The Digital Raisin* (Breaking autopilot)
    *   *RAIN Protocol* (Dealing with FOMO)
*   **Structured Programs**: 5-Day, 3-Day, and 1-Day Intensive courses.
*   **Interactive Tools**:
    *   Local audio player for ambient mindfulness sounds.
    *   Session progress tracking.
    *   Screen time logging & visualization.
    *   Post-session reflection & transcript downloads.

## 🚀 Getting Started

Follow these steps to set up the project locally.

### 1. Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed (version 18+ recommended).

### 2. Installation

```bash
# Install dependencies
npm install
```

### 3. Configure Gemini API Key (Crucial!)

This app requires a Google Gemini API Key to function.

1.  **Get an API Key**:
    *   Go to [Google AI Studio](https://aistudio.google.com/).
    *   Click "Get API key" button.
    *   Create a key in a new project.

2.  **Set up Environment Variables**:
    *   Create a new file named `.env.local` in the root directory of this project.
    *   Add your API key(s) to the file. You can add multiple keys separated by commas for rotation (optional), or just one.

    ```env
    # .env.local
    GEMINI_API_KEYS="YOUR_API_KEY_HERE"
    ```

### 4. Audio Files Setup
Ensure you have the necessary audio files in `public/audio/`. The system expects:
- `rain.mp3`
- `waves.mp3`
- `forest.mp3`
- `stream.mp3`

*(Note: If these files are missing, the audio player will just stay silent without crashing.)*

### 5. Run the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🛠 Tech Stack

*   **Framework**: Next.js 15+ (App Router)
*   **Styling**: Tailwind CSS
*   **AI Model**: Google Gemini 2.5 Pro (via `generativelanguage` API)
*   **State Management**: React Hooks & LocalStorage

## 📄 License

This project is for educational and research purposes.
