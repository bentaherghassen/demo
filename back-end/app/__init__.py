from flask import Flask,jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_login import LoginManager
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import Config


db = SQLAlchemy()
login_manager = LoginManager()
bcrypt = Bcrypt()
jwt = JWTManager()

def create_app():
    app = Flask(__name__, instance_relative_config=False)
    app.config.from_object('config.Config')
    CORS(app, supports_credentials=app.config.get('CORS_SUPPORTS_CREDENTIALS', True))

    db.init_app(app)
    migrate = Migrate(app, db)
    login_manager.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)  # ✅ Initialize JWT here
    
    from app.models.user import User,LoginAttempt
    from datetime import datetime

    # --- user_loader for Flask-Login ---
    @login_manager.user_loader
    def load_user(user_id):
        user = User.query.get(int(user_id))
        if not user:
            return None
        if user and user.is_banned:
            return None
        attempt = LoginAttempt.query.filter_by(email=user.email).first()
        if attempt and attempt.is_banned():
            return None  # Don’t load banned users
        return user

    # --- token loader for JWT (so we can also identify the user from JWT token) ---
    @jwt.user_lookup_loader
    def user_lookup_callback(_jwt_header, jwt_data):
        identity = jwt_data["sub"]
        user = User.query.filter_by(id=identity).first()
        if not user:
            return None
        attempt = LoginAttempt.query.filter_by(email=user.email).first()
        if attempt and attempt.is_banned():
            return None
        return user

    # --- handle banned or invalid JWT cases gracefully ---
    @jwt.invalid_token_loader
    def invalid_token_callback(reason):
        return jsonify({"msg": f"Invalid token: {reason}"}), 401

    @jwt.user_lookup_error_loader
    def user_lookup_error_callback(_jwt_header, jwt_data):
        return jsonify({"msg": "User not found or banned"}), 401
    
    from app.blueprints.auth import auth_bp
    app.register_blueprint(auth_bp, url_prefix='/api/auth')

    from app.blueprints.user import user_bp
    app.register_blueprint(user_bp, url_prefix='/api/user')

    from app.blueprints.addresses import addresses_bp
    app.register_blueprint(addresses_bp, url_prefix='/api/addresses')

    @app.route('/')
    def index():
        return {'msg': 'Flask backend is running'}

    return app