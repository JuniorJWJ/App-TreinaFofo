import { Workout } from './workout';
import { WorkoutSplit } from './workoutSplit';

export type DayOfWeek = 
  | 'monday' 
  | 'tuesday' 
  | 'wednesday' 
  | 'thursday' 
  | 'friday' 
  | 'saturday' 
  | 'sunday';

export interface DailyWorkout {
  day: DayOfWeek;
  workoutId: string | null; // null = rest day
  workout?: Workout;
  isCompleted: boolean;
  completedAt?: Date;
  notes?: string;
}

export interface WeeklyPlan {
  id: string;
  name: string;
  description?: string;
  
  // Estrutura semanal
  days: DailyWorkout[];
  startDate: Date;
  endDate: Date;
  
  // Relacionamentos
  workoutSplitId?: string;
  workoutSplit?: WorkoutSplit;
  
  // Progresso
  currentWeek: number;
  totalWeeks: number;
  completedDays: number;
  completionRate: number; // 0-100
  
  // Configuração
  isActive: boolean;
  isTemplate: boolean; // se é um template reutilizável
  
  createdAt: Date;
  updatedAt: Date;
}

// Para criar novo plano (sem createdAt)
export type CreateWeeklyPlanData = Omit<WeeklyPlan, 
  'id' | 'createdAt' | 'updatedAt' | 'completedDays' | 'completionRate' | 'currentWeek'
>;

// Para editar plano existente (com createdAt)
export type UpdateWeeklyPlanData = Omit<WeeklyPlan, 
  'updatedAt' | 'completedDays' | 'completionRate' | 'currentWeek'
>;
// Para templates
export interface WeeklyPlanTemplate {
  id: string;
  name: string;
  description?: string;
  days: Omit<DailyWorkout, 'isCompleted' | 'completedAt'>[];
  totalWeeks: number;
  tags: string[];
  isPublic: boolean;
  createdAt: Date;
}

// Estatísticas de progresso
export interface ProgressStats {
  totalWorkouts: number;
  completedWorkouts: number;
  successRate: number;
  streak: number;
  totalTrainingTime: number;
  weightProgress: Record<string, number>; // exerciseId -> weight
}