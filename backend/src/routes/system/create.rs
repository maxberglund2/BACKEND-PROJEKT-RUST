use actix_web::{post, web, HttpResponse, Responder};
use sqlx::{Pool, Postgres};
use crate::models::system::{CreateSystem, System};

// Create a new system
#[post("/api/systems")]
async fn create_system(
    pool: web::Data<Pool<Postgres>>,
    system: web::Json<CreateSystem>,
) -> impl Responder {
    // Defines how to convert into a HTTP response

    // Insert the new system into the database
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

    // Handle the result of the database insertion
    match result {
        //  Successful insertion
        Ok(system) => HttpResponse::Created().json(system),
        // Database error
        Err(e) => {
            eprintln!("Database error: {:?}", e);
            HttpResponse::InternalServerError().body("Failed to create system")
        }
    }
}