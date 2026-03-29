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
  const { todayEntries: statsTodayEntries, ...restStats } = stats;

  return {
    // Estado atual
    currentIntake,
    dailyGoal,
    isLoading,

    // Configuracoes
    config,

    // Entradas do dia
    todayEntries,

    // Estatisticas
    ...restStats,

    // Acoes
    addWater,
    resetDay,
    updateGoal,
    updateConfig,
    calculateGoalFromConfig,
    removeEntry,

    // Metodos compativeis com o hook antigo
    loadWaterData: async () => {
      // Mantido para compatibilidade
    },
  };
};
