import { useState, useEffect } from 'react';
import Modal from '../components/Modal';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import Toast from '../components/Toast';
import '../styles/EnderecoUsuario.css';
import { Pencil, Trash } from 'lucide-react';

interface Endereco {
    id_endereco?: number;
    cep: string;
    rua: string;
    numero: string;
    bairro: string;
    cidade: string;
    estado: string;
}

interface EnderecoUsuarioProps {
    isOpen: boolean;
    onClose: () => void;
}

export const EnderecoUsuario = ({ isOpen, onClose }: EnderecoUsuarioProps) => {
    const { user } = useAuth();
    const [enderecos, setEnderecos] = useState<Endereco[]>([]);
    const [editandoEndereco, setEditandoEndereco] = useState<Endereco | null>(null);
    const [formData, setFormData] = useState<Endereco>({
        cep: '',
        rua: '',
        numero: '',
        bairro: '',
        cidade: '',
        estado: ''
    });

    const buscarEnderecos = async () => {
        try {
            const response = await api.get(`/enderecos/usuario/${user?.id}`);
            setEnderecos(response.data);
        } catch (error) {
            setToastMessage('Erro ao buscar endereços');
            setToastType('erro');
            setShowToast(true);
            console.error('Erro ao buscar endereços:', error);
        }
    };

    useEffect(() => {
        if (isOpen && user?.id) {
            buscarEnderecos();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, user?.id]);

    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<'successo' | 'erro'>('successo');

    const buscarCep = async (cep: string) => {
        const cepLimpo = cep.replace(/\D/g, '');
        
        if (cepLimpo.length === 8) {
            try {
                const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
                const data = await response.json();
                
                if (!data.erro) {
                    setFormData(prev => ({
                        ...prev,
                        cep: cepLimpo.replace(/(\d{5})(\d{3})/, '$1-$2'),
                        rua: data.logradouro,
                        bairro: data.bairro,
                        cidade: data.localidade,
                        estado: data.uf
                    }));
                } else {
                    setToastMessage('CEP não encontrado');
                    setToastType('erro');
                    setShowToast(true);
                }
            } catch (error) {
                setToastMessage('Erro ao buscar CEP');
                setToastType('erro');
                setShowToast(true);
                console.error('Erro ao buscar CEP:', error);
            }
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (name === 'cep') {
            buscarCep(value);
        }
    };

    const handleEdit = (endereco: Endereco) => {

        if (editandoEndereco?.id_endereco === endereco.id_endereco) {
            setEditandoEndereco(null);
            setFormData({
                cep: '',
                rua: '',
                numero: '',
                bairro: '',
                cidade: '',
                estado: ''
            });
        } else {
            setEditandoEndereco(endereco);
            setFormData(endereco);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await api.delete(`/enderecos/${id}`);
            setToastMessage('Endereço removido com sucesso!');
            setToastType('successo');
            setShowToast(true);
            setEditandoEndereco(null);
            setFormData({
                cep: '',
                rua: '',
                numero: '',
                bairro: '',
                cidade: '',
                estado: ''
            });
            buscarEnderecos();
        } catch (error) {
            setToastMessage('Erro ao remover endereço');
            setToastType('erro');
            setShowToast(true);
            console.error('Erro ao deletar endereço:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editandoEndereco?.id_endereco) {
                await api.patch(`/enderecos/${editandoEndereco.id_endereco}`, {
                    ...formData,
                    id_usuario: user?.id,
                    numero: parseInt(formData.numero)
                });
                setToastMessage('Endereço atualizado com sucesso!');
            } else {
                await api.post('/enderecos', {
                    ...formData,
                    id_usuario: user?.id,
                    numero: parseInt(formData.numero)
                });
                setToastMessage('Endereço cadastrado com sucesso!');
            }
            
            setToastType('successo');
            setShowToast(true);
            setEditandoEndereco(null);
            setFormData({
                cep: '',
                rua: '',
                numero: '',
                bairro: '',
                cidade: '',
                estado: ''
            });
            buscarEnderecos();
        } catch (error) {
            setToastMessage(editandoEndereco ? 'Erro ao atualizar endereço' : 'Erro ao cadastrar endereço');
            setToastType('erro');
            setShowToast(true);
            console.error('Erro ao salvar endereço:', error);
        }
    };

    const handleClose = () => {
        onClose();
        setFormData({
            cep: '',
            rua: '',
            numero: '',
            bairro: '',
            cidade: '',
            estado: ''
        });
    };

    return (
        <div className="endereco-container">
            <Modal 
                isOpen={isOpen} 
                onClose={handleClose}
                title={editandoEndereco ? "Editar Endereço" : "Cadastrar Endereço"}
            >
                <div className="enderecos-lista">
                    {enderecos.map((endereco) => (
                        <div key={endereco.id_endereco} className="endereco-item">
                            <div className="endereco-info">
                                <p>{endereco.rua}, {endereco.numero}</p>
                                <p>{endereco.bairro} - {endereco.cidade}/{endereco.estado}</p>
                                <p>CEP: {endereco.cep}</p>
                            </div>
                            <div className="endereco-acoes">
                                <button 
                                    onClick={() => handleEdit(endereco)}
                                    className="btn-editar"
                                    title="Editar Endereço"
                                >
                                    <Pencil size={20} />
                                </button>
                                <button 
                                    onClick={() => handleDelete(endereco.id_endereco!)}
                                    className="btn-deletar"
                                    title="Excluir Endereço"
                                >
                                    <Trash size={20} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <form onSubmit={handleSubmit} className="endereco-form">
                    <div className="form-group">
                        <label htmlFor="cep">CEP</label>
                        <input
                            id="cep"
                            type="text"
                            name="cep"
                            value={formData.cep}
                            onChange={handleChange}
                            required
                            maxLength={9}
                            placeholder="Digite o CEP"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="rua">Rua</label>
                        <input
                            id="rua"
                            type="text"
                            name="rua"
                            value={formData.rua}
                            onChange={handleChange}
                            required
                            placeholder="Digite a rua"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="numero">Número</label>
                        <input
                            id="numero"
                            type="text"
                            name="numero"
                            value={formData.numero}
                            onChange={handleChange}
                            required
                            maxLength={5}
                            placeholder="Digite o número"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="bairro">Bairro</label>
                        <input
                            id="bairro"
                            type="text"
                            name="bairro"
                            value={formData.bairro}
                            onChange={handleChange}
                            required
                            placeholder="Digite o bairro"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="cidade">Cidade</label>
                        <input
                            id="cidade"
                            type="text"
                            name="cidade"
                            value={formData.cidade}
                            onChange={handleChange}
                            required
                            placeholder="Digite a cidade"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="estado">Estado</label>
                        <input
                            id="estado"
                            type="text"
                            name="estado"
                            value={formData.estado}
                            onChange={handleChange}
                            required
                            placeholder="Digite o estado"
                        />
                    </div>

                    <div className="form-actions">
                        <button type="button" onClick={handleClose} className="btn-cancelar">
                            Cancelar
                        </button>
                        <button type="submit" className="btn-salvar">
                            Salvar
                        </button>
                    </div>
                </form>
            </Modal>

            <Toast
                message={toastMessage}
                type={toastType}
                show={showToast}
                onClose={() => setShowToast(false)}
            />
        </div>
    );
};

export default EnderecoUsuario;