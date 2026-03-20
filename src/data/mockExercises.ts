import { Exercise, ExerciseFormData } from '../types';
import { chestMockExercises } from './exercises/chestMockExercises';
import { backMockExercises } from './exercises/backMockExercises';
import { shouldersMockExercises } from './exercises/shouldersMockExercises';
import { bicepsMockExercises } from './exercises/bicepsMockExercises';
import { tricepsMockExercises } from './exercises/tricepsMockExercises';
import { forearmsMockExercises } from './exercises/forearmsMockExercises';
import { legsMockExercises } from './exercises/legsMockExercises';
import { coreMockExercises } from './exercises/coreMockExercises';

export const mockExercises: ExerciseFormData[] = [
  ...chestMockExercises,
  ...backMockExercises,
  ...shouldersMockExercises,
  ...bicepsMockExercises,
  ...tricepsMockExercises,
  ...forearmsMockExercises,
  ...legsMockExercises,
  ...coreMockExercises,
];

export const initializeMockExercises = (): Exercise[] => {
  return mockExercises.map((exercise, index) => ({
    ...exercise,
    id: `mock-ex-${index}-${Date.now()}`,
    createdAt: new Date(),
    updatedAt: new Date(),
    warmupSets: exercise.warmupSets || [],
  }));
};

export const getMockExercisesByMuscleGroup = (
  muscleGroupId: string,
): ExerciseFormData[] => {
  return mockExercises.filter(ex => ex.muscleGroupId === muscleGroupId);
};

export const getMuscleGroupsWithExercises = (): string[] => {
  const groups = new Set(mockExercises.map(ex => ex.muscleGroupId));
  return Array.from(groups);
};

export const searchMockExercises = (query: string): ExerciseFormData[] => {
  const lowercaseQuery = query.toLowerCase();
  return mockExercises.filter(exercise =>
    exercise.name.toLowerCase().includes(lowercaseQuery),
  );
};
