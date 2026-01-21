// src/components/molecules/ExerciseSearchBar.tsx
import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from '../atoms/Text';
import { SearchInput } from '../atoms/SearchInput';

interface ExerciseSearchBarProps {
  search: string;
  onSearchChange: (text: string) => void;
  placeholder?: string;
}

export const ExerciseSearchBar: React.FC<ExerciseSearchBarProps> = ({
  search,
  onSearchChange,
  placeholder = 'Buscar exercícios...',
}) => {
  return (
    <View style={styles.container}>
      <SearchInput
        placeholder={placeholder}
        placeholderTextColor="#999"
        value={search}
        onChangeText={onSearchChange}
        style={styles.searchInput}
        containerStyle={styles.searchBar}
      />
      {search.length > 0 && (
        <TouchableOpacity
          style={styles.clearButton}
          onPress={() => onSearchChange('')}
        >
          <Text style={styles.clearButtonText}>X</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 16,
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchBar: {
    flex: 1,
  },
  searchInput: {
    flex: 1,
  },
  clearButton: {
    position: 'absolute',
    right: 16,
    padding: 10,
    marginLeft: 8,
  },
  clearButtonText: {
    fontSize: 16,
    color: '#999',
    fontWeight: 'bold',
  },
});