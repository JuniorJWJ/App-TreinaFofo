import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Exercise, ExerciseFormData } from '../types';
import {  mockExercises } from '../data/mockExercises';

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
  exportExercisesJson: () => string;
  importExercisesFromJson: (json: string) => {
    added: number;
    updated: number;
    skipped: number;
  };
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
        const createdAt =
          exerciseData.createdAt instanceof Date
            ? exerciseData.createdAt
            : new Date();
        const updatedAt =
          exerciseData.updatedAt instanceof Date
            ? exerciseData.updatedAt
            : new Date();
        const newExercise: Exercise = {
          ...exerciseData,
          id:
            exerciseData.id ||
            `ex-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          createdAt,
          updatedAt,
          // Garantir valores padrão para arrays
          warmupSets: exerciseData.warmupSets || [],
        };
        set(state => ({
          exercises: [...state.exercises, newExercise],
        }));
      },

      exportExercisesJson: () => {
        const payload = {
          version: 1,
          exportedAt: new Date().toISOString(),
          exercises: get().exercises.map(exercise => {
            const gifLocal =
              typeof exercise.gifLocal === 'string' ||
              (exercise.gifLocal &&
                typeof exercise.gifLocal === 'object' &&
                exercise.gifLocal.uri)
                ? exercise.gifLocal
                : undefined;

            return {
              ...exercise,
              gifLocal,
              createdAt:
                exercise.createdAt?.toISOString?.() || new Date().toISOString(),
              updatedAt:
                exercise.updatedAt?.toISOString?.() || new Date().toISOString(),
            };
          }),
        };

        return JSON.stringify(payload, null, 2);
      },

      importExercisesFromJson: (json: string) => {
        let payload: any;
        try {
          payload = JSON.parse(json);
        } catch {
          return { added: 0, updated: 0, skipped: 0 };
        }

        const incoming: any[] = Array.isArray(payload?.exercises)
          ? payload.exercises
          : Array.isArray(payload)
            ? payload
            : [];

        const parseDate = (value: any) => {
          if (!value) return null;
          const date = new Date(value);
          return Number.isNaN(date.getTime()) ? null : date;
        };

        let added = 0;
        let updated = 0;
        let skipped = 0;

        const existingById = new Map(get().exercises.map(ex => [ex.id, ex]));
        const nextExercises = [...get().exercises];

        incoming.forEach(raw => {
          if (!raw || !raw.id || !raw.name || !raw.muscleGroupId) {
            skipped += 1;
            return;
          }

          const incomingUpdatedAt = parseDate(raw.updatedAt) || new Date();
          const existing = existingById.get(raw.id);

          if (!existing) {
            nextExercises.push({
              ...raw,
              createdAt: parseDate(raw.createdAt) || new Date(),
              updatedAt: incomingUpdatedAt,
              warmupSets: raw.warmupSets || [],
              weightUnit: raw.weightUnit || 'kg',
            });
            added += 1;
            return;
          }

          const existingUpdatedAt =
            existing.updatedAt instanceof Date
              ? existing.updatedAt
              : parseDate(existing.updatedAt) || new Date(0);

          if (incomingUpdatedAt > existingUpdatedAt) {
            const mergedGif =
              raw.gifLocal !== undefined && raw.gifLocal !== null
                ? raw.gifLocal
                : existing.gifLocal;

            const merged = {
              ...existing,
              ...raw,
              gifLocal: mergedGif,
              createdAt: existing.createdAt,
              updatedAt: incomingUpdatedAt,
              // FIXED: proper fallback for warmupSets
              warmupSets: raw.warmupSets !== undefined ? raw.warmupSets : (existing.warmupSets ?? []),
              weightUnit: raw.weightUnit || existing.weightUnit || 'kg',
            };

            const idx = nextExercises.findIndex(ex => ex.id === existing.id);
            if (idx >= 0) nextExercises[idx] = merged;
            updated += 1;
          } else {
            skipped += 1;
          }
        });

        set({ exercises: nextExercises });
        return { added, updated, skipped };
      },

      updateExercise: (id: string, updates: Partial<Exercise>) => {
        set(state => ({
          exercises: state.exercises.map(exercise =>
            exercise.id === id
              ? {
                  ...exercise,
                  ...updates,
                  updatedAt: new Date(),
                  warmupSets:
                    updates.warmupSets !== undefined
                      ? updates.warmupSets
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
                // FIXED: proper fallback for gifLocal
                gifLocal: gifLocal ?? exercise.gifLocal,
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