import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { HomeScreen } from '../screens/home/HomeScreen';
import { ExerciseListScreen } from '../screens/exercise/ExerciseListScreen';
import { CreateExerciseScreen } from '../screens/exercise/CreateExerciseScreen';
import { EditExerciseScreen } from '../screens/exercise/EditExerciseScreen';
import { CreateWorkoutScreen } from '../screens/workout/CreateWorkoutScreen';
import { WorkoutListScreen } from '../screens/workout/WorkoutListScreen';
import { CreateWeeklyPlanScreen } from '../screens/plan/CreateWeeklyPlanScreen';
import { WeeklyPlanListScreen } from '../screens/plan/WeeklyPlanListScreen';
import { WaterDashboardScreen } from '../screens/water/WaterDashboardScreen'; 
import { EditWorkoutScreen } from '../screens/workout/EditWorkoutScreen';


export type RootStackParamList = {
  Home: undefined;
  ExerciseList: undefined;
  CreateExercise: undefined;
  EditExercise: { exerciseId: string };
  CreateWorkout: undefined;
  WorkoutList: undefined;
  CreateWeeklyPlan: { planId?: string }; // Pode receber planId para edição
  WeeklyPlanList: undefined;
  WaterDashboardScreen: undefined; 
  EditWorkout: { workoutId: string };
};

const Stack = createStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#483148',
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
          name="CreateExercise" 
          component={CreateExerciseScreen}
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
        <Stack.Screen 
          name="EditWorkout" 
          component={EditWorkoutScreen}
          options={{ title: 'Editar Treino' }}
        />        
      </Stack.Navigator>
    </NavigationContainer>
  );
};