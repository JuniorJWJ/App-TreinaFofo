import { create } from 'zustand';
import { persist } from 'zustand/middleware';
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
    (set: (partial: Partial<ExerciseState> | ((state: ExerciseState) => Partial<ExerciseState>), replace?: boolean) => void, get: () => ExerciseState) => ({
      exercises: [],
      isLoading: false,

      addExercise: (exerciseData: ExerciseFormData) => {
        const newExercise: Exercise = {
          ...exerciseData,
          id: `ex-${Date.now()}`,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set((state) => ({
          exercises: [...state.exercises, newExercise],
        }));
      },

      updateExercise: (id: string, updates: Partial<Exercise>) => {
        set((state) => ({
          exercises: state.exercises.map((exercise) =>
            exercise.id === id
              ? { ...exercise, ...updates, updatedAt: new Date() }
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
      storage: {
        getItem: async (name: string) => {
          const value = await AsyncStorage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: async (name: string, value: unknown) => {
          await AsyncStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: async (name: string) => {
          await AsyncStorage.removeItem(name);
        },
      },
    }
  )
);