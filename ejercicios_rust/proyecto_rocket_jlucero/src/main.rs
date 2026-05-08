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

#[launch]
fn rocket() -> _ {
    rocket::build().mount("/", routes![index, hola])
}
