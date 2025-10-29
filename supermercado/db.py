# supermercado/db.py
import os
import mysql.connector
from dotenv import load_dotenv

# Cargar variables del .env por si app.py aún no lo hizo (no pisa valores existentes)
load_dotenv(override=False)

def conectar():
    """
    Devuelve una conexión a MySQL usando variables de entorno.
    Usa defaults seguros para evitar TypeError cuando faltan.
    """
    host = os.getenv("DB_HOST", "127.0.0.1")
    port = int(os.getenv("DB_PORT", "3306"))          # 👈 evita int(None)
    user = os.getenv("DB_USER", "root")
    password = os.getenv("DB_PASSWORD", "")
    database = os.getenv("DB_NAME", "SupermercadoOnline")

    return mysql.connector.connect(
        host=host,
        port=port,
        user=user,
        password=password,
        database=database,
    )
