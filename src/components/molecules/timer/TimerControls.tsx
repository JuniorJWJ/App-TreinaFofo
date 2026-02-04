// components/molecules/timer/TimerControls.tsx
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

interface TimerControlsProps {
  isRunning: boolean;
  onStartPause: () => void;
  onReset: () => void;
  onAddLap?: () => void;
  showLapButton?: boolean;
}

export const TimerControls: React.FC<TimerControlsProps> = ({
  isRunning,
  onStartPause,
  onReset,
  onAddLap,
  showLapButton = true,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={[styles.button, styles.resetButton]} 
        onPress={onReset}
      >
        <Text style={[styles.lapText, !isRunning && styles.disabled]}>⏹️</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, styles.mainButton]} 
        onPress={onStartPause}
      >
        <Text style={styles.iconText}>
          {isRunning ? '⏸️' : '▶️'}
        </Text>
      </TouchableOpacity>

      {showLapButton && onAddLap && (
        <TouchableOpacity 
          style={[styles.button, styles.lapButton]} 
          onPress={onAddLap}
          disabled={!isRunning}
        >
          <Text style={[styles.lapText, !isRunning && styles.disabled]}>
            🚩
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  button: {
    padding: 12,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainButton: {
    backgroundColor: '#483148',
    width: 70,
    height: 70,
  },
  resetButton: {
    backgroundColor: '#483148',
    width: 50,
    height: 50,
  },
  lapButton: {
    backgroundColor: '#483148',
    width: 50,
    height: 50,
  },
  iconText: {
    fontSize: 24,
  },
  lapText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.4,
  },
});