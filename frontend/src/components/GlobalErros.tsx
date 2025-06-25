import { useError } from '../contexts/ErrorContext';
import '../styles/GlobalErros.css';

export const GlobalErros = () => {
  const { error, clearError } = useError();

  if (!error) return null;

  return (
    <div className="global-error-container">
      <div className="global-error">
        <span>{error}</span>
        <button onClick={clearError}>×</button>
      </div>
    </div>
  );
};
