import React, { useCallback } from 'react';
import { Alert } from 'react-native';
import { useWorkoutStore } from '../store';
import { useExerciseStore } from '../store';
import { WorkoutForm } from '../components/organisms/WorkoutForm';

interface CreateWorkoutScreenProps {
  navigation: any;
}

export const CreateWorkoutScreen: React.FC<CreateWorkoutScreenProps> = ({ navigation }) => {
  const { createQuickWorkout } = useWorkoutStore();
  const { exercises } = useExerciseStore();

  const handleSubmit = useCallback((workoutName: string, selectedExercises: string[]) => {
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
        text: 'Ver Treinos', 
        onPress: () => navigation.navigate('WorkoutList')
      },
      { 
        text: 'Criar Outro', 
        style: 'cancel',
      }
    ]);
  }, [createQuickWorkout, navigation]);

  const handleCancel = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <WorkoutForm
      mode="create"
      exercises={exercises}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      submitButtonText="Criar Treino"
      cancelButtonText="Cancelar"
    />
  );
};