import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '' });
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      await register(formData);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      {/* ── Left: café photo panel ── */}
      <div className="auth-image-panel">
        <img
          src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1200&q=85"
          alt="Café Bliss atmosphere"
        />
        <div className="auth-image-quote">
          <blockquote>
            "Every great cup starts with a single bean — and a warm welcome."
          </blockquote>
          <cite>— Café Bliss</cite>
        </div>
      </div>

      {/* ── Right: form panel ── */}
      <div className="auth-form-panel">
        <div className="auth-container">

          {/* Header */}
          <div className="auth-header">
            <span className="auth-brand">Café Bliss</span>
            <h2 className="auth-title">Create account</h2>
            <p className="auth-subtitle">Join us and enjoy every sip</p>
            <hr className="auth-rule" />
          </div>

          {/* Error */}
          {error && (
            <div className="error-message animate-shake">
              <span className="error-icon">⚠</span>
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="auth-form" noValidate>

            <div className="input-group">
              <label htmlFor="reg-name">Full name</label>
              <input
                type="text"
                id="reg-name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Jane Doe"
                autoComplete="name"
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="reg-email">Email address</label>
              <input
                type="email"
                id="reg-email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="reg-phone">Phone <span style={{ fontWeight: 300, textTransform: 'none', letterSpacing: 0 }}>(optional)</span></label>
              <input
                type="tel"
                id="reg-phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 555 000 0000"
                autoComplete="tel"
              />
            </div>

            <div className="input-group">
              <label htmlFor="reg-password">Password</label>
              <input
                type="password"
                id="reg-password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="At least 6 characters"
                autoComplete="new-password"
                minLength={6}
                required
              />
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? (
                <>
                  <span className="btn-spinner">⟳</span>
                  <span>Creating account…</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <span className="btn-arrow">→</span>
                </>
              )}
            </button>
          </form>

          <div className="auth-divider"><span>or</span></div>

          <p className="auth-link">
            Already have an account?
            <Link to="/login" className="link-highlight">Sign in</Link>
          </p>

        </div>
      </div>

    </div>
  );
};

export default Register;
