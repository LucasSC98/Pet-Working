import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import Toast from '../components/Toast';
import Modal from '../components/Modal';

interface Endereco {
  id_endereco: number;
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
  complemento?: string;
}

interface Pet {
  id_pet: number;
  nome: string;
  especie: string;
}

interface Servico {
  id_servico: number;
  nome: string;
  preco: number;
}

interface NovoAgendamentoProps {
  isOpen: boolean;
  onClose: () => void;
}

const NovoAgendamento = ({ isOpen, onClose }: NovoAgendamentoProps) => {
  const { user } = useAuth();
  const [enderecos, setEnderecos] = useState<Endereco[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'successo' | 'erro'>('successo');

  const [formData, setFormData] = useState({
    petId: '',
    enderecoId: '',
    servicoId: '',
    data: '',
    horario: ''
  });

  const carregarDados = async () => {
    try {
      const token = localStorage.getItem('token');

      if (!token || !user) {
        setToastMessage('Usuário não autenticado');
        setToastType('erro');
        setShowToast(true);
        return;
      }

      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      const [enderecosRes, petsRes, servicosRes] = await Promise.all([
        api.get(`/enderecos/usuario/${user.id}`, config),
        api.get(`/pets/usuario/${user.id}`, config),
        api.get(`/servicos`, config)
      ]);

      console.log('Dados carregados:', {
        enderecos: enderecosRes.data,
        pets: petsRes.data,
        servicos: servicosRes.data
      });

      setEnderecos(enderecosRes.data);
      setPets(petsRes.data);
      setServicos(servicosRes.data);
    } catch (error:  any) {
      console.error('Erro ao carregar dados:', error.response || error);
      setToastMessage(error.response?.data?.message || 'Erro ao carregar dados');
      setToastType('erro');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && user?.id) {
      carregarDados();
    }
  }, [isOpen, user?.id]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
        const token = localStorage.getItem('token');
        
        if (!token || !user) {
            setToastMessage('Usuário não autenticado');
            setToastType('erro');
            setShowToast(true);
            return;
        }

        // Validação dos campos obrigatórios
        if (!formData.petId || !formData.enderecoId || !formData.servicoId || !formData.data || !formData.horario) {
            setToastMessage('Todos os campos são obrigatórios');
            setToastType('erro');
            setShowToast(true);
            return;
        }

        const agendamentoData = {
            id_pet: parseInt(formData.petId),
            id_endereco: parseInt(formData.enderecoId),
            id_servico: parseInt(formData.servicoId),
            data: formData.data,
            horario: formData.horario,
            id_usuario: user.id,
            status: 'Agendado'
        };

        console.log('Dados do agendamento:', agendamentoData); // Debug

        const response = await api.post('/agendamentos', agendamentoData, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.status === 201 || response.status === 200) {
            setToastMessage('Agendamento realizado com sucesso!');
            setToastType('successo');
            setShowToast(true);
            
            setFormData({
                petId: '',
                enderecoId: '',
                servicoId: '',
                data: '',
                horario: ''
            });

            setTimeout(() => {
                onClose();
            }, 2000);
        }
    } catch (error: any) {
        console.error('Erro ao criar agendamento:', error.response?.data || error);
        setToastMessage(error.response?.data?.message || 'Erro ao criar agendamento');
        setToastType('erro');
        setShowToast(true);
    }
};

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="novo-agendamento-container">
        <Toast 
          message={toastMessage}
          type={toastType}
          show={showToast}
          onClose={() => setShowToast(false)}
        />

        <h2>Novo Agendamento</h2>

        {loading ? (
          <div className="loading">Carregando...</div>
        ) : (
          <form onSubmit={handleSubmit} className="agendamento-form">
            <div className="form-group">
              <label>Pet:</label>
              <select 
                name="petId"
                value={formData.petId}
                onChange={handleChange}
                required
              >
                <option value="">Selecione um pet</option>
                {pets.map(pet => (
                  <option key={pet.id_pet} value={pet.id_pet}>
                    {pet.nome} ({pet.especie})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Endereço:</label>
              <select 
                name="enderecoId"
                value={formData.enderecoId}
                onChange={handleChange}
                required
              >
                <option value="">Selecione um endereço</option>
                {enderecos.map(endereco => (
                  <option key={endereco.id_endereco} value={endereco.id_endereco}>
                    {endereco.rua}, {endereco.numero} - {endereco.bairro}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Serviço:</label>
              <select 
                name="servicoId"
                value={formData.servicoId}
                onChange={handleChange}
                required
              >
                <option value="">Selecione um serviço</option>
                {servicos.map(servico => (
                  <option key={servico.id_servico} value={servico.id_servico}>
                    {servico.nome} - R$ {servico.preco}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Data:</label>
                <input
                  type="date"
                  name="data"
                  value={formData.data}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Horário:</label>
                <input
                  type="time"
                  name="horario"
                  value={formData.horario}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-confirmar">
                Confirmar
              </button>
              <button 
                type="button" 
                className="btn-cancelar"
                onClick={onClose}
              >
                Cancelar
              </button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
};

export default NovoAgendamento;