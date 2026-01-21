// src/components/atoms/Input.tsx
import React from 'react';
import { TextInput, TextInputProps, StyleSheet, ViewStyle } from 'react-native';

interface InputProps extends TextInputProps {
  style?: ViewStyle;
  color?: string;
}

export const Input: React.FC<InputProps> = ({ style, color, ...props }) => {
  const inputStyle = {
    ...styles.input,
    ...(color && { color }),
    ...style,
  };

  return <TextInput style={inputStyle} {...props} />;
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 5,
    borderRadius: 8,
    fontSize: 16,
  },
});