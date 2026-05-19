#[macro_use]
extern crate rocket;

use rocket::serde::{Deserialize, Serialize, json::Json};
use rocket::serde::json::Value;
use rocket::serde::json::serde_json::json;
use rocket::form::{Form, FromForm};
use rocket::fs::TempFile;

#[derive(Serialize, Deserialize, FromForm)]
#[serde(crate = "rocket::serde")]
struct Producto {
    id: u32,
    nombre: String,
    precio: f64,
    saldo: Option<f64>,
}

#[derive(Serialize, Deserialize, FromForm)]
#[serde(crate = "rocket::serde")]
struct Person {
    nombre: String,
    edad: Option<u32>,
    saldo: Option<f64>,
}

#[derive(FromForm)]
struct MultipartData<'r> {
    campo1: String,
    campo2: String,
    archivo: TempFile<'r>,
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

/// POST recibiendo JSON libre (sin struct)
#[post("/json-libre", format = "json", data = "<payload>")]
fn json_libre(payload: Json<Value>) -> Json<Value> {
    Json(json!({
        "ok": true,
        "recibido": payload.into_inner()
    }))
}

/// POST con body x-www-form-urlencoded usando struct Person
#[post("/person-urlencode", data = "<person>")]
fn crear_person_urlencode(person: Form<Person>) -> String {
    let person = person.into_inner();
    format!(
        "Person (urlencoded) -> nombre: {}, edad: {}, saldo: {}",
        person.nombre,
        person.edad.unwrap_or(10),
        person.saldo.unwrap_or(20.4)
    )
}

/// POST con body x-www-form-urlencoded usando struct Producto
#[post("/producto-urlencode", data = "<producto>")]
fn crear_producto_urlencode(producto: Form<Producto>) -> String {
    let producto = producto.into_inner();
    format!(
        "Producto (urlencoded) -> id: {}, nombre: {}, precio: {}, saldo: {}",
        producto.id,
        producto.nombre,
        producto.precio,
        producto.saldo.unwrap_or(0.0)
    )
}

/// POST multipart/form-data con dos campos y archivo text/plain
#[post("/multipar", data = "<data>")]
async fn post_multipar(mut data: Form<MultipartData<'_>>) -> String {
    let content_type = data
        .archivo
        .content_type()
        .map(|ct| ct.to_string())
        .unwrap_or_else(|| "sin-content-type".to_string());

    if content_type != "text/plain" {
        return format!(
            "Tipo de archivo inválido. Se esperaba text/plain y llegó: {}",
            content_type
        );
    }

    format!(
        "Multipart OK -> campo1: {}, campo2: {}, archivo: {} ({})",
        data.campo1,
        data.campo2,
        data.archivo
            .name()
            .map(|n| n.to_string())
            .unwrap_or_else(|| "sin_nombre".to_string()),
        content_type
    )
}



#[launch]
fn rocket() -> _ {
    rocket::build().mount("/", routes![index
                                     , hola
                                     , ger_item
                                     , lista
                                     , get_multiples_ids
                                     , crear_producto
                                     , crear_person
                                     , json_libre
                                     , crear_person_urlencode
                                     , crear_producto_urlencode
                                     , post_multipar])
}
