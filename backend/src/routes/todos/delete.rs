use actix_web::{delete, web, HttpResponse, Responder};
use sqlx::{Pool, Postgres};

#[delete("/api/todos/{id}")]
async fn delete_todo(
    pool: web::Data<Pool<Postgres>>,
    id: web::Path<i32>,
) -> impl Responder {
    // Defines how to convert into a HTTP response

    // Delete the todo from the database by its ID
    let result = sqlx::query("DELETE FROM todos WHERE id = $1")
        .bind(id.into_inner())
        .execute(pool.get_ref())
        .await;

    // Handle the result of the delete operation
    match result {
        Ok(result) => {
            // Check if any row were affected 
            if result.rows_affected() > 0 {
                HttpResponse::NoContent().finish()
            } else {
                HttpResponse::NotFound().body("Todo not found")
            }
        }
        // Handle database errors
        Err(e) => {
            eprintln!("Database error: {:?}", e);
            HttpResponse::InternalServerError().body("Failed to delete todo")
        }
    }
}