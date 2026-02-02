// components/molecules/TodayWorkoutCard.tsx
import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from '../atoms/Text';

interface TodayWorkoutCardProps {
  workoutName: string;
  exerciseCount?: number;
  estimatedDuration?: number;
  isCompleted: boolean;
  onPress: () => void;
}

export const TodayWorkoutCard: React.FC<TodayWorkoutCardProps> = ({
  workoutName,
  exerciseCount,
  estimatedDuration,
  isCompleted,
  onPress,
}) => {
  return (
    <View style={styles.container}>
      <Text variant="subtitle" style={styles.sectionTitle}>
        Treino de Hoje
      </Text>
      <TouchableOpacity 
        style={styles.card}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <Text variant="body" style={styles.workoutName}>
          {workoutName}
        </Text>
        {exerciseCount !== undefined && estimatedDuration !== undefined && (
          <Text variant="caption">
            {exerciseCount} exercícios • {estimatedDuration} min
          </Text>
        )}
        <View style={[
          styles.statusIndicator,
          isCompleted ? styles.completedIndicator : styles.pendingIndicator
        ]}>
          <Text style={styles.statusIndicatorText}>
            {isCompleted ? '✓ Concluído' : 'Toque para ver detalhes'}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  sectionTitle: {
    marginBottom: 12,
  },
  card: {
    alignItems: 'center',
  },
  workoutName: {
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  statusIndicator: {
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    width: '100%',
    alignItems: 'center',
  },
  completedIndicator: {
    backgroundColor: '#3d833dff',
    borderColor: '#28A745',
    borderWidth: 1,
  },
  pendingIndicator: {
    backgroundColor: '#483148',
    borderColor: '#483148',
    borderWidth: 1,
  },
  statusIndicatorText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});