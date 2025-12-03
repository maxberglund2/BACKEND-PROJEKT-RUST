use actix_web::{put, web, HttpResponse, Responder};
use sqlx::{Pool, Postgres};
use crate::models::system::{System, UpdateSystem};

//
#[put("/api/systems/{id}")]
async fn update_system(
    pool: web::Data<Pool<Postgres>>,
    id: web::Path<i32>,
    system: web::Json<UpdateSystem>,
) -> impl Responder {
    // Defines how to convert into a HTTP response

    // extract the i32 value from web::Path<i32>
    let system_id = id.into_inner();

    // Update the system in the database
    let result = sqlx::query_as::<_, System>(
        "UPDATE systems 
         SET name = COALESCE($1, name),
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $2
         RETURNING id, name, user_id, is_default"
    )
    .bind(&system.name)
    .bind(system_id)
    .fetch_one(pool.get_ref())
    .await;

    // Handle the result of the update operation
    match result {
        Ok(updated_system) => HttpResponse::Ok().json(updated_system),
        Err(sqlx::Error::RowNotFound) => HttpResponse::NotFound().body("System not found"),
        Err(e) => {
            eprintln!("Database error: {:?}", e);
            HttpResponse::InternalServerError().body("Failed to update system")
        }
    }
}