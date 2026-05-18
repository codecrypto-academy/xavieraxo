#[macro_use]
extern crate rocket;

use rocket::serde::{Deserialize, Serialize, json::Json};
use rocket::serde::json::Value;
use rocket::serde::json::serde_json::json;

#[derive(Serialize, Deserialize)]
#[serde(crate = "rocket::serde")]
struct Producto {
    id: u32,
    nombre: String,
    precio: f64,
}

#[derive(Serialize, Deserialize)]
#[serde(crate = "rocket::serde")]
struct Person {
    nombre: String,
    edad: Option<u32>,
    saldo: Option<f64>,
}

#[get("/")]
fn index() -> &'static str {
    "Servidor Rocket OK — prueba GET en /"
}

#[get("/api/hola")]
fn hola() -> &'static str {
    "Hola desde Rocket"
}

/// GET con segmento dinámico: /item/42 → id = 42
#[get("/item/<id>/<nombre>/<email>")]
fn ger_item(id: u32, nombre: &str, email: &str) -> String {
    format!("ID recibido: {id}, Nombre: {nombre}, Email: {email}")
}


/// GET con query string: /lista?page=1&registros=10&orden=asc
#[get("/lista?<tennant>&<person_name>&<page>&<registros>&<orden>")]
fn lista(tennant: Option<String>, person_name: Option<String>, page: Option<u32>, registros: Option<u32>, orden: Option<String>) -> String {
    let page = page.unwrap_or(1);
    let registros = registros.unwrap_or(10);
    let orden = orden.unwrap_or_else(|| String::from("id"));
    format!("Tennant: {:?}, Person Name: {:?}, Página: {}, Items por página: {}, Sorted by: {}", tennant, person_name, page, registros, orden)
}


/// GET con vector de strings: /tags?valor=rust&valor=rocket&valor=web
#[get("/itemsMultiple?<ids>")]
fn get_multiples_ids(ids: Vec<String>) -> String {

    format!("IDs recibidos: {:?}", ids)
}



/// POST con body JSON: recibe un Producto y lo devuelve con confirmación
#[post("/producto", format = "json", data = "<producto>")]
fn crear_producto(producto: Json<Producto>) -> Json<Producto> {
    producto
}

/// POST con body JSON: recibe empresa y nombre en la ruta, datos de Person en el body
#[post("/person/<empresa>/<nombre>", format = "json", data = "<person>")]
fn crear_person(empresa: &str, nombre: &str, person: Json<Person>) -> String {
    format!(
        "Empresa: {}, Nombre: {}, Person -> nombre: {}, edad: {}, saldo: {}",
        empresa, 
        nombre, 
        person.nombre, 
        person.edad.unwrap_or(10), 
        person.saldo.unwrap_or(20.4)
    )
}



#[launch]
fn rocket() -> _ {
    rocket::build().mount("/", routes![index, hola, ger_item, lista, get_multiples_ids, crear_producto, crear_person])
}
