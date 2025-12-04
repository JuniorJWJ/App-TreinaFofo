import React, { useState } from 'react'; // Adicione o useState
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'; // Adicione TouchableOpacity
import { useExerciseStore } from '../store';
import { useMuscleGroupStore } from '../store';
import { useWeeklyPlanStore } from '../store';
import { useWorkoutStore } from '../store';
import { Text } from '../components/atoms/Text';
import { Button } from '../components/atoms/Button';
import { TodayWorkoutModal } from '../components/molecules/TodayWorkoutModal'; // Importe o modal

interface HomeScreenProps {
  navigation: any;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { exercises } = useExerciseStore();
  const { muscleGroups } = useMuscleGroupStore();
  const { getActivePlan, getTodaysWorkout, completeDailyWorkout, uncompleteDailyWorkout } = useWeeklyPlanStore();
  const { getWorkout } = useWorkoutStore();

  // Estado para controlar a visibilidade do modal
  const [isWorkoutModalVisible, setIsWorkoutModalVisible] = useState(false);

  const activePlan = getActivePlan();
  const todaysWorkout = activePlan ? getTodaysWorkout(activePlan.id) : null;
  const todaysWorkoutDetails = todaysWorkout?.workoutId ? getWorkout(todaysWorkout.workoutId) : null;

  const stats = {
    totalExercises: exercises.length,
    totalMuscleGroups: muscleGroups.length,
    recentExercises: exercises.slice(-3).reverse(),
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

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      {/* <View style={styles.header}>
        <Text variant="title" align="center">TreinaFofo</Text>
        <Text variant="subtitle" align="center" style={styles.subtitle}>
          Seu app de treino pessoal
        </Text>
      </View> */}

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
        
        {activePlan && (
          <View style={styles.statCard}>
            <Text variant="title" style={styles.statNumber}>
              {activePlan.completionRate.toFixed(0)}%
            </Text>
            <Text variant="caption" align="center">
              Progresso{'\n'}Semanal
            </Text>
          </View>
        )}
      </View>

      {/* Treino de Hoje - AGORA CLICÁVEL */}
      {activePlan && todaysWorkout && (
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
        <Button
          title="📋 Ver Todos os Exercícios"
          onPress={() => navigation.navigate('ExerciseList')}
          style={styles.actionButton}
        />
        
        <Button
          title="➕ Criar Novo Exercício"
          onPress={() => navigation.navigate('AddExercise')}
          style={styles.actionButton} 
        />

        <Button
          title="💪 Meus Treinos"
          onPress={() => navigation.navigate('WorkoutList')}
          style={styles.actionButton}
        />
        
        <Button
          title="🆕 Criar Treino"
          onPress={() => navigation.navigate('CreateWorkout')}
          style={styles.actionButton} 
        />

        <Button
          title="📅 Minhas Divisões"
          onPress={() => navigation.navigate('WeeklyPlanList')}
          style={styles.actionButton}
        />
        
        <Button
          title="🆕 Nova Divisão"
          onPress={() => navigation.navigate('CreateWeeklyPlan')}
          style={styles.actionButton} 
        />

        <Button
          title="💧 Hidratação"
          onPress={() => navigation.navigate('WaterDashboardScreen')}
          style={styles.actionButton} 
        />

        <Button
          title="💧 Hidratação1"
          onPress={() => navigation.navigate('WaterSetupScreen')}
          style={styles.actionButton} 
        />
        
      </View>

      {/* Recent Exercises */}
      {stats.recentExercises.length > 0 && (
        <View style={styles.recentSection}>
          <Text variant="subtitle" style={styles.sectionTitle}>
            Exercícios Recentes
          </Text>
          
          {stats.recentExercises.map((exercise) => (
            <View key={exercise.id} style={styles.recentExercise}>
              <Text variant="body" style={styles.exerciseName}>
                {exercise.name}
              </Text>
              <Text variant="caption">
                {exercise.defaultSets} × {exercise.defaultReps} • {exercise.defaultRestTime}s
              </Text>
            </View>
          ))}
          
          <Button
            title="Ver Todos"
            onPress={() => navigation.navigate('ExerciseList')}
            style={styles.seeAllButton} 
          />
        </View>
      )}

      {/* Empty State */}
      {stats.totalExercises === 0 && (
        <View style={styles.emptyState}>
          <Text variant="subtitle" align="center">
            Bem-vindo ao TreinaFofo! 🎉
          </Text>
          <Text variant="body" align="center" style={styles.emptyText}>
            Comece criando seu primeiro exercício para organizar seus treinos.
          </Text>
          <Button
            title="Criar Primeiro Exercício"
            onPress={() => navigation.navigate('AddExercise')}
            style={styles.createButton}
          />
        </View>
      )}

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
    backgroundColor: '#eeddd3ff',
  },
  header: {
    marginBottom: 30,
    marginTop: 10,
  },
  subtitle: {
    color: '#666',
    marginTop: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 6,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    color: '#d15710ff',
    marginBottom: 8,
  },
  actionsContainer: {
    marginBottom: 30,
  },
  actionButton: {
    marginBottom: 12,
  },
  recentSection: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  sectionTitle: {
    marginBottom: 12,
  },
  recentExercise: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  exerciseName: {
    fontWeight: '600',
    marginBottom: 4,
  },
  seeAllButton: {
    marginTop: 12,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyText: {
    marginTop: 8,
    marginBottom: 24,
    color: '#666',
    textAlign: 'center',
  },
  createButton: {
    width: '100%',
  },
  todaysWorkoutSection: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  todaysWorkoutCard: {
    alignItems: 'center',
  },
  todaysWorkoutName: {
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  completeButton: {
    marginTop: 12,
    width: '100%',
  },
  completedButton: {
    backgroundColor: '#28A745',
  },
  pendingButton: {
    backgroundColor: '#d15710ff',
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
    backgroundColor: '#E3F2FD',
    borderColor: '#c05a06ff',
    borderWidth: 1,
  },
  statusIndicatorText: {
    fontSize: 14,
    fontWeight: '600',
  },
});