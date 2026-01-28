import React, { useState, forwardRef, useImperativeHandle } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
} from 'react-native';
import { Input } from '../../atoms/Input';
import { Button } from '../../atoms/Button';
import { Text } from '../../atoms/Text';
import { useExerciseStore } from '../../../store';
import { useMuscleGroupStore } from '../../../store';
import { Exercise } from '../../../types';
import { ConfirmationModal } from '../../molecules/modals/ConfirmationModal';
import { useConfirmationModal } from '../../../hooks/useConfirmationModal';

interface ExerciseFormProps {
  exercise?: Exercise;
  isEditing?: boolean;
  // Removemos onSave e onCancel pois serão controlados externamente
}

export interface ExerciseFormHandle {
  save: () => Promise<SaveResult>; // Retorna SaveResult com sucesso e ação
  getFormData: () => any;
  isLoading: boolean;
}

// Atualize a interface SaveResult
export interface SaveResult {
  success: boolean;
  action?: 'go_back' | 'add_another' | 'stay';
  message?: string;
  type?: 'update' | 'create';
  data?: any;
}

export const ExerciseForm = forwardRef<ExerciseFormHandle, ExerciseFormProps>(
  ({ exercise, isEditing = false }, ref) => {
    const { CreateExercise, updateExercise } = useExerciseStore();
    const { muscleGroups } = useMuscleGroupStore();

    const [name, setName] = useState(exercise?.name || '');
    const [selectedMuscleGroupId, setSelectedMuscleGroupId] = useState(
      exercise?.muscleGroupId || '',
    );
    const [sets, setSets] = useState(exercise?.defaultSets.toString() || '3');
    const [reps, setReps] = useState(exercise?.defaultReps.toString() || '12');
    const [restTime, setRestTime] = useState(
      exercise?.defaultRestTime.toString() || '60',
    );
    const [defaultWeight, setDefaultWeight] = useState(
      exercise?.defaultWeight?.toString() || '',
    );
    const [weightUnit, setWeightUnit] = useState<'kg' | 'lb'>(
      exercise?.weightUnit || 'kg',
    );
    const [notes, setNotes] = useState(exercise?.notes || '');
    const [progressionType, setProgressionType] = useState<
      'fixed' | 'range' | 'linear'
    >(exercise?.progressionType || 'fixed');
    const [useWarmupSets, setUseWarmupSets] = useState(
      (exercise?.warmupSets && exercise.warmupSets.length > 0) || false,
    );
    const [warmupSets, setWarmupSets] = useState<
      Array<{ reps: string; percentage: string }>
    >(
      exercise?.warmupSets
        ? exercise.warmupSets.map(set => ({
            reps: set.reps.toString(),
            percentage: set.percentage.toString(),
          }))
        : [{ reps: '10', percentage: '50' }],
    );
    const [autoProgression, setAutoProgression] = useState(
      exercise?.autoProgression || false,
    );
    const [incrementSize, setIncrementSize] = useState(
      exercise?.incrementSize?.toString() || '2.5',
    );

    const [isLoading, setIsLoading] = useState(false);

    const modal = useConfirmationModal();

    const save = async (): Promise<SaveResult> => {
      if (!name || !selectedMuscleGroupId) {
        return {
          success: false,
          message: 'Preencha o nome e selecione um grupo muscular',
        };
      }

      setIsLoading(true);

      try {
        const selectedGroup = muscleGroups.find(
          group => group.id === selectedMuscleGroupId,
        );

        if (!selectedGroup) {
          return { success: false, message: 'Grupo muscular não encontrado' };
        }

        const exerciseData = {
          name: name.trim(),
          muscleGroupId: selectedMuscleGroupId,
          defaultSets: parseInt(sets) || 3,
          defaultReps: parseInt(reps) || 12,
          defaultRestTime: parseInt(restTime) || 60,
          defaultWeight: defaultWeight ? parseFloat(defaultWeight) : undefined,
          weightUnit,
          notes: notes.trim() || undefined,
          progressionType,
          warmupSets: useWarmupSets
            ? warmupSets.map(set => ({
                reps: parseInt(set.reps) || 10,
                percentage: parseInt(set.percentage) || 50,
              }))
            : [],
          autoProgression,
          incrementSize: parseFloat(incrementSize) || 2.5,
        };

        if (isEditing && exercise) {
          updateExercise(exercise.id, exerciseData);
          return {
            success: true,
            message: `Exercício "${name}" atualizado`,
            type: 'update',
          };
        } else {
          CreateExercise(exerciseData);
          return {
            success: true,
            message: `"${name}" foi adicionado ao grupo ${selectedGroup.name}.`,
            type: 'create',
            data: { name: name.trim(), muscleGroupName: selectedGroup.name },
          };
        }
      } catch (error) {
        console.error(error);
        return {
          success: false,
          message: 'Não foi possível salvar o exercício',
        };
      } finally {
        setIsLoading(false);
      }
    };

    const getFormData = () => ({
      name,
      selectedMuscleGroupId,
      sets,
      reps,
      restTime,
      defaultWeight,
      weightUnit,
      notes,
      progressionType,
      useWarmupSets,
      warmupSets,
      autoProgression,
      incrementSize,
    });

    // Expor métodos via ref
    useImperativeHandle(ref, () => ({
      save,
      getFormData,
      isLoading,
    }));

    const addWarmupSet = () => {
      setWarmupSets([...warmupSets, { reps: '10', percentage: '50' }]);
    };

    const removeWarmupSet = (index: number) => {
      const newSets = [...warmupSets];
      newSets.splice(index, 1);
      setWarmupSets(newSets);
    };

    const updateWarmupSet = (
      index: number,
      field: 'reps' | 'percentage',
      value: string,
    ) => {
      const newSets = [...warmupSets];
      newSets[index][field] = value;
      setWarmupSets(newSets);
    };

    const selectedGroup = muscleGroups.find(
      group => group.id === selectedMuscleGroupId,
    );

    return (
      <>
        <ScrollView style={styles.container}>
          {selectedGroup && (
            <View style={styles.selectedGroup}>
              <Text color="#FFF" variant="caption">
                Grupo selecionado:{' '}
              </Text>
              <Text
                color="#FFF"
                variant="body"
                style={{ color: selectedGroup.color, fontWeight: 'bold' }}
              >
                {selectedGroup.name}
              </Text>
            </View>
          )}

          <Input
            placeholder="Nome do exercício"
            value={name}
            onChangeText={setName}
            color="#FFF"
            placeholderTextColor={'#dbd5d5ff'}
          />

          <Text color="#FFF" variant="subtitle">
            Grupo Muscular:
          </Text>
          <View style={styles.muscleGroupsContainer}>
            {muscleGroups.map(group => (
              <Button
                key={group.id}
                title={group.name}
                onPress={() => setSelectedMuscleGroupId(group.id)}
                style={[
                  styles.muscleGroupButton,
                  selectedMuscleGroupId === group.id
                    ? styles.selectedMuscleGroup
                    : styles.unselectedMuscleGroup,
                ]}
              />
            ))}
          </View>

          <View style={styles.section}>
            <Text color="#FFF" variant="subtitle">
              Configuração de Séries:
            </Text>

            <View style={styles.row}>
              <View style={styles.column}>
                <Text color="#FFF" variant="body">
                  Séries:
                </Text>
                <Input
                  value={sets}
                  onChangeText={setSets}
                  keyboardType="numeric"
                  placeholder="3"
                  color="#FFF"
                />
              </View>

              <View style={styles.column}>
                <Text color="#FFF" variant="body">
                  Repetições:
                </Text>
                <Input
                  value={reps}
                  onChangeText={setReps}
                  keyboardType="numeric"
                  placeholder="12"
                  color="#FFF"
                />
              </View>

              <View style={styles.column}>
                <Text color="#FFF" variant="body">
                  Descanso (s):
                </Text>
                <Input
                  value={restTime}
                  onChangeText={setRestTime}
                  keyboardType="numeric"
                  placeholder="60"
                  color="#FFF"
                />
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text color="#FFF" variant="subtitle">
              Configuração de Peso:
            </Text>

            <View style={styles.row}>
              <View style={[styles.column, { flex: 3 }]}>
                <Text color="#FFF" variant="body">
                  Peso Base:
                </Text>
                <Input
                  value={defaultWeight}
                  onChangeText={setDefaultWeight}
                  keyboardType="numeric"
                  placeholder="20"
                  color="#FFF"
                  placeholderTextColor={'#FFF'}
                />
              </View>

              <View style={[styles.column, { flex: 2 }]}>
                <Text color="#FFF" variant="body">
                  Unidade:
                </Text>
                <View style={styles.unitButtons}>
                  <TouchableOpacity
                    style={[
                      styles.unitButton,
                      weightUnit === 'kg' && styles.unitButtonSelected,
                    ]}
                    onPress={() => setWeightUnit('kg')}
                  >
                    <Text color="#FFF">kg</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.unitButton,
                      weightUnit === 'lb' && styles.unitButtonSelected,
                    ]}
                    onPress={() => setWeightUnit('lb')}
                  >
                    <Text color="#FFF">lb</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View style={styles.switchRow}>
              <Text color="#FFF" variant="body">
                Usar séries de aquecimento
              </Text>
              <Switch
                value={useWarmupSets}
                onValueChange={setUseWarmupSets}
                trackColor={{ false: '#767577', true: '#483148' }}
              />
            </View>

            {useWarmupSets && (
              <View style={styles.warmupContainer}>
                <Text color="#FFF" variant="body">
                  Séries de Aquecimento:
                </Text>
                {warmupSets.map((set, index) => (
                  <View key={index} style={styles.warmupRow}>
                    <View style={styles.warmupInput}>
                      <Text color="#FFF" variant="caption">
                        Reps:
                      </Text>
                      <Input
                        value={set.reps}
                        onChangeText={value =>
                          updateWarmupSet(index, 'reps', value)
                        }
                        keyboardType="numeric"
                        placeholder="10"
                        color="#FFF"
                      />
                    </View>
                    <View style={styles.warmupInput}>
                      <Text color="#FFF" variant="caption">
                        % do peso:
                      </Text>
                      <Input
                        value={set.percentage}
                        onChangeText={value =>
                          updateWarmupSet(index, 'percentage', value)
                        }
                        keyboardType="numeric"
                        placeholder="50"
                        color="#FFF"
                      />
                    </View>
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => removeWarmupSet(index)}
                    >
                      <Text color="#FFF">✕</Text>
                    </TouchableOpacity>
                  </View>
                ))}
                <Button
                  title="Adicionar Série de Aquecimento"
                  onPress={addWarmupSet}
                  style={styles.secondaryButton}
                />
              </View>
            )}

            <View style={styles.switchRow}>
              <View>
                <Text color="#FFF" variant="body">
                  Progressão Automática
                </Text>
                <Text color="#CCC" variant="caption">
                  Aumentar peso automaticamente
                </Text>
              </View>
              <Switch
                value={autoProgression}
                onValueChange={setAutoProgression}
                trackColor={{ false: '#767577', true: '#483148' }}
              />
            </View>

            {autoProgression && (
              <View style={styles.column}>
                <Text color="#FFF" variant="body">
                  Incremento:
                </Text>
                <Input
                  value={incrementSize}
                  onChangeText={setIncrementSize}
                  keyboardType="numeric"
                  placeholder="2.5"
                  color="#FFF"
                />
              </View>
            )}
          </View>

          <View style={styles.section}>
            <Text color="#FFF" variant="subtitle">
              Notas:
            </Text>
            <Input
              placeholder="Dicas de execução, progressão, etc."
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={4}
              color="#FFF"
              style={styles.notesInput}
              placeholderTextColor={'#dbd5d5ff'}
            />
          </View>

          {/* REMOVIDOS OS BOTÕES */}
        </ScrollView>

        <ConfirmationModal
          visible={modal.isVisible}
          title={modal.modalConfig?.title || ''}
          message={modal.modalConfig?.message || ''}
          confirmText={modal.modalConfig?.confirmText || 'OK'}
          cancelText={modal.modalConfig?.cancelText}
          onConfirm={() => {
            modal.modalConfig?.onConfirm?.();
            modal.hideModal();
          }}
          onCancel={() => {
            modal.modalConfig?.onCancel?.();
            modal.hideModal();
          }}
          onClose={() => {
            modal.hideModal();
          }}
        />
      </>
    );
  },
);

// Estilos permanecem os mesmos...
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#1E1E1E',
  },
  selectedGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#2D2D2D',
    borderRadius: 8,
    marginBottom: 16,
  },
  muscleGroupsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 8,
  },
  muscleGroupButton: {
    margin: 4,
    flex: 1,
    minWidth: 100,
    paddingVertical: 8,
  },
  selectedMuscleGroup: {
    backgroundColor: '#483148',
    borderWidth: 2,
    borderColor: '#6A4C6A',
  },
  unselectedMuscleGroup: {
    backgroundColor: '#332B33',
  },
  section: {
    marginBottom: 24,
    padding: 12,
    backgroundColor: '#2D2D2D',
    borderRadius: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginVertical: 8,
  },
  column: {
    flex: 1,
    marginHorizontal: 4,
  },
  unitButtons: {
    flexDirection: 'row',
    marginTop: 8,
    height: 50,
  },
  unitButton: {
    flex: 1,
    padding: 8,
    marginHorizontal: 2,
    backgroundColor: '#332B33',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unitButtonSelected: {
    backgroundColor: '#483148',
    borderWidth: 1,
    borderColor: '#6A4C6A',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
    paddingVertical: 8,
  },
  warmupContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#262626',
    borderRadius: 6,
  },
  warmupRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 8,
  },
  warmupInput: {
    flex: 1,
    marginHorizontal: 4,
  },
  removeButton: {
    width: 40,
    height: 40,
    backgroundColor: '#FF3B30',
    borderRadius: 4,
    marginLeft: 8,
    marginTop: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notesInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 40,
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
  },
  primaryButton: {
    backgroundColor: '#483148',
  },
  secondaryButton: {
    backgroundColor: '#332B33',
  },
});

ExerciseForm.displayName = 'ExerciseForm';
