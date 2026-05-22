Deadline Guardian AI

**Path A — Applied AI Product** · Intro to AI · Dr. Elena Nazarenko
Team: Tuguldur Bat-Erdene & Zina Belbel

## What it is

A **web app** (not a native mobile app — runs in any browser, mobile-responsive) that turns messy assignment descriptions into structured tasks: title, due date, priority, AI-generated checklist, progress tracking, and start-time recommendations. Built on **Claude** as the reasoning engine via the Anthropic Messages API.

## Project layout

deadline-guardian/
├── backend/                          Spring Boot (port 8080)
│   ├── pom.xml
│   └── src/main/java/com/deadlineguardian/
│       ├── DeadlineGuardianApplication.java
│       ├── config/CorsConfig.java
│       ├── controller/
│       │   ├── ChatController.java       POST /api/chat, GET /api/chat/status
│       │   └── TaskController.java       all /api/tasks endpoints
│       ├── service/
│       │   ├── AnthropicService.java     <= Claude API integration
│       │   └── TaskService.java          in-memory store + seed data
│       ├── model/      Task, ChecklistItem, Priority
│       └── dto/        ChatRequest, ChatResponse, TaskCreationRequest, TaskAnalysisResponse
│
└── frontend/                         React + Vite (port 5173)
    ├── package.json
    ├── vite.config.js                proxies /api → :8080
    ├── index.html
    └── src/
        ├── main.jsx · App.jsx · api.js · styles.css
        ├── components/  TopNav · TaskCard · PriorityBadge · ProgressBar ·
        │                WarningBanner · Checklist · ChatInterface ·
        │                ManualTaskForm · CalendarView
        └── pages/       Dashboard · Chat · Calendar · TaskDetail

## Setup — one machine, two terminals

### Prerequisites

| Tool       | Version | Check               |
| ---------- | ------- | ------------------- |
| Java JDK   | 17+     | `java -version`     |
| Maven      | 3.8+    | `mvn -v`            |
| Node.js    | 18+     | `node -v`           |
| npm        | 9+      | `npm -v`            |



### 1. Run the backend

bash
cd backend

# Mac / Linux
export ANTHROPIC_API_KEY=...
For API key please unzip the sent file and go to readme.md 
# Windows 
$env:ANTHROPIC_API_KEY="..."

mvn spring-boot:run


Backend now runs at **http://localhost:8080**.
A status badge in the top-right of the UI will show "AI LIVE" if the key was picked up, or "MOCK" if not.

### 2. Run the frontend

bash
cd frontend
npm install
npm run dev

### 3. Open **http://localhost:5173** in browser. Done.
