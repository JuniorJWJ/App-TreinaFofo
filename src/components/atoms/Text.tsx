import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native';

interface TextProps extends RNTextProps {
  variant?: 'title' | 'subtitle' | 'body' | 'caption';
  color?: string;
  align?: 'left' | 'center' | 'right';
}

export const Text: React.FC<TextProps> = ({ 
  variant = 'body', 
  color = '#000',
  align = 'left',
  style,
  ...props 
}) => {
  return (
    <RNText 
      style={[
        styles.base,
        styles[variant],
        { color, textAlign: align },
        style
      ]} 
      {...props} 
    />
  );
};

const styles = StyleSheet.create({
  base: {
    fontFamily: 'System',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
  },
  body: {
    fontSize: 16,
    lineHeight: 22,
  },
  caption: {
    fontSize: 14,
    color: '#666',
  },
});