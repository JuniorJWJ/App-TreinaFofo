import { ExerciseFormData } from '../../types';

export const forearmsMockExercises: ExerciseFormData[] = [
  {
    name: 'Rosca Inversa',
    muscleGroupId: 'Antebraço',
    description: 'Foco no braquiorradial e extensores do punho.',
    equipment: 'Barra ou Polia',
    difficulty: 'beginner',
    defaultSets: 3,
    defaultReps: 15,
    defaultRestTime: 60,
    defaultWeight: 15,
    weightUnit: 'kg',
    progressionType: 'range',
    autoProgression: false,
  },
  // =======================
// FLEXORES DE PUNHO
// =======================
{
  name: 'Rosca de Punho com Barra',
  muscleGroupId: 'Antebraço',
  description: 'Foco nos flexores do punho.',
  equipment: 'Barra',
  difficulty: 'beginner',
  defaultSets: 3,
  defaultReps: 15,
  defaultRestTime: 45,
  defaultWeight: 20,
  weightUnit: 'kg',
  progressionType: 'range',
},
{
  name: 'Rosca de Punho com Halteres',
  muscleGroupId: 'Antebraço',
  description: 'Versão unilateral com halteres.',
  equipment: 'Halteres',
  difficulty: 'beginner',
  defaultSets: 3,
  defaultReps: 15,
  defaultRestTime: 60,
},
{
  name: 'Rosca de Punho no Banco',
  muscleGroupId: 'Antebraço',
  description: 'Antebraço apoiado para isolamento máximo.',
  equipment: 'Banco + Barra',
  difficulty: 'beginner',
  defaultSets: 3,
  defaultReps: 15,
  defaultRestTime: 60,
},

// =======================
// EXTENSORES DE PUNHO
// =======================
{
  name: 'Rosca de Punho Inversa',
  muscleGroupId: 'Antebraço',
  description: 'Trabalha extensores do punho.',
  equipment: 'Barra',
  difficulty: 'beginner',
  defaultSets: 3,
  defaultReps: 15,
  defaultRestTime: 45,
},
{
  name: 'Extensão de Punho com Halteres',
  muscleGroupId: 'Antebraço',
  description: 'Execução unilateral para controle.',
  equipment: 'Halteres',
  difficulty: 'beginner',
  defaultSets: 3,
  defaultReps: 15,
  defaultRestTime: 60,
},

// =======================
// BRAQUIORRADIAL
// =======================
{
  name: 'Rosca Martelo Cruzada',
  muscleGroupId: 'Antebraço',
  description: 'Foco no braquiorradial.',
  equipment: 'Halteres',
  difficulty: 'beginner',
  defaultSets: 3,
  defaultReps: 12,
  defaultRestTime: 60,
},
{
  name: 'Rosca Martelo no Cabo',
  muscleGroupId: 'Antebraço',
  description: 'Tensão constante durante o movimento.',
  equipment: 'Corda + Polia',
  difficulty: 'intermediate',
  defaultSets: 3,
  defaultReps: 12,
  defaultRestTime: 60,
},

// =======================
// PEGADA (GRIP)
// =======================
{
  name: 'Farmer’s Walk',
  muscleGroupId: 'Antebraço',
  description: 'Caminhada segurando peso, excelente para pegada.',
  equipment: 'Halteres',
  difficulty: 'intermediate',
  defaultSets: 3,
  defaultReps: 1,
  defaultRestTime: 90,
  notes: 'Caminhar 20-40 metros',
},
{
  name: 'Dead Hang',
  muscleGroupId: 'Antebraço',
  description: 'Segurar na barra fixa por tempo.',
  equipment: 'Barra Fixa',
  difficulty: 'beginner',
  defaultSets: 3,
  defaultReps: 1,
  notes: 'Segurar 20-60 segundos',
  defaultRestTime: 60,
},
{
  name: 'Pegada com Anilha',
  muscleGroupId: 'Antebraço',
  description: 'Segurar anilhas com os dedos.',
  equipment: 'Anilha',
  difficulty: 'intermediate',
  defaultSets: 3,
  defaultReps: 1,
  notes: 'Segurar o máximo de tempo possível',
  defaultRestTime: 60,
},

// =======================
// AVANÇADOS / FUNCIONAIS
// =======================
{
  name: 'Wrist Roller',
  muscleGroupId: 'Antebraço',
  description: 'Enrolar peso com corda para antebraço.',
  equipment: 'Wrist Roller',
  difficulty: 'intermediate',
  defaultSets: 3,
  defaultReps: 10,
  defaultRestTime: 60,
},
{
  name: 'Pinch Grip Hold',
  muscleGroupId: 'Antebraço',
  description: 'Segurar peso com pinça dos dedos.',
  equipment: 'Anilhas',
  difficulty: 'advanced',
  defaultSets: 3,
  defaultReps: 1,
  notes: 'Segurar 20-40 segundos',
  defaultRestTime: 60,
},
];
