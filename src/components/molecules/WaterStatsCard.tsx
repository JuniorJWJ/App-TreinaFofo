// components/molecules/WaterStatsCard.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '../atoms/Text';

interface WaterStatsCardProps {
  progress: number;
  remaining: number;
  currentIntake: number;
}

export const WaterStatsCard: React.FC<WaterStatsCardProps> = ({
  progress,
  remaining,
  currentIntake,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.statItem}>
        <Text variant="title" style={styles.statValue}>
          {Math.round(progress * 100)}%
        </Text>
        <Text variant="caption">Progresso</Text>
      </View>
      <View style={styles.statItem}>
        <Text variant="title" style={styles.statValue}>
          {Math.max(0, Math.ceil(remaining / 250))}
        </Text>
        <Text variant="caption">Copos restantes</Text>
      </View>
      <View style={styles.statItem}>
        <Text variant="title" style={styles.statValue}>
          {(currentIntake / 1000).toFixed(1)}L
        </Text>
        <Text variant="caption">Total hoje</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#F8F9FA',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    color: '#4A90E2',
  },
});