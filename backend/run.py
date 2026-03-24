from app import create_app, socketio, db

app = create_app()

if __name__ == '__main__':
    with app.app_context():
        # Verify database connection
        try:
            db.engine.connect()
            print("✓ Database connected successfully!")
        except Exception as e:
            print(f"✗ Database connection failed: {e}")
    
    
    
    socketio.run(app, debug=True, host='0.0.0.0', port=5001)