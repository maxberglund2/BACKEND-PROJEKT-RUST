use sqlx::FromRow;

#[derive(Debug, FromRow)]
pub struct User {
    pub id: i32,
    pub email: String,
    pub hashed_password: String,
}