use sqlx::FromRow;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct System {
    pub id: i32,
    pub name: String,
    pub user_id: i32,
    pub is_default: bool,
}

#[derive(Debug, Deserialize)]
pub struct CreateSystem {
    pub name: String,
    pub user_id: i32,
    #[serde(default)]
    pub is_default: bool,
}

#[derive(Debug, Deserialize)]
pub struct UpdateSystem {
    pub name: Option<String>,
}