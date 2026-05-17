#[macro_use]
extern crate rocket;

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

#[launch]
fn rocket() -> _ {
    rocket::build().mount("/", routes![index, hola, ger_item, lista, get_multiples_ids])
}
