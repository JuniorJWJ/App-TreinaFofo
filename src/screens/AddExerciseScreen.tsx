import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ExerciseForm } from '../components/molecules/ExerciseForm';

interface AddExerciseScreenProps {
  navigation: any;
}

export const AddExerciseScreen: React.FC<AddExerciseScreenProps> = ({ navigation }) => {
  const handleSave = () => {
    navigation.goBack();
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <ExerciseForm
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
});