# Deadline Guardian AI

**Path A — Applied AI Product** · Intro to AI · Dr. Elena Nazarenko
**Team:** Tuguldur Bat-Erdene & Zina Belbel

## What it is

A web app (runs in any browser, mobile-responsive — not a native mobile app)
that turns messy assignment descriptions into structured tasks: title, due date,
priority, an AI-generated checklist, progress tracking, and start-time
recommendations. Claude is the reasoning engine, accessed via the Anthropic
Messages API.

## Tech stack

- **Frontend:** React + Vite
- **Backend:** Java + Spring Boot
- **AI:** Anthropic Claude API (`claude-sonnet-4-6`)

## Project layout
deadline-guardian/
├── backend/                  Spring Boot (port 8080)
│   ├── pom.xml
│   └── src/main/java/com/deadlineguardian/
│       ├── DeadlineGuardianApplication.java
│       ├── config/CorsConfig.java
│       ├── controller/       ChatController, TaskController
│       ├── service/          AnthropicService (Claude), TaskService (store)
│       ├── model/            Task, ChecklistItem, Priority
│       └── dto/              ChatRequest, ChatResponse, TaskCreationRequest, TaskAnalysisResponse
└── frontend/                 React + Vite (port 5173)
├── package.json
├── vite.config.js        proxies /api -> backend
├── index.html
└── src/
├── main.jsx, App.jsx, api.js, styles.css
├── components/        TopNav, TaskCard, PriorityBadge, ProgressBar,
│                      WarningBanner, Checklist, ChatInterface,
│                      ManualTaskForm, CalendarView
└── pages/             Dashboard, Chat, Calendar, TaskDetail
## Prerequisites

| Tool     | Version | Check           |
| -------- | ------- | --------------- |
| Java JDK | 17+     | `java -version` |
| Maven    | 3.8+    | `mvn -v`        |
| Node.js  | 18+     | `node -v`       |
| npm      | 9+      | `npm -v`        |

If any are missing: Java from adoptium.net; Maven and Node via your package
manager (e.g. `brew install maven node` on macOS).

## Setup (one machine, two terminals)

### 1. Backend

```bash
cd backend

# Mac / Linux
export ANTHROPIC_API_KEY=your-key-here

# Windows PowerShell
$env:ANTHROPIC_API_KEY="your-key-here"
(API key is in zipped folder of readme.md)
mvn spring-boot:run
```

Backend runs at `http://localhost:8080`. A badge in the top-right of the UI
shows **AI LIVE** if the key was detected, or **MOCK** if not.



### 2. Frontend (second terminal)

```bash
cd frontend
npm install
npm run dev
```

### 3. Open the app

Open `http://localhost:5173` in your browser. Done.


