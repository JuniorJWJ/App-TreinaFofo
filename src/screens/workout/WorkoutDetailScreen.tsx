import React, { useMemo, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Text } from '../../components/atoms/Text';
import { Button } from '../../components/atoms/Button';
import { useWorkoutStore, useExerciseStore } from '../../store';
import { useMuscleGroupUtils } from '../../hooks/useMuscleGroupUtils';
import { WorkoutStats } from '../../components/molecules/workout/WorkoutStats';
import type { Exercise } from '../../types';

interface WorkoutDetailScreenProps {
  navigation: {
    navigate: (screen: string, params?: Record<string, unknown>) => void;
    goBack: () => void;
  };
  route: { params: { workoutId: string } };
}

const isExercise = (value: Exercise | undefined): value is Exercise => Boolean(value);

export const WorkoutDetailScreen: React.FC<WorkoutDetailScreenProps> = ({
  navigation,
  route,
}) => {
  const { workoutId } = route.params;
  const { workouts } = useWorkoutStore();
  const { exercises } = useExerciseStore();
  const { getMuscleGroupName, getMuscleGroupColor } = useMuscleGroupUtils();

  const workout = workouts.find(w => w.id === workoutId);
  const [expandedExerciseId, setExpandedExerciseId] = useState<string | null>(
    null,
  );

  const workoutExercises = useMemo(() => {
    if (!workout) return [] as Exercise[];
    return workout.exerciseIds
      .map(id => exercises.find(ex => ex.id === id))
      .filter(isExercise);
  }, [workout, exercises]);

  const totalSets = useMemo(() => {
    return workoutExercises.reduce((sum, ex) => {
      return sum + (ex.defaultSets || 0);
    }, 0);
  }, [workoutExercises]);

  const getGifSource = (gifLocal: Exercise['gifLocal']) => {
    if (!gifLocal) return null;
    if (typeof gifLocal === 'number') return gifLocal;
    if (typeof gifLocal === 'string') return { uri: gifLocal };
    if (typeof gifLocal === 'object' && gifLocal.uri) return gifLocal;
    return null;
  };

  if (!workout) {
    return (
      <View style={styles.container}>
        <Text variant="subtitle" style={styles.title}>
          Treino não encontrado
        </Text>
        <Button
          title="Voltar"
          onPress={() => navigation.goBack()}
          style={styles.primaryButton}
        />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text variant="title" style={styles.title}>
          {workout.name}
        </Text>
        <Text variant="caption" style={styles.subtitle}>
          {workout.exerciseIds.length} exercícios • {workout.estimatedDuration} min
        </Text>
      </View>

      <WorkoutStats
        exerciseCount={workout.exerciseIds.length}
        totalSets={totalSets}
        estimatedDuration={workout.estimatedDuration}
      />

      <View style={styles.section}>
        <Text variant="subtitle" style={styles.sectionTitle}>
          Exercícios do Treino
        </Text>

        {workoutExercises.map((exercise, index) => {
          const isExpanded = expandedExerciseId === exercise.id;
          const hasAdditionalDetails =
            (exercise.defaultWeight !== undefined &&
              exercise.defaultWeight !== null) ||
            !!exercise.notes ||
            (exercise.warmupSets && exercise.warmupSets.length > 0) ||
            (exercise.progressionType && exercise.progressionType !== 'fixed') ||
            !!exercise.autoProgression ||
            !!exercise.gifLocal;

          const gifSource = getGifSource(exercise.gifLocal);

          return (
            <View key={exercise.id} style={styles.exerciseCard}>
              <TouchableOpacity
                style={styles.exerciseHeader}
                onPress={() =>
                  hasAdditionalDetails
                    ? setExpandedExerciseId(isExpanded ? null : exercise.id)
                    : undefined
                }
                activeOpacity={hasAdditionalDetails ? 0.7 : 1}
              >
                <View style={styles.exerciseInfo}>
                  <Text variant="body" style={styles.exerciseName}>
                    {index + 1}. {exercise.name}
                  </Text>
                  <View
                    style={[
                      styles.groupBadge,
                      {
                        backgroundColor: getMuscleGroupColor(
                          exercise.muscleGroupId,
                        ),
                      },
                    ]}
                  >
                    <Text style={styles.groupBadgeText}>
                      {getMuscleGroupName(exercise.muscleGroupId)}
                    </Text>
                  </View>
                </View>
                {hasAdditionalDetails && (
                  <Text style={styles.expandIcon}>{isExpanded ? '▴' : '▾'}</Text>
                )}
              </TouchableOpacity>

              <View style={styles.exerciseBasics}>
                <Text variant="caption" style={styles.basicText}>
                  {exercise.defaultSets} séries × {exercise.defaultReps} reps
                </Text>
                <Text variant="caption" style={styles.basicText}>
                  Descanso: {exercise.defaultRestTime}s
                </Text>
              </View>

              {isExpanded && (
                <View style={styles.details}>
                  {exercise.defaultWeight !== undefined &&
                    exercise.defaultWeight !== null && (
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Peso base</Text>
                        <Text style={styles.detailValue}>
                          {exercise.defaultWeight} {exercise.weightUnit || 'kg'}
                        </Text>
                      </View>
                    )}

                  {exercise.warmupSets && exercise.warmupSets.length > 0 && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Aquecimento</Text>
                      <Text style={styles.detailValue}>
                        {exercise.warmupSets
                          .map(set => `${set.reps} reps • ${set.percentage}%`)
                          .join(', ')}
                      </Text>
                    </View>
                  )}

                  {exercise.progressionType &&
                    exercise.progressionType !== 'fixed' && (
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Progressão</Text>
                        <Text style={styles.detailValue}>
                          {exercise.progressionType === 'range'
                            ? 'Faixa de repetições'
                            : exercise.progressionType === 'linear'
                              ? 'Progressão linear'
                              : 'Outro'}
                        </Text>
                      </View>
                    )}

                  {exercise.autoProgression && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Progressão auto</Text>
                      <Text style={styles.detailValue}>
                        {exercise.incrementSize || 2.5}{' '}
                        {exercise.weightUnit || 'kg'} / sessão
                      </Text>
                    </View>
                  )}

                  {exercise.notes && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Notas</Text>
                      <Text style={[styles.detailValue, styles.notesText]}>
                        {exercise.notes}
                      </Text>
                    </View>
                  )}

                  {gifSource && (
                    <View style={styles.gifContainer}>
                      <Image
                        source={gifSource}
                        style={styles.gif}
                        contentFit="contain"
                        transition={200}
                      />
                      <Text variant="caption" style={styles.gifCaption}>
                        Demonstração do exercício
                      </Text>
                    </View>
                  )}
                </View>
              )}
            </View>
          );
        })}
      </View>

      <View style={styles.actions}>
        <Button
          title="Editar Treino"
          onPress={() => navigation.navigate('EditWorkout', { workoutId })}
          style={styles.primaryButton}
        />
        <Button
          title="Voltar"
          onPress={() => navigation.goBack()}
          style={styles.secondaryButton}
        />
      </View>
    </ScrollView>
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
  header: {
    marginBottom: 16,
  },
  title: {
    color: '#FFF',
  },
  subtitle: {
    marginTop: 6,
    color: '#C8C1CB',
  },
  section: {
    marginTop: 16,
  },
  sectionTitle: {
    color: '#FFF',
    marginBottom: 12,
  },
  exerciseCard: {
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ECE7EF',
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  exerciseInfo: {
    flex: 1,
    marginRight: 8,
  },
  exerciseName: {
    fontWeight: '700',
    color: '#2B1D2E',
    marginBottom: 6,
  },
  groupBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  groupBadgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
  },
  expandIcon: {
    fontSize: 16,
    color: '#483148',
    fontWeight: '700',
  },
  exerciseBasics: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  basicText: {
    color: '#5B4C60',
  },
  details: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#EFE9F1',
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#5C3D66',
    width: 120,
  },
  detailValue: {
    fontSize: 12,
    color: '#666',
    flex: 1,
  },
  notesText: {
    fontStyle: 'italic',
    color: '#555',
  },
  gifContainer: {
    marginTop: 10,
    backgroundColor: '#F7F4F8',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E6E0E8',
  },
  gif: {
    width: '100%',
    height: 220,
    borderRadius: 8,
  },
  gifCaption: {
    marginTop: 6,
    color: '#6B5B6E',
    textAlign: 'center',
  },
  actions: {
    gap: 12,
    marginTop: 16,
  },
  primaryButton: {
    backgroundColor: '#483148',
  },
  secondaryButton: {
    backgroundColor: '#332B33',
  },
});
