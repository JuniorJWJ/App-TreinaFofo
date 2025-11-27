import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useExerciseStore } from '../store';
import { useMuscleGroupStore } from '../store';
import { useWeeklyPlanStore } from '../store'; // Importação faltando
import { useWorkoutStore } from '../store'; // Importação faltando
import { Text } from '../components/atoms/Text';
import { Button } from '../components/atoms/Button';

interface HomeScreenProps {
  navigation: any;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { exercises } = useExerciseStore();
  const { muscleGroups } = useMuscleGroupStore();
  const { getActivePlan, getTodaysWorkout, completeDailyWorkout, uncompleteDailyWorkout } = useWeeklyPlanStore(); // Importação e desestruturação
  const { getWorkout } = useWorkoutStore();

  const activePlan = getActivePlan();
  const todaysWorkout = activePlan ? getTodaysWorkout(activePlan.id) : null;
  const todaysWorkoutDetails = todaysWorkout?.workoutId ? getWorkout(todaysWorkout.workoutId) : null;

  const stats = {
    totalExercises: exercises.length,
    totalMuscleGroups: muscleGroups.length,
    recentExercises: exercises.slice(-3).reverse(),
  };

  // Função para marcar/desmarcar treino como concluído
  const handleToggleWorkoutCompletion = () => {
    if (!activePlan || !todaysWorkout) return;

    if (todaysWorkout.isCompleted) {
      uncompleteDailyWorkout(activePlan.id, todaysWorkout.day);
    } else {
      completeDailyWorkout(activePlan.id, todaysWorkout.day);
    }
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

      {/* Treino de Hoje */}
      {activePlan && todaysWorkout && (
        <View style={styles.todaysWorkoutSection}>
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
            <Button
              title={todaysWorkout.isCompleted ? "✓ Concluído" : "Marcar como Feito"}
              onPress={handleToggleWorkoutCompletion}
              style={[
                styles.completeButton,
                todaysWorkout.isCompleted ? styles.completedButton : styles.pendingButton
              ]}
            />
          </View>
        </View>
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F5F5',
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
  // ESTILOS NOVOS ADICIONADOS:
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
});