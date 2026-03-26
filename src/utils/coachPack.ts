import { useExerciseStore } from '../store/exerciseStore';
import { useWorkoutStore } from '../store/workoutStore';
import { useWeeklyPlanStore } from '../store/weeklyPlanStore';

type ImportResult = {
  added: number;
  updated: number;
  skipped: number;
};

export type CoachPackImportResult = {
  exercises: ImportResult;
  workouts: ImportResult;
  weeklyPlans: ImportResult;
};

export const exportCoachPackJson = (): string => {
  const exercisePayload = JSON.parse(
    useExerciseStore.getState().exportExercisesJson(),
  );

  const exercises = Array.isArray(exercisePayload?.exercises)
    ? exercisePayload.exercises
    : [];

  const workouts = useWorkoutStore.getState().workouts.map(workout => ({
    id: workout.id,
    name: workout.name,
    description: workout.description,
    muscleGroupIds: workout.muscleGroupIds,
    exerciseIds: workout.exerciseIds,
    estimatedDuration: workout.estimatedDuration,
    difficulty: workout.difficulty,
    tags: workout.tags,
    createdAt: workout.createdAt?.toISOString?.() || new Date().toISOString(),
    updatedAt: workout.updatedAt?.toISOString?.() || new Date().toISOString(),
  }));

  const weeklyPlans = useWeeklyPlanStore.getState().weeklyPlans.map(plan => ({
    id: plan.id,
    name: plan.name,
    description: plan.description,
    days: (plan.days || []).map(day => ({
      day: day.day,
      workoutId: day.workoutId ?? null,
      notes: day.notes,
    })),
    startDate: plan.startDate?.toISOString?.(),
    endDate: plan.endDate?.toISOString?.(),
    workoutSplitId: plan.workoutSplitId,
    currentWeek: plan.currentWeek,
    totalWeeks: plan.totalWeeks,
    isActive: plan.isActive,
    isTemplate: plan.isTemplate,
    createdAt: plan.createdAt?.toISOString?.() || new Date().toISOString(),
    updatedAt: plan.updatedAt?.toISOString?.() || new Date().toISOString(),
  }));

  return JSON.stringify(
    {
      version: 1,
      exportedAt: new Date().toISOString(),
      exercises,
      workouts,
      weeklyPlans,
    },
    null,
    2,
  );
};

export const importCoachPackJson = (json: string): CoachPackImportResult => {
  let payload: any;
  try {
    payload = JSON.parse(json);
  } catch {
    return {
      exercises: { added: 0, updated: 0, skipped: 0 },
      workouts: { added: 0, updated: 0, skipped: 0 },
      weeklyPlans: { added: 0, updated: 0, skipped: 0 },
    };
  }

  const exercisesPayload = {
    exercises: Array.isArray(payload?.exercises) ? payload.exercises : [],
  };

  const exerciseResult = useExerciseStore
    .getState()
    .importExercisesFromJson(JSON.stringify(exercisesPayload));

  const workoutResult = useWorkoutStore
    .getState()
    .importWorkoutsFromData(payload?.workouts);

  const weeklyPlanResult = useWeeklyPlanStore
    .getState()
    .importWeeklyPlansFromData(payload?.weeklyPlans);

  return {
    exercises: exerciseResult,
    workouts: workoutResult,
    weeklyPlans: weeklyPlanResult,
  };
};
