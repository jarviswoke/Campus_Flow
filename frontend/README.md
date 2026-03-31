# Campus Flow — Frontend

A React-based campus management web app with role-based portals for Students, Faculty, and Admins.

## Tech Stack

- React 19 + Vite
- React Router DOM v7
- Tailwind CSS v4
- Framer Motion
- Lucide React
- Sonner (toasts)
- React Hook Form

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

App runs on: http://localhost:5173

## Portals & Routes

| Role    | Entry Route | Features                            |
|---------|-------------|-------------------------------------|
| Student | `/dashboard`| Complaints, Vacant Rooms, Profile   |
| Faculty | `/faculty`  | Complaints, Timetable               |
| Admin   | `/admin`    | Users, Rooms, Analytics, Audit Logs |

## Login

Go to `/login` → select role → enter credentials.
Roles are stored in `localStorage` and used for redirect after login