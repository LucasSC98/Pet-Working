import { ReactNode, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import petworkinglogo from "../assets/petrking.png";
import "../styles/Dashboard.css";
import {
  Home,
  Calendar,
  Package,
  ShoppingBag,
  LogOut,
  Users,
  Heart,
  Stethoscope,
  Settings,
  Menu,
} from "lucide-react";

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
      {" "}
      <aside className={`sidebar ${menuMobile ? "sidebar-mobile-active" : ""}`}>
        <div className="sidebar-header">
          <div className="logo-container">
            <img src={petworkinglogo} alt="PetWorking" className="logo-image" />
          </div>
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
              <div className="avatar-fallback">
                {user?.nome?.charAt(0) || "U"}
              </div>
            )}
          </div>
          <div className="user-info">
            <Link to="/minha-conta" className="user-name">
              {user?.nome}
            </Link>
          </div>
        </div>

        <nav className="sidebar-nav">
          <ul>
            <li>
              <Link
                to="/dashboard"
                className={isActive("/dashboard") ? "active" : ""}
              >
                <div className="nav-icon">
                  <Home size={20} />
                </div>
                <span className="nav-text">Dashboard</span>
              </Link>
            </li>
            <li>
              <Link to="/pets" className={isActive("/pets") ? "active" : ""}>
                <div className="nav-icon">
                  <Heart size={20} />
                </div>
                <span className="nav-text">Meus Pets</span>
              </Link>
            </li>
            <li>
              <Link
                to="/agendamentos"
                className={isActive("/agendamentos") ? "active" : ""}
              >
                <div className="nav-icon">
                  <Calendar size={20} />
                </div>
                <span className="nav-text">Agendamentos</span>
              </Link>
            </li>
            <li>
              <Link
                to="/servicos"
                className={isActive("/servicos") ? "active" : ""}
              >
                <div className="nav-icon">
                  <Stethoscope size={20} />
                </div>
                <span className="nav-text">Serviços</span>
              </Link>
            </li>
            <li>
              <Link to="/loja" className={isActive("/loja") ? "active" : ""}>
                <div className="nav-icon">
                  <ShoppingBag size={20} />
                </div>
                <span className="nav-text">Loja Pet</span>
              </Link>
            </li>
            <li>
              <Link
                to="/loja/meus-pedidos"
                className={isActive("/loja/meus-pedidos") ? "active" : ""}
              >
                <div className="nav-icon">
                  <Package size={20} />
                </div>
                <span className="nav-text">Pedidos</span>
              </Link>
            </li>
            <li>
              <Link
                to="/configuracoes"
                className={isActive("/configuracoes") ? "active" : ""}
              >
                <div className="nav-icon">
                  <Settings size={20} />
                </div>
                <span className="nav-text">Configurações</span>
              </Link>
            </li>
          </ul>
        </nav>

        {user && "tipo" in user && user.tipo === "admin" && (
          <>
            <div className="nav-divider">
              <span className="divider-text">Administração</span>
            </div>
            <NavLink to="/admin/agendamentos" className="nav-link">
              <Calendar size={20} />
              <span>Todos Agendamentos</span>
            </NavLink>
            <NavLink to="/admin/pedidos" className="nav-link">
              <Package size={20} />
              <span>Todos Pedidos</span>
            </NavLink>
            <NavLink to="/admin/usuarios" className="nav-link">
              <Users size={20} />
              <span>Usuários</span>
            </NavLink>
          </>
        )}

        <div className="sidebar-footer">
          <button
            className="logout-btn"
            onClick={handleLogout}
            title="Sair da conta"
          >
            <LogOut size={18} />
            <span>Sair da conta</span>
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
            <Menu size={24} />
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
