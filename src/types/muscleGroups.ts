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
  { name: 'Peito', color: '#FF6B6B' },
  { name: 'Costas', color: '#4ECDC4' },
  { name: 'Ombro', color: '#45B7D1' },
  { name: 'Bíceps', color: '#96CEB4' },
  { name: 'Tríceps', color: '#FFEAA7' },
  { name: 'Pernas', color: '#DDA0DD' },
  { name: 'Quadríceps', color: '#98D8C8' },
  { name: 'Posterior de Coxa', color: '#F7DC6F' },
  { name: 'Glúteo ', color: '#BB8FCE' },
  { name: 'Panturrilha', color: '#85C1E9' },
  { name: 'Abdominal', color: '#F8C471' },
  { name: 'Antebraço', color: '#82E0AA' },
  { name: 'Trapézio', color: '#F1948A' },
  { name: 'Lats', color: '#7FB3D5' },
];