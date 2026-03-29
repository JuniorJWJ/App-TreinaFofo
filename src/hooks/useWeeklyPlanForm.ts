import { useState, useCallback, useEffect, useMemo } from 'react';
import { DayOfWeek, DailyWorkout, WeeklyPlan } from '../types';

export const useWeeklyPlanForm = (
  existingPlan: WeeklyPlan | null = null,
  _isEditing = false,
) => {
  const safePlan: Partial<WeeklyPlan> = useMemo(
    () => existingPlan || {},
    [existingPlan],
  );

  const [planName, setPlanName] = useState(safePlan.name || '');
  const [description, setDescription] = useState(safePlan.description || '');
  const [isFormValid, setIsFormValid] = useState(!!safePlan.name);
  const [isLoading, setIsLoading] = useState(false);

  const defaultDays: DailyWorkout[] = [
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
  ];

  const [days, setDays] = useState<DailyWorkout[]>(
    Array.isArray(safePlan.days) && safePlan.days.length > 0
      ? safePlan.days
      : defaultDays,
  );

  // Validacao do formulario
  useEffect(() => {
    const isValid = planName.trim() !== '';
    setIsFormValid(isValid);
  }, [planName]);

  const updateDayWorkout = useCallback(
    (day: DayOfWeek, workoutId: string | null) => {
      setDays(prevDays =>
        prevDays.map(d => (d.day === day ? { ...d, workoutId } : d)),
      );
    },
    [],
  );

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
