import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { orderService } from '../../services/orderService';
import { useSocket } from '../../hooks/useSocket';
import './OrderTracking.css';

const STATUS_STEPS = ['pending', 'confirmed', 'preparing', 'ready', 'completed', 'delivered'];

const STATUS_CFG = {
  pending:   { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)',  glow: 'rgba(245,158,11,0.4)',  icon: '⏳', label: 'Pending' },
  confirmed: { color: '#a78bfa', bg: 'rgba(167,139,250,0.12)', glow: 'rgba(167,139,250,0.4)', icon: '✔️', label: 'Confirmed' },
  preparing: { color: '#60a5fa', bg: 'rgba(96,165,250,0.12)',  glow: 'rgba(96,165,250,0.4)',  icon: '👨‍🍳', label: 'Preparing' },
  ready:     { color: '#4ade80', bg: 'rgba(74,222,128,0.12)',  glow: 'rgba(74,222,128,0.4)',  icon: '✅', label: 'Ready' },
  completed: { color: '#D4A574', bg: 'rgba(212,165,116,0.12)', glow: 'rgba(212,165,116,0.4)', icon: '📦', label: 'Completed' },
  delivered: { color: '#c084fc', bg: 'rgba(192,132,252,0.12)', glow: 'rgba(192,132,252,0.4)', icon: '🚚', label: 'Delivered' },
  cancelled: { color: '#f87171', bg: 'rgba(248,113,113,0.12)', glow: 'rgba(248,113,113,0.4)', icon: '❌', label: 'Cancelled' },
};

const OrderTracking = () => {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState('all');
  const socket = useSocket();

  const fetchOrders = useCallback(() => {
    orderService.getMyOrders()
      .then(data => setOrders([...data].sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt))))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  useEffect(() => {
    if (!socket) return;
    socket.on('order-status-updated', ({ orderId, status }) => {
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status } : o));
    });
    return () => socket.off('order-status-updated');
  }, [socket]);

  const active  = orders.filter(o => !['completed','delivered','cancelled'].includes(o.status));
  const past    = orders.filter(o => ['completed','delivered','cancelled'].includes(o.status));
  const filtered = filter === 'active' ? active : filter === 'past' ? past : orders;

  if (loading) return (
    <div className="ot-loading">
      <div className="ot-spinner" />
      <p>Loading your orders…</p>
    </div>
  );

  return (
    <div className="order-tracking">
      <div className="ot-orb ot-orb-1" />
      <div className="ot-orb ot-orb-2" />

      {/* Header */}
      <div className="ot-header">
        <div>
          <span className="ot-badge">🧾 My Orders</span>
          <h1 className="ot-title">Order Tracking</h1>
          <p className="ot-subtitle">
            {orders.length} order{orders.length !== 1 ? 's' : ''}
            {active.length > 0 && <span className="ot-live-badge">● {active.length} active</span>}
          </p>
        </div>
        <div className="ot-header-actions">
          <button className="ot-refresh" onClick={fetchOrders}>🔄 Refresh</button>
          <Link to="/menu" className="ot-order-more">＋ Order More</Link>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="ot-tabs">
        {[
          { key: 'all',    label: 'All Orders', count: orders.length },
          { key: 'active', label: '⚡ Active',   count: active.length },
          { key: 'past',   label: '📦 Past',     count: past.length },
        ].map(t => (
          <button key={t.key}
            className={`ot-tab ${filter === t.key ? 'active' : ''}`}
            onClick={() => setFilter(t.key)}>
            {t.label} <span className="ot-tab-count">{t.count}</span>
          </button>
        ))}
      </div>

      {/* Empty */}
      {filtered.length === 0 ? (
        <div className="ot-empty">
          <span>🛍️</span>
          <p>{filter === 'active' ? 'No active orders right now.' : filter === 'past' ? 'No past orders yet.' : 'You haven\'t placed any orders yet.'}</p>
          <Link to="/menu" className="ot-browse-btn">Browse Menu</Link>
        </div>
      ) : (
        <div className="ot-grid">
          {filtered.map((order, i) => {
            const cfg = STATUS_CFG[order.status] || STATUS_CFG.pending;
            const stepIdx = STATUS_STEPS.indexOf(order.status);
            const isCancelled = order.status === 'cancelled';

            return (
              <div key={order._id} className="ot-card"
                style={{ '--cfg-color': cfg.color, '--cfg-glow': cfg.glow, animationDelay: `${i * 0.06}s` }}>

                {/* Card header */}
                <div className="ot-card-head">
                  <span className="ot-card-id">#{order._id.slice(-6).toUpperCase()}</span>
                  <span className="ot-status-pill"
                    style={{ color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.color}55` }}>
                    {cfg.icon} {cfg.label}
                  </span>
                </div>

                {/* Progress tracker (not shown for cancelled) */}
                {!isCancelled && (
                  <div className="ot-progress">
                    {STATUS_STEPS.map((step, idx) => {
                      const stepCfg = STATUS_CFG[step];
                      const done    = idx < stepIdx;
                      const current = idx === stepIdx;
                      return (
                        <div key={step} className="ot-step">
                          <div className={`ot-dot ${done ? 'done' : ''} ${current ? 'current' : ''}`}
                            style={current ? { borderColor: cfg.color, boxShadow: `0 0 10px ${cfg.glow}` } : {}}>
                            {done ? '✓' : stepCfg.icon}
                          </div>
                          {idx < STATUS_STEPS.length - 1 && (
                            <div className={`ot-line ${done ? 'done' : ''}`}
                              style={done ? { background: cfg.color } : {}} />
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Items */}
                <div className="ot-items">
                  {(order.items || []).map((item, idx) => (
                    <div key={idx} className="ot-item">
                      <span className="ot-item-name">{item.name || item.menuItem?.name}</span>
                      <span className="ot-item-qty">×{item.quantity}</span>
                      <span className="ot-item-price">₹{((item.price || 0) * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="ot-card-footer">
                  <div className="ot-meta">
                    <span className="ot-date">
                      🕐 {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                      })}
                    </span>
                    {order.phone && <span className="ot-phone">📞 {order.phone}</span>}
                  </div>
                  <div className="ot-total">
                    <span>Total</span>
                    <span className="ot-total-amt">₹{(order.totalAmount || 0).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrderTracking;
