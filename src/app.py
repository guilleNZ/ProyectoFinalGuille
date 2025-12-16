"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask_jwt_extended import JWTManager
import os
from flask import Flask, request, jsonify, url_for, send_from_directory
from flask_migrate import Migrate
from flask_cors import CORS
from api.utils import APIException, generate_sitemap
from api.models import db
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands
from datetime import timedelta

ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
static_file_dir = os.path.join(os.path.dirname(
    os.path.realpath(__file__)), '../dist/')
app = Flask(__name__)
app.url_map.strict_slashes = False

# ============ CONFIGURACIÓN DE CORS COMPLETA ============
CORS(app,
     resources={r"/api/*": {"origins": "*"}},
     supports_credentials=True,
     allow_headers=["Authorization", "Content-Type", "Accept"],
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
     expose_headers=["Authorization"])
# =======================================================

# ============ CONFIGURACIÓN DE JWT ============
# Clave secreta para JWT
app.config["JWT_SECRET_KEY"] = os.environ.get(
    "JWT_SECRET_KEY", "super-secret-key-change-this")
# Extender tiempo de expiración del token (24 horas en lugar de 15 minutos)
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=24)
# Configurar token de refresh (opcional)
app.config["JWT_REFRESH_TOKEN_EXPIRES"] = timedelta(days=30)
# ==============================================

# Configuración de base de datos
db_url = os.getenv("DATABASE_URL")
if db_url is not None:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace(
        "postgres://", "postgresql://")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test.db"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
MIGRATE = Migrate(app, db, compare_type=True)
db.init_app(app)

# Configurar JWT
jwt = JWTManager(app)

# ============ DEBUG: MOSTRAR CONFIGURACIÓN JWT ============
print("=" * 60)
print("JWT CONFIGURATION DEBUG:")
print("=" * 60)
print(f"JWT_SECRET_KEY: {app.config['JWT_SECRET_KEY'][:15]}...")
print(f"JWT_SECRET_KEY length: {len(app.config['JWT_SECRET_KEY'])}")
print(f"JWT_ACCESS_TOKEN_EXPIRES: {app.config['JWT_ACCESS_TOKEN_EXPIRES']}")
print(f"JWT_REFRESH_TOKEN_EXPIRES: {app.config['JWT_REFRESH_TOKEN_EXPIRES']}")
print("=" * 60)
# ========================================================

# ============ MANEJADORES DE ERRORES DE JWT ============


@jwt.invalid_token_loader
def invalid_token_callback(error_string):
    """Manejar token inválido (devuelve 401 en lugar de 422)"""
    print(f"❌ JWT ERROR: Token inválido - {error_string}")
    return jsonify({
        "msg": "Token de acceso inválido",
        "error": error_string,
        "code": "invalid_token"
    }), 401


@jwt.expired_token_loader
def expired_token_callback(jwt_header, jwt_payload):
    """Manejar token expirado (devuelve 401 en lugar de 422)"""
    print(f"❌ JWT ERROR: Token expirado - {jwt_payload}")
    return jsonify({
        "msg": "Tu sesión ha expirado. Por favor, inicia sesión nuevamente.",
        "error": "Token expirado",
        "code": "token_expired"
    }), 401


@jwt.unauthorized_loader
def unauthorized_callback(error_string):
    """Manejar solicitud sin token"""
    print(f"❌ JWT ERROR: No autorizado - {error_string}")
    return jsonify({
        "msg": "Acceso no autorizado. Se requiere autenticación.",
        "error": error_string,
        "code": "missing_token"
    }), 401


@jwt.needs_fresh_token_loader
def needs_fresh_token_callback(jwt_header, jwt_payload):
    """Manejar token que necesita refresco"""
    print(f"⚠️ JWT WARNING: Token no fresco - {jwt_payload}")
    return jsonify({
        "msg": "Se requiere un token fresco para esta acción",
        "error": "Token no fresco",
        "code": "fresh_token_required"
    }), 401

# ============ MIDDLEWARE PARA LOGGING ============


@app.before_request
def log_request_info():
    """Loggear información de cada request para debug"""
    if request.path.startswith('/api/'):
        print("\n" + "=" * 60)
        print(f"📦 REQUEST: {request.method} {request.path}")
        print(f"📦 Headers: {dict(request.headers)}")

        # Loggear token JWT si existe
        auth_header = request.headers.get('Authorization', '')
        if auth_header:
            print(f"📦 Authorization: {auth_header[:50]}...")

        # Loggear body para POST/PUT
        if request.method in ['POST', 'PUT', 'PATCH']:
            try:
                data = request.get_json(silent=True)
                if data:
                    print(f"📦 Body: {data}")
            except:
                print("📦 Body: (no JSON or cannot parse)")
        print("=" * 60 + "\n")


@app.after_request
def log_response_info(response):
    """Loggear información de cada response para debug"""
    if request.path.startswith('/api/'):
        print("\n" + "=" * 60)
        print(
            f"📤 RESPONSE: {request.method} {request.path} -> {response.status}")

        # Loggear respuesta para errores
        if response.status_code >= 400:
            try:
                # Hacer una copia del response para poder leerlo
                from io import BytesIO
                data = response.get_data()
                print(f"📤 Error Response: {data.decode('utf-8')}")
            except:
                print("📤 Error Response: (cannot read)")

        print("=" * 60 + "\n")
    return response
# =================================================


# Configurar admin
setup_admin(app)

# Configurar comandos
setup_commands(app)

# Registrar blueprints
app.register_blueprint(api, url_prefix='/api')

# Manejo de errores de API


@app.errorhandler(APIException)
def handle_invalid_usage(error):
    print(f"💥 API Exception: {error}")
    return jsonify(error.to_dict()), error.status_code

# Generar sitemap


@app.route('/')
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, 'index.html')

# Servir archivos estáticos


@app.route('/<path:path>', methods=['GET'])
def serve_any_other_file(path):
    if not os.path.isfile(os.path.join(static_file_dir, path)):
        path = 'index.html'
    response = send_from_directory(static_file_dir, path)
    response.cache_control.max_age = 0  # evitar cache
    return response


# Ejecutar aplicación
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    print("\n" + "=" * 60)
    print(f"🚀 Starting Flask server on port {PORT}")
    print(f"🌐 Environment: {ENV}")
    print(f"🔑 JWT Secret Key configured: {bool(app.config['JWT_SECRET_KEY'])}")
    print("=" * 60 + "\n")
    app.run(host='0.0.0.0', port=PORT, debug=True)
