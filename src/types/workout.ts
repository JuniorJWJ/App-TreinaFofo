import { Exercise } from './exercise';

export interface WorkoutExercise extends Exercise {
  sets: number;
  reps: number;
  restTime: number;
  weight?: number;
  notes?: string;
  completed: boolean;
}

export interface Workout {
  id: string;
  name: string;
  description?: string;
  
  // Relacionamentos
  muscleGroupIds: string[];
  exerciseIds: string[];
  exercises: WorkoutExercise[];
  
  // Metadados
  estimatedDuration: number; // em minutos
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  
  // Estatísticas
  timesCompleted: number;
  lastCompleted?: Date;
  averageCompletionTime?: number;
  
  createdAt: Date;
  updatedAt: Date;
}

// Para criação/edição
export type WorkoutFormData = Omit<Workout, 'id' | 'createdAt' | 'updatedAt' | 'timesCompleted' | 'lastCompleted' | 'averageCompletionTime'>;

// Para execução do treino
export interface WorkoutSession {
  id: string;
  workoutId: string;
  startTime: Date;
  endTime?: Date;
  exercises: WorkoutExercise[];
  notes?: string;
  rating?: number; // 1-5 stars
}