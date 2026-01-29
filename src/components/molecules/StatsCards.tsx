// components/molecules/StatsCards.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '../atoms/Text';

interface StatsCardsProps {
  totalExercises: number;
  totalMuscleGroups: number;
}

export const StatsCards: React.FC<StatsCardsProps> = ({
  totalExercises,
  totalMuscleGroups,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.statCard}>
        <Text variant="title" style={styles.statNumber}>
          {totalExercises}
        </Text>
        <Text variant="caption" align="center">
          Exercícios{'\n'}Cadastrados
        </Text>
      </View>
      
      <View style={styles.statCard}>
        <Text variant="title" style={styles.statNumber}>
          {totalMuscleGroups}
        </Text>
        <Text variant="caption" align="center">
          Grupos{'\n'}Musculares
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minHeight: 100,
    justifyContent: 'center',
  },
  statNumber: {
    color: '#483148',
    marginBottom: 8,
  },
});