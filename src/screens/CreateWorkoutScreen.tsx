import React, { useRef, useCallback, useState } from 'react';
import { Alert, View, TouchableOpacity, StyleSheet } from 'react-native';
import { useWorkoutStore } from '../store';
import { useExerciseStore } from '../store';
import { WorkoutForm, WorkoutFormHandle } from '../components/organisms/WorkoutForm';
import { Text } from '../components/atoms/Text';
import { useFocusEffect } from '@react-navigation/native';

interface CreateWorkoutScreenProps {
  navigation: any;
}

export const CreateWorkoutScreen: React.FC<CreateWorkoutScreenProps> = ({ navigation }) => {
  const { createQuickWorkout } = useWorkoutStore();
  const { exercises } = useExerciseStore();
  
  const [isLoading, setIsLoading] = useState(false);
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
              {isLoading ? 'Salvando...' : 'Criar'}
            </Text>
          </TouchableOpacity>
        ),
      });

      return () => {
        navigation.setOptions({ headerRight: undefined });
      };
    }, [navigation, isLoading, isFormValid])
  );

  const handleSubmit = useCallback((workoutName: string, selectedExercises: string[]) => {
    if (!workoutName.trim()) {
      Alert.alert('Atenção', 'Digite um nome para o treino');
      return;
    }

    if (selectedExercises.length === 0) {
      Alert.alert('Atenção', 'Selecione pelo menos um exercício');
      return;
    }

    setIsLoading(true);
    try {
      createQuickWorkout(workoutName, selectedExercises);
      
      Alert.alert('Sucesso', 'Treino criado com sucesso!', [
        { 
          text: 'Ver Treinos', 
          onPress: () => navigation.navigate('WorkoutList')
        },
        { 
          text: 'Criar Outro', 
          style: 'cancel',
          onPress: () => {
            // Reseta o formulário
            if (workoutFormRef.current) {
              // Você pode adicionar um método resetForm no WorkoutForm se necessário
              // Por enquanto, vamos apenas navegar de volta e reabrir se quiser criar outro
              navigation.replace('CreateWorkout');
            }
          }
        }
      ]);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível criar o treino');
    } finally {
      setIsLoading(false);
    }
  }, [createQuickWorkout, navigation]);

  const handleSave = () => {
    if (workoutFormRef.current) {
      const formData = workoutFormRef.current.getFormData();
      if (formData.workoutName.trim() && formData.selectedExercises.length > 0) {
        handleSubmit(formData.workoutName, formData.selectedExercises);
      }
    }
  };

  // Atualiza o estado de validade do formulário periodicamente
  const updateFormValidity = useCallback(() => {
    if (workoutFormRef.current) {
      const formData = workoutFormRef.current.getFormData();
      const isValid = formData.workoutName.trim() !== '' && formData.selectedExercises.length > 0;
      setIsFormValid(isValid);
    }
  }, []);

  // Listen for form changes to update validity
  React.useEffect(() => {
    const interval = setInterval(updateFormValidity, 500);
    return () => clearInterval(interval);
  }, [updateFormValidity]);

  return (
    <View style={styles.container}>
      <WorkoutForm
        ref={workoutFormRef}
        mode="create"
        exercises={exercises}
        onSubmit={handleSubmit}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1b1613ff',
  },
});