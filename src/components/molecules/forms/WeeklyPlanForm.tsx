// components/molecules/WeeklyPlanForm.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Input } from '../../atoms/Input';
import { Text } from '../../atoms/Text';

interface WeeklyPlanFormProps {
  planName: string;
  onPlanNameChange: (text: string) => void;
  description: string;
  onDescriptionChange: (text: string) => void;
  completedDays: number;
}

export const WeeklyPlanForm: React.FC<WeeklyPlanFormProps> = ({
  planName,
  onPlanNameChange,
  description,
  onDescriptionChange,
  completedDays,
}) => {
  return (
    <View style={styles.container}>
      <Input
        placeholder="Nome do plano (ex: Semana 1 - Hipertrofia)"
        value={planName}
        onChangeText={onPlanNameChange}
        style={styles.input}
        color={'#FFF'}
        placeholderTextColor="#AAA"
      />

      <Input
        placeholder="Descrição (opcional)"
        value={description}
        onChangeText={onDescriptionChange}
        style={styles.input}
        multiline
        color={'#FFF'}
        placeholderTextColor="#AAA"
      />

      <View style={styles.stats}>
        <Text variant="caption">
          {completedDays}/7 dias com treino definido
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  input: {
    marginBottom: 16,
  },
  stats: {
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#FFF',
    borderRadius: 8,
  },
});