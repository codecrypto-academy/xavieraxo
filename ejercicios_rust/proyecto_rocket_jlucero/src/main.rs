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

#[launch]
fn rocket() -> _ {
    rocket::build().mount("/", routes![index, hola, ger_item])
}
