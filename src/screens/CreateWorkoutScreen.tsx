import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { useWorkoutStore } from '../store';
import { useExerciseStore } from '../store';
import { Text } from '../components/atoms/Text';
import { Input } from '../components/atoms/Input';
import { Button } from '../components/atoms/Button';

interface CreateWorkoutScreenProps {
  navigation: any;
}

export const CreateWorkoutScreen: React.FC<CreateWorkoutScreenProps> = ({ navigation }) => {
  const { createQuickWorkout } = useWorkoutStore();
  const { exercises } = useExerciseStore();
  
  const [workoutName, setWorkoutName] = useState('');
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);

  const handleSaveWorkout = () => {
    if (!workoutName.trim()) {
      Alert.alert('Atenção', 'Digite um nome para o treino');
      return;
    }

    if (selectedExercises.length === 0) {
      Alert.alert('Atenção', 'Selecione pelo menos um exercício');
      return;
    }

    createQuickWorkout(workoutName, selectedExercises);
    
    Alert.alert('Sucesso', 'Treino criado com sucesso!', [
      { 
        text: 'OK', 
        onPress: () => navigation.navigate('WorkoutList')
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

  return (
    <ScrollView style={styles.container}>
      <Text variant="title" align="center">Criar Novo Treino</Text>

      <Input
        placeholder="Nome do treino (ex: Treino A - Peito)"
        value={workoutName}
        onChangeText={setWorkoutName}
        style={styles.input}
      />

      <Text variant="subtitle" style={styles.sectionTitle}>
        Selecione os exercícios:
      </Text>

      <View style={styles.exercisesContainer}>
        {exercises.map(exercise => (
          <Button
            key={exercise.id}
            title={exercise.name}
            onPress={() => toggleExerciseSelection(exercise.id)}
            style={[
              styles.exerciseButton,
              isExerciseSelected(exercise.id) ? styles.selectedExercise : styles.unselectedExercise,
            ]}
          />
        ))}
      </View>

      <View style={styles.selectedInfo}>
        <Text variant="caption">
          {selectedExercises.length} exercício{selectedExercises.length !== 1 ? 's' : ''} selecionado{selectedExercises.length !== 1 ? 's' : ''}
        </Text>
      </View>

      <View style={styles.buttonsContainer}>
        <Button
          title="Cancelar"
          onPress={() => navigation.goBack()}
          style={[styles.button, styles.cancelButton]}
        />
        <Button
          title="Criar Treino"
          onPress={handleSaveWorkout}
          style={[styles.button, styles.saveButton]}
          disabled={!workoutName.trim() || selectedExercises.length === 0}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  input: {
    marginBottom: 20,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  exercisesContainer: {
    marginBottom: 16,
  },
  exerciseButton: {
    marginBottom: 8,
  },
  selectedExercise: {
    backgroundColor: '#d15710ff',
  },
  unselectedExercise: {
    backgroundColor: '#E0E0E0',
  },
  selectedInfo: {
    alignItems: 'center',
    marginBottom: 20,
    padding: 8,
    backgroundColor: '#FFF',
    borderRadius: 8,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
  },
  cancelButton: {
    backgroundColor: '#6C757D',
  },
  saveButton: {
    backgroundColor: '#28A745',
  },
});