use axum::{
    extract::ws::{Message, WebSocket, WebSocketUpgrade},
    response::IntoResponse,
    routing::get,
    Router,
};
use tokio::net::TcpListener;
use tokio::time::{sleep, Duration};

mod spc;

#[tokio::main]
async fn main() {
    let app = Router::new().route("/ws", get(ws_handler));

    let listener = TcpListener::bind("127.0.0.1:3000")
        .await
        .expect("Failed to bind");

    println!("🚀 WebSocket running at ws://127.0.0.1:3000/ws");

    axum::serve(listener, app)
        .await
        .expect("Server failed");
}

async fn ws_handler(ws: WebSocketUpgrade) -> impl IntoResponse {
    ws.on_upgrade(handle_socket)
}

async fn handle_socket(mut socket: WebSocket) {
    loop {
        let data = generate_data();

        let result = spc::analyze(&data, 5.2, 4.8);

        // FULL payload (no unused fields now)
        let payload = serde_json::json!({
            "data": data,
            "mean": result.mean,
            "std_dev": result.std_dev,
            "ucl": result.ucl,
            "lcl": result.lcl,
            "usl": result.usl,
            "lsl": result.lsl
        });

        if socket
            .send(Message::Text(payload.to_string()))
            .await
            .is_err()
        {
            println!("❌ Client disconnected");
            break;
        }

        sleep(Duration::from_secs(1)).await;
    }
}

// Simulated process data with occasional anomaly
fn generate_data() -> Vec<f64> {
    use rand::Rng;

    let mut rng = rand::thread_rng();

    (0..20)
        .map(|_| {
            let mut val = 5.0 + rng.gen_range(-0.3..0.3);

            // Inject anomaly sometimes
            if rng.gen_bool(0.15) {
                val += rng.gen_range(0.7..1.2);
            }

            val
        })
        .collect()
}