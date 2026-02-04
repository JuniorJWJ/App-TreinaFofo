// components/molecules/timer/TimerDisplay.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface TimerDisplayProps {
  milliseconds: number;
  showHours?: boolean;
  showMilliseconds?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({ 
  milliseconds, 
  showHours = false,
  showMilliseconds = true,
  size = 'medium'
}) => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const ms = milliseconds % 1000;
  
  const sizeStyles = {
    small: {
      timeText: styles.timeTextSmall,
      unitText: styles.unitTextSmall,
    },
    medium: {
      timeText: styles.timeTextMedium,
      unitText: styles.unitTextMedium,
    },
    large: {
      timeText: styles.timeTextLarge,
      unitText: styles.unitTextLarge,
    },
  };

  const selectedSize = sizeStyles[size];

  const formatTime = () => {
    const parts = [];
    
    if (showHours || hours > 0) {
      parts.push(hours.toString().padStart(2, '0'));
    }
    
    parts.push(minutes.toString().padStart(2, '0'));
    parts.push(seconds.toString().padStart(2, '0'));
    
    let timeString = parts.join(':');
    
    if (showMilliseconds) {
      const msString = Math.floor(ms / 10).toString().padStart(2, '0');
      timeString += `.${msString}`;
    }
    
    return timeString;
  };

  return (
    <View style={styles.container}>
      <Text style={[selectedSize.timeText, styles.timeText]}>
        {formatTime()}
      </Text>
      {/* <Text style={[selectedSize.unitText, styles.unitText]}>
        {showHours || hours > 0 ? 'HH:MM:SS' : 'MM:SS'}
      </Text> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeText: {
    color: '#FFFFFF',
    fontFamily: 'monospace',
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  timeTextSmall: {
    fontSize: 24,
  },
  timeTextMedium: {
    fontSize: 36,
  },
  timeTextLarge: {
    fontSize: 48,
  },
  unitText: {
    color: '#8a8a8a',
    marginTop: 4,
    letterSpacing: 1,
  },
  unitTextSmall: {
    fontSize: 10,
  },
  unitTextMedium: {
    fontSize: 12,
  },
  unitTextLarge: {
    fontSize: 14,
  },
});