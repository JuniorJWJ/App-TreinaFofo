// components/molecules/TipCard.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '../atoms/Text';

interface TipCardProps {
  tip: string;
}

export const TipCard: React.FC<TipCardProps> = ({ tip }) => {
  return (
    <View style={styles.tipContainer}>
      <Text variant="caption" style={styles.tipText}>
        {tip}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  tipContainer: {
    padding: 12,
    backgroundColor: '#E7F3FF',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#483148',
  },
  tipText: {
    color: '#0056B3',
  },
});