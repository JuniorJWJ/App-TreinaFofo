import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WorkoutSplit, WorkoutSplitFormData } from '../types';

interface WorkoutSplitState {
  workoutSplits: WorkoutSplit[];
  activeSplitId: string | null;
  isLoading: boolean;
  
  // Actions
  setActiveSplit: (id: string | null) => void;
  addWorkoutSplit: (splitData: WorkoutSplitFormData) => void;
  updateWorkoutSplit: (id: string, updates: Partial<WorkoutSplit>) => void;
  deleteWorkoutSplit: (id: string) => void;
  getWorkoutSplit: (id: string) => WorkoutSplit | undefined;
  getActiveSplit: () => WorkoutSplit | undefined;
  getWorkoutSplits: () => WorkoutSplit[];
  duplicateWorkoutSplit: (id: string) => void;
  incrementCycle: (id: string) => void;
}

export const useWorkoutSplitStore = create<WorkoutSplitState>()(
  persist(
    (set, get) => ({
      workoutSplits: [],
      activeSplitId: null,
      isLoading: false,

      setActiveSplit: (id) => set({ activeSplitId: id }),

      addWorkoutSplit: (splitData) => {
        const newSplit: WorkoutSplit = {
          ...splitData,
          id: `ws-${Date.now()}`,
          timesCompleted: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set((state) => ({
          workoutSplits: [...state.workoutSplits, newSplit],
        }));
      },

      updateWorkoutSplit: (id, updates) => {
        set((state) => ({
          workoutSplits: state.workoutSplits.map((split) =>
            split.id === id
              ? { ...split, ...updates, updatedAt: new Date() }
              : split
          ),
        }));
      },

      deleteWorkoutSplit: (id) => {
        set((state) => ({
          workoutSplits: state.workoutSplits.filter((split) => split.id !== id),
          activeSplitId: get().activeSplitId === id ? null : get().activeSplitId,
        }));
      },

      getWorkoutSplit: (id) => {
        return get().workoutSplits.find((split) => split.id === id);
      },

      getActiveSplit: () => {
        const { activeSplitId, workoutSplits } = get();
        return workoutSplits.find((split) => split.id === activeSplitId);
      },

      getWorkoutSplits: () => {
        return get().workoutSplits;
      },

      duplicateWorkoutSplit: (id) => {
        const split = get().workoutSplits.find((s) => s.id === id);
        if (split) {
          const duplicatedSplit: WorkoutSplit = {
            ...split,
            id: `ws-${Date.now()}`,
            name: `${split.name} (Copy)`,
            timesCompleted: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          set((state) => ({
            workoutSplits: [...state.workoutSplits, duplicatedSplit],
          }));
        }
      },

      incrementCycle: (id) => {
        const split = get().workoutSplits.find((s) => s.id === id);
        if (split) {
          set((state) => ({
            workoutSplits: state.workoutSplits.map((s) =>
              s.id === id
                ? {
                    ...s,
                    timesCompleted: s.timesCompleted + 1,
                    updatedAt: new Date(),
                  }
                : s
            ),
          }));
        }
      },
    }),
    {
      name: 'workout-split-store',
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