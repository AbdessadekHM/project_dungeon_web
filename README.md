# 🏰 Project Dungeon — Frontend

A **React + Vite SPA** providing the UI for the Project Dungeon platform. Features real-time chat, Google Calendar integration, Kanban task boards, issue tracking, and a full admin panel.

---

## 🎨 Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + Vite 7 |
| Language | TypeScript 5.9 |
| Styling | Tailwind CSS 4 + Radix UI |
| Routing | React Router DOM v7 |
| State Management | Zustand |
| Forms | React Hook Form + Zod |
| HTTP Client | Axios |
| Real-Time | Native WebSocket API |
| i18n | i18next + react-i18next |
| Calendar | react-big-calendar |
| Drag & Drop | @hello-pangea/dnd |
| AI | @google/genai (Gemini) |
| Notifications | Sonner |

---

## 📁 Project Structure

```
project_dungeon_frontend/
├── src/
│   ├── features/
│   │   ├── auth/           # Login, Register, Google OAuth flow
│   │   ├── admin/          # Admin dashboard & user management
│   │   ├── dashboard/      # Projects overview (card/list view)
│   │   ├── projects/       # Project creation and details
│   │   ├── tasks/          # Kanban task board with filters
│   │   ├── teams/          # Team creation and management
│   │   ├── events/         # Calendar view + Google Calendar sync
│   │   ├── issues/         # Issue reporting and tracking
│   │   ├── chat/           # Real-time WebSocket project chat
│   │   └── repositories/   # Repository linking per project
│   ├── components/         # Shared UI components & layouts
│   ├── hooks/              # Custom React hooks
│   ├── stores/             # Zustand global state stores
│   ├── lib/                # Axios instance, utilities
│   ├── locales/            # i18n translation files
│   └── routes/             # Application router definition
├── public/
├── index.html
├── vite.config.ts
└── .env
```

---

## 🗺️ Application Routes

```
/                           → Redirect to /dashboard
/dashboard                  → Projects overview (protected)
/teams                      → Teams management (protected)
/projects/:projectId/
  ├── tasks                 → Kanban task board
  ├── events                → Events + Google Calendar
  ├── repositories          → Linked repositories
  ├── issues                → Issue tracker
  └── chat                  → Real-time project chat
/admin/
  ├── dashboard             → Admin stats overview
  ├── projects              → All projects management
  ├── teams                 → All teams management
  └── users                 → User management
/google/callback            → Google OAuth redirect handler
```

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 **Authentication** | Email/password login & register, Google OAuth 2.0 sign-in |
| 📊 **Dashboard** | Card and list view toggles for all projects |
| ✅ **Task Board** | Kanban-style board with status, priority, type, assignee & deadline |
| 👥 **Teams** | Create teams, add members, and assign to projects |
| 🗓️ **Events** | Big Calendar view with Google Calendar OAuth sync |
| 🐛 **Issues** | Report issues linked to tasks and track their status |
| 💬 **Real-time Chat** | WebSocket-powered per-project chat |
| 🗂️ **Repositories** | Link external repository URLs to projects |
| 🛡️ **Admin Panel** | Manage users, projects, and teams site-wide |
| 🌐 **i18n** | Multi-language support (English + more) |
| 🤖 **AI Assistant** | Gemini AI integration |

---

## ⚙️ Setup

### Prerequisites
- Node.js 18+ and npm

### Steps

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create a `.env` file:**
   ```env
   VITE_API_URL=http://127.0.0.1:8000
   VITE_WS_URL=ws://127.0.0.1:8000
   VITE_GEMINI_API_KEY=your_gemini_api_key
   VITE_HOLIDAY_API_KEY=your_holiday_api_key
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

The app will be available at **http://127.0.0.1:5173**.

### Build for Production

```bash
npm run build
```

---

## 🔑 Environment Variables

| Variable | Description |
|---|---|
| `VITE_API_URL` | Base URL of the Django REST API |
| `VITE_WS_URL` | Base WebSocket URL for real-time chat |
| `VITE_GEMINI_API_KEY` | Google Gemini AI API key |
| `VITE_HOLIDAY_API_KEY` | Holiday API key for the calendar feature |
