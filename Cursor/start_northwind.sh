#!/bin/bash

echo "🚀 Iniciando proyecto Northwind con Docker Compose..."
echo "=================================================="

# Verificar si Docker está corriendo
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker no está corriendo. Por favor inicia Docker Desktop."
    exit 1
fi

# Verificar si docker-compose está disponible
if ! command -v docker-compose &> /dev/null; then
    echo "❌ docker-compose no está disponible. Instálalo primero."
    exit 1
fi

echo "✅ Docker y docker-compose están disponibles"

# Descargar el archivo SQL de Northwind si no existe
if [ ! -f "northwind.sql" ]; then
    echo "📥 Descargando base de datos Northwind..."
    curl -o northwind.sql https://raw.githubusercontent.com/pthom/northwind_psql/master/northwind.sql
    
    if [ $? -eq 0 ]; then
        echo "✅ Base de datos descargada exitosamente"
    else
        echo "❌ Error descargando la base de datos"
        exit 1
    fi
else
    echo "✅ Archivo northwind.sql ya existe"
fi

# Iniciar los servicios
echo "🐳 Iniciando servicios con Docker Compose..."
docker-compose up -d

# Esperar a que PostgreSQL esté listo
echo "⏳ Esperando a que PostgreSQL esté listo..."
sleep 10

# Verificar estado de los servicios
echo "📊 Estado de los servicios:"
docker-compose ps

echo ""
echo "🎉 Proyecto iniciado exitosamente!"
echo ""
echo "📋 Información de conexión:"
echo "   PostgreSQL: localhost:5432"
echo "   Usuario: northwind_user"
echo "   Contraseña: northwind_pass"
echo "   Base de datos: northwind"
echo ""
echo "🌐 PgAdmin: http://localhost:8080"
echo "   Email: admin@northwind.com"
echo "   Contraseña: admin123"
echo ""
echo "🐍 Para ejecutar consultas con Python:"
echo "   pip install -r requirements.txt"
echo "   python query_northwind.py"
echo ""
echo "🛑 Para detener los servicios: docker-compose down"
