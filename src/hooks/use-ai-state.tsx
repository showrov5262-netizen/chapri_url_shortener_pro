'use client'

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type ApiStatus = 'unknown' | 'valid' | 'invalid' | 'checking';

interface AiStateContextProps {
  apiKey: string;
  setApiKey: (key: string) => void;
  status: ApiStatus;
  setStatus: (status: ApiStatus) => void;
  isChecking: boolean;
  setIsChecking: (isChecking: boolean) => void;
  errorMessage: string | null;
  setErrorMessage: (message: string | null) => void;
}

const AiStateContext = createContext<AiStateContextProps | undefined>(undefined);

// Use sessionStorage to persist the key for the current browser session.
const getInitialState = () => {
  if (typeof window === 'undefined') {
    return { apiKey: '', status: 'unknown' as ApiStatus, errorMessage: null };
  }
  const apiKey = window.sessionStorage.getItem('geminiApiKey') || '';
  const status = (window.sessionStorage.getItem('geminiApiStatus') as ApiStatus) || 'unknown';
  const errorMessage = window.sessionStorage.getItem('geminiApiError') || null;
  return { apiKey, status, errorMessage };
};


export const AiStateProvider = ({ children }: { children: ReactNode }) => {
  const [apiKey, _setApiKey] = useState<string>(getInitialState().apiKey);
  const [status, _setStatus] = useState<ApiStatus>(getInitialState().status);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [errorMessage, _setErrorMessage] = useState<string | null>(getInitialState().errorMessage);

  const setApiKey = (key: string) => {
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem('geminiApiKey', key);
    }
    _setApiKey(key);
  };

  const setStatus = (newStatus: ApiStatus) => {
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem('geminiApiStatus', newStatus);
    }
    _setStatus(newStatus);
  }

  const setErrorMessage = (message: string | null) => {
     if (typeof window !== 'undefined') {
      if (message) {
        window.sessionStorage.setItem('geminiApiError', message);
      } else {
        window.sessionStorage.removeItem('geminiApiError');
      }
    }
    _setErrorMessage(message);
  }
  
  // When the provider loads, automatically set the status to checking if there is a key.
  useEffect(() => {
    const initialState = getInitialState();
    if (initialState.apiKey) {
      _setApiKey(initialState.apiKey);
      _setStatus(initialState.status);
      _setErrorMessage(initialState.errorMessage);
    }
  }, []);


  return (
    <AiStateContext.Provider value={{ apiKey, setApiKey, status, setStatus, isChecking, setIsChecking, errorMessage, setErrorMessage }}>
      {children}
    </AiStateContext.Provider>
  );
};

export const useAiState = (): AiStateContextProps => {
  const context = useContext(AiStateContext);
  if (context === undefined) {
    throw new Error('useAiState must be used within an AiStateProvider');
  }
  return context;
};
