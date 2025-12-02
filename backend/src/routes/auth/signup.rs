use actix_web::{post, web, HttpResponse, Responder};
use sqlx::{Pool, Postgres};
use serde::Deserialize;
use bcrypt::{hash, DEFAULT_COST};
use crate::models::user::User;

#[derive(Deserialize)]
pub struct RegisterRequest {
    pub email: String,
    pub password: String,
}

#[post("/api/auth/signup")]
pub async fn signup_user(
    pool: web::Data<Pool<Postgres>>,
    user_data: web::Json<RegisterRequest>,
) -> impl Responder {
    let hashed_password = match hash(&user_data.password, DEFAULT_COST) {
        Ok(h) => h,
        Err(e) => {
            eprintln!("Hashing error: {:?}", e);
            return HttpResponse::InternalServerError().body("Failed to hash password");
        }
    };

    let result = sqlx::query_as::<_, User>(
        "INSERT INTO users (email, hashed_password) VALUES ($1, $2) RETURNING id, email, hashed_password"
    )
    .bind(&user_data.email)
    .bind(&hashed_password)
    .fetch_one(pool.get_ref())
    .await;

    match result {
        Ok(user) => HttpResponse::Created().json(serde_json::json!({
            "id": user.id,
            "email": user.email
        })),
        Err(e) => {
            eprintln!("Database error: {:?}", e);
            HttpResponse::BadRequest().body("Email already exists or invalid data")
        }
    }
}