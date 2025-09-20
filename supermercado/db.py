from datetime import datetime
import mysql.connector


#Base de datos del colegio
#def conectar():
#    return mysql.connector.connect(
#        host="10.9.120.5",
#        port=3306,
#        user="supermercado",
#        password="super1234",  
#        database="SupermercadoOnline"
#    )

#Base de datos en casa
def conectar():
    return mysql.connector.connect(
        host="localhost",     # ahora es tu máquina 127.0.0.1
        port=3306,            # puerto por defecto
        user="root",          # tu usuario de MySQL (probablemente root en local)
        password="",          # tu contraseña de MySQL (en XAMPP suele estar vacía)
        database="SupermercadoOnline"  # la BD que importaste
    )