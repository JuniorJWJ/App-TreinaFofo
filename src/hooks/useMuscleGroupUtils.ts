import { useCallback } from 'react';
import { useMuscleGroupStore } from '../store';

export const useMuscleGroupUtils = () => {
  const { muscleGroups } = useMuscleGroupStore();

  const normalize = (value: string) => value.trim().toLowerCase();

  const getMuscleGroupName = useCallback((muscleGroupId: string): string => {
    if (!muscleGroups || muscleGroups.length === 0) return 'Desconhecido';

    const group = muscleGroups.find(g =>
      g.id === muscleGroupId ||
      normalize(g.name) === normalize(muscleGroupId)
    );

    return group ? group.name : 'Desconhecido';
  }, [muscleGroups]);

  const getMuscleGroupColor = useCallback((muscleGroupId: string): string => {
    if (!muscleGroups || muscleGroups.length === 0) return '#CCCCCC';

    const group = muscleGroups.find(g =>
      g.id === muscleGroupId ||
      normalize(g.name) === normalize(muscleGroupId)
    );

    return group?.color ?? '#CCCCCC';
  }, [muscleGroups]);

  return {
    getMuscleGroupName,
    getMuscleGroupColor,
  };
};
