from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app.models import Room
from app import db

bp = Blueprint('rooms', __name__, url_prefix='/api/rooms')

@bp.route('/', methods=['GET'])
@jwt_required()
def get_rooms():
    """Get all rooms with optional filters"""
    try:
        building = request.args.get('building')
        status = request.args.get('status')
        room_type = request.args.get('room_type')
        
        query = Room.query
        
        if building and building != 'all':
            query = query.filter_by(building=building)
        if status and status != 'all':
            query = query.filter_by(status=status)
        if room_type and room_type != 'all':
            query = query.filter_by(room_type=room_type)
        
        rooms = query.all()
        
        return jsonify({
            'rooms': [r.to_dict() for r in rooms],
            'count': len(rooms)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@bp.route('/<int:id>', methods=['GET'])
@jwt_required()
def get_room(id):
    """Get specific room details"""
    try:
        room = Room.query.get_or_404(id)
        return jsonify({'room': room.to_dict()}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500