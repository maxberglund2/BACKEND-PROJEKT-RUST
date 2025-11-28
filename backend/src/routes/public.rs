use actix_web::{get, HttpResponse, Responder};
use serde::{Deserialize, Serialize};

#[derive(Deserialize, Serialize)]
struct ExternalTodo {
    #[serde(rename = "userId")]
    user_id: u32,
    id: u32,
    title: String,
    completed: bool,
}

#[get("/todos")]
pub async fn public_todos() -> impl Responder {
    let resp = reqwest::get("https://jsonplaceholder.typicode.com/todos/").await;

    if let Ok(response) = resp {
        if let Ok(todos) = response.json::<Vec<ExternalTodo>>().await {
            HttpResponse::Ok().json(&todos)
        } else {
            HttpResponse::InternalServerError().body("Kunde inte parsa JSON")
        }
    } else {
        HttpResponse::InternalServerError().body("Kunde inte hämta data")
    }
}