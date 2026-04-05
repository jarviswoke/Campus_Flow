# CampusHub Backend

## Setup Instructions

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env with your database credentials
```

### 3. Setup Database
```bash
mysql -u root -p
CREATE DATABASE campushub_db;
EXIT;

mysql -u root -p campushub_db < schema.sql
```

### 4. Seed Sample Data (Optional)
```bash
python seed_data.py
```

### 5. Run Application
```bash
python run.py
```

Server will start on: http://localhost:5000

## API Endpoints

### Authentication
- POST /api/auth/register - Register new user
- POST /api/auth/login - Login user
- GET /api/auth/profile - Get current user

### Complaints
- POST /api/complaints - Create complaint
- GET /api/complaints - Get all complaints
- GET /api/complaints/<id> - Get specific complaint
- PUT /api/complaints/<id>/status - Update status
- GET /api/complaints/urgent - Get high/urgent priority complaints (for faculty)
- GET /api/complaints/stats - Get complaints stats (for faculty and admin users)

### Rooms
- GET /api/rooms - Get all rooms
- GET /api/rooms/<id> - Get specific room

## Sample Credentials
- Admin: ADMIN001 / admin123
- Faculty: FAC001 / faculty123
- Student: STU001 / student123