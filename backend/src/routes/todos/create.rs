use actix_web::{post, web, HttpResponse, Responder};
use sqlx::{Pool, Postgres};
use crate::models::todo::{CreateTodo, Todo};

#[post("/api/todos")]
async fn create_todo(
    pool: web::Data<Pool<Postgres>>,
    todo: web::Json<CreateTodo>,
) -> impl Responder {
    let result = sqlx::query_as::<_, Todo>(
        "INSERT INTO todos (user_id, system_id, title, completed) 
         VALUES ($1, $2, $3, $4) 
         RETURNING id, user_id, system_id, title, completed"
    )
    .bind(todo.user_id)
    .bind(todo.system_id)
    .bind(&todo.title)
    .bind(todo.completed)
    .fetch_one(pool.get_ref())
    .await;

    match result {
        Ok(todo) => HttpResponse::Created().json(todo),
        Err(e) => {
            eprintln!("Database error: {:?}", e);
            HttpResponse::InternalServerError().body("Failed to create todo")
        }
    }
}