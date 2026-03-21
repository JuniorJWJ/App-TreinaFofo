export type PopularWorkoutTemplate = {
  id: string;
  name: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedDuration: number;
  tags: string[];
  exerciseNames: string[];
};

export const popularWorkouts: PopularWorkoutTemplate[] = [
  {
    id: 'fullbody-beginner',
    name: 'Full Body Iniciante',
    description: 'Treino completo para iniciantes, com foco em movimento básico.',
    difficulty: 'beginner',
    estimatedDuration: 50,
    tags: ['fullbody', 'iniciante', 'força'],
    exerciseNames: [
      'Agachamento com Barra',
      'Supino Reto com Barra',
      'Puxada Frontal',
      'Desenvolvimento Militar com Barra',
      'Rosca Direta com Barra',
      'Tríceps Pulley',
      'Abdominal Tradicional',
    ],
  },
  {
    id: 'push-day',
    name: 'Push (Peito/Ombro/Tríceps)',
    description: 'Treino de empurrar com foco em peito, ombros e tríceps.',
    difficulty: 'intermediate',
    estimatedDuration: 60,
    tags: ['push', 'hipertrofia'],
    exerciseNames: [
      'Supino Reto com Barra',
      'Supino Inclinado com Halteres',
      'Crucifixo no Cabo (Crossover)',
      'Desenvolvimento Militar com Barra',
      'Elevação Lateral com Halteres',
      'Tríceps Pulley',
      'Tríceps Testa com Barra EZ',
    ],
  },
  {
    id: 'pull-day',
    name: 'Pull (Costas/Bíceps)',
    description: 'Treino de puxar com foco em costas e bíceps.',
    difficulty: 'intermediate',
    estimatedDuration: 60,
    tags: ['pull', 'hipertrofia'],
    exerciseNames: [
      'Puxada Frontal',
      'Remada Curva com Barra',
      'Remada Unilateral com Haltere',
      'Puxada no Pulley Frontal',
      'Rosca Direta com Barra',
      'Rosca Martelo com Halteres',
      'Rosca Inversa',
    ],
  },
  {
    id: 'legs-day',
    name: 'Legs (Pernas/Glúteo)',
    description: 'Treino completo de pernas e glúteos.',
    difficulty: 'intermediate',
    estimatedDuration: 65,
    tags: ['legs', 'glúteo', 'hipertrofia'],
    exerciseNames: [
      'Agachamento com Barra',
      'Leg Press',
      'Cadeira Extensora',
      'Stiff com Barra',
      'Mesa Flexora',
      'Elevação Pélvica',
      'Elevação de Panturrilha em Pé',
    ],
  },
  {
    id: 'upper-lower-upper',
    name: 'Upper (Membros Superiores)',
    description: 'Treino de superiores com foco em peito, costas e braços.',
    difficulty: 'intermediate',
    estimatedDuration: 55,
    tags: ['upper', 'hipertrofia'],
    exerciseNames: [
      'Supino Reto com Barra',
      'Puxada Frontal',
      'Desenvolvimento Militar com Barra',
      'Rosca Direta com Barra',
      'Tríceps Pulley',
      'Face Pull com Cabo',
    ],
  },
  {
    id: 'lower-day',
    name: 'Lower (Membros Inferiores)',
    description: 'Treino de inferiores com foco em quadríceps e posterior.',
    difficulty: 'intermediate',
    estimatedDuration: 55,
    tags: ['lower', 'hipertrofia'],
    exerciseNames: [
      'Agachamento com Barra',
      'Agachamento Frontal',
      'Mesa Flexora',
      'Stiff com Barra',
      'Panturrilha no Leg Press',
      'Abdução de Quadril',
    ],
  },
];
