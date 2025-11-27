// src/navigation/AppNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { HomeScreen } from '../screens/HomeScreen';
import { ExerciseListScreen } from '../screens/ExerciseListScreen';
import { AddExerciseScreen } from '../screens/AddExerciseScreen';
import { EditExerciseScreen } from '../screens/EditExerciseScreen';
import { CreateWorkoutScreen } from '../screens/CreateWorkoutScreen';
import { WorkoutListScreen } from '../screens/WorkoutListScreen';

export type RootStackParamList = {
  Home: undefined;
  ExerciseList: undefined;
  AddExercise: undefined;
  EditExercise: { exerciseId: string };
  CreateWorkout: undefined;
  WorkoutList: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#007BFF',
          },
          headerTintColor: '#FFF',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={{ title: 'TreinaFofo' }}
        />
        <Stack.Screen 
          name="ExerciseList" 
          component={ExerciseListScreen}
          options={{ title: 'Meus Exercícios' }}
        />
        <Stack.Screen 
          name="AddExercise" 
          component={AddExerciseScreen}
          options={{ title: 'Novo Exercício' }}
        />
        <Stack.Screen 
          name="EditExercise" 
          component={EditExerciseScreen}
          options={{ title: 'Editar Exercício' }}
        />
        <Stack.Screen 
          name="CreateWorkout" 
          component={CreateWorkoutScreen}
          options={{ title: 'Criar Treino' }}
        />
        <Stack.Screen 
          name="WorkoutList" 
          component={WorkoutListScreen}
          options={{ title: 'Meus Treinos' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};