import React from 'react';
import { View, StyleSheet } from 'react-native';
import { StoreProvider } from './src/providers/StoreProvider';
import { ExerciseForm } from './src/components/molecules/ExerciseForm';

const App = () => {
  const handleSave = () => {
    console.log('Exercício salvo!');
  };

  const handleCancel = () => {
    console.log('Cancelado!');
  };

  return (
    <StoreProvider>
      <View style={styles.container}>
        <ExerciseForm onSave={handleSave} onCancel={handleCancel} />
      </View>
    </StoreProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
});

export default App;