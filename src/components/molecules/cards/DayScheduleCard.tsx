// components/molecules/DayScheduleCard.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '../../atoms/Text';
import { Button } from '../../atoms/Button';
import { DayOfWeek } from '../../../types/weeklyPlan';

interface DayScheduleCardProps {
  day: DayOfWeek;
  dayLabel: string;
  workoutName: string;
  onPress: (day: DayOfWeek) => void;
}

export const DayScheduleCard: React.FC<DayScheduleCardProps> = ({
  day,
  dayLabel,
  workoutName,
  onPress,
}) => {
  const isRestDay = workoutName === 'Descanso';

  return (
    <View style={styles.dayCard}>
      <Text variant="body" style={styles.dayLabel}>
        {dayLabel}
      </Text>
      <Button
        title={workoutName}
        onPress={() => onPress(day)}
        style={[
          styles.workoutButton,
          isRestDay ? styles.restDay : styles.hasWorkout,
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
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
    backgroundColor: '#483148',
  },
  restDay: {
    backgroundColor: '#6C757D',
  },
});