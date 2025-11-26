export interface MuscleGroup {
  id: string;
  name: string;
  color?: string; // Para identificação visual
  icon?: string; // Para ícones futuros
  createdAt: Date;
  updatedAt: Date;
}

// Grupos musculares pré-definidos
export const DEFAULT_MUSCLE_GROUPS: Omit<MuscleGroup, 'id' | 'createdAt' | 'updatedAt'>[] = [
  { name: 'Chest', color: '#FF6B6B' },
  { name: 'Back', color: '#4ECDC4' },
  { name: 'Shoulders', color: '#45B7D1' },
  { name: 'Biceps', color: '#96CEB4' },
  { name: 'Triceps', color: '#FFEAA7' },
  { name: 'Legs', color: '#DDA0DD' },
  { name: 'Quadriceps', color: '#98D8C8' },
  { name: 'Hamstrings', color: '#F7DC6F' },
  { name: 'Glutes', color: '#BB8FCE' },
  { name: 'Calves', color: '#85C1E9' },
  { name: 'Abs', color: '#F8C471' },
  { name: 'Forearms', color: '#82E0AA' },
  { name: 'Traps', color: '#F1948A' },
  { name: 'Lats', color: '#7FB3D5' },
];