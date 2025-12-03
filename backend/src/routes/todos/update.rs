use crate::models::todo::{Todo, UpdateTodo};
use actix_web::{put, web, HttpResponse, Responder};
use sqlx::{Pool, Postgres};

// Update an existing todo
#[put("/api/todos/{id}")]
// The parameters id from the path and the updated todo data from the request body
async fn update_todo(
    pool: web::Data<Pool<Postgres>>,
    id: web::Path<i32>,
    todo: web::Json<UpdateTodo>,
) -> impl Responder {
    // Defines how to convert into a HTTP response

    // Extract the todo ID from the path
    let todo_id = id.into_inner();
    // Perform the update operation in the database
    let result = sqlx::query_as::<_, Todo>(
        "UPDATE todos 
         SET title = COALESCE($1, title),
             completed = COALESCE($2, completed),
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $3
         RETURNING id, user_id, system_id, title, completed",
    )
    .bind(&todo.title)
    .bind(todo.completed)
    .bind(todo_id)
    //executs the query and expects to fetch one row as a result
    .fetch_one(pool.get_ref())
    .await;

    // Handle the result of the update operation
    match result {
        // if successful, return the updated todo as JSON
        Ok(updated_todo) => HttpResponse::Ok().json(updated_todo),

        // if no row was found to update, return a 404 Not Found response
        Err(sqlx::Error::RowNotFound) => HttpResponse::NotFound().body("Todo not found"),
        // for other database errors, return a 500 Internal Server Error response
        Err(e) => {
            // macro to print error details to the server console for debugging
            eprintln!("Database error: {:?}", e);
            // println!("Failed to update todo: {:?}", e);
            // Return a generic error message to the client
            HttpResponse::InternalServerError().body("Failed to update todo")
        }
    }
}
