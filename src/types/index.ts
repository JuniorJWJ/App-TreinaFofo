// Re-export todos os tipos
export * from './muscleGroups';
export * from './exercise';
export * from './workout';
export * from './workoutSplit';
export * from './weeklyPlan';

// Tipos utilitários
export type ApiResponse<T> = {
  data: T;
  message?: string;
  success: boolean;
};

export type PaginatedResponse<T> = ApiResponse<{
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasNext: boolean;
}>;

// Filtros e busca
export interface SearchFilters {
  query?: string;
  muscleGroupIds?: string[];
  difficulty?: string[];
  equipment?: string[];
  tags?: string[];
}

export interface PaginationParams {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Estados de UI
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// Para formulários
export type FormMode = 'create' | 'edit' | 'view';