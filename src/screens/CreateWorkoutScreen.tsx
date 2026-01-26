import React, {
  useRef,
  useCallback,
  useState,
  useEffect,
} from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useWorkoutStore } from '../store';
import { useExerciseStore } from '../store';
import {
  WorkoutForm,
  WorkoutFormHandle,
} from '../components/organisms/WorkoutForm';
import { Text } from '../components/atoms/Text';
import { useFocusEffect } from '@react-navigation/native';
import { ConfirmationModal } from '../components/molecules/ConfirmationModal';
import { useConfirmationModal } from '../hooks/useConfirmationModal';

interface CreateWorkoutScreenProps {
  navigation: any;
}

export const CreateWorkoutScreen: React.FC<CreateWorkoutScreenProps> = ({
  navigation,
}) => {
  const { createQuickWorkout } = useWorkoutStore();
  const { exercises } = useExerciseStore();

  const [isLoading, setIsLoading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  const workoutFormRef = useRef<WorkoutFormHandle>(null);
  const modal = useConfirmationModal();

  /**
   * Submit
   */
  const handleSubmit = useCallback(
    (workoutName: string, selectedExercises: string[]) => {
      if (!workoutName.trim()) {
        modal.showWarning('Digite um nome para o treino', 'Atenção!');
        return;
      }

      if (selectedExercises.length === 0) {
        modal.showWarning(
          'Selecione pelo menos um exercício',
          'Atenção!',
        );
        return;
      }

      setIsLoading(true);
      try {
        createQuickWorkout(workoutName, selectedExercises);

        modal.showConfirmation(
          'Treino criado com sucesso! O que você gostaria de fazer agora?',
          'Sucesso!',
          () => navigation.navigate('WorkoutList'),
          'Ver Treinos',
          'Criar Outro',
        );
      } catch {
        modal.showError(
          'Não foi possível criar o treino. Tente novamente.',
          'Erro!',
        );
      } finally {
        setIsLoading(false);
      }
    },
    [createQuickWorkout, navigation, modal],
  );

  /**
   * Save action
   */
  const handleSave = useCallback(() => {
    if (!workoutFormRef.current) return;

    const formData = workoutFormRef.current.getFormData();
    if (
      formData.workoutName.trim() &&
      formData.selectedExercises.length > 0
    ) {
      handleSubmit(
        formData.workoutName,
        formData.selectedExercises,
      );
    }
  }, [handleSubmit]);

  /**
   * Header button (FIX DO WARNING)
   */
  const HeaderCreateButton = useCallback(() => {
    return (
      <TouchableOpacity
        onPress={handleSave}
        disabled={!isFormValid || isLoading}
        style={{
          marginRight: 16,
          opacity: isFormValid && !isLoading ? 1 : 0.5,
        }}
      >
        <Text style={{ color: '#FFF', fontWeight: 'bold' }}>
          {isLoading ? 'Criando...' : 'Criar'}
        </Text>
      </TouchableOpacity>
    );
  }, [handleSave, isFormValid, isLoading]);

  /**
   * Header config
   */
  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        headerRight: HeaderCreateButton,
      });

      return () => {
        navigation.setOptions({ headerRight: undefined });
      };
    }, [navigation, HeaderCreateButton]),
  );

  /**
   * Form validation
   */
  const updateFormValidity = useCallback(() => {
    if (!workoutFormRef.current) return;

    const formData = workoutFormRef.current.getFormData();
    const isValid =
      formData.workoutName.trim() !== '' &&
      formData.selectedExercises.length > 0;

    setIsFormValid(isValid);
  }, []);

  useEffect(() => {
    const interval = setInterval(updateFormValidity, 500);
    return () => clearInterval(interval);
  }, [updateFormValidity]);

  /**
   * Screen
   */
  return (
    <View style={styles.container}>
      <WorkoutForm
        ref={workoutFormRef}
        mode="create"
        exercises={exercises}
        onSubmit={handleSubmit}
      />

      {modal.modalConfig && (
        <ConfirmationModal
          visible={modal.isVisible}
          type={modal.modalConfig.type}
          title={modal.modalConfig.title}
          message={modal.modalConfig.message}
          confirmText={modal.modalConfig.confirmText}
          cancelText={modal.modalConfig.cancelText}
          onConfirm={modal.modalConfig.onConfirm ?? (() => {})}
          onCancel={() => {
            if (modal.modalConfig?.onCancel) {
              modal.modalConfig.onCancel();
            } else {
              modal.hideModal();
            }

            navigation.replace('CreateWorkout');
          }}
          showCancelButton={modal.modalConfig.showCancelButton}
          hideIcon={modal.modalConfig.hideIcon}
          onClose={modal.hideModal}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1b1613ff',
  },
});
