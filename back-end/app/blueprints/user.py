# back-end/app/blueprints/user.py
from flask import Blueprint, request, jsonify
from app import db
from app.models.user import User, Address
from flask_jwt_extended import jwt_required, get_jwt_identity

user_bp = Blueprint('user', __name__, url_prefix='/api/user')

@user_bp.route('/<int:user_id>', methods=['GET'])
@jwt_required()
def get_user(user_id):
    current_user_id = get_jwt_identity()
    if current_user_id != user_id:
        return jsonify({'message': 'Unauthorized'}), 401

    user = User.query.get_or_404(user_id)
    return jsonify(user.to_dict())


@user_bp.route('/<int:user_id>', methods=['PUT'])
@jwt_required()
def update_user(user_id):
    current_user_id = get_jwt_identity()
    if current_user_id != user_id:
        return jsonify({'message': 'Unauthorized'}), 401

    user = User.query.get_or_404(user_id)
    data = request.get_json()

    # Update user fields
    user.fname = data.get('fname', user.fname)
    user.lname = data.get('lname', user.lname)
    user.email = data.get('email', user.email)
    user.username = data.get('username', user.username)
    user.birthday = data.get('birthday', user.birthday)
    user.gender = data.get('gender', user.gender)
    user.bio = data.get('bio', user.bio)
    user.phone_number = data.get('phone_number', user.phone_number)
    user.home_address = data.get('home_address', user.home_address)
    user.shipping_same_as_billing = data.get('shipping_same_as_billing', user.shipping_same_as_billing)

    # Update billing address
    if 'billing_address' in data:
        billing_data = data['billing_address']
        if user.billing_address:
            user.billing_address.address_1 = billing_data.get('address_1', user.billing_address.address_1)
            user.billing_address.address_2 = billing_data.get('address_2', user.billing_address.address_2)
            user.billing_address.state = billing_data.get('state', user.billing_address.state)
            user.billing_address.zip_code = billing_data.get('zip_code', user.billing_address.zip_code)
            user.billing_address.country = billing_data.get('country', user.billing_address.country)
        else:
            new_billing_address = Address(**billing_data)
            user.billing_address = new_billing_address
            db.session.add(new_billing_address)

    # Update shipping address
    if not user.shipping_same_as_billing and 'shipping_address' in data:
        shipping_data = data['shipping_address']
        if user.shipping_address:
            user.shipping_address.address_1 = shipping_data.get('address_1', user.shipping_address.address_1)
            user.shipping_address.address_2 = shipping_data.get('address_2', user.shipping_address.address_2)
            user.shipping_address.state = shipping_data.get('state', user.shipping_address.state)
            user.shipping_address.zip_code = shipping_data.get('zip_code', user.shipping_address.zip_code)
            user.shipping_address.country = shipping_data.get('country', user.shipping_address.country)
        else:
            new_shipping_address = Address(**shipping_data)
            user.shipping_address = new_shipping_address
            db.session.add(new_shipping_address)

    db.session.commit()

    return jsonify({'message': 'User updated successfully'})
