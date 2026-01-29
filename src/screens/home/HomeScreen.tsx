import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useExerciseStore } from '../../store';
import { useMuscleGroupStore } from '../../store';
import { useWeeklyPlanStore } from '../../store';
import { useWorkoutStore } from '../../store';
import { useWaterTracker } from '../../hooks/useWaterTracker';
import { WaterProgressCard } from '../../components/molecules/cards/WaterProgressCard';
import { TodayWorkoutModal } from '../../components/molecules/modals/TodayWorkoutModal';
import { HowToStartCard } from '../../components/molecules/cards/HowToStartCard';
import { HowToStartFlow } from '../../components/molecules/onboarding/HowToStartFlow';
import { StatsCards } from '../../components/molecules/StatsCards';
import { TodayWorkoutCard } from '../../components/molecules/TodayWorkoutCard';
import { QuickActions } from '../../components/molecules/QuickActions';

interface HomeScreenProps {
  navigation: any;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { exercises } = useExerciseStore();
  const { muscleGroups } = useMuscleGroupStore();
  const { getActivePlan, getTodaysWorkout, completeDailyWorkout, uncompleteDailyWorkout } = useWeeklyPlanStore();
  const { getWorkout } = useWorkoutStore();
  const { currentIntake, dailyGoal, addWater } = useWaterTracker();

  const [isWorkoutModalVisible, setIsWorkoutModalVisible] = useState(false);
  const [showHowToStart, setShowHowToStart] = useState(false);

  const activePlan = getActivePlan();
  const todaysWorkout = activePlan ? getTodaysWorkout(activePlan.id) : null;
  const todaysWorkoutDetails = todaysWorkout?.workoutId ? getWorkout(todaysWorkout.workoutId) : null;

  const handleToggleWorkoutCompletion = () => {
    if (!activePlan || !todaysWorkout) return;

    if (todaysWorkout.isCompleted) {
      uncompleteDailyWorkout(activePlan.id, todaysWorkout.day);
    } else {
      completeDailyWorkout(activePlan.id, todaysWorkout.day);
    }
  };

  const handleWorkoutCardPress = () => {
    setIsWorkoutModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsWorkoutModalVisible(false);
  };

  const handleWaterCardPress = () => {
    navigation.navigate('WaterDashboardScreen');
  };

  const handleQuickWaterAdd = (amount: number) => {
    addWater(amount);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      {/* <View style={styles.header}>
        <Text variant="title">Bem-vindo!</Text>
        <Text variant="body" style={styles.subtitle}>
          Acompanhe seu progresso diário
        </Text>
      </View> */}

      {/* Stats Cards */}
      <StatsCards 
        totalExercises={exercises.length}
        totalMuscleGroups={muscleGroups.length}
      />

      {/* Card de Água */}
      <WaterProgressCard
        currentIntake={currentIntake}
        dailyGoal={dailyGoal}
        onPress={handleWaterCardPress}
        onQuickAdd={handleQuickWaterAdd}
        showActions={true}
      />

      {/* Treino de Hoje */}
      {!activePlan || !todaysWorkout ? (
        <View>
          <HowToStartCard onPress={() => setShowHowToStart(true)} />
          <HowToStartFlow
            visible={showHowToStart}
            onClose={() => setShowHowToStart(false)}
          />
        </View>
      ) : (
        <TodayWorkoutCard
          workoutName={todaysWorkoutDetails ? todaysWorkoutDetails.name : 'Descanso'}
          exerciseCount={todaysWorkoutDetails?.exerciseIds.length}
          estimatedDuration={todaysWorkoutDetails?.estimatedDuration}
          isCompleted={todaysWorkout.isCompleted}
          onPress={handleWorkoutCardPress}
        />
      )}

      {/* Quick Actions */}
      <QuickActions
        onNavigateExercises={() => navigation.navigate('ExerciseList')}
        onNavigateWorkouts={() => navigation.navigate('WorkoutList')}
        onNavigateWeeklyPlans={() => navigation.navigate('WeeklyPlanList')}
        onNavigateWater={() => navigation.navigate('WaterDashboardScreen')}
      />

      {/* Modal do Treino de Hoje */}
      <TodayWorkoutModal
        visible={isWorkoutModalVisible}
        onClose={handleCloseModal}
        workout={todaysWorkout}
        workoutDetails={todaysWorkoutDetails}
        isCompleted={todaysWorkout?.isCompleted || false}
        onToggleCompletion={handleToggleWorkoutCompletion}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#1b1613ff',
  },
  header: {
    marginBottom: 20,
    marginTop: 10,
  },
  subtitle: {
    color: '#666',
    marginTop: 8,
  },
});