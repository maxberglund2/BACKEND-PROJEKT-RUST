use actix_web::{delete, web, HttpResponse, Responder};
use sqlx::{Pool, Postgres};

#[delete("/api/todos/{id}")]
async fn delete_todo(
    pool: web::Data<Pool<Postgres>>,
    id: web::Path<i32>,
) -> impl Responder {
    let result = sqlx::query("DELETE FROM todos WHERE id = $1")
        .bind(id.into_inner())
        .execute(pool.get_ref())
        .await;

    match result {
        Ok(result) => {
            if result.rows_affected() > 0 {
                HttpResponse::NoContent().finish()
            } else {
                HttpResponse::NotFound().body("Todo not found")
            }
        }
        Err(e) => {
            eprintln!("Database error: {:?}", e);
            HttpResponse::InternalServerError().body("Failed to delete todo")
        }
    }
}