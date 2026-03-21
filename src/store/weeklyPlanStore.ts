import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  WeeklyPlan,
  WeeklyPlanFormData,
  DailyWorkout,
  DayOfWeek,
} from '../types';

interface WeeklyPlanState {
  weeklyPlans: WeeklyPlan[];
  activePlanId: string | null;
  isLoading: boolean;

  // Actions
  setActivePlan: (id: string | null) => void;
  addWeeklyPlan: (planData: WeeklyPlanFormData) => string;
  updateWeeklyPlan: (id: string, updates: Partial<WeeklyPlan>) => void;
  deleteWeeklyPlan: (id: string) => void;
  getWeeklyPlan: (id: string) => WeeklyPlan | undefined;
  getActivePlan: () => WeeklyPlan | undefined;
  getWeeklyPlans: () => WeeklyPlan[];

  // Daily Workout Management
  completeDailyWorkout: (planId: string, day: DayOfWeek) => void;
  uncompleteDailyWorkout: (planId: string, day: DayOfWeek) => void;
  updateDailyWorkoutNotes: (
    planId: string,
    day: DayOfWeek,
    notes: string,
  ) => void;
  updateDailyWorkout: (
    planId: string,
    day: DayOfWeek,
    workoutId: string | null,
  ) => void;
  getTodaysWorkout: (planId: string) => DailyWorkout | undefined;
  getWeeklyProgress: (planId: string) => {
    completed: number;
    total: number;
    rate: number;
  };

  // Template Management
  createWeeklyPlanFromTemplate: (
    template: Omit<WeeklyPlan, 'id' | 'createdAt' | 'updatedAt'>,
  ) => string;
  getTodaysPlan: () => WeeklyPlan | undefined;
}

export const useWeeklyPlanStore = create<WeeklyPlanState>()(
  persist(
    (set, get) => ({
      weeklyPlans: [],
      activePlanId: null,
      isLoading: false,

      setActivePlan: id => {
        set({ activePlanId: id });
      },

      addWeeklyPlan: planData => {
        const newPlan: WeeklyPlan = {
          ...planData,
          id: `wp-${Date.now()}`,
          currentWeek: planData.currentWeek ?? 1,
          completedDays: planData.completedDays ?? 0,
          completionRate: planData.completionRate ?? 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set(state => ({
          weeklyPlans: [...state.weeklyPlans, newPlan],
        }));
        return newPlan.id;
      },

      updateWeeklyPlan: (id, updates) => {
        set(state => ({
          weeklyPlans: state.weeklyPlans.map(plan =>
            plan.id === id
              ? { ...plan, ...updates, updatedAt: new Date() }
              : plan,
          ),
        }));
      },

      deleteWeeklyPlan: id => {
        set(state => ({
          weeklyPlans: state.weeklyPlans.filter(plan => plan.id !== id),
          activePlanId: get().activePlanId === id ? null : get().activePlanId,
        }));
      },

      getWeeklyPlan: id => {
        return get().weeklyPlans.find(plan => plan.id === id);
      },

      getActivePlan: () => {
        const { activePlanId, weeklyPlans } = get();
        return weeklyPlans.find(plan => plan.id === activePlanId);
      },

      getWeeklyPlans: () => {
        return get().weeklyPlans;
      },

      completeDailyWorkout: (planId, day) => {
        set(state => ({
          weeklyPlans: state.weeklyPlans.map(plan => {
            if (plan.id !== planId) return plan;
            const updatedDays = plan.days.map(d =>
              d.day === day
                ? { ...d, isCompleted: true, completedAt: new Date() }
                : d,
            );
            const completedDays = updatedDays.filter(d => d.isCompleted).length;
            const completionRate = (completedDays / updatedDays.length) * 100;
            return {
              ...plan,
              days: updatedDays,
              completedDays,
              completionRate,
              updatedAt: new Date(),
            };
          }),
        }));
      },

      uncompleteDailyWorkout: (planId, day) => {
        set(state => ({
          weeklyPlans: state.weeklyPlans.map(plan => {
            if (plan.id !== planId) return plan;
            const updatedDays = plan.days.map(d =>
              d.day === day
                ? { ...d, isCompleted: false, completedAt: undefined }
                : d,
            );
            const completedDays = updatedDays.filter(d => d.isCompleted).length;
            const completionRate = (completedDays / updatedDays.length) * 100;
            return {
              ...plan,
              days: updatedDays,
              completedDays,
              completionRate,
              updatedAt: new Date(),
            };
          }),
        }));
      },

      updateDailyWorkoutNotes: (planId, day, notes) => {
        set(state => ({
          weeklyPlans: state.weeklyPlans.map(plan => {
            if (plan.id !== planId) return plan;
            const updatedDays = plan.days.map(d =>
              d.day === day ? { ...d, notes } : d,
            );
            return { ...plan, days: updatedDays, updatedAt: new Date() };
          }),
        }));
      },

      updateDailyWorkout: (planId, day, workoutId) => {
        set(state => ({
          weeklyPlans: state.weeklyPlans.map(plan => {
            if (plan.id !== planId) return plan;
            const updatedDays = plan.days.map(d =>
              d.day === day ? { ...d, workoutId } : d,
            );
            return { ...plan, days: updatedDays, updatedAt: new Date() };
          }),
        }));
      },

      getTodaysWorkout: planId => {
        const plan = get().weeklyPlans.find(p => p.id === planId);
        if (!plan) return undefined;
        const today = new Date()
          .toLocaleString('en-us', { weekday: 'long' })
          .toLowerCase() as DayOfWeek;
        return plan.days.find(d => d.day === today);
      },

      getWeeklyProgress: planId => {
        const plan = get().weeklyPlans.find(p => p.id === planId);
        if (!plan) return { completed: 0, total: 0, rate: 0 };
        const completed = plan.days.filter(d => d.isCompleted).length;
        const total = plan.days.length;
        const rate = total > 0 ? (completed / total) * 100 : 0;
        return { completed, total, rate };
      },

      createWeeklyPlanFromTemplate: templateData => {
        const newPlan: WeeklyPlan = {
          ...templateData,
          id: `wp-${Date.now()}`,
          currentWeek: templateData.currentWeek ?? 1,
          completedDays: templateData.completedDays ?? 0,
          completionRate: templateData.completionRate ?? 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set(state => ({
          weeklyPlans: [...state.weeklyPlans, newPlan],
        }));
        return newPlan.id;
      },

      getTodaysPlan: () => {
        const { activePlanId, weeklyPlans } = get();
        if (!activePlanId) return undefined;
        return weeklyPlans.find(plan => plan.id === activePlanId);
      },
    }),
    {
      name: 'weekly-plan-store',
      storage: {
        getItem: async name => {
          const value = await AsyncStorage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: async (name, value) => {
          await AsyncStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: async name => {
          await AsyncStorage.removeItem(name);
        },
      },
    },
  ),
);
