// components/molecules/cards/TimerCard.tsx
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Vibration } from 'react-native';

interface TimerCardProps {
  initialTime?: number; // em segundos
  onTimeUpdate?: (time: number) => void; // em segundos para compatibilidade
  autoStart?: boolean;
}

export const TimerCard: React.FC<TimerCardProps> = ({ 
  initialTime = 0, 
  onTimeUpdate,
  autoStart = false 
}) => {
  // Converter segundos para milissegundos
  const [time, setTime] = useState(initialTime * 1000);
  const [isRunning, setIsRunning] = useState(autoStart);
  const [laps, setLaps] = useState<number[]>([]); // Armazenar em milissegundos
  const intervalRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const accumulatedTimeRef = useRef<number>(initialTime * 1000);

  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = Date.now() - accumulatedTimeRef.current;
      
      intervalRef.current = setInterval(() => {
        const elapsed = Date.now() - startTimeRef.current;
        setTime(elapsed);
        accumulatedTimeRef.current = elapsed;
        onTimeUpdate?.(Math.floor(elapsed / 1000)); // Em segundos para compatibilidade
      }, 10); // Atualizar a cada 10ms para milésimos
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, onTimeUpdate]);

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    const ms = Math.floor((milliseconds % 1000) / 10); // Mostrar centésimos (2 dígitos)
    
    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };

  const handleStartPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    const resetTime = initialTime * 1000;
    setTime(resetTime);
    accumulatedTimeRef.current = resetTime;
    setLaps([]);
    Vibration.vibrate(50);
  };

  const handleAddLap = () => {
    if (isRunning) {
      setLaps(prev => [time, ...prev]);
      Vibration.vibrate(100);
    }
  };

  // Formatar tempo para voltas (sem milésimos para maior legibilidade)
  const formatLapTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.timerDisplay}>
        <Text style={styles.timerText}>{formatTime(time)}</Text>
        <Text style={styles.timerLabel}>CRONÔMETRO</Text>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity 
          style={[styles.button, styles.resetButton]} 
          onPress={handleReset}
        >
          <Text style={[styles.lapText, !isRunning && styles.disabled]}>⏹️</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.mainButton]} 
          onPress={handleStartPause}
        >
          <Text style={styles.iconText}>
            {isRunning ? '⏸️' : '▶️'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.lapButton]} 
          onPress={handleAddLap}
          disabled={!isRunning}
        >
          <Text style={[styles.lapText, !isRunning && styles.disabled]}>
            🚩
          </Text>
        </TouchableOpacity>
      </View>

      {laps.length > 0 && (
        <View style={styles.lapsContainer}>
          <Text style={styles.lapsTitle}>VOLTAS</Text>
          <View style={styles.lapsList}>
            {laps.slice(0, 5).map((lap, index) => (
              <View key={index} style={styles.lapItem}>
                <Text style={styles.lapIndex}>Volta {laps.length - index}</Text>
                <Text style={styles.lapTime}>{formatLapTime(lap)}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2a2421',
    borderRadius: 16,
    padding: 20,
    marginVertical: 8,
  },
  timerDisplay: {
    alignItems: 'center',
    marginBottom: 24,
  },
  timerText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: 'monospace',
    letterSpacing: 2,
  },
  timerLabel: {
    fontSize: 12,
    color: '#8a8a8a',
    letterSpacing: 1,
    marginTop: 4,
  },
  controls: {
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
    backgroundColor: '#333',
    width: 50,
    height: 50,
  },
  lapButton: {
    backgroundColor: '#333',
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
  lapsContainer: {
    marginTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#3a3431',
    paddingTop: 16,
  },
  lapsTitle: {
    color: '#8a8a8a',
    fontSize: 12,
    marginBottom: 12,
    letterSpacing: 1,
  },
  lapsList: {
    gap: 8,
  },
  lapItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#3a3431',
    borderRadius: 8,
  },
  lapIndex: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  lapTime: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'monospace',
  },
});