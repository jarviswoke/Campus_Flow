from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_mail import Mail
from flask_socketio import SocketIO
from flask_migrate import Migrate

db = SQLAlchemy()
mail = Mail()
socketio = SocketIO()
jwt = JWTManager()
migrate = Migrate()

def create_app():
    flask_app = Flask(__name__)
    
    flask_app.config.from_object('app.config.Config')
    
    db.init_app(flask_app)
    
    CORS(flask_app,
         resources={r"/api/*": {"origins": "*"}},
         supports_credentials=True,
         allow_headers=["Content-Type", "Authorization"])
    
    jwt.init_app(flask_app)
    mail.init_app(flask_app)
    migrate.init_app(flask_app, db)
    socketio.init_app(flask_app, cors_allowed_origins="*")

    from app import models
    # Register blueprints
    from app.routes import auth, complaints, rooms, items, users, timetables, analytics
    
    flask_app.register_blueprint(auth.bp)
    flask_app.register_blueprint(complaints.bp)
    flask_app.register_blueprint(rooms.bp)
    flask_app.register_blueprint(items.bp)
    flask_app.register_blueprint(users.bp)
    flask_app.register_blueprint(timetables.bp)
    flask_app.register_blueprint(analytics.bp)
    
    @flask_app.route('/')
    def index():
        return {'message': 'CampusHub API is running!'}

    
    @flask_app.route('/api/health')
    def health():
        return {'status': 'healthy', 'database': 'connected'}
    return flask_app
