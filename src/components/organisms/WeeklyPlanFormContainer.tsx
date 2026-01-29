import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '../atoms/Text';
import { WeeklyPlanForm } from '../molecules/forms/WeeklyPlanForm';
import { TipCard } from '../molecules/cards/TipCard';
import { DayScheduleList } from './DayScheduleList';
import { DayOfWeek, DailyWorkout } from '../../types';

interface WeeklyPlanFormContainerProps {
  planName: string;
  onPlanNameChange: (text: string) => void;
  description: string;
  onDescriptionChange: (text: string) => void;
  days: DailyWorkout[];
  onDayPress: (day: DayOfWeek) => void;
  getWorkoutName: (workoutId: string | null) => string;
  isEditing: boolean;
}

export const WeeklyPlanFormContainer: React.FC<WeeklyPlanFormContainerProps> = ({
  planName,
  onPlanNameChange,
  description,
  onDescriptionChange,
  days,
  onDayPress,
  getWorkoutName,
  isEditing,
}) => {
  const completedDays = days.filter(d => d.workoutId !== null).length;

  const dayLabels: Record<DayOfWeek, string> = {
    monday: 'Segunda-feira',
    tuesday: 'Terça-feira',
    wednesday: 'Quarta-feira',
    thursday: 'Quinta-feira',
    friday: 'Sexta-feira',
    saturday: 'Sábado',
    sunday: 'Domingo',
  };

  return (
    <View style={styles.container}>
      <WeeklyPlanForm
        planName={planName}
        onPlanNameChange={onPlanNameChange}
        description={description}
        onDescriptionChange={onDescriptionChange}
        completedDays={completedDays}
      />

      <Text variant="subtitle" style={styles.sectionTitle}>
        Planejamento da Semana:
      </Text>

      <DayScheduleList
        days={days}
        dayLabels={dayLabels}
        getWorkoutName={getWorkoutName}
        onDayPress={onDayPress}
      />

      {!isEditing && (
        <TipCard tip="💡 Dica: Você pode usar divisões como ABC, ABCD, ou Push/Pull/Pernas" />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionTitle: {
    marginBottom: 16,
    color: '#FFF',
  },
});