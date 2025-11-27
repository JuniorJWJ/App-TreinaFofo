import React from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Input } from '../atoms/Input';
import { Button } from '../atoms/Button';
import { Text } from '../atoms/Text';
import { useExerciseStore } from '../../store';
import { useMuscleGroupStore } from '../../store';
import { Exercise } from '../../types';

interface ExerciseFormProps {
  onSave: () => void;
  onCancel: () => void;
  exercise?: Exercise; // Para edição
  isEditing?: boolean; // Para diferenciar criação vs edição
}

export const ExerciseForm: React.FC<ExerciseFormProps> = ({ 
  onSave, 
  onCancel, 
  exercise,
  isEditing = false 
}) => {
  const { addExercise, updateExercise } = useExerciseStore();
  const { muscleGroups } = useMuscleGroupStore();
  
  const [name, setName] = React.useState(exercise?.name || '');
  const [selectedMuscleGroupId, setSelectedMuscleGroupId] = React.useState(exercise?.muscleGroupId || '');
  const [sets, setSets] = React.useState(exercise?.defaultSets.toString() || '3');
  const [reps, setReps] = React.useState(exercise?.defaultReps.toString() || '12');
  const [restTime, setRestTime] = React.useState(exercise?.defaultRestTime.toString() || '60');
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSave = async () => {
    if (!name || !selectedMuscleGroupId) {
      Alert.alert('Atenção', 'Preencha o nome e selecione um grupo muscular');
      return;
    }

    setIsLoading(true);

    try {
      const selectedGroup = muscleGroups.find(group => group.id === selectedMuscleGroupId);
      
      if (!selectedGroup) {
        Alert.alert('Erro', 'Grupo muscular não encontrado');
        return;
      }

      const exerciseData = {
        name: name.trim(),
        muscleGroupId: selectedMuscleGroupId,
        defaultSets: parseInt(sets) || 3,
        defaultReps: parseInt(reps) || 12,
        defaultRestTime: parseInt(restTime) || 60,
      };

      if (isEditing && exercise) {
        // Modo edição
        updateExercise(exercise.id, exerciseData);
        Alert.alert('Sucesso!', `Exercício "${name}" atualizado`);
      } else {
        // Modo criação
        addExercise(exerciseData);
        Alert.alert('Sucesso!', `Exercício "${name}" criado no grupo ${selectedGroup.name}`);
      }

      // Limpa o formulário apenas se for criação
      if (!isEditing) {
        setName('');
        setSelectedMuscleGroupId('');
        setSets('3');
        setReps('12');
        setRestTime('60');
      }

      onSave();

    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível salvar o exercício');
    } finally {
      setIsLoading(false);
    }
  };

  const selectedGroup = muscleGroups.find(group => group.id === selectedMuscleGroupId);

  return (
    <ScrollView style={styles.container}>
      <Text variant="title" align="center">
        {isEditing ? 'Editar Exercício' : 'Novo Exercício'}
      </Text>
      
      {selectedGroup && (
        <View style={styles.selectedGroup}>
          <Text variant="caption">Grupo selecionado: </Text>
          <Text variant="body" style={{ color: selectedGroup.color, fontWeight: 'bold' }}>
            {selectedGroup.name}
          </Text>
        </View>
      )}
      
      <Input
        placeholder="Nome do exercício"
        value={name}
        onChangeText={setName}
      />
      
      <Text variant="subtitle">Grupo Muscular:</Text>
      <View style={styles.muscleGroupsContainer}>
        {muscleGroups.map((group) => (
          <Button
            key={group.id}
            title={group.name}
            onPress={() => setSelectedMuscleGroupId(group.id)}
            style={[
              styles.muscleGroupButton,
              selectedMuscleGroupId === group.id ? styles.primaryButton : styles.secondaryButton,
            ]}
          />
        ))}
      </View>

      <View style={styles.row}>
        <View style={styles.column}>
          <Text variant="subtitle">Séries:</Text>
          <Input
            value={sets}
            onChangeText={setSets}
            keyboardType="numeric"
            placeholder="3"
          />
        </View>
        
        <View style={styles.column}>
          <Text variant="subtitle">Repetições:</Text>
          <Input
            value={reps}
            onChangeText={setReps}
            keyboardType="numeric"
            placeholder="12"
          />
        </View>
        
        <View style={styles.column}>
          <Text variant="subtitle">Descanso (s):</Text>
          <Input
            value={restTime}
            onChangeText={setRestTime}
            keyboardType="numeric"
            placeholder="60"
          />
        </View>
      </View>

      <View style={styles.buttonsContainer}>
        <Button 
          title="Cancelar" 
          onPress={onCancel}
          style={[styles.button, styles.secondaryButton]}
          disabled={isLoading}
        />
        <Button 
          title={isLoading ? "Salvando..." : (isEditing ? "Atualizar Exercício" : "Salvar Exercício")}
          onPress={handleSave}
          style={[styles.button, styles.primaryButton]}
          disabled={!name || !selectedMuscleGroupId || isLoading}
        />
      </View>
    </ScrollView>
  );
};

// Mantenha os mesmos styles do anterior...
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  selectedGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginBottom: 12,
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
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  column: {
    flex: 1,
    marginHorizontal: 4,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
  },
  primaryButton: {
    backgroundColor: '#d15710ff',
  },
  secondaryButton: {
    backgroundColor: '#e0e0e0',
  },
});