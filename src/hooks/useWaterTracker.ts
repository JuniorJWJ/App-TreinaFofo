// hooks/useWaterTracker.ts
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UseWaterTrackerProps {
  initialGoal?: number;
  initialIntake?: number;
}

export const useWaterTracker = ({ 
  initialGoal = 4000, 
  initialIntake = 0 
}: UseWaterTrackerProps = {}) => {
  const [currentIntake, setCurrentIntake] = useState(initialIntake);
  const [dailyGoal, setDailyGoal] = useState(initialGoal);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadWaterData();
  }, []);

  const loadWaterData = async () => {
    try {
      const [savedIntake, savedGoal] = await Promise.all([
        AsyncStorage.getItem('waterIntake'),
        AsyncStorage.getItem('waterGoal'),
      ]);
      
      if (savedIntake) setCurrentIntake(parseInt(savedIntake));
      if (savedGoal) setDailyGoal(parseInt(savedGoal));
    } catch (error) {
      console.error('Erro ao carregar dados de água:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addWater = async (amount: number) => {
    const newIntake = currentIntake + amount;
    setCurrentIntake(newIntake);
    await AsyncStorage.setItem('waterIntake', newIntake.toString());
  };

  const resetDay = async () => {
    setCurrentIntake(0);
    await AsyncStorage.setItem('waterIntake', '0');
  };

  const updateGoal = async (newGoal: number) => {
    setDailyGoal(newGoal);
    await AsyncStorage.setItem('waterGoal', newGoal.toString());
  };

  return {
    currentIntake,
    dailyGoal,
    isLoading,
    addWater,
    resetDay,
    updateGoal,
  };
};