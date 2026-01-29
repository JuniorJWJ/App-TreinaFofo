import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '../atoms/Text';
import { Button } from '../atoms/Button';

interface EmptyWeeklyPlansProps {
  onCreatePlan: () => void;
}

export const EmptyWeeklyPlans: React.FC<EmptyWeeklyPlansProps> = ({ onCreatePlan }) => {
  return (
    <View style={styles.container}>
      <Text variant="subtitle" align="center">
        Nenhum plano semanal cadastrado
      </Text>
      <Text variant="body" align="center" style={styles.emptyText}>
        Crie seu primeiro plano semanal para organizar seus treinos!
      </Text>
      <Button
        title="Criar Primeiro Plano"
        onPress={onCreatePlan}
        style={styles.createButton}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    marginTop: 8,
    marginBottom: 24,
    color: '#666',
  },
  createButton: {
    width: '100%',
  },
});