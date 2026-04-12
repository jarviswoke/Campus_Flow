"""
Advanced room scheduling utilities for conflict detection, analytics, and optimization
"""

from app.models import ClassSession, Room, Timetable
from app import db
from datetime import datetime, time, timedelta
from typing import Dict, List, Tuple

class RoomSchedulingAnalytics:
    """Analyze room utilization and detect scheduling conflicts"""
    
    @staticmethod
    def get_room_utilization(room_id: int, start_date=None, end_date=None) -> Dict:
        """
        Calculate room utilization percentage for a given period
        """
        room = Room.query.get(room_id)
        if not room:
            return {'error': 'Room not found'}
        
        # Get all sessions for this room
        sessions = ClassSession.query.filter_by(room_id=room_id).all()
        
        if not sessions:
            return {
                'room_id': room_id,
                'room_name': room.name,
                'total_sessions': 0,
                'utilization_percentage': 0,
                'hours_booked': 0,
                'hours_available': 0,
                'days_used': 0
            }
        
        # Calculate hours
        total_hours = 0
        days_used = set()
        
        for session in sessions:
            duration = (
                datetime.combine(datetime.today(), session.end_time) -
                datetime.combine(datetime.today(), session.start_time)
            ).total_seconds() / 3600
            
            total_hours += duration
            days_used.add(session.day)
        
        # Calculate utilization (5 days per week * 10 hours per day = 50 hours/week)
        hours_available = len(days_used) * 10  # Assuming 10 working hours per day
        utilization_pct = (total_hours / hours_available * 100) if hours_available > 0 else 0
        
        return {
            'room_id': room_id,
            'room_name': room.name,
            'room_type': room.room_type,
            'total_sessions': len(sessions),
            'utilization_percentage': round(utilization_pct, 2),
            'hours_booked': total_hours,
            'hours_available': hours_available,
            'days_used': len(days_used),
            'days': sorted(list(days_used))
        }
    
    @staticmethod
    def detect_scheduling_conflicts() -> List[Dict]:
        """
        Detect room double-bookings or time conflicts
        Returns list of conflicts
        """
        conflicts = []
        
        # Get all active timetables
        active_timetables = Timetable.query.filter_by(is_active=True).all()
        timetable_ids = [t.id for t in active_timetables]
        
        # Get all sessions from active timetables
        sessions = ClassSession.query.filter(
            ClassSession.timetable_id.in_(timetable_ids)
        ).all()
        
        # Group by room and day
        room_schedules = {}
        for session in sessions:
            key = (session.room_id, session.day)
            if key not in room_schedules:
                room_schedules[key] = []
            room_schedules[key].append(session)
        
        # Check for overlaps within each room-day combination
        for (room_id, day), sessions_list in room_schedules.items():
            for i, session1 in enumerate(sessions_list):
                for session2 in sessions_list[i+1:]:
                    # Check if times overlap
                    if RoomSchedulingAnalytics._times_overlap(
                        session1.start_time, session1.end_time,
                        session2.start_time, session2.end_time
                    ):
                        room = Room.query.get(room_id)
                        conflicts.append({
                            'room': room.name if room else 'Unknown',
                            'room_id': room_id,
                            'day': day,
                            'session1': {
                                'subject': session1.subject,
                                'class': session1.class_name,
                                'time': f"{session1.start_time.strftime('%H:%M')}-{session1.end_time.strftime('%H:%M')}"
                            },
                            'session2': {
                                'subject': session2.subject,
                                'class': session2.class_name,
                                'time': f"{session2.start_time.strftime('%H:%M')}-{session2.end_time.strftime('%H:%M')}"
                            },
                            'severity': 'High - Double Booking'
                        })
        
        return conflicts
    
    @staticmethod
    def find_available_slots(room_id: int, duration_minutes: int = 60) -> Dict:
        """
        Find available time slots in a room for a given duration
        """
        room = Room.query.get(room_id)
        if not room:
            return {'error': 'Room not found'}
        
        # Working hours: 9 AM to 5 PM
        working_hours = [9, 10, 11, 12, 13, 14, 15, 16]  # 9-17:00
        days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
        
        available_slots = {day: [] for day in days}
        
        # Get all sessions for this room
        sessions = ClassSession.query.filter_by(room_id=room_id).all()
        
        for day in days:
            day_sessions = [s for s in sessions if s.day == day]
            
            for hour in working_hours:
                slot_start = time(hour, 0)
                slot_end = time(hour + duration_minutes // 60, 
                               (duration_minutes % 60))
                
                if slot_end.hour > 17:  # Beyond 5 PM
                    continue
                
                # Check if slot conflicts with any session
                is_available = True
                for session in day_sessions:
                    if RoomSchedulingAnalytics._times_overlap(
                        slot_start, slot_end,
                        session.start_time, session.end_time
                    ):
                        is_available = False
                        break
                
                if is_available:
                    available_slots[day].append({
                        'start': slot_start.strftime('%H:%M'),
                        'end': slot_end.strftime('%H:%M'),
                        'duration_minutes': duration_minutes
                    })
        
        return {
            'room_id': room_id,
            'room_name': room.name,
            'duration_requested_minutes': duration_minutes,
            'available_slots': available_slots,
            'total_slots_available': sum(len(v) for v in available_slots.values())
        }
    
    @staticmethod
    def get_room_occupancy_heatmap() -> Dict:
        """
        Get a heatmap of room occupancy by day and hour
        Returns occupancy percentage for each hour of each day
        """
        days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
        hours = list(range(9, 18))  # 9 AM to 6 PM
        
        rooms = Room.query.all()
        heatmap = {}
        
        for room in rooms:
            room_heatmap = {day: {} for day in days}
            sessions = ClassSession.query.filter_by(room_id=room.id).all()
            
            for day in days:
                day_sessions = [s for s in sessions if s.day == day]
                
                for hour in hours:
                    slot_start = time(hour, 0)
                    slot_end = time(hour + 1, 0)
                    
                    # Count overlapping sessions
                    occupied = False
                    for session in day_sessions:
                        if RoomSchedulingAnalytics._times_overlap(
                            slot_start, slot_end,
                            session.start_time, session.end_time
                        ):
                            occupied = True
                            break
                    
                    room_heatmap[day][f"{hour:02d}:00"] = 'occupied' if occupied else 'available'
            
            heatmap[f"{room.name} ({room.room_type})"] = room_heatmap
        
        return heatmap
    
    @staticmethod
    def get_faculty_schedule(faculty_name: str) -> List[Dict]:
        """
        Get all classes assigned to a specific faculty member
        """
        sessions = ClassSession.query.filter(
            ClassSession.faculty_name.ilike(f'%{faculty_name}%')
        ).all()
        
        schedule = []
        for session in sessions:
            schedule.append({
                'day': session.day,
                'time': f"{session.start_time.strftime('%H:%M')}-{session.end_time.strftime('%H:%M')}",
                'subject': session.subject,
                'class': session.class_name,
                'room': session.room.name if session.room else 'Unknown',
                'room_type': session.room.room_type if session.room else 'Unknown',
                'batch': session.batch
            })
        
        # Sort by day and time
        day_order = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
        schedule.sort(key=lambda x: (day_order.index(x['day']), x['time']))
        
        return schedule
    
    @staticmethod
    def get_class_schedule(class_name: str) -> List[Dict]:
        """
        Get all classes for a specific class/batch
        """
        sessions = ClassSession.query.filter(
            ClassSession.class_name.ilike(f'%{class_name}%')
        ).all()
        
        schedule = []
        for session in sessions:
            schedule.append({
                'day': session.day,
                'time': f"{session.start_time.strftime('%H:%M')}-{session.end_time.strftime('%H:%M')}",
                'subject': session.subject,
                'faculty': session.faculty_name or 'TBA',
                'room': session.room.name if session.room else 'Unknown',
                'room_id': session.room_id
            })
        
        # Sort by day and time
        day_order = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
        schedule.sort(key=lambda x: (day_order.index(x['day']), x['time']))
        
        return schedule
    
    @staticmethod
    def get_department_statistics() -> Dict:
        """
        Get statistics for each department
        """
        sessions = ClassSession.query.all()
        
        stats = {}
        for session in sessions:
            # Extract department from class name (e.g., "CSE-Sem-4" → "CSE")
            dept = session.class_name.split('-')[0] if session.class_name else 'Unknown'
            
            if dept not in stats:
                stats[dept] = {
                    'total_sessions': 0,
                    'unique_rooms': set(),
                    'unique_faculty': set(),
                    'total_hours': 0
                }
            
            stats[dept]['total_sessions'] += 1
            if session.room_id:
                stats[dept]['unique_rooms'].add(session.room_id)
            if session.faculty_name:
                stats[dept]['unique_faculty'].add(session.faculty_name)
            
            # Calculate hours
            duration = (
                datetime.combine(datetime.today(), session.end_time) -
                datetime.combine(datetime.today(), session.start_time)
            ).total_seconds() / 3600
            stats[dept]['total_hours'] += duration
        
        # Convert sets to lists for JSON serialization
        for dept in stats:
            stats[dept]['unique_rooms'] = len(stats[dept]['unique_rooms'])
            stats[dept]['unique_faculty'] = len(stats[dept]['unique_faculty'])
            stats[dept]['total_hours'] = round(stats[dept]['total_hours'], 2)
        
        return stats
    
    @staticmethod
    def get_suggestions_for_optimization() -> List[str]:
        """
        Get suggestions for schedule optimization based on current data
        """
        suggestions = []
        
        # Check for underutilized rooms
        rooms = Room.query.all()
        for room in rooms:
            sessions = ClassSession.query.filter_by(room_id=room.id).count()
            if sessions < 5:
                suggestions.append(f"Room '{room.name}' has only {sessions} sessions. Consider consolidating schedules.")
        
        # Check for conflicts
        conflicts = RoomSchedulingAnalytics.detect_scheduling_conflicts()
        if conflicts:
            suggestions.append(f"Found {len(conflicts)} scheduling conflicts. Please review and resolve.")
        
        # Check for peak hours
        hour_usage = {}
        sessions = ClassSession.query.all()
        for session in sessions:
            hour = session.start_time.hour
            hour_usage[hour] = hour_usage.get(hour, 0) + 1
        
        if hour_usage:
            peak_hour = max(hour_usage, key=hour_usage.get)
            peak_count = hour_usage[peak_hour]
            suggestions.append(f"Peak usage is at {peak_hour:02d}:00 with {peak_count} sessions.")
        
        if not suggestions:
            suggestions.append("Schedule appears optimized. No major issues detected.")
        
        return suggestions
    
    @staticmethod
    def _times_overlap(start1: time, end1: time, start2: time, end2: time) -> bool:
        """Check if two time slots overlap"""
        return not (end1 <= start2 or end2 <= start1)