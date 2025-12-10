// components/organisms/WorkoutForm.tsx
import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text } from '../atoms/Text';
import { Input } from '../atoms/Input';
import { Button } from '../atoms/Button';

interface WorkoutFormProps {
  mode: 'create' | 'edit';
  initialWorkoutName?: string;
  initialSelectedExercises?: string[];
  exercises: Array<{
    id: string;
    name: string;
    defaultSets: number;
    defaultReps: number;
    defaultRestTime: number;
  }>;
  onSubmit: (workoutName: string, selectedExercises: string[]) => void;
  onCancel: () => void;
  isLoading?: boolean;
  workoutInfo?: {
    createdAt?: string;
    updatedAt?: string;
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
  onCancel,
  isLoading = false,
  workoutInfo,
  submitButtonText,
  cancelButtonText = 'Cancelar',
}) => {
  const [workoutName, setWorkoutName] = useState(initialWorkoutName);
  const [selectedExercises, setSelectedExercises] = useState<string[]>(initialSelectedExercises);
  
  // Use refs para controlar atualizações iniciais
  const isInitialMount = useRef(true);
  const prevInitialWorkoutName = useRef(initialWorkoutName);
  const prevInitialSelectedExercises = useRef(initialSelectedExercises);

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
    if (exercises.length === 0) return;
    const allExerciseIds = exercises.map(ex => ex.id);
    setSelectedExercises(allExerciseIds);
  };

  const handleClearAll = () => {
    setSelectedExercises([]);
  };

  const getSubmitButtonText = () => {
    if (submitButtonText) return submitButtonText;
    return mode === 'create' ? 'Criar Treino' : 'Salvar Alterações';
  };

  const getTitle = () => {
    return mode === 'create' ? 'Criar Novo Treino' : 'Editar Treino';
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text variant="title" align="center" style={styles.title}>
          {getTitle()}
        </Text>

        {mode === 'edit' && workoutInfo && (
          <View style={styles.workoutInfo}>
            <Text variant="caption" style={styles.originalName}>
              Editando: {initialWorkoutName}
            </Text>
            <Text variant="caption">
              Criado em: {workoutInfo.createdAt ? new Date(workoutInfo.createdAt).toLocaleDateString('pt-BR') : 'N/A'}
              {workoutInfo.updatedAt && ` • Atualizado: ${new Date(workoutInfo.updatedAt).toLocaleDateString('pt-BR')}`}
            </Text>
          </View>
        )}

        <Input
          placeholder="Nome do treino"
          value={workoutName}
          onChangeText={setWorkoutName}
          style={styles.input}
          autoFocus={mode === 'create'}
        />

        <View style={styles.selectionHeader}>
          <Text variant="subtitle" style={styles.sectionTitle}>
            Exercícios ({selectedExercises.length})
          </Text>
          <View style={styles.selectionButtons}>
            <TouchableOpacity 
              onPress={handleSelectAll} 
              style={[
                styles.selectionButton,
                exercises.length === 0 && styles.disabledButton
              ]}
              disabled={exercises.length === 0}
            >
              <Text style={[
                styles.selectionButtonText,
                exercises.length === 0 && styles.disabledText
              ]}>
                Selecionar Todos
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={handleClearAll} 
              style={[
                styles.selectionButton,
                selectedExercises.length === 0 && styles.disabledButton
              ]}
              disabled={selectedExercises.length === 0}
            >
              <Text style={[
                styles.selectionButtonText,
                selectedExercises.length === 0 && styles.disabledText
              ]}>
                Limpar
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.exercisesContainer}>
          {exercises.length === 0 ? (
            <View style={styles.emptyExercises}>
              <Text style={styles.emptyText}>Nenhum exercício cadastrado</Text>
              <Text style={styles.emptySubtext}>
                Crie exercícios primeiro para poder adicioná-los ao treino
              </Text>
            </View>
          ) : (
            exercises.map(exercise => {
              const isSelected = isExerciseSelected(exercise.id);
              return (
                <TouchableOpacity
                  key={exercise.id}
                  style={[
                    styles.exerciseCard,
                    isSelected ? styles.exerciseCardSelected : styles.exerciseCardUnselected
                  ]}
                  onPress={() => toggleExerciseSelection(exercise.id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.exerciseCardContent}>
                    <View style={styles.exerciseInfo}>
                      <Text style={[
                        styles.exerciseName,
                        isSelected && styles.exerciseNameSelected
                      ]} numberOfLines={2}>
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
            })
          )}
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
            title={cancelButtonText}
            onPress={onCancel}
            style={[styles.button, styles.cancelButton]}
            disabled={isLoading}
          />
          <Button
            title={getSubmitButtonText()}
            onPress={handleSubmit}
            style={[styles.button, styles.saveButton]}
            disabled={!workoutName.trim() || selectedExercises.length === 0 || isLoading}
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
    paddingBottom: 120,
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
  disabledButton: {
    borderColor: '#999',
  },
  selectionButtonText: {
    color: '#d15710ff',
    fontSize: 12,
    fontWeight: '500',
  },
  disabledText: {
    color: '#999',
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
    marginRight: 8,
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
    flexShrink: 0,
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
});