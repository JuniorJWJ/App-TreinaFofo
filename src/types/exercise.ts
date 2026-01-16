export interface Exercise {
  id: string;
  name: string;
  muscleGroupId: string;
  description?: string;
  equipment?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  videoUrl?: string;
  imageUrl?: string;

  // Configurações padrão
  defaultSets: number;
  defaultReps: number;
  defaultRestTime: number; // em segundos
  
  // Controle de peso
  defaultWeight?: number;
  weightUnit?: 'kg' | 'lb';
  
  // Séries de aquecimento
  warmupSets?: Array<{
    reps: number;
    percentage: number; // % do peso de trabalho
  }>;
  
  // Sistema de progressão
  progressionType?: 'fixed' | 'range' | 'linear';
  autoProgression?: boolean;
  incrementSize?: number; // Ex: 2.5kg
  targetOneRepMax?: number;
  
  // Notas e observações
  notes?: string;
  
  // Histórico
  personalRecord?: number;
  lastPerformed?: Date;
  
  createdAt: Date;
  updatedAt: Date;
}

// Para séries individuais durante o treino
export interface ExerciseSet {
  setNumber: number;
  type: 'warmup' | 'working' | 'drop' | 'failure';
  targetReps: number;
  actualReps?: number;
  targetWeight: number;
  actualWeight?: number;
  completed: boolean;
  notes?: string;
  rpe?: number; // 1-10 escala de esforço
}

// Para criação/edicação
export type ExerciseFormData = {
  name: string;
  muscleGroupId: string;
  description?: string;
  equipment?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  videoUrl?: string;
  imageUrl?: string;
  
  // Configurações padrão
  defaultSets: number;
  defaultReps: number;
  defaultRestTime: number;
  
  // Controle de peso
  defaultWeight?: number;
  weightUnit?: 'kg' | 'lb';
  
  // Séries de aquecimento
  warmupSets?: Array<{
    reps: number;
    percentage: number;
  }>;
  
  // Sistema de progressão
  progressionType?: 'fixed' | 'range' | 'linear';
  autoProgression?: boolean;
  incrementSize?: number;
  targetOneRepMax?: number;
  
  // Notas
  notes?: string;
};

// Relacionamento para queries
export interface ExerciseWithMuscleGroup extends Exercise {
  muscleGroup: MuscleGroup;
}