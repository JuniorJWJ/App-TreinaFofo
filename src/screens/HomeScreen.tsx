import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useExerciseStore } from '../store';
import { useMuscleGroupStore } from '../store';
import { useWeeklyPlanStore } from '../store';
import { useWorkoutStore } from '../store';
import { useWaterTracker } from '../hooks/useWaterTracker';
import { Text } from '../components/atoms/Text';
import { Button } from '../components/atoms/Button';
import { WaterProgressCard } from '../components/molecules/WaterProgressCard';
import { TodayWorkoutModal } from '../components/molecules/TodayWorkoutModal';
import { HowToStartCard } from '../components/molecules/HowToStartCard';
import { HowToStartFlow } from '../components/molecules/HowToStartFlow';

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

  const stats = {
    totalExercises: exercises.length,
    totalMuscleGroups: muscleGroups.length,
    waterProgress: Math.min(currentIntake / dailyGoal, 1),
  };

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

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text variant="title" style={styles.statNumber}>
            {stats.totalExercises}
          </Text>
          <Text variant="caption" align="center">
            Exercícios{'\n'}Cadastrados
          </Text>
        </View>
        
        <View style={styles.statCard}>
          <Text variant="title" style={styles.statNumber}>
            {stats.totalMuscleGroups}
          </Text>
          <Text variant="caption" align="center">
            Grupos{'\n'}Musculares
          </Text>
        </View>
      </View>

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
        <TouchableOpacity 
          style={styles.todaysWorkoutSection}
          onPress={handleWorkoutCardPress}
          activeOpacity={0.7}
        >
          <Text variant="subtitle" style={styles.sectionTitle}>
            Treino de Hoje
          </Text>
          <View style={styles.todaysWorkoutCard}>
            <Text variant="body" style={styles.todaysWorkoutName}>
              {todaysWorkoutDetails ? todaysWorkoutDetails.name : 'Descanso'}
            </Text>
            {todaysWorkoutDetails && (
              <Text variant="caption">
                {todaysWorkoutDetails.exerciseIds.length} exercícios • {todaysWorkoutDetails.estimatedDuration} min
              </Text>
            )}
            <View style={[
              styles.statusIndicator,
              todaysWorkout.isCompleted ? styles.completedIndicator : styles.pendingIndicator
            ]}>
              <Text style={styles.statusIndicatorText}>
                {todaysWorkout.isCompleted ? '✓ Concluído' : 'Toque para ver detalhes'}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      )}

      {/* Quick Actions */}
      <View style={styles.actionsContainer}>
        <View style={styles.actionRow}>
          <Button
            title="Exercícios"
            onPress={() => navigation.navigate('ExerciseList')}
            style={styles.halfButton}
          />
          <Button
            title="Treinos"
            onPress={() => navigation.navigate('WorkoutList')}
            style={styles.halfButton}
          />
        </View>
        
        <View style={styles.actionRow}>
          <Button
            title="Divisões"
            onPress={() => navigation.navigate('WeeklyPlanList')}
            style={styles.halfButton}
          />
          <Button
            title="Água"
            onPress={() => navigation.navigate('WaterDashboardScreen')}
            style={styles.halfButton}
          />
        </View>
      </View>

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
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minHeight: 100,
    justifyContent: 'center',
  },
  statNumber: {
    color: '#483148',
    marginBottom: 8,
  },
  waterLabel: {
    marginTop: 8,
    textAlign: 'center',
  },
  actionsContainer: {
    marginTop: 16,
    marginBottom: 30,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  halfButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  todaysWorkoutSection: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  sectionTitle: {
    marginBottom: 12,
  },
  todaysWorkoutCard: {
    alignItems: 'center',
  },
  todaysWorkoutName: {
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  statusIndicator: {
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    width: '100%',
    alignItems: 'center',
  },
  completedIndicator: {
    backgroundColor: '#E8F5E8',
    borderColor: '#28A745',
    borderWidth: 1,
  },
  pendingIndicator: {
    backgroundColor: '#483148',
    borderColor: '#483148',
    borderWidth: 1,
  },
  statusIndicatorText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});