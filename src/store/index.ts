// Barrel export para todas as stores
export { useMuscleGroupStore } from './muscleGroupStore';
export { useExerciseStore } from './exerciseStore';
export { useWorkoutStore } from './workoutStore';
export { useWorkoutSplitStore } from './workoutSplitStore';
export { useWeeklyPlanStore } from './weeklyPlanStore';

// Hook customizado para usar múltiplas stores
import { useMuscleGroupStore } from './muscleGroupStore';
import { useExerciseStore } from './exerciseStore';
import { useWorkoutStore } from './workoutStore';
import { useWorkoutSplitStore } from './workoutSplitStore';
import { useWeeklyPlanStore } from './weeklyPlanStore';

export const useAppStore = () => {
  const muscleGroups = useMuscleGroupStore();
  const exercises = useExerciseStore();
  const workouts = useWorkoutStore();
  const workoutSplits = useWorkoutSplitStore();
  const weeklyPlans = useWeeklyPlanStore();

  return {
    ...muscleGroups,
    ...exercises,
    ...workouts,
    ...workoutSplits,
    ...weeklyPlans,
  };
};