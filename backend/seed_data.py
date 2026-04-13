from app import create_app, db
from app.models import User, Room, Complaint, Timetable, ClassSession

app = create_app()

def seed_database():
    """Add sample data to database"""
    with app.app_context():
        print("Seeding database...")
        
        # Ensure tables exist before seeding
        db.create_all()
        
        # Create users
        admin = User(
            college_id='ADMIN001',
            email='admin@college.edu',
            full_name='Admin User',
            user_type='admin',
            department='Administration',
            is_verified=True
        )
        admin.set_password('admin123')
        
        faculty = User(
            college_id='FAC001',
            email='faculty@college.edu',
            full_name='Dr. Smith',
            user_type='faculty',
            department='Computer Science',
            is_verified=True
        )
        faculty.set_password('faculty123')
        
        student = User(
            college_id='STU001',
            email='student@college.edu',
            full_name='John Doe',
            user_type='student',
            department='Computer Science',
            year_semester='3rd Year',
            is_verified=True
        )
        student.set_password('student123')
        
        db.session.add_all([admin, faculty, student])
        db.session.commit()
        print("✓ Users created")
        
        # Create rooms
        rooms_data = [
            {'name': 'Lab 201', 'building': 'Block A', 'floor': '2nd Floor', 
             'room_type': 'lab', 'capacity': 40, 'status': 'available', 
             'next_class': 'Data Structures @ 2:00 PM', 'has_projector': True, 'has_ac': True, 'has_computers': True},
            {'name': 'Lab 202', 'building': 'Block A', 'floor': '2nd Floor', 
             'room_type': 'lab', 'capacity': 35, 'status': 'occupied', 
             'current_class': 'Web Development', 'has_projector': True, 'has_computers': True},
            {'name': 'Classroom 105', 'building': 'Main Block', 'floor': '1st Floor', 
             'room_type': 'classroom', 'capacity': 60, 'status': 'available', 
             'next_class': 'Mathematics @ 1:00 PM', 'has_projector': True, 'has_ac': True},
        ]
        
        for room_data in rooms_data:
            room = Room(**room_data)
            db.session.add(room)
        
        db.session.commit()
        print("✓ Rooms created")
        
        # Create sample complaint
        complaint = Complaint(
            user_id=student.id,
            category='Infrastructure',
            title='Broken AC in Lab 202',
            description='The air conditioning unit in Lab 202 is not working properly.',
            priority='high',
            status='open'
        )
        db.session.add(complaint)
        db.session.commit()
        print("✓ Sample complaint created")

        # Create timetable
        lab201 = Room.query.filter_by(name='Lab 201').first()
        lab202 = Room.query.filter_by(name='Lab 202').first()
        cls105 = Room.query.filter_by(name='Classroom 105').first()

        timetable = Timetable(
            timetable_id='TT2025001',
            uploaded_by=admin.id,
            file_name='timetable_spring_2025-2026.xlsx',
            file_path='uploads/timetables/timetable_spring_2025-2026.xlsx',
            file_type='excel',
            academic_year='2025-2026',
            semester='Spring',
            status='active',
            is_active=True
        )
        db.session.add(timetable)
        db.session.commit()
        print("✓ Timetable created")

        # Create class sessions
        sessions_data = [
            # Monday
            {'room_id': lab201.id, 'subject': 'Data Structures', 'class_name': 'CS-3A', 'faculty_name': 'Dr. Smith', 'day': 'Monday',    'start_time': '09:00:00', 'end_time': '10:00:00', 'batch': '3rd Year'},
            {'room_id': lab202.id, 'subject': 'Web Development',  'class_name': 'CS-3B', 'faculty_name': 'Dr. Smith', 'day': 'Monday',    'start_time': '11:00:00', 'end_time': '12:00:00', 'batch': '3rd Year'},
            {'room_id': cls105.id, 'subject': 'Mathematics',      'class_name': 'CS-3A', 'faculty_name': 'Dr. Smith', 'day': 'Monday',    'start_time': '13:00:00', 'end_time': '14:00:00', 'batch': '3rd Year'},
            # Tuesday
            {'room_id': lab201.id, 'subject': 'Data Structures', 'class_name': 'CS-3A', 'faculty_name': 'Dr. Smith', 'day': 'Tuesday',   'start_time': '10:00:00', 'end_time': '11:00:00', 'batch': '3rd Year'},
            {'room_id': lab202.id, 'subject': 'Web Development',  'class_name': 'CS-3B', 'faculty_name': 'Dr. Smith', 'day': 'Tuesday',   'start_time': '14:00:00', 'end_time': '15:00:00', 'batch': '3rd Year'},
            {'room_id': cls105.id, 'subject': 'Mathematics',      'class_name': 'CS-3A', 'faculty_name': 'Dr. Smith', 'day': 'Tuesday',   'start_time': '09:00:00', 'end_time': '10:00:00', 'batch': '3rd Year'},
            # Wednesday
            {'room_id': lab201.id, 'subject': 'Data Structures', 'class_name': 'CS-3A', 'faculty_name': 'Dr. Smith', 'day': 'Wednesday', 'start_time': '11:00:00', 'end_time': '12:00:00', 'batch': '3rd Year'},
            {'room_id': lab202.id, 'subject': 'Web Development',  'class_name': 'CS-3B', 'faculty_name': 'Dr. Smith', 'day': 'Wednesday', 'start_time': '09:00:00', 'end_time': '10:00:00', 'batch': '3rd Year'},
            {'room_id': cls105.id, 'subject': 'Mathematics',      'class_name': 'CS-3A', 'faculty_name': 'Dr. Smith', 'day': 'Wednesday', 'start_time': '13:00:00', 'end_time': '14:00:00', 'batch': '3rd Year'},
            # Thursday
            {'room_id': lab201.id, 'subject': 'Data Structures', 'class_name': 'CS-3A', 'faculty_name': 'Dr. Smith', 'day': 'Thursday',  'start_time': '14:00:00', 'end_time': '15:00:00', 'batch': '3rd Year'},
            {'room_id': lab202.id, 'subject': 'Web Development',  'class_name': 'CS-3B', 'faculty_name': 'Dr. Smith', 'day': 'Thursday',  'start_time': '11:00:00', 'end_time': '12:00:00', 'batch': '3rd Year'},
            {'room_id': cls105.id, 'subject': 'Mathematics',      'class_name': 'CS-3A', 'faculty_name': 'Dr. Smith', 'day': 'Thursday',  'start_time': '09:00:00', 'end_time': '10:00:00', 'batch': '3rd Year'},
            # Friday
            {'room_id': lab201.id, 'subject': 'Data Structures', 'class_name': 'CS-3A', 'faculty_name': 'Dr. Smith', 'day': 'Friday',    'start_time': '13:00:00', 'end_time': '14:00:00', 'batch': '3rd Year'},
            {'room_id': lab202.id, 'subject': 'Web Development',  'class_name': 'CS-3B', 'faculty_name': 'Dr. Smith', 'day': 'Friday',    'start_time': '09:00:00', 'end_time': '10:00:00', 'batch': '3rd Year'},
            {'room_id': cls105.id, 'subject': 'Mathematics',      'class_name': 'CS-3A', 'faculty_name': 'Dr. Smith', 'day': 'Friday',    'start_time': '11:00:00', 'end_time': '12:00:00', 'batch': '3rd Year'},
        ]

        for s in sessions_data:
            session = ClassSession(timetable_id=timetable.id, **s)
            db.session.add(session)

        db.session.commit()
        print("✓ Class sessions created")

        print("\n✓ Database seeded successfully!")
        print("\nSample Credentials:")
        print("  Admin   - ADMIN001 / admin123")
        print("  Faculty - FAC001 / faculty123")
        print("  Student - STU001 / student123")

if __name__ == '__main__':
    seed_database()