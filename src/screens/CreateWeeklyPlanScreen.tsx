// CreateWeeklyPlanScreen.tsx (refatorado)
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { useWeeklyPlanStore } from '../store';
import { useWorkoutStore } from '../store';
import { Text } from '../components/atoms/Text';
import { WeeklyPlanForm } from '../components/molecules/WeeklyPlanForm';
import { DayScheduleCard } from '../components/molecules/DayScheduleCard';
import { FormActions } from '../components/molecules/FormActions';
import { TipCard } from '../components/molecules/TipCard';
import { WorkoutSelectorModal } from '../components/molecules/WorkoutSelectorModal';
import { DayOfWeek, DailyWorkout } from '../types';

interface CreateWeeklyPlanScreenProps {
  navigation: any;
  route?: any;
}

export const CreateWeeklyPlanScreen: React.FC<CreateWeeklyPlanScreenProps> = ({ 
  navigation, 
  route 
}) => {
  const { addWeeklyPlan, updateWeeklyPlan, weeklyPlans, setActivePlan } = useWeeklyPlanStore();
  const { workouts } = useWorkoutStore();
  
  const isEditing = route?.params?.planId;
  const existingPlan = isEditing ? weeklyPlans.find(p => p.id === route.params.planId) : null;

  const [planName, setPlanName] = useState(existingPlan?.name || '');
  const [description, setDescription] = useState(existingPlan?.description || '');
  
  const [days, setDays] = useState<DailyWorkout[]>(existingPlan?.days || [
    { day: 'monday', workoutId: null, isCompleted: false, completedAt: undefined, notes: '' },
    { day: 'tuesday', workoutId: null, isCompleted: false, completedAt: undefined, notes: '' },
    { day: 'wednesday', workoutId: null, isCompleted: false, completedAt: undefined, notes: '' },
    { day: 'thursday', workoutId: null, isCompleted: false, completedAt: undefined, notes: '' },
    { day: 'friday', workoutId: null, isCompleted: false, completedAt: undefined, notes: '' },
    { day: 'saturday', workoutId: null, isCompleted: false, completedAt: undefined, notes: '' },
    { day: 'sunday', workoutId: null, isCompleted: false, completedAt: undefined, notes: '' },
  ]);

  const dayLabels: Record<DayOfWeek, string> = {
    monday: 'Segunda-feira',
    tuesday: 'Terça-feira',
    wednesday: 'Quarta-feira',
    thursday: 'Quinta-feira',
    friday: 'Sexta-feira',
    saturday: 'Sábado',
    sunday: 'Domingo',
  };

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
    setDays(prevDays => prevDays.map(d => d.day === day ? { ...d, workoutId } : d));
  };

  const handleSelectWorkout = (workoutId: string | null) => {
    if (selectedDay) updateDayWorkout(selectedDay, workoutId);
    setModalVisible(false);
  };

  const handleSave = () => {
    if (!planName.trim()) {
      Alert.alert('Atenção', 'Digite um nome para o plano semanal');
      return;
    }

    const planData = {
      name: planName.trim(),
      description: description.trim(),
      days,
      startDate: existingPlan?.startDate || new Date(),
      endDate: existingPlan?.endDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      workoutSplitId: existingPlan?.workoutSplitId,
      isActive: existingPlan?.isActive || false,
      isTemplate: existingPlan?.isTemplate || false,
      currentWeek: existingPlan?.currentWeek || 1,
      completedDays: existingPlan?.completedDays || 0,
      completionRate: existingPlan?.completionRate || 0,
    };

    if (isEditing && existingPlan) {
      updateWeeklyPlan(existingPlan.id, planData);
      Alert.alert('Sucesso', 'Plano semanal atualizado!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } else {
      const newPlanId = `wp-${Date.now()}`;
      addWeeklyPlan({
        ...planData,
        id: newPlanId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      Alert.alert('Sucesso', 'Plano semanal criado!', [
        { 
          text: 'Definir como Ativo', 
          onPress: () => {
            setActivePlan(newPlanId);
            navigation.navigate('WeeklyPlanList');
          }
        },
        { 
          text: 'OK', 
          onPress: () => navigation.navigate('WeeklyPlanList')
        }
      ]);
    }
  };

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
          {days.map((day) => (
            <DayScheduleCard
              key={day.day}
              day={day.day}
              dayLabel={dayLabels[day.day]}
              workoutName={getWorkoutName(day.workoutId)}
              onPress={handleDayPress}
            />
          ))}
        </View>

        <FormActions
          isEditing={isEditing}
          onSave={handleSave}
          onCancel={() => navigation.goBack()}
          isSaveDisabled={!planName.trim()}
        />

        {!isEditing && (
          <TipCard tip="💡 Dica: Você pode usar divisões como ABC, ABCD, ou Push/Pull/Pernas" />
        )}
      </ScrollView>

      {/* Modal */}
      <WorkoutSelectorModal
        visible={isModalVisible}
        workouts={workouts}
        onClose={() => setModalVisible(false)}
        onSelect={handleSelectWorkout}
      />
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