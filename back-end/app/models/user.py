from itsdangerous import URLSafeTimedSerializer as Serializer
from datetime import datetime
from flask_login import UserMixin
from app import db, login_manager, bcrypt
from flask import current_app
# The Address model
class Address(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    address_1 = db.Column(db.String(120), nullable=False)
    address_2 = db.Column(db.String(120), nullable=True)
    #city = db.Column(db.String(50), nullable=False)
    state = db.Column(db.String(50), nullable=False)
    zip_code = db.Column(db.String(20), nullable=False)
    country = db.Column(db.String(50), nullable=False)
    
    # Relationships to User model for billing and shipping
    billing_address_user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    shipping_address_user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)

    def to_dict(self):
        return {
            'id': self.id,
            'address_1': self.address_1,
            'address_2': self.address_2,
            'state': self.state,
            'zip_code': self.zip_code,
            'country': self.country,
        }

# The User model
class User(db.Model, UserMixin):
    """
    User model for storing user information and handling authentication.
    """
    id = db.Column(db.Integer, primary_key=True)
    fname = db.Column(db.String(25), nullable=False)
    lname = db.Column(db.String(25), nullable=False)
    username = db.Column(db.String(20), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(60), nullable=False)
    birthday = db.Column(db.Date, nullable=True)
    gender = db.Column(db.String(10), nullable=True)
    bio = db.Column(db.Text, nullable=True)
    phone_number = db.Column(db.String(20), nullable=True)
    home_address = db.Column(db.Text, nullable=True)
    #image_file = db.Column(db.String(20), nullable=False, default="default.png")
    is_banned = db.Column(db.Boolean, default=False, nullable=False)
    #failed_login_attempts = db.Column(db.Integer, default=0, nullable=False)
    #role = db.Column(db.String(32), nullable=False, default='customer')
    #is_verified = db.Column(db.Boolean, default=False)
    #verification_code = db.Column(db.String(4), nullable=True)
    #currency = db.Column(db.String(3), nullable=False, default='USD')
    #is_admin = db.Column(db.Boolean, default=False, nullable=False)

    # Relationships
    #stores = db.relationship('Store', backref='owner', lazy=True, cascade="all, delete-orphan")
    # Billing address relationship
    billing_address = db.relationship('Address', foreign_keys=[Address.billing_address_user_id], backref='billing_user', uselist=False)
    
    # Shipping address relationship
    shipping_address = db.relationship('Address', foreign_keys=[Address.shipping_address_user_id], backref='shipping_user', uselist=False)
    
    # Boolean to check if shipping is same as billing
    shipping_same_as_billing = db.Column(db.Boolean, default=True)
    
# Date of account creation
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships to Cart and Wishlist
    #cart_items = db.relationship('Cart', backref='user', lazy=True, cascade="all, delete-orphan")
    #wishlist_items = db.relationship('Wishlist', backref='user', lazy=True, cascade="all, delete-orphan")
    #orders = db.relationship('Order', backref='user', lazy=True, cascade="all, delete-orphan")
    #reviews = db.relationship('Review', backref='author', lazy=True, cascade="all, delete-orphan")
    #store_reviews = db.relationship('StoreReview', backref='author', lazy=True, cascade="all, delete-orphan")



    def get_reset_token(self):
        """
        Generates a secure, timed token for password reset.
        """
        s = Serializer(current_app.config['SECRET_KEY'], salt='pw-reset')
        return s.dumps({'user_id': self.id})

    @staticmethod
    def verify_reset_token(token, age=3600):
        """
        Verifies a password reset token and returns the user if valid.
        """
        s = Serializer(current_app.config['SECRET_KEY'], salt='pw-reset')
        try:
            user_id = s.loads(token, max_age=age)['user_id']
        except:
            return None
        return db.session.get(User, user_id)

    def to_dict(self):
        return {
            'id': self.id,
            'fname': self.fname,
            'lname': self.lname,
            'username': self.username,
            'email': self.email,
            'birthday': self.birthday.isoformat() if self.birthday else None,
            'gender': self.gender,
            'bio': self.bio,
            'phone_number': self.phone_number,
            'home_address': self.home_address,
            'shipping_same_as_billing': self.shipping_same_as_billing,
            'billing_address': self.billing_address.to_dict() if self.billing_address else None,
            'shipping_address': self.shipping_address.to_dict() if self.shipping_address else None,
        }

    def __repr__(self):
        """
        Returns a string representation of the User object.
        """
        return f"User('{self.username}', '{self.email}', 'created on {self.created_at}')"
    
class LoginAttempt(db.Model):
    __tablename__ = 'login_attempts'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), nullable=False, unique=True)
    count = db.Column(db.Integer, default=0, nullable=False)
    ban_until = db.Column(db.DateTime, nullable=True)
    last_attempt = db.Column(db.DateTime, default=datetime.utcnow)

    def reset(self):
        self.count = 0
        self.ban_until = None
        self.last_attempt = datetime.utcnow()
