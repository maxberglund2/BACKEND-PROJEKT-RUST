use actix_web::{get, web, HttpResponse, Responder};
use sqlx::{Pool, Postgres};
use crate::models::system::System;

#[get("/api/systems/{user_id}")]
async fn get_user_systems(
    pool: web::Data<Pool<Postgres>>,
    user_id: web::Path<i32>,
) -> impl Responder {
    // Defines how to convert into a HTTP response

    // Query all systems for a specific user from the database
    let result = sqlx::query_as::<_, System>(
        "SELECT id, name, user_id, is_default 
         FROM systems 
         WHERE user_id = $1 
         ORDER BY is_default DESC, id",
    )
    // extract the i32 value from web::Path<i32>
    .bind(*user_id)
    // Fetch all matching systems
    .fetch_all(pool.get_ref())
    .await;

    // Handle the result of the query
    match result {
        Ok(systems) => HttpResponse::Ok().json(systems),
        Err(e) => {
            eprintln!("Database error: {:?}", e);
            HttpResponse::InternalServerError().body("Failed to fetch systems")
        }
    }
}

// Fetch the default system for a specific user
#[get("/api/systems/{user_id}/default")]
async fn get_default_system(
    pool: web::Data<Pool<Postgres>>,
    user_id: web::Path<i32>,
) -> impl Responder {
    // Defines how to convert into a HTTP response

    // Query the default system for a specific user from the database
    let result = sqlx::query_as::<_, System>(
        "SELECT id, name, user_id, is_default 
         FROM systems 
         WHERE user_id = $1 AND is_default = TRUE",
    )
    .bind(*user_id)
    .fetch_optional(pool.get_ref())
    .await;

    // Handle the result of the query
    match result {
        Ok(Some(system)) => HttpResponse::Ok().json(system),
        Ok(None) => HttpResponse::NotFound().body("No default system found"),
        Err(e) => {
            eprintln!("Database error: {:?}", e);
            HttpResponse::InternalServerError().body("Failed to fetch default system")
        }
    }
}