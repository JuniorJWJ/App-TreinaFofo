import { useCallback } from 'react';
import { useMuscleGroupStore } from '../store';

export const useMuscleGroupUtils = () => {
  const { muscleGroups } = useMuscleGroupStore();

  const getMuscleGroupName = useCallback((muscleGroupId: string): string => {
    if (!muscleGroups || muscleGroups.length === 0) return 'Desconhecido';

    const group = muscleGroups.find(g =>
      g.id === muscleGroupId ||
      g.name.toLowerCase() === muscleGroupId.toLowerCase()
    );

    return group ? group.name : 'Desconhecido';
  }, [muscleGroups]);

  const getMuscleGroupColor = useCallback((muscleGroupId: string): string => {
    if (!muscleGroups || muscleGroups.length === 0) return '#CCCCCC';

    const group = muscleGroups.find(g =>
      g.id === muscleGroupId ||
      g.name.toLowerCase() === muscleGroupId.toLowerCase()
    );

    return group?.color ?? '#CCCCCC';
  }, [muscleGroups]);

  return {
    getMuscleGroupName,
    getMuscleGroupColor,
  };
};
