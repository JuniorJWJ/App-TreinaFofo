import React, {
  useRef,
  useCallback,
  useEffect,
  useState,
} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useWorkoutStore } from '../../store';
import { useExerciseStore } from '../../store';
import {
  WorkoutForm,
  WorkoutFormHandle,
} from '../../components/organisms/WorkoutForm';
import { Text } from '../../components/atoms/Text';
import { useFocusEffect } from '@react-navigation/native';
import { ConfirmationModal } from '../../components/molecules/modals/ConfirmationModal';
import { useConfirmationModal } from '../../hooks/useConfirmationModal';

interface EditWorkoutScreenProps {
  navigation: any;
  route: any;
}

export const EditWorkoutScreen: React.FC<EditWorkoutScreenProps> = ({
  navigation,
  route,
}) => {
  const { workoutId } = route.params || {};
  const { workouts, updateWorkout } = useWorkoutStore();
  const { exercises } = useExerciseStore();

  const [initialWorkoutName, setInitialWorkoutName] = useState('');
  const [initialSelectedExercises, setInitialSelectedExercises] =
    useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isFormValid, setIsFormValid] = useState(false);

  const workoutFormRef = useRef<WorkoutFormHandle>(null);
  const modal = useConfirmationModal();

  /**
   * Submit
   */
  const handleSubmit = useCallback(
    async (workoutName: string, selectedExercises: string[]) => {
      setIsLoading(true);
      try {
        updateWorkout(workoutId, {
          name: workoutName.trim(),
          exerciseIds: selectedExercises,
        });

        modal.showSuccess(
          'Treino atualizado com sucesso!',
          'Sucesso!',
          () => navigation.goBack(),
        );
      } catch {
        modal.showError(
          'Não foi possível atualizar o treino. Tente novamente.',
          'Erro!',
        );
      } finally {
        setIsLoading(false);
      }
    },
    [updateWorkout, workoutId, navigation, modal],
  );

  /**
   * Save button action
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
  const HeaderSaveButton = useCallback(() => {
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
          {isLoading ? 'Salvando...' : 'Salvar'}
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
        headerRight: HeaderSaveButton,
      });

      return () => {
        navigation.setOptions({ headerRight: undefined });
      };
    }, [navigation, HeaderSaveButton]),
  );

  /**
   * Load workout data
   */
  useEffect(() => {
    if (!workoutId) return;

    const workout = workouts.find(w => w.id === workoutId);
    if (workout) {
      setInitialWorkoutName(workout.name);
      setInitialSelectedExercises(workout.exerciseIds || []);
    }

    setIsInitializing(false);
  }, [workoutId, workouts]);

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
   * Loading state
   */
  if (isInitializing) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ color: '#FFF' }}>Carregando...</Text>
      </View>
    );
  }

  /**
   * Workout not found
   */
  const workout = workouts.find(w => w.id === workoutId);
  if (!workout) {
    return (
      <View style={styles.errorContainer}>
        <Text variant="title" style={styles.errorText}>
          Treino não encontrado
        </Text>
        <Text variant="body" style={styles.errorSubtext}>
          
          O treino que você está tentando editar não existe mais.
        </Text>

        <TouchableOpacity
          onPress={() => navigation.navigate('WorkoutList')}
          style={styles.backButton}
        >
          <Text style={{ color: '#FFF' }}>
            Voltar para a lista
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  /**
   * Screen
   */
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

      {modal.modalConfig && (
        <ConfirmationModal
          visible={modal.isVisible}
          type={modal.modalConfig.type}
          title={modal.modalConfig.title}
          message={modal.modalConfig.message}
          confirmText={modal.modalConfig.confirmText}
          cancelText={modal.modalConfig.cancelText}
          onConfirm={modal.modalConfig.onConfirm}
          onCancel={modal.modalConfig.onCancel}
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
