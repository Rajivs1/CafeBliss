import { useState, useEffect, useCallback } from 'react';
import { orderService } from '../../services/orderService';
import { useSocket } from '../../hooks/useSocket';
import './StaffDashboard.css';

const STATUS_ORDER = ['pending', 'confirmed', 'preparing', 'ready', 'completed', 'delivered', 'cancelled'];

const STATUS_CFG = {
  pending:   { color: '#f59e0b', glow: 'rgba(245,158,11,0.45)',   bg: 'rgba(245,158,11,0.12)',  icon: '⏳', next: 'confirmed' },
  confirmed: { color: '#a78bfa', glow: 'rgba(167,139,250,0.45)',  bg: 'rgba(167,139,250,0.12)', icon: '✔️', next: 'preparing' },
  preparing: { color: '#60a5fa', glow: 'rgba(96,165,250,0.45)',   bg: 'rgba(96,165,250,0.12)',  icon: '👨‍🍳', next: 'ready' },
  ready:     { color: '#4ade80', glow: 'rgba(74,222,128,0.45)',   bg: 'rgba(74,222,128,0.12)',  icon: '✅', next: 'completed' },
  completed: { color: '#D4A574', glow: 'rgba(212,165,116,0.45)',  bg: 'rgba(212,165,116,0.12)', icon: '📦', next: 'delivered' },
  delivered: { color: '#c084fc', glow: 'rgba(192,132,252,0.45)',  bg: 'rgba(192,132,252,0.12)', icon: '🚚', next: null },
  cancelled: { color: '#f87171', glow: 'rgba(248,113,113,0.45)',  bg: 'rgba(248,113,113,0.12)', icon: '❌', next: null },
};

const StaffDashboard = () => {
  const [orders, setOrders]         = useState([]);
  const [loading, setLoading]       = useState(true);
  const [filterStatus, setFilter]   = useState('all');
  const [searchTerm, setSearch]     = useState('');
  const [updating, setUpdating]     = useState(null);
  const [newOrderIds, setNewOrderIds] = useState(new Set());
  const socket = useSocket();

  const fetchOrders = useCallback(async () => {
    try {
      const data = await orderService.getAllOrders();
      const sorted = [...data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setOrders(sorted);
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  // Real-time socket updates
  useEffect(() => {
    if (!socket) return;
    socket.emit('join-staff');

    socket.on('newOrder', (order) => {
      setOrders(prev => [order, ...prev]);
      setNewOrderIds(prev => new Set([...prev, order._id]));
      // Clear "new" highlight after 5s
      setTimeout(() => {
        setNewOrderIds(prev => { const s = new Set(prev); s.delete(order._id); return s; });
      }, 5000);
    });

    socket.on('orderUpdated', (updatedOrder) => {
      setOrders(prev => prev.map(o => o._id === updatedOrder._id ? updatedOrder : o));
    });

    return () => {
      socket.off('newOrder');
      socket.off('orderUpdated');
    };
  }, [socket]);

  const handleUpdateStatus = async (orderId, status) => {
    setUpdating(orderId);
    try {
      await orderService.updateOrderStatus(orderId, status);
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status } : o));
    } catch (err) {
      console.error('Error updating status:', err);
    } finally {
      setUpdating(null);
    }
  };

  // Counts per status
  const counts = STATUS_ORDER.reduce((acc, s) => {
    acc[s] = orders.filter(o => o.status === s).length; return acc;
  }, {});
  counts.all = orders.length;

  const filtered = orders.filter(o => {
    const matchStatus = filterStatus === 'all' || o.status === filterStatus;
    const matchSearch = !searchTerm ||
      o._id.includes(searchTerm.toLowerCase()) ||
      (o.user?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchStatus && matchSearch;
  });

  if (loading) {
    return (
      <div className="sd-loading">
        <div className="sd-spinner" />
        <p>Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="staff-dashboard">
      <div className="sd-orb sd-orb-1" />
      <div className="sd-orb sd-orb-2" />

      {/* Header */}
      <div className="sd-header">
        <div>
          <span className="sd-badge">🧾 Order Management</span>
          <h1 className="sd-title">View Orders</h1>
          <p className="sd-subtitle">
            {orders.length} total order{orders.length !== 1 ? 's' : ''} — real-time updates active
            {socket ? <span className="sd-live">● Live</span> : <span className="sd-offline">○ Offline</span>}
          </p>
        </div>
        <button className="sd-refresh-btn" onClick={fetchOrders}>🔄 Refresh</button>
      </div>

      {/* Status filter tabs */}
      <div className="sd-filter-row">
        <button className={`sd-filter-btn ${filterStatus==='all'?'active':''}`}
          onClick={() => setFilter('all')}>
          All <span className="sd-cnt">{counts.all}</span>
        </button>
        {STATUS_ORDER.map(s => {
          const cfg = STATUS_CFG[s];
          return (
            <button key={s}
              className={`sd-filter-btn ${filterStatus===s?'active':''}`}
              style={filterStatus===s ? { color:cfg.color, borderColor:cfg.color, background:cfg.bg } : {}}
              onClick={() => setFilter(s)}>
              {cfg.icon} {s} <span className="sd-cnt">{counts[s]||0}</span>
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="sd-search-row">
        <div className="sd-search-wrap">
          <span>🔍</span>
          <input className="sd-search" value={searchTerm} onChange={e => setSearch(e.target.value)}
            placeholder="Search by Order ID or customer name..." />
          {searchTerm && <button className="sd-search-clear" onClick={() => setSearch('')}>✕</button>}
        </div>
        <span className="sd-results">{filtered.length} order{filtered.length!==1?'s':''} shown</span>
      </div>

      {/* Orders */}
      {filtered.length === 0 ? (
        <div className="sd-empty">
          <span>🛍️</span>
          <p>{searchTerm ? 'No orders match your search.' : `No ${filterStatus !== 'all' ? filterStatus : ''} orders.`}</p>
        </div>
      ) : (
        <div className="sd-orders-grid">
          {filtered.map((order, idx) => {
            const cfg = STATUS_CFG[order.status] || STATUS_CFG.pending;
            const isNew = newOrderIds.has(order._id);
            const isUpdating = updating === order._id;

            return (
              <div key={order._id}
                className={`sd-order-card ${isNew ? 'sd-new' : ''}`}
                style={{ animationDelay: `${idx * 0.04}s`, '--cfg-color': cfg.color, '--cfg-glow': cfg.glow }}>

                {isNew && <div className="sd-new-banner">🔔 New Order!</div>}

                {/* Card header */}
                <div className="sd-card-head">
                  <div className="sd-order-id">#{order._id.slice(-6).toUpperCase()}</div>
                  <span className="sd-status-pill"
                    style={{ color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.color}55` }}>
                    {cfg.icon} {order.status}
                  </span>
                </div>

                {/* Customer & meta */}
                <div className="sd-card-meta">
                  <div className="sd-meta-row">
                    <span className="sd-meta-icon">👤</span>
                    <span>{order.user?.name || 'Guest Customer'}</span>
                  </div>
                  {order.phone && (
                    <div className="sd-meta-row">
                      <span className="sd-meta-icon">📞</span>
                      <span>{order.phone}</span>
                    </div>
                  )}
                  <div className="sd-meta-row">
                    <span className="sd-meta-icon">🕐</span>
                    <span>{new Date(order.createdAt).toLocaleString('en-IN', {
                      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                    })}</span>
                  </div>
                </div>

                {/* Items list */}
                <div className="sd-items-list">
                  {(order.items || []).map((item, i) => (
                    <div key={i} className="sd-item">
                      <span className="sd-item-name">{item.name || item.menuItem?.name || 'Item'}</span>
                      <span className="sd-item-qty">×{item.quantity}</span>
                      <span className="sd-item-price">₹{((item.price || 0) * item.quantity).toFixed(0)}</span>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="sd-card-footer">
                  <div className="sd-total">
                    <span>Total</span>
                    <span className="sd-total-amt">₹{(order.totalAmount || 0).toFixed(2)}</span>
                  </div>

                  {/* Status selector */}
                  <div className="sd-status-controls">
                    {cfg.next && (
                      <button
                        className="sd-btn-advance"
                        disabled={isUpdating}
                        style={{ background: `linear-gradient(135deg, ${cfg.color}cc, ${cfg.color}88)` }}
                        onClick={() => handleUpdateStatus(order._id, cfg.next)}
                      >
                        {isUpdating ? '...' : `→ Mark ${cfg.next}`}
                      </button>
                    )}
                    <select
                      className="sd-status-select"
                      value={order.status}
                      disabled={isUpdating}
                      onChange={e => handleUpdateStatus(order._id, e.target.value)}
                    >
                      {STATUS_ORDER.map(s => (
                        <option key={s} value={s}>{STATUS_CFG[s].icon} {s}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {isUpdating && <div className="sd-updating-overlay"><div className="sd-mini-spinner" /></div>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StaffDashboard;
