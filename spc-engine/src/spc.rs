pub struct SPCResult {
    pub mean: f64,
    pub std_dev: f64,
    pub ucl: f64,
    pub lcl: f64,
    pub usl: f64,
    pub lsl: f64,
}

pub fn analyze(data: &Vec<f64>, usl: f64, lsl: f64) -> SPCResult {
    let n = data.len() as f64;

    // Mean
    let mean = data.iter().sum::<f64>() / n;

    // Variance
    let variance = data
        .iter()
        .map(|x| (x - mean).powi(2))
        .sum::<f64>()
        / n;

    let std_dev = variance.sqrt();

    // Control limits (3-sigma)
    let ucl = mean + 3.0 * std_dev;
    let lcl = mean - 3.0 * std_dev;

    SPCResult {
        mean,
        std_dev,
        ucl,
        lcl,
        usl,
        lsl,
    }
}