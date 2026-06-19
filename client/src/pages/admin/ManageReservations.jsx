import { useState, useEffect, useCallback } from 'react';
import { reservationService } from '../../services/reservationService';
import './ManageReservations.css';

const STATUS_CFG = {
  pending:   { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)',  glow: 'rgba(245,158,11,0.4)',  icon: '⏳', label: 'Pending' },
  confirmed: { color: '#4ade80', bg: 'rgba(74,222,128,0.12)',  glow: 'rgba(74,222,128,0.4)',  icon: '✅', label: 'Confirmed' },
  cancelled: { color: '#f87171', bg: 'rgba(248,113,113,0.12)', glow: 'rgba(248,113,113,0.4)', icon: '❌', label: 'Cancelled' },
  completed: { color: '#D4A574', bg: 'rgba(212,165,116,0.12)', glow: 'rgba(212,165,116,0.4)', icon: '📦', label: 'Completed' },
};

const ManageReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [updating, setUpdating]         = useState(null);
  const [filterStatus, setFilter]       = useState('all');
  const [filterDate, setFilterDate]     = useState('');
  const [searchTerm, setSearch]         = useState('');
  const [toast, setToast]               = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3200);
  };

  const fetchReservations = useCallback(() => {
    setLoading(true);
    reservationService.getAllReservations()
      .then(data => setReservations([...data].sort((a, b) => new Date(a.date) - new Date(b.date))))
      .catch(err => { console.error(err); showToast('Failed to load reservations', 'error'); })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchReservations(); }, [fetchReservations]);

  const handleStatusChange = async (id, status) => {
    setUpdating(id);
    try {
      await reservationService.updateReservation(id, { status });
      setReservations(prev => prev.map(r => r._id === id ? { ...r, status } : r));
      showToast(`Reservation ${status}`);
    } catch {
      showToast('Failed to update reservation', 'error');
    } finally {
      setUpdating(null);
    }
  };

  // Counts
  const counts = Object.keys(STATUS_CFG).reduce((acc, s) => {
    acc[s] = reservations.filter(r => r.status === s).length; return acc;
  }, { all: reservations.length });
  counts.all = reservations.length;

  // Today's count
  const todayStr = new Date().toISOString().split('T')[0];
  const todayCount = reservations.filter(r =>
    new Date(r.date).toISOString().split('T')[0] === todayStr
  ).length;

  // Filtered list
  const filtered = reservations.filter(r => {
    const matchStatus = filterStatus === 'all' || r.status === filterStatus;
    const matchDate   = !filterDate || new Date(r.date).toISOString().split('T')[0] === filterDate;
    const matchSearch = !searchTerm ||
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.phone?.includes(searchTerm);
    return matchStatus && matchDate && matchSearch;
  });

  if (loading) return (
    <div className="mr-loading">
      <div className="mr-spinner" />
      <p>Loading reservations…</p>
    </div>
  );

  return (
    <div className="manage-reservations">
      <div className="mr-orb mr-orb-1" />
      <div className="mr-orb mr-orb-2" />

      {/* Toast */}
      {toast && <div className={`mr-toast mr-toast-${toast.type}`}>{toast.msg}</div>}

      {/* Header */}
      <div className="mr-header">
        <div>
          <span className="mr-badge">📅 Reservation Management</span>
          <h1 className="mr-title">Manage Reservations</h1>
          <p className="mr-subtitle">
            {reservations.length} total · {todayCount} today
          </p>
        </div>
        <button className="mr-refresh" onClick={fetchReservations}>🔄 Refresh</button>
      </div>

      {/* Summary cards */}
      <div className="mr-summary">
        {[
          { key: 'all',       label: 'All',       icon: '📋', count: counts.all },
          { key: 'pending',   label: 'Pending',   icon: '⏳', count: counts.pending   || 0 },
          { key: 'confirmed', label: 'Confirmed', icon: '✅', count: counts.confirmed || 0 },
          { key: 'completed', label: 'Completed', icon: '📦', count: counts.completed || 0 },
          { key: 'cancelled', label: 'Cancelled', icon: '❌', count: counts.cancelled || 0 },
        ].map(s => (
          <button key={s.key}
            className={`mr-sum-card ${filterStatus === s.key ? 'active' : ''}`}
            onClick={() => setFilter(s.key)}>
            <span className="mr-sum-icon">{s.icon}</span>
            <span className="mr-sum-count">{s.count}</span>
            <span className="mr-sum-label">{s.label}</span>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="mr-filters">
        <div className="mr-search-wrap">
          <span>🔍</span>
          <input className="mr-search" value={searchTerm}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search name, email, phone…" />
          {searchTerm && <button className="mr-clear" onClick={() => setSearch('')}>✕</button>}
        </div>
        <div className="mr-date-wrap">
          <span>📅</span>
          <input type="date" className="mr-date-input" value={filterDate}
            onChange={e => setFilterDate(e.target.value)} />
          {filterDate && <button className="mr-clear" onClick={() => setFilterDate('')}>✕</button>}
        </div>
        <span className="mr-results">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Empty */}
      {filtered.length === 0 ? (
        <div className="mr-empty">
          <span>📅</span>
          <p>{searchTerm || filterDate ? 'No reservations match your filters.' : 'No reservations yet.'}</p>
        </div>
      ) : (
        <div className="mr-grid">
          {filtered.map((res, i) => {
            const cfg = STATUS_CFG[res.status] || STATUS_CFG.pending;
            const isToday = new Date(res.date).toISOString().split('T')[0] === todayStr;
            const isPast  = new Date(res.date) < new Date() && res.status === 'pending';

            return (
              <div key={res._id} className={`mr-card ${isPast ? 'mr-card-past' : ''}`}
                style={{ '--cfg-color': cfg.color, '--cfg-glow': cfg.glow, animationDelay: `${i * 0.05}s` }}>

                {isToday && <div className="mr-today-banner">📅 Today</div>}

                {/* Card head */}
                <div className="mr-card-head">
                  <div className="mr-datetime">
                    <span className="mr-date-val">
                      {new Date(res.date).toLocaleDateString('en-IN', {
                        weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'
                      })}
                    </span>
                    <span className="mr-time-val">🕐 {res.time}</span>
                  </div>
                  <span className="mr-status-pill"
                    style={{ color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.color}55` }}>
                    {cfg.icon} {cfg.label}
                  </span>
                </div>

                {/* Guest info */}
                <div className="mr-guest-info">
                  <div className="mr-info-row">
                    <span className="mr-info-icon">👤</span>
                    <span className="mr-info-name">{res.name}</span>
                    <span className="mr-guest-count">👥 {res.guests} guest{res.guests !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="mr-info-row">
                    <span className="mr-info-icon">📧</span>
                    <span className="mr-info-text">{res.email}</span>
                  </div>
                  {res.phone && (
                    <div className="mr-info-row">
                      <span className="mr-info-icon">📞</span>
                      <span className="mr-info-text">{res.phone}</span>
                    </div>
                  )}
                  {res.specialRequests && (
                    <div className="mr-info-row mr-special">
                      <span className="mr-info-icon">💬</span>
                      <span className="mr-info-text">{res.specialRequests}</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                {res.status !== 'cancelled' && res.status !== 'completed' && (
                  <div className="mr-actions">
                    {res.status === 'pending' && (
                      <button
                        className="mr-btn mr-btn-confirm"
                        disabled={updating === res._id}
                        onClick={() => handleStatusChange(res._id, 'confirmed')}>
                        {updating === res._id ? '…' : '✅ Confirm'}
                      </button>
                    )}
                    {res.status === 'confirmed' && (
                      <button
                        className="mr-btn mr-btn-complete"
                        disabled={updating === res._id}
                        onClick={() => handleStatusChange(res._id, 'completed')}>
                        {updating === res._id ? '…' : '📦 Mark Done'}
                      </button>
                    )}
                    <button
                      className="mr-btn mr-btn-cancel"
                      disabled={updating === res._id}
                      onClick={() => handleStatusChange(res._id, 'cancelled')}>
                      {updating === res._id ? '…' : '❌ Cancel'}
                    </button>
                  </div>
                )}

                {updating === res._id && <div className="mr-updating"><div className="mr-mini-spin" /></div>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ManageReservations;
