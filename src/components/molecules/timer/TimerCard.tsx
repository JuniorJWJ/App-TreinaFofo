// components/molecules/timer/TimerCard.tsx
import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Vibration } from 'react-native';
import { TimerDisplay } from './TimerDisplay';
import { TimerControls } from './TimerControls';
import { Text } from 'react-native-gesture-handler';

interface TimerCardProps {
  initialTime?: number; // em segundos
  onTimeUpdate?: (time: number) => void; // em segundos para compatibilidade
  autoStart?: boolean;
  showHours?: boolean;
  showLaps?: boolean;
  maxLaps?: number;
}

interface Lap {
  id: string;
  time: number; // em milissegundos
  number: number;
}

export const TimerCard: React.FC<TimerCardProps> = ({ 
  initialTime = 0, 
  onTimeUpdate,
  autoStart = false,
  showHours = false,
  showLaps = true,
  maxLaps = 5
}) => {
  // Converter segundos para milissegundos
  const [time, setTime] = useState(initialTime * 1000);
  const [isRunning, setIsRunning] = useState(autoStart);
  const [laps, setLaps] = useState<Lap[]>([]);
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
        onTimeUpdate?.(Math.floor(elapsed / 1000));
      }, 10);
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
      const newLap: Lap = {
        id: Date.now().toString(),
        time,
        number: laps.length + 1
      };
      setLaps(prev => [newLap, ...prev]);
      Vibration.vibrate(100);
    }
  };

  const formatLapTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    const ms = Math.floor((milliseconds % 1000) / 10);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };

  const formatDiffTime = (current: number, previous?: number) => {
    if (!previous) return '+0.00';
    
    const diff = current - previous;
    const absDiff = Math.abs(diff);
    const sign = diff >= 0 ? '+' : '-';
    
    const totalSeconds = Math.floor(absDiff / 1000);
    const secs = totalSeconds % 60;
    const ms = Math.floor((absDiff % 1000) / 10);
    
    return `${sign}${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      {/* Display do Timer */}
      <TimerDisplay 
        milliseconds={time}
        showHours={showHours}
        showMilliseconds={true}
        size="large"
      />

      {/* Controles */}
      <TimerControls
        isRunning={isRunning}
        onStartPause={handleStartPause}
        onReset={handleReset}
        onAddLap={handleAddLap}
        showLapButton={true}
      />

      {/* Lista de Voltas */}
      {showLaps && laps.length > 0 && (
        <View style={styles.lapsContainer}>
          <Text style={styles.lapsTitle}>VOLTAS</Text>
          <View style={styles.lapsList}>
            {laps.slice(0, maxLaps).map((lap, index) => (
              <View key={lap.id} style={styles.lapItem}>
                <View style={styles.lapHeader}>
                  <Text style={styles.lapNumber}>Volta {lap.number}</Text>
                  <Text style={styles.lapDiff}>
                    {formatDiffTime(lap.time, laps[index + 1]?.time)}
                  </Text>
                </View>
                <Text style={styles.lapTime}>{formatLapTime(lap.time)}</Text>
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
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#3a3431',
    borderRadius: 8,
  },
  lapHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  lapNumber: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  lapDiff: {
    color: '#8a8a8a',
    fontSize: 12,
    fontFamily: 'monospace',
  },
  lapTime: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'monospace',
    fontWeight: 'bold',
  },
});