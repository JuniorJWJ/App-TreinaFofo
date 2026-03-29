import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Exercise, ExerciseFormData } from '../types';
import { mockExercises } from '../data/mockExercises';
import { normalizeText } from '../utils/textNormalize';

const mockGifByName = new Map(
  mockExercises
    .filter(ex => ex.gifLocal)
    .map(ex => [ex.name, ex.gifLocal])
);

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const parseDate = (value: unknown): Date | null => {
  if (value instanceof Date) return value;
  if (typeof value === 'string' || typeof value === 'number') {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }
  return null;
};

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
        let payload: unknown;
        try {
          payload = JSON.parse(json);
        } catch {
          return { added: 0, updated: 0, skipped: 0 };
        }

        const incoming: unknown[] =
          isRecord(payload) && Array.isArray(payload.exercises)
            ? payload.exercises
          : Array.isArray(payload)
            ? payload
            : [];

        let added = 0;
        let updated = 0;
        let skipped = 0;

        const existingById = new Map(get().exercises.map(ex => [ex.id, ex]));
        const nextExercises = [...get().exercises];

        incoming.forEach(rawItem => {
          if (!isRecord(rawItem)) {
            skipped += 1;
            return;
          }

          const raw = rawItem as Partial<Exercise> & Record<string, unknown>;
          const rawId = typeof raw.id === 'string' ? raw.id : '';
          const rawName = typeof raw.name === 'string' ? raw.name : '';
          const rawGroup =
            typeof raw.muscleGroupId === 'string' ? raw.muscleGroupId : '';

          if (!rawId || !rawName || !rawGroup) {
            skipped += 1;
            return;
          }

          const incomingUpdatedAt = parseDate(raw.updatedAt) || new Date();
          const existing = existingById.get(rawId);

          if (!existing) {
            nextExercises.push({
              ...raw,
              id: rawId,
              name: rawName,
              muscleGroupId: rawGroup,
              createdAt: parseDate(raw.createdAt) || new Date(),
              updatedAt: incomingUpdatedAt,
              warmupSets: Array.isArray(raw.warmupSets) ? raw.warmupSets : [],
              weightUnit:
                typeof raw.weightUnit === 'string' ? raw.weightUnit : 'kg',
            } as Exercise);
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
              warmupSets:
                raw.warmupSets !== undefined
                  ? raw.warmupSets
                  : existing.warmupSets || [],
              weightUnit:
                typeof raw.weightUnit === 'string'
                  ? raw.weightUnit
                  : existing.weightUnit || 'kg',
            } as Exercise;

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
      version: 4,
      storage: createJSONStorage(() => AsyncStorage),
      migrate: (persistedState: unknown, version: number) => {
        if (!isRecord(persistedState)) return persistedState;

        const rawExercises = Array.isArray(persistedState.exercises)
          ? persistedState.exercises
          : [];

        let normalized = rawExercises.map(exerciseItem => {
          if (!isRecord(exerciseItem)) return exerciseItem as Exercise;

          const exercise = exerciseItem as Partial<Exercise> & Record<string, unknown>;
          if (version >= 3) {
            return exercise as Exercise;
          }

          const gifLocal = mockGifByName.get(exercise.name as string);

          return {
            ...(exercise as Exercise),
            defaultWeight: exercise.defaultWeight || undefined,
            weightUnit: (exercise.weightUnit as string) || 'kg',
            warmupSets: Array.isArray(exercise.warmupSets)
              ? exercise.warmupSets
              : [],
            progressionType: exercise.progressionType || 'fixed',
            autoProgression: exercise.autoProgression || false,
            incrementSize: exercise.incrementSize || 2.5,
            notes: exercise.notes || undefined,
            // FIXED: proper fallback for gifLocal
            gifLocal: exercise.gifLocal ?? gifLocal,
          } as Exercise;
        });

        normalized = normalized.map(exercise => {
          if (!isRecord(exercise)) return exercise as Exercise;
          const safeExercise = exercise as Exercise;
          const normalizedGroup =
            normalizeText(safeExercise.muscleGroupId) || safeExercise.muscleGroupId;
          return {
            ...safeExercise,
            name: normalizeText(safeExercise.name) || safeExercise.name,
            muscleGroupId: normalizedGroup,
            description: normalizeText(safeExercise.description),
            equipment: normalizeText(safeExercise.equipment),
            notes: normalizeText(safeExercise.notes),
            secondaryMuscleGroups: Array.isArray(safeExercise.secondaryMuscleGroups)
              ? safeExercise.secondaryMuscleGroups.map((group: string) =>
                  normalizeText(group) || group
                )
              : safeExercise.secondaryMuscleGroups,
          };
        });

        return {
          ...persistedState,
          exercises: normalized,
        };
      },
      onRehydrateStorage: () => (state) => {
        if (state && state.exercises.length === 0) {
          // Mantém vazio para evitar duplicação; initializeAppData fará o populate
        }
      },
    }
  )
);
