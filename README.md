# StaffSync — MERN Human Resource Management System

A starter full-stack HR management project built with MongoDB, Express, React, and Node.js.

## Features
- Employee login and role-based access (HR/Admin, Manager, Employee)
- Employee directory: create, list, update, delete (HR/Admin)
- Leave requests: employees can request leave; HR/Admin and Managers can review
- Attendance: employees can check in/check out and view recent records
- Announcements: HR/Admin can publish; everyone can view
- Training programs: view programs and enroll
- Responsive dashboard UI

> This is a learning/demo project. Before real-world deployment, add stronger validation, audit logging, rate limiting, secure deployment settings, and tests.

## Requirements
- Node.js 18+ (20+ recommended)
- MongoDB Community Server or a MongoDB Atlas connection
- npm

## 1. Configure the backend
Open a terminal in `backend`:

```bash
npm install
```

Copy `.env.example` to `.env`, then set your MongoDB connection string and a long random JWT secret.

```bash
cp .env.example .env
npm run seed
npm run dev
```

Backend runs at `http://localhost:5000`.

Demo accounts created by the seed script:
- HR/Admin: `hr@staffsync.demo` / `StaffSync123!`
- Manager: `manager@staffsync.demo` / `StaffSync123!`
- Employee: `employee@staffsync.demo` / `StaffSync123!`

Change these passwords before sharing/deploying the project.

## 2. Start the frontend
Open a second terminal in `frontend`:

```bash
npm install
npm run dev
```

Open the local address Vite prints (usually `http://localhost:5173`).

## Project structure
```
backend/
  src/
    config/db.js
    middleware/auth.js
    models/
    routes/
    server.js
    seed.js
frontend/
  src/
    components/
    context/
    pages/
    api.js
    App.jsx
    main.jsx
    styles.css
```

## API overview
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET/POST /api/employees`
- `PUT/DELETE /api/employees/:id`
- `GET/POST /api/leaves`
- `PATCH /api/leaves/:id/status`
- `GET/POST /api/attendance`
- `POST /api/attendance/check-out`
- `GET/POST /api/announcements`
- `GET/POST /api/trainings`
- `POST /api/trainings/:id/enroll`

## Notes
- API uses JWT bearer tokens.
- Passwords are hashed with bcryptjs.
- The seeded sample data is for demonstration only.
