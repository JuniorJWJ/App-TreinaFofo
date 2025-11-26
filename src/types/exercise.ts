import { MuscleGroup } from './muscleGroups';

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
  
  // Histórico (para progressão)
  personalRecord?: number;
  lastPerformed?: Date;
  
  createdAt: Date;
  updatedAt: Date;
}

// Relacionamento para queries
export interface ExerciseWithMuscleGroup extends Exercise {
  muscleGroup: MuscleGroup;
}

// Para criação/edição
export type ExerciseFormData = Omit<Exercise, 'id' | 'createdAt' | 'updatedAt'>;