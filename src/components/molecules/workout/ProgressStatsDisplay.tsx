// components/molecules/ProgressStatsDisplay.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '../../atoms/Text';
import { ProgressCircle } from 'react-native-svg-charts';


interface ProgressStatsDisplayProps {
  currentIntake: number;
  dailyGoal: number;
  progress: number;
  remaining: number;
}

export const ProgressStatsDisplay: React.FC<ProgressStatsDisplayProps> = ({
  currentIntake,
  dailyGoal,
  progress,
  remaining,
}) => {
  return (
    <View style={styles.progressContainer}>
      <ProgressCircle
        style={styles.progressCircle}
        progress={progress}
        progressColor={progress >= 1 ? "#4CAF50" : "#4A90E2"}
        backgroundColor="#E0E0E0"
        strokeWidth={20}
      />
      <View style={styles.progressTextContainer}>
        <Text variant="title" style={styles.currentAmount}>
          {currentIntake}ml
        </Text>
        <Text variant="caption">de {dailyGoal}ml</Text>
        <Text 
          variant="caption" 
          style={[
            styles.remainingText,
            progress >= 1 && { color: '#4CAF50', fontWeight: 'bold' }
          ]}>
          {remaining > 0 
            ? `${remaining}ml restantes` 
            : 'Meta alcançada! 🎉'
          }
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  progressContainer: {
    alignItems: 'center',
    marginVertical: 30,
  },
  progressCircle: {
    height: 200,
    width: 200,
  },
  progressTextContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  currentAmount: {
    fontSize: 32,
    color: '#4A90E2',
  },
  remainingText: {
    marginTop: 4,
    color: '#666',
  },
});