#[macro_use]
extern crate rocket;

use rocket::response::status;
use rocket::serde::json::Json;
use rocket::serde::Serialize;
use rocket::State;
use rusqlite::{params, Connection, ToSql};
use std::sync::Mutex;

#[derive(Serialize)]
#[serde(crate = "rocket::serde")]
struct Customer {
    customer_id: String,
    company_name: String,
    contact_name: Option<String>,
    contact_title: Option<String>,
    address: Option<String>,
    city: Option<String>,
    region: Option<String>,
    postal_code: Option<String>,
    country: Option<String>,
    phone: Option<String>,
    fax: Option<String>,
}

/// Columnas válidas para ORDER BY (whitelist anti SQL-injection)
const VALID_ORDER_COLUMNS: &[&str] = &[
    "CustomerID",
    "CompanyName",
    "ContactName",
    "ContactTitle",
    "City",
    "Country",
    "Region",
    "PostalCode",
];

#[get("/customers?<page>&<per_page>&<name_filter>&<order_by>&<order_direction>")]
fn list_customers(
    page: Option<u64>,
    per_page: Option<u64>,
    name_filter: Option<String>,
    order_by: Option<String>,
    order_direction: Option<String>,
    db: &State<Mutex<Connection>>,
) -> Json<Vec<Customer>> {
    // Valores por defecto para paginación
    let page = page.unwrap_or(1);
    let per_page = per_page.unwrap_or(10);
    let offset = (page - 1) * per_page;

    // Valores por defecto y validación de ORDER BY (whitelist para evitar SQL injection)
    let order_by = {
        let col = order_by.unwrap_or_else(|| "CompanyName".to_string());
        if VALID_ORDER_COLUMNS.contains(&col.as_str()) {
            col
        } else {
            "CompanyName".to_string()
        }
    };

    let order_direction = match order_direction
        .unwrap_or_else(|| "ASC".to_string())
        .to_uppercase()
        .as_str()
    {
        "DESC" => "DESC",
        _ => "ASC",
    }
    .to_string();

    // Construcción dinámica de la query SQL base
    let mut query = String::from(
        "SELECT CustomerID, CompanyName, ContactName, ContactTitle, \
         Address, City, Region, PostalCode, Country, Phone, Fax \
         FROM Customers",
    );

    // Vector mutable de parámetros a inyectar de forma segura
    let mut params_values: Vec<Box<dyn ToSql>> = Vec::new();

    // Filtro opcional por nombre con LIKE (coincidencia parcial)
    let name_like = name_filter.map(|f| format!("%{}%", f));
    if let Some(ref like_val) = name_like {
        query.push_str(" WHERE CompanyName LIKE ?");
        params_values.push(Box::new(like_val.clone()));
    }

    // ORDER BY, LIMIT y OFFSET
    query.push_str(&format!(
        " ORDER BY {} {} LIMIT ? OFFSET ?",
        order_by, order_direction
    ));
    params_values.push(Box::new(per_page as i64));
    params_values.push(Box::new(offset as i64));

    // Adquirir conexión y preparar sentencia
    let connection = db.lock().unwrap();
    let mut statement = connection.prepare(&query).unwrap();

    // Convertir el vector a un slice de referencias &dyn ToSql
    let params_refs: Vec<&dyn ToSql> = params_values.iter().map(|b| b.as_ref()).collect();

    // Ejecutar query_map y mapear cada fila hacia Customer
    let rows = statement
        .query_map(params_refs.as_slice(), |row| {
            Ok(Customer {
                customer_id: row.get(0)?,
                company_name: row.get(1)?,
                contact_name: row.get(2)?,
                contact_title: row.get(3)?,
                address: row.get(4)?,
                city: row.get(5)?,
                region: row.get(6)?,
                postal_code: row.get(7)?,
                country: row.get(8)?,
                phone: row.get(9)?,
                fax: row.get(10)?,
            })
        })
        .unwrap();

    // Iterar resultados; .unwrap() en cada registro retorna 500 si hay error de mapeo
    let customers: Vec<Customer> = rows.map(|r| r.unwrap()).collect();

    Json(customers)
}

#[get("/customers/<id>")]
fn get_customer(
    id: String,
    db: &State<Mutex<Connection>>,
) -> Result<Json<Customer>, status::NotFound<String>> {
    // SQLite no permite concurrencia libre; bloqueamos la conexión para esta request.
    let connection = db.lock().unwrap();

    let mut statement = connection
        .prepare(
            "SELECT CustomerID, CompanyName, ContactName, ContactTitle, Address, City, Region, PostalCode, Country, Phone, Fax
             FROM Customers
             WHERE CustomerID = ?",
        )
        .unwrap();

    let mut rows = statement
        .query_map(params![id], |row| {
            Ok(Customer {
                customer_id: row.get(0)?,
                company_name: row.get(1)?,
                contact_name: row.get(2)?,
                contact_title: row.get(3)?,
                address: row.get(4)?,
                city: row.get(5)?,
                region: row.get(6)?,
                postal_code: row.get(7)?,
                country: row.get(8)?,
                phone: row.get(9)?,
                fax: row.get(10)?,
            })
        })
        .unwrap();

    match rows.next() {
        Some(Ok(customer)) => Ok(Json(customer)),
        Some(Err(_)) | None => Err(status::NotFound(format!(
            "Customer with ID {} not found",
            id
        ))),
    }
}

#[rocket::main]
async fn main() -> Result<(), rocket::Error> {
    let connection = Connection::open("northwind.db").unwrap();
    let database = Mutex::new(connection);

    rocket::build()
        .manage(database)
        .mount("/", routes![list_customers, get_customer])
        .launch()
        .await?;

    Ok(())
}
