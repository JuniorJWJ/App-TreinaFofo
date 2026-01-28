import React, { useRef, useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import {
  ExerciseForm,
  ExerciseFormHandle,
  SaveResult,
} from '../../components/molecules/forms/ExerciseForm';
import { Text } from '../../components/atoms/Text';
import { useFocusEffect } from '@react-navigation/native';
import { useConfirmationModal } from '../../hooks/useConfirmationModal';
import { ConfirmationModal } from '../../../src/components/molecules/modals/ConfirmationModal';
// import { useExerciseStore } from '../../store';
// import { useMuscleGroupStore } from '../../store';

interface CreateExerciseScreenProps {
  navigation: any;
}

export const CreateExerciseScreen: React.FC<CreateExerciseScreenProps> = ({
  navigation,
}) => {
  const exerciseFormRef = useRef<ExerciseFormHandle>(null);
  // const { CreateExercise } = useExerciseStore();
  // const { muscleGroups } = useMuscleGroupStore();
  
  const [isLoading, setIsLoading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  
  const modal = useConfirmationModal();

  const handleSubmit = useCallback((result: SaveResult) => {
    if (!result.success) {
      modal.showWarning(result.message ?? 'Ocorreu um erro desconhecido.', 'Atenção!');
      return;
    }

    if (result.type === 'update') {
      modal.showSuccess('Sucesso!', result.message ?? 'Operação realizada com sucesso.', () => navigation.goBack());
      return;
    }

    // Para criação, mostrar modal com duas opções
    modal.showConfirmation(
      result.message ?? 'Exercício criado com sucesso!',
      'Exercício criado!',
      () => navigation.navigate('ExerciseList'),
      'Ver Exercícios',
      'Criar Outro',
    );
  }, [modal, navigation]);

  const handleSave = useCallback(async () => {
    if (!exerciseFormRef.current) return;

    setIsLoading(true);
    const result = await exerciseFormRef.current.save();
    setIsLoading(false);

    handleSubmit(result);
  }, [handleSubmit]);

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
          {isLoading ? 'Criando...' : 'Criar'}
        </Text>
      </TouchableOpacity>
    );
  }, [handleSave, isFormValid, isLoading]);

  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        title: 'Novo Exercício',
        headerRight: HeaderSaveButton,
      });

      return () => {
        navigation.setOptions({ headerRight: undefined });
      };
    }, [navigation, HeaderSaveButton]),
  );

  // Validação do formulário
  const updateFormValidity = useCallback(() => {
    if (!exerciseFormRef.current) return;

    const formData = exerciseFormRef.current.getFormData();
    const isValid = formData.name.trim() !== '' && formData.selectedMuscleGroupId !== '';
    
    setIsFormValid(isValid);
  }, []);

  useEffect(() => {
    const interval = setInterval(updateFormValidity, 500);
    return () => clearInterval(interval);
  }, [updateFormValidity]);

  return (
    <View style={styles.container}>
      <ExerciseForm ref={exerciseFormRef} isEditing={false} />

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

            // Recria a tela para adicionar outro exercício
            // (isso limpará o formulário via replace)
            navigation.replace('CreateExercise');
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