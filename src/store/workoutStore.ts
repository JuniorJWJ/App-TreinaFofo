import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Workout, WorkoutFormData, WorkoutSession } from '../types';

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

  // Session Management
  startWorkoutSession: (workoutId: string) => string;
  completeWorkoutSession: (sessionId: string, notes?: string, rating?: number) => void;
  updateWorkoutSession: (sessionId: string, updates: Partial<WorkoutSession>) => void;
  getWorkoutSessions: (workoutId?: string) => WorkoutSession[];
  getWorkoutHistory: (workoutId: string) => WorkoutSession[];
}

export const useWorkoutStore = create<WorkoutState>()(
  persist(
    (set, get) => ({
      workouts: [],
      sessions: [],
      // activeWorkoutId: null,
      isLoading: false,

      // 🔄 **ALTERAÇÕES FEITAS:**

      // 1. NOVO: Definir treino ativo
      // setActiveWorkout: (workoutId) => {
      //   console.log('Definindo treino ativo:', workoutId);
      //   set({ activeWorkoutId: workoutId });
      // },

      // 2. NOVO: Obter treino ativo
      // getActiveWorkout: () => {
      //   const { activeWorkoutId, workouts } = get();
      //   const activeWorkout = workouts.find(workout => workout.id === activeWorkoutId);
      //   console.log('Treino ativo encontrado:', activeWorkout?.name);
      //   return activeWorkout;
      // },

      // 3. NOVO: Criar treino rápido
      createQuickWorkout: (name, exerciseIds) => {
        console.log('Criando treino rápido:', name, 'com', exerciseIds.length, 'exercícios');
        
        const newWorkout: Workout = {
          id: `wr-${Date.now()}`,
          name,
          description: '',
          muscleGroupIds: [],
          exerciseIds,
          exercises: [],
          estimatedDuration: exerciseIds.length * 10, // 10 min por exercício
          difficulty: 'beginner',
          tags: ['rápido'],
          timesCompleted: 0,
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
        const newWorkout: Workout = {
          ...workoutData,
          id: `wr-${Date.now()}`,
          timesCompleted: 0,
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
              ? { ...workout, ...updates, updatedAt: new Date() }
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
            timesCompleted: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          set((state) => ({
            workouts: [...state.workouts, duplicatedWorkout],
          }));
        }
      },

      // Session Management (mantido)
      startWorkoutSession: (workoutId) => {
        const sessionId = `ws-${Date.now()}`;
        const newSession: WorkoutSession = {
          id: sessionId,
          workoutId,
          startTime: new Date(),
          exercises: [],
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