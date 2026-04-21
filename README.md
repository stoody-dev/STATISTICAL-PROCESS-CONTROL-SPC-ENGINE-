📊 Real-Time SPC Monitoring System

Live SPC Monitoring with Anomaly Detection

✅ Stable Process



🚨 Out-of-Control Process



🧠 Overview



A full-stack system for real-time Statistical Process Control (SPC), designed to monitor process stability, detect anomalies, and visualize trends through an interactive dashboard.



🚀 Features

📈 Real-time time-series visualization

📊 Process capability analysis (Cp, Cpk)

🚨 Automatic anomaly detection

🔴 Out-of-control point highlighting

⏱ Time-based data tracking

🌗 Dark / Light mode UI

⚡ Smooth animations (Framer Motion)

🧭 Dashboard layout with sidebar

🏗️ Architecture



Frontend (React Dashboard)

↓

API Layer (Rust - Axum)

↓

SPC Engine (Core Logic)

↓

Statistical Analysis (Mean, Variance, Cp, Cpk)



⚙️ Tech Stack

Backend

Rust

Axum

Tokio

Frontend

React

Recharts

Framer Motion

📦 Setup Instructions

🔧 Backend



cd spc-engine

cargo run



Runs on: http://127.0.0.1:3000



💻 Frontend



cd spc-dashboard

npm install

npm run dev



Runs on: http://localhost:5173



📊 Key Concepts

Statistical Process Control (SPC)

Control Limits (UCL / LCL)

Process Capability (Cp, Cpk)

Real-time monitoring

Anomaly detection

🔍 How It Works

Frontend generates process data

Sends data to backend API

Backend computes statistics

Returns analysis (mean, UCL, LCL, Cp, Cpk)

Frontend visualizes results in real-time

📌 Future Improvements

WebSocket-based real-time streaming

Database integration (PostgreSQL)

Advanced SPC rules (Western Electric)

Multi-process monitoring

Alert notifications

📎 Author



Akshay Choudhary

