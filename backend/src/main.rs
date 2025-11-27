use actix_web::{App, HttpResponse, HttpServer, Responder, get};
use actix_cors::Cors;
use serde::{Deserialize, Serialize};

#[derive(Deserialize, Serialize)]
struct Todo {
    userId: u32,
    id: u32,
    title: String,
    completed: bool,
}

#[get("/todos")]
async fn todos() -> impl Responder {
    let resp = reqwest::get("https://jsonplaceholder.typicode.com/todos/").await;

    if let Ok(response) = resp {
        if let Ok(todos) = response.json::<Vec<Todo>>().await {
            HttpResponse::Ok().json(&todos)
        } else {
            HttpResponse::InternalServerError().body("Kunde inte parsa JSON")
        }
    } else {
        HttpResponse::InternalServerError().body("Kunde inte hämta data")
    }
}

// Startar Actix-web servern

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        App::new()
            .wrap(
                Cors::default()
                    .allow_any_origin()
                    .allow_any_method()
                    .allow_any_header()
            )
            .service(todos)
    })
    .bind(("127.0.0.1", 8081))?
    .run()
    .await
}