import React, { useEffect } from 'react';
import { useMuscleGroupStore } from '../store';

interface StoreProviderProps {
  children: React.ReactNode;
}

export const StoreProvider: React.FC<StoreProviderProps> = ({ children }) => {
  const { initializeDefaultGroups, muscleGroups } = useMuscleGroupStore();

  useEffect(() => {
    console.log('StoreProvider: Inicializando dados...', muscleGroups.length);
    
    // Força a inicialização se não há grupos musculares
    if (muscleGroups.length === 0) {
      console.log('StoreProvider: Inicializando grupos musculares padrão');
      initializeDefaultGroups();
    }
  }, [initializeDefaultGroups, muscleGroups.length]);

  return <>{children}</>;
};