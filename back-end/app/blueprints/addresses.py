# back-end/app/blueprints/addresses.py
from flask import Blueprint, request, jsonify
from app import db
from app.models.user import Address
from flask_jwt_extended import jwt_required, get_jwt_identity

addresses_bp = Blueprint('addresses', __name__, url_prefix='/api/addresses')

@addresses_bp.route('', methods=['GET'])
@jwt_required()
def get_addresses():
    current_user_id = get_jwt_identity()
    addresses = Address.query.filter_by(user_id=current_user_id).all()
    return jsonify([address.to_dict() for address in addresses])

@addresses_bp.route('', methods=['POST'])
@jwt_required()
def add_address():
    current_user_id = get_jwt_identity()
    data = request.get_json()
    new_address = Address(
        user_id=current_user_id,
        label=data['label'],
        address_type=data['address_type'],
        address_1=data['address_1'],
        address_2=data.get('address_2'),
        state=data['state'],
        zip_code=data['zip_code'],
        country=data['country']
    )
    db.session.add(new_address)
    db.session.commit()
    return jsonify(new_address.to_dict()), 201

@addresses_bp.route('/<int:address_id>', methods=['PATCH'])
@jwt_required()
def update_address(address_id):
    current_user_id = get_jwt_identity()
    address = Address.query.get_or_404(address_id)
    if address.user_id != current_user_id:
        return jsonify({'message': 'Unauthorized'}), 401

    data = request.get_json()
    address.label = data.get('label', address.label)
    address.address_type = data.get('address_type', address.address_type)
    address.address_1 = data.get('address_1', address.address_1)
    address.address_2 = data.get('address_2', address.address_2)
    address.state = data.get('state', address.state)
    address.zip_code = data.get('zip_code', address.zip_code)
    address.country = data.get('country', address.country)

    db.session.commit()
    return jsonify(address.to_dict())

@addresses_bp.route('/<int:address_id>', methods=['DELETE'])
@jwt_required()
def delete_address(address_id):
    current_user_id = get_jwt_identity()
    address = Address.query.get_or_404(address_id)
    if address.user_id != current_user_id:
        return jsonify({'message': 'Unauthorized'}), 401

    db.session.delete(address)
    db.session.commit()
    return jsonify({'message': 'Address deleted successfully'})
