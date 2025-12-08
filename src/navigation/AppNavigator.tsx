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
import { CreateWeeklyPlanScreen } from '../screens/CreateWeeklyPlanScreen';
import { WeeklyPlanListScreen } from '../screens/WeeklyPlanListScreen';
import { WaterDashboardScreen } from '../screens/WaterDashboardScreen'; 

export type RootStackParamList = {
  Home: undefined;
  ExerciseList: undefined;
  AddExercise: undefined;
  EditExercise: { exerciseId: string };
  CreateWorkout: undefined;
  WorkoutList: undefined;
  CreateWeeklyPlan: { planId?: string }; // Pode receber planId para edição
  WeeklyPlanList: undefined;
  WaterDashboardScreen: undefined; 
};

const Stack = createStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#d15710ff',
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
        <Stack.Screen 
          name="CreateWeeklyPlan" 
          component={CreateWeeklyPlanScreen}
          options={{ title: 'Criar Divisão Semanal' }}
        />
        <Stack.Screen 
          name="WeeklyPlanList" 
          component={WeeklyPlanListScreen}
          options={{ title: 'Minhas Divisões' }}
          />
        <Stack.Screen 
          name="WaterDashboardScreen"
          component={WaterDashboardScreen}
          options={{ title: 'Hidratação' }}
        />       
      </Stack.Navigator>
    </NavigationContainer>
  );
};