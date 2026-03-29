import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text } from '../../components/atoms/Text';
import { Button } from '../../components/atoms/Button';
import { useWorkoutStore, useWeeklyPlanStore, useExerciseStore } from '../../store';
import { ConfirmationModal } from '../../components/molecules/modals/ConfirmationModal';
import { useConfirmationModal } from '../../hooks/useConfirmationModal';
import { weeklySplitTemplates } from '../../data/weeklySplitTemplates';
import { popularWorkouts } from '../../data/popularWorkouts';
import { DayOfWeek } from '../../types';

interface PopularWeeklySplitsScreenProps {
  navigation: {
    navigate: (screen: string, params?: Record<string, unknown>) => void;
  };
}

const dayLabels: Record<DayOfWeek, string> = {
  monday: 'Seg',
  tuesday: 'Ter',
  wednesday: 'Qua',
  thursday: 'Qui',
  friday: 'Sex',
  saturday: 'Sáb',
  sunday: 'Dom',
};

export const PopularWeeklySplitsScreen: React.FC<PopularWeeklySplitsScreenProps> = ({
  navigation,
}) => {
  const { addWorkout, workouts } = useWorkoutStore();
  const { addWeeklyPlan, setActivePlan } = useWeeklyPlanStore();
  const { exercises } = useExerciseStore();
  const modal = useConfirmationModal();

  const mapNamesToIds = (names: string[]) => {
    const ids: string[] = [];
    const missing: string[] = [];

    names.forEach(name => {
      const ex = exercises.find(
        e => e.name.toLowerCase() === name.toLowerCase(),
      );
      if (ex) ids.push(ex.id);
      else missing.push(name);
    });

    return { ids, missing };
  };

  const ensureWorkoutFromTemplate = (templateId: string) => {
    const template = popularWorkouts.find(w => w.id === templateId);
    if (!template) return null;

    const existing = workouts.find(w => w.name === template.name);
    if (existing) return existing.id;

    const { ids, missing } = mapNamesToIds(template.exerciseNames);
    if (missing.length > 0) {
      modal.showWarning(
        `Alguns exercícios não foram encontrados: ${missing.join(', ')}`,
        'Atenção!',
      );
      return null;
    }

    const muscleGroupIds = Array.from(
      new Set(
        ids
          .map(id => exercises.find(e => e.id === id)?.muscleGroupId)
          .filter(Boolean),
      ),
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

    const created = workouts.find(w => w.name === template.name);
    return created ? created.id : null;
  };

  const handleApplySplit = (splitId: string) => {
    const split = weeklySplitTemplates.find(s => s.id === splitId);
    if (!split) return;

    const days = split.days.map(d => {
      if (!d.workoutTemplateId) {
        return {
          day: d.day,
          workoutId: null,
          isCompleted: false,
          completedAt: undefined,
          notes: '',
        };
      }

      const workoutId = ensureWorkoutFromTemplate(d.workoutTemplateId);
      return {
        day: d.day,
        workoutId: workoutId || null,
        isCompleted: false,
        completedAt: undefined,
        notes: '',
      };
    });

    const planId = addWeeklyPlan({
      name: split.name,
      description: split.description,
      days,
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      workoutSplitId: '',
      isActive: false,
      isTemplate: false,
      totalWeeks: 4,
    });

    modal.showConfirmation(
      'Divisão semanal aplicada com sucesso!',
      'Sucesso!',
      () => {
        setActivePlan(planId);
        navigation.navigate('WeeklyPlanList');
      },
      'Definir como Ativa',
      'Ver Planos',
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text variant="title" style={styles.title}>
          Divisões Semanais Populares
        </Text>

        {weeklySplitTemplates.map(split => (
          <View key={split.id} style={styles.card}>
            <Text variant="subtitle" style={styles.cardTitle}>
              {split.name}
            </Text>
            <Text variant="caption" style={styles.cardSubtitle}>
              {split.description}
            </Text>

            <View style={styles.dayRow}>
              {split.days.map(d => (
                <View key={`${split.id}-${d.day}`} style={styles.dayChip}>
                  <Text style={styles.dayText}>{dayLabels[d.day]}</Text>
                  <Text style={styles.daySubText}>
                    {d.workoutTemplateId ? 'Treino' : 'Desc'}
                  </Text>
                </View>
              ))}
            </View>

            <View style={styles.tagRow}>
              {split.tags.map(tag => (
                <View key={tag} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>

            <Button
              title="Aplicar Divisão"
              onPress={() => handleApplySplit(split.id)}
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
    marginBottom: 8,
  },
  dayRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  dayChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#332B33',
    borderRadius: 10,
    alignItems: 'center',
  },
  dayText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '700',
  },
  daySubText: {
    color: '#AAA',
    fontSize: 10,
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
