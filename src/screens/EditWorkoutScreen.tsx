import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { useWorkoutStore } from '../store';
import { useExerciseStore } from '../store';
import { Text } from '../components/atoms/Text';
import { Input } from '../components/atoms/Input';
import { Button } from '../components/atoms/Button';

interface EditWorkoutScreenProps {
  navigation: any;
  route: any;
}

export const EditWorkoutScreen: React.FC<EditWorkoutScreenProps> = ({ navigation, route }) => {
  const { workoutId } = route.params || {};
  const { workouts, updateWorkout } = useWorkoutStore();
  const { exercises } = useExerciseStore();
  
  const [workoutName, setWorkoutName] = useState('');
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Carrega os dados do treino
  useEffect(() => {
    if (workoutId) {
      const workout = workouts.find(w => w.id === workoutId);
      if (workout) {
        setWorkoutName(workout.name);
        setSelectedExercises(workout.exerciseIds || []);
      }
    }
    setIsLoading(false);
  }, [workoutId, workouts]);

  const handleSaveWorkout = () => {
    if (!workoutName.trim()) {
      Alert.alert('Atenção', 'Digite um nome para o treino');
      return;
    }

    if (selectedExercises.length === 0) {
      Alert.alert('Atenção', 'Selecione pelo menos um exercício');
      return;
    }

    updateWorkout(workoutId, {
      name: workoutName.trim(),
      exerciseIds: selectedExercises,
    });
    
    Alert.alert('Sucesso', 'Treino atualizado com sucesso!', [
      { 
        text: 'OK', 
        onPress: () => navigation.goBack()
      }
    ]);
  };

  const toggleExerciseSelection = (exerciseId: string) => {
    setSelectedExercises(prev =>
      prev.includes(exerciseId)
        ? prev.filter(id => id !== exerciseId)
        : [...prev, exerciseId]
    );
  };

  const isExerciseSelected = (exerciseId: string) => {
    return selectedExercises.includes(exerciseId);
  };

  const handleSelectAll = () => {
    const allExerciseIds = exercises.map(ex => ex.id);
    setSelectedExercises(allExerciseIds);
  };

  const handleClearAll = () => {
    setSelectedExercises([]);
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  const workout = workouts.find(w => w.id === workoutId);
  if (!workout) {
    return (
      <View style={styles.container}>
        <Text variant="title" style={styles.errorText}>Treino não encontrado</Text>
        <Button
          title="Voltar"
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text variant="title" align="center" style={styles.title}>
          Editar Treino
        </Text>

        <View style={styles.workoutInfo}>
          <Text variant="caption" style={styles.originalName}>
            Editando: {workout.name}
          </Text>
          <Text variant="caption">
            Criado em: {new Date(workout.createdAt).toLocaleDateString('pt-BR')}
            {workout.updatedAt && ` • Atualizado: ${new Date(workout.updatedAt).toLocaleDateString('pt-BR')}`}
          </Text>
        </View>

        <Input
          placeholder="Nome do treino"
          value={workoutName}
          onChangeText={setWorkoutName}
          style={styles.input}
        />

        <View style={styles.selectionHeader}>
          <Text variant="subtitle" style={styles.sectionTitle}>
            Exercícios ({selectedExercises.length})
          </Text>
          <View style={styles.selectionButtons}>
            <TouchableOpacity onPress={handleSelectAll} style={styles.selectionButton}>
              <Text style={styles.selectionButtonText}>Selecionar Todos</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleClearAll} style={styles.selectionButton}>
              <Text style={styles.selectionButtonText}>Limpar</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.exercisesContainer}>
          {exercises.map(exercise => {
            const isSelected = isExerciseSelected(exercise.id);
            return (
              <TouchableOpacity
                key={exercise.id}
                style={[
                  styles.exerciseCard,
                  isSelected ? styles.exerciseCardSelected : styles.exerciseCardUnselected
                ]}
                onPress={() => toggleExerciseSelection(exercise.id)}
              >
                <View style={styles.exerciseCardContent}>
                  <View style={styles.exerciseInfo}>
                    <Text style={[
                      styles.exerciseName,
                      isSelected && styles.exerciseNameSelected
                    ]}>
                      {exercise.name}
                    </Text>
                    <Text style={styles.exerciseDetails}>
                      {exercise.defaultSets} × {exercise.defaultReps} • {exercise.defaultRestTime}s
                    </Text>
                  </View>
                  <View style={[
                    styles.selectionIndicator,
                    isSelected && styles.selectionIndicatorSelected
                  ]}>
                    {isSelected && (
                      <Text style={styles.checkmark}>✓</Text>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.selectedInfo}>
          <Text variant="caption" style={styles.selectedCount}>
            {selectedExercises.length} exercício{selectedExercises.length !== 1 ? 's' : ''} selecionado{selectedExercises.length !== 1 ? 's' : ''}
          </Text>
          {selectedExercises.length === 0 && (
            <Text variant="caption" style={styles.warningText}>
              Selecione pelo menos um exercício
            </Text>
          )}
        </View>
        
        <View style={styles.buttonsContainer}>
          <Button
            title="Cancelar"
            onPress={() => navigation.goBack()}
            style={[styles.button, styles.cancelButton]}
          />
          <Button
            title="Salvar Alterações"
            onPress={handleSaveWorkout}
            style={[styles.button, styles.saveButton]}
            disabled={!workoutName.trim() || selectedExercises.length === 0}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e0b9a2ff',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 120, // Espaço para o footer
  },
  title: {
    marginBottom: 20,
  },
  workoutInfo: {
    backgroundColor: '#FFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  originalName: {
    fontWeight: '600',
    marginBottom: 4,
    color: '#d15710ff',
  },
  input: {
    marginBottom: 20,
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
    color: '#333',
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
    borderColor: '#d15710ff',
  },
  selectionButtonText: {
    color: '#d15710ff',
    fontSize: 12,
    fontWeight: '500',
  },
  exercisesContainer: {
    marginBottom: 20,
  },
  exerciseCard: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    overflow: 'hidden',
  },
  exerciseCardSelected: {
    borderColor: '#d15710ff',
    borderWidth: 2,
    backgroundColor: '#FFF5F0',
  },
  exerciseCardUnselected: {
    borderColor: '#E0E0E0',
  },
  exerciseCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontWeight: '500',
    marginBottom: 2,
    color: '#333',
  },
  exerciseNameSelected: {
    color: '#d15710ff',
  },
  exerciseDetails: {
    fontSize: 12,
    color: '#666',
  },
  selectionIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectionIndicatorSelected: {
    backgroundColor: '#d15710ff',
    borderColor: '#d15710ff',
  },
  checkmark: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  selectedInfo: {
    alignItems: 'center',
    marginBottom: 16,
  },
  selectedCount: {
    fontWeight: '600',
    color: '#333',
  },
  warningText: {
    color: '#DC3545',
    fontStyle: 'italic',
    marginTop: 4,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  button: {
    flex: 1,
  },
  cancelButton: {
    backgroundColor: '#6C757D',
  },
  saveButton: {
    backgroundColor: '#d15710ff',
  },
  errorText: {
    color: '#DC3545',
    marginBottom: 20,
    textAlign: 'center',
  },
  backButton: {
    marginTop: 20,
    backgroundColor: '#d15710ff',
  },
});

export default EditWorkoutScreen;