// components/molecules/WaterProgressMiniChart.tsx
import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { ProgressCircle } from 'react-native-svg-charts';
import { Text } from '../../atoms/Text';

interface WaterProgressMiniChartProps {
  currentIntake: number;
  dailyGoal: number;
  onPress?: () => void;
  compact?: boolean;
}

export const WaterProgressMiniChart: React.FC<WaterProgressMiniChartProps> = ({
  currentIntake,
  dailyGoal,
  onPress,
  compact = true,
}) => {
  const progress = Math.min(currentIntake / dailyGoal, 1);
  
  const getProgressColor = () => {
    if (progress >= 1) return "#4CAF50";
    if (progress >= 0.7) return "#8BC34A";
    if (progress >= 0.4) return "#483148";
    return "#F44336";
  };

  const chartSize = compact ? 80 : 100;
  const fontSize = compact ? 11 : 13;

  // eslint-disable-next-line react/no-unstable-nested-components
  const ChartContent = () => (
    <View style={[styles.container, compact && styles.compactContainer]}>
      <ProgressCircle
        style={{ height: chartSize, width: chartSize }}
        progress={progress}
        progressColor={getProgressColor()}
        backgroundColor="#E0E0E0"
        strokeWidth={8}
      />
      <View style={styles.textContainer}>
        <Text 
          variant="caption" 
          style={[styles.amountText, { fontSize: fontSize + 2 }]}
        >
          {currentIntake}ml
        </Text>
        <Text 
          variant="caption" 
          style={[styles.goalText, { fontSize }]}
        >
          de 
        </Text>
        <Text
          variant="caption"
          style={[styles.goalText, { fontSize }]}
        >
          {dailyGoal}ml
        </Text>
      </View>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity 
        onPress={onPress} 
        activeOpacity={0.7}
        style={styles.touchableContainer}
      >
        <ChartContent />
      </TouchableOpacity>
    );
  }

  return <ChartContent />;
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  compactContainer: {
    margin: 4,
  },
  touchableContainer: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  textContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  amountText: {
    fontWeight: 'bold',
    color: '#332B33',
  },
  goalText: {
    color: '#666',
  },
});