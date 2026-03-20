// src/types/exercise.ts
export interface Exercise {
  id: string;
  name: string;
  muscleGroupId: string;
  secondaryMuscleGroups?: string[];
  description?: string;
  equipment?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  videoUrl?: string;
  imageUrl?: string;
  gifLocal?: any;

  // Configura??es padr?o
  defaultSets: number;
  defaultReps: number;
  defaultRestTime: number; // em segundos

  // Controle de peso
  defaultWeight?: number;
  weightUnit?: 'kg' | 'lb';

  // S?ries de aquecimento
  warmupSets?: Array<{
    reps: number;
    percentage: number; // % do peso de trabalho
  }>;

  // Sistema de progress?o
  progressionType?: 'fixed' | 'range' | 'linear';
  autoProgression?: boolean;
  incrementSize?: number; // Ex: 2.5kg
  targetOneRepMax?: number;

  // Notas e observa??es
  notes?: string;

  // Hist?rico
  personalRecord?: number;
  lastPerformed?: Date;

  createdAt: Date;
  updatedAt: Date;
}

// Para s?ries individuais durante o treino
export interface ExerciseSet {
  setNumber: number;
  type: 'warmup' | 'working' | 'drop' | 'failure';
  targetReps: number;
  actualReps?: number;
  targetWeight: number;
  actualWeight?: number;
  completed: boolean;
  notes?: string;
  rpe?: number; // 1-10 escala de esfor?o
}

// Para cria??o/edi??o
export type ExerciseFormData = {
  name: string;
  muscleGroupId: string;
  secondaryMuscleGroups?: string[];
  description?: string;
  equipment?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  videoUrl?: string;
  imageUrl?: string;
  gifLocal?: any;

  // Configura??es padr?o
  defaultSets: number;
  defaultReps: number;
  defaultRestTime: number;

  // Controle de peso
  defaultWeight?: number;
  weightUnit?: 'kg' | 'lb';

  // S?ries de aquecimento
  warmupSets?: Array<{
    reps: number;
    percentage: number;
  }>;

  // Sistema de progress?o
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
