import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { useWeeklyPlanStore } from '../store';
import { useWorkoutStore } from '../store';
import { Text } from '../components/atoms/Text';
import { Input } from '../components/atoms/Input';
import { Button } from '../components/atoms/Button';
import { WorkoutSelectorModal } from '../components/molecules/WorkoutSelectorModal';
import { DayOfWeek, DailyWorkout } from '../types';

interface CreateWeeklyPlanScreenProps {
  navigation: any;
  route?: any;
}

export const CreateWeeklyPlanScreen: React.FC<CreateWeeklyPlanScreenProps> = ({ navigation, route }) => {
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
        <Text variant="title" align="center">
          {isEditing ? 'Editar Plano Semanal' : 'Criar Plano Semanal'}
        </Text>

        <Input
          placeholder="Nome do plano (ex: Semana 1 - Hipertrofia)"
          value={planName}
          onChangeText={setPlanName}
          style={styles.input}
        />

        <Input
          placeholder="Descrição (opcional)"
          value={description}
          onChangeText={setDescription}
          style={styles.input}
          multiline
        />

        <View style={styles.stats}>
          <Text variant="caption">
            {completedDays}/7 dias com treino definido
          </Text>
        </View>

        <Text variant="subtitle" style={styles.sectionTitle}>
          Planejamento da Semana:
        </Text>

        <View style={styles.daysContainer}>
          {days.map((day) => (
            <View key={day.day} style={styles.dayCard}>
              <Text variant="body" style={styles.dayLabel}>
                {dayLabels[day.day]}
              </Text>
              <Button
                title={getWorkoutName(day.workoutId)}
                onPress={() => handleDayPress(day.day)}
                style={[
                  styles.workoutButton,
                  day.workoutId ? styles.hasWorkout : styles.restDay
                ]}
              />
            </View>
          ))}
        </View>

        <View style={styles.buttonsContainer}>
          <Button
            title="Cancelar"
            onPress={() => navigation.goBack()}
            style={[styles.button, styles.cancelButton]}
          />
          <Button
            title={isEditing ? 'Atualizar Plano' : 'Criar Plano'}
            onPress={handleSave}
            style={[styles.button, styles.saveButton]}
            disabled={!planName.trim()}
          />
        </View>

        {!isEditing && (
          <View style={styles.tipContainer}>
            <Text variant="caption" style={styles.tipText}>
              💡 Dica: Você pode usar divisões como ABC, ABCD, ou Push/Pull/Legs
            </Text>
          </View>
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
    backgroundColor: '#F5F5F5',
  },
  input: {
    marginBottom: 16,
  },
  stats: {
    alignItems: 'center',
    marginBottom: 20,
    padding: 12,
    backgroundColor: '#FFF',
    borderRadius: 8,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  daysContainer: {
    marginBottom: 20,
  },
  dayCard: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  dayLabel: {
    fontWeight: '600',
    marginBottom: 8,
  },
  workoutButton: {
    marginBottom: 0,
  },
  hasWorkout: {
    backgroundColor: '#d15710ff',
  },
  restDay: {
    backgroundColor: '#6C757D',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
  },
  cancelButton: {
    backgroundColor: '#6C757D',
  },
  saveButton: {
    backgroundColor: '#28A745',
  },
  tipContainer: {
    padding: 12,
    backgroundColor: '#E7F3FF',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#d15710ff',
  },
  tipText: {
    color: '#0056B3',
  },
});
