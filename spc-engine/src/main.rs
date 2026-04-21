use axum::{routing::post, Json, Router};
use serde::{Deserialize, Serialize};
use std::net::SocketAddr;
use tower_http::cors::CorsLayer;

mod spc;
mod worker;

use spc::{analyze, SPCInput};

#[derive(Deserialize)]
struct InputPayload {
    data: Vec<f64>,
    usl: f64,
    lsl: f64,
}

#[derive(Serialize)]
struct OutputPayload {
    mean: f64,
    std_dev: f64,
    cp: f64,
    cpk: f64,
    ucl: f64,
    lcl: f64,
    out_of_control: bool,
    violations: Vec<String>,
}

async fn analyze_handler(Json(payload): Json<InputPayload>) -> Json<OutputPayload> {
    let result = analyze(SPCInput {
        data: payload.data,
        usl: payload.usl,
        lsl: payload.lsl,
    });

    Json(OutputPayload {
        mean: result.mean,
        std_dev: result.std_dev,
        cp: result.cp,
        cpk: result.cpk,
        ucl: result.ucl,
        lcl: result.lcl,
        out_of_control: result.out_of_control,
        violations: result.violations,
    })
}


#[tokio::main]
async fn main() {
    // 🔥 Start background monitoring worker
    tokio::spawn(async {
        worker::start_worker().await;
    });

    // API routes
    let app = Router::new()
    .route("/analyze", post(analyze_handler))
    .layer(CorsLayer::permissive());

    // Server setup
    let addr = SocketAddr::from(([127, 0, 0, 1], 3000));
    println!("Server running on http://{}", addr);

    let listener = tokio::net::TcpListener::bind(addr)
        .await
        .unwrap();

    axum::serve(listener, app)
        .await
        .unwrap();
}