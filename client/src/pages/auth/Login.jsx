import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './Auth.css';

const Login = () => {
  const [formData, setFormData]    = useState({ email: '', password: '' });
  const [error, setError]          = useState('');
  const [loading, setLoading]      = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await login(formData);
      const role = data?.user?.role || data?.role;
      if (role === 'admin')       navigate('/admin/dashboard');
      else if (role === 'staff')  navigate('/staff/dashboard');
      else                        navigate('/menu');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      {/* ── Left: café photo panel ── */}
      <div className="auth-image-panel">
        <img
          src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&q=85"
          alt="Café Bliss interior"
        />
        <div className="auth-image-quote">
          <blockquote>
            "Good coffee warms the soul and sharpens the mind."
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
            <h2 className="auth-title">Welcome back</h2>
            <p className="auth-subtitle">Sign in to your account</p>
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
              <label htmlFor="login-email">Email address</label>
              <input
                type="email"
                id="login-email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="login-password">Password</label>
              <input
                type="password"
                id="login-password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? (
                <>
                  <span className="btn-spinner">⟳</span>
                  <span>Signing in…</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <span className="btn-arrow">→</span>
                </>
              )}
            </button>
          </form>

          <div className="auth-divider"><span>or</span></div>

          <p className="auth-link">
            Don&apos;t have an account?
            <Link to="/register" className="link-highlight">Create one</Link>
          </p>

        </div>
      </div>

    </div>
  );
};

export default Login;
