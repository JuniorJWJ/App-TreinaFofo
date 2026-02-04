// components/molecules/RestDayContent.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '../../atoms/Text';

export const RestDayContent: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text variant="title" align="center" style={styles.title}>Descanso</Text>
      <Text variant="body" align="center" style={styles.message}>
        Hoje é seu dia de descanso! 💤
      </Text>
      <Text variant="caption" align="center" style={styles.tip}>
        O descanso é fundamental para a recuperação muscular e progresso.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    alignItems: 'center',
  },
  title: {
    marginBottom: 16,
  },
  message: {
    marginVertical: 16,
    fontSize: 18,
    color: '#666',
  },
  tip: {
    marginBottom: 20,
    fontStyle: 'italic',
  },
});