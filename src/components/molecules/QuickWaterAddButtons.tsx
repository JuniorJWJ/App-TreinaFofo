// components/molecules/QuickWaterAddButtons.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from '../atoms/Button';
import { Text } from '../atoms/Text';

interface QuickWaterAddButtonsProps {
  quickAmounts: number[];
  onAddWater: (amount: number) => void;
  onCustomPress: () => void;
}

export const QuickWaterAddButtons: React.FC<QuickWaterAddButtonsProps> = ({
  quickAmounts,
  onAddWater,
  onCustomPress,
}) => {
  return (
    <View style={styles.container}>
      <Text variant="subtitle">Adicionar rápido:</Text>
      <View style={styles.quickButtons}>
        {quickAmounts.map(amount => (
          <Button
            key={amount}
            title={`+${amount}ml`}
            onPress={() => onAddWater(amount)}
            style={styles.quickButton}
          />
        ))}
      </View>
      <Button
        title="Adicionar Valor Personalizado"
        onPress={onCustomPress}
        style={styles.customButton}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 30,
  },
  quickButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
    marginBottom: 15,
  },
  quickButton: {
    backgroundColor: '#004170ff',
    paddingHorizontal: 12,
  },
  customButton: {
    backgroundColor: '#2196F3',
    marginTop: 10,
  },
});