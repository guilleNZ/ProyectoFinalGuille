from flask import request, jsonify, Blueprint
import secrets
from datetime import datetime, timedelta, timezone
import jwt
from werkzeug.security import check_password_hash
from api.models import db, Perfil, Grupo, User, Clan
from werkzeug.security import generate_password_hash
from flask_cors import CORS

api_user = Blueprint('apiUser', __name__)

# Allow CORS requests to this API
CORS(api_user)

@api_user.route('/Saluda', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Este ya es el endpoint de Los usuarios Osea de cada user de la tabla"
    }

    return jsonify(response_body), 200
