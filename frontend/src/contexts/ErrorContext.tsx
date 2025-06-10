import React, { createContext, useContext, useState } from 'react';

interface ErrorContextData {
  error: string | null;
  setError: (message: string | null) => void;
  showError: (message: string) => void;
  clearError: () => void;
}

const ErrorContext = createContext<ErrorContextData>({} as ErrorContextData);

export const ErrorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [error, setError] = useState<string | null>(null);

  const showError = (message: string) => {
    setError(message);
    setTimeout(() => {
      setError(null);
    }, 5000); // Remove o erro após 5 segundos
  };

  const clearError = () => setError(null);

  return (
    <ErrorContext.Provider value={{ error, setError, showError, clearError }}>
      {children}
    </ErrorContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useError = () => useContext(ErrorContext);