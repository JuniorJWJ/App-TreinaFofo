// AppNavigator.tsx
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
import { HeaderLogo } from '../components/atoms/HeaderLogo';

export type RootStackParamList = {
  Home: undefined;
  ExerciseList: undefined;
  CreateExercise: undefined;
  EditExercise: { exerciseId: string };
  CreateWorkout: undefined;
  WorkoutList: undefined;
  CreateWeeklyPlan: { planId?: string };
  WeeklyPlanList: undefined;
  WaterDashboardScreen: undefined;
  EditWorkout: { workoutId: string };
};

const Stack = createStackNavigator<RootStackParamList>();

// Componente de Logo direto para reutilização
const LogoHeader = ({ isHome = false }: { isHome?: boolean }) => {
  return <HeaderLogo isHome={isHome} />;
};

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#483148',
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
          headerTintColor: '#FFF',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerTitleAlign: 'center',
        }}
      >
        {/* Home Screen com Logo Centralizada */}
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            headerTitle: () => <LogoHeader isHome={true} />,
            headerLeft: () => null,
            headerRight: () => null,
          }}
        />

        {/* Demais telas com Logo Centralizada Clicável e título no header */}
        <Stack.Screen
          name="ExerciseList"
          component={ExerciseListScreen}
          options={{
            headerTitle: () => <LogoHeader />,
            title: 'Meus Exercícios', // Título que aparecerá na seta de voltar
          }}
        />
        <Stack.Screen
          name="CreateExercise"
          component={CreateExerciseScreen}
          options={{
            headerTitle: () => <LogoHeader />,
            title: 'Novo Exercício',
          }}
        />
        <Stack.Screen
          name="EditExercise"
          component={EditExerciseScreen}
          options={{
            headerTitle: () => <LogoHeader />,
            title: 'Editar Exercício',
          }}
        />
        <Stack.Screen
          name="CreateWorkout"
          component={CreateWorkoutScreen}
          options={{
            headerTitle: () => <LogoHeader />,
            title: 'Criar Treino',
          }}
        />
        <Stack.Screen
          name="WorkoutList"
          component={WorkoutListScreen}
          options={{
            headerTitle: () => <LogoHeader />,
            title: 'Meus Treinos',
          }}
        />
        <Stack.Screen
          name="CreateWeeklyPlan"
          component={CreateWeeklyPlanScreen}
          options={{
            headerTitle: () => <LogoHeader />,
            title: 'Criar Divisão Semanal',
          }}
        />
        <Stack.Screen
          name="WeeklyPlanList"
          component={WeeklyPlanListScreen}
          options={{
            headerTitle: () => <LogoHeader />,
            title: 'Minhas Divisões',
          }}
        />
        <Stack.Screen
          name="WaterDashboardScreen"
          component={WaterDashboardScreen}
          options={{
            headerTitle: () => <LogoHeader />,
            title: 'Hidratação',
          }}
        />
        <Stack.Screen
          name="EditWorkout"
          component={EditWorkoutScreen}
          options={{
            headerTitle: () => <LogoHeader />,
            title: 'Editar Treino',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};