import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Text } from '../../atoms/Text';

type Props = {
  onPress: () => void;
};

export const HowToStartCard = ({ onPress }: Props) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Text variant="subtitle">👉 Como começar</Text>

      <Text variant="body" style={styles.description}>
        Aprenda como organizar exercícios, treinos e divisões no app.
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    backgroundColor: '#F8F9FA',
  },
  description: {
    marginTop: 8,
    opacity: 0.9,
  },
});
