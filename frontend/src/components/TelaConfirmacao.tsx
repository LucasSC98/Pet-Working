import React from 'react';
import '../styles/TelaConfirmacao.css';
import { X } from 'lucide-react';

interface TelaConfirmacaoProps {
    aberto: boolean;
    titulo: string;
    mensagem: string;
    onConfirmar: () => void;
    onCancelar: () => void;
}

const TelaConfirmacao: React.FC<TelaConfirmacaoProps> = ({
    aberto,
    titulo,
    mensagem,
    onConfirmar,
    onCancelar
}) => {
    if (!aberto) return null;

    return (
        <div className="confirm-overlay">
            <div className="confirm-dialog">
                <button className="close-button" onClick={onCancelar}>
                    <X size={24} />
                </button>
                <h2>{titulo}</h2>
                <p>{mensagem}</p>
                <div className="confirm-buttons">
                    <button 
                        className="btn-cancel" 
                        onClick={onCancelar}
                    >
                        Cancelar
                    </button>
                    <button 
                        className="btn-confirm" 
                        onClick={onConfirmar}
                    >
                        Confirmar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TelaConfirmacao;