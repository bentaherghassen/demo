import os

basedir = os.path.abspath(os.path.dirname(__file__))

class Config:
    # 🔐 Flask core settings
    SECRET_KEY = os.environ.get('SECRET_KEY', 'dev-secret-key')
    SQLALCHEMY_DATABASE_URI = (
        os.environ.get('SQLALCHEMY_DATABASE_URI')
        or 'sqlite:///' + os.path.join(basedir, 'app.db')
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # 🔐 JWT (JSON Web Token) configuration
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'dev-jwt-secret-key')
    JWT_TOKEN_LOCATION = ['headers']             # Tokens expected in request headers
    JWT_HEADER_NAME = 'Authorization'            # Default header
    JWT_HEADER_TYPE = 'Bearer'                   # Format: "Authorization: Bearer <token>"
    JWT_ACCESS_TOKEN_EXPIRES = int(os.environ.get('JWT_ACCESS_TOKEN_EXPIRES', 3600))  # 1 hour default

    # 🌍 CORS (Cross-Origin Resource Sharing)
    CORS_HEADERS = 'Content-Type'
    CORS_SUPPORTS_CREDENTIALS = True

    # 🔒 Login security limits
    LOGIN_MAX_ATTEMPTS = int(os.environ.get('LOGIN_MAX_ATTEMPTS', 3))
    LOGIN_BAN_MINUTES = int(os.environ.get('LOGIN_BAN_MINUTES', 15))

    # 🐞 Debugging mode (off by default in production)
    DEBUG = os.environ.get('FLASK_DEBUG', 'False').lower() in ['true', '1', 'yes']
