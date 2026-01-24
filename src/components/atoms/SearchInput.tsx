// src/components/atoms/SearchInput.tsx
import React from 'react';
import { TextInput, TextInputProps, StyleSheet, View } from 'react-native';

interface SearchInputProps extends TextInputProps {
  containerStyle?: any;
}

export const SearchInput: React.FC<SearchInputProps> = ({ 
  style, 
  containerStyle, 
  ...props 
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <TextInput 
        style={[styles.searchInput, style]} 
        {...props} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
});