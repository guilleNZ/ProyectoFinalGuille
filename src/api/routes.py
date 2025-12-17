from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Product, Category, Cart, CartItem, Order, OrderItem, Favorite
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
import os
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
from sqlalchemy.orm import joinedload

api = Flask(__name__)
api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()

        # Validaciones básicas
        if not data.get('email') or not data.get('password'):
            return jsonify({"msg": "Email y contraseña son requeridos"}), 400

        # Verificar si usuario existe
        existing_user = User.query.filter_by(email=data['email']).first()
        if existing_user:
            return jsonify({"msg": "El usuario ya existe"}), 400

        # Crear usuario
        hashed_password = generate_password_hash(data['password'])
        user = User(
            email=data['email'],
            password=hashed_password,
            first_name=data.get('first_name', ''),
            last_name=data.get('last_name', '')
        )

        db.session.add(user)
        db.session.flush()  # Para obtener el ID

        # Crear carrito para el usuario
        cart = Cart(user_id=user.id)
        db.session.add(cart)

        db.session.commit()

        # Crear token - CORREGIDO: Convertir user.id a string
        access_token = create_access_token(identity=str(user.id))

        return jsonify({
            "msg": "Usuario creado",
            "access_token": access_token,
            "user": user.serialize()
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Error en el servidor", "error": str(e)}), 500


@api.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()

        if not data.get('email') or not data.get('password'):
            return jsonify({"msg": "Email y contraseña son requeridos"}), 400

        # Buscar usuario
        user = User.query.filter_by(email=data['email']).first()

        if not user or not check_password_hash(user.password, data['password']):
            return jsonify({"msg": "Credenciales incorrectas"}), 401

        # Crear token - CORREGIDO: Convertir user.id a string
        access_token = create_access_token(identity=str(user.id))

        return jsonify({
            "access_token": access_token,
            "user": user.serialize()
        }), 200

    except Exception as e:
        return jsonify({"msg": "Error en el servidor", "error": str(e)}), 500


@api.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    try:
        user_id_str = get_jwt_identity()  # Obtiene el string
        user_id_int = int(user_id_str)  # Convierte a int para la consulta
        user = User.query.get(user_id_int)  # Usa el int

        if not user:
            return jsonify({"msg": "Usuario no encontrado"}), 404

        return jsonify(user.serialize()), 200

    except ValueError:  # Captura error si identity no es un número
        return jsonify({"msg": "Error interno de autenticación"}), 500
    except Exception as e:
        return jsonify({"msg": "Error en el servidor", "error": str(e)}), 500

# =============== PRODUCTS ===============


@api.route('/products', methods=['POST'])
def create_product():
    try:
        data = request.get_json()

        # Validaciones básicas (ejemplo)
        # CORRECCIÓN: Añadido 'model' a los campos requeridos
        required_fields = ['name', 'description',
                           'price', 'stock', 'brand', 'category_id', 'model']
        for field in required_fields:
            if field not in data:
                return jsonify({"msg": f"El campo '{field}' es requerido"}), 400

        # Crear el producto - CORRECCIÓN: Añadido model=data['model']
        new_product = Product(
            name=data['name'],
            description=data['description'],
            price=data['price'],
            stock=data['stock'],
            brand=data['brand'],
            model=data['model'],  # <-- Línea añadida y crucial
            # Campos opcionales: Usamos .get() para evitar KeyError si no están presentes
            material=data.get('material'),
            movement=data.get('movement'),
            case_diameter=data.get('case_diameter'),
            water_resistance=data.get('water_resistance'),
            image_url=data.get('image_url'),
            # La categoría ya existe (asumido)
            category_id=data['category_id']
        )

        db.session.add(new_product)
        db.session.commit()

        return jsonify(new_product.serialize()), 201

    except Exception as e:
        db.session.rollback()
        # Es útil loguear el error para debugging
        print(f"Error al crear producto: {e}")
        return jsonify({"msg": "Error al crear producto", "error": str(e)}), 500


@api.route('/products', methods=['GET'])
def get_products():
    try:
        products = Product.query.all()
        return jsonify([p.serialize() for p in products]), 200
    except Exception as e:
        return jsonify({"msg": "Error al obtener productos", "error": str(e)}), 500


@api.route('/products/<int:product_id>', methods=['GET'])
def get_product(product_id):
    try:
        product = Product.query.get(product_id)

        if not product:
            return jsonify({"msg": "Producto no encontrado"}), 404

        return jsonify(product.serialize()), 200
    except Exception as e:
        return jsonify({"msg": "Error al obtener producto", "error": str(e)}), 500

# =============== CART ===============


@api.route('/cart', methods=['GET'])
@jwt_required()
def get_cart():
    try:
        user_id_str = get_jwt_identity()  # Obtiene el string
        user_id_int = int(user_id_str)  # Convierte a int para la consulta

        # Obtener carrito activo o crear uno
        cart = Cart.query.filter_by(
            user_id=user_id_int, is_active=True).first()  # Usa el int

        if not cart:
            cart = Cart(user_id=user_id_int)  # Usa el int
            db.session.add(cart)
            db.session.commit()

        # Obtener items del carrito
        cart_items = CartItem.query.filter_by(cart_id=cart.id).all()

        # Obtener detalles de productos
        items_with_details = []
        total = 0

        for item in cart_items:
            product = Product.query.get(item.product_id)
            if product:
                item_data = item.serialize()
                item_data['product'] = product.serialize()
                items_with_details.append(item_data)
                total += product.price * item.quantity

        response = cart.serialize()
        response['items'] = items_with_details
        response['total'] = total

        return jsonify(response), 200

    except ValueError:  # Captura error si identity no es un número
        return jsonify({"msg": "Error interno de autenticación"}), 500
    except Exception as e:
        return jsonify({"msg": "Error al obtener carrito", "error": str(e)}), 500


@api.route('/cart/items', methods=['POST'])
@jwt_required()
def add_to_cart():
    try:
        user_id_str = get_jwt_identity()  # Obtiene el string
        user_id_int = int(user_id_str)  # Convierte a int para la consulta
        data = request.get_json()

        if not data.get('product_id') or not data.get('quantity'):
            return jsonify({"msg": "product_id y quantity son requeridos"}), 400

        # Verificar producto
        product = Product.query.get(data['product_id'])
        if not product:
            return jsonify({"msg": "Producto no encontrado"}), 404

        if product.stock < data['quantity']:
            return jsonify({"msg": "Stock insuficiente"}), 400

        # Obtener carrito
        cart = Cart.query.filter_by(
            user_id=user_id_int, is_active=True).first()  # Usa el int
        if not cart:
            cart = Cart(user_id=user_id_int)  # Usa el int
            db.session.add(cart)
            db.session.commit()

        # Verificar si ya está en el carrito
        existing_item = CartItem.query.filter_by(
            cart_id=cart.id,
            product_id=data['product_id']
        ).first()

        if existing_item:
            # Actualizar cantidad
            existing_item.quantity += data['quantity']
        else:
            # Crear nuevo item
            new_item = CartItem(
                cart_id=cart.id,
                product_id=data['product_id'],
                quantity=data['quantity']
            )
            db.session.add(new_item)

        # Actualizar stock
        product.stock -= data['quantity']

        db.session.commit()

        return jsonify({"msg": "Producto agregado al carrito"}), 200

    except ValueError:  # Captura error si identity no es un número
        return jsonify({"msg": "Error interno de autenticación"}), 500
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Error al agregar al carrito", "error": str(e)}), 500


@api.route('/cart/items/<int:item_id>', methods=['DELETE'])
@jwt_required()
def remove_from_cart(item_id):
    try:
        user_id_str = get_jwt_identity()  # Obtiene el string
        user_id_int = int(user_id_str)  # Convierte a int para la consulta

        # Primero verificar si el item pertenece al usuario correcto
        cart_item = CartItem.query.join(Cart).filter(
            CartItem.id == item_id,
            Cart.user_id == user_id_int  # Verifica pertenencia
        ).first()

        if not cart_item:
            return jsonify({"msg": "Item no encontrado o no autorizado"}), 404

        # Devolver stock
        product = Product.query.get(cart_item.product_id)
        if product:
            product.stock += cart_item.quantity

        # Eliminar item
        db.session.delete(cart_item)
        db.session.commit()

        return jsonify({"msg": "Item eliminado del carrito"}), 200

    except ValueError:  # Captura error si identity no es un número
        return jsonify({"msg": "Error interno de autenticación"}), 500
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Error al eliminar del carrito", "error": str(e)}), 500

# =============== ORDERS ===============


@api.route('/orders', methods=['POST'])
@jwt_required()
def create_order():
    try:
        user_id_str = get_jwt_identity()  # Obtiene el string
        user_id_int = int(user_id_str)  # Convierte a int para la consulta

        # Obtener carrito activo
        cart = Cart.query.filter_by(
            user_id=user_id_int, is_active=True).first()  # Usa el int
        if not cart:
            return jsonify({"msg": "Carrito no encontrado"}), 404

        cart_items = CartItem.query.filter_by(cart_id=cart.id).all()
        if not cart_items:
            return jsonify({"msg": "Carrito vacío"}), 400

        # Calcular total
        total = 0
        for item in cart_items:
            product = Product.query.get(item.product_id)
            if product:
                total += product.price * item.quantity

        # Crear orden
        order = Order(
            user_id=user_id_int,  # Usa el int
            total_amount=total,
            status="completed"  # Simulamos pago exitoso
        )
        db.session.add(order)
        db.session.flush()  # Para obtener el ID

        # Crear items de la orden
        for item in cart_items:
            product = Product.query.get(item.product_id)
            if product:
                order_item = OrderItem(
                    order_id=order.id,
                    product_id=product.id,
                    quantity=item.quantity,
                    price=product.price
                )
                db.session.add(order_item)

        # Limpiar carrito
        for item in cart_items:
            db.session.delete(item)

        cart.is_active = False
        db.session.commit()

        return jsonify({
            "msg": "Orden creada exitosamente",
            "order": order.serialize()
        }), 201

    except ValueError:  # Captura error si identity no es un número
        return jsonify({"msg": "Error interno de autenticación"}), 500
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Error al crear orden", "error": str(e)}), 500


@api.route('/orders', methods=['GET'])
@jwt_required()
def get_orders():
    try:
        user_id_str = get_jwt_identity()  # Obtiene el string
        user_id_int = int(user_id_str)  # Convierte a int para la consulta
        orders = Order.query.filter_by(user_id=user_id_int).all()  # Usa el int

        orders_data = []
        for order in orders:
            order_data = order.serialize()

            # Obtener items de la orden
            order_items = OrderItem.query.filter_by(order_id=order.id).all()
            items_data = []

            for item in order_items:
                product = Product.query.get(item.product_id)
                if product:
                    item_data = item.serialize()
                    item_data['product'] = product.serialize()
                    items_data.append(item_data)

            order_data['items'] = items_data
            orders_data.append(order_data)

        return jsonify(orders_data), 200

    except ValueError:  # Captura error si identity no es un número
        return jsonify({"msg": "Error interno de autenticación"}), 500
    except Exception as e:
        return jsonify({"msg": "Error al obtener órdenes", "error": str(e)}), 500

# =============== FAVORITES ===============


@api.route('/favorites', methods=['GET'])
@jwt_required()
def get_favorites():
    try:
        user_id_str = get_jwt_identity()  # Obtiene el string
        user_id_int = int(user_id_str)  # Convierte a int para la consulta

        # Obtener favoritos del usuario
        favorites = Favorite.query.filter_by(
            user_id=user_id_int).all()  # Usa el int

        # Obtener detalles de productos
        favorites_with_details = []
        for fav in favorites:
            product = Product.query.get(fav.product_id)
            if product:
                fav_data = fav.serialize()
                fav_data['product'] = product.serialize()
                favorites_with_details.append(fav_data)

        return jsonify(favorites_with_details), 200

    except ValueError:  # Captura error si identity no es un número
        return jsonify({"msg": "Error interno de autenticación"}), 500
    except Exception as e:
        return jsonify({"msg": "Error al obtener favoritos", "error": str(e)}), 500


@api.route('/favorites', methods=['POST'])
@jwt_required()
def add_to_favorites():
    try:
        user_id_str = get_jwt_identity()  # Obtiene el string
        user_id_int = int(user_id_str)  # Convierte a int para la consulta
        data = request.get_json()

        if not data.get('product_id'):
            return jsonify({"msg": "product_id es requerido"}), 400

        # Verificar si el producto existe
        product = Product.query.get(data['product_id'])
        if not product:
            return jsonify({"msg": "Producto no encontrado"}), 404

        # Verificar si ya está en favoritos
        existing_fav = Favorite.query.filter_by(
            user_id=user_id_int,  # Usa el int
            product_id=data['product_id']
        ).first()

        if existing_fav:
            return jsonify({"msg": "El producto ya está en favoritos"}), 400

        # Crear nuevo favorito
        favorite = Favorite(
            user_id=user_id_int,  # Usa el int
            product_id=data['product_id']
        )

        db.session.add(favorite)
        db.session.commit()

        return jsonify({
            "msg": "Producto agregado a favoritos",
            "favorite": favorite.serialize()
        }), 201

    except ValueError:  # Captura error si identity no es un número
        return jsonify({"msg": "Error interno de autenticación"}), 500
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Error al agregar a favoritos", "error": str(e)}), 500


@api.route('/favorites/<int:product_id>', methods=['DELETE'])
@jwt_required()
def remove_from_favorites(product_id):
    try:
        user_id_str = get_jwt_identity()  # Obtiene el string
        user_id_int = int(user_id_str)  # Convierte a int para la consulta

        # Buscar el favorito
        favorite = Favorite.query.filter_by(
            user_id=user_id_int,  # Usa el int
            product_id=product_id
        ).first()

        if not favorite:
            return jsonify({"msg": "El producto no está en favoritos"}), 404

        # Eliminar favorito
        db.session.delete(favorite)
        db.session.commit()

        return jsonify({"msg": "Producto eliminado de favoritos"}), 200

    except ValueError:  # Captura error si identity no es un número
        return jsonify({"msg": "Error interno de autenticación"}), 500
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Error al eliminar de favoritos", "error": str(e)}), 500


@api.route('/favorites/check/<int:product_id>', methods=['GET'])
@jwt_required()
def check_favorite(product_id):
    try:
        user_id_str = get_jwt_identity()  # Obtiene el string
        user_id_int = int(user_id_str)  # Convierte a int para la consulta

        # Verificar si el producto está en favoritos
        favorite = Favorite.query.filter_by(
            user_id=user_id_int,  # Usa el int
            product_id=product_id
        ).first()

        return jsonify({
            "is_favorite": favorite is not None,
            "favorite_id": favorite.id if favorite else None
        }), 200

    except ValueError:  # Captura error si identity no es un número
        return jsonify({"msg": "Error interno de autenticación"}), 500
    except Exception as e:
        return jsonify({"msg": "Error al verificar favorito", "error": str(e)}), 500

# =============== HEALTH CHECK ===============


@api.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "ok", "message": "API funcionando"}), 200
# ============ MANEJO DE ERRORES JWT ============
