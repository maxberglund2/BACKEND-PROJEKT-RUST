use actix_web::{get, web, HttpResponse, Responder};
use sqlx::{Pool, Postgres};
use crate::models::system::System;

#[get("/api/systems")]
async fn get_all_systems(pool: web::Data<Pool<Postgres>>) -> impl Responder {
    let result = sqlx::query_as::<_, System>("SELECT id, name, user_id FROM systems ORDER BY id")
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