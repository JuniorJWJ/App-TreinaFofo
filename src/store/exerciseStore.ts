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
    (set, get) => ({
      exercises: [],
      isLoading: false,

      addExercise: (exerciseData) => {
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

      updateExercise: (id, updates) => {
        set((state) => ({
          exercises: state.exercises.map((exercise) =>
            exercise.id === id
              ? { ...exercise, ...updates, updatedAt: new Date() }
              : exercise
          ),
        }));
      },

      deleteExercise: (id) => {
        set((state) => ({
          exercises: state.exercises.filter((exercise) => exercise.id !== id),
        }));
      },

      getExercise: (id) => {
        return get().exercises.find((exercise) => exercise.id === id);
      },

      getExercisesByMuscleGroup: (muscleGroupId) => {
        return get().exercises.filter(
          (exercise) => exercise.muscleGroupId === muscleGroupId
        );
      },

      getExercises: () => {
        return get().exercises;
      },

      searchExercises: (query) => {
        const lowercaseQuery = query.toLowerCase();
        return get().exercises.filter((exercise) =>
          exercise.name.toLowerCase().includes(lowercaseQuery)
        );
      },
    }),
    {
      name: 'exercise-store',
      storage: {
        getItem: async (name) => {
          const value = await AsyncStorage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: async (name, value) => {
          await AsyncStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: async (name) => {
          await AsyncStorage.removeItem(name);
        },
      },
    }
  )
);