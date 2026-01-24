// store/waterStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { calculateWaterGoal, WaterConfig as CalculatorConfig } from '../utils/waterCalculator';

// Tipos
export interface WaterEntry {
  id: string;
  amount: number; // ml
  timestamp: Date;
  note?: string;
}

export interface WaterDailyStats {
  date: string; // YYYY-MM-DD
  intake: number;
  goal: number;
  completed: boolean;
}

export interface WaterConfig {
  weight: number | null;
  activityLevel: 'sedentary' | 'moderate' | 'active' | 'athlete' | 'light' | 'intense';
  climate: 'temperate' | 'hot' | 'very_hot' | 'cold';
  customGoal: number | null;
  wakeUpTime: Date | null;
  sleepTime: Date | null;
  notificationsEnabled: boolean;
}

interface WaterStoreState {
  // Estado atual
  currentIntake: number;
  dailyGoal: number;
  lastResetDate: string; // YYYY-MM-DD
  isLoading: boolean;
  
  // Configurações do usuário
  config: WaterConfig;
  
  // Histórico
  todayEntries: WaterEntry[];
  weeklyStats: WaterDailyStats[];
  monthlyStats: WaterDailyStats[];
  
  // Meta calculada
  calculatedGoal: number | null;
}

interface WaterStoreActions {
  // Ações básicas
  addWater: (amount: number, note?: string) => Promise<void>;
  removeEntry: (entryId: string) => Promise<void>;
  updateGoal: (newGoal: number) => Promise<void>;
  resetDay: () => Promise<void>;
  
  // Configurações
  updateConfig: (config: Partial<WaterConfig>) => Promise<void>;
  calculateGoalFromConfig: () => Promise<void>;
  
  // Histórico
  loadHistoricalData: () => Promise<void>;
  clearHistory: () => Promise<void>;
  
  // Inicialização
  initializeStore: () => Promise<void>;
}

type WaterStore = WaterStoreState & WaterStoreActions;

// Estado inicial
const initialState: WaterStoreState = {
  currentIntake: 0,
  dailyGoal: 4000,
  lastResetDate: '',
  isLoading: true,
  config: {
    weight: null,
    activityLevel: 'sedentary',
    climate: 'temperate',
    customGoal: null,
    wakeUpTime: null,
    sleepTime: null,
    notificationsEnabled: false,
  },
  todayEntries: [],
  weeklyStats: [],
  monthlyStats: [],
  calculatedGoal: null,
};

export const useWaterStore = create<WaterStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Inicializar o store
      initializeStore: async () => {
        const { lastResetDate } = get();
        const today = new Date().toDateString();
        
        // Verificar se precisa resetar para novo dia
        if (lastResetDate !== today) {
          set({ 
            currentIntake: 0, 
            todayEntries: [],
            lastResetDate: today 
          });
        }
        
        // Carregar dados históricos
        await get().loadHistoricalData();
        
        // Calcular meta se houver configurações
        if (get().config.weight) {
          await get().calculateGoalFromConfig();
        }
        
        set({ isLoading: false });
      },

      // Adicionar água
      addWater: async (amount: number, note?: string) => {
        const { currentIntake, todayEntries } = get();
        const newEntry: WaterEntry = {
          id: Date.now().toString(),
          amount,
          timestamp: new Date(),
          note,
        };
        
        const newIntake = currentIntake + amount;
        
        set({
          currentIntake: newIntake,
          todayEntries: [...todayEntries, newEntry],
        });
      },

      // Remover entrada
      removeEntry: async (entryId: string) => {
        const { todayEntries } = get();
        const entry = todayEntries.find(e => e.id === entryId);
        
        if (!entry) return;
        
        const newIntake = get().currentIntake - entry.amount;
        const filteredEntries = todayEntries.filter(e => e.id !== entryId);
        
        set({
          currentIntake: Math.max(0, newIntake),
          todayEntries: filteredEntries,
        });
      },

      // Atualizar meta manualmente
      updateGoal: async (newGoal: number) => {
        set({ 
          dailyGoal: newGoal,
          config: {
            ...get().config,
            customGoal: newGoal,
          }
        });
      },

      // Resetar dia
      resetDay: async () => {
        const today = new Date().toDateString();
        set({ 
          currentIntake: 0, 
          todayEntries: [],
          lastResetDate: today 
        });
      },

      // Atualizar configurações
      updateConfig: async (newConfig: Partial<WaterConfig>) => {
        const currentConfig = get().config;
        const updatedConfig = { ...currentConfig, ...newConfig };
        
        set({ config: updatedConfig });
        
        // Se peso ou configurações relevantes mudaram, recalcular meta
        if (newConfig.weight || newConfig.activityLevel || newConfig.climate) {
          await get().calculateGoalFromConfig();
        }
      },

      // Calcular meta baseada nas configurações
      calculateGoalFromConfig: async () => {
        const { config } = get();
        
        if (!config.weight) {
          set({ calculatedGoal: null });
          return;
        }

        // Converter tipos para o formato do calculador
        let activityLevelForCalc: 'sedentary' | 'moderate' | 'active' | 'athlete';
        switch (config.activityLevel) {
          case 'light':
            activityLevelForCalc = 'moderate';
            break;
          case 'intense':
            activityLevelForCalc = 'athlete';
            break;
          default:
            activityLevelForCalc = config.activityLevel;
        }

        let climateForCalc: 'temperate' | 'hot' | 'very_hot';
        switch (config.climate) {
          case 'cold':
            climateForCalc = 'temperate';
            break;
          case 'hot':
            climateForCalc = 'hot';
            break;
          case 'very_hot':
            climateForCalc = 'very_hot';
            break;
          default:
            climateForCalc = 'temperate';
        }

        const calculatorConfig: CalculatorConfig = {
          weight: config.weight,
          activityLevel: activityLevelForCalc,
          climate: climateForCalc,
        };

        const calculatedGoal = calculateWaterGoal(calculatorConfig);
        
        set({ 
          calculatedGoal,
          // Se não houver meta personalizada, usar a calculada
          dailyGoal: config.customGoal || calculatedGoal 
        });
      },

      // Carregar dados históricos (simulado - na prática buscaria do AsyncStorage)
      loadHistoricalData: async () => {
        // Simular carregamento de dados históricos
        const today = new Date();
        const weeklyStats: WaterDailyStats[] = [];
        const monthlyStats: WaterDailyStats[] = [];
        
        // Gerar dados para os últimos 7 dias
        for (let i = 6; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          const dateStr = date.toISOString().split('T')[0];
          
          weeklyStats.push({
            date: dateStr,
            intake: Math.floor(Math.random() * 4000),
            goal: 6000,
            completed: Math.random() > 0.5,
          });
        }
        
        // Gerar dados para os últimos 30 dias
        for (let i = 29; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          const dateStr = date.toISOString().split('T')[0];
          
          monthlyStats.push({
            date: dateStr,
            intake: Math.floor(Math.random() * 4000),
            goal: 4000,
            completed: Math.random() > 0.5,
          });
        }
        
        set({ weeklyStats, monthlyStats });
      },

      // Limpar histórico
      clearHistory: async () => {
        set({ 
          weeklyStats: [],
          monthlyStats: [],
          todayEntries: [],
          currentIntake: 0 
        });
      },
    }),
    {
      name: 'water-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // Selecionar apenas os campos que queremos persistir
      partialize: (state) => ({
        currentIntake: state.currentIntake,
        dailyGoal: state.dailyGoal,
        lastResetDate: state.lastResetDate,
        config: state.config,
        todayEntries: state.todayEntries,
      }),
      // Callback quando os dados são reidratados
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.initializeStore();
        }
      },
    }
  )
);

// Hook auxiliar para dados derivados
export const useWaterStats = () => {
  const {
    currentIntake,
    dailyGoal,
    todayEntries,
    weeklyStats,
    monthlyStats,
  } = useWaterStore();

  const progress = dailyGoal > 0 ? Math.min(currentIntake / dailyGoal, 1) : 0;
  const remaining = Math.max(0, dailyGoal - currentIntake);
  const percentage = Math.round(progress * 100);
  
  // Calcular consumo por hora
  const hourlyConsumption = todayEntries.reduce((acc, entry) => {
    const hour = new Date(entry.timestamp).getHours();
    acc[hour] = (acc[hour] || 0) + entry.amount;
    return acc;
  }, {} as Record<number, number>);
  
  // Estatísticas da semana
  const weeklyTotal = weeklyStats.reduce((sum, day) => sum + day.intake, 0);
  const weeklyAverage = weeklyStats.length > 0 ? weeklyTotal / weeklyStats.length : 0;
  const weeklyCompletionRate = weeklyStats.length > 0 
    ? (weeklyStats.filter(day => day.completed).length / weeklyStats.length) * 100 
    : 0;
  
  return {
    progress,
    remaining,
    percentage,
    hourlyConsumption,
    weeklyTotal,
    weeklyAverage,
    weeklyCompletionRate,
    todayEntries,
    weeklyStats,
    monthlyStats,
  };
};