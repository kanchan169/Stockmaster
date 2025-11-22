// src/App.jsx
import React from "react";
import "./App.css";

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

const TinyStat = ({ label, value }) => (
  <div className="tiny-stat">
    <div className="tiny-label">{label}</div>
    <div className="tiny-value">{value}</div>
  </div>
);

function App() {
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
            value="15,780"
            subtitle="Units across all products"
            accent="accent-green"
          />
          <KpiCard
            title="Low & Out of Stock"
            value="23"
            subtitle="Needs reorder soon"
            accent="accent-yellow"
          />
          <KpiCard
            title="Pending Receipts"
            value="5"
            subtitle="Vendor shipments waiting"
            accent="accent-blue"
          />
          <KpiCard
            title="Pending Deliveries"
            value="8"
            subtitle="Orders not dispatched"
            accent="accent-orange"
          />
          <KpiCard
            title="Internal Transfers"
            value="3"
            subtitle="Scheduled today"
            accent="accent-cyan"
          />
        </section>

        {/* Middle row */}
        <section className="middle-grid">
          {/* Fake bar chart */}
          <div className="card chart-card">
            <div className="card-header">
              <span className="card-title">Receipts vs Deliveries</span>
              <span className="badge">Last 7 days</span>
            </div>
            <div className="chart-area">
              <div className="chart-grid-line" />
              <div className="chart-grid-line" />
              <div className="chart-grid-line" />
              <div className="chart-bars">
                <div className="bar bar-1"></div>
                <div className="bar bar-2"></div>
                <div className="bar bar-3"></div>
                <div className="bar bar-4"></div>
                <div className="bar bar-5"></div>
                <div className="bar bar-6"></div>
              </div>
            </div>
            <div className="chart-legend">
              <span className="legend-dot legend-receipts"></span> Receipts
              <span className="legend-dot legend-deliveries"></span> Deliveries
            </div>
          </div>

          {/* Stock health card */}
          <div className="card health-card">
            <div className="card-header">
              <span className="card-title">Stock Health</span>
              <span className="badge badge-ok">Stable</span>
            </div>
            <div className="health-content">
              <div className="radial">
                <div className="radial-inner">
                  <span className="radial-value">87%</span>
                  <span className="radial-label">Service level</span>
                </div>
              </div>
              <div className="health-stats">
                <TinyStat label="Fill Rate" value="93%" />
                <TinyStat label="Stock Accuracy" value="98.2%" />
                <TinyStat label="Damaged Today" value="5 units" />
                <TinyStat label="Adjustments Today" value="2 docs" />
              </div>
            </div>
          </div>
        </section>

        {/* Bottom row */}
        <section className="bottom-grid">
          {/* Quick actions */}
          <div className="card quick-actions-card">
            <div className="card-header">
              <span className="card-title">Quick Actions</span>
            </div>
            <button className="btn primary">
              <span>+ New Receipt</span>
              <span className="btn-subtitle">
                Record incoming stock from vendor
              </span>
            </button>
            <button className="btn">
              <span>+ New Delivery</span>
              <span className="btn-subtitle">
                Dispatch to customer/store
              </span>
            </button>
            <button className="btn">
              <span>+ Internal Transfer</span>
              <span className="btn-subtitle">
                Move goods between storage locations
              </span>
            </button>
            <button className="btn">
              <span>Stock Adjustment</span>
              <span className="btn-subtitle">
                Correct mismatch after physical count
              </span>
            </button>
          </div>

          {/* Recent operations table */}
          <div className="card table-card">
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
                <tr>
                  <td>Receipt</td>
                  <td>RCPT-2025-014</td>
                  <td>Sunrise Milk 1L</td>
                  <td>+120</td>
                  <td><span className="status-pill status-done">Done</span></td>
                  <td>Main Store</td>
                  <td>Today · 09:42</td>
                </tr>
                <tr>
                  <td>Delivery</td>
                  <td>DO-2025-088</td>
                  <td>Family Chips 70g</td>
                  <td>-60</td>
                  <td><span className="status-pill status-waiting">Waiting</span></td>
                  <td>Main Store</td>
                  <td>Today · 09:10</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
