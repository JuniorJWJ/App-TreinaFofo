import { useEffect, useState, useCallback } from 'react';
import { initializeAppData, checkIsFirstLaunch, markAppAsLaunched } from '../utils/initializeData';

export const useAppInitialization = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isFirstLaunch, setIsFirstLaunch] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const initialize = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Verificar se é a primeira vez
      const firstLaunch = await checkIsFirstLaunch();
      setIsFirstLaunch(firstLaunch);

      if (firstLaunch) {
        // Carregar dados mockados
        await initializeAppData();
        await markAppAsLaunched();
      }

      setIsInitialized(true);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao inicializar'));
      console.error('[useAppInitialization] Erro:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resetInitialization = useCallback(async () => {
    try {
      setIsLoading(true);
      await AsyncStorage.removeItem('@gymtrack-first-launch');
      setIsFirstLaunch(true);
      setIsInitialized(false);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao resetar'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return {
    isInitialized,
    isFirstLaunch,
    isLoading,
    error,
    initialize,
    resetInitialization,
  };
};

// Hook simplificado para uso em componentes
export const useInitializeOnMount = (onComplete?: () => void) => {
  const { isInitialized, isLoading, error } = useAppInitialization();

  useEffect(() => {
    if (isInitialized && !isLoading && onComplete) {
      onComplete();
    }
  }, [isInitialized, isLoading, onComplete]);

  return { isLoading, error };
};

export default useAppInitialization;
