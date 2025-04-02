# 🧠 Lightweight CRM Feature (Django + React + WebSockets)

## ✅ Overview

This project is a lightweight CRM system using Django (Backend) and React (Frontend). It features a drag-and-drop Kanban board with real-time WebSocket updates.

## 🚀 Features

- **Kanban Board View** with drag-and-drop between stages.
- **Form Page** for creating and editing leads.
- **Real-Time Sync** across clients using Django Channels + Redis.
- **Delete Confirmation** before removing a lead.
- Clean, animated, and responsive UI.

## 🧠 Tech Stack

| Layer        | Technology              |
|--------------|--------------------------|
| Frontend     | React, Vite, Bootstrap, react-beautiful-dnd |
| Backend      | Django, Django REST Framework |
| Realtime     | Django Channels, Redis  |
| WebSocket    | ws://localhost:8000/ws/leads/ |
| Database     | SQLite (default)        |

## ⚙️ Setup

### 1. Start Redis Server

```bash
redis-server
```

### 2. Backend

```bash
cd backend
python manage.py migrate
daphne backend.asgi:application
```

### 3. Frontend

```bash
cd crm-ui
npm install
npm run dev
```

Visit: http://localhost:5173

## ✅ Task Completion Checklist

| Task                                         | Status     |
|----------------------------------------------|------------|
| Kanban View                                  | ✅ Done     |
| Form Page                                    | ✅ Done     |
| WebSocket Live Sync                          | ✅ Done     |
| Animations + UX Polishing                    | ✅ Done     |
| Delete Confirmation                          | ✅ Done     |
| AI Integration (Optional)                    | ❌ Skipped  |

## ✨ Highlights

- Beautiful, responsive UI with smooth animations.
- Stable real-time drag-drop sync with WebSockets.
- Clear modular code, easy to extend or scale.
