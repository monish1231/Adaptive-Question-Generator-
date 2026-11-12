# ⚡ Adaptive Question Generator (AQG Studio)

A modern, responsive, production-ready **AI Education & Adaptive Question Generation System** built with **React 18, TypeScript, Material UI (MUI v5)** and an integrated **Node.js / Express REST API backend**.

---

## 🌟 Key Features

### 1. 🎨 Modern Glassmorphism UI & Design System
* **Bespoke Theme**: Deep obsidian space palette (`#0B0F19`) in dark mode and clean porcelain slate in light mode with electric indigo (`#6366F1`) and violet (`#8B5CF6`) gradients.
* **Micro-interactions**: Framer Motion animated card transitions, pulse loading rings, and smooth hover effects.
* **Fully Responsive**: Mobile sliding drawer, tablet collapsed icon navigation, and expanded desktop sidebar.

### 2. 🤖 AI Question Generator Studio
* **Curated Topics + Custom Tags**: Choose from popular domains (*Python, React, TypeScript, GenAI, Machine Learning, DSA, SQL, Docker, System Design*) or type any custom skill (*GraphQL, Kubernetes, FastAPI*) and press Enter.
* **Multi-Format Synthesis**: Multiple Choice (MCQ), True/False, and Fill in the Blank with syntax-highlighted code snippets.
* **Cognitive Focus Modes**: Select between Core Concepts, Code Analysis, Debugging, or Real-world Scenarios.
* **Export Toolkit**: Instant "Copy All" and one-click Markdown / JSON download.

### 3. 🎯 Adaptive Quiz Arena
* **Dynamic Cognitive Leveling**: Real-time algorithm shifts difficulty (*Easy 🟢 ↔ Medium 🟡 ↔ Hard 🔴 ↔ Master ⚡*) based on response correctness.
* **Timed Challenge**: 30-second circular countdown timer with color warning thresholds.
* **Diagnostic Report**: End-of-quiz scorecard, velocity metrics, question-by-question breakdown, and **"Bookmark All Missed"** button.

### 4. 🔖 Saved Questions & Interactive Flashcards
* **Flashcard Study Mode**: 3D flip card practice mode to test active recall.
* **Study Deck Export**: Export bookmarked questions as structured Markdown notes or JSON datasets.
* **Search & Topic Filtering**: Quickly find saved questions by domain or difficulty.

### 5. 📊 Real-Time Analytics Dashboard
* **Velocity Area Chart**: Visualizing questions generated vs quiz sessions.
* **Difficulty Distribution Donut**: Calibration across skill tiers.
* **Topic Mastery Bars**: Quantifying strengths across technologies.
* **Activity Timeline**: Chronological log of recent quiz benchmarks and generations.

### 6. 🚀 Full-Stack REST Backend & Persistence
* **Express REST API** running on `http://localhost:5000/api`.
* **Persistent File Database** (`server/data/db.json`) keeping history, saved bookmarks, quiz sessions, and user streaks across restarts.
* **Embedded Vite Dev Middleware**: In development, Vite automatically serves all `/api` endpoints so the entire app works seamlessly with a single `npm run dev` command!

---

## 🛠️ Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Launch Development Environment

#### Option A: Start Frontend with Embedded API (Recommended)
```bash
npm run dev
```
* Access the app at: `http://localhost:5173`
* All `/api` routes (generate, quiz, saved, history, stats) are handled seamlessly in-process!

#### Option B: Start Full-Stack with Standalone Express Server
Terminal 1 (Backend REST Server):
```bash
npm run server
```
*(Starts Express API on `http://localhost:5000`)*

Terminal 2 (Vite Frontend):
```bash
npm run dev
```

---

## 🧭 Project Structure

```
├── server/
│   ├── server.js              # Express REST API (Auth, Generate, Quiz, Stats, Saved, History)
│   ├── db.js                  # Persistent database engine
│   └── data/
│       └── db.json            # Persistent JSON database
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppLayout.tsx  # Responsive layout wrapper
│   │   │   ├── Sidebar.tsx    # Navigation with saved badge & active indicators
│   │   │   └── TopNavbar.tsx  # API status pill, streak counter, theme switcher
│   │   └── ui/
│   │       ├── QuestionCard.tsx   # Card with code snippets, copy & save
│   │       ├── LoadingOverlay.tsx # AI generation animation
│   │       └── StatsCard.tsx      # Dashboard metric card
│   ├── context/
│   │   ├── AppContext.tsx     # Session & theme persistence
│   │   └── QuestionContext.tsx # Central question store with API synchronization
│   ├── pages/
│   │   ├── DashboardPage.tsx  # Analytics, charts, metrics, quick start
│   │   ├── GeneratePage.tsx   # Question generation studio
│   │   ├── AdaptiveQuizPage.tsx # Dynamic difficulty quiz arena
│   │   ├── HistoryPage.tsx    # Past sessions & export
│   │   ├── SavedPage.tsx      # Bookmarked questions & flashcard mode
│   │   └── LoginPage.tsx      # One-click demo profiles & login
│   ├── services/
│   │   └── api.ts             # Typed REST API client with fallbacks
│   ├── data/
│   │   ├── mockQuestions.ts   # Catalog of initial seed questions
│   │   └── mockStats.ts       # Fallback statistics
│   ├── theme.ts               # Custom MUI theme (Dark & Light modes)
│   ├── types/index.ts         # TypeScript interfaces
│   ├── App.tsx                # Client-side router configuration
│   └── main.tsx               # App entrypoint
├── vite.config.ts             # Vite configuration with embedded dev API middleware
└── package.json
```

---

## 🔑 Demo Credentials

Click any of the quick-login chips on the login screen or enter:

| Profile | Email | Role |
| :--- | :--- | :--- |
| **Student** | `alex.rivera@edu.ai` | Senior Learner |
| **Full-Stack Engineer** | `sarah.dev@tech.io` | Software Engineer |
| **Educator** | `dr.marcus@mit.edu` | Faculty / Instructor |
*(Password: Any string, e.g. `password123`)*
