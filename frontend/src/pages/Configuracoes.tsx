import { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import "../styles/Configuracoes.css";

const Configuracoes = () => {
  const [configs, setConfigs] = useState({
    fontSize: 'normal',
  });

  // Carrega configurações salvas
  useEffect(() => {
    const savedConfigs = localStorage.getItem('petworking-configs');
    if (savedConfigs) {
      setConfigs(JSON.parse(savedConfigs));
    }
  }, []);

  // Aplica configurações
  useEffect(() => {
    // Aplica tamanho da fonte
    document.body.style.fontSize = 
      configs.fontSize === 'large' ? '1.2rem' : 
      configs.fontSize === 'tiny' ? '0.8rem' : '1rem';
    
    localStorage.setItem('petworking-configs', JSON.stringify(configs));
  }, [configs]);

  const handleChange = (setting: string, value: string | boolean) => {
    setConfigs(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  return (
    <DashboardLayout>
      <div className="configuracoes-container">
        <h2>Configurações de Exibição</h2>

        <div className="config-section">
          <h3>Aparência</h3>
          
          <div className="config-option">
            <label>Tamanho da Fonte</label>
            <select 
              value={configs.fontSize}
              onChange={(e) => handleChange('fontSize', e.target.value)}
            >
              <option value="tiny">Muito Pequeno</option>
              <option value="normal">Normal</option>
              <option value="large">Grande</option>
            </select>
          </div>
          
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Configuracoes;