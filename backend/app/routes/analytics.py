"""
Analytics routes for room scheduling insights and recommendations
"""

from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt
from app.room_scheduling_analytics import RoomSchedulingAnalytics
from app.models import Room

bp = Blueprint('analytics', __name__, url_prefix='/api/analytics')


@bp.route('/rooms/<int:room_id>/utilization', methods=['GET'])
@jwt_required()
def get_room_utilization(room_id):
    """Get room utilization statistics"""
    try:
        result = RoomSchedulingAnalytics.get_room_utilization(room_id)
        if 'error' in result:
            return jsonify(result), 404
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@bp.route('/rooms/all/utilization', methods=['GET'])
@jwt_required()
def get_all_rooms_utilization():
    """Get utilization for all rooms"""
    try:
        rooms = Room.query.all()
        utilization_data = []
        
        for room in rooms:
            util = RoomSchedulingAnalytics.get_room_utilization(room.id)
            if 'error' not in util:
                utilization_data.append(util)
        
        # Sort by utilization percentage (descending)
        utilization_data.sort(key=lambda x: x['utilization_percentage'], reverse=True)
        
        return jsonify({
            'utilization': utilization_data,
            'count': len(utilization_data),
            'average_utilization': round(sum(u['utilization_percentage'] for u in utilization_data) / len(utilization_data), 2) if utilization_data else 0
        }), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@bp.route('/conflicts', methods=['GET'])
@jwt_required()
def get_scheduling_conflicts():
    """Detect and return scheduling conflicts"""
    try:
        claims = get_jwt()
        if claims.get('user_type') not in ['admin', 'faculty']:
            return jsonify({'error': 'Unauthorized'}), 403
        
        conflicts = RoomSchedulingAnalytics.detect_scheduling_conflicts()
        
        return jsonify({
            'conflicts': conflicts,
            'conflict_count': len(conflicts),
            'status': 'clear' if len(conflicts) == 0 else 'alert'
        }), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@bp.route('/rooms/<int:room_id>/available-slots', methods=['GET'])
@jwt_required()
def get_available_slots(room_id):
    """Find available time slots for a room"""
    try:
        duration = int(request.args.get('duration', 60))
        
        if duration < 15 or duration > 480:  # 15 min to 8 hours
            return jsonify({'error': 'Duration must be between 15 and 480 minutes'}), 400
        
        result = RoomSchedulingAnalytics.find_available_slots(room_id, duration)
        
        if 'error' in result:
            return jsonify(result), 404
        
        return jsonify(result), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@bp.route('/rooms/occupancy-heatmap', methods=['GET'])
@jwt_required()
def get_occupancy_heatmap():
    """Get occupancy heatmap for all rooms"""
    try:
        claims = get_jwt()
        if claims.get('user_type') not in ['admin', 'faculty']:
            return jsonify({'error': 'Unauthorized'}), 403
        
        heatmap = RoomSchedulingAnalytics.get_room_occupancy_heatmap()
        
        return jsonify({
            'heatmap': heatmap
        }), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@bp.route('/faculty/<faculty_name>/schedule', methods=['GET'])
@jwt_required()
def get_faculty_schedule(faculty_name):
    """Get schedule for a specific faculty member"""
    try:
        schedule = RoomSchedulingAnalytics.get_faculty_schedule(faculty_name)
        
        return jsonify({
            'faculty': faculty_name,
            'schedule': schedule,
            'total_classes': len(schedule)
        }), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@bp.route('/class/<class_name>/schedule', methods=['GET'])
@jwt_required()
def get_class_schedule(class_name):
    """Get schedule for a specific class/batch"""
    try:
        schedule = RoomSchedulingAnalytics.get_class_schedule(class_name)
        
        return jsonify({
            'class': class_name,
            'schedule': schedule,
            'total_sessions': len(schedule)
        }), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@bp.route('/departments/statistics', methods=['GET'])
@jwt_required()
def get_department_statistics():
    """Get statistics for all departments"""
    try:
        claims = get_jwt()
        if claims.get('user_type') not in ['admin', 'faculty']:
            return jsonify({'error': 'Unauthorized'}), 403
        
        stats = RoomSchedulingAnalytics.get_department_statistics()
        
        return jsonify({
            'departments': stats,
            'total_departments': len(stats)
        }), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@bp.route('/optimization/suggestions', methods=['GET'])
@jwt_required()
def get_optimization_suggestions():
    """Get suggestions for schedule optimization"""
    try:
        claims = get_jwt()
        if claims.get('user_type') not in ['admin', 'faculty']:
            return jsonify({'error': 'Unauthorized'}), 403
        
        suggestions = RoomSchedulingAnalytics.get_suggestions_for_optimization()
        
        return jsonify({
            'suggestions': suggestions,
            'suggestion_count': len(suggestions)
        }), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@bp.route('/dashboard', methods=['GET'])
@jwt_required()
def get_analytics_dashboard():
    """Get comprehensive analytics dashboard"""
    try:
        claims = get_jwt()
        if claims.get('user_type') not in ['admin', 'faculty']:
            return jsonify({'error': 'Unauthorized'}), 403
        
        # Gather all analytics
        rooms = Room.query.all()
        
        utilization_data = []
        for room in rooms:
            util = RoomSchedulingAnalytics.get_room_utilization(room.id)
            if 'error' not in util:
                utilization_data.append(util)
        
        conflicts = RoomSchedulingAnalytics.detect_scheduling_conflicts()
        suggestions = RoomSchedulingAnalytics.get_suggestions_for_optimization()
        dept_stats = RoomSchedulingAnalytics.get_department_statistics()
        
        # Calculate aggregate stats
        total_rooms = len(rooms)
        avg_utilization = round(sum(u['utilization_percentage'] for u in utilization_data) / len(utilization_data), 2) if utilization_data else 0
        most_utilized_room = max(utilization_data, key=lambda x: x['utilization_percentage']) if utilization_data else None
        least_utilized_room = min(utilization_data, key=lambda x: x['utilization_percentage']) if utilization_data else None
        
        return jsonify({
            'summary': {
                'total_rooms': total_rooms,
                'average_utilization_percentage': avg_utilization,
                'scheduling_conflicts': len(conflicts),
                'total_departments': len(dept_stats),
                'total_sessions': sum(s.get('total_sessions', 0) for s in utilization_data)
            },
            'most_utilized_room': most_utilized_room,
            'least_utilized_room': least_utilized_room,
            'conflicts': conflicts,
            'suggestions': suggestions,
            'room_utilization': sorted(utilization_data, key=lambda x: x['utilization_percentage'], reverse=True),
            'department_stats': dept_stats
        }), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500