import { useState, useEffect, useCallback } from 'react';
import { reservationService } from '../../services/reservationService';
import { useAuth } from '../../hooks/useAuth';
import './Reservation.css';

const TIME_SLOTS = [
  '08:00','08:30','09:00','09:30','10:00','10:30','11:00','11:30',
  '12:00','12:30','13:00','13:30','14:00','14:30','15:00','15:30',
  '16:00','16:30','17:00','17:30','18:00','18:30','19:00','19:30',
  '20:00','20:30','21:00','21:30','22:00'
];

const STATUS_CFG = {
  pending:   { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)',  icon: '⏳' },
  confirmed: { color: '#4ade80', bg: 'rgba(74,222,128,0.12)',  icon: '✅' },
  cancelled: { color: '#f87171', bg: 'rgba(248,113,113,0.12)', icon: '❌' },
};

const EMPTY_FORM = (user) => ({
  name: user?.name || '', email: user?.email || '', phone: user?.phone || '',
  date: '', time: '', guests: 2, specialRequests: ''
});

const Reservation = () => {
  const { user }                    = useAuth();
  const [formData, setFormData]     = useState(EMPTY_FORM(user));
  const [reservations, setRes]      = useState([]);
  const [loading, setLoading]       = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast]           = useState(null);
  const [tab, setTab]               = useState('book'); // 'book' | 'mine'

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchReservations = useCallback(() => {
    reservationService.getMyReservations()
      .then(data => setRes([...data].sort((a,b) => new Date(b.date) - new Date(a.date))))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchReservations(); }, [fetchReservations]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await reservationService.createReservation(formData);
      showToast('🎉 Reservation confirmed! We look forward to seeing you.');
      setFormData(EMPTY_FORM(user));
      setTab('mine');
      fetchReservations();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to create reservation', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this reservation?')) return;
    try {
      await reservationService.cancelReservation(id);
      showToast('Reservation cancelled.');
      fetchReservations();
    } catch {
      showToast('Failed to cancel reservation.', 'error');
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="reservation-page">
      <div className="rv-orb rv-orb-1" />
      <div className="rv-orb rv-orb-2" />

      {/* Toast */}
      {toast && (
        <div className={`rv-toast rv-toast-${toast.type}`}>{toast.msg}</div>
      )}

      {/* Header */}
      <div className="rv-header">
        <span className="rv-badge">🍽️ Table Reservation</span>
        <h1 className="rv-title">Reserve Your Table</h1>
        <p className="rv-subtitle">Book a table at Cafe Bliss and enjoy a premium experience</p>
      </div>

      {/* Tabs */}
      <div className="rv-tabs">
        <button className={`rv-tab ${tab==='book'?'active':''}`} onClick={() => setTab('book')}>
          📅 Book a Table
        </button>
        <button className={`rv-tab ${tab==='mine'?'active':''}`} onClick={() => setTab('mine')}>
          📋 My Reservations
          {reservations.length > 0 && <span className="rv-tab-count">{reservations.length}</span>}
        </button>
      </div>

      {/* ── Book Tab ── */}
      {tab === 'book' && (
        <div className="rv-layout">
          {/* Info card */}
          <div className="rv-info-card">
            <div className="rv-info-img">
              <img src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80" alt="Cafe Bliss dining" />
            </div>
            <div className="rv-info-body">
              <h3>Cafe Bliss Dining</h3>
              <p>Experience the finest coffee and cuisine in an elegant atmosphere. Reserve your table and let us craft an unforgettable experience.</p>
              <div className="rv-info-details">
                <div className="rv-info-row"><span>🕐</span><span>Open daily 8:00 AM – 10:00 PM</span></div>
                <div className="rv-info-row"><span>👥</span><span>Tables for 1–10 guests</span></div>
                <div className="rv-info-row"><span>📞</span><span>+91 85219 82915</span></div>
                <div className="rv-info-row"><span>📍</span><span>Cafe Bliss, Main Street</span></div>
              </div>
            </div>
          </div>

          {/* Form card */}
          <div className="rv-form-card">
            <h2 className="rv-form-title">Reservation Details</h2>
            <form onSubmit={handleSubmit} className="rv-form">
              <div className="rv-field-row">
                <div className="rv-field">
                  <label>Full Name *</label>
                  <input name="name" value={formData.name} onChange={handleChange}
                    placeholder="Your name" required />
                </div>
                <div className="rv-field">
                  <label>Email *</label>
                  <input name="email" type="email" value={formData.email} onChange={handleChange}
                    placeholder="you@example.com" required />
                </div>
              </div>

              <div className="rv-field-row">
                <div className="rv-field">
                  <label>Phone *</label>
                  <input name="phone" type="tel" value={formData.phone} onChange={handleChange}
                    placeholder="+91 98765 43210" required />
                </div>
                <div className="rv-field">
                  <label>Number of Guests *</label>
                  <div className="rv-guests-row">
                    <button type="button" className="rv-guest-btn"
                      onClick={() => setFormData(p => ({ ...p, guests: Math.max(1, p.guests-1) }))}>−</button>
                    <span className="rv-guest-count">{formData.guests}</span>
                    <button type="button" className="rv-guest-btn"
                      onClick={() => setFormData(p => ({ ...p, guests: Math.min(10, p.guests+1) }))}>＋</button>
                    <span className="rv-guest-label">guest{formData.guests !== 1 ? 's' : ''}</span>
                  </div>
                </div>
              </div>

              <div className="rv-field-row">
                <div className="rv-field">
                  <label>Date *</label>
                  <input name="date" type="date" value={formData.date} onChange={handleChange}
                    min={todayStr} required />
                </div>
                <div className="rv-field">
                  <label>Time *</label>
                  <select name="time" value={formData.time} onChange={handleChange} required>
                    <option value="">— Select time —</option>
                    {TIME_SLOTS.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="rv-field">
                <label>Special Requests</label>
                <textarea name="specialRequests" value={formData.specialRequests}
                  onChange={handleChange} rows={3}
                  placeholder="Dietary requirements, seating preference, occasion notes…" />
              </div>

              <button type="submit" className="rv-submit-btn" disabled={submitting}>
                {submitting ? '⏳ Booking…' : '✓ Confirm Reservation'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── My Reservations Tab ── */}
      {tab === 'mine' && (
        <div className="rv-my-section">
          {loading ? (
            <div className="rv-loading"><div className="rv-spinner" /><p>Loading…</p></div>
          ) : reservations.length === 0 ? (
            <div className="rv-empty">
              <span>📅</span>
              <p>No reservations yet.</p>
              <button className="rv-book-now" onClick={() => setTab('book')}>Book a Table</button>
            </div>
          ) : (
            <div className="rv-cards-grid">
              {reservations.map((res, i) => {
                const cfg = STATUS_CFG[res.status] || STATUS_CFG.pending;
                return (
                  <div key={res._id} className="rv-card" style={{ animationDelay: `${i*.06}s` }}>
                    <div className="rv-card-head">
                      <div>
                        <span className="rv-card-date">
                          📅 {new Date(res.date).toLocaleDateString('en-IN',
                            { weekday:'short', day:'numeric', month:'long', year:'numeric' })}
                        </span>
                        <span className="rv-card-time">🕐 {res.time}</span>
                      </div>
                      <span className="rv-status-pill"
                        style={{ color:cfg.color, background:cfg.bg, border:`1px solid ${cfg.color}44` }}>
                        {cfg.icon} {res.status}
                      </span>
                    </div>

                    <div className="rv-card-body">
                      <div className="rv-card-row"><span>👤</span><span>{res.name}</span></div>
                      <div className="rv-card-row"><span>👥</span><span>{res.guests} guest{res.guests!==1?'s':''}</span></div>
                      {res.phone && <div className="rv-card-row"><span>📞</span><span>{res.phone}</span></div>}
                      {res.specialRequests && (
                        <div className="rv-card-row rv-special">
                          <span>💬</span><span>{res.specialRequests}</span>
                        </div>
                      )}
                    </div>

                    {res.status !== 'cancelled' && (
                      <button className="rv-cancel-btn" onClick={() => handleCancel(res._id)}>
                        Cancel Reservation
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Reservation;
