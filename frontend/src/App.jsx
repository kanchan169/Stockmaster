// src/App.jsx
import React, { useState, useEffect } from "react";
import "./App.css";

const API_URL = "http://localhost:5000/dashboard/summary";

// -------------------------
// Small reusable KPI card
// -------------------------
const KpiCard = ({ title, value, subtitle, accent }) => (
  <div className={`card kpi-card ${accent}`}>
    <div className="card-header">
      <span className="card-title">{title}</span>
      <span className="dot"></span>
    </div>
    <div className="kpi-value">{value}</div>
    <div className="kpi-subtitle">{subtitle}</div>
  </div>
);

// -------------------------
// Auth Component
// -------------------------
const Auth = ({ setLoggedIn }) => {
  const [step, setStep] = useState("login"); // login, signup, otp
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");

  // ----------------- Login -----------------
  const handleLogin = () => {
    if (password) {
      // Simulate password login
      setLoggedIn(true);
    } else {
      // Simulate OTP login
      setStep("otp");
      setMessage(`OTP sent to ${email}`);
    }
  };

  // ----------------- Signup -----------------
  const handleSignup = () => {
    setStep("otp");
    setMessage(`OTP sent to ${email}`);
  };

  // ----------------- OTP Verify -----------------
  const handleVerifyOtp = () => {
    if (otp === "1234") {
      setLoggedIn(true);
    } else {
      setMessage("Incorrect OTP, try 1234");
    }
  };

  return (
    <div className="auth-container">
      {step === "login" && (
        <div className="auth-box">
          <h2>Login</h2>
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Enter password (or leave blank for OTP)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleLogin}>Login / Request OTP</button>
          <p>
            Don't have an account?{" "}
            <span onClick={() => setStep("signup")} className="link">
              Signup
            </span>
          </p>
          {message && <p className="message">{message}</p>}
        </div>
      )}

      {step === "signup" && (
        <div className="auth-box">
          <h2>Signup</h2>
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleSignup}>Request OTP</button>
          <p>
            Already have an account?{" "}
            <span onClick={() => setStep("login")} className="link">
              Login
            </span>
          </p>
          {message && <p className="message">{message}</p>}
        </div>
      )}

      {step === "otp" && (
        <div className="auth-box">
          <h2>Enter OTP</h2>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button onClick={handleVerifyOtp}>Verify OTP</button>
          <p>
            Didn't receive OTP?{" "}
            <span
              onClick={() => {
                setMessage(`OTP resent to ${email}`);
              }}
              className="link"
            >
              Resend
            </span>
          </p>
          {message && <p className="message">{message}</p>}
        </div>
      )}
    </div>
  );
};

// -------------------------
// Main App Component
// -------------------------
function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch dashboard data
  useEffect(() => {
    if (!loggedIn) return;
    const fetchData = async () => {
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error("Failed to fetch dashboard data");
        const data = await res.json();
        setDashboardData(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(err.message || "Something went wrong");
        setLoading(false);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [loggedIn]);

  if (!loggedIn) return <Auth setLoggedIn={setLoggedIn} />;
  if (loading) return <div className="app">Loading dashboard...</div>;
  if (error) return <div className="app">Error: {error}</div>;

  const {
    totalStock,
    lowStockCount,
    pendingReceipts,
    pendingDeliveries,
    fillRate,
    stockAccuracy,
    damagedToday,
    adjustmentsToday,
    recentOperations = { receipts: [], deliveries: [], adjustments: [] },
  } = dashboardData;

  const recentOpsArray = [
    ...recentOperations.receipts.map((r) => ({ ...r, type: "Receipt" })),
    ...recentOperations.deliveries.map((r) => ({ ...r, type: "Delivery" })),
    ...recentOperations.adjustments.map((r) => ({ ...r, type: "Adjustment" })),
  ];

  return (
    <div className="app">
      <header className="topbar">
        <div className="logo">
          Stock<span>Master</span>
        </div>
        <div className="topbar-right">
          <div className="pill pill-outline">Warehouse: Main Store</div>
          <div className="pill pill-solid">Role: Inventory Manager</div>
          <div className="avatar">NM</div>
        </div>
      </header>

      <main className="dashboard">
        <section className="dashboard-header">
          <div>
            <h1>Inventory Dashboard</h1>
            <p>Live overview of stock, movements, and alerts.</p>
          </div>
        </section>

        <section className="kpi-grid">
          <KpiCard title="Total Stock" value={totalStock} subtitle="Units across all products" accent="accent-green" />
          <KpiCard title="Low & Out of Stock" value={lowStockCount} subtitle="Needs reorder soon" accent="accent-yellow" />
          <KpiCard title="Pending Receipts" value={pendingReceipts} subtitle="Vendor shipments waiting" accent="accent-blue" />
          <KpiCard title="Pending Deliveries" value={pendingDeliveries} subtitle="Orders not dispatched" accent="accent-orange" />
          <KpiCard title="Fill Rate" value={`${fillRate}%`} subtitle="Order fulfillment" accent="accent-cyan" />
          <KpiCard title="Stock Accuracy" value={`${stockAccuracy}%`} subtitle="Accuracy vs adjustments" accent="accent-purple" />
          <KpiCard title="Damaged Today" value={damagedToday} subtitle="Units damaged" accent="accent-red" />
          <KpiCard title="Adjustments Today" value={adjustmentsToday} subtitle="Units adjusted" accent="accent-indigo" />
        </section>

        <section className="table-card">
          <div className="card-header">
            <span className="card-title">Recent Operations</span>
          </div>
          <table>
            <thead>
              <tr>
                <th>Type</th>
                <th>ID</th>
                <th>Product</th>
                <th>Qty</th>
                <th>Status</th>
                <th>Location / Customer</th>
                <th>When</th>
              </tr>
            </thead>
            <tbody>
              {recentOpsArray.map((op, index) => (
                <tr key={index}>
                  <td>{op.type}</td>
                  <td>{op.id}</td>
                  <td>{op.product?.name || "-"}</td>
                  <td>{op.quantity ?? op.newQty ?? "-"}</td>
                  <td>{op.status}</td>
                  <td>{op.location || op.customer || "-"}</td>
                  <td>{new Date(op.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}

export default App;
