"""
Timetable management routes
- Upload timetable (image/Excel)
- Process and extract data
- Activate timetable
- View timetables
- Update room status based on timetable
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from werkzeug.utils import secure_filename
import os
from datetime import datetime
from app.models import Timetable, ClassSession, Room, User
from app.timetable_parser import TimetableParser
from app import db, create_app
import threading

bp = Blueprint('timetables', __name__, url_prefix='/api/timetables')

# Configuration
UPLOAD_FOLDER = os.getenv('UPLOAD_FOLDER', 'static/uploads/timetables')
ALLOWED_EXTENSIONS = {'xlsx', 'xls', 'csv', 'png', 'jpg', 'jpeg', 'pdf'}
MAX_FILE_SIZE = int(os.getenv('MAX_FILE_SIZE', 5242880))  # 5MB

# Ensure upload folder exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


def allowed_file(filename):
    """Check if file extension is allowed"""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def get_file_type(filename):
    """Get file type from extension"""
    ext = filename.rsplit('.', 1)[1].lower()
    if ext in ['xlsx', 'xls', 'csv']:
        return 'excel'
    elif ext in ['png', 'jpg', 'jpeg']:
        return 'image'
    elif ext == 'pdf':
        return 'pdf'
    return None


def process_timetable_async(timetable_id):
    """Process timetable file asynchronously"""
    app = create_app()
    with app.app_context():
        try:
            timetable = Timetable.query.get(timetable_id)
            if not timetable:
                return
            
            timetable.status = 'processing'
            db.session.commit()
            
            # Parse based on file type
            if timetable.file_type == 'image':
                result = TimetableParser.extract_from_image(timetable.file_path)
            elif timetable.file_type == 'excel':
                result = TimetableParser.extract_from_excel(timetable.file_path)
            else:
                raise ValueError(f"Unsupported file type: {timetable.file_type}")
            
            if result['status'] != 'success':
                timetable.status = 'failed'
                timetable.error_message = result.get('message', 'Unknown error')
                db.session.commit()
                return
            
            # Store extracted data
            timetable.extracted_data = result['data']
            
            # Create ClassSession objects
            sessions = result['data'].get('sessions', [])
            
            for session_data in sessions:
                # Find or create room
                room = Room.query.filter_by(name=session_data.get('room')).first()
                room_name = (session_data.get('room') or "Unknown").strip()

                if not room:
                    # Create new room if it doesn't exist
                    if room_name.startswith(("9001", "9101", "8001", "8101", "8201")):
                        room_type = "Classroom"
                        capacity = 120

                    elif room_name.startswith(("9011", "9012", "8011", "8012", "8111", "8112")):
                        room_type = "classroom"
                        capacity = 80

                    elif room_name.endswith("A") or room_name.endswith("B") or room_name.endswith("LAB"):
                        room_type = "lab"
                        capacity = 60

                    else:
                        room_type = "classroom"
                        capacity = 60
                    room = Room(
                        name=session_data.get('room', 'Unknown'),
                        building='Main',
                        room_type=room_type,
                        capacity=capacity,
                        status='available'
                    )
                    db.session.add(room)
                    db.session.flush()
                
                # Create class session
                from datetime import time
                def parse_time(t):
                    if isinstance(t, str):
                        try:
                            return datetime.strptime(t, "%H:%M:%S").time()
                        except:
                            return datetime.strptime(t, "%H:%M").time()
                    return t

                start_time = parse_time(session_data['start_time'])
                end_time = parse_time(session_data['end_time'])
                
                class_session = ClassSession(
                    timetable_id=timetable.id,
                    room_id=room.id,
                    subject=session_data.get('subject', 'Unknown'),
                    class_name=session_data.get('class_name') or 'Unknown',
                    faculty_name=session_data.get('faculty_name'),
                    day=session_data.get('day', '').lower(),
                    start_time=start_time,
                    end_time=end_time,
                    batch=session_data.get('batch')
                )
                db.session.add(class_session)
            
            timetable.status = 'active'
            timetable.processed_at = datetime.utcnow()
            db.session.commit()
            
        except Exception as e:
            timetable = Timetable.query.get(timetable_id)
            if timetable:
                timetable.status = 'failed'
                timetable.error_message = str(e)
            db.session.commit()


@bp.route('/upload', methods=['POST'])
@jwt_required()
def upload_timetable():
    """Upload timetable file (image or Excel)"""
    try:
        claims = get_jwt()
        if claims.get('user_type') not in ['admin', 'faculty']:
            return jsonify({'error': 'Unauthorized - Only admin and faculty can upload timetables'}), 403
        
        user_id = int(get_jwt_identity())
        
        # Check if file is present
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        # Validate file
        if not allowed_file(file.filename):
            return jsonify({'error': f'File type not allowed. Allowed: {", ".join(ALLOWED_EXTENSIONS)}'}), 400
        
        # Check file size
        file.seek(0, os.SEEK_END)
        file_size = file.tell()
        file.seek(0)
        
        if file_size > MAX_FILE_SIZE:
            return jsonify({'error': f'File too large. Max size: {MAX_FILE_SIZE / 1024 / 1024}MB'}), 400
        
        # Save file
        filename = secure_filename(file.filename)
        file_type = get_file_type(filename)
        
        # Add timestamp to filename for uniqueness
        timestamp = datetime.utcnow().strftime('%Y%m%d_%H%M%S_')
        filename = timestamp + filename
        
        file_path = os.path.join(UPLOAD_FOLDER, filename)
        file.save(file_path)
        
        # Create timetable record
        academic_year = request.form.get('academic_year', datetime.utcnow().strftime('%Y-%Y'))
        semester = request.form.get('semester', 'Fall')
        
        timetable = Timetable(
            uploaded_by=user_id,
            file_name=file.filename,
            file_path=file_path,
            file_type=file_type,
            academic_year=academic_year,
            semester=semester,
            status='pending'
        )
        
        db.session.add(timetable)
        db.session.commit()
        
        # Process file asynchronously
        process_timetable_async(timetable.id)
        
        return jsonify({
            'message': 'File uploaded successfully. Processing in background.',
            'timetable': timetable.to_dict()
        }), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@bp.route('/', methods=['GET'])
@jwt_required()
def get_timetables():
    """Get all timetables (admin/faculty) or active timetable (student)"""
    try:
        claims = get_jwt()
        user_type = claims.get('user_type')
        
        if user_type in ['admin', 'faculty']:
            # Show all timetables
            timetables = Timetable.query.order_by(Timetable.created_at.desc()).all()
        else:
            # Students see only active timetables
            timetables = Timetable.query.filter_by(is_active=True, status='active').all()
        
        return jsonify({
            'timetables': [t.to_dict() for t in timetables],
            'count': len(timetables)
        }), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@bp.route('/<int:id>', methods=['GET'])
@jwt_required()
def get_timetable(id):
    """Get specific timetable with detailed data"""
    try:
        timetable = Timetable.query.get_or_404(id)
        
        claims = get_jwt()
        user_type = claims.get('user_type')
        
        # Check permissions
        if user_type not in ['admin', 'faculty'] and (not timetable.is_active or timetable.status != 'active'):
            return jsonify({'error': 'Timetable not accessible'}), 403
        
        return jsonify({
            'timetable': timetable.to_dict(include_data=True)
        }), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@bp.route('/<int:id>/activate', methods=['PUT'])
@jwt_required()
def activate_timetable(id):
    """Activate a timetable (deactivate others for same academic year/semester)"""
    try:
        claims = get_jwt()
        if claims.get('user_type') not in ['admin', 'faculty']:
            return jsonify({'error': 'Unauthorized'}), 403
        
        timetable = Timetable.query.get_or_404(id)
        
        if timetable.status != 'active':
            return jsonify({'error': 'Cannot activate - timetable not yet processed successfully'}), 400
        
        # Deactivate other timetables for same academic year/semester
        Timetable.query.filter(
            Timetable.academic_year == timetable.academic_year,
            Timetable.semester == timetable.semester,
            Timetable.id != timetable.id
        ).update({'is_active': False})
        
        timetable.is_active = True
        db.session.commit()
        
        # Update room statuses
        update_all_room_status()
        
        return jsonify({
            'message': 'Timetable activated successfully',
            'timetable': timetable.to_dict()
        }), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_timetable(id):
    """Delete a timetable"""
    try:
        claims = get_jwt()
        if claims.get('user_type') != 'admin':
            return jsonify({'error': 'Unauthorized - Only admin can delete'}), 403
        
        timetable = Timetable.query.get_or_404(id)
        
        # Delete associated file
        try:
            if os.path.exists(timetable.file_path):
                os.remove(timetable.file_path)
        except:
            pass
        
        # Delete all class sessions and timetable
        ClassSession.query.filter_by(timetable_id=timetable.id).delete()
        db.session.delete(timetable)
        db.session.commit()
        
        return jsonify({'message': 'Timetable deleted successfully'}), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@bp.route('/sessions/<int:room_id>', methods=['GET'])
@jwt_required()
def get_room_sessions(room_id):
    """Get all sessions for a specific room"""
    try:
        room = Room.query.get_or_404(room_id)
        room.update_status()      # ← ADD HERE
        db.session.commit()
        
        # Get active timetables
        active_timetables = Timetable.query.filter_by(is_active=True, status='active').all()
        timetable_ids = [t.id for t in active_timetables]
        
        # Get sessions for this room from active timetables
        sessions = ClassSession.query.filter(
            ClassSession.room_id == room_id,
            ClassSession.timetable_id.in_(timetable_ids)
        ).all()
        
        return jsonify({
            'room': room.to_dict(),
            'sessions': [s.to_dict() for s in sessions],
            'count': len(sessions)
        }), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


def update_all_room_status():
    """Update status of all rooms based on current time and schedule"""
    try:
        rooms = Room.query.all()
        for room in rooms:
            room.update_status()
        db.session.commit()
    except Exception as e:
        print(f"Error updating room status: {e}")
        db.session.rollback()


@bp.route('/rooms/status/update', methods=['POST'])
@jwt_required()
def manual_update_room_status():
    """Manually trigger room status update (for testing)"""
    try:
        claims = get_jwt()
        if claims.get('user_type') not in ['admin', 'faculty']:
            return jsonify({'error': 'Unauthorized'}), 403
        
        update_all_room_status()
        
        rooms = Room.query.all()
        return jsonify({
            'message': 'Room statuses updated',
            'rooms': [r.to_dict() for r in rooms]
        }), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@bp.route('/stats', methods=['GET'])
@jwt_required()
def get_timetable_stats():
    """Get timetable statistics"""
    try:
        claims = get_jwt()
        if claims.get('user_type') not in ['admin', 'faculty']:
            return jsonify({'error': 'Unauthorized'}), 403
        
        all_timetables = Timetable.query.all()
        
        stats = {
            'total_timetables': len(all_timetables),
            'active': sum(1 for t in all_timetables if t.is_active),
            'processed': sum(1 for t in all_timetables if t.status == 'active'),
            'pending': sum(1 for t in all_timetables if t.status == 'pending'),
            'failed': sum(1 for t in all_timetables if t.status == 'failed'),
            'total_sessions': ClassSession.query.count(),
            'rooms_with_sessions': len(set(s.room_id for s in ClassSession.query.all())),
            'current_occupied_rooms': sum(1 for r in Room.query.all() if r.status == 'occupied')
        }
        
        return jsonify(stats), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500