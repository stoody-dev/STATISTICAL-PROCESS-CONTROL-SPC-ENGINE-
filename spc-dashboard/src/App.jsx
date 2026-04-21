import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

function App() {
  const [chartData, setChartData] = useState([]);
  const [stats, setStats] = useState(null);
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const ws = new WebSocket("ws://127.0.0.1:3000/ws");

    ws.onmessage = (event) => {
      const res = JSON.parse(event.data);

      const now = new Date();

      const formatted = res.data.map((val, i) => ({
        time: new Date(now.getTime() + i * 1000).toLocaleTimeString(),
        value: val,
        mean: res.mean,
        ucl: res.ucl,
        lcl: res.lcl,
        usl: res.usl,
        lsl: res.lsl,
        std_dev: res.std_dev,
        isAnomaly: val > res.ucl || val < res.lcl,
      }));

      setChartData(formatted);

      setStats({
        mean: res.mean.toFixed(3),
        std_dev: res.std_dev.toFixed(3),
        status: formatted.some((p) => p.isAnomaly)
          ? "🚨 ALERT"
          : "✅ OK",
      });
    };

    ws.onerror = (err) => console.error("WebSocket error:", err);

    return () => ws.close();
  }, []);

  const renderDot = ({ cx, cy, payload }) =>
    payload.isAnomaly ? (
      <circle cx={cx} cy={cy} r={6} fill="red" />
    ) : (
      <circle cx={cx} cy={cy} r={3} fill="#3b82f6" />
    );

  const bg = dark
    ? "linear-gradient(135deg,#020617,#0f172a)"
    : "#f8fafc";

  const text = dark ? "#e2e8f0" : "#020617";

  return (
    <div style={{ display: "flex", height: "100vh", background: bg }}>
      
      {/* Sidebar */}
      <motion.div
        initial={{ x: -100 }}
        animate={{ x: 0 }}
        style={{
          width: "220px",
          background: dark ? "#020617" : "#fff",
          padding: "20px",
          borderRight: "1px solid #334155",
        }}
      >
        <h2>⚙ SPC</h2>
        <p style={{ marginTop: 20 }}>Dashboard</p>
        <p>Analytics</p>

        <button
          onClick={() => setDark(!dark)}
          style={{
            marginTop: 30,
            padding: "8px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
          }}
        >
          Toggle Theme
        </button>
      </motion.div>

      {/* Main */}
      <div style={{ flex: 1, padding: "20px", color: text }}>
        
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            fontSize: "32px",
            fontWeight: "700",
            background: "linear-gradient(90deg,#3b82f6,#22c55e)",
            WebkitBackgroundClip: "text",
            color: "transparent",
          }}
        >
          📊 SPC Real-Time Monitoring
        </motion.h1>

        {stats && (
          <motion.div
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            style={{
              display: "flex",
              gap: 20,
              marginTop: 20,
              flexWrap: "wrap",
            }}
          >
            <Card label="Mean" value={stats.mean} />
            <Card label="Std Dev" value={stats.std_dev} />
            <Card
              label="Status"
              value={stats.status}
              danger={stats.status.includes("ALERT")}
            />
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            marginTop: 30,
            background: dark ? "#020617" : "#fff",
            padding: 20,
            borderRadius: 12,
          }}
        >
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={chartData}>
              <CartesianGrid stroke="#334155" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />

              {/* Data */}
              <Line dataKey="value" stroke="#3b82f6" dot={renderDot} />

              {/* SPC Lines */}
              <Line dataKey="mean" stroke="#f59e0b" dot={false} />
              <Line dataKey="ucl" stroke="#ef4444" dot={false} />
              <Line dataKey="lcl" stroke="#22c55e" dot={false} />

              {/* Spec Limits */}
              <ReferenceLine y={chartData[0]?.usl} stroke="#f97316" label="USL" />
              <ReferenceLine y={chartData[0]?.lsl} stroke="#06b6d4" label="LSL" />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
}

function Card({ label, value, danger }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      style={{
        padding: "15px",
        borderRadius: "12px",
        background: danger ? "#7f1d1d" : "#1e293b",
        minWidth: "120px",
      }}
    >
      <p style={{ fontSize: 12 }}>{label}</p>
      <h2>{value}</h2>
    </motion.div>
  );
}

export default App;