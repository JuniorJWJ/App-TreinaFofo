// src/screens/WaterDashboardScreen.tsx - ATUALIZADO
import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WaterDashboard } from './WaterDashboard';
import { WaterGoalModal } from '../components/molecules/WaterGoalModal';

export const WaterDashboardScreen = () => {
  const [currentIntake, setCurrentIntake] = useState(0);
  const [dailyGoal, setDailyGoal] = useState(4000);
  const [goalModalVisible, setGoalModalVisible] = useState(false);
  
  // Dados do perfil (para usar na calculadora)
  const [userWeight, setUserWeight] = useState<number | null>(null);
  const [userActivityLevel, setUserActivityLevel] = useState<'sedentary' | 'light' | 'moderate' | 'intense'>('sedentary');
  const [userClimate, setUserClimate] = useState<'temperate' | 'cold' | 'hot'>('temperate');

  // Carrega os dados salvos ao iniciar
  useEffect(() => {
    loadWaterData();
    loadUserProfile();
  }, []);

  const loadWaterData = async () => {
    try {
      const savedIntake = await AsyncStorage.getItem('waterIntake');
      const savedGoal = await AsyncStorage.getItem('waterGoal');
      
      if (savedIntake) {
        setCurrentIntake(parseInt(savedIntake));
      }
      if (savedGoal) {
        setDailyGoal(parseInt(savedGoal));
      }
    } catch (error) {
      console.error('Erro ao carregar dados de água:', error);
    }
  };

  const loadUserProfile = async () => {
    try {
      const savedWeight = await AsyncStorage.getItem('userWeight');
      const savedActivityLevel = await AsyncStorage.getItem('userActivityLevel');
      const savedClimate = await AsyncStorage.getItem('userClimate');
      
      if (savedWeight) {
        setUserWeight(parseFloat(savedWeight));
      }
      if (savedActivityLevel) {
        const validLevels = ['sedentary', 'light', 'moderate', 'intense'] as const;
        const level = (validLevels.includes(savedActivityLevel as any)
          ? (savedActivityLevel as 'sedentary' | 'light' | 'moderate' | 'intense')
          : 'sedentary');
        setUserActivityLevel(level);
      }
      if (savedClimate) {
        const validClimates = ['temperate', 'cold', 'hot'] as const;
        const climate = (validClimates.includes(savedClimate as any)
          ? (savedClimate as 'temperate' | 'cold' | 'hot')
          : 'temperate');
        setUserClimate(climate);
      }
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
    }
  };

  const handleAddWater = async (amount: number) => {
    const newIntake = currentIntake + amount;
    setCurrentIntake(newIntake);
    
    try {
      await AsyncStorage.setItem('waterIntake', newIntake.toString());
    } catch (error) {
      console.error('Erro ao salvar ingestão de água:', error);
    }
  };

  const handleResetDay = async () => {
    setCurrentIntake(0);
    try {
      await AsyncStorage.setItem('waterIntake', '0');
    } catch (error) {
      console.error('Erro ao resetar água:', error);
    }
  };

  const handleSaveGoal = async (newGoal: number) => {
    setDailyGoal(newGoal);
    try {
      await AsyncStorage.setItem('waterGoal', newGoal.toString());
    } catch (error) {
      console.error('Erro ao salvar meta de água:', error);
    }
  };

  const handleSaveProfile = async (profile: {
    weight: number;
    activityLevel: 'sedentary' | 'light' | 'moderate' | 'intense';
    climate: string;
  }) => {
    setUserWeight(profile.weight);
    setUserActivityLevel(profile.activityLevel);
    const validClimates = ['temperate', 'cold', 'hot'] as const;
    const climate = (validClimates.includes(profile.climate as any)
      ? (profile.climate as 'temperate' | 'cold' | 'hot')
      : 'temperate');
    setUserClimate(climate);
    
    try {
      await AsyncStorage.setItem('userWeight', profile.weight.toString());
      await AsyncStorage.setItem('userActivityLevel', profile.activityLevel);
      await AsyncStorage.setItem('userClimate', profile.climate);
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
    }
  }; 

  const handleAdjustGoal = () => {
    setGoalModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <WaterDashboard
        dailyGoal={dailyGoal}
        currentIntake={currentIntake}
        onAddWater={handleAddWater}
        onReset={handleResetDay}
        onAdjustGoal={handleAdjustGoal}
      />

      <WaterGoalModal
        visible={goalModalVisible}
        currentGoal={dailyGoal}
        onClose={() => setGoalModalVisible(false)}
        onSave={handleSaveGoal}
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

export default WaterDashboardScreen;