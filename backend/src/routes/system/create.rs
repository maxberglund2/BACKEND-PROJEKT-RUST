use actix_web::{post, web, HttpResponse, Responder};
use sqlx::{Pool, Postgres};
use crate::models::system::{CreateSystem, System};

#[post("/api/systems")]
async fn create_system(
    pool: web::Data<Pool<Postgres>>,
    system: web::Json<CreateSystem>,
) -> impl Responder {
    let result = sqlx::query_as::<_, System>(
        "INSERT INTO systems (name, user_id, is_default) 
         VALUES ($1, $2, $3) 
         RETURNING id, name, user_id, is_default"
    )
    .bind(&system.name)
    .bind(system.user_id)
    .bind(system.is_default)
    .fetch_one(pool.get_ref())
    .await;

    match result {
        Ok(system) => HttpResponse::Created().json(system),
        Err(e) => {
            eprintln!("Database error: {:?}", e);
            HttpResponse::InternalServerError().body("Failed to create system")
        }
    }
}