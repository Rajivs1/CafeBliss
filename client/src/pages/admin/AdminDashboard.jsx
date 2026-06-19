import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderService } from '../../services/orderService';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    pendingOrders: 0,
    completedOrders: 0,
    cancelledOrders: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 17) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');

    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await orderService.getAllOrders();

      const totalRevenue = data.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
      const pendingOrders = data.filter(o => o.status === 'pending').length;
      const completedOrders = data.filter(o => o.status === 'completed' || o.status === 'delivered').length;
      const cancelledOrders = data.filter(o => o.status === 'cancelled').length;
      const uniqueCustomers = new Set(data.map(o => o.user?._id || o.user)).size;

      setStats({
        totalOrders: data.length,
        totalRevenue,
        totalCustomers: uniqueCustomers,
        pendingOrders,
        completedOrders,
        cancelledOrders,
      });

      // Last 7 days chart data
      const today = new Date();
      const last7 = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(today);
        d.setDate(d.getDate() - (6 - i));
        d.setHours(0, 0, 0, 0);
        return { date: d, label: d.toLocaleDateString('en-US', { weekday: 'short' }), revenue: 0, count: 0 };
      });

      data.forEach(order => {
        const orderDate = new Date(order.createdAt);
        orderDate.setHours(0, 0, 0, 0);
        const match = last7.find(d => d.date.getTime() === orderDate.getTime());
        if (match && order.status !== 'cancelled') {
          match.revenue += order.totalAmount || 0;
          match.count += 1;
        }
      });
      setChartData(last7);

      // Recent orders (last 5)
      const sorted = [...data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setRecentOrders(sorted.slice(0, 5));
    } catch (err) {
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      pending:   { label: 'Pending',   color: '#f59e0b', bg: 'rgba(245,158,11,0.12)',  icon: '⏳' },
      confirmed: { label: 'Confirmed', color: '#a78bfa', bg: 'rgba(167,139,250,0.12)', icon: '✔️' },
      preparing: { label: 'Preparing', color: '#60a5fa', bg: 'rgba(96,165,250,0.12)',  icon: '👨‍🍳' },
      ready:     { label: 'Ready',     color: '#4ade80', bg: 'rgba(74,222,128,0.12)',  icon: '✅' },
      completed: { label: 'Completed', color: '#D4A574', bg: 'rgba(212,165,116,0.12)', icon: '📦' },
      delivered: { label: 'Delivered', color: '#c084fc', bg: 'rgba(192,132,252,0.12)', icon: '🚚' },
      cancelled: { label: 'Cancelled', color: '#f87171', bg: 'rgba(248,113,113,0.12)', icon: '❌' },
    };
    return configs[status] || { label: status, color: '#94a3b8', bg: 'rgba(148,163,184,0.12)', icon: '•' };
  };

  const maxRevenue = Math.max(...chartData.map(d => d.revenue), 1);

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner" />
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-left">
          <span className="greeting-badge">☕ Cafe Bliss Admin</span>
          <h1 className="dashboard-title">{greeting}, Admin 👋</h1>
          <p className="dashboard-subtitle">
            Here&apos;s what&apos;s happening at your cafe today.
          </p>
        </div>
        <div className="header-right">
          <div className="header-date">
            <span className="date-label">Today</span>
            <span className="date-value">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </span>
          </div>
          <button className="refresh-btn" onClick={fetchStats} title="Refresh data">
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card stat-orders">
          <div className="stat-icon-wrap">
            <span className="stat-icon">📦</span>
          </div>
          <div className="stat-body">
            <p className="stat-label">Total Orders</p>
            <h2 className="stat-value">{stats.totalOrders}</h2>
            <p className="stat-sub">
              <span className="stat-badge badge-pending">{stats.pendingOrders} pending</span>
            </p>
          </div>
          <div className="stat-sparkline" />
        </div>

        <div className="stat-card stat-revenue">
          <div className="stat-icon-wrap">
            <span className="stat-icon">💰</span>
          </div>
          <div className="stat-body">
            <p className="stat-label">Total Revenue</p>
            <h2 className="stat-value">₹{Number(stats.totalRevenue).toFixed(2)}</h2>
            <p className="stat-sub">
              <span className="stat-badge badge-success">{stats.completedOrders} completed</span>
            </p>
          </div>
        </div>

        <div className="stat-card stat-customers">
          <div className="stat-icon-wrap">
            <span className="stat-icon">👥</span>
          </div>
          <div className="stat-body">
            <p className="stat-label">Unique Customers</p>
            <h2 className="stat-value">{stats.totalCustomers}</h2>
            <p className="stat-sub">
              <span className="stat-badge badge-info">All time</span>
            </p>
          </div>
        </div>

        <div className="stat-card stat-cancelled">
          <div className="stat-icon-wrap">
            <span className="stat-icon">❌</span>
          </div>
          <div className="stat-body">
            <p className="stat-label">Cancelled Orders</p>
            <h2 className="stat-value">{stats.cancelledOrders}</h2>
            <p className="stat-sub">
              <span className="stat-badge badge-danger">
                {stats.totalOrders > 0
                  ? `${((stats.cancelledOrders / stats.totalOrders) * 100).toFixed(1)}% rate`
                  : '0% rate'}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Main content row */}
      <div className="dashboard-row">
        {/* Sales Chart */}
        <div className="chart-card">
          <div className="card-header">
            <h3 className="card-title">📊 Sales — Last 7 Days</h3>
            <span className="card-subtitle">Daily revenue overview</span>
          </div>
          <div className="bar-chart">
            {chartData.map((day, i) => (
              <div key={i} className="bar-col">
                <span className="bar-value">
                  {day.revenue > 0 ? `₹${day.revenue.toFixed(0)}` : ''}
                </span>
                <div className="bar-track">
                  <div
                    className="bar-fill"
                    style={{ height: `${(day.revenue / maxRevenue) * 100}%` }}
                  />
                </div>
                <span className="bar-label">{day.label}</span>
                {day.count > 0 && <span className="bar-count">{day.count}</span>}
              </div>
            ))}
          </div>
          {chartData.every(d => d.revenue === 0) && (
            <div className="chart-empty">
              <span>📉</span>
              <p>No sales data for the last 7 days</p>
            </div>
          )}
        </div>

        {/* Order Status Breakdown */}
        <div className="status-card">
          <div className="card-header">
            <h3 className="card-title">🍽️ Order Status</h3>
          </div>
          <div className="status-list">
            {[
              { key: 'pending', count: stats.pendingOrders },
              { key: 'completed', count: stats.completedOrders },
              { key: 'cancelled', count: stats.cancelledOrders },
            ].map(({ key, count }) => {
              const cfg = getStatusConfig(key);
              const pct = stats.totalOrders > 0 ? (count / stats.totalOrders) * 100 : 0;
              return (
                <div key={key} className="status-row">
                  <div className="status-info">
                    <span className="status-dot" style={{ background: cfg.color }} />
                    <span className="status-name">{cfg.icon} {cfg.label}</span>
                    <span className="status-count">{count}</span>
                  </div>
                  <div className="status-track">
                    <div
                      className="status-fill"
                      style={{ width: `${pct}%`, background: cfg.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="card-divider" />

          {/* Quick actions */}
          <div className="card-header" style={{ marginTop: '1rem' }}>
            <h3 className="card-title">⚡ Quick Actions</h3>
          </div>
          <div className="quick-actions">
            <Link to="/admin/menu" className="action-btn action-menu">
              🍔 Manage Menu
            </Link>
            <Link to="/admin/staff" className="action-btn action-staff">
              👤 Manage Staff
            </Link>
            <Link to="/admin/analytics" className="action-btn action-analytics">
              📈 Analytics
            </Link>
            <Link to="/staff/dashboard" className="action-btn action-orders">
              🧾 View Orders
            </Link>
            <Link to="/admin/reservations" className="action-btn action-reservations">
              📅 Reservations
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="recent-orders-card">
        <div className="card-header">
          <h3 className="card-title">🕐 Recent Orders</h3>
          <Link to="/staff/dashboard" className="view-all-link">View all →</Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">🛍️</span>
            <p>No orders yet. They&apos;ll show up here once customers start ordering.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(order => {
                  const cfg = getStatusConfig(order.status);
                  return (
                    <tr key={order._id}>
                      <td className="order-id">#{order._id.slice(-6).toUpperCase()}</td>
                      <td>{order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? 's' : ''}</td>
                      <td className="order-amount">₹{(order.totalAmount || 0).toFixed(2)}</td>
                      <td>
                        <span
                          className="status-pill"
                          style={{ color: cfg.color, background: cfg.bg }}
                        >
                          {cfg.icon} {cfg.label}
                        </span>
                      </td>
                      <td className="order-date">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                        })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
