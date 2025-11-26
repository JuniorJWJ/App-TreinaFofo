import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MuscleGroup, DEFAULT_MUSCLE_GROUPS } from '../types';

interface MuscleGroupState {
  muscleGroups: MuscleGroup[];
  isLoading: boolean;
  
  // Actions
  initializeDefaultGroups: () => void;
  addMuscleGroup: (name: string, color?: string) => void;
  updateMuscleGroup: (id: string, updates: Partial<MuscleGroup>) => void;
  deleteMuscleGroup: (id: string) => void;
  getMuscleGroup: (id: string) => MuscleGroup | undefined;
  getMuscleGroups: () => MuscleGroup[];
}

export const useMuscleGroupStore = create<MuscleGroupState>()(
  persist(
    (set, get) => ({
      muscleGroups: [],
      isLoading: false,

    initializeDefaultGroups: () => {
    const { muscleGroups } = get();
    console.log('MuscleGroupStore: Grupos atuais:', muscleGroups.length);
    
    if (muscleGroups.length === 0) {
        console.log('MuscleGroupStore: Criando grupos padrão');
        const defaultGroups: MuscleGroup[] = DEFAULT_MUSCLE_GROUPS.map((group, index) => ({
        ...group,
        id: `mg-${index + 1}`,
        createdAt: new Date(),
        updatedAt: new Date(),
        }));
        set({ muscleGroups: defaultGroups });
        console.log('MuscleGroupStore: Grupos criados:', defaultGroups.length);
    }
    },

      addMuscleGroup: (name, color) => {
        const newGroup: MuscleGroup = {
          id: `mg-${Date.now()}`,
          name,
          color,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set((state) => ({
          muscleGroups: [...state.muscleGroups, newGroup],
        }));
      },

      updateMuscleGroup: (id, updates) => {
        set((state) => ({
          muscleGroups: state.muscleGroups.map((group) =>
            group.id === id
              ? { ...group, ...updates, updatedAt: new Date() }
              : group
          ),
        }));
      },

      deleteMuscleGroup: (id) => {
        set((state) => ({
          muscleGroups: state.muscleGroups.filter((group) => group.id !== id),
        }));
      },

      getMuscleGroup: (id) => {
        return get().muscleGroups.find((group) => group.id === id);
      },

      getMuscleGroups: () => {
        return get().muscleGroups;
      },
    }),
    {
      name: 'muscle-group-store',
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