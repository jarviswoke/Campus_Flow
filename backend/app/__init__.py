from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_mail import Mail
from flask_socketio import SocketIO

db = SQLAlchemy()
mail = Mail()
socketio = SocketIO()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    
    # Load configuration
    app.config.from_object('app.config.Config')
    
    # Initialize extensions
    db.init_app(app)
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    jwt.init_app(app)
    mail.init_app(app)
    socketio.init_app(app, cors_allowed_origins="*")
    
    # Register blueprints
    from app.routes import auth, complaints, rooms, items, users
    app.register_blueprint(auth.bp)
    app.register_blueprint(complaints.bp)
    app.register_blueprint(rooms.bp)
    app.register_blueprint(items.bp)
    app.register_blueprint(users.bp)
    
    # Test route
    @app.route('/')
    def index():
        return {'message': 'CampusHub API is running!', 'status': 'success'}
    
    @app.route('/api/health')
    def health():
        return {'status': 'healthy', 'database': 'connected'}
    
    return app
