use actix_web::{get, web, HttpResponse, Responder};
use sqlx::{Pool, Postgres};
use crate::models::todo::Todo;

#[get("/api/todos")]
async fn get_all_todos(pool: web::Data<Pool<Postgres>>) -> impl Responder {
    let result = sqlx::query_as::<_, Todo>("SELECT id, user_id, title, completed FROM todos ORDER BY id")
        .fetch_all(pool.get_ref())
        .await;

    match result {
        Ok(todos) => HttpResponse::Ok().json(todos),
        Err(e) => {
            eprintln!("Database error: {:?}", e);
            HttpResponse::InternalServerError().body("Failed to fetch todos")
        }
    }
}

#[get("/api/todos/{id}")]
async fn get_todo_by_id(
    pool: web::Data<Pool<Postgres>>,
    id: web::Path<i32>,
) -> impl Responder {
    let result = sqlx::query_as::<_, Todo>(
        "SELECT id, user_id, title, completed FROM todos WHERE id = $1"
    )
    .bind(id.into_inner())
    .fetch_one(pool.get_ref())
    .await;

    match result {
        Ok(todo) => HttpResponse::Ok().json(todo),
        Err(sqlx::Error::RowNotFound) => HttpResponse::NotFound().body("Todo not found"),
        Err(e) => {
            eprintln!("Database error: {:?}", e);
            HttpResponse::InternalServerError().body("Failed to fetch todo")
        }
    }
}