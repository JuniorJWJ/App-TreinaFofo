import { Workout } from './workout';

export interface WorkoutSplit {
  id: string;
  name: string;
  description?: string;
  
  // Estrutura da divisão
  workoutIds: string[];
  workouts: Workout[];
  
  // Configuração
  cycleLength: number; // dias para completar um ciclo
  restDays: number; // dias de descanso por ciclo
  
  // Metadados
  isActive: boolean;
  tags: string[];
  
  // Estatísticas
  timesCompleted: number;
  currentCycle?: number;
  
  createdAt: Date;
  updatedAt: Date;
}

// Tipos comuns de divisão
export const COMMON_SPLIT_TYPES = {
  FULL_BODY: 'Full Body',
  UPPER_LOWER: 'Upper/Lower',
  PUSH_PULL_LEGS: 'Push/Pull/Pernas',
  BRO_SPLIT: 'Bro Split',
  CUSTOM: 'Custom'
} as const;

export type SplitType = typeof COMMON_SPLIT_TYPES[keyof typeof COMMON_SPLIT_TYPES];

// Para criação/edição
export type WorkoutSplitFormData = Omit<WorkoutSplit, 'id' | 'createdAt' | 'updatedAt' | 'timesCompleted' | 'currentCycle'>;