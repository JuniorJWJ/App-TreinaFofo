// src/screens/WaterDashboardScreen.tsx 
import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WaterDashboard } from '../components/molecules/WaterDashboard';
import { WaterGoalModal } from '../components/molecules/WaterGoalModal';
import { useWaterTracker } from '../hooks/useWaterTracker';

export const WaterDashboardScreen = () => {
  const [goalModalVisible, setGoalModalVisible] = useState(false);
  const [userWeight, setUserWeight] = useState<number | null>(null);
  const [userActivityLevel, setUserActivityLevel] = useState<'sedentary' | 'light' | 'moderate' | 'intense'>('sedentary');
  const [userClimate, setUserClimate] = useState<'temperate' | 'cold' | 'hot'>('temperate');

  const {
    currentIntake,
    dailyGoal,
    isLoading,
    addWater,
    resetDay,
    updateGoal,
  } = useWaterTracker();

  // Carrega dados do perfil
  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const [savedWeight, savedActivityLevel, savedClimate] = await Promise.all([
        AsyncStorage.getItem('userWeight'),
        AsyncStorage.getItem('userActivityLevel'),
        AsyncStorage.getItem('userClimate'),
      ]);
      
      if (savedWeight) setUserWeight(parseFloat(savedWeight));
      if (savedActivityLevel) {
        const validLevels = ['sedentary', 'light', 'moderate', 'intense'] as const;
        const level = validLevels.includes(savedActivityLevel as any)
          ? (savedActivityLevel as typeof validLevels[number])
          : 'sedentary';
        setUserActivityLevel(level);
      }
      if (savedClimate) {
        const validClimates = ['temperate', 'cold', 'hot'] as const;
        const climate = validClimates.includes(savedClimate as any)
          ? (savedClimate as typeof validClimates[number])
          : 'temperate';
        setUserClimate(climate);
      }
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
    }
  };

  const handleSaveProfile = (profile: {
    weight: number;
    activityLevel: string;
    climate: string;
  }) => {
    setUserWeight(profile.weight);
    const validLevels = ['sedentary', 'light', 'moderate', 'intense'] as const;
    const level = validLevels.includes(profile.activityLevel as any)
      ? (profile.activityLevel as typeof validLevels[number])
      : 'sedentary';
    setUserActivityLevel(level);
    const validClimates = ['temperate', 'cold', 'hot'] as const;
    const climate = validClimates.includes(profile.climate as any)
      ? (profile.climate as typeof validClimates[number])
      : 'temperate';
    setUserClimate(climate);
    
    saveProfileToStorage(profile);
  };

  const saveProfileToStorage = async (profile: {
    weight: number;
    activityLevel: string;
    climate: string;
  }) => {
    try {
      await Promise.all([
        AsyncStorage.setItem('userWeight', profile.weight.toString()),
        AsyncStorage.setItem('userActivityLevel', profile.activityLevel),
        AsyncStorage.setItem('userClimate', profile.climate),
      ]);
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
    }
  };

  const handleAdjustGoal = () => setGoalModalVisible(true);

  if (isLoading) {
    return <View style={styles.container} />; // ou um loading spinner
  }

  return (
    <View style={styles.container}>
      <WaterDashboard
        dailyGoal={dailyGoal}
        currentIntake={currentIntake}
        onAddWater={addWater}
        onReset={resetDay}
        onAdjustGoal={handleAdjustGoal}
      />

      <WaterGoalModal
        visible={goalModalVisible}
        currentGoal={dailyGoal}
        onClose={() => setGoalModalVisible(false)}
        onSave={updateGoal}
        weight={userWeight || undefined}
        activityLevel={userActivityLevel}
        climate={userClimate}
        onProfileSave={handleSaveProfile}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});