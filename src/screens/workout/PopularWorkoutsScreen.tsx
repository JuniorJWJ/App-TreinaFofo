import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text } from '../../components/atoms/Text';
import { Button } from '../../components/atoms/Button';
import { useWorkoutStore } from '../../store';
import { useExerciseStore } from '../../store';
import { useConfirmationModal } from '../../hooks/useConfirmationModal';
import { ConfirmationModal } from '../../components/molecules/modals/ConfirmationModal';
import { popularWorkouts } from '../../data/popularWorkouts';

interface PopularWorkoutsScreenProps {
  navigation: any;
}

export const PopularWorkoutsScreen: React.FC<PopularWorkoutsScreenProps> = ({
  navigation,
}) => {
  const { addWorkout } = useWorkoutStore();
  const { exercises } = useExerciseStore();
  const modal = useConfirmationModal();

  const mapNamesToIds = (names: string[]) => {
    const ids: string[] = [];
    const missing: string[] = [];

    names.forEach((name) => {
      const ex = exercises.find(
        e => e.name.toLowerCase() === name.toLowerCase(),
      );
      if (ex) {
        ids.push(ex.id);
      } else {
        missing.push(name);
      }
    });

    return { ids, missing };
  };

  const handleAddWorkout = (templateId: string) => {
    const template = popularWorkouts.find(w => w.id === templateId);
    if (!template) return;

    const { ids, missing } = mapNamesToIds(template.exerciseNames);

    if (missing.length > 0) {
      modal.showWarning(
        `Alguns exercícios não foram encontrados: ${missing.join(', ')}`,
        'Atenção!',
      );
      return;
    }

    const muscleGroupIds = Array.from(
      new Set(ids.map(id => exercises.find(e => e.id === id)?.muscleGroupId).filter(Boolean)),
    ) as string[];

    addWorkout({
      name: template.name,
      description: template.description,
      muscleGroupIds,
      exerciseIds: ids,
      exercises: [],
      estimatedDuration: template.estimatedDuration,
      difficulty: template.difficulty,
      tags: template.tags,
    });

    modal.showConfirmation(
      'Treino popular adicionado com sucesso!',
      'Sucesso!',
      () => navigation.navigate('WorkoutList'),
      'Ver Treinos',
      'Adicionar Outro',
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text variant="title" style={styles.title}>
          Treinos Populares
        </Text>

        {popularWorkouts.map((workout) => (
          <View key={workout.id} style={styles.card}>
            <Text variant="subtitle" style={styles.cardTitle}>
              {workout.name}
            </Text>
            <Text variant="caption" style={styles.cardSubtitle}>
              {workout.description}
            </Text>
            <Text variant="caption" style={styles.cardSubtitle}>
              {workout.exerciseNames.length} exercícios • {workout.estimatedDuration} min
            </Text>
            <View style={styles.tagRow}>
              {workout.tags.map(tag => (
                <View key={tag} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
            <Button
              title="Adicionar ao Meu Treino"
              onPress={() => handleAddWorkout(workout.id)}
              style={styles.primaryButton}
            />
          </View>
        ))}
      </ScrollView>

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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1b1613ff',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  title: {
    color: '#FFF',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#2D2D2D',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#3A3A3A',
  },
  cardTitle: {
    color: '#FFF',
    marginBottom: 6,
  },
  cardSubtitle: {
    color: '#CCC',
    marginBottom: 6,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#483148',
    borderRadius: 10,
  },
  tagText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '600',
  },
  primaryButton: {
    backgroundColor: '#483148',
  },
});
