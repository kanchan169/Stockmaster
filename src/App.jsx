// src/App.jsx
import React, { useEffect, useState } from "react";
import "./App.css";

// Small reusable KPI card
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

function App() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 🔁 Call your backend API here
    // TODO: change this URL to your friend's real backend URL
    const API_URL = "http://192.168.1.10:5000";

    fetch(API_URL)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch dashboard data");
        }
        return res.json();
      })
      .then((data) => {
        setDashboardData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message || "Something went wrong");
        setLoading(false);
      });
  }, []); // [] → run once on page load

  // ⏳ loading state
  if (loading) {
    return (
      <div className="app">
        <header className="topbar">
          <div className="logo">
            Stock<span>Master</span>
          </div>
        </header>
        <main className="dashboard">
          <h2>Loading dashboard...</h2>
        </main>
      </div>
    );
  }

  // ❌ error state
  if (error) {
    return (
      <div className="app">
        <header className="topbar">
          <div className="logo">
            Stock<span>Master</span>
          </div>
        </header>
        <main className="dashboard">
          <h2>Failed to load dashboard</h2>
          <p>{error}</p>
        </main>
      </div>
    );
  }

  // ✅ Main UI when data is loaded
  const {
    totalStock,
    lowStockCount,
    pendingReceipts,
    pendingDeliveries,
    internalTransfers,
    recentOperations = [],
  } = dashboardData;

  return (
    <div className="app">
      {/* Top bar */}
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

      {/* Main dashboard content */}
      <main className="dashboard">
        {/* Title row */}
        <section className="dashboard-header">
          <div>
            <h1>Inventory Dashboard</h1>
            <p>Live overview of stock, movements and alerts.</p>
          </div>
          <div className="filters-row">
            <select className="select">
              <option>All Warehouses</option>
              <option>Main Store</option>
              <option>Back Store</option>
            </select>
            <select className="select">
              <option>Today</option>
              <option>Last 7 days</option>
              <option>Last 30 days</option>
            </select>
          </div>
        </section>

        {/* KPI cards */}
        <section className="kpi-grid">
          <KpiCard
            title="Total Stock"
            value={totalStock}
            subtitle="Units across all products"
            accent="accent-green"
          />
          <KpiCard
            title="Low & Out of Stock"
            value={lowStockCount}
            subtitle="Needs reorder soon"
            accent="accent-yellow"
          />
          <KpiCard
            title="Pending Receipts"
            value={pendingReceipts}
            subtitle="Vendor shipments waiting"
            accent="accent-blue"
          />
          <KpiCard
            title="Pending Deliveries"
            value={pendingDeliveries}
            subtitle="Orders not dispatched"
            accent="accent-orange"
          />
          <KpiCard
            title="Internal Transfers"
            value={internalTransfers}
            subtitle="Scheduled today"
            accent="accent-cyan"
          />
        </section>

        {/* Simple table from recentOperations (optional) */}
        <section className="table-card">
          <div className="card-header">
            <span className="card-title">Recent Operations</span>
          </div>
          <table>
            <thead>
              <tr>
                <th>Type</th>
                <th>Reference</th>
                <th>Product</th>
                <th>Qty</th>
                <th>Status</th>
                <th>Location</th>
                <th>When</th>
              </tr>
            </thead>
            <tbody>
              {recentOperations.map((op, index) => (
                <tr key={index}>
                  <td>{op.type}</td>
                  <td>{op.reference}</td>
                  <td>{op.product}</td>
                  <td>{op.qty}</td>
                  <td>{op.status}</td>
                  <td>{op.location}</td>
                  <td>{op.when}</td>
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
