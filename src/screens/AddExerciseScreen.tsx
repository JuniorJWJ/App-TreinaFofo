import React from 'react';
import {View, StyleSheet} from 'react-native';
import { ExerciseForm } from '../components/molecules/ExerciseForm';
import {Exercise} from '../types';

const AddExerciseScreen = () => {
  const handleAddExercise = (exercise: Omit<Exercise, 'id'>) => {
    // Aqui você pode salvar o exercício no estado global ou banco de dados
    console.log('Exercício adicionado:', exercise);
    // Por enquanto, apenas logamos. Depois vamos conectar com o estado.
  };

  return (
    <View style={styles.container}>
      {/* Use a temporary cast to any until ExerciseFormProps includes onSubmit */}
      <ExerciseForm {...({ onSubmit: handleAddExercise } as any)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
});

export default AddExerciseScreen;