use crate::spc::{analyze, SPCInput};
use tokio::time::{sleep, Duration};

pub async fn start_worker() {
    loop {
        // 🔥 Simulated incoming data
        let data = vec![5.0, 5.2, 5.4, 5.6, 5.8];

        let input = SPCInput {
            data,
            usl: 5.2,
            lsl: 4.8,
        };

        let result = analyze(input);

        if result.out_of_control {
            println!("🚨 ALERT: Process out of control!");
            for v in result.violations {
                println!(" - {}", v);
            }
        } else {
            println!("✅ Process stable");
        }

        // run every 5 seconds
        sleep(Duration::from_secs(5)).await;
    }
}