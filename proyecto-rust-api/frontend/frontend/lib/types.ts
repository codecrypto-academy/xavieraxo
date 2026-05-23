/**
 * Espejo de la tabla Customers de la base de datos Northwind.
 * Los campos principales (PK y nombre de empresa) son obligatorios;
 * el resto refleja columnas que pueden ser NULL en SQLite.
 */
export interface Customer {
  customer_id: string;
  company_name: string;
  contact_name: string | null;
  contact_title: string | null;
  address: string | null;
  city: string | null;
  region: string | null;
  postal_code: string | null;
  country: string | null;
  phone: string | null;
  fax: string | null;
}

/**
 * Parámetros opcionales para consultar el endpoint GET /customers.
 * Todos los campos son opcionales para facilitar la construcción
 * dinámica de la query string desde el frontend.
 */
export interface QueryParams {
  page?: number;
  per_page?: number;
  name_filter?: string;
  order_by?: string;
  order_direction?: "ASC" | "DESC";
}
