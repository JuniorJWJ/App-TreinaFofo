import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { useWorkoutStore } from '../store';
import { useExerciseStore } from '../store';
import { Text } from '../components/atoms/Text';
import { Button } from '../components/atoms/Button';
import { FloatingActionButton } from '../components/molecules/FloatingActionButton';
import { ConfirmationModal } from '../components/molecules/ConfirmationModal';
import { useConfirmationModal } from '../hooks/useConfirmationModal';
interface WorkoutListScreenProps {
  navigation: any;
}

export const WorkoutListScreen: React.FC<WorkoutListScreenProps> = ({
  navigation,
}) => {
  const { workouts, deleteWorkout } = useWorkoutStore();
  const { exercises } = useExerciseStore();
  const modal = useConfirmationModal();

  const getExerciseName = (exerciseId: string) => {
    const exercise = exercises.find(ex => ex.id === exerciseId);
    return exercise ? exercise.name : 'Exercício não encontrado';
  };

  const handleDeleteWorkout = (workoutId: string, workoutName: string) => {
    modal.showConfirmation(
      `Tem certeza que deseja excluir o treino "${workoutName}"?`,
      'Excluir Treino',
      () => {
        deleteWorkout(workoutId);
        modal.hideModal();
      },
      'Excluir',
      'Cancelar',
    );
  };

  const renderWorkoutItem = ({ item }: { item: any }) => (
    <View
      style={[
        styles.workoutCard,
        // activeWorkoutId === item.id && styles.activeWorkoutCard
      ]}
    >
      <View style={styles.workoutHeader}>
        <Text variant="subtitle" style={styles.workoutName}>
          {item.name}
        </Text>
      </View>

      <View style={styles.workoutDetails}>
        <Text variant="caption">
          {item.exerciseIds.length} exercício
          {item.exerciseIds.length !== 1 ? 's' : ''}
        </Text>
        {/* <Text variant="caption">
          Criado em: {new Date(item.createdAt).toLocaleDateString('pt-BR')}
        </Text> */}
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
      <View style={styles.workoutActions}>
        <Button
          title="Editar"
          onPress={() =>
            navigation.navigate('EditWorkout', { workoutId: item.id })
          }
          style={styles.editButton}
        />
        <Button
          title="Excluir"
          onPress={() => handleDeleteWorkout(item.id, item.name)}
          style={styles.deleteButton}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {modal.modalConfig && (
        <ConfirmationModal
          visible={modal.isVisible}
          type={modal.modalConfig.type}
          title={modal.modalConfig.title}
          message={modal.modalConfig.message}
          confirmText={modal.modalConfig.confirmText}
          cancelText={modal.modalConfig.cancelText}
          onConfirm={() => {
            modal.modalConfig?.onConfirm?.();
            modal.hideModal();
          }}
          onCancel={() => {
            modal.modalConfig?.onCancel?.();
            modal.hideModal();
          }}
          showCancelButton={modal.modalConfig.showCancelButton}
          hideIcon={modal.modalConfig.hideIcon}
          onClose={modal.hideModal}
        />
      )}

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
          keyExtractor={item => item.id}
          renderItem={renderWorkoutItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      )}

      {workouts.length > 0 && (
        <FloatingActionButton
          onPress={() => navigation.navigate('CreateWorkout')}
          position="bottom-right"
          offset={{ bottom: 40, right: 20 }}
          label="+"
          backgroundColor="#483148"
          color="#FFF"
          size="medium"
          visible={workouts.length > 0}
        />
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
  workoutCard: {
    backgroundColor: '#e9dfdfff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  activeWorkoutCard: {
    borderColor: '#483148',
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
    backgroundColor: '#483148',
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
  deleteButton: {
    flex: 1,
    marginLeft: 8,
    backgroundColor: '#332B33',
  },
  editButton: {
    flex: 1,
    marginRight: 8,
    backgroundColor: '#483148',
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

    // sombra
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },

  fabText: {
    color: '#FFF',
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: -2,
  },
});
