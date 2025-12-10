// components/WaterDashboard.tsx
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '../atoms/Text';
import { ProgressStatsDisplay } from '../molecules/ProgressStatsDisplay';
import { QuickWaterAddButtons } from '../molecules/QuickWaterAddButtons';
import { WaterStatsCard } from '../molecules/WaterStatsCard';
import { WaterActionsPanel } from '../molecules/WaterActionsPanel';
import { CustomWaterInputModal } from '../molecules/CustomWaterInputModal';

interface WaterDashboardProps {
  dailyGoal: number;
  currentIntake: number;
  onAddWater: (amount: number) => void;
  onReset?: () => void;
  onAdjustGoal?: () => void;
}

export const WaterDashboard: React.FC<WaterDashboardProps> = ({
  dailyGoal,
  currentIntake,
  onAddWater,
  onReset,
  onAdjustGoal,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [customAmount, setCustomAmount] = useState('');
  const [inputError, setInputError] = useState('');

  const progress = Math.min(currentIntake / dailyGoal, 1);
  const remaining = dailyGoal - currentIntake;
  const quickAmounts = [100, 250, 500, 1000];

  const handleAddCustom = () => {
    setModalVisible(true);
    setCustomAmount('');
    setInputError('');
  };

  const handleSubmitCustomAmount = () => {
    const amount = parseInt(customAmount);
    
    if (isNaN(amount) || amount <= 0) {
      setInputError('Por favor, digite um valor válido maior que 0');
      return;
    }
    
    if (amount > 10000) {
      setInputError('Valor muito alto. Digite um valor menor que 10.000 ml');
      return;
    }
    
    onAddWater(amount);
    setModalVisible(false);
    setCustomAmount('');
    setInputError('');
  };

  const closeModal = () => {
    setModalVisible(false);
    setCustomAmount('');
    setInputError('');
  };

  const handleAmountChange = (text: string) => {
    setCustomAmount(text.replace(/[^0-9]/g, ''));
    setInputError('');
  };

  return (
    <View style={styles.container}>
      {/* <Text variant="title" align="center">
        💧 Hidratação Hoje
      </Text> */}
      
      <ProgressStatsDisplay
        currentIntake={currentIntake}
        dailyGoal={dailyGoal}
        progress={progress}
        remaining={remaining}
      />
      
      <QuickWaterAddButtons
        quickAmounts={quickAmounts}
        onAddWater={onAddWater}
        onCustomPress={handleAddCustom}
      />
      
      <WaterStatsCard
        progress={progress}
        remaining={remaining}
        currentIntake={currentIntake}
      />
      
      <WaterActionsPanel
        onAdjustGoal={onAdjustGoal}
        onReset={onReset}
      />

      <CustomWaterInputModal
        visible={modalVisible}
        amount={customAmount}
        error={inputError}
        onAmountChange={handleAmountChange}
        onClose={closeModal}
        onSubmit={handleSubmitCustomAmount}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
});