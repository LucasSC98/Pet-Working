import { ReactNode, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import petworkinglogo from "../assets/PetWorking.png";
import "../styles/Dashboard.css";
import { LogOut, Logs } from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [menuMobile, setMenuMobile] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    if (logout) logout();
  };

  const toggleMobileMenu = () => {
    setMenuMobile(!menuMobile);
  };

  return (
    <div className="dashboard-layout">
      <aside className={`sidebar ${menuMobile ? "sidebar-mobile-active" : ""}`}>
        <div className="sidebar-header">
          <img src={petworkinglogo} alt="PetWorking" className="logo-image" />
          <button
            className="close-menu-btn"
            onClick={toggleMobileMenu}
            aria-label="Fechar menu"
          >
            &times;
          </button>
        </div>

        <div className="user-profile">
          <div className="user-avatar">
            {user?.fotoDePerfil ? (
              <img
                src={user.fotoDePerfil}
                alt={`Foto de perfil de ${user.nome}`}
                className="profile-photo"
              />
            ) : (
              user?.nome?.charAt(0) || "U"
            )}
          </div>
          <Link to="/minha-conta" className="user-name">
            {user?.nome || "Usuário"}
          </Link>
        </div>

        <nav className="sidebar-nav">
          <ul>
            <li>
              <Link
                to="/dashboard"
                className={isActive("/dashboard") ? "active" : ""}
              >
                <span className="nav-icon">🏠</span>
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/pets" className={isActive("/pets") ? "active" : ""}>
                <span className="nav-icon">🐾</span>
                Meus Pets
              </Link>
            </li>
            <li>
              <Link
                to="/agendamentos"
                className={isActive("/agendamentos") ? "active" : ""}
              >
                <span className="nav-icon">📅</span>
                Agendamentos
              </Link>
            </li>
            <li>
              <Link
                to="/servicos"
                className={isActive("/servicos") ? "active" : ""}
              >
                <span className="nav-icon">💉</span>
                Serviços
              </Link>
            </li>
            <li>
              <Link
                to="/configuracoes"
                className={isActive("/configuracoes") ? "active" : ""}
              >
                <span className="nav-icon">⚙️</span>
                Configurações
              </Link>
            </li>
          </ul>
        </nav>

        <div className="sidebar-footer">
          <button
            className="logout-btn"
            onClick={handleLogout}
            title="Sair da conta"
          >
            Sair da conta
            <LogOut size={18} style={{ marginLeft: "1rem" }} />
          </button>
        </div>
      </aside>
      <main className="main-content">
        <header className="mobile-header">
          <button
            className="menu-toggle"
            onClick={toggleMobileMenu}
            aria-label="Abrir menu"
          >
            <Logs size={24} />
          </button>
          <img src={petworkinglogo} alt="PetWorking" className="logo-image" />
          <div className="mobile-user">
            <div className="user-avatar-small">
              {user?.nome?.charAt(0) || "U"}
            </div>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
