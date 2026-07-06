import { LogOut, Radio } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const home = user.role === 'PASSENGER' ? '/passenger' : '/driver';

  return (
    <header className="navbar">
      <Link to={home} className="navbar__brand">
        <Radio size={20} strokeWidth={2} />
        <span>despacho</span>
      </Link>

      <nav className="navbar__links">
        <button className="navbar__link" onClick={() => navigate(home)}>
          Panel
        </button>
        <button className="navbar__link" onClick={() => navigate('/history')}>
          Historial
        </button>
      </nav>

      <div className="navbar__user">
        <div className="navbar__user-info">
          <span className="navbar__user-name">{user.firstName} {user.lastName}</span>
          <span className="navbar__user-role">{user.role === 'PASSENGER' ? 'Pasajero' : 'Conductor'}</span>
        </div>
        <button className="navbar__logout" onClick={logout} aria-label="Cerrar sesión">
          <LogOut size={18} strokeWidth={1.75} />
        </button>
      </div>
    </header>
  );
}