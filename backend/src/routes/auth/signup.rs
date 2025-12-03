use crate::models::user::User;
use actix_web::{post, web, HttpResponse, Responder};
use bcrypt::{hash, DEFAULT_COST};
use serde::Deserialize;
use sqlx::{Pool, Postgres};

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
    // Defines how to convert into a HTTP response

    // Hash the password with bcrypt
    let hashed_password = match hash(&user_data.password, DEFAULT_COST) {
        // If hashing is successful, use the hashed password
        Ok(h) => h,
        // If hashing fails, return an internal server error response
        Err(e) => {
            eprintln!("Hashing error: {:?}", e);
            // Return an internal server error response if hashing fails
            return HttpResponse::InternalServerError().body("Failed to hash password");
        }
    };

    // Insert the new user into the database
    let result = sqlx::query_as::<_, User>(
        "INSERT INTO users (email, hashed_password) VALUES ($1, $2) RETURNING id, email, hashed_password"
    )
    .bind(&user_data.email)
    .bind(&hashed_password)
    .fetch_one(pool.get_ref())
    .await;

    // Handle the result of the database insertion
    match result {
        Ok(user) => {
            // After user creation, populate public todos
            if let Err(e) = populate_public_todos(pool.get_ref(), user.id).await {
                eprintln!("Failed to populate public todos: {:?}", e);
            }

            HttpResponse::Created().json(serde_json::json!({
                "id": user.id,
                "email": user.email
            }))
        }
        Err(e) => {
            eprintln!("Database error: {:?}", e);
            HttpResponse::BadRequest().body("Email already exists or invalid data")
        }
    }
}

async fn populate_public_todos(
    pool: &Pool<Postgres>,
    user_id: i32,
) -> Result<(), Box<dyn std::error::Error>> {
    // Result<T, E> type to handle potential errors. The function returns Ok(()) on success or Err(E) on failure.

    // Fetch the default system ID, by making sure its marked as default
    let system: (i32,) =
        sqlx::query_as("SELECT id FROM systems WHERE user_id = $1 AND is_default = TRUE")
            .bind(user_id)
            .fetch_one(pool)
            .await?;

    // Extract the system ID from the tuple, by getting the first element
    let system_id = system.0;

    // Delete the placeholder todo
    sqlx::query("DELETE FROM todos WHERE user_id = $1 AND system_id = $2")
        .bind(user_id)
        .bind(system_id)
        .execute(pool)
        .await?;

    // Fetch public todos from JSONPlaceholder API
    let client = reqwest::Client::new();
    let response = client
        .get("https://jsonplaceholder.typicode.com/todos")
        .send()
        .await?;

    if response.status().is_success() {
        let public_todos: Vec<serde_json::Value> = response.json().await?;

        // Insert the first 10 public todos into the user's todo list
        for todo in public_todos.iter().take(10) {
            // light validation and extraction incase of incorrect data

            // Extract title and completed status from the JSON object
            let title = todo["title"].as_str().unwrap_or("Untitled");
            // Default to false if "completed" field is missing or not a boolean
            let completed = todo["completed"].as_bool().unwrap_or(false);

            // Insert the todo into the database
            sqlx::query(
                "INSERT INTO todos (user_id, system_id, title, completed) 
                 VALUES ($1, $2, $3, $4)",
            )
            .bind(user_id)
            .bind(system_id)
            .bind(title)
            .bind(completed)
            .execute(pool)
            .await?;
        }
    }
    // Return Ok(()) to indicate successful completion
    Ok(())
}
