import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Workout, WorkoutFormData, WorkoutSession } from '../types';
import { normalizeText } from '../utils/textNormalize';

const uniqueIds = (ids: string[]) => Array.from(new Set(ids.filter(Boolean)));
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

const isDifficulty = (
  value: unknown,
): value is 'beginner' | 'intermediate' | 'advanced' =>
  value === 'beginner' || value === 'intermediate' || value === 'advanced';

interface WorkoutState {
  workouts: Workout[];
  sessions: WorkoutSession[];
  // activeWorkoutId: string | null;
  isLoading: boolean;
  
  // Actions
  // setActiveWorkout: (workoutId: string | null) => void;
  //getActiveWorkout: () => Workout | undefined;
  createQuickWorkout: (name: string, exerciseIds: string[]) => void;
  addWorkout: (workoutData: WorkoutFormData) => void;
  updateWorkout: (id: string, updates: Partial<Workout>) => void;
  deleteWorkout: (id: string) => void;
  getWorkout: (id: string) => Workout | undefined;
  getWorkouts: () => Workout[];
  duplicateWorkout: (id: string) => void;
  importWorkoutsFromData: (workouts: unknown[]) => {
    added: number;
    updated: number;
    skipped: number;
  };

  // Session Management
  startWorkoutSession: (workoutId: string) => string;
  completeWorkoutSession: (sessionId: string, notes: string, rating: number) => void;
  updateWorkoutSession: (sessionId: string, updates: Partial<WorkoutSession>) => void;
  getWorkoutSessions: (workoutId: string) => WorkoutSession[];
  getWorkoutHistory: (workoutId: string) => WorkoutSession[];
}

export const useWorkoutStore = create<WorkoutState>()(
  persist(
    (set, get) => ({
      workouts: [],
      sessions: [],
      // activeWorkoutId: null,
      isLoading: false,

      // ðŸ”„ **ALTERAÇÕES FEITAS:**

      // 1. NOVO: Definir treino ativo
      // setActiveWorkout: (workoutId) => {
      //   console.log('Definindo treino ativo:', workoutId);
      //   set({ activeWorkoutId: workoutId });
      // },

      // 2. NOVO: Obter treino ativo
      // getActiveWorkout: () => {
      //   const { activeWorkoutId, workouts } = get();
      //   const activeWorkout = workouts.find(workout => workout.id === activeWorkoutId);
      //   console.log('Treino ativo encontrado:', activeWorkout.name);
      //   return activeWorkout;
      // },

      // 3. NOVO: Criar treino rápido
      createQuickWorkout: (name, exerciseIds) => {
        console.log('Criando treino rápido:', name, 'com', exerciseIds.length, 'exercícios');
        const normalizedIds = uniqueIds(exerciseIds || []);

        const newWorkout: Workout = {
          id: `wr-${Date.now()}`,
          name,
          description: '',
          muscleGroupIds: [],
          exerciseIds: normalizedIds,
          exercises: [],
          estimatedDuration: normalizedIds.length * 10, // 10 min por exercício
          difficulty: 'beginner',
          tags: ['rápido'],
          timesCompleted: 0,
          lastCompleted: new Date(0),
          averageCompletionTime: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        set((state) => ({
          workouts: [...state.workouts, newWorkout],
          // activeWorkoutId: newWorkout.id,
        }));

        console.log('Treino criado e definido como ativo:', newWorkout.name);
      },

      // ✅ **MÉTODOS EXISTENTES (mantidos):**

      addWorkout: (workoutData) => {
        const normalizedIds = uniqueIds(workoutData.exerciseIds || []);
        const newWorkout: Workout = {
          ...workoutData,
          exerciseIds: normalizedIds,
          exercises: [],
          id: `wr-${Date.now()}`,
          timesCompleted: 0,
          lastCompleted: new Date(0),
          averageCompletionTime: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set((state) => ({
          workouts: [...state.workouts, newWorkout],
        }));
      },

      updateWorkout: (id, updates) => {
        set((state) => ({
          workouts: state.workouts.map((workout) =>
            workout.id === id
              ? {
                  ...workout,
                  ...updates,
                  exerciseIds: updates.exerciseIds
                    ? uniqueIds(updates.exerciseIds)
                    : workout.exerciseIds,
                  exercises: [],
                  updatedAt: new Date(),
                }
              : workout
          ),
        }));
      },

      deleteWorkout: (id) => {
        // const { activeWorkoutId } = get();
        set((state) => ({
          workouts: state.workouts.filter((workout) => workout.id !== id),
          // activeWorkoutId: activeWorkoutId === id ? null : activeWorkoutId,
        }));
      },

      getWorkout: (id) => {
        return get().workouts.find((workout) => workout.id === id);
      },

      getWorkouts: () => {
        return get().workouts;
      },

      duplicateWorkout: (id) => {
        const workout = get().workouts.find((w) => w.id === id);
        if (workout) {
          const duplicatedWorkout: Workout = {
            ...workout,
            id: `wr-${Date.now()}`,
            name: `${workout.name} (Cópia)`,
            exerciseIds: uniqueIds(workout.exerciseIds || []),
            exercises: [],
            timesCompleted: 0,
            lastCompleted: new Date(0),
            averageCompletionTime: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          set((state) => ({
            workouts: [...state.workouts, duplicatedWorkout],
          }));
        }
      },

      importWorkoutsFromData: (workouts) => {
        const incoming = Array.isArray(workouts) ? workouts : [];
        let added = 0;
        let updated = 0;
        let skipped = 0;

        const existingById = new Map(get().workouts.map(w => [w.id, w]));
        const nextWorkouts = [...get().workouts];

        incoming.forEach((rawItem) => {
          if (!isRecord(rawItem)) {
            skipped += 1;
            return;
          }

          const raw = rawItem as Partial<Workout> & Record<string, unknown>;
          const rawId = typeof raw.id === 'string' ? raw.id : '';
          const rawName = typeof raw.name === 'string' ? raw.name : '';

          if (!rawId || !rawName) {
            skipped += 1;
            return;
          }

          const incomingUpdatedAt = parseDate(raw.updatedAt) || new Date();
          const existing = existingById.get(rawId);

          if (!existing) {
            nextWorkouts.push({
              ...raw,
              id: rawId,
              name: rawName,
              description:
                typeof raw.description === 'string' ? raw.description : '',
              muscleGroupIds: Array.isArray(raw.muscleGroupIds)
                ? raw.muscleGroupIds
                : [],
              estimatedDuration:
                typeof raw.estimatedDuration === 'number' ? raw.estimatedDuration : 0,
              difficulty: isDifficulty(raw.difficulty) ? raw.difficulty : 'beginner',
              tags: Array.isArray(raw.tags)
                ? raw.tags.filter(tag => typeof tag === 'string')
                : [],
              exerciseIds: uniqueIds(Array.isArray(raw.exerciseIds) ? raw.exerciseIds : []),
              exercises: [],
              timesCompleted: 0,
              lastCompleted: new Date(0),
              averageCompletionTime: 0,
              createdAt: parseDate(raw.createdAt) || new Date(),
              updatedAt: incomingUpdatedAt,
            });
            added += 1;
            return;
          }

          const existingUpdatedAt =
            existing.updatedAt instanceof Date
              ? existing.updatedAt
              : parseDate(existing.updatedAt) || new Date(0);

          if (incomingUpdatedAt > existingUpdatedAt) {
            const merged = {
              ...existing,
              ...raw,
              description:
                typeof raw.description === 'string'
                  ? raw.description
                  : existing.description || '',
              muscleGroupIds: Array.isArray(raw.muscleGroupIds)
                ? raw.muscleGroupIds
                : existing.muscleGroupIds || [],
              estimatedDuration:
                typeof raw.estimatedDuration === 'number'
                  ? raw.estimatedDuration
                  : existing.estimatedDuration || 0,
              difficulty: isDifficulty(raw.difficulty)
                ? raw.difficulty
                : existing.difficulty || 'beginner',
              tags: Array.isArray(raw.tags)
                ? raw.tags.filter(tag => typeof tag === 'string')
                : existing.tags || [],
              exerciseIds: Array.isArray(raw.exerciseIds)
                ? uniqueIds(raw.exerciseIds)
                : existing.exerciseIds,
              exercises: [],
              timesCompleted: existing.timesCompleted,
              lastCompleted: existing.lastCompleted,
              averageCompletionTime: existing.averageCompletionTime,
              createdAt: existing.createdAt,
              updatedAt: incomingUpdatedAt,
            };

            const idx = nextWorkouts.findIndex(w => w.id === existing.id);
            if (idx >= 0) nextWorkouts[idx] = merged;
            updated += 1;
          } else {
            skipped += 1;
          }
        });

        set({ workouts: nextWorkouts });
        return { added, updated, skipped };
      },

      // Session Management (mantido)
      startWorkoutSession: (workoutId) => {
        const sessionId = `ws-${Date.now()}`;
        const newSession: WorkoutSession = {
          id: sessionId,
          workoutId,
          startTime: new Date(),
          endTime: new Date(0),
          exercises: [],
          notes: '',
          rating: 0,
        };
        set((state) => ({
          sessions: [...state.sessions, newSession],
        }));
        return sessionId;
      },

      completeWorkoutSession: (sessionId, notes, rating) => {
        set((state) => ({
          sessions: state.sessions.map((session) =>
            session.id === sessionId
              ? {
                  ...session,
                  endTime: new Date(),
                  notes,
                  rating,
                }
              : session
          ),
        }));

        // Update workout completion stats
        const session = get().sessions.find((s) => s.id === sessionId);
        if (session) {
          const workout = get().workouts.find((w) => w.id === session.workoutId);
          if (workout) {
            set((state) => ({
              workouts: state.workouts.map((w) =>
                w.id === workout.id
                  ? {
                      ...w,
                      timesCompleted: w.timesCompleted + 1,
                      lastCompleted: new Date(),
                    }
                  : w
              ),
            }));
          }
        }
      },

      updateWorkoutSession: (sessionId, updates) => {
        set((state) => ({
          sessions: state.sessions.map((session) =>
            session.id === sessionId
              ? { ...session, ...updates }
              : session
          ),
        }));
      },

      getWorkoutSessions: (workoutId) => {
        const sessions = get().sessions;
        if (workoutId) {
          return sessions.filter((session) => session.workoutId === workoutId);
        }
        return sessions;
      },

      getWorkoutHistory: (workoutId) => {
        return get()
          .sessions.filter((session) => session.workoutId === workoutId && session.endTime)
          .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
      },
    }),
    {
      name: 'workout-store',
      version: 1,
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
      migrate: (persistedState: unknown) => {
        if (!isRecord(persistedState)) return persistedState;
        const rawWorkouts = Array.isArray(persistedState.workouts)
          ? persistedState.workouts
          : [];
        const normalizedWorkouts = rawWorkouts.map((workoutItem) => {
          if (!isRecord(workoutItem)) {
            return workoutItem as Workout;
          }

          const workout = workoutItem as Partial<Workout> & Record<string, unknown>;
          return {
            ...workout,
            name: normalizeText(workout.name) || workout.name,
            description: normalizeText(workout.description),
            tags: Array.isArray(workout.tags)
              ? workout.tags.map((tag: string) => normalizeText(tag) || tag)
              : workout.tags,
            exerciseIds: uniqueIds(Array.isArray(workout.exerciseIds) ? workout.exerciseIds : []),
            exercises: [],
          } as Workout;
        });

        return {
          ...persistedState,
          workouts: normalizedWorkouts,
        };
      },
    }
  )
);


