use actix_web::{put, web, HttpResponse, Responder};
use sqlx::{Pool, Postgres};
use crate::models::todo::{Todo, UpdateTodo};

#[put("/api/todos/{id}")]
async fn update_todo(
    pool: web::Data<Pool<Postgres>>,
    id: web::Path<i32>,
    todo: web::Json<UpdateTodo>,
) -> impl Responder {
    let todo_id = id.into_inner();

    // Build dynamic query based on what fields are provided
    let result = sqlx::query_as::<_, Todo>(
        "UPDATE todos 
         SET title = COALESCE($1, title),
             completed = COALESCE($2, completed),
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $3
         RETURNING id, user_id, title, completed"
    )
    .bind(&todo.title)
    .bind(todo.completed)
    .bind(todo_id)
    .fetch_one(pool.get_ref())
    .await;

    match result {
        Ok(updated_todo) => HttpResponse::Ok().json(updated_todo),
        Err(sqlx::Error::RowNotFound) => HttpResponse::NotFound().body("Todo not found"),
        Err(e) => {
            eprintln!("Database error: {:?}", e);
            HttpResponse::InternalServerError().body("Failed to update todo")
        }
    }
}