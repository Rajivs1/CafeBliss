import { useState, useEffect, useCallback } from 'react';
import { orderService } from '../../services/orderService';
import { menuService } from '../../services/menuService';
import { userService } from '../../services/userService';
import './Analytics.css';

const STATUS_CFG = {
  pending:   { color: '#f59e0b', glow: 'rgba(245,158,11,0.5)',   icon: '⏳' },
  confirmed: { color: '#a78bfa', glow: 'rgba(167,139,250,0.5)',  icon: '✔️' },
  preparing: { color: '#60a5fa', glow: 'rgba(96,165,250,0.5)',   icon: '👨‍🍳' },
  ready:     { color: '#4ade80', glow: 'rgba(74,222,128,0.5)',   icon: '✅' },
  completed: { color: '#D4A574', glow: 'rgba(212,165,116,0.5)',  icon: '📦' },
  delivered: { color: '#c084fc', glow: 'rgba(192,132,252,0.5)',  icon: '🚚' },
  cancelled: { color: '#f87171', glow: 'rgba(248,113,113,0.5)',  icon: '❌' },
};

const MEDAL = ['🥇','🥈','🥉','4️⃣','5️⃣'];

const Analytics = () => {
  const [loading, setLoading]   = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData]         = useState(null);
  const [tab, setTab]           = useState('overview'); // overview | orders | items

  const fetchAnalytics = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const [orders, menuItems, users] = await Promise.all([
        orderService.getAllOrders(),
        menuService.getAllItems(),
        userService.getAllUsers(),
      ]);

      const totalRevenue    = orders.reduce((s, o) => s + (o.totalAmount || 0), 0);
      const avgOrderValue   = orders.length ? totalRevenue / orders.length : 0;
      const ordersByStatus  = orders.reduce((acc, o) => {
        acc[o.status] = (acc[o.status] || 0) + 1; return acc;
      }, {});

      // Top items
      const itemMap = {};
      orders.forEach(order => {
        order.items?.forEach(item => {
          const n = item.name || item.menuItem?.name || 'Unknown';
          if (!itemMap[n]) itemMap[n] = { name: n, qty: 0, revenue: 0 };
          itemMap[n].qty     += item.quantity || 0;
          itemMap[n].revenue += (item.price || 0) * (item.quantity || 0);
        });
      });
      const topItems = Object.values(itemMap).sort((a,b) => b.qty - a.qty).slice(0,7);

      // Last 14 days chart
      const today = new Date();
      const chartDays = Array.from({ length: 14 }, (_, i) => {
        const d = new Date(today); d.setDate(d.getDate() - (13-i)); d.setHours(0,0,0,0);
        return { date: d, label: d.toLocaleDateString('en-IN',{day:'numeric',month:'short'}), revenue:0, count:0 };
      });
      orders.forEach(o => {
        const od = new Date(o.createdAt); od.setHours(0,0,0,0);
        const match = chartDays.find(d => d.date.getTime() === od.getTime());
        if (match && o.status !== 'cancelled') { match.revenue += o.totalAmount||0; match.count++; }
      });

      // Revenue by category
      const catRevenue = {};
      orders.forEach(o => {
        o.items?.forEach(item => {
          const cat = item.menuItem?.category || item.category || 'Other';
          catRevenue[cat] = (catRevenue[cat] || 0) + (item.price||0)*(item.quantity||0);
        });
      });

      const recentOrders = [...orders].sort((a,b) => new Date(b.createdAt)-new Date(a.createdAt)).slice(0,12);

      setData({
        totalOrders: orders.length,
        totalRevenue,
        avgOrderValue,
        ordersByStatus,
        topItems,
        chartDays,
        catRevenue,
        recentOrders,
        totalCustomers: users.filter(u => u.role === 'customer').length,
        totalMenuItems: menuItems.length,
        availableItems: menuItems.filter(m => m.available).length,
      });
    } catch (err) {
      console.error('Analytics error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchAnalytics(); }, [fetchAnalytics]);

  if (loading) {
    return (
      <div className="an-loading">
        <div className="an-spinner" />
        <p>Loading analytics...</p>
      </div>
    );
  }

  const maxRevenue = Math.max(...(data?.chartDays?.map(d => d.revenue) || [1]), 1);
  const maxStatus  = Math.max(...Object.values(data?.ordersByStatus || {}), 1);
  const maxItem    = data?.topItems?.[0]?.qty || 1;

  return (
    <div className="analytics-page">
      <div className="an-orb an-orb-1" />
      <div className="an-orb an-orb-2" />

      {/* Header */}
      <div className="an-header">
        <div>
          <span className="an-badge">📊 Analytics & Reports</span>
          <h1 className="an-title">Analytics Overview</h1>
          <p className="an-subtitle">Performance insights for Cafe Bliss</p>
        </div>
        <button className={`an-refresh ${refreshing ? 'spinning' : ''}`}
          onClick={() => fetchAnalytics(true)} disabled={refreshing}>
          🔄 {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* KPI Cards */}
      <div className="an-kpi-grid">
        {[
          { label:'Total Orders',    value: data.totalOrders,             icon:'📦', cls:'kpi-orders',   sub:`${data.ordersByStatus.pending||0} pending` },
          { label:'Total Revenue',   value:`₹${data.totalRevenue.toFixed(2)}`, icon:'💰', cls:'kpi-revenue', sub:`avg ₹${data.avgOrderValue.toFixed(2)}` },
          { label:'Customers',       value: data.totalCustomers,           icon:'👥', cls:'kpi-customers',sub:'registered' },
          { label:'Menu Items',      value: data.totalMenuItems,           icon:'🍽️', cls:'kpi-menu',    sub:`${data.availableItems} available` },
        ].map((k,i) => (
          <div key={k.label} className={`an-kpi ${k.cls}`} style={{animationDelay:`${i*0.07}s`}}>
            <div className="kpi-icon-wrap"><span>{k.icon}</span></div>
            <div className="kpi-body">
              <p className="kpi-label">{k.label}</p>
              <h2 className="kpi-value">{k.value}</h2>
              <p className="kpi-sub">{k.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="an-tabs">
        {['overview','orders','items'].map(t => (
          <button key={t} className={`an-tab ${tab===t?'active':''}`} onClick={()=>setTab(t)}>
            {t==='overview'?'📈 Overview':t==='orders'?'🧾 Orders':'🍽️ Menu Items'}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {tab === 'overview' && (
        <div className="an-overview">
          {/* 14-day chart */}
          <div className="an-glass-card an-chart-card">
            <div className="an-card-header">
              <h3 className="an-card-title">📈 Revenue — Last 14 Days</h3>
              <span className="an-card-sub">Daily totals (₹)</span>
            </div>
            <div className="an-bar-chart">
              {data.chartDays.map((day, i) => (
                <div key={i} className="an-bar-col">
                  <span className="an-bar-val">
                    {day.revenue>0 ? `₹${day.revenue.toFixed(0)}` : ''}
                  </span>
                  <div className="an-bar-track">
                    <div className="an-bar-fill"
                      style={{ height:`${(day.revenue/maxRevenue)*100}%` }} />
                  </div>
                  <span className="an-bar-label">{day.label}</span>
                  {day.count>0 && <span className="an-bar-count">{day.count}</span>}
                </div>
              ))}
            </div>
            {data.chartDays.every(d=>d.revenue===0) && (
              <div className="an-empty"><span>📉</span><p>No sales in the last 14 days</p></div>
            )}
          </div>

          {/* Status breakdown */}
          <div className="an-glass-card an-status-card">
            <div className="an-card-header">
              <h3 className="an-card-title">🍽️ Orders by Status</h3>
            </div>
            <div className="an-status-list">
              {Object.entries(data.ordersByStatus).map(([status, count]) => {
                const cfg = STATUS_CFG[status] || { color:'#94a3b8', glow:'rgba(148,163,184,0.4)', icon:'•' };
                return (
                  <div key={status} className="an-status-row">
                    <div className="an-status-info">
                      <span className="an-status-icon">{cfg.icon}</span>
                      <span className="an-status-name">{status}</span>
                      <span className="an-status-count">{count}</span>
                      <span className="an-status-pct">
                        {((count/data.totalOrders)*100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="an-status-track">
                      <div className="an-status-fill"
                        style={{ width:`${(count/maxStatus)*100}%`, background:cfg.color, boxShadow:`0 0 8px ${cfg.glow}` }} />
                    </div>
                  </div>
                );
              })}
              {Object.keys(data.ordersByStatus).length === 0 && (
                <div className="an-empty"><span>📋</span><p>No order data yet</p></div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {tab === 'orders' && (
        <div className="an-glass-card">
          <div className="an-card-header">
            <h3 className="an-card-title">🧾 Recent Orders</h3>
            <span className="an-card-sub">{data.recentOrders.length} most recent</span>
          </div>
          <div className="an-table-wrap">
            {data.recentOrders.length === 0 ? (
              <div className="an-empty"><span>🛍️</span><p>No orders yet</p></div>
            ) : (
              <table className="an-table">
                <thead>
                  <tr>
                    <th>Order ID</th><th>Items</th><th>Amount</th>
                    <th>Status</th><th>Payment</th><th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentOrders.map(order => {
                    const cfg = STATUS_CFG[order.status] || { color:'#94a3b8', icon:'•' };
                    return (
                      <tr key={order._id} className="an-tr">
                        <td className="an-order-id">#{order._id.slice(-6).toUpperCase()}</td>
                        <td>{order.items?.length||0} item{(order.items?.length||0)!==1?'s':''}</td>
                        <td className="an-order-amt">₹{(order.totalAmount||0).toFixed(2)}</td>
                        <td>
                          <span className="an-status-pill"
                            style={{ color:cfg.color, background:`${cfg.color}22`, border:`1px solid ${cfg.color}55` }}>
                            {cfg.icon} {order.status}
                          </span>
                        </td>
                        <td>
                          <span className={`an-pay-pill ${order.paymentStatus==='paid'?'pay-paid':'pay-pending'}`}>
                            {order.paymentStatus || 'pending'}
                          </span>
                        </td>
                        <td className="an-order-date">
                          {new Date(order.createdAt).toLocaleDateString('en-IN',
                            { day:'numeric', month:'short', hour:'2-digit', minute:'2-digit' })}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* Items Tab */}
      {tab === 'items' && (
        <div className="an-glass-card">
          <div className="an-card-header">
            <h3 className="an-card-title">🏆 Top Menu Items by Orders</h3>
          </div>
          {data.topItems.length === 0 ? (
            <div className="an-empty"><span>🍽️</span><p>No item data yet</p></div>
          ) : (
            <div className="an-items-list">
              {data.topItems.map((item, idx) => (
                <div key={idx} className="an-item-row" style={{animationDelay:`${idx*0.06}s`}}>
                  <span className="an-item-medal">{MEDAL[idx]||`#${idx+1}`}</span>
                  <div className="an-item-info">
                    <span className="an-item-name">{item.name}</span>
                    <div className="an-item-bar-wrap">
                      <div className="an-item-bar">
                        <div className="an-item-bar-fill"
                          style={{ width:`${(item.qty/maxItem)*100}%` }} />
                      </div>
                    </div>
                  </div>
                  <div className="an-item-stats">
                    <span className="an-item-qty">{item.qty} orders</span>
                    <span className="an-item-rev">₹{item.revenue.toFixed(0)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Analytics;
