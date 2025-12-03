use actix_web::{delete, web, HttpResponse, Responder};
use sqlx::{Pool, Postgres};

// Delete a system by its ID
#[delete("/api/systems/{id}")]
async fn delete_system(
    pool: web::Data<Pool<Postgres>>,
    system_id: web::Path<i32>,
) -> impl Responder {
    // Defines how to convert into a HTTP response

    // Delete the system from the database by its ID
    let result = sqlx::query(
        "DELETE FROM systems WHERE id = $1"
    )
    // extract the i32 value from web::Path<i32>
    .bind(*system_id)
    .execute(pool.get_ref())
    .await;

    // Handle the result of the delete operation
    match result {
        Ok(_) => HttpResponse::Ok().body("System deleted successfully"),
        Err(e) => {
            eprintln!("Database error: {:?}", e);
            HttpResponse::InternalServerError().body("Failed to delete system")
        }
    }
}