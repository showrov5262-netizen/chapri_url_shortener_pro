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

// A simple in-memory cache that lasts for the session.
// In a real app, you might use localStorage for persistence.
let cachedApiKey = '';
let cachedApiStatus: ApiStatus = 'unknown';
let cachedErrorMessage: string | null = null;

export const AiStateProvider = ({ children }: { children: ReactNode }) => {
  const [apiKey, _setApiKey] = useState<string>(cachedApiKey);
  const [status, _setStatus] = useState<ApiStatus>(cachedApiStatus);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [errorMessage, _setErrorMessage] = useState<string | null>(cachedErrorMessage);

  const setApiKey = (key: string) => {
    cachedApiKey = key;
    _setApiKey(key);
  };

  const setStatus = (newStatus: ApiStatus) => {
    cachedApiStatus = newStatus;
    _setStatus(newStatus);
  }

  const setErrorMessage = (message: string | null) => {
    cachedErrorMessage = message;
    _setErrorMessage(message);
  }
  
  // When the provider loads, automatically set the status to checking if there is a key.
  useEffect(() => {
    if (apiKey) {
      _setStatus('unknown');
    }
  }, [apiKey]);


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
