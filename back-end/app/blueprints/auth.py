from datetime import datetime, timedelta
from flask import Blueprint, request, jsonify, current_app
from flask_login import login_user, logout_user, current_user, login_required
from app import  db, bcrypt
from app.models.user import  User,LoginAttempt
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from config import Config
from app.utiles  import (
    validate_required_fields,
    validate_email_format,
    validate_password_strength
)

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json() or {}

    required = ['email', 'password', 'first_name', 'last_name', 'username', 'gender', 'phone_number']
    validation_error = validate_required_fields(data, required)
    if validation_error:
        return jsonify(validation_error), 400

    email = data.get('email')
    password = data.get('password')
    fname = data.get('first_name')
    lname = data.get('last_name')
    username = data.get('username')
    gender = data.get('gender')
    phone_number = data.get('phone_number')

    # Validate email + password
    email_error = validate_email_format(email)
    if email_error:
        return jsonify(email_error), 400

    password_error = validate_password_strength(password)
    if password_error:
        return jsonify(password_error), 400

    # Check duplicates
    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'Email already exists'}), 400
    if User.query.filter_by(username=username).first():
        return jsonify({'error': 'Username already exists'}), 400

    # Hash password
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    # Create and save user
    user = User(
        email=email,
        password=hashed_password,
        fname=fname,
        lname=lname,
        username=username,
        gender=gender,
        phone_number=phone_number
    )
    db.session.add(user)
    db.session.commit()

    # Create JWT token
    access_token = create_access_token(identity=user.id)

    return jsonify({
        'message': 'User registered successfully',
        'token': access_token,
        'user': {
            'id': user.id,
            'email': user.email,
            'username': user.username,
            'first_name': user.fname,
            'last_name': user.lname
        }
    }), 201


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    email = data.get('email')
    password = data.get('password')

    # 1️⃣ Already logged in
    if current_user.is_authenticated:
        return jsonify({
            'message': 'You are already logged in',
            'user': current_user.to_dict()
        }), 200

    # 2️⃣ Check required fields
    if not email or not password:
        return jsonify({'error': 'Email and password are required.'}), 400

    # 3️⃣ Get or create login attempt record
    attempt = LoginAttempt.query.filter_by(email=email).first()
    if not attempt:
        attempt = LoginAttempt(email=email)
        db.session.add(attempt)
        db.session.commit()

    # 4️⃣ Check if banned
    if attempt.ban_until and datetime.utcnow() < attempt.ban_until:
        ban_minutes = Config.LOGIN_BAN_MINUTES
        return jsonify({'error': f'Too many failed attempts. Try again in {ban_minutes} minutes.'}), 403

    # 5️⃣ Find user
    user = User.query.filter_by(email=email).first()

    # 6️⃣ Check credentials
    if not user or not bcrypt.check_password_hash(user.password, password):
        attempt.count += 1
        attempt.last_attempt = datetime.utcnow()

        if attempt.count >= Config.LOGIN_MAX_ATTEMPTS:
            attempt.ban_until = datetime.utcnow() + timedelta(minutes=Config.LOGIN_BAN_MINUTES)
            attempt.count = 0  # reset after ban

        db.session.commit()
        return jsonify({'error': 'Invalid email or password.'}), 401

    # 7️⃣ Successful login
    attempt.reset()
    db.session.commit()

    # 8️⃣ Generate JWT token
    token = create_access_token(identity=user.id)

    return jsonify({
        'message': 'Login successful',
        'token': token,
        'user': {
            'id': user.id,
            'email': user.email,
            'username': user.username,
            'first_name': user.fname,
            'last_name': user.lname
        }
    }), 200


@auth_bp.route('/logout', methods=['POST'])
#@jwt_required()
#@login_required
def logout():
    logout_user()
    return jsonify({'msg': 'Logged out'})

@auth_bp.route('/user', methods=['GET'])
def get_user():
    # Simplified check. 
    # current_user.is_authenticated is False for anonymous users
    if current_user.is_authenticated:
        return jsonify({'user': current_user.to_dict()})
    
    # Return 401 Unauthorized if no user is logged in
    return jsonify({'user': None}), 401

@auth_bp.route('/profile', methods=['GET'])
@jwt_required()
def profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404

    return jsonify({
        'id': user.id,
        'email': user.email,
        'username': user.username,
        'first_name': user.fname,
        'last_name': user.lname
    })
