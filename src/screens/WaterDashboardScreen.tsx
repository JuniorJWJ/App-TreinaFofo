// src/screens/WaterDashboardScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WaterDashboard } from '../screens/WaterDashboard';

export const WaterDashboardScreen = () => {
  const [currentIntake, setCurrentIntake] = useState(0);
  const [dailyGoal, setDailyGoal] = useState(4000);

  // Carrega os dados salvos ao iniciar
  useEffect(() => {
    loadWaterData();
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

  return (
    <View style={styles.container}>
      <WaterDashboard
        dailyGoal={dailyGoal}
        currentIntake={currentIntake}
        onAddWater={handleAddWater}
        onReset={handleResetDay}
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