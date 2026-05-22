#[macro_use]
extern crate rocket;

use rocket::response::status;
use rocket::serde::json::Json;
use rocket::serde::Serialize;
use rocket::State;
use rusqlite::{params, Connection};
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
        .mount("/", routes![get_customer])
        .launch()
        .await?;

    Ok(())
}
