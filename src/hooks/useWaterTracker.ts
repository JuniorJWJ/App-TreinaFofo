import { useWaterStore, useWaterStats } from '../store/waterStore';

export const useWaterTracker = () => {
  const {
    currentIntake,
    dailyGoal,
    isLoading,
    config,
    addWater,
    resetDay,
    updateGoal,
    updateConfig,
    calculateGoalFromConfig,
    removeEntry,
    todayEntries,
  } = useWaterStore();
  
  const stats = useWaterStats();
  
  return {
    // Estado atual
    currentIntake,
    dailyGoal,
    isLoading,
    
    // Configurações
    config,
    
    // Entradas do dia
    todayEntries,
    
    // Estatísticas
    ...stats,
    
    // Ações
    addWater,
    resetDay,
    updateGoal,
    updateConfig,
    calculateGoalFromConfig,
    removeEntry,
    
    // Métodos compatíveis com o hook antigo
    loadWaterData: async () => {
      // Mantido para compatibilidade
    },
  };
};