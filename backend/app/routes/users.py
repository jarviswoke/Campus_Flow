from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt
from app.models import User
from app import db

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


@bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_user(id):
    """Delete a user (Admin only)"""
    claims = get_jwt()
    if claims.get('user_type') != 'admin':
        return jsonify({'error': 'Unauthorized'}), 403

    user = User.query.get_or_404(id)
    db.session.delete(user)
    db.session.commit()
    return jsonify({'message': 'User deleted successfully'}), 200