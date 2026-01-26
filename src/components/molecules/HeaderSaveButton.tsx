import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface HeaderSaveButtonProps {
  onPress: () => void;
  disabled?: boolean;
}

export const HeaderSaveButton: React.FC<HeaderSaveButtonProps> = ({ 
  onPress, 
  disabled = false 
}) => {
  return (
    <TouchableOpacity 
      style={[styles.button, disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.text}>Salvar</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    marginRight: 15,
  },
  text: {
    color: '#FFF',
    fontSize: 16,
  },
  disabled: {
    opacity: 0.5,
  },
});