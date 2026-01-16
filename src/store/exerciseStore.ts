import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Exercise, ExerciseFormData } from '../types';

interface ExerciseState {
  exercises: Exercise[];
  isLoading: boolean;
  
  // Actions
  addExercise: (exerciseData: ExerciseFormData) => void;
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

      addExercise: (exerciseData: ExerciseFormData) => {
        const newExercise: Exercise = {
          ...exerciseData,
          id: `ex-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date(),
          updatedAt: new Date(),
          // Garantir valores padrão para arrays
          warmupSets: exerciseData.warmupSets || [],
        };
        set((state) => ({
          exercises: [...state.exercises, newExercise],
        }));
      },

      updateExercise: (id: string, updates: Partial<Exercise>) => {
        set((state) => ({
          exercises: state.exercises.map((exercise) =>
            exercise.id === id
              ? { 
                  ...exercise, 
                  ...updates, 
                  updatedAt: new Date(),
                  // Garantir que arrays não sejam sobrescritos como undefined
                  warmupSets: updates.warmupSets !== undefined ? updates.warmupSets : exercise.warmupSets,
                }
              : exercise
          ),
        }));
      },

      deleteExercise: (id: string) => {
        set((state) => ({
          exercises: state.exercises.filter((exercise) => exercise.id !== id),
        }));
      },

      getExercise: (id: string) => {
        return get().exercises.find((exercise) => exercise.id === id);
      },

      getExercisesByMuscleGroup: (muscleGroupId: string) => {
        return get().exercises.filter(
          (exercise) => exercise.muscleGroupId === muscleGroupId
        );
      },

      getExercises: () => {
        return get().exercises;
      },

      searchExercises: (query: string) => {
        const lowercaseQuery = query.toLowerCase();
        return get().exercises.filter((exercise) =>
          exercise.name.toLowerCase().includes(lowercaseQuery)
        );
      },
    }),
    {
      name: 'exercise-store',
      version: 2,
      storage: createJSONStorage(() => AsyncStorage),
      migrate: (persistedState: any, version: number) => {
        if (version === 1) {
          // Migrar da versão 1 para 2
          if (persistedState && persistedState.exercises) {
            persistedState.exercises = persistedState.exercises.map((exercise: any) => ({
              ...exercise,
              defaultWeight: exercise.defaultWeight || undefined,
              weightUnit: exercise.weightUnit || 'kg',
              warmupSets: exercise.warmupSets || [],
              progressionType: exercise.progressionType || 'fixed',
              autoProgression: exercise.autoProgression || false,
              incrementSize: exercise.incrementSize || 2.5,
              notes: exercise.notes || undefined,
            }));
          }
        }
        return persistedState;
      },
    }
  )
);