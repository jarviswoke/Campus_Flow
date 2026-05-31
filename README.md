# 🎓 Campus Flow

Campus Flow is a full-stack Campus Management System developed as part of the **Software Engineering Course Project**. The platform streamlines campus operations by providing dedicated portals for Students, Faculty, and Administrators with role-based access control, complaint management, room management, timetable scheduling, and administrative analytics.

The project aims to improve communication, transparency, and efficiency within educational institutions through a centralized web-based solution.

---

## 🚀 Features

### 👨‍🎓 Student Portal
- Submit and track complaints
- View vacant room information
- Manage personal profile
- Access personalized dashboard

### 👨‍🏫 Faculty Portal
- View and manage timetable
- Monitor complaints
- Access faculty dashboard

### 👨‍💼 Admin Portal
- Manage users and roles
- Room management
- Complaint oversight
- Analytics dashboard
- Audit log monitoring

---

## 🛠️ Tech Stack

### Frontend
- React 19
- Vite
- React Router DOM v7
- Tailwind CSS v4
- Framer Motion
- React Hook Form
- Lucide React
- Sonner

### Backend
- Flask
- SQLAlchemy
- JWT Authentication
- Alembic Migrations
- MySQL

### Other Tools
- Git & GitHub
- REST APIs
- Environment Variable Management

---

## 📂 Project Structure

```text
Campus_Flow/
│
├── backend/
│   ├── app/
│   ├── routes/
│   ├── migrations/
│   ├── requirements.txt
│   ├── run.py
│   └── .env.example
│
├── campus_flow/        # Python Virtual Environment
│   ├── bin/
│   ├── include/
│   ├── lib/
│   └── pyvenv.cfg
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── admin/
│   │   ├── faculty/
│   │   ├── student/
│   │   └── ui/
│   ├── package.json
│   ├── vite.config.js
│   └── eslint.config.js
│
└── README.md
```

---

## 🔐 Authentication & Authorization

Campus Flow implements JWT-based authentication with Role-Based Access Control (RBAC).

Supported Roles:
- Student
- Faculty
- Admin

Users are redirected to their respective dashboards upon successful login.

---

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/campus-flow.git
cd campus-flow
```

### 2. Backend Setup

```bash
cd backend
pip install -r requirements.txt
```

Create a `.env` file using `.env.example`.

Run the backend server:

```bash
python run.py
```

Backend URL:

```text
http://localhost:5000
```

---

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

---

## 🔧 Environment Variables

Create a `.env` file inside the backend directory and configure the following variables:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=campushub_db
DB_PORT=3306

# Flask Configuration
SECRET_KEY=your_secret_key
JWT_SECRET_KEY=your_jwt_secret_key

# Email Configuration
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USE_TLS=True
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password

# Upload Configuration
UPLOAD_FOLDER=static/uploads
MAX_FILE_SIZE=5242880

# Server Configuration
PORT=5000
```

---

## 📊 Core Modules

- User Authentication & Authorization
- Role-Based Dashboards
- Complaint Management System
- Room Management
- Timetable Scheduling
- User Management
- Analytics Dashboard
- Audit Logging

---

## 🎯 Learning Outcomes

This project was developed as part of the Software Engineering curriculum and provided hands-on experience with:

- Full-Stack Web Development
- REST API Design
- Database Design & Integration
- Authentication & Authorization
- Software Development Life Cycle (SDLC)
- Team Collaboration using Git & GitHub
- Agile Development Practices

---

## 👥 Team Project

Campus Flow was developed as a collaborative Software Engineering course project to address common administrative challenges faced by educational institutions and to provide a scalable digital solution for campus management.

---
 
