// components/molecules/WaterActionsPanel.tsx
import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Button } from '../atoms/Button';

interface WaterActionsPanelProps {
  onAdjustGoal?: () => void;
  onReset?: () => void;
}

export const WaterActionsPanel: React.FC<WaterActionsPanelProps> = ({
  onAdjustGoal,
  onReset,
}) => {
  const handleReset = () => {
    Alert.alert(
      'Resetar Dia',
      'Tem certeza que deseja zerar a ingestão de água do dia?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Zerar', style: 'destructive', onPress: onReset },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {onAdjustGoal && (
        <Button
          title="Ajustar Meta"
          onPress={onAdjustGoal}
          style={styles.actionButton}
        />
      )}
      {onReset && (
        <Button
          title="Zerar Hoje"
          onPress={handleReset}
          style={[styles.actionButton, styles.resetButton]}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 5,
  },
  resetButton: {
    borderColor: '#F44336',
  },
});