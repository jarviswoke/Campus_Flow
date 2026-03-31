from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt
from app.models import User

bp = Blueprint('users', __name__, url_prefix='/api/users')

@bp.route('/', methods=['GET'])
@jwt_required()
def get_users():
    """Get all users (Admin only)"""
    claims = get_jwt()
    if claims.get('user_type') != 'admin':
        return jsonify({'error': 'Unauthorized'}), 403
    
    users = User.query.all()
    return jsonify({
        'users': [u.to_dict() for u in users],
        'count': len(users)
    }), 200