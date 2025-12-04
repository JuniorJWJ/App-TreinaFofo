// src/screens/WaterSetupScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { calculateWaterGoal, WaterActivityLevel, WaterClimate } from '../utils/waterCalculator';

export const WaterSetupScreen = () => {
  const [weight, setWeight] = useState('');
  const [activityLevel] = useState<WaterActivityLevel>('sedentary');
  const [climate] = useState<WaterClimate>('temperate');
  const [waterGoal, setWaterGoal] = useState<number | null>(null);

  const calculate = () => {
    const weightNum = parseFloat(weight);
    if (!isNaN(weightNum)) {
      const goal = calculateWaterGoal({
        weight: weightNum,
        activityLevel,
        climate,
      });
      setWaterGoal(goal);
    }
  };
  return (
    <View style={styles.container}>
      <Text>Configuração de Água</Text>
      <TextInput
        placeholder="Peso (kg)"
        value={weight}
        onChangeText={setWeight}
        keyboardType="numeric"
        style={styles.input}
      />
      {/* Adicione selects para activityLevel e climate */}
      <Button title="Calcular Meta" onPress={calculate} />
      {waterGoal && <Text>Meta diária: {waterGoal} ml</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 10,
  },
});

// Exportação nomeada - mantém a que você está tentando importar
export default WaterSetupScreen;