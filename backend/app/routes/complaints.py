from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from app.models import Complaint, User
from app import db

bp = Blueprint('complaints', __name__, url_prefix='/api/complaints')

@bp.route('/', methods=['POST'])
@jwt_required()
def create_complaint():
    """Submit new complaint"""
    try:
        user_id = int(get_jwt_identity())
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['category', 'title', 'description']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        complaint = Complaint(
            user_id=user_id,
            category=data['category'],
            title=data['title'],
            description=data['description'],
            priority=data.get('priority', 'medium')
        )
        
        db.session.add(complaint)
        db.session.commit()
        
        return jsonify({
            'message': 'Complaint submitted successfully',
            'complaint': complaint.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@bp.route('/', methods=['GET'])
@jwt_required()
def get_complaints():
    """Get all complaints (filtered by user role)"""
    try:
        user_id = int(get_jwt_identity())
        claims = get_jwt()
        user_type = claims.get('user_type')
        
        if user_type in ['admin', 'faculty']:
            # Admin/Faculty sees all complaints
            complaints = Complaint.query.order_by(Complaint.created_at.desc()).all()
        else:
            # Students see only their complaints
            complaints = Complaint.query.filter_by(user_id=user_id).order_by(Complaint.created_at.desc()).all()
        
        return jsonify({
            'complaints': [c.to_dict() for c in complaints],
            'count': len(complaints)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/urgent', methods=['GET'])
@jwt_required()
def get_urgent():
    """Get all high/urgent priority complaints (for faculty only)"""
    try:
        user_id = int(get_jwt_identity())
        claims = get_jwt()
        user_type = claims.get('user_type')
        
        if user_type not in ['faculty']:
            return jsonify({'error': 'Unauthorized - this route is for faculty only'}), 403
        
        complaints = Complaint.query.filter(
            Complaint.priority.in_(['high','urgent'])
        ).order_by(Complaint.created_at.desc()).all()
        return jsonify({
            'complaints': [c.to_dict() for c in complaints],
            'count': len(complaints)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@bp.route('/<int:id>', methods=['GET'])
@jwt_required()
def get_complaint(id):
    """Get specific complaint details"""
    try:
        complaint = Complaint.query.get_or_404(id)
        return jsonify({'complaint': complaint.to_dict()}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@bp.route('/<int:id>/status', methods=['PUT'])
@jwt_required()
def update_status(id):
    """Update complaint status (Admin/Faculty only)"""
    try:
        claims = get_jwt()
        if claims.get('user_type') not in ['admin', 'faculty']:
            return jsonify({'error': 'Unauthorized'}), 403
        
        complaint = Complaint.query.get_or_404(id)
        data = request.get_json() or {}
        
        if 'status' in data:
            complaint.status = data['status']
        
        if 'resolution_notes' in data:
            complaint.resolution_notes = data['resolution_notes']
        
        db.session.commit()
        
        return jsonify({
            'message': 'Status updated successfully',
            'complaint': complaint.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
    
@bp.route('/stats', methods=['GET'])
@jwt_required()
def get_stats():
    """Get complaint stats(Admin/Faculty only)"""
    try:
        claims = get_jwt()
        user_type = claims.get('user_type')

        if user_type not in ['admin', 'faculty']:
            return jsonify({'error': 'Unauthorized'}), 403

        complaints = Complaint.query.all()

        total = len(complaints)
        resolved = sum(1 for c in complaints if c.status == 'resolved')
        open = sum(1 for c in complaints if c.status == 'open')
        pending = sum(1 for c in complaints if c.status == 'pending')

        return jsonify({
            'total': total,
            'resolved': resolved,
            'open': open,
            'pending': pending
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500