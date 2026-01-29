// components/molecules/WorkoutStats.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '../atoms/Text';

interface WorkoutStatsProps {
  exerciseCount: number;
  totalSets: number;
  estimatedDuration: number;
}

export const WorkoutStats: React.FC<WorkoutStatsProps> = ({
  exerciseCount,
  totalSets,
  estimatedDuration,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.statItem}>
        <Text variant="title" style={styles.statNumber}>
          {exerciseCount}
        </Text>
        <Text variant="caption" align="center">
          Exercícios
        </Text>
      </View>
      
      <View style={styles.statItem}>
        <Text variant="title" style={styles.statNumber}>
          {totalSets}
        </Text>
        <Text variant="caption" align="center">
          Séries
        </Text>
      </View>
      
      <View style={styles.statItem}>
        <Text variant="title" style={styles.statNumber}>
          {estimatedDuration}
        </Text>
        <Text variant="caption" align="center">
          Minutos
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    color: '#483148',
    marginBottom: 4,
  },
});