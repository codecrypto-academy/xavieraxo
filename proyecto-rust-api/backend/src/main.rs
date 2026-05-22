#[macro_use]
extern crate rocket;

use rocket::response::status;
use rocket::serde::json::Json;
use rocket::serde::{Deserialize, Serialize};
use rocket::State;
use rusqlite::{params, Connection};
use std::sync::Mutex;

#[derive(Serialize, Deserialize, Debug)]
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

// ─── POST /customers ──────────────────────────────────────────────────────────
#[post("/customers", format = "json", data = "<customer>")]
fn create_customer(
    customer: Json<Customer>,
    db: &State<Mutex<Connection>>,
) -> Json<Customer> {
    let connection = db.lock().unwrap();

    connection
        .execute(
            "INSERT INTO Customers (CustomerID, CompanyName, ContactName, ContactTitle, Address, City, Region, PostalCode, Country, Phone, Fax)
             VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11)",
            params![
                customer.customer_id,
                customer.company_name,
                customer.contact_name,
                customer.contact_title,
                customer.address,
                customer.city,
                customer.region,
                customer.postal_code,
                customer.country,
                customer.phone,
                customer.fax,
            ],
        )
        .unwrap();

    customer
}

// ─── PUT /customers/<id> ──────────────────────────────────────────────────────
#[put("/customers/<id>", format = "json", data = "<customer>")]
fn update_customer(
    id: String,
    customer: Json<Customer>,
    db: &State<Mutex<Connection>>,
) -> Json<Customer> {
    let connection = db.lock().unwrap();

    connection
        .execute(
            "UPDATE Customers
             SET CompanyName = ?1, ContactName = ?2, ContactTitle = ?3, Address = ?4,
                 City = ?5, Region = ?6, PostalCode = ?7, Country = ?8, Phone = ?9, Fax = ?10
             WHERE CustomerID = ?11",
            params![
                customer.company_name,   // ?1
                customer.contact_name,   // ?2
                customer.contact_title,  // ?3
                customer.address,        // ?4
                customer.city,           // ?5
                customer.region,         // ?6
                customer.postal_code,    // ?7
                customer.country,        // ?8
                customer.phone,          // ?9
                customer.fax,            // ?10
                id,                      // ?11 — usado en WHERE
            ],
        )
        .unwrap();

    customer
}

// ─── DELETE /customers/<id> ───────────────────────────────────────────────────
#[delete("/customers/<id>")]
fn delete_customer(
    id: String,
    db: &State<Mutex<Connection>>,
) -> Json<bool> {
    let connection = db.lock().unwrap();

    let rows_affected = connection
        .execute(
            "DELETE FROM Customers WHERE CustomerID = ?",
            params![id],
        )
        .unwrap();

    Json(rows_affected > 0)
}

#[rocket::main]
async fn main() -> Result<(), rocket::Error> {
    let connection = Connection::open("northwind.db").unwrap();
    let database = Mutex::new(connection);

    rocket::build()
        .manage(database)
        .mount(
            "/",
            routes![get_customer, create_customer, update_customer, delete_customer],
        )
        .launch()
        .await?;

    Ok(())
}
