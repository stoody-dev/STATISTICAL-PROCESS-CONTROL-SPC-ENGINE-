pub struct SPCInput {
    pub data: Vec<f64>,
    pub usl: f64,
    pub lsl: f64,
}

pub struct SPCResult {
    pub mean: f64,
    pub std_dev: f64,
    pub cp: f64,
    pub cpk: f64,
    pub ucl: f64,
    pub lcl: f64,
    pub out_of_control: bool,
    pub violations: Vec<String>,
}

pub fn analyze(input: SPCInput) -> SPCResult {
    let n = input.data.len() as f64;

    let mean = input.data.iter().sum::<f64>() / n;

    let variance = input
        .data
        .iter()
        .map(|x| (x - mean).powi(2))
        .sum::<f64>()
        / n;

    let std_dev = variance.sqrt();

    let cp = (input.usl - input.lsl) / (6.0 * std_dev);

    let cpu = (input.usl - mean) / (3.0 * std_dev);
    let cpl = (mean - input.lsl) / (3.0 * std_dev);
    let cpk = cpu.min(cpl);

    let ucl = mean + 3.0 * std_dev;
    let lcl = mean - 3.0 * std_dev;

    // 🔥 RULE ENGINE
    let mut violations = Vec::new();

    // Rule 1: Control limit violation
    for &value in &input.data {
        if value > ucl || value < lcl {
            violations.push(format!("Point {} outside control limits", value));
        }
    }

    // Rule 2: Mean shift detection (simple)
    let above_mean = input.data.iter().filter(|&&x| x > mean).count();
    let below_mean = input.data.len() - above_mean;

    if above_mean >= input.data.len() - 1 {
        violations.push("Process shift detected (above mean)".to_string());
    }

    if below_mean >= input.data.len() - 1 {
        violations.push("Process shift detected (below mean)".to_string());
    }

    let out_of_control = !violations.is_empty();

    SPCResult {
        mean,
        std_dev,
        cp,
        cpk,
        ucl,
        lcl,
        out_of_control,
        violations,
    }
}