#!/usr/bin/env python3
"""
Script para consultar la base de datos Northwind
Requiere: pip install psycopg2-binary
"""

import psycopg2
import pandas as pd
from psycopg2.extras import RealDictCursor
import os

# Configuración de la base de datos
DB_CONFIG = {
    'host': 'localhost',
    'port': 5432,
    'database': 'northwind',
    'user': 'northwind_user',
    'password': 'northwind_pass'
}

def connect_to_db():
    """Conecta a la base de datos PostgreSQL."""
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        print("✅ Conexión exitosa a la base de datos Northwind")
        return conn
    except psycopg2.Error as e:
        print(f"❌ Error conectando a la base de datos: {e}")
        return None

def execute_query(conn, query, description=""):
    """Ejecuta una consulta SQL y retorna los resultados."""
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(query)
            results = cursor.fetchall()
            
            if description:
                print(f"\n📊 {description}")
                print("=" * 80)
            
            if results:
                # Convertir a DataFrame para mejor visualización
                df = pd.DataFrame(results)
                print(df.to_string(index=False))
                print(f"\nTotal de registros: {len(results)}")
            else:
                print("No se encontraron resultados.")
                
            return results
            
    except psycopg2.Error as e:
        print(f"❌ Error ejecutando consulta: {e}")
        return None

def main():
    """Función principal."""
    print("🚀 Iniciando consultas a la base de datos Northwind")
    print("=" * 60)
    
    # Conectar a la base de datos
    conn = connect_to_db()
    if not conn:
        return
    
    try:
        # Consulta 1: Customers que vendieron algo (resumen)
        query1 = """
        SELECT DISTINCT
            c.customer_id,
            c.company_name,
            c.contact_name,
            c.city,
            c.country,
            COUNT(o.order_id) as total_orders,
            ROUND(SUM(od.unit_price * od.quantity * (1 - od.discount))::numeric, 2) as total_sales_amount
        FROM customers c
        INNER JOIN orders o ON c.customer_id = o.customer_id
        INNER JOIN order_details od ON o.order_id = od.order_id
        GROUP BY c.customer_id, c.company_name, c.contact_name, c.city, c.country
        ORDER BY total_sales_amount DESC
        LIMIT 10;
        """
        
        execute_query(conn, query1, "TOP 10 CUSTOMERS POR VOLUMEN DE VENTAS")
        
        # Consulta 2: Detalle de ventas por customer
        query2 = """
        SELECT 
            c.company_name,
            o.order_date,
            p.product_name,
            od.quantity,
            ROUND((od.unit_price * od.quantity * (1 - od.discount))::numeric, 2) as line_total
        FROM customers c
        INNER JOIN orders o ON c.customer_id = o.customer_id
        INNER JOIN order_details od ON o.order_id = od.order_id
        INNER JOIN products p ON od.product_id = p.product_id
        WHERE c.company_name = 'Alfreds Futterkiste'
        ORDER BY o.order_date DESC
        LIMIT 5;
        """
        
        execute_query(conn, query2, "DETALLE DE VENTAS PARA ALFREDS FUTTERKISTE")
        
        # Consulta 3: Estadísticas generales
        query3 = """
        SELECT 
            COUNT(DISTINCT c.customer_id) as total_customers,
            COUNT(DISTINCT o.customer_id) as customers_with_orders,
            COUNT(o.order_id) as total_orders,
            ROUND(SUM(od.unit_price * od.quantity * (1 - od.discount))::numeric, 2) as total_revenue
        FROM customers c
        LEFT JOIN orders o ON c.customer_id = o.customer_id
        LEFT JOIN order_details od ON o.order_id = od.order_id;
        """
        
        execute_query(conn, query3, "ESTADÍSTICAS GENERALES DE VENTAS")
        
    except Exception as e:
        print(f"❌ Error general: {e}")
    
    finally:
        # Cerrar conexión
        if conn:
            conn.close()
            print("\n🔌 Conexión cerrada")

if __name__ == "__main__":
    main()
