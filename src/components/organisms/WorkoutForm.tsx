// src/components/organisms/WorkoutForm.tsx
import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text } from '../atoms/Text';
import { Input } from '../atoms/Input';
import { ExerciseSearchBar } from '../molecules/ExerciseSearchBar';
import { MuscleGroupFilterChips } from '../molecules/MuscleGroupFilterChips';
import { WorkoutExerciseCard } from '../molecules/WorkoutExerciseCard'; 
import { useExerciseList } from '../../hooks/useExerciseList'; 
import { FloatingActionButtonWithIcon } from '../molecules/FloatingActionButtonWithIcon';


interface WorkoutFormProps {
  mode: 'create' | 'edit';
  initialWorkoutName?: string;
  initialSelectedExercises?: string[];
  exercises: Array<{
    id: string;
    name: string;
    muscleGroupId: string;
    defaultSets: number;
    defaultReps: number;
    defaultRestTime: number;
  }>;
  onSubmit: (workoutName: string, selectedExercises: string[]) => void;
  onCancel: () => void;
  isLoading?: boolean;
  workoutInfo?: {
    createdAt?: Date;
    updatedAt?: Date;
  };
  submitButtonText?: string;
  cancelButtonText?: string;
}

export const WorkoutForm: React.FC<WorkoutFormProps> = ({
  mode,
  initialWorkoutName = '',
  initialSelectedExercises = [],
  exercises,
  onSubmit,
  // onCancel,
}) => {
  const [workoutName, setWorkoutName] = useState(initialWorkoutName);
  const [selectedExercises, setSelectedExercises] = useState<string[]>(initialSelectedExercises);
  
  // Use refs para controlar atualizações iniciais
  const isInitialMount = useRef(true);
  const prevInitialWorkoutName = useRef(initialWorkoutName);
  const prevInitialSelectedExercises = useRef(initialSelectedExercises);

  // Usa o hook useExerciseList com os exercícios customizados
  const {
    exercises: filteredExercises,
    uniqueGroups,
    search,
    setSearch,
    selectedGroup,
    setSelectedGroup,
    getMuscleGroupName,
    getMuscleGroupColor,
  } = useExerciseList({
    customExercises: exercises
  });

  // Atualiza os estados apenas quando os valores iniciais mudam DE VERDADE
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      // Só atualiza se os valores realmente mudaram
      if (prevInitialWorkoutName.current !== initialWorkoutName) {
        setWorkoutName(initialWorkoutName);
        prevInitialWorkoutName.current = initialWorkoutName;
      }
      
      if (JSON.stringify(prevInitialSelectedExercises.current) !== JSON.stringify(initialSelectedExercises)) {
        setSelectedExercises(initialSelectedExercises);
        prevInitialSelectedExercises.current = initialSelectedExercises;
      }
    }
  }, [initialWorkoutName, initialSelectedExercises]);

  const handleSubmit = () => {
    onSubmit(workoutName.trim(), selectedExercises);
  };

  const toggleExerciseSelection = (exerciseId: string) => {
    setSelectedExercises(prev => {
      const isSelected = prev.includes(exerciseId);
      if (isSelected) {
        return prev.filter(id => id !== exerciseId);
      } else {
        return [...prev, exerciseId];
      }
    });
  };

  const isExerciseSelected = (exerciseId: string) => {
    return selectedExercises.includes(exerciseId);
  };

  const handleSelectAll = () => {
    if (filteredExercises.length === 0) return;
    const allExerciseIds = filteredExercises.map(ex => ex.id);
    setSelectedExercises(prev => {
      // Adiciona apenas os que ainda não estão selecionados
      const newSelection = [...prev];
      allExerciseIds.forEach(id => {
        if (!newSelection.includes(id)) {
          newSelection.push(id);
        }
      });
      return newSelection;
    });
  };

  const handleClearAll = () => {
    if (filteredExercises.length === 0) return;
    // Remove apenas os exercícios que estão na lista filtrada
    setSelectedExercises(prev => 
      prev.filter(id => !filteredExercises.some(ex => ex.id === id))
    );
  };

  // const getTitle = () => {
  //   return mode === 'create' ? 'Criar Novo Treino' : 'Editar Treino';
  // };

  const handleClearFilters = () => {
    setSearch('');
    setSelectedGroup(null);
  };

  const isFormValid = workoutName.trim() && selectedExercises.length > 0;

  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header com título e botão de cancelar */}
      <View style={styles.header}>
        {/* <TouchableOpacity 
          style={styles.cancelButtonHeader} 
          onPress={onCancel}
          disabled={isLoading}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity> */}
        {/* <Text variant="title" align="center" style={styles.title}>
          {getTitle()}
        </Text> */}
        <View style={styles.headerSpacer} />
      </View>

        <Input
          placeholder="Nome do treino"
          value={workoutName}
          onChangeText={setWorkoutName}
          style={styles.input}
          autoFocus={mode === 'create'}
        />

        {/* Barra de busca */}
        <ExerciseSearchBar
          search={search}
          onSearchChange={setSearch}
          placeholder="Buscar exercícios..."
        />

        {/* Filtros de grupo muscular */}
        <MuscleGroupFilterChips
          groups={uniqueGroups}
          selectedGroup={selectedGroup}
          onSelectGroup={setSelectedGroup}
        />

        {/* Controles de seleção */}
        <View style={styles.selectionHeader}>
          <Text variant="subtitle" style={styles.sectionTitle}>
            Exercícios: {selectedExercises.length}/{filteredExercises.length}
          </Text>
          <View style={styles.selectionButtons}>
            <TouchableOpacity 
              onPress={handleSelectAll} 
              style={[
                styles.selectionButton,
                filteredExercises.length === 0 && styles.disabledButton
              ]}
              disabled={filteredExercises.length === 0}
            >
              <Text style={[
                styles.selectionButtonText,
                filteredExercises.length === 0 && styles.disabledText
              ]}>
                Selecionar Todos
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={handleClearAll} 
              style={[
                styles.selectionButton,
                (filteredExercises.length === 0 || 
                 !filteredExercises.some(ex => isExerciseSelected(ex.id))) && styles.disabledButton
              ]}
              disabled={filteredExercises.length === 0 || 
                !filteredExercises.some(ex => isExerciseSelected(ex.id))}
            >
              <Text style={[
                styles.selectionButtonText,
                (filteredExercises.length === 0 || 
                 !filteredExercises.some(ex => isExerciseSelected(ex.id))) && styles.disabledText
              ]}>
                Limpar Filtrados
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Indicador de validação
        <View style={styles.validationContainer}>
          <View style={styles.validationRow}>
            <View style={styles.validationItem}>
              <View style={[
                styles.validationIcon,
                workoutName.trim() ? styles.validationIconValid : styles.validationIconInvalid
              ]}>
                <Text style={styles.validationIconText}>
                  {workoutName.trim() ? "✓" : "✗"}
                </Text>
              </View>
              <Text style={styles.validationLabel}>Nome do treino</Text>
            </View>
            
            <View style={styles.validationItem}>
              <View style={[
                styles.validationIcon,
                selectedExercises.length > 0 ? styles.validationIconValid : styles.validationIconInvalid
              ]}>
                <Text style={styles.validationIconText}>
                  {selectedExercises.length > 0 ? "✓" : "✗"}
                </Text>
              </View> 
              <Text style={styles.validationLabel}>{selectedExercises.length} exercício(s)</Text>
            </View>
          </View>
        </View> */}

        {/* Lista de exercícios filtrados */}
        <View style={styles.exercisesContainer}>
          {filteredExercises.length === 0 ? (
            <View style={styles.emptyExercises}>
              <Text style={styles.emptyText}>
                {search || selectedGroup 
                  ? 'Nenhum exercício encontrado' 
                  : 'Nenhum exercício cadastrado'}
              </Text>
              <Text style={styles.emptySubtext}>
                {search || selectedGroup
                  ? 'Tente ajustar sua busca ou filtro'
                  : 'Crie exercícios primeiro para poder adicioná-los ao treino'}
              </Text>
              {(search || selectedGroup) && (
                <TouchableOpacity
                  onPress={handleClearFilters}
                  style={styles.clearFiltersButton}
                >
                  <Text style={styles.clearFiltersButtonText}>
                    Limpar Filtros
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            filteredExercises.map(exercise => (
              <WorkoutExerciseCard
                key={exercise.id}
                exercise={exercise}
                isSelected={isExerciseSelected(exercise.id)}
                muscleGroupName={getMuscleGroupName(exercise.muscleGroupId)}
                muscleGroupColor={getMuscleGroupColor(exercise.muscleGroupId)}
                onPress={() => toggleExerciseSelection(exercise.id)}
              />
            ))
          )}
        </View>
      </ScrollView>

      {/* Botão Flutuante usando a molécula */}
      <FloatingActionButtonWithIcon
        onPress={handleSubmit}
        disabled={!isFormValid}
        position='top-right'
        color="#FFF"
        size="medium" 
        iconName="save"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1b1613ff',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100, // Espaço para o FAB
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  cancelButtonHeader: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerSpacer: {
    width: 40,
  },
  title: {
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#FFF',
  },
  selectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    color: '#FFF',
    flex: 1,
  },
  selectionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  selectionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#FFF',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#483148',
  },
  disabledButton: {
    borderColor: '#999',
  },
  selectionButtonText: {
    color: '#483148',
    fontSize: 12,
    fontWeight: '500',
  },
  disabledText: {
    color: '#999',
  },
    backIcon: {
    fontSize: 24,
    color: '#999',
    fontWeight: 'bold',
  },
  validationIconText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  validationContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  validationRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  validationItem: {
    alignItems: 'center',
    flex: 1,
  },
  validationIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  validationIconValid: {
    backgroundColor: '#4CAF50',
  },
  validationIconInvalid: {
    backgroundColor: '#ff6b6b',
  },
  validationLabel: {
    color: '#a8a8a8',
    fontSize: 12,
    fontWeight: '500',
  },
  exercisesContainer: {
    marginBottom: 20,
  },
  emptyExercises: {
    backgroundColor: '#FFF',
    padding: 24,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
  },
  emptyText: {
    fontWeight: '600',
    marginBottom: 4,
    color: '#666',
  },
  emptySubtext: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginBottom: 16,
  },
  clearFiltersButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#483148',
    borderRadius: 6,
  },
  clearFiltersButtonText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '500',
  },
});