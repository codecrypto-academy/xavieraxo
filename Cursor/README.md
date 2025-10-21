# 🚀 Proyecto Northwind con Docker Compose

Este proyecto implementa una base de datos PostgreSQL con la base de datos de ejemplo Northwind, utilizando Docker Compose para facilitar el despliegue y gestión.

## 📋 **Características**

- **PostgreSQL 15** con base de datos Northwind pre-cargada
- **PgAdmin 4** para gestión visual de la base de datos
- **Scripts de consulta** para análisis de datos
- **Script de Python** para consultas automatizadas
- **Docker Compose** para orquestación de servicios

## 🛠️ **Requisitos Previos**

### **Software necesario:**
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Windows/Mac)
- [Docker Engine](https://docs.docker.com/engine/install/) (Linux)
- [Docker Compose](https://docs.docker.com/compose/install/)

### **Para consultas con Python (opcional):**
- Python 3.8+
- pip (gestor de paquetes de Python)

## 🚀 **Inicio Rápido**

### **1. Clonar/Descargar el proyecto**
```bash
# Navegar al directorio del proyecto
cd tu-proyecto-northwind
```

### **2. Ejecutar el script de inicio (Recomendado)**
```bash
# En Windows (PowerShell):
./start_northwind.sh

# En Linux/Mac:
chmod +x start_northwind.sh
./start_northwind.sh
```

### **3. Inicio manual con Docker Compose**
```bash
# Iniciar servicios
docker-compose up -d

# Ver estado
docker-compose ps

# Ver logs
docker-compose logs -f postgres
```

## 📊 **Acceso a los Servicios**

### **PostgreSQL Database**
- **Host:** localhost
- **Puerto:** 5432
- **Base de datos:** northwind
- **Usuario:** northwind_user
- **Contraseña:** northwind_pass

### **PgAdmin (Interfaz Web)**
- **URL:** http://localhost:8080
- **Email:** admin@northwind.com
- **Contraseña:** admin123

## 🔍 **Consultas SQL**

### **Consulta Principal: Customers que vendieron algo**
```sql
SELECT DISTINCT
    c.customer_id,
    c.company_name,
    c.contact_name,
    c.city,
    c.country,
    COUNT(o.order_id) as total_orders,
    SUM(od.unit_price * od.quantity * (1 - od.discount)) as total_sales_amount
FROM customers c
INNER JOIN orders o ON c.customer_id = o.customer_id
INNER JOIN order_details od ON o.order_id = od.order_id
GROUP BY c.customer_id, c.company_name, c.contact_name, c.city, c.country
ORDER BY total_sales_amount DESC;
```

### **Archivos de consulta disponibles:**
- `query_customers_with_sales.sql` - Consultas SQL principales
- `query_northwind.py` - Script de Python para consultas automatizadas

## 🐍 **Consultas con Python**

### **Instalar dependencias:**
```bash
pip install -r requirements.txt
```

### **Ejecutar consultas:**
```bash
python query_northwind.py
```

## 📁 **Estructura del Proyecto**

```
├── docker-compose.yml           # Configuración de servicios Docker
├── northwind.sql               # Script SQL de la base de datos
├── query_customers_with_sales.sql  # Consultas SQL principales
├── query_northwind.py          # Script de Python para consultas
├── requirements.txt             # Dependencias de Python
├── start_northwind.sh          # Script de inicio automático
└── README.md                   # Este archivo
```

## 🎯 **Casos de Uso**

### **Análisis de Ventas**
- Identificar clientes más rentables
- Analizar patrones de compra
- Calcular métricas de ventas por región

### **Desarrollo y Testing**
- Base de datos de ejemplo para desarrollo
- Pruebas de consultas SQL complejas
- Aprendizaje de PostgreSQL

## 🛑 **Gestión de Servicios**

### **Comandos útiles:**
```bash
# Iniciar servicios
docker-compose up -d

# Detener servicios
docker-compose down

# Ver logs en tiempo real
docker-compose logs -f

# Reiniciar un servicio específico
docker-compose restart postgres

# Ver estado de servicios
docker-compose ps
```

### **Limpieza completa:**
```bash
# Detener y eliminar todo (incluyendo volúmenes)
docker-compose down -v

# Eliminar imágenes
docker-compose down --rmi all
```

## 🔧 **Solución de Problemas**

### **Puerto 5432 ocupado:**
```bash
# Cambiar puerto en docker-compose.yml
ports:
  - "5433:5432"  # Usar puerto 5433 en lugar de 5432
```

### **Error de permisos en Windows:**
- Ejecutar PowerShell como Administrador
- Verificar que Docker Desktop esté corriendo

### **Base de datos no se inicializa:**
```bash
# Ver logs de PostgreSQL
docker-compose logs postgres

# Recrear contenedor
docker-compose down -v
docker-compose up -d
```

## 📚 **Recursos Adicionales**

- [Documentación de PostgreSQL](https://www.postgresql.org/docs/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Base de datos Northwind](https://github.com/pthom/northwind_psql)

## 🤝 **Contribuciones**

¡Las contribuciones son bienvenidas! Por favor:
1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📄 **Licencia**

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

**¡Disfruta explorando la base de datos Northwind! 🎉**
