import type React from "react";
import {
  Stethoscope,
  Bath,
  Home,
  Heart,
  Star,
  Users,
  PawPrint,
  ShoppingBag,
} from "lucide-react";
import "../styles/Home.css";
import useBodyClass from "../hooks/useBodyClass";
import petworking1 from "../assets/petrking.png";

const HomePage: React.FC = () => {
  useBodyClass("home-page");

  return (
    <div className="home-welcome-page">
      {/* Header */}
      <header className="home-header">
        <div className="home-header-container">
          <div className="home-header-content">
            <div className="home-logo-section">
              <div className="home-logo-icon">
                <PawPrint className="home-icon-white" size={24} />
              </div>
              <img
                src={petworking1}
                alt="PetWorking"
                className="home-logo-image"
              />
            </div>
            <nav className="home-nav">
              <ul className="home-nav-menu">
                <li>
                  <a href="/login" className="home-nav-btn-login">
                    Login
                  </a>
                </li>
                <li>
                  <a href="/cadastro" className="home-nav-btn-cadastro">
                    Cadastro
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="home-hero-section">
        <div className="home-container">
          <div className="home-hero-grid">
            {/* Left Content */}
            <div className="home-hero-content">
              <div className="home-hero-text">
                <div className="home-hero-badge">
                  <Star className="home-icon-orange" size={16} />
                  <span>Cuidado profissional para pets</span>
                </div>

                <h1 className="home-content-title">
                  Bem-vindo ao{" "}
                  <span className="home-title-gradient">PetWorking</span>
                </h1>

                <p className="home-content-text">
                  Oferecemos os melhores serviços de cuidados para pets com
                  profissionais dedicados e apaixonados por animais.
                </p>
              </div>

              <div className="home-hero-buttons">
                <a href="/agendamentos" className="home-btn-consulta">
                  Agende uma consulta
                </a>
              </div>

              {/* Stats */}
              <div className="home-hero-stats"></div>
            </div>

            {/* Right Content - Logo/Image */}
            <div className="home-hero-visual">
              <div className="home-hero-visual-card">
                <img
                  src="https://i.imgur.com/aWT6jIO.png"
                  alt="PetWorking Logo"
                  className="home-hero-visual-image"
                />
              </div>
              {/* Decorative elements */}
              <div className="home-decorative-circle-1"></div>
              <div className="home-decorative-circle-2"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <div className="home-services-wrapper">
        <div className="home-services-header">
          <h2 className="home-services-title">Nossos Serviços</h2>
          <p className="home-services-subtitle">
            Cuidamos do seu pet com amor, dedicação e profissionalismo
          </p>
        </div>

        <div className="home-services-grid">
          {/* Service 1 */}
          <div className="home-service-card home-service-card-1">
            <div className="home-service-card-content">
              <div className="home-service-icon home-service-icon-1">
                <Stethoscope className="home-icon-white" size={32} />
              </div>
              <h3 className="home-service-title">Consultas Veterinárias</h3>
              <p className="home-service-description">
                Atendimento completo com profissionais qualificados para
                garantir a saúde do seu pet.
              </p>
            </div>
          </div>

          {/* Service 2 */}
          <div className="home-service-card home-service-card-2">
            <div className="home-service-card-content">
              <div className="home-service-icon home-service-icon-2">
                <Bath className="home-icon-white" size={32} />
              </div>
              <h3 className="home-service-title">Banho e Tosa</h3>
              <p className="home-service-description">
                Serviços de higiene e beleza que deixam seu pet limpo, cheiroso
                e feliz.
              </p>
            </div>
          </div>

          {/* Service 3 */}
          <div className="home-service-card home-service-card-3">
            <div className="home-service-card-content">
              <div className="home-service-icon home-service-icon-3">
                <Home className="home-icon-white" size={32} />
              </div>
              <h3 className="home-service-title">Hospedagem</h3>
              <p className="home-service-description">
                Um lar temporário cheio de conforto e carinho quando você
                precisar viajar.
              </p>
            </div>
          </div>

          {/* Service 4 - Nova Loja */}
          <div className="home-service-card home-service-card-4">
            <div className="home-service-card-content">
              <div className="home-service-icon home-service-icon-4">
                <ShoppingBag className="home-icon-white" size={32} />
              </div>
              <h3 className="home-service-title">Loja Pet</h3>
              <p className="home-service-description">
                Tudo que seu pet precisa em um só lugar: ração, brinquedos,
                acessórios e muito mais.
              </p>
            </div>
          </div>
        </div>
        <footer className="home-footer">
          <div className="home-footer-content">
            <p className="home-footer-text">&copy; 2025 PetWorking.</p>
            <div className="home-footer-icons">
              <a href="/sobre" className="home-footer-icon">
                <Users className="home-icon-white" size={24} />
              </a>
              <a href="/contato" className="home-footer-icon">
                <Heart className="home-icon-white" size={24} />
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default HomePage;
