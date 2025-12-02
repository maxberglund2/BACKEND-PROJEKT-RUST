mod db;
mod models;
mod routes;

use actix_web::{App, HttpServer};
use actix_cors::Cors;
use dotenv::dotenv;
use std::env;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();
    
    let database_url = env::var("DATABASE_URL")
        .expect("DATABASE_URL must be set in .env file");
    
    // Create database pool
    let pool = db::create_pool(&database_url)
        .await
        .expect("Failed to create database pool");
    
    // Run migrations
    sqlx::migrate!("./migrations")
        .run(&pool)
        .await
        .expect("Failed to run migrations");
    
    println!("Server running at http://127.0.0.1:8081");
    
    HttpServer::new(move || {
        App::new()
            .app_data(actix_web::web::Data::new(pool.clone()))
            .wrap(
                Cors::default()
                    .allow_any_origin()
                    .allow_any_method()
                    .allow_any_header()
            )
            // Public API route (original todos endpoint)
            .service(routes::public::public_todos)
            // CRUD routes for database todos
            .service(routes::todos::create_todo)
            .service(routes::todos::get_all_todos)
            .service(routes::todos::get_todo_by_id)
            .service(routes::todos::update_todo)
            .service(routes::todos::delete_todo)
            // CRUD routes for systems
            .service(routes::system::create_system)
            .service(routes::system::get_user_systems)
            .service(routes::system::update_system)
            .service(routes::system::delete_system)
            // Authentication routes
            .service(routes::auth::signup_user)
            .service(routes::auth::signin_user)
    })
    .bind(("127.0.0.1", 8081))?
    .run()
    .await
}