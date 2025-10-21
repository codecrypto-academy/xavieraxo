-- Consulta para mostrar customers que vendieron algo
-- Esta consulta identifica todos los clientes que han realizado al menos una orden

SELECT DISTINCT
    c.customer_id,
    c.company_name,
    c.contact_name,
    c.contact_title,
    c.city,
    c.country,
    COUNT(o.order_id) as total_orders,
    SUM(od.unit_price * od.quantity * (1 - od.discount)) as total_sales_amount
FROM customers c
INNER JOIN orders o ON c.customer_id = o.customer_id
INNER JOIN order_details od ON o.order_id = od.order_id
GROUP BY c.customer_id, c.company_name, c.contact_name, c.contact_title, c.city, c.country
ORDER BY total_sales_amount DESC;

-- Consulta alternativa más simple (solo customers con órdenes)
-- SELECT DISTINCT c.* FROM customers c
-- WHERE EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.customer_id);

-- Consulta para ver el detalle de ventas por customer
SELECT 
    c.company_name,
    c.contact_name,
    o.order_date,
    p.product_name,
    od.unit_price,
    od.quantity,
    od.discount,
    (od.unit_price * od.quantity * (1 - od.discount)) as line_total
FROM customers c
INNER JOIN orders o ON c.customer_id = o.customer_id
INNER JOIN order_details od ON o.order_id = od.order_id
INNER JOIN products p ON od.product_id = p.product_id
WHERE o.order_date >= '1996-01-01'
ORDER BY c.company_name, o.order_date DESC;
