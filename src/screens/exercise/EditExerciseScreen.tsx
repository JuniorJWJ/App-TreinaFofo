import React, { useRef, useState, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { ExerciseForm, ExerciseFormHandle, SaveResult } from '../../components/molecules/forms/ExerciseForm';
import { Text } from '../../components/atoms/Text';
import { useFocusEffect } from '@react-navigation/native';
import { useConfirmationModal } from '../../hooks/useConfirmationModal';
import { ConfirmationModal } from '../../../src/components/molecules/modals/ConfirmationModal';
import { useExerciseStore } from '../../store';

interface EditExerciseScreenProps {
  navigation: any;
  route: any;
}

export const EditExerciseScreen: React.FC<EditExerciseScreenProps> = ({
  navigation,
  route,
}) => {
  const { exerciseId } = route.params || {};
  const { exercises } = useExerciseStore();
  
  const exercise = exercises.find(ex => ex.id === exerciseId);
  const exerciseFormRef = useRef<ExerciseFormHandle>(null);
  const [isLoading, setIsLoading] = useState(false);
  const modal = useConfirmationModal();

  const handleHeaderSave = useCallback(async () => {
    if (!exerciseFormRef.current) return;
    
    setIsLoading(true);
    const result: SaveResult = await exerciseFormRef.current.save();
    setIsLoading(false);
    
    if (result.success && result.type === 'update') {
      // Modal de sucesso similar ao EditWorkoutScreen
      modal.showSuccess(
        'Exercício atualizado com sucesso!',
        'Sucesso!',
        () => navigation.goBack(),
      );
    } else if (!result.success) {
      // Modal de erro/warning
      modal.showWarning(result.message ?? 'Ocorreu um erro desconhecido.', 'Atenção!');
    }
  }, [modal, navigation]);

  const HeaderSaveButton = useCallback(() => {
    return (
      <TouchableOpacity
        onPress={handleHeaderSave}
        disabled={isLoading}
        style={{
          marginRight: 16,
          opacity: !isLoading ? 1 : 0.5,
        }}
      >
        <Text style={{ color: '#FFF', fontWeight: 'bold' }}>
          {isLoading ? 'Salvando...' : 'Atualizar'}
        </Text>
      </TouchableOpacity>
    );
  }, [handleHeaderSave, isLoading]);

  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        title: 'Editar Exercício',
        headerRight: HeaderSaveButton,
      });

      return () => {
        navigation.setOptions({ headerRight: undefined });
      };
    }, [navigation, HeaderSaveButton]),
  );

  if (!exercise) {
    return (
      <View style={styles.container}>
        <Text style={{ color: '#FFF', textAlign: 'center', marginTop: 20 }}>
          Exercício não encontrado
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ExerciseForm
        ref={exerciseFormRef}
        exercise={exercise}
        isEditing={true}
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
});