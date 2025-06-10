import React, { useEffect } from 'react';
import '../styles/Toast.css';

interface ToastProps {
    message: string;
    type?: 'successo' | 'erro' | 'mensagem' | 'aviso';
    duration?: number;
    onClose: () => void;
    show: boolean;
}

const Toast: React.FC<ToastProps> = ({
    message,
    type = 'info',
    duration = 3000,
    onClose,
    show
}) => {
    useEffect(() => {
        if (show) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [show, duration, onClose]);

    if (!show) return null;

    return (
        <div className={`toast toast-${type}`}>
            <div className="toast-content">
                {message}
            </div>
        </div>
    );
};

export default Toast;