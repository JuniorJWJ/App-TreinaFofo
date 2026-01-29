import { useState, useCallback, useEffect } from 'react';
import { DayOfWeek, DailyWorkout } from '../types';

export const useWeeklyPlanForm = (existingPlan?: any) => {
  const [planName, setPlanName] = useState(existingPlan?.name || '');
  const [description, setDescription] = useState(existingPlan?.description || '');
  const [isFormValid, setIsFormValid] = useState(!!existingPlan?.name);
  const [isLoading, setIsLoading] = useState(false);
  
  const [days, setDays] = useState<DailyWorkout[]>(
    existingPlan?.days || [
      {
        day: 'monday',
        workoutId: null,
        isCompleted: false,
        completedAt: undefined,
        notes: '',
      },
      {
        day: 'tuesday',
        workoutId: null,
        isCompleted: false,
        completedAt: undefined,
        notes: '',
      },
      {
        day: 'wednesday',
        workoutId: null,
        isCompleted: false,
        completedAt: undefined,
        notes: '',
      },
      {
        day: 'thursday',
        workoutId: null,
        isCompleted: false,
        completedAt: undefined,
        notes: '',
      },
      {
        day: 'friday',
        workoutId: null,
        isCompleted: false,
        completedAt: undefined,
        notes: '',
      },
      {
        day: 'saturday',
        workoutId: null,
        isCompleted: false,
        completedAt: undefined,
        notes: '',
      },
      {
        day: 'sunday',
        workoutId: null,
        isCompleted: false,
        completedAt: undefined,
        notes: '',
      },
    ],
  );

  // Validação do formulário
  useEffect(() => {
    const isValid = planName.trim() !== '';
    setIsFormValid(isValid);
  }, [planName]);

  const updateDayWorkout = useCallback((day: DayOfWeek, workoutId: string | null) => {
    setDays(prevDays =>
      prevDays.map(d => (d.day === day ? { ...d, workoutId } : d)),
    );
  }, []);

  return {
    planName,
    setPlanName,
    description,
    setDescription,
    isFormValid,
    setIsFormValid,
    isLoading,
    setIsLoading,
    days,
    setDays,
    updateDayWorkout,
  };
};