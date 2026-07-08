import { Customer, QueryParams } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Obtiene la lista paginada de clientes, con filtrado y ordenamiento opcionales.
 * Itera sobre QueryParams con Object.entries() para construir dinámicamente
 * los parámetros de la URL.
 */
export async function get_customers(params: QueryParams = {}): Promise<Customer[]> {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, String(value));
    }
  }

  const query = searchParams.toString();
  const url = `${API_URL}/customers${query ? `?${query}` : ""}`;

  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) {
    throw new Error(`Error al obtener clientes: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<Customer[]>;
}

/**
 * Obtiene un único cliente por su ID.
 */
export async function get_customer(id: string): Promise<Customer> {
  const res = await fetch(`${API_URL}/customers/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Cliente ${id} no encontrado: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<Customer>;
}

/**
 * Crea un nuevo cliente enviando el objeto serializado como JSON en el body.
 */
export async function create_customer(customer: Omit<Customer, "customer_id"> & { customer_id?: string }): Promise<Customer> {
  const res = await fetch(`${API_URL}/customers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(customer),
  });

  if (!res.ok) {
    throw new Error(`Error al crear cliente: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<Customer>;
}

/**
 * Actualiza un cliente existente enviando el objeto modificado como JSON.
 */
export async function update_customer(id: string, customer: Partial<Customer>): Promise<Customer> {
  const res = await fetch(`${API_URL}/customers/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(customer),
  });

  if (!res.ok) {
    throw new Error(`Error al actualizar cliente ${id}: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<Customer>;
}

/**
 * Elimina un cliente por su ID mediante una petición DELETE.
 */
export async function delete_customer(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/customers/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error(`Error al eliminar cliente ${id}: ${res.status} ${res.statusText}`);
  }
}
