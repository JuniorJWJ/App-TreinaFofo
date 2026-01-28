import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useWeeklyPlanStore } from '../../store';
import { useWorkoutStore } from '../../store';
import { Text } from '../../components/atoms/Text';
import { WeeklyPlanForm } from '../../components/molecules/forms/WeeklyPlanForm';
import { DayScheduleCard } from '../../components/molecules/cards/DayScheduleCard';
import { TipCard } from '../../components/molecules/cards/TipCard';
import { WorkoutSelectorModal } from '../../components/molecules/modals/WorkoutSelectorModal';
import { DayOfWeek, DailyWorkout } from '../../types';
import { useFocusEffect } from '@react-navigation/native';
import { ConfirmationModal } from '../../components/molecules/modals/ConfirmationModal';
import { useConfirmationModal } from '../../hooks/useConfirmationModal';

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

  const [planName, setPlanName] = useState(existingPlan?.name || '');
  const [description, setDescription] = useState(
    existingPlan?.description || '',
  );
  const [isFormValid, setIsFormValid] = useState(!!existingPlan?.name);
  const [isLoading, setIsLoading] = useState(false);

  const [days, setDays] = useState<DailyWorkout[]>(
    existingPlan?.days || [
      {
        day: 'monday',
        workoutId: null,
        isCompleted: false,
        completedAt: undefined,
        notes: '',
      },
      {
        day: 'tuesday',
        workoutId: null,
        isCompleted: false,
        completedAt: undefined,
        notes: '',
      },
      {
        day: 'wednesday',
        workoutId: null,
        isCompleted: false,
        completedAt: undefined,
        notes: '',
      },
      {
        day: 'thursday',
        workoutId: null,
        isCompleted: false,
        completedAt: undefined,
        notes: '',
      },
      {
        day: 'friday',
        workoutId: null,
        isCompleted: false,
        completedAt: undefined,
        notes: '',
      },
      {
        day: 'saturday',
        workoutId: null,
        isCompleted: false,
        completedAt: undefined,
        notes: '',
      },
      {
        day: 'sunday',
        workoutId: null,
        isCompleted: false,
        completedAt: undefined,
        notes: '',
      },
    ],
  );

  const dayLabels: Record<DayOfWeek, string> = {
    monday: 'Segunda-feira',
    tuesday: 'Terça-feira',
    wednesday: 'Quarta-feira',
    thursday: 'Quinta-feira',
    friday: 'Sexta-feira',
    saturday: 'Sábado',
    sunday: 'Domingo',
  };

  const modal = useConfirmationModal();

  // Validação do formulário
  useEffect(() => {
    const isValid = planName.trim() !== '';
    setIsFormValid(isValid);
  }, [planName]);

  const getWorkoutName = (workoutId: string | null) => {
    if (!workoutId) return 'Descanso';
    const workout = workouts.find(w => w.id === workoutId);
    return workout ? workout.name : 'Treino não encontrado';
  };

  // Estado do Modal
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedDay, setSelectedDay] = useState<DayOfWeek | null>(null);

  const handleDayPress = (day: DayOfWeek) => {
    setSelectedDay(day);
    setModalVisible(true);
  };

  const updateDayWorkout = (day: DayOfWeek, workoutId: string | null) => {
    setDays(prevDays =>
      prevDays.map(d => (d.day === day ? { ...d, workoutId } : d)),
    );
  };

  const handleSelectWorkout = (workoutId: string | null) => {
    if (selectedDay) updateDayWorkout(selectedDay, workoutId);
    setModalVisible(false);
  };

  const handleSave = useCallback(() => {
    if (!planName.trim()) {
      modal.showWarning('Digite um nome para o plano semanal', 'Atenção!');
      return;
    }

    setIsLoading(true);
    try {
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
        updateWeeklyPlan(existingPlan.id, planData);
        modal.showSuccess(
          'Plano semanal atualizado com sucesso!',
          'Sucesso!',
          () => {
            setIsLoading(false);
            navigation.goBack();
          },
        );
      } else {
        const newPlanId = `wp-${Date.now()}`;
        addWeeklyPlan({
          ...planData,
          id: newPlanId,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        // Modal com callback correto
        modal.showModal({
          type: 'confirmation',
          title: 'Sucesso!',
          message:
            'Plano semanal criado com sucesso! O que você gostaria de fazer agora?',
          confirmText: 'Definir como Ativo e Ver Lista',
          cancelText: 'Apenas Ver Lista',
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
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      modal.showError(
        'Não foi possível salvar o plano semanal. Tente novamente.',
        'Erro!',
      );
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
  ]);

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
          {isLoading ? 'Salvando...' : isEditing ? 'Atualizar' : 'Criar'}
        </Text>
      </TouchableOpacity>
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

  const completedDays = days.filter(d => d.workoutId !== null).length;

  return (
    <>
      <ScrollView style={styles.container}>
        <WeeklyPlanForm
          planName={planName}
          onPlanNameChange={setPlanName}
          description={description}
          onDescriptionChange={setDescription}
          completedDays={completedDays}
        />

        <Text variant="subtitle" style={styles.sectionTitle}>
          Planejamento da Semana:
        </Text>

        <View style={styles.daysContainer}>
          {days.map(day => (
            <DayScheduleCard
              key={day.day}
              day={day.day}
              dayLabel={dayLabels[day.day]}
              workoutName={getWorkoutName(day.workoutId)}
              onPress={handleDayPress}
            />
          ))}
        </View>

        {/* REMOVIDO: FormActions */}

        {!isEditing && (
          <TipCard tip="💡 Dica: Você pode usar divisões como ABC, ABCD, ou Push/Pull/Pernas" />
        )}
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
  sectionTitle: {
    marginBottom: 16,
    color: '#FFF',
  },
  daysContainer: {
    marginBottom: 20,
  },
});
