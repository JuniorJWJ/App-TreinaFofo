// src/hooks/useExerciseList.ts
import { useState, useMemo, useCallback } from 'react';
import { useExerciseStore, useMuscleGroupStore } from '../store';

export const useExerciseList = () => {
  const { exercises, deleteExercise } = useExerciseStore();
  const { muscleGroups } = useMuscleGroupStore();
  const [search, setSearch] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

  // Função para obter nome do grupo muscular
  const getMuscleGroupName = useCallback((muscleGroupId: string): string => {
    if (!muscleGroups || muscleGroups.length === 0) return 'Desconhecido';
    
    const group = muscleGroups.find(g => {
      if (g.id === muscleGroupId) return true;
      if (g.name.toLowerCase() === muscleGroupId.toLowerCase()) return true;
      return false;
    });
    
    return group ? group.name : 'Desconhecido';
  }, [muscleGroups]);

  // Função para obter cor do grupo muscular
  const getMuscleGroupColor = (muscleGroupId: string): string => {
    if (!muscleGroups || muscleGroups.length === 0) return '#CCCCCC';
    
    const group = muscleGroups.find(g => {
      if (g.id === muscleGroupId) return true;
      if (g.name.toLowerCase() === muscleGroupId.toLowerCase()) return true;
      return false;
    });
    
    return group ? group.color || '#CCCCCC' : '#CCCCCC';
  };

  // Filtra exercícios por busca e grupo selecionado
  const filteredExercises = useMemo(() => {
    return exercises.filter(exercise => {
      const matchesSearch = search === '' || 
        exercise.name.toLowerCase().includes(search.toLowerCase());
      
      const matchesGroup = !selectedGroup || 
        getMuscleGroupName(exercise.muscleGroupId) === selectedGroup;
      
      return matchesSearch && matchesGroup;
    });
  }, [exercises, search, selectedGroup, getMuscleGroupName]);

  // Ordena exercícios por grupo muscular e depois por nome
  const sortedExercises = useMemo(() => {
    return [...filteredExercises].sort((a, b) => {
      const groupA = getMuscleGroupName(a.muscleGroupId);
      const groupB = getMuscleGroupName(b.muscleGroupId);
      
      if (groupA < groupB) return -1;
      if (groupA > groupB) return 1;
      
      return a.name.localeCompare(b.name);
    });
  }, [filteredExercises, getMuscleGroupName]);

  // Obtém lista de grupos únicos para filtro
  const uniqueGroups = useMemo(() => {
    const groups = new Set(exercises.map(ex => getMuscleGroupName(ex.muscleGroupId)));
    return Array.from(groups).sort();
  }, [exercises, getMuscleGroupName]);

  return {
    exercises: sortedExercises,
    uniqueGroups,
    search,
    setSearch,
    selectedGroup,
    setSelectedGroup,
    getMuscleGroupName,
    getMuscleGroupColor,
    deleteExercise,
  };
};