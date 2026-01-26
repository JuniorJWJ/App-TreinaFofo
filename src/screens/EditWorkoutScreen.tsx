import React, { useRef, useCallback, useEffect, useState } from 'react';
import { Alert, View, StyleSheet, TouchableOpacity } from 'react-native';
import { useWorkoutStore } from '../store';
import { useExerciseStore } from '../store';
import { WorkoutForm, WorkoutFormHandle } from '../components/organisms/WorkoutForm';
import { Text } from '../components/atoms/Text';
import { useFocusEffect } from '@react-navigation/native';

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
  const [isFormValid, setIsFormValid] = useState(false);

  const workoutFormRef = useRef<WorkoutFormHandle>(null);

  // Configura o header com botão de salvar
  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        headerRight: () => (
          <TouchableOpacity
            onPress={handleSave}
            disabled={!isFormValid || isLoading}
            style={{ marginRight: 16, opacity: isFormValid && !isLoading ? 1 : 0.5 }}
          >
            <Text style={{ color: '#FFF', fontWeight: 'bold' }}>
              {isLoading ? 'Salvando...' : 'Salvar'}
            </Text>
          </TouchableOpacity>
        ),
      });

      return () => {
        navigation.setOptions({ headerRight: undefined });
      };
    }, [navigation, isLoading, isFormValid])
  );

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

  const handleSave = () => {
    if (workoutFormRef.current) {
      const formData = workoutFormRef.current.getFormData();
      if (formData.workoutName.trim() && formData.selectedExercises.length > 0) {
        handleSubmit(formData.workoutName, formData.selectedExercises);
      }
    }
  };

  // Atualiza o estado de validade do formulário
  const updateFormValidity = useCallback(() => {
    if (workoutFormRef.current) {
      const formData = workoutFormRef.current.getFormData();
      const isValid = formData.workoutName.trim() !== '' && formData.selectedExercises.length > 0;
      setIsFormValid(isValid);
    }
  }, []);

  // Listen for form changes to update validity
  useEffect(() => {
    const interval = setInterval(updateFormValidity, 500);
    return () => clearInterval(interval);
  }, [updateFormValidity]);

  if (isInitializing) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ color: '#FFF' }}>Carregando...</Text>
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
        <TouchableOpacity
          onPress={() => navigation.navigate('WorkoutList')}
          style={styles.backButton}
        >
          <Text style={{ color: '#FFF' }}>Voltar para a lista</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <WorkoutForm
        ref={workoutFormRef}
        mode="edit"
        initialWorkoutName={initialWorkoutName}
        initialSelectedExercises={initialSelectedExercises}
        exercises={exercises}
        onSubmit={handleSubmit}
        workoutInfo={{
          createdAt: workout.createdAt,
          updatedAt: workout.updatedAt,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1b1613ff',
  },
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
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
});