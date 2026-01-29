// components/molecules/QuickActions.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from '../atoms/Button';

interface QuickActionsProps {
  onNavigateExercises: () => void;
  onNavigateWorkouts: () => void;
  onNavigateWeeklyPlans: () => void;
  onNavigateWater: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  onNavigateExercises,
  onNavigateWorkouts,
  onNavigateWeeklyPlans,
  onNavigateWater,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.actionRow}>
        <Button
          title="Exercícios"
          onPress={onNavigateExercises}
          style={styles.halfButton}
        />
        <Button
          title="Treinos"
          onPress={onNavigateWorkouts}
          style={styles.halfButton}
        />
      </View>
      
      <View style={styles.actionRow}>
        <Button
          title="Divisões"
          onPress={onNavigateWeeklyPlans}
          style={styles.halfButton}
        />
        <Button
          title="Água"
          onPress={onNavigateWater}
          style={styles.halfButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    marginBottom: 30,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  halfButton: {
    flex: 1,
    marginHorizontal: 4,
  },
});