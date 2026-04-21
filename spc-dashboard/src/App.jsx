import { useEffect, useState } from "react";
import axios from "axios";
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
} from "recharts";

function App() {
  const [chartData, setChartData] = useState([]);
  const [stats, setStats] = useState(null);
  const [dark, setDark] = useState(true);

  const generateData = () => {
    const base = Array.from({ length: 10 }, () =>
      5 + (Math.random() - 0.5) * 0.2
    );
    if (Math.random() > 0.7) base[base.length - 1] += 0.8;
    return base;
  };

  const fetchData = async () => {
    try {
      const inputData = generateData();

      const res = await axios.post("http://127.0.0.1:3000/analyze", {
        data: inputData,
        usl: 5.2,
        lsl: 4.8,
      });

      const now = new Date();

      const formatted = inputData.map((val, i) => ({
        time: new Date(now.getTime() + i * 1000).toLocaleTimeString(),
        value: val,
        ucl: res.data.ucl,
        lcl: res.data.lcl,
        mean: res.data.mean,
        isAnomaly: val > res.data.ucl || val < res.data.lcl,
      }));

      setChartData(formatted);
      setStats(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
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
      
      {/* 🔥 Sidebar */}
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

      {/* 🔥 Main Content */}
      <div style={{ flex: 1, padding: "20px", color: text }}>
        
        {/* HEADER */}
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
          SPC Real-Time Monitoring
        </motion.h1>

        {/* STATS */}
        {stats && (
          <motion.div
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            style={{ display: "flex", gap: 20, marginTop: 20, flexWrap: "wrap" }}
          >
            <Card label="Mean" value={stats.mean.toFixed(3)} />
            <Card label="Cpk" value={stats.cpk.toFixed(3)} />
            <Card
              label="Status"
              value={stats.out_of_control ? "🚨 ALERT" : "✅ OK"}
              danger={stats.out_of_control}
            />
          </motion.div>
        )}

        {/* CHART */}
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

              <Line dataKey="value" stroke="#3b82f6" dot={renderDot} />
              <Line dataKey="ucl" stroke="#ef4444" />
              <Line dataKey="lcl" stroke="#22c55e" />
              <Line dataKey="mean" stroke="#f59e0b" />
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