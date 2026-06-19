import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <nav className="navbar-modern">
      <div className="nav-container-modern">
        <Link to="/" className="nav-logo-modern">
          <span className="logo-icon">☕</span>
          <span className="logo-text">Café Bliss</span>
        </Link>
        
        <ul className="nav-menu-modern">
          <li>
            <Link 
              to="/" 
              className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
            >
              Home
            </Link>
          </li>
          <li>
            <Link 
              to="/menu" 
              className={`nav-link ${location.pathname === '/menu' ? 'active' : ''}`}
            >
              Menu
            </Link>
          </li>
          
          {user ? (
            <>
              {user.role === 'customer' && (
                <>
                  <li>
                    <Link 
                      to="/cart" 
                      className={`nav-link ${location.pathname === '/cart' ? 'active' : ''}`}
                    >
                      Cart
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/orders" 
                      className={`nav-link ${location.pathname === '/orders' ? 'active' : ''}`}
                    >
                      Orders
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/reservations" 
                      className={`nav-link ${location.pathname === '/reservations' ? 'active' : ''}`}
                    >
                      Reservations
                    </Link>
                  </li>
                </>
              )}
              
              {user.role === 'staff' && (
                <li>
                  <Link 
                    to="/staff/dashboard" 
                    className={`nav-link ${location.pathname === '/staff/dashboard' ? 'active' : ''}`}
                  >
                    Dashboard
                  </Link>
                </li>
              )}
              
              {user.role === 'admin' && (
                <li>
                  <Link 
                    to="/admin/dashboard" 
                    className={`nav-link ${location.pathname === '/admin/dashboard' ? 'active' : ''}`}
                  >
                    Admin
                  </Link>
                </li>
              )}
              
              <li className="nav-user-modern">
                <span className="user-greeting">Hi, {user.name}</span>
              </li>
              <li>
                <button onClick={logout} className="btn-logout-modern">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link 
                  to="/login" 
                  className={`nav-link ${location.pathname === '/login' ? 'active' : ''}`}
                >
                  Login
                </Link>
              </li>
              <li>
                <Link 
                  to="/register" 
                  className="btn-register-modern"
                >
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
