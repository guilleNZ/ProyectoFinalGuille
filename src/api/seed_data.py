""" # src/seed_data.py
# Script independiente para poblar la base de datos con datos iniciales (categorías, usuarios, productos).
# Debe ejecutarse desde la RAÍZ del proyecto como: python -m src.seed_data
# O se puede integrar en src/app.py para que se ejecute automáticamente al iniciar el servidor.

import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from werkzeug.security import generate_password_hash
from datetime import timedelta

# --- 1. Crear la aplicación Flask y configurarla ---
app = Flask(__name__)

# Cargar configuración de la base de datos
db_url = os.getenv("DATABASE_URL")
if db_url:
    # Reemplazar postgres:// por postgresql:// si es necesario para SQLAlchemy 2.x
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace(
        "postgres://", "postgresql://")
else:
    # Fallback a SQLite para desarrollo local si no hay DATABASE_URL
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test.db"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
# Configuración JWT (necesaria si se inicializa JWTManager, aunque no se use aquí directamente)
app.config["JWT_SECRET_KEY"] = os.environ.get(
    "JWT_SECRET_KEY", "super-secret-key-change-this")
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=24)

# --- 2. Inicializar SQLAlchemy ---
db = SQLAlchemy()
db.init_app(app)  # <-- IMPORTANTE: Registra db con la app

# --- 3. Importar modelos DENTRO del contexto de la app ---
# Usamos una función para envolver la lógica y asegurar que se ejecute dentro del contexto de la app


def populate_database():
    # Importa los modelos después de que db.init_app(app) se haya llamado
    # La ruta es relativa al paquete src
    from api.models import User, Category, Product, Cart

    print("Inicializando base de datos...")

    # Crear todas las tablas (esto borra y recrea si ya existen)
    with app.app_context():  # <-- Creamos el contexto de la aplicación
        print("Eliminando tablas existentes...")
        db.drop_all()
        print("Creando tablas nuevas...")
        db.create_all()

        print("Populando datos...")

        # --- Crear Categorías ---
        print("  - Creando categorías...")
        categories_data = [
            {"name": "Deportivos", "description": "Relojes resistentes para actividades"},
            {"name": "Clásicos", "description": "Relojes elegantes y atemporales"},
            {"name": "Lujo", "description": "Relojes de alta gama y prestigio"},
            {"name": "Cronógrafos", "description": "Relojes con función de cronómetro"},
            {"name": "Buceo", "description": "Relojes resistentes al agua para actividades acuáticas"}
        ]
        categories = []
        for cat_data in categories_data:  # <-- CORREGIDO: Se añadió '_data'
            category = Category(**cat_data)
            db.session.add(category)
            categories.append(category)

        db.session.commit()
        print(f"    ✅ {len(categories)} categorías creadas.")

        # --- Crear Usuarios ---
        print("  - Creando usuarios...")
        # Usuario admin
        admin_user = User(
            email="admin@luxurywatches.com",
            password=generate_password_hash("admin123"),
            is_active=True,
            first_name="Admin",
            last_name="User"
        )
        db.session.add(admin_user)

        # Usuario cliente de prueba
        test_user = User(
            email="cliente@luxurywatches.com",
            password=generate_password_hash("cliente123"),
            is_active=True,
            first_name="Juan",
            last_name="Pérez",
            address="Calle Principal 123, Madrid",
            phone="+34 600 000 000"
        )
        db.session.add(test_user)

        db.session.commit()
        print("    ✅ Usuarios (admin y cliente) creados.")

        # --- Crear Productos (Relojes de Lujo) ---
        print("  - Creando productos...")
        watches = [
            # ROLEX
            {
                "name": "Rolex Daytona Paul Newman",
                "description": "Icono legendario del mundo de los relojes...",
                "price": 85000.00,
                "stock": 2,
                "brand": "Rolex",
                "model": "Daytona 6263",
                "material": "Acero inoxidable",
                "movement": "Cronógrafo manual",
                "case_diameter": "37mm",
                "water_resistance": "100m",
                "image_url": "https://i.pinimg.com/1200x/f7/b5/0d/f7b50d0e68e7a9b2a7188a4c06621bd7.jpg",
                "category_id": 4  # Cronógrafos (ID 4)
            },
            {
                "name": "Rolex Day-Date 'President'",
                "description": "Símbolo de éxito y prestigio...",
                "price": 42000.00,
                "stock": 5,
                "brand": "Rolex",
                "model": "Day-Date 228238",
                "material": "Oro amarillo 18k",
                "movement": "Automático calibre 3255",
                "case_diameter": "36mm",
                "water_resistance": "100m",
                "image_url": "https://i.pinimg.com/1200x/87/5a/5a/875a5aade41dea1acd3fcbd0b1df203b.jpg",
                "category_id": 3  # Lujo (ID 3)
            },
            {
                "name": "Rolex GMT-Master II 'Pepsi'",
                "description": "Famoso por su bisel bicolor rojo y azul 'Pepsi'...",
                "price": 12500.00,
                "stock": 8,
                "brand": "Rolex",
                "model": "GMT-Master II 126710BLRO",
                "material": "Acero Oystersteel",
                "movement": "Automático calibre 3285",
                "case_diameter": "40mm",
                "water_resistance": "100m",
                "image_url": "https://i.pinimg.com/1200x/a4/1f/e6/a41fe6b31142b297f34340d697746c85.jpg",
                "category_id": 1  # Deportivos (ID 1)
            },

            # OMEGA
            {
                "name": "Omega Speedmaster Moonwatch",
                "description": "El legendario reloj que viajó a la luna...",
                "price": 7500.00,
                "stock": 12,
                "brand": "Omega",
                "model": "Speedmaster Professional",
                "material": "Acero inoxidable",
                "movement": "Mecánico manual calibre 1861",
                "case_diameter": "42mm",
                "water_resistance": "50m",
                "image_url": "https://i.pinimg.com/1200x/f0/a4/58/f0a458b8be54881ee60829d40a9d2293.jpg",
                "category_id": 4  # Cronógrafos (ID 4)
            },
            {
                "name": "Omega Seamaster Diver 300M",
                "description": "Reloj de buceo profesional con 300m de resistencia al agua...",
                "price": 5800.00,
                "stock": 15,
                "brand": "Omega",
                "model": "Seamaster 210.30.42.20.03.001",
                "material": "Acero inoxidable",
                "movement": "Automático Co-Axial 8800",
                "case_diameter": "42mm",
                "water_resistance": "300m",
                "image_url": "https://i.pinimg.com/736x/2a/12/ab/2a12ab9f2ed2f0dcfcf99fa12c8f43b6.jpg",
                "category_id": 5  # Buceo (ID 5)
            },
            {
                "name": "Omega Railmaster",
                "description": "Homenaje a los relojes antimagnéticos históricos de Omega...",
                "price": 5200.00,
                "stock": 7,
                "brand": "Omega",
                "model": "Railmaster 220.10.40.20.01.001",
                "material": "Acero inoxidable",
                "movement": "Automático Co-Axial 8806",
                "case_diameter": "40mm",
                "water_resistance": "150m",
                "image_url": "https://i.pinimg.com/1200x/b8/7d/0a/b87d0a16aab923bb044aadca28010d11.jpg",
                "category_id": 2  # Clásicos (ID 2)
            },

            # PATEK PHILIPPE
            {
                "name": "Patek Philippe Nautilus 5711/1A-010",
                "description": "Icono del diseño relojero con caja de acero octogonal...",
                "price": 85000.00,
                "stock": 1,
                "brand": "Patek Philippe",
                "model": "Nautilus 5711/1A-010",
                "material": "Acero inoxidable",
                "movement": "Automático calibre 26-330 S C",
                "case_diameter": "40mm",
                "water_resistance": "120m",
                "image_url": "https://i.pinimg.com/736x/b4/cf/67/b4cf6768b677d5a414a622c3c84ce707.jpg",
                "category_id": 3  # Lujo (ID 3)
            },
            {
                "name": "Patek Philippe Aquanaut 5168G-001",
                "description": "Reloj deportivo de lujo con correa de caucho integrada...",
                "price": 65000.00,
                "stock": 3,
                "brand": "Patek Philippe",
                "model": "Aquanaut 5168G-001",
                "material": "Oro blanco",
                "movement": "Automático calibre 324 S C",
                "case_diameter": "42.2mm",
                "water_resistance": "120m",
                "image_url": "https://i.pinimg.com/1200x/9d/86/fd/9d86fd464ebc3a512f1d7bf13ba3cff8.jpg",
                "category_id": 3  # Lujo (ID 3)
            },
            {
                "name": "Patek Philippe Calatrava 5212A-001",
                "description": "Elegante reloj de vestir con función de calendario semanal...",
                "price": 48000.00,
                "stock": 4,
                "brand": "Patek Philippe",
                "model": "Calatrava 5212A-001",
                "material": "Acero inoxidable",
                "movement": "Automático calibre 26‑330 S C",
                "case_diameter": "40mm",
                "water_resistance": "30m",
                "image_url": "https://i.pinimg.com/1200x/03/18/3c/03183c4811f60823bb8606972a09344f.jpg",
                "category_id": 2  # Clásicos (ID 2)
            },

            # AUDEMARS PIGUET
            {
                "name": "Audemars Piguet Code 11.59",
                "description": "Nueva colección que combina caja redonda con puente octogonal...",
                "price": 35000.00,
                "stock": 6,
                "brand": "Audemars Piguet",
                "model": "Code 11.59",
                "material": "Oro rosa 18k",
                "movement": "Automático calibre 4302",
                "case_diameter": "41mm",
                "water_resistance": "30m",
                "image_url": "https://i.pinimg.com/736x/d7/97/22/d7972256ee16d19b073208064de8bdf2.jpg",
                "category_id": 3  # Lujo (ID 3)
            },
            {
                "name": "Audemars Piguet Royal Oak",
                "description": "Obra maestra del diseño con caja octogonal y tornillos visibles...",
                "price": 75000.00,
                "stock": 2,
                "brand": "Audemars Piguet",
                "model": "Royal Oak 15407ST.OO.1220ST.01",
                "material": "Acero inoxidable",
                "movement": "Automático calibre 5122",
                "case_diameter": "41mm",
                "water_resistance": "50m",
                "image_url": "https://i.pinimg.com/1200x/e0/e3/93/e0e3932c5653a031708683587513cf7d.jpg",
                "category_id": 3  # Lujo (ID 3)
            },
            {
                "name": "Audemars Piguet Royal Oak Selfwinding",
                "description": "Versión clásica del Royal Oak con esfera azul 'Tapisserie'...",
                "price": 28000.00,
                "stock": 8,
                "brand": "Audemars Piguet",
                "model": "Royal Oak 15500ST.OO.1220ST.01",
                "material": "Acero inoxidable",
                "movement": "Automático calibre 4302",
                "case_diameter": "41mm",
                "water_resistance": "50m",
                "image_url": "https://i.pinimg.com/736x/95/8a/04/958a048dcb6fa25800ae04393074ea53.jpg",
                "category_id": 3  # Lujo (ID 3)
            },

            # TAG HEUER
            {
                "name": "TAG Heuer Autavia CBE2110",
                "description": "Cronógrafo inspirado en los relojes de aviación históricos...",
                "price": 5200.00,
                "stock": 10,
                "brand": "Tag Heuer",
                "model": "Autavia CBE2110",
                "material": "Acero inoxidable",
                "movement": "Automático calibre Heuer 02",
                "case_diameter": "42mm",
                "water_resistance": "100m",
                "image_url": "https://i.pinimg.com/1200x/cc/a0/03/cca00391ee50b0e373870ee1f982d94c.jpg",
                "category_id": 4  # Cronógrafos (ID 4)
            },
            {
                "name": "TAG Heuer Carrera CBS2216",
                "description": "Cronógrafo deportivo con esqueleto que muestra el movimiento mecánico...",
                "price": 6800.00,
                "stock": 9,
                "brand": "Tag Heuer",
                "model": "Carrera CBS2216",
                "material": "Acero y vidrio zafiro",
                "movement": "Automático calibre Heuer 01",
                "case_diameter": "45mm",
                "water_resistance": "100m",
                "image_url": "https://i.pinimg.com/736x/16/ec/68/16ec683ce14341557a6a95c7ad036992.jpg",
                "category_id": 4  # Cronógrafos (ID 4)
            },
            {
                "name": "TAG Heuer Monza Flyback Chronometer CR5090",
                "description": "Homenaje al cronógrafo Monza de 1976...",
                "price": 7500.00,
                "stock": 5,
                "brand": "Tag Heuer",
                "model": "Monza CR5090",
                "material": "Acero inoxidable",
                "movement": "Automático calibre Heuer 02",
                "case_diameter": "42mm",
                "water_resistance": "100m",
                "image_url": "https://i.pinimg.com/1200x/9a/fd/78/9afd784ce8f8f812c64e4a288c073b97.jpg",
                "category_id": 4  # Cronógrafos (ID 4)
            },

            # BREITLING
            {
                "name": "Breitling Navitimer",
                "description": "Icono de la aviación con regla de cálculo circular...",
                "price": 8900.00,
                "stock": 11,
                "brand": "Breitling",
                "model": "Navitimer B01 Chronograph 43",
                "material": "Acero inoxidable",
                "movement": "Automático calibre B01",
                "case_diameter": "43mm",
                "water_resistance": "30m",
                "image_url": "https://i.pinimg.com/1200x/27/01/ff/2701ff8c578798959a004847e138b5f2.jpg",
                "category_id": 4  # Cronógrafos (ID 4)
            },
            {
                "name": "Breitling Superocean",
                "description": "Reloj de buceo profesional con 1000m de resistencia al agua...",
                "price": 4500.00,
                "stock": 14,
                "brand": "Breitling",
                "model": "Superocean A17367D71C1S1",
                "material": "Acero inoxidable",
                "movement": "Automático Breitling 17",
                "case_diameter": "42mm",
                "water_resistance": "1000m",
                "image_url": "https://i.pinimg.com/1200x/d0/33/11/d033115627bc39a7a14d2643d7ea7252.jpg",
                "category_id": 5  # Buceo (ID 5)
            },
            {
                "name": "Breitling Avenger",
                "description": "Reloj táctico diseñado para condiciones extremas...",
                "price": 5200.00,
                "stock": 8,
                "brand": "Breitling",
                "model": "Avenger Blackbird A17314101B1X1",
                "material": "Acero inoxidable DLC negro",
                "movement": "Automático Breitling 17",
                "case_diameter": "48mm",
                "water_resistance": "300m",
                "image_url": "https://i.pinimg.com/1200x/3d/88/7b/3d887b56b378e60f359ff7000d2173ec.jpg",
                "category_id": 1  # Deportivos (ID 1)
            }
        ]

        for watch_data in watches:
            product = Product(**watch_data)
            db.session.add(product)

        db.session.commit()
        print(f"    ✅ {len(watches)} productos (relojes) creados.")

        # --- Crear Carritos para los Usuarios ---
        print("  - Creando carritos...")
        users = User.query.all()
        for user in users:
            cart = Cart(user_id=user.id)
            db.session.add(cart)

        db.session.commit()
        print(f"    ✅ Carritos creados para {len(users)} usuarios.")

        print("\n" + "="*60)
        print("🎉 ¡Base de datos poblada exitosamente!")
        print("="*60)
        print(f"📊 Categorías: {len(categories)}")
        print(f"👥 Usuarios: {len(users)}")
        print(f"⌚ Productos: {len(watches)}")
        print(f"🛒 Carritos: {len(users)}")
        print("="*60)

        # Mostrar algunos IDs para referencia (opcional)
        print("\n🔍 Algunos IDs creados:")
        print(
            f"  - Usuario Cliente: {test_user.id} (email: {test_user.email})")
        print(
            f"  - Producto 'Rolex Daytona': ID {Product.query.filter_by(model='Daytona 6263').first().id if Product.query.filter_by(model='Daytona 6263').first() else 'No encontrado'}")
        # Lujo es el índice 2
        print(f"  - Categoría 'Lujo': ID {categories[2].id}")


if __name__ == "__main__":
    # Ejecuta la función dentro del contexto de la aplicación Flask
    with app.app_context():
        populate_database()
 """

""" import os
from flask import Flask
from werkzeug.security import generate_password_hash
# Importamos el db original desde tu archivo de modelos
from api.models import db, User, Category, Product, Cart


def populate_database():
    # Ya no necesitamos crear app ni db aquí,
    # usamos el contexto que nos da app.py

    print("Inicializando base de datos...")

    # IMPORTANTE: Solo usa drop_all() si realmente quieres borrar todo
    # cada vez que reinicies el servidor.
    print("Eliminando tablas existentes...")
    db.drop_all()
    print("Creando tablas nuevas...")
    db.create_all()

    # --- Crear Categorías ---
    print("  - Creando categorías...")
    categories_data = [
        {"name": "Deportivos", "description": "Relojes resistentes para actividades"},
        {"name": "Clásicos", "description": "Relojes elegantes y atemporales"},
        {"name": "Lujo", "description": "Relojes de alta gama y prestigio"},
        {"name": "Cronógrafos", "description": "Relojes con función de cronómetro"},
        {"name": "Buceo", "description": "Relojes resistentes al agua para actividades acuáticas"}
    ]
    categories = []
    for cat_data in categories_data:  # <-- CORREGIDO: Se añadió '_data'
        category = Category(**cat_data)
        db.session.add(category)
        categories.append(category)

    db.session.commit()
    print(f"    ✅ {len(categories)} categorías creadas.")
    # Asegúrate de usar db.session (que viene de api.models)

    print("  - Creando usuarios...")
    # Usuario admin
    admin_user = User(
        email="admin@luxurywatches.com",
        password=generate_password_hash("admin123"),
        is_active=True,
        first_name="Admin",
        last_name="User")
    db.session.add(admin_user)

    # Usuario cliente de prueba
    test_user = User(
        email="cliente@luxurywatches.com",
        password=generate_password_hash("cliente123"),
        is_active=True,
        first_name="Juan",
        last_name="Pérez",
        address="Calle Principal 123, Madrid",
        phone="+34 600 000 000")
    db.session.add(test_user)
    db.session.commit()
    print("    ✅ Usuarios (admin y cliente) creados.")

    # --- Crear Productos (Relojes de Lujo) ---
    print("  - Creando productos...")
    watches = [
        # ROLEX
        {
            "name": "Rolex Daytona Paul Newman",
            "description": "Icono legendario del mundo de los relojes...",
            "price": 85000.00,
            "stock": 2,
            "brand": "Rolex",
            "model": "Daytona 6263",
            "material": "Acero inoxidable",
            "movement": "Cronógrafo manual",
            "case_diameter": "37mm",
            "water_resistance": "100m",
            "image_url": "https://i.pinimg.com/1200x/f7/b5/0d/f7b50d0e68e7a9b2a7188a4c06621bd7.jpg",
            "category_id": 4  # Cronógrafos (ID 4)
        },
        {
            "name": "Rolex Day-Date 'President'",
            "description": "Símbolo de éxito y prestigio...",
            "price": 42000.00,
            "stock": 5,
            "brand": "Rolex",
            "model": "Day-Date 228238",
            "material": "Oro amarillo 18k",
            "movement": "Automático calibre 3255",
            "case_diameter": "36mm",
            "water_resistance": "100m",
            "image_url": "https://i.pinimg.com/1200x/87/5a/5a/875a5aade41dea1acd3fcbd0b1df203b.jpg",
            "category_id": 3  # Lujo (ID 3)
        },
        {
            "name": "Rolex GMT-Master II 'Pepsi'",
            "description": "Famoso por su bisel bicolor rojo y azul 'Pepsi'...",
            "price": 12500.00,
            "stock": 8,
            "brand": "Rolex",
            "model": "GMT-Master II 126710BLRO",
            "material": "Acero Oystersteel",
            "movement": "Automático calibre 3285",
            "case_diameter": "40mm",
            "water_resistance": "100m",
            "image_url": "https://i.pinimg.com/1200x/a4/1f/e6/a41fe6b31142b297f34340d697746c85.jpg",
            "category_id": 1  # Deportivos (ID 1)
        },

        # OMEGA
        {
            "name": "Omega Speedmaster Moonwatch",
            "description": "El legendario reloj que viajó a la luna...",
            "price": 7500.00,
            "stock": 12,
            "brand": "Omega",
            "model": "Speedmaster Professional",
            "material": "Acero inoxidable",
            "movement": "Mecánico manual calibre 1861",
            "case_diameter": "42mm",
            "water_resistance": "50m",
            "image_url": "https://i.pinimg.com/1200x/f0/a4/58/f0a458b8be54881ee60829d40a9d2293.jpg",
            "category_id": 4  # Cronógrafos (ID 4)
        },
        {
            "name": "Omega Seamaster Diver 300M",
            "description": "Reloj de buceo profesional con 300m de resistencia al agua...",
            "price": 5800.00,
            "stock": 15,
            "brand": "Omega",
            "model": "Seamaster 210.30.42.20.03.001",
            "material": "Acero inoxidable",
            "movement": "Automático Co-Axial 8800",
            "case_diameter": "42mm",
            "water_resistance": "300m",
            "image_url": "https://i.pinimg.com/736x/2a/12/ab/2a12ab9f2ed2f0dcfcf99fa12c8f43b6.jpg",
            "category_id": 5  # Buceo (ID 5)
        },
        {
            "name": "Omega Railmaster",
            "description": "Homenaje a los relojes antimagnéticos históricos de Omega...",
            "price": 5200.00,
            "stock": 7,
            "brand": "Omega",
            "model": "Railmaster 220.10.40.20.01.001",
            "material": "Acero inoxidable",
            "movement": "Automático Co-Axial 8806",
            "case_diameter": "40mm",
            "water_resistance": "150m",
            "image_url": "https://i.pinimg.com/1200x/b8/7d/0a/b87d0a16aab923bb044aadca28010d11.jpg",
            "category_id": 2  # Clásicos (ID 2)
        },

        # PATEK PHILIPPE
        {
            "name": "Patek Philippe Nautilus 5711/1A-010",
            "description": "Icono del diseño relojero con caja de acero octogonal...",
            "price": 85000.00,
            "stock": 1,
            "brand": "Patek Philippe",
            "model": "Nautilus 5711/1A-010",
            "material": "Acero inoxidable",
            "movement": "Automático calibre 26-330 S C",
            "case_diameter": "40mm",
            "water_resistance": "120m",
            "image_url": "https://i.pinimg.com/736x/b4/cf/67/b4cf6768b677d5a414a622c3c84ce707.jpg",
            "category_id": 3  # Lujo (ID 3)
        },
        {
            "name": "Patek Philippe Aquanaut 5168G-001",
            "description": "Reloj deportivo de lujo con correa de caucho integrada...",
            "price": 65000.00,
            "stock": 3,
            "brand": "Patek Philippe",
            "model": "Aquanaut 5168G-001",
            "material": "Oro blanco",
            "movement": "Automático calibre 324 S C",
            "case_diameter": "42.2mm",
            "water_resistance": "120m",
            "image_url": "https://i.pinimg.com/1200x/9d/86/fd/9d86fd464ebc3a512f1d7bf13ba3cff8.jpg",
            "category_id": 3  # Lujo (ID 3)
        },
        {
            "name": "Patek Philippe Calatrava 5212A-001",
            "description": "Elegante reloj de vestir con función de calendario semanal...",
            "price": 48000.00,
            "stock": 4,
            "brand": "Patek Philippe",
            "model": "Calatrava 5212A-001",
            "material": "Acero inoxidable",
            "movement": "Automático calibre 26‑330 S C",
            "case_diameter": "40mm",
            "water_resistance": "30m",
            "image_url": "https://i.pinimg.com/1200x/03/18/3c/03183c4811f60823bb8606972a09344f.jpg",
            "category_id": 2  # Clásicos (ID 2)
        },

        # AUDEMARS PIGUET
        {
            "name": "Audemars Piguet Code 11.59",
            "description": "Nueva colección que combina caja redonda con puente octogonal...",
            "price": 35000.00,
            "stock": 6,
            "brand": "Audemars Piguet",
            "model": "Code 11.59",
            "material": "Oro rosa 18k",
            "movement": "Automático calibre 4302",
            "case_diameter": "41mm",
            "water_resistance": "30m",
            "image_url": "https://i.pinimg.com/736x/d7/97/22/d7972256ee16d19b073208064de8bdf2.jpg",
            "category_id": 3  # Lujo (ID 3)
        },
        {
            "name": "Audemars Piguet Royal Oak",
            "description": "Obra maestra del diseño con caja octogonal y tornillos visibles...",
            "price": 75000.00,
            "stock": 2,
            "brand": "Audemars Piguet",
            "model": "Royal Oak 15407ST.OO.1220ST.01",
            "material": "Acero inoxidable",
            "movement": "Automático calibre 5122",
            "case_diameter": "41mm",
            "water_resistance": "50m",
            "image_url": "https://i.pinimg.com/1200x/e0/e3/93/e0e3932c5653a031708683587513cf7d.jpg",
            "category_id": 3  # Lujo (ID 3)
        },
        {
            "name": "Audemars Piguet Royal Oak Selfwinding",
            "description": "Versión clásica del Royal Oak con esfera azul 'Tapisserie'...",
            "price": 28000.00,
            "stock": 8,
            "brand": "Audemars Piguet",
            "model": "Royal Oak 15500ST.OO.1220ST.01",
            "material": "Acero inoxidable",
            "movement": "Automático calibre 4302",
            "case_diameter": "41mm",
            "water_resistance": "50m",
            "image_url": "https://i.pinimg.com/736x/95/8a/04/958a048dcb6fa25800ae04393074ea53.jpg",
            "category_id": 3  # Lujo (ID 3)
        },

        # TAG HEUER
        {
            "name": "TAG Heuer Autavia CBE2110",
            "description": "Cronógrafo inspirado en los relojes de aviación históricos...",
            "price": 5200.00,
            "stock": 10,
            "brand": "Tag Heuer",
            "model": "Autavia CBE2110",
            "material": "Acero inoxidable",
            "movement": "Automático calibre Heuer 02",
            "case_diameter": "42mm",
            "water_resistance": "100m",
            "image_url": "https://i.pinimg.com/1200x/cc/a0/03/cca00391ee50b0e373870ee1f982d94c.jpg",
            "category_id": 4  # Cronógrafos (ID 4)
        },
        {
            "name": "TAG Heuer Carrera CBS2216",
            "description": "Cronógrafo deportivo con esqueleto que muestra el movimiento mecánico...",
            "price": 6800.00,
            "stock": 9,
            "brand": "Tag Heuer",
            "model": "Carrera CBS2216",
            "material": "Acero y vidrio zafiro",
            "movement": "Automático calibre Heuer 01",
            "case_diameter": "45mm",
            "water_resistance": "100m",
            "image_url": "https://i.pinimg.com/736x/16/ec/68/16ec683ce14341557a6a95c7ad036992.jpg",
            "category_id": 4  # Cronógrafos (ID 4)
        },
        {
            "name": "TAG Heuer Monza Flyback Chronometer CR5090",
            "description": "Homenaje al cronógrafo Monza de 1976...",
            "price": 7500.00,
            "stock": 5,
            "brand": "Tag Heuer",
            "model": "Monza CR5090",
            "material": "Acero inoxidable",
            "movement": "Automático calibre Heuer 02",
            "case_diameter": "42mm",
            "water_resistance": "100m",
            "image_url": "https://i.pinimg.com/1200x/9a/fd/78/9afd784ce8f8f812c64e4a288c073b97.jpg",
            "category_id": 4  # Cronógrafos (ID 4)
        },

        # BREITLING
        {
            "name": "Breitling Navitimer",
            "description": "Icono de la aviación con regla de cálculo circular...",
            "price": 8900.00,
            "stock": 11,
            "brand": "Breitling",
            "model": "Navitimer B01 Chronograph 43",
            "material": "Acero inoxidable",
            "movement": "Automático calibre B01",
            "case_diameter": "43mm",
            "water_resistance": "30m",
            "image_url": "https://i.pinimg.com/1200x/27/01/ff/2701ff8c578798959a004847e138b5f2.jpg",
            "category_id": 4  # Cronógrafos (ID 4)
        },
        {
            "name": "Breitling Superocean",
            "description": "Reloj de buceo profesional con 1000m de resistencia al agua...",
            "price": 4500.00,
            "stock": 14,
            "brand": "Breitling",
            "model": "Superocean A17367D71C1S1",
            "material": "Acero inoxidable",
            "movement": "Automático Breitling 17",
            "case_diameter": "42mm",
            "water_resistance": "1000m",
            "image_url": "https://i.pinimg.com/1200x/d0/33/11/d033115627bc39a7a14d2643d7ea7252.jpg",
            "category_id": 5  # Buceo (ID 5)
        },
        {
            "name": "Breitling Avenger",
            "description": "Reloj táctico diseñado para condiciones extremas...",
            "price": 5200.00,
            "stock": 8,
            "brand": "Breitling",
            "model": "Avenger Blackbird A17314101B1X1",
            "material": "Acero inoxidable DLC negro",
            "movement": "Automático Breitling 17",
            "case_diameter": "48mm",
            "water_resistance": "300m",
            "image_url": "https://i.pinimg.com/1200x/3d/88/7b/3d887b56b378e60f359ff7000d2173ec.jpg",
            "category_id": 1  # Deportivos (ID 1)
        }
    ]
    for watch_data in watches:
     product = Product(**watch_data)
     db.session.add(product)
    db.session.commit()
    print(f"    ✅ {len(watches)} productos (relojes) creados.")
    print("  - Creando carritos...")
users = User.query.all()
for user in users:
    cart = Cart(user_id=user.id)
    db.session.add(cart)
db.session.commit()
print(f"    ✅ Carritos creados para {len(users)} usuarios.")

print("\n" + "="*60)
print("🎉 ¡Base de datos poblada exitosamente!")
print("="*60)
#print(f"📊 Categorías: {len(categories)}")
print(f"👥 Usuarios: {len(users)}")
#print(f"⌚ Productos: {len(watches)}")
print(f"🛒 Carritos: {len(users)}")
print("="*60)

# Mostrar algunos IDs para referencia (opcional)
print("\n🔍 Algunos IDs creados:")
#print(
    #f"  - Usuario Cliente: {test_user.id} (email: {test_user.email})")
print(
    f"  - Producto 'Rolex Daytona': ID {Product.query.filter_by(model='Daytona 6263').first().id if Product.query.filter_by(model='Daytona 6263').first() else 'No encontrado'}")
# Lujo es el índice 2
#print(f"  - Categoría 'Lujo': ID {categories[2].id}")


#if __name__ == "__main__":
    # Ejecuta la función dentro del contexto de la aplicación Flask
    #with app.app_context():
        #populate_database()
    # Al final, el commit usará la conexión correcta:
db.session.commit()
print("🎉 ¡Base de datos poblada exitosamente!")
 """

import os
from flask import Flask
from werkzeug.security import generate_password_hash
# Importamos db y modelos desde el archivo central de modelos
from api.models import db, User, Category, Product, Cart

def populate_database():
    """
    Función para poblar la base de datos. 
    Se debe llamar siempre dentro de un app_context.
    """
    print("🚀 Iniciando proceso de seeding...")

    # 1. Limpieza (Opcional: Borra todo para evitar duplicados)
    print("  - Limpiando tablas existentes...")
    db.drop_all()
    db.create_all()

    # 2. Crear Categorías
    print("  - Creando categorías...")
    categories_data = [
        {"name": "Deportivos", "description": "Relojes resistentes para actividades"},
        {"name": "Clásicos", "description": "Relojes elegantes y atemporales"},
        {"name": "Lujo", "description": "Relojes de alta gama y prestigio"},
        {"name": "Cronógrafos", "description": "Relojes con función de cronómetro"},
        {"name": "Buceo", "description": "Relojes resistentes al agua"}
    ]
    
    # Diccionario para mapear nombres a objetos y facilitar la asignación de productos
    cat_objects = {}
    for data in categories_data:
        category = Category(**data)
        db.session.add(category)
        cat_objects[data["name"]] = category

    db.session.commit() # Commit intermedio para obtener IDs

    # 3. Crear Usuarios
    print("  - Creando usuarios...")
    admin = User(
        email="admin@luxurywatches.com",
        password=generate_password_hash("admin123"),
        is_active=True,
        first_name="Admin",
        last_name="User"
    )
    cliente = User(
        email="cliente@luxurywatches.com",
        password=generate_password_hash("cliente123"),
        is_active=True,
        first_name="Juan",
        last_name="Pérez"
    )
    db.session.add_all([admin, cliente])
    db.session.commit()

    # 4. Crear Productos (Relojes)
    print("  - Creando productos...")
    watches = [
        {
            "name": "Rolex Daytona Paul Newman",
            "description": "Icono legendario del mundo de los relojes...",
            "price": 85000.00,
            "stock": 2,
            "brand": "Rolex",
            "model": "Daytona 6263",
            "material": "Acero inoxidable",
            "movement": "Cronógrafo manual",
            "case_diameter": "37mm",
            "water_resistance": "100m",
            "image_url": "https://i.pinimg.com/1200x/f7/b5/0d/f7b50d0e68e7a9b2a7188a4c06621bd7.jpg",
            "category_id": cat_objects["Cronógrafos"].id
        },
        {
            "name": "Rolex Day-Date 'President'",
            "description": "Símbolo de éxito y prestigio...",
            "price": 42000.00,
            "stock": 5,
            "brand": "Rolex",
            "model": "Day-Date 228238",
            "material": "Oro amarillo 18k",
            "movement": "Automático calibre 3255",
            "case_diameter": "36mm",
            "water_resistance": "100m",
            "image_url": "https://i.pinimg.com/1200x/87/5a/5a/875a5aade41dea1acd3fcbd0b1df203b.jpg",
            "category_id": cat_objects["Lujo"].id
        },
        {
            "name": "Omega Seamaster Diver 300M",
            "description": "Reloj de buceo profesional...",
            "price": 5800.00,
            "stock": 15,
            "brand": "Omega",
            "model": "Seamaster 210.30.42.20.03.001",
            "material": "Acero inoxidable",
            "movement": "Automático Co-Axial 8800",
            "case_diameter": "42mm",
            "water_resistance": "300m",
            "image_url": "https://i.pinimg.com/736x/2a/12/ab/2a12ab9f2ed2f0dcfcf99fa12c8f43b6.jpg",
            "category_id": cat_objects["Buceo"].id
        }
        # ... puedes agregar el resto de los relojes aquí siguiendo el mismo formato
    ]

    for w in watches:
        product = Product(**w)
        db.session.add(product)

    # 5. Crear Carritos
    print("  - Generando carritos para usuarios...")
    for user in User.query.all():
        cart = Cart(user_id=user.id)
        db.session.add(cart)

    db.session.commit()
    print("="*40)
    print("✅ ¡BASE DE DATOS POBLADA EXITOSAMENTE!")
    print("="*40)