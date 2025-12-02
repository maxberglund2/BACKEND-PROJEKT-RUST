use actix_web::{get, web, HttpResponse, Responder};
use sqlx::{Pool, Postgres};
use crate::models::system::System;

#[get("/api/systems/{user_id}")]
async fn get_user_systems(
    pool: web::Data<Pool<Postgres>>,
    user_id: web::Path<i32>,
) -> impl Responder {
    let result = sqlx::query_as::<_, System>(
        "SELECT id, name, user_id FROM systems WHERE user_id = $1 ORDER BY id",
    )
    .bind(*user_id)
    .fetch_all(pool.get_ref())
    .await;

    match result {
        Ok(systems) => HttpResponse::Ok().json(systems),
        Err(e) => {
            eprintln!("Database error: {:?}", e);
            HttpResponse::InternalServerError().body("Failed to fetch systems")
        }
    }
}