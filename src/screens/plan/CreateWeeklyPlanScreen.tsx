import React, { useCallback } from 'react';
import {  StyleSheet, ScrollView } from 'react-native';
import { useWeeklyPlanStore } from '../../store';
import { useWorkoutStore } from '../../store';
import { useFocusEffect } from '@react-navigation/native';
import { ConfirmationModal } from '../../components/molecules/modals/ConfirmationModal';
import { useConfirmationModal } from '../../hooks/useConfirmationModal';
import { WeeklyPlanFormContainer } from '../../components/organisms/WeeklyPlanFormContainer';
import { WeeklyPlanHeader } from '../../components/molecules/WeeklyPlanHeader';
import { WorkoutSelectorModal } from '../../components/molecules/modals/WorkoutSelectorModal';
import { useWeeklyPlanForm } from '../../hooks/useWeeklyPlanForm';
import { DayOfWeek } from '../../types';

interface CreateWeeklyPlanScreenProps {
  navigation: any;
  route?: any;
}

export const CreateWeeklyPlanScreen: React.FC<CreateWeeklyPlanScreenProps> = ({
  navigation,
  route,
}) => {
  const { addWeeklyPlan, updateWeeklyPlan, weeklyPlans, setActivePlan } =
    useWeeklyPlanStore();
  const { workouts } = useWorkoutStore();

  const isEditing = route?.params?.planId;
  const existingPlan = isEditing
    ? weeklyPlans.find(p => p.id === route.params.planId)
    : null;

  const {
    planName,
    setPlanName,
    description,
    setDescription,
    isFormValid,
    isLoading,
    setIsLoading,
    days,
    updateDayWorkout,
  } = useWeeklyPlanForm(existingPlan, isEditing);

  const modal = useConfirmationModal();
  const [isModalVisible, setModalVisible] = React.useState(false);
  const [selectedDay, setSelectedDay] = React.useState<DayOfWeek | null>(null);

  const getWorkoutName = useCallback((workoutId: string | null) => {
    if (!workoutId) return 'Descanso';
    const workout = workouts.find(w => w.id === workoutId);
    return workout ? workout.name : 'Treino não encontrado';
  }, [workouts]);

  const handleDayPress = useCallback((day: DayOfWeek) => {
    setSelectedDay(day);
    setModalVisible(true);
  }, []);

  const handleSelectWorkout = useCallback((workoutId: string | null) => {
    if (selectedDay) updateDayWorkout(selectedDay, workoutId);
    setModalVisible(false);
  }, [selectedDay, updateDayWorkout]);

  const handleSave = useCallback(() => {
    if (!planName.trim()) {
      modal.showWarning('Digite um nome para o plano semanal', 'Atenção!');
      return;
    }

    setIsLoading(true);
    
    const planData = {
      name: planName.trim(),
      description: description.trim(),
      days,
      startDate: existingPlan?.startDate || new Date(),
      endDate:
        existingPlan?.endDate ||
        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      workoutSplitId: existingPlan?.workoutSplitId,
      isActive: existingPlan?.isActive || false,
      isTemplate: existingPlan?.isTemplate || false,
      currentWeek: existingPlan?.currentWeek || 1,
      completedDays: existingPlan?.completedDays || 0,
      completionRate: existingPlan?.completionRate || 0,
    };

    if (isEditing && existingPlan) {
      try {
        updateWeeklyPlan(existingPlan.id, planData);
        modal.showSuccess(
          'Plano semanal atualizado com sucesso!',
          'Sucesso!',
          () => {
            setIsLoading(false);
            navigation.goBack();
          }
        );
      } catch (error) {
        console.error(error);
        setIsLoading(false);
        modal.showError(
          'Não foi possível atualizar o plano semanal. Tente novamente.',
          'Erro!'
        );
      }
    } else {
      try {
        const newPlanId = `wp-${Date.now()}`;
        addWeeklyPlan({
          ...planData,
          id: newPlanId,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        // CORREÇÃO AQUI: usar showModal corretamente
        modal.showModal({
          type: 'confirmation',
          title: 'Sucesso!',
          message: 'Plano semanal criado com sucesso! O que você gostaria de fazer agora?',
          confirmText: 'Definir como Ativo',
          cancelText: 'Voltar para Lista',
          onConfirm: () => {
            setIsLoading(false);
            setActivePlan(newPlanId);
            navigation.navigate('WeeklyPlanList');
          },
          onCancel: () => {
            setIsLoading(false);
            navigation.navigate('WeeklyPlanList');
          },
          showCancelButton: true,
        });
      } catch (error) {
        console.error(error);
        setIsLoading(false);
        modal.showError(
          'Não foi possível criar o plano semanal. Tente novamente.',
          'Erro!'
        );
      }
    }
  }, [
    planName,
    description,
    days,
    existingPlan,
    isEditing,
    updateWeeklyPlan,
    modal,
    navigation,
    addWeeklyPlan,
    setActivePlan,
    setIsLoading,
  ]);

  const HeaderSaveButton = useCallback(() => {
    return (
      <WeeklyPlanHeader
        onPress={handleSave}
        disabled={!isFormValid || isLoading}
        isLoading={isLoading}
        isEditing={!!isEditing}
      />
    );
  }, [handleSave, isFormValid, isLoading, isEditing]);

  // Configurar o header
  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        title: isEditing ? 'Editar Plano Semanal' : 'Novo Plano Semanal',
        headerRight: HeaderSaveButton,
      });

      return () => {
        navigation.setOptions({ headerRight: undefined });
      };
    }, [navigation, HeaderSaveButton, isEditing]),
  );

  return (
    <>
      <ScrollView style={styles.container}>
        <WeeklyPlanFormContainer
          planName={planName}
          onPlanNameChange={setPlanName}
          description={description}
          onDescriptionChange={setDescription}
          days={days}
          onDayPress={handleDayPress}
          getWorkoutName={getWorkoutName}
          isEditing={!!isEditing}
        />
      </ScrollView>

      {/* Modal de seleção de treino */}
      <WorkoutSelectorModal
        visible={isModalVisible}
        workouts={workouts}
        onClose={() => setModalVisible(false)}
        onSelect={handleSelectWorkout}
      />

      {/* Modal de confirmação */}
      {modal.modalConfig && (
        <ConfirmationModal
          visible={modal.isVisible}
          type={modal.modalConfig.type}
          title={modal.modalConfig.title}
          message={modal.modalConfig.message}
          confirmText={modal.modalConfig.confirmText}
          cancelText={modal.modalConfig.cancelText}
          onConfirm={() => {
            modal.modalConfig?.onConfirm?.();
            modal.hideModal();
          }}
          onCancel={() => {
            modal.modalConfig?.onCancel?.();
            modal.hideModal();
          }}
          showCancelButton={modal.modalConfig.showCancelButton}
          hideIcon={modal.modalConfig.hideIcon}
          onClose={modal.hideModal}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#1b1613ff',
  },
});