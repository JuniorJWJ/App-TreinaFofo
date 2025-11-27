import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useExerciseStore } from '../store';
import { useMuscleGroupStore } from '../store';
import { Text } from '../components/atoms/Text';
import { Button } from '../components/atoms/Button';

interface HomeScreenProps {
  navigation: any;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { exercises } = useExerciseStore();
  const { muscleGroups } = useMuscleGroupStore();

  const stats = {
    totalExercises: exercises.length,
    totalMuscleGroups: muscleGroups.length,
    recentExercises: exercises.slice(-3).reverse(),
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text variant="title" align="center">TreinaFofo</Text>
        <Text variant="subtitle" align="center" style={styles.subtitle}>
          Seu app de treino pessoal
        </Text>
      </View>

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
    color: '#007BFF',
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
});