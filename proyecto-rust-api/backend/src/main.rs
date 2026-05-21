#[macro_use]
extern crate rocket;

use rocket::fairing::{Fairing, Info, Kind};
use rocket::http::Header;
use rocket::{Config, Request, Response};
use rusqlite::Connection;
use std::sync::Mutex;

// ─── CORS Fairing ────────────────────────────────────────────────────────────
pub struct Cors;

#[rocket::async_trait]
impl Fairing for Cors {
    fn info(&self) -> Info {
        Info {
            name: "CORS headers",
            kind: Kind::Response,
        }
    }

    async fn on_response<'r>(&self, _req: &'r Request<'_>, res: &mut Response<'r>) {
        res.set_header(Header::new("Access-Control-Allow-Origin", "http://localhost:3000"));
        res.set_header(Header::new(
            "Access-Control-Allow-Methods",
            "GET, POST, PUT, DELETE, OPTIONS",
        ));
        res.set_header(Header::new(
            "Access-Control-Allow-Headers",
            "Content-Type, Authorization",
        ));
    }
}

// ─── Rutas stub (lógica completa en rustapi-#4) ───────────────────────────────
#[get("/customers")]
fn get_customers() -> &'static str {
    "[]"
}

#[post("/customers")]
fn create() -> &'static str {
    "{\"status\": \"created\"}"
}

#[put("/customers/<_id>")]
fn update(_id: String) -> &'static str {
    "{\"status\": \"updated\"}"
}

#[delete("/customers/<_id>")]
fn delete(_id: String) -> &'static str {
    "{\"status\": \"deleted\"}"
}

#[get("/customers/<id>")]
fn get_customer(id: String) -> String {
    format!("{{\"id\": \"{}\"}}", id)
}

// ─── Main ─────────────────────────────────────────────────────────────────────
#[rocket::main]
async fn main() -> Result<(), rocket::Error> {
    // Abre la conexión a SQLite; .unwrap() provoca panic si la BD está corrupta
    let conn = Connection::open("northwind.db").unwrap();
    let db = Mutex::new(conn);

    // Puerto 8001 en lugar del 8000 por defecto
    let config = Config {
        port: 8001,
        ..Config::default()
    };

    rocket::custom(config)
        .manage(db)                // Estado global thread-safe con Mutex
        .attach(Cors)              // Política CORS para peticiones desde el frontend
        .mount(
            "/",
            routes![
                get_customers,
                create,
                update,
                delete,
                get_customer,
            ],
        )
        .launch()
        .await?;

    Ok(())
}
