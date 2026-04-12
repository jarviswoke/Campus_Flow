from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
import random
import string
from . import db


class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    college_id = db.Column(db.String(20), unique=True, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    full_name = db.Column(db.String(100), nullable=False)
    mobile = db.Column(db.String(15))
    department = db.Column(db.String(50))
    year_semester = db.Column(db.String(20))
    user_type = db.Column(db.Enum('student', 'faculty', 'admin'), nullable=False)
    profile_photo = db.Column(db.String(255))
    bio = db.Column(db.Text)
    is_verified = db.Column(db.Boolean, default=False)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        return {
            'id': self.id,
            'college_id': self.college_id,
            'email': self.email,
            'full_name': self.full_name,
            'mobile': self.mobile,
            'department': self.department,
            'year_semester': self.year_semester,
            'user_type': self.user_type,
            'profile_photo': self.profile_photo,
            'bio': self.bio,
            'is_verified': self.is_verified,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class Complaint(db.Model):
    __tablename__ = 'complaints'
    
    id = db.Column(db.Integer, primary_key=True)
    complaint_id = db.Column(db.String(20), unique=True, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    category = db.Column(db.String(50), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    priority = db.Column(db.Enum('low', 'medium', 'high', 'urgent'), default='medium')
    status = db.Column(db.Enum('open', 'pending', 'resolved'), default='pending')
    assigned_to = db.Column(db.Integer, db.ForeignKey('users.id'))
    resolution_notes = db.Column(db.Text)
    resolved_at = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    user = db.relationship('User', foreign_keys=[user_id], backref='complaints')
    assigned_user = db.relationship('User', foreign_keys=[assigned_to])
    
    def __init__(self, **kwargs):
        super(Complaint, self).__init__(**kwargs)
        if not self.complaint_id:
            self.complaint_id = self.generate_complaint_id()
            
    @staticmethod
    def generate_complaint_id():
        return 'CMP' + ''.join(random.choices(string.digits, k=8))
    
    def to_dict(self):
        return {
            'id': self.id,
            'complaint_id': self.complaint_id,
            'user_id': self.user_id,
            'student': self.user.full_name if self.user else None,
            'category': self.category,
            'title': self.title,
            'description': self.description,
            'priority': self.priority,
            'status': self.status,
            'date': self.created_at.strftime('%Y-%m-%d') if self.created_at else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }


class Timetable(db.Model):
    __tablename__ = 'timetables'
    
    id = db.Column(db.Integer, primary_key=True)
    timetable_id = db.Column(db.String(20), unique=True, nullable=False)
    uploaded_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    file_name = db.Column(db.String(255), nullable=False)
    file_path = db.Column(db.String(500), nullable=False)
    file_type = db.Column(db.Enum('excel', 'image', 'pdf'), nullable=False)
    academic_year = db.Column(db.String(20), nullable=False)  # e.g., "2024-2025"
    semester = db.Column(db.String(10))  # e.g., "Fall", "Spring"
    status = db.Column(db.Enum('pending', 'processing', 'active', 'failed'), default='pending')
    extracted_data = db.Column(db.JSON)  # Stores parsed timetable data
    error_message = db.Column(db.Text)
    is_active = db.Column(db.Boolean, default=False)
    processed_at = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    uploader = db.relationship('User', backref='timetables')
    class_sessions = db.relationship('ClassSession', backref='timetable', lazy=True, cascade='all, delete-orphan')
    
    def __init__(self, **kwargs):
        super(Timetable, self).__init__(**kwargs)
        if not self.timetable_id:
            self.timetable_id = self.generate_timetable_id()
    
    @staticmethod
    def generate_timetable_id():
        return 'TT' + ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))
    
    def to_dict(self, include_data=False):
        data = {
            'id': self.id,
            'timetable_id': self.timetable_id,
            'file_name': self.file_name,
            'file_type': self.file_type,
            'academic_year': self.academic_year,
            'semester': self.semester,
            'status': self.status,
            'is_active': self.is_active,
            'processed_at': self.processed_at.isoformat() if self.processed_at else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'uploaded_by': self.uploader.full_name if self.uploader else None
        }
        
        if include_data and self.extracted_data:
            data['extracted_data'] = self.extracted_data
        
        if self.status == 'failed':
            data['error_message'] = self.error_message
        
        return data


class Room(db.Model):
    __tablename__ = 'rooms'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    building = db.Column(db.String(50), nullable=False)
    floor = db.Column(db.String(20))
    room_type = db.Column(db.Enum('lab', 'classroom', 'seminar_hall'), nullable=False)
    capacity = db.Column(db.Integer, nullable=False)
    has_projector = db.Column(db.Boolean, default=False)
    has_ac = db.Column(db.Boolean, default=False)
    has_computers = db.Column(db.Boolean, default=False)
    status = db.Column(db.Enum('available', 'occupied'), default='available')
    current_class = db.Column(db.String(100))
    next_class = db.Column(db.String(100))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # ✅ FIXED: Add relationship to ClassSession
    class_sessions = db.relationship('ClassSession', backref='room', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'building': self.building,
            'floor': self.floor,
            'room_type': self.room_type,
            'capacity': self.capacity,
            'status': self.status,
            'currentClass': self.current_class,
            'nextClass': self.next_class,
            'facilities': {
                'projector': self.has_projector,
                'ac': self.has_ac,
                'computers': self.has_computers
            }
        }
    
    def update_status(self):
        """Update room status based on current time and schedule"""
        # ✅ FIXED: Import moved inside to avoid circular imports
        from app.models import ClassSession
        
        # ✅ FIXED: Use local time instead of UTC
        now = datetime.now()  # Changed from datetime.utcnow()
        current_time = now.time()
        current_day = now.strftime('%A').lower()
        
        print(f"[Room Status] {self.name}: Checking status at {current_time} on {current_day}")
        
        # Find current session (class happening RIGHT NOW)
        current_session = ClassSession.query.filter(
            ClassSession.room_id == self.id,
            ClassSession.day == current_day,
            ClassSession.start_time <= current_time,  # Class has started
            ClassSession.end_time >= current_time     # Class hasn't ended
        ).first()
        
        if current_session:
            self.status = 'occupied'
            # ✅ IMPROVED: Show time range instead of class name
            self.current_class = f"{current_session.subject} - {current_session.start_time.strftime('%H:%M')}-{current_session.end_time.strftime('%H:%M')}"
            print(f"[Room Status] {self.name}: OCCUPIED - {self.current_class}")
        else:
            self.status = 'available'
            self.current_class = None
            print(f"[Room Status] {self.name}: AVAILABLE")
        
        # Find next session (next class to happen today)
        next_session = ClassSession.query.filter(
            ClassSession.room_id == self.id,
            ClassSession.day == current_day,
            ClassSession.start_time > current_time  # Class hasn't started yet
        ).order_by(ClassSession.start_time).first()
        
        if next_session:
            self.next_class = f"{next_session.subject} - {next_session.start_time.strftime('%H:%M')}"
            print(f"[Room Status] {self.name}: Next class at {next_session.start_time.strftime('%H:%M')}")
        else:
            self.next_class = None
            print(f"[Room Status] {self.name}: No more classes today")


class ClassSession(db.Model):
    __tablename__ = 'class_sessions'
    
    id = db.Column(db.Integer, primary_key=True)
    timetable_id = db.Column(db.Integer, db.ForeignKey('timetables.id'), nullable=False)
    room_id = db.Column(db.Integer, db.ForeignKey('rooms.id'), nullable=False)
    subject = db.Column(db.String(100), nullable=False)
    class_name = db.Column(db.String(100), nullable=False)  # e.g., "B.Tech CSE - Sem 4"
    faculty_name = db.Column(db.String(100))
    day = db.Column(db.String(20), nullable=False)  # Monday, Tuesday, etc.
    start_time = db.Column(db.Time, nullable=False)
    end_time = db.Column(db.Time, nullable=False)
    batch = db.Column(db.String(50))  # Optional: for batch-wise classes
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'subject': self.subject,
            'class_name': self.class_name,
            'faculty_name': self.faculty_name,
            'day': self.day,
            'start_time': self.start_time.strftime('%H:%M') if self.start_time else None,
            'end_time': self.end_time.strftime('%H:%M') if self.end_time else None,
            'room': self.room.name if self.room else None,
            'room_id': self.room_id,
            'batch': self.batch
        }