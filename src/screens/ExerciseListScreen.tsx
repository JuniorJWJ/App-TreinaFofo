import React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useExerciseStore } from '../store';
import { useMuscleGroupStore } from '../store';
import { Text } from '../components/atoms/Text';
import { Button } from '../components/atoms/Button';

interface ExerciseListScreenProps {
  navigation: any;
}

export const ExerciseListScreen: React.FC<ExerciseListScreenProps> = ({ navigation }) => {
  const { exercises, deleteExercise } = useExerciseStore();
  const { muscleGroups } = useMuscleGroupStore();

  const getMuscleGroupName = (muscleGroupId: string) => {
    const group = muscleGroups.find(g => g.id === muscleGroupId);
    return group ? group.name : 'Desconhecido';
  };

  const getMuscleGroupColor = (muscleGroupId: string) => {
    const group = muscleGroups.find(g => g.id === muscleGroupId);
    return group ? group.color : '#CCCCCC';
  };

  const handleDeleteExercise = (exerciseId: string, exerciseName: string) => {
    Alert.alert(
      'Excluir Exercício',
      `Tem certeza que deseja excluir "${exerciseName}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive',
          onPress: () => deleteExercise(exerciseId)
        }
      ]
    );
  };

  const handleEditExercise = (exerciseId: string) => {
    navigation.navigate('EditExercise', { exerciseId });
  };

  const renderExerciseItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.exerciseCard}
      onPress={() => handleEditExercise(item.id)}
      onLongPress={() => handleDeleteExercise(item.id, item.name)}
    >
      <View style={styles.exerciseHeader}>
        <Text variant="subtitle" style={styles.exerciseName}>
          {item.name}
        </Text>
        <View 
          style={[
            styles.muscleGroupBadge,
            { backgroundColor: getMuscleGroupColor(item.muscleGroupId) }
          ]}
        >
          <Text style={styles.badgeText}>
            {getMuscleGroupName(item.muscleGroupId)}
          </Text>
        </View>
      </View>
      
      <View style={styles.exerciseDetails}>
        <Text variant="caption">
          {item.defaultSets} séries × {item.defaultReps} reps
        </Text>
        <Text variant="caption">
          Descanso: {item.defaultRestTime}s
        </Text>
      </View>

      <View style={styles.exerciseActions}>
        <Button
          title="Editar"
          onPress={() => handleEditExercise(item.id)}
          style={styles.editButton}
        />
        <Button
          title="Excluir"
          onPress={() => handleDeleteExercise(item.id, item.name)}
          style={styles.deleteButton}
        />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* <View style={styles.header}>
        <Text variant="title">Meus Exercícios</Text>
        <Text variant="caption">
          {exercises.length} exercício{exercises.length !== 1 ? 's' : ''} cadastrado{exercises.length !== 1 ? 's' : ''}
        </Text>
      </View> */}

      {exercises.length === 0 ? (
        <View style={styles.emptyState}>
          <Text variant="subtitle" align="center">
            Nenhum exercício cadastrado
          </Text>
          <Text variant="body" align="center" style={styles.emptyText}>
            Toque no botão abaixo para criar seu primeiro exercício!
          </Text>
          <Button
            title="Criar Primeiro Exercício"
            onPress={() => navigation.navigate('AddExercise')}
            style={styles.createButton}
          />
        </View>
      ) : (
        <FlatList
          data={exercises}
          keyExtractor={(item) => item.id}
          renderItem={renderExerciseItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      )}

      {exercises.length > 0 && (
      <View style={styles.fabContainer}>
        <TouchableOpacity 
          style={styles.fabButton}
          onPress={() => navigation.navigate('AddExercise')}
        >
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
      </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#1b1613ff',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  listContent: {
    paddingBottom: 80,
  },
  exerciseCard: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  exerciseName: {
    flex: 1,
    marginRight: 8,
  },
  muscleGroupBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  exerciseDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  exerciseActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  editButton: {
    flex: 1,
    marginRight: 8,
    backgroundColor: '#483148',
  },
  deleteButton: {
    flex: 1,
    marginLeft: 8,
    backgroundColor: '#332B33',
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
    bottom: 40,
    right: 20,
  },
  fabButton: {
    width: 60,
    height: 60,
    borderRadius: 30, // círculo
    backgroundColor: '#483148',
    justifyContent: 'center',
    alignItems: 'center',

    // sombra (Android + iOS)
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },

  fabText: {
    color: '#FFF',
    fontSize: 32,
    marginTop: -4, // centraliza visualmente o "+"
  },
});