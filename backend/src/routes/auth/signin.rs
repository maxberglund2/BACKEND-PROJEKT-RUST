use actix_web::{post, web, HttpResponse, Responder};
use sqlx::{Pool, Postgres};
use serde::Deserialize;
use bcrypt::verify;
use crate::models::user::User;

#[derive(Deserialize)]
pub struct LoginRequest {
    pub email: String,
    pub password: String,
}

#[post("/api/auth/signin")]
pub async fn signin_user(
    pool: web::Data<Pool<Postgres>>,
    credentials: web::Json<LoginRequest>,
) -> impl Responder {
    let result = sqlx::query_as::<_, User>(
        "SELECT id, email, hashed_password FROM users WHERE email = $1"
    )
    .bind(&credentials.email)
    .fetch_one(pool.get_ref())
    .await;

    match result {
        Ok(user) => {
            match verify(&credentials.password, &user.hashed_password) {
                Ok(true) => HttpResponse::Ok().json(serde_json::json!({
                    "id": user.id,
                    "email": user.email,
                    "message": "Login successful"
                })),
                Ok(false) => HttpResponse::Unauthorized().body("Invalid credentials"),
                Err(e) => {
                    eprintln!("Verification error: {:?}", e);
                    HttpResponse::InternalServerError().body("Login failed")
                }
            }
        }
        Err(_) => HttpResponse::Unauthorized().body("Invalid credentials")
    }
}