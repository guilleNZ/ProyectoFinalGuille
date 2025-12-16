"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import stripe
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Product, Cart, CartItem, Order, OrderItem, Favorite
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
import bcrypt

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    email = data.get('email', None)
    password = data.get('password', None)

    if not email or not password:
        return jsonify({"msg": "Missing email or password"}), 400

    user = User.query.filter_by(email=email).first()
    if user:
        return jsonify({"msg": "User already exists"}), 400

    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    new_user = User(email=email, password=hashed_password.decode('utf-8'), is_active=True)
    db.session.add(new_user)
    db.session.commit()

    access_token = create_access_token(identity=email)
    return jsonify(access_token=access_token), 200

@api.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email', None)
    password = data.get('password', None)

    if not email or not password:
        return jsonify({"msg": "Missing email or password"}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"msg": "User not found"}), 404

    if bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')):
        access_token = create_access_token(identity=email)
        return jsonify(access_token=access_token), 200
    else:
        return jsonify({"msg": "Bad username or password"}), 401

@api.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    current_user_email = get_jwt_identity()
    user = User.query.filter_by(email=current_user_email).first()
    if not user:
        return jsonify({"msg": "User not found"}), 404
    return jsonify(user.serialize()), 200

@api.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    current_user_email = get_jwt_identity()
    user = User.query.filter_by(email=current_user_email).first()
    if not user:
        return jsonify({"msg": "User not found"}), 404

    data = request.get_json()
    email = data.get('email', None)

    if email and email != user.email:
        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            return jsonify({"msg": "Email already in use"}), 400
        user.email = email

    db.session.commit()
    return jsonify({"msg": "Profile updated successfully"}), 200

@api.route('/profile', methods=['DELETE'])
@jwt_required()
def delete_profile():
    current_user_email = get_jwt_identity()
    user = User.query.filter_by(email=current_user_email).first()
    if not user:
        return jsonify({"msg": "User not found"}), 404

    db.session.delete(user)
    db.session.commit()
    return jsonify({"msg": "User account deleted"}), 200

@api.route('/products', methods=['GET'])
def get_products():
    products = Product.query.all()
    return jsonify([product.serialize() for product in products]), 200

@api.route('/products/<int:product_id>', methods=['GET'])
def get_product(product_id):
    product = Product.query.get(product_id)
    if not product:
        return jsonify({"msg": "Product not found"}), 404
    return jsonify(product.serialize()), 200

@api.route('/products', methods=['POST'])
@jwt_required()
def create_product():
    data = request.get_json()
    name = data.get('name', None)
    price = data.get('price', None)
    description = data.get('description', None)

    if not name or not price:
        return jsonify({"msg": "Missing name or price"}), 400

    new_product = Product(name=name, price=price, description=description)
    db.session.add(new_product)
    db.session.commit()

    return jsonify(new_product.serialize()), 201

@api.route('/products/<int:product_id>', methods=['PUT'])
@jwt_required()
def update_product(product_id):
    product = Product.query.get(product_id)
    if not product:
        return jsonify({"msg": "Product not found"}), 404

    data = request.get_json()
    name = data.get('name', None)
    price = data.get('price', None)
    description = data.get('description', None)

    if name:
        product.name = name
    if price:
        product.price = price
    if description:
        product.description = description

    db.session.commit()
    return jsonify(product.serialize()), 200

@api.route('/products/<int:product_id>', methods=['DELETE'])
@jwt_required()
def delete_product(product_id):
    product = Product.query.get(product_id)
    if not product:
        return jsonify({"msg": "Product not found"}), 404

    db.session.delete(product)
    db.session.commit()
    return jsonify({"msg": "Product deleted"}), 200

@api.route('/cart', methods=['GET'])
@jwt_required()
def get_cart():
    current_user_email = get_jwt_identity()
    user = User.query.filter_by(email=current_user_email).first()
    if not user:
        return jsonify({"msg": "User not found"}), 404

    cart = Cart.query.filter_by(user_id=user.id).first()
    if not cart:
        return jsonify({"msg": "Cart not found"}), 404

    return jsonify(cart.serialize()), 200

@api.route('/cart', methods=['POST'])
@jwt_required()
def add_to_cart():
    current_user_email = get_jwt_identity()
    user = User.query.filter_by(email=current_user_email).first()
    if not user:
        return jsonify({"msg": "User not found"}), 404

    cart = Cart.query.filter_by(user_id=user.id).first()
    if not cart:
        cart = Cart(user_id=user.id)
        db.session.add(cart)

    data = request.get_json()
    product_id = data.get('product_id', None)
    quantity = data.get('quantity', 1)

    if not product_id:
        return jsonify({"msg": "Missing product_id"}), 400

    product = Product.query.get(product_id)
    if not product:
        return jsonify({"msg": "Product not found"}), 404

    cart_item = CartItem.query.filter_by(cart_id=cart.id, product_id=product_id).first()
    if cart_item:
        cart_item.quantity += quantity
    else:
        cart_item = CartItem(cart_id=cart.id, product_id=product_id, quantity=quantity)
        db.session.add(cart_item)

    db.session.commit()
    return jsonify(cart.serialize()), 200

@api.route('/cart/item/<int:item_id>', methods=['PUT'])
@jwt_required()
def update_cart_item(item_id):
    cart_item = CartItem.query.get(item_id)
    if not cart_item:
        return jsonify({"msg": "Cart item not found"}), 404

    data = request.get_json()
    quantity = data.get('quantity', None)

    if quantity is None:
        return jsonify({"msg": "Missing quantity"}), 400

    cart_item.quantity = quantity
    db.session.commit()

    return jsonify(cart_item.cart.serialize()), 200

@api.route('/orders', methods=['POST'])
@jwt_required()
def create_order():
    current_user_email = get_jwt_identity()
    user = User.query.filter_by(email=current_user_email).first()
    if not user:
        return jsonify({"msg": "User not found"}), 404

    cart = Cart.query.filter_by(user_id=user.id).first()
    if not cart or not cart.items:
        return jsonify({"msg": "Cart is empty"}), 400

    total_price = sum(item.product.price * item.quantity for item in cart.items)

    order = Order(user_id=user.id, total_price=total_price, payment_intent_id="test")
    db.session.add(order)
    db.session.commit()

    for item in cart.items:
        order_item = OrderItem(order_id=order.id, product_id=item.product.id, quantity=item.quantity, price=item.product.price)
        db.session.add(order_item)

    # Clear the cart
    for item in cart.items:
        db.session.delete(item)

    db.session.commit()

    return jsonify(order.serialize()), 201

@api.route('/favorites', methods=['GET'])
@jwt_required()
def get_favorites():
    current_user_email = get_jwt_identity()
    user = User.query.filter_by(email=current_user_email).first()
    if not user:
        return jsonify({"msg": "User not found"}), 404

    return jsonify([favorite.serialize() for favorite in user.favorites]), 200

@api.route('/favorites', methods=['POST'])
@jwt_required()
def add_favorite():
    current_user_email = get_jwt_identity()
    user = User.query.filter_by(email=current_user_email).first()
    if not user:
        return jsonify({"msg": "User not found"}), 404

    data = request.get_json()
    product_id = data.get('product_id', None)

    if not product_id:
        return jsonify({"msg": "Missing product_id"}), 400

    product = Product.query.get(product_id)
    if not product:
        return jsonify({"msg": "Product not found"}), 404

    favorite = Favorite.query.filter_by(user_id=user.id, product_id=product_id).first()
    if favorite:
        return jsonify({"msg": "Product already in favorites"}), 400

    favorite = Favorite(user_id=user.id, product_id=product_id)
    db.session.add(favorite)
    db.session.commit()

    return jsonify(favorite.serialize()), 201

@api.route('/favorites/<int:favorite_id>', methods=['DELETE'])
@jwt_required()
def delete_favorite(favorite_id):
    favorite = Favorite.query.get(favorite_id)
    if not favorite:
        return jsonify({"msg": "Favorite not found"}), 404

    db.session.delete(favorite)
    db.session.commit()

    return jsonify({"msg": "Favorite deleted"}), 200

@api.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "OK"}), 200

@api.route('/cart/item/<int:item_id>', methods=['DELETE'])
@jwt_required()
def delete_cart_item(item_id):
    cart_item = CartItem.query.get(item_id)
    if not cart_item:
        return jsonify({"msg": "Cart item not found"}), 404

    db.session.delete(cart_item)
    db.session.commit()

    return jsonify(cart_item.cart.serialize()), 200
