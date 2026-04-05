from app import db
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
import random
import string

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