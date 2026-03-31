from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

bp = Blueprint('items', __name__, url_prefix='/api/items')

@bp.route('/', methods=['GET'])
@jwt_required()
def get_items():
    """Get all items (placeholder)"""
    return jsonify({'items': [], 'message': 'Item sharing feature coming soon'}), 200