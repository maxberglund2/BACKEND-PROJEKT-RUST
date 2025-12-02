use actix_web::{delete, web, HttpResponse, Responder};
use sqlx::{Pool, Postgres};

#[delete("/api/systems/{id}")]
async fn delete_system(
    pool: web::Data<Pool<Postgres>>,
    system_id: web::Path<i32>,
) -> impl Responder {
    let result = sqlx::query(
        "DELETE FROM systems WHERE id = $1"
    )
    .bind(*system_id)
    .execute(pool.get_ref())
    .await;

    match result {
        Ok(_) => HttpResponse::Ok().body("System deleted successfully"),
        Err(e) => {
            eprintln!("Database error: {:?}", e);
            HttpResponse::InternalServerError().body("Failed to delete system")
        }
    }
}