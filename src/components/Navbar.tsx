import { Link, useNavigate, useLocation } from 'react-router-dom';
import { auth } from '../config/firebase';
import type { User } from 'firebase/auth';
import './Navbar.css';

interface NavbarProps {
  user: User;
}

const Navbar = ({ user }: NavbarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/login');
  };

  const displayName = user.displayName || user.email?.split('@')[0] || 'Usuario';

  // Determinar qué enlace está activo
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo / Título */}
        <Link to="/" className="navbar-logo">
          🏠 Mi App
        </Link>

        {/* Enlaces de navegación - CENTRO */}
        <div className="navbar-links">
          <Link 
            to="/" 
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
          >
            Inicio
          </Link>
          <Link 
            to="/sessions" 
            className={`nav-link ${isActive('/sessions') ? 'active' : ''}`}
          >
            Auditoría
          </Link>
          <Link 
            to="/crud" 
            className={`nav-link ${isActive('/crud') ? 'active' : ''}`}
          >
            CRUD
          </Link>
        </div>

        {/* Perfil de usuario - DERECHA */}
        <div className="navbar-profile">
          {/* Avatar */}
          {user.photoURL ? (
            <img 
              src={user.photoURL} 
              alt="Profile" 
              className="navbar-avatar"
            />
          ) : (
            <div className="navbar-avatar-placeholder">
              {displayName.charAt(0).toUpperCase()}
            </div>
          )}
          
          {/* Información del usuario */}
          <div className="navbar-user-info">
            <span className="navbar-user-name">{displayName}</span>
            <span className="navbar-user-email">{user.email}</span>
          </div>
          
          {/* Botón cerrar sesión */}
          <button onClick={handleLogout} className="navbar-logout" title="Cerrar sesión">
            🔓
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;