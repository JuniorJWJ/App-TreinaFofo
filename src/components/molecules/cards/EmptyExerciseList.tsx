// src/components/molecules/EmptyExerciseList.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '../../atoms/Text';
import { Button } from '../../atoms/Button';

interface EmptyExerciseListProps {
  hasSearchOrFilter: boolean;
  onClearFilters?: () => void;
  onCreateFirst?: () => void;
}

export const EmptyExerciseList: React.FC<EmptyExerciseListProps> = ({
  hasSearchOrFilter,
  onClearFilters,
  onCreateFirst,
}) => {
  return (
    <View style={styles.container}>
      <Text variant="subtitle" align="center">
        {hasSearchOrFilter 
          ? 'Nenhum exercício encontrado' 
          : 'Nenhum exercício cadastrado'}
      </Text>
      <Text variant="body" align="center" style={styles.message}>
        {hasSearchOrFilter
          ? 'Tente ajustar sua busca ou filtro'
          : 'Toque no botão abaixo para criar seu primeiro exercício!'}
      </Text>
      {hasSearchOrFilter ? (
        <Button
          title="Limpar Filtros"
          onPress={onClearFilters}
          style={styles.button}
        />
      ) : (
        <Button
          title="Criar Primeiro Exercício"
          onPress={onCreateFirst}
          style={styles.button}
        />
      )}
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
  message: {
    marginTop: 8,
    marginBottom: 24,
    color: '#666',
    textAlign: 'center',
  },
  button: {
    width: '100%',
  },
});