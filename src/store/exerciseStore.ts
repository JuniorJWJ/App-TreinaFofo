import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Exercise, ExerciseFormData } from '../types';
import { initializeMockExercises, mockExercises } from '../data/mockExercises';

const mockGifByName = new Map(
  mockExercises
    .filter(ex => ex.gifLocal)
    .map(ex => [ex.name, ex.gifLocal])
);

interface ExerciseState {
  exercises: Exercise[];
  isLoading: boolean;

  // Actions
  CreateExercise: (exerciseData: ExerciseFormData) => void;
  updateExercise: (id: string, updates: Partial<Exercise>) => void;
  deleteExercise: (id: string) => void;
  getExercise: (id: string) => Exercise | undefined;
  getExercisesByMuscleGroup: (muscleGroupId: string) => Exercise[];
  getExercises: () => Exercise[];
  searchExercises: (query: string) => Exercise[];
}

export const useExerciseStore = create<ExerciseState>()(
  persist(
    (set, get) => ({
      exercises: [],
      isLoading: false,

      CreateExercise: (exerciseData: ExerciseFormData) => {
        const newExercise: Exercise = {
          ...exerciseData,
          id: `ex-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date(),
          updatedAt: new Date(),
          // Garantir valores padrão para arrays
          warmupSets: exerciseData.warmupSets || [],
        };
        set(state => ({
          exercises: [...state.exercises, newExercise],
        }));
      },

      updateExercise: (id: string, updates: Partial<Exercise>) => {
        set(state => ({
          exercises: state.exercises.map(exercise =>
            exercise.id === id
               {
                  ...exercise,
                  ...updates,
                  updatedAt: new Date(),
                  warmupSets:
                    updates.warmupSets !== undefined
                       updates.warmupSets
                      : exercise.warmupSets,
                }
              : exercise
          ),
        }));
      },

      deleteExercise: (id: string) => {
        set(state => ({
          exercises: state.exercises.filter(exercise => exercise.id !== id),
        }));
      },

      getExercise: (id: string) => {
        return get().exercises.find(exercise => exercise.id === id);
      },

      getExercisesByMuscleGroup: (muscleGroupId: string) => {
        return get().exercises.filter(
          exercise => exercise.muscleGroupId === muscleGroupId
        );
      },

      getExercises: () => {
        return get().exercises;
      },

      searchExercises: (query: string) => {
        const lowercaseQuery = query.toLowerCase();
        return get().exercises.filter(exercise =>
          exercise.name.toLowerCase().includes(lowercaseQuery)
        );
      },
    }),
    {
      name: 'exercise-store',
      version: 3,
      storage: createJSONStorage(() => AsyncStorage),
      migrate: (persistedState: any, version: number) => {
        if (persistedState && persistedState.exercises && version < 3) {
          persistedState.exercises = persistedState.exercises.map(
            (exercise: any) => {
              const gifLocal = mockGifByName.get(exercise.name);
              return {
                ...exercise,
                defaultWeight: exercise.defaultWeight || undefined,
                weightUnit: exercise.weightUnit || 'kg',
                warmupSets: exercise.warmupSets || [],
                progressionType: exercise.progressionType || 'fixed',
                autoProgression: exercise.autoProgression || false,
                incrementSize: exercise.incrementSize || 2.5,
                notes: exercise.notes || undefined,
                gifLocal: exercise.gifLocal  gifLocal,
              };
            }
          );
        }
        return persistedState;
      },
      onRehydrateStorage: () => (state) => {
        if (state && state.exercises.length === 0) {
          // Mantém vazio para evitar duplicação; initializeAppData fará o populate
        }
      },
    }
  )
);
