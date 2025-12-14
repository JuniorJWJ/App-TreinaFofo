// screens/EditWorkoutScreen.tsx
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, View, StyleSheet } from 'react-native';
import { useWorkoutStore } from '../store';
import { useExerciseStore } from '../store';
import { WorkoutForm } from '../components/organisms/WorkoutForm';
import { Text } from '../components/atoms/Text';
import { Button } from '../components/atoms/Button';

interface EditWorkoutScreenProps {
  navigation: any;
  route: any;
}

export const EditWorkoutScreen: React.FC<EditWorkoutScreenProps> = ({ navigation, route }) => {
  const { workoutId } = route.params || {};
  const { workouts, updateWorkout } = useWorkoutStore();
  const { exercises } = useExerciseStore();
  
  const [initialWorkoutName, setInitialWorkoutName] = useState('');
  const [initialSelectedExercises, setInitialSelectedExercises] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  // Carrega os dados do treino
  useEffect(() => {
    if (workoutId) {
      const workout = workouts.find(w => w.id === workoutId);
      if (workout) {
        // Só atualiza se os dados realmente mudaram
        if (workout.name !== initialWorkoutName) {
          setInitialWorkoutName(workout.name);
        }
        const exerciseIds = workout.exerciseIds || [];
        if (JSON.stringify(exerciseIds) !== JSON.stringify(initialSelectedExercises)) {
          setInitialSelectedExercises(exerciseIds);
        }
      }
    }
    if (isInitializing) {
      setIsInitializing(false);
    }
  }, [workoutId, workouts, initialWorkoutName, initialSelectedExercises, isInitializing]);

  const handleSubmit = useCallback(async (workoutName: string, selectedExercises: string[]) => {
    setIsLoading(true);
    try {
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
    } catch (error) {
      Alert.alert(String(error), 'Não foi possível atualizar o treino');
    } finally {
      setIsLoading(false);
    }
  }, [updateWorkout, workoutId, navigation]);

  const handleCancel = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  if (isInitializing) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  const workout = workouts.find(w => w.id === workoutId);
  if (!workout) {
    return (
      <View style={styles.errorContainer}>
        <Text variant="title" style={styles.errorText}>Treino não encontrado</Text>
        <Text variant="body" style={styles.errorSubtext}>
          O treino que você está tentando editar não existe mais.
        </Text>
        <Button
          title="Voltar para a lista"
          onPress={() => navigation.navigate('WorkoutList')}
          style={styles.backButton}
        />
      </View>
    );
  }

  return (
    <WorkoutForm
      mode="edit"
      initialWorkoutName={initialWorkoutName}
      initialSelectedExercises={initialSelectedExercises}
      exercises={exercises}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isLoading={isLoading}
      workoutInfo={{
        createdAt: workout.createdAt,
        updatedAt: workout.updatedAt,
      }}
      submitButtonText="Salvar Alterações"
      cancelButtonText="Cancelar"
    />
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#1b1613ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#1b1613ff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    color: '#DC3545',
    marginBottom: 12,
    textAlign: 'center',
  },
  errorSubtext: {
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: '#483148',
    minWidth: 200,
  },
});