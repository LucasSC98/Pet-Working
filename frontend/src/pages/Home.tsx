/* import React from "react"; */
import "../styles/Home.css";
import useBodyClass from "../hooks/useBodyClass";
import { Link } from "react-router-dom";
import petworking1 from "../assets/petworking1.png";

const Home = () => {
  useBodyClass("home-page");

  return (
    <>
      <header className="header-home">
        <div className="conteiner-logo"></div>
        <div className="logo">
          <img src={petworking1} alt="Logo" />
        </div>
        <nav>
          <ul className="menu-navegacao">
            <li>
              <Link to="/login" className="botoes-navegacao-login">
                Login
              </Link>
            </li>
            <li>
              <Link to="/cadastro" className="botoes-navegacao-cadastro">
                Cadastro
              </Link>
            </li>
          </ul>
        </nav>
      </header>
      <div className="welcome-page">
        <div className="logo-container">
          <img src={petworking1} alt="Pet Working" className="logo-image" />
        </div>

        <div className="welcome-container">
          <div className="welcome-content">
            <h1>Bem-vindo ao PetWorking</h1>
            <section className="hero-section">
              <div className="container">
                <div className="hero-content">
                  <h1 className="content-title">
                    Cuidados profissionais para seu melhor amigo
                  </h1>
                  <p className="content-text">
                    Oferecemos os melhores serviços de cuidados para pets com
                    profissionais dedicados e apaixonados por animais.
                  </p>
                  <div className="hero-buttons">
                    <a href="#" className="btn-consulta">
                      Agendar Consulta
                    </a>
                  </div>
                </div>
                <div className="hero-image">
                  {/* Aqui você pode adicionar uma imagem principal para o hero */}
                </div>
              </div>
            </section>
          </div>
        </div>

        <div className="services-container">
          <h2 className="services-title">Nossos Serviços</h2>
          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon">🩺</div>
              <h3>Consultas Veterinárias</h3>
              <p>
                Atendimento completo com profissionais qualificados para
                garantir a saúde do seu pet.
              </p>
            </div>
            <div className="service-card">
              <div className="service-icon">🛁</div>
              <h3>Banho e Tosa</h3>
              <p>
                Serviços de higiene e beleza que deixam seu pet limpo, cheiroso
                e feliz.
              </p>
            </div>
            <div className="service-card">
              <div className="service-icon">🏠</div>
              <h3>Hospedagem</h3>
              <p>
                Um lar temporário cheio de conforto e carinho quando você
                precisar viajar.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
