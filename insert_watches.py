from datetime import datetime
from werkzeug.security import generate_password_hash
from src.api.models import db, Product, Category, User, Cart
from src.app import app
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))


with app.app_context():
    # Limpiar tablas (en orden correcto por dependencias)
    db.drop_all()
    db.create_all()

    print("✅ Tablas creadas con relaciones")

    # Crear categorías primero
    categories_data = [
        {"name": "Deportivos", "description": "Relojes resistentes para actividades"},
        {"name": "Clásicos", "description": "Relojes elegantes y atemporales"},
        {"name": "Lujo", "description": "Relojes de alta gama y prestigio"},
        {"name": "Cronógrafos", "description": "Relojes con función de cronómetro"},
        {"name": "Buceo", "description": "Relojes resistentes al agua para actividades acuáticas"}
    ]

    categories = []
    for cat_data in categories_data:
        category = Category(**cat_data)
        db.session.add(category)
        categories.append(category)

    db.session.commit()
    print(f"✅ {len(categories)} categorías creadas")

    # Crear usuario admin
    admin_user = User(
        email="admin@luxurywatches.com",
        password=generate_password_hash("admin123"),
        is_active=True,
        first_name="Admin",
        last_name="User"
    )
    db.session.add(admin_user)

    # Crear usuario de prueba
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
    print("✅ Usuarios creados")

    # Crear productos (relojes de lujo) con relaciones
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
            "category_id": 4  # Cronógrafos
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
            "category_id": 3  # Lujo
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
            "category_id": 1  # Deportivos
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
            "category_id": 4  # Cronógrafos
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
            "category_id": 5  # Buceo
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
            "category_id": 2  # Clásicos
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
            "category_id": 3  # Lujo
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
            "category_id": 3  # Lujo
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
            "category_id": 2  # Clásicos
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
            "category_id": 3  # Lujo
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
            "category_id": 3  # Lujo
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
            "category_id": 3  # Lujo
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
            "category_id": 4  # Cronógrafos
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
            "category_id": 4  # Cronógrafos
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
            "category_id": 4  # Cronógrafos
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
            "category_id": 4  # Cronógrafos
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
            "category_id": 5  # Buceo
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
            "category_id": 1  # Deportivos
        }
    ]

    for watch_data in watches:
        product = Product(**watch_data)
        db.session.add(product)

    db.session.commit()
    print(f"✅ {len(watches)} productos creados con relaciones")

    # Crear carritos para los usuarios
    users = User.query.all()
    for user in users:
        cart = Cart(user_id=user.id)
        db.session.add(cart)

    db.session.commit()
    print(f"✅ Carritos creados para {len(users)} usuarios")

    print("\n" + "="*60)
    print("✅ BASE DE DATOS COMPLETA CON RELACIONES")
    print("="*60)
    print(f"📊 Categorías: {len(categories)}")
    print(f"👥 Usuarios: {len(users)}")
    print(f"⌚ Productos: {len(watches)}")
    print(f"🛒 Carritos: {len(users)}")
    print("="*60)

    # Mostrar algunas relaciones
    print("\n🔍 Verificando relaciones:")
    test_product = Product.query.first()
    if test_product and test_product.category:
        print(
            f"  Producto '{test_product.name}' → Categoría: {test_product.category.name}")

    test_user = User.query.first()
    if test_user:
        print(
            f"  Usuario '{test_user.email}' → Carritos: {len(test_user.carts)}")
        if test_user.carts:
            print(
                f"    Carrito ID: {test_user.carts[0].id}, Activo: {test_user.carts[0].is_active}")
