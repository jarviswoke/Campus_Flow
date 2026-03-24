from app import create_app, db
from app.models import User, Room, Complaint

app = create_app()

def seed_database():
    """Add sample data to database"""
    with app.app_context():
        print("Seeding database...")
        
        # Clear existing data (optional)
        # db.drop_all()
        # db.create_all()
        
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
        
        print("\n✓ Database seeded successfully!")
        print("\nSample Credentials:")
        print("  Admin   - ADMIN001 / admin123")
        print("  Faculty - FAC001 / faculty123")
        print("  Student - STU001 / student123")

if __name__ == '__main__':
    seed_database()