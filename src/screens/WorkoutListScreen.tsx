import React from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { useWorkoutStore } from '../store';
import { useExerciseStore } from '../store';
import { Text } from '../components/atoms/Text';
import { Button } from '../components/atoms/Button';

interface WorkoutListScreenProps {
  navigation: any;
}

export const WorkoutListScreen: React.FC<WorkoutListScreenProps> = ({ navigation }) => {
  const { workouts, deleteWorkout, setActiveWorkout, activeWorkoutId } = useWorkoutStore();
  const { exercises } = useExerciseStore();

  const getExerciseName = (exerciseId: string) => {
    const exercise = exercises.find(ex => ex.id === exerciseId);
    return exercise ? exercise.name : 'Exercício não encontrado';
  };

  const handleDeleteWorkout = (workoutId: string, workoutName: string) => {
    Alert.alert(
      'Excluir Treino',
      `Tem certeza que deseja excluir "${workoutName}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive',
          onPress: () => deleteWorkout(workoutId)
        }
      ]
    );
  };

  const handleSetActiveWorkout = (workoutId: string) => {
    setActiveWorkout(workoutId);
    Alert.alert('Sucesso', 'Treino definido como ativo!');
  };

  const renderWorkoutItem = ({ item }: { item: any }) => (
    <View style={[
      styles.workoutCard,
      activeWorkoutId === item.id && styles.activeWorkoutCard
    ]}>
      <View style={styles.workoutHeader}>
        <Text variant="subtitle" style={styles.workoutName}>
          {item.name}
        </Text>
        {activeWorkoutId === item.id && (
          <View style={styles.activeBadge}>
            <Text style={styles.activeBadgeText}>ATIVO</Text>
          </View>
        )}
      </View>
      
      <View style={styles.workoutDetails}>
        <Text variant="caption">
          {item.exerciseIds.length} exercício{item.exerciseIds.length !== 1 ? 's' : ''}
        </Text>
        <Text variant="caption">
          Criado em: {new Date(item.createdAt).toLocaleDateString('pt-BR')}
        </Text>
      </View>

      {/* Lista de exercícios */}
      <View style={styles.exercisesList}>
        {item.exerciseIds.slice(0, 3).map((exerciseId: string) => (
          <Text key={exerciseId} variant="caption" style={styles.exerciseItem}>
            • {getExerciseName(exerciseId)}
          </Text>
        ))}
        {item.exerciseIds.length > 3 && (
          <Text variant="caption" style={styles.moreExercises}>
            + {item.exerciseIds.length - 3} mais...
          </Text>
        )}
      </View>

      {/* BOTÕES DE AÇÃO */}
      <View style={styles.actionRow}>
        <Button
          title="Editar"
          onPress={() => navigation.navigate('EditWorkout', { workoutId: item.id })}
          style={styles.editButton}
        />
        {/* <Button
          title={activeWorkoutId === item.id ? "Ativo ✓" : "Definir como Ativo"}
          onPress={() => handleSetActiveWorkout(item.id)}
          style={[
            styles.activeButton,
            activeWorkoutId === item.id && styles.activeButtonSelected
          ]}
          disabled={activeWorkoutId === item.id}
        /> */}
      </View>
      
      <Button
        title="Excluir"
        onPress={() => handleDeleteWorkout(item.id, item.name)}
        style={styles.deleteButton}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {/* <Text variant="title">Meus Treinos</Text> */}
        <Text variant="caption">
          {workouts.length} treino{workouts.length !== 1 ? 's' : ''} cadastrado{workouts.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {workouts.length === 0 ? (
        <View style={styles.emptyState}>
          <Text variant="subtitle" align="center">
            Nenhum treino cadastrado
          </Text>
          <Text variant="body" align="center" style={styles.emptyText}>
            Crie seu primeiro treino para começar!
          </Text>
          <Button
            title="Criar Primeiro Treino"
            onPress={() => navigation.navigate('CreateWorkout')}
            style={styles.createButton}
          />
        </View>
      ) : (
        <FlatList
          data={workouts}
          keyExtractor={(item) => item.id}
          renderItem={renderWorkoutItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      )}

      {workouts.length > 0 && (
        <View style={styles.fabContainer}>
          <Button
            title="+ Novo Treino"
            onPress={() => navigation.navigate('CreateWorkout')}
            style={styles.fabButton}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#e0b9a2ff',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  listContent: {
    paddingBottom: 80,
  },
  workoutCard: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  activeWorkoutCard: {
    borderColor: '#d15710ff',
    borderWidth: 2,
    backgroundColor: '#F0F8FF',
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  workoutName: {
    flex: 1,
  },
  activeBadge: {
    backgroundColor: '#d15710ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeBadgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  workoutDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  exercisesList: {
    marginBottom: 12,
  },
  exerciseItem: {
    marginBottom: 2,
  },
  moreExercises: {
    fontStyle: 'italic',
    color: '#666',
  },
  workoutActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  activeButton: {
    flex: 1,
    marginRight: 8,
    backgroundColor: '#28A745',
  },
  deleteButton: {
    flex: 1,
    marginLeft: 8,
    backgroundColor: '#DC3545',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    marginTop: 8,
    marginBottom: 24,
    color: '#666',
  },
  createButton: {
    width: '100%',
  },
  fabContainer: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
  },
  fabButton: {
    backgroundColor: '#d15710ff',
  },
    actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    gap: 8,
  },
  editButton: {
    flex: 1,
    backgroundColor: '#FFC107', // Amarelo para editar
  },
  activeButtonSelected: {
    backgroundColor: '#218838', // Verde mais escuro quando já está ativo
  },
});