
'use client'

import { useState, useEffect, useCallback } from 'react';
import { validateApiKey } from '@/ai/flows/validate-api-key';
import { getAiConfig } from '@/lib/server-data';

type AiApiStatus = 'unknown' | 'valid' | 'invalid' | 'checking';

const AI_STATUS_SESSION_KEY = 'ai_api_status';

export function useAiState() {
  const [status, setStatus] = useState<AiApiStatus>('unknown');
  const [isChecking, setIsChecking] = useState(false);

  const checkStatus = useCallback(async () => {
    setIsChecking(true);
    setStatus('checking');
    try {
      // First, try to get a status from session storage to avoid re-validating constantly.
      const sessionStatus = sessionStorage.getItem(AI_STATUS_SESSION_KEY);
      if (sessionStatus === 'valid') {
        setStatus('valid');
        return;
      }

      // If no valid session status, check the server for a key and validate it.
      const config = await getAiConfig();
      if (config && config.apiKey) {
        const result = await validateApiKey({ apiKey: config.apiKey });
        const newStatus = result.isValid ? 'valid' : 'invalid';
        setStatus(newStatus);
        sessionStorage.setItem(AI_STATUS_SESSION_KEY, newStatus);
      } else {
        setStatus('invalid');
        sessionStorage.setItem(AI_STATUS_SESSION_KEY, 'invalid');
      }
    } catch (error) {
      console.error("Error checking AI API status:", error);
      setStatus('invalid');
      sessionStorage.setItem(AI_STATUS_SESSION_KEY, 'invalid');
    } finally {
      setIsChecking(false);
    }
  }, []);
  
  useEffect(() => {
    // Check status on initial component mount.
    checkStatus();
  }, [checkStatus]);

  return { status, isChecking, refreshStatus: checkStatus };
}
