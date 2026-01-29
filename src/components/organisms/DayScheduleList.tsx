import React from 'react';
import { View, StyleSheet } from 'react-native';
import { DayScheduleCard } from '../molecules/cards/DayScheduleCard';
import { DayOfWeek, DailyWorkout } from '../../types';

interface DayScheduleListProps {
  days: DailyWorkout[];
  dayLabels: Record<DayOfWeek, string>;
  getWorkoutName: (workoutId: string | null) => string;
  onDayPress: (day: DayOfWeek) => void;
}

export const DayScheduleList: React.FC<DayScheduleListProps> = ({
  days,
  dayLabels,
  getWorkoutName,
  onDayPress,
}) => {
  return (
    <View style={styles.container}>
      {days.map(day => (
        <DayScheduleCard
          key={day.day}
          day={day.day}
          dayLabel={dayLabels[day.day]}
          workoutName={getWorkoutName(day.workoutId)}
          onPress={() => onDayPress(day.day)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
});