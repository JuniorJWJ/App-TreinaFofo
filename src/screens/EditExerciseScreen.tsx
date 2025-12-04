import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useExerciseStore } from '../store';
import { ExerciseForm } from '../components/molecules/ExerciseForm';

interface EditExerciseScreenProps {
  navigation: any;
  route: any;
}

export const EditExerciseScreen: React.FC<EditExerciseScreenProps> = ({ navigation, route }) => {
  const { exerciseId } = route.params;
  const { exercises } = useExerciseStore();

  const exercise = exercises.find(ex => ex.id === exerciseId);

  const handleSave = () => {
    navigation.goBack();
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  if (!exercise) {
      return (
        <View style={styles.container}>
          <Text style={styles.bodyText}>Exercício não encontrado</Text>
        </View>
      );
    }

  return (
    <View style={styles.container}>
      <ExerciseForm
        {...({ exercise, onSave: handleSave, onCancel: handleCancel, isEditing: true } as any)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e0b9a2ff',
  },
  bodyText: {
    fontSize: 16,
    color: '#000',
  },
});