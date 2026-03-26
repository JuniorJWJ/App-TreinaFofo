import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import { Text } from '../../components/atoms/Text';
import { Button } from '../../components/atoms/Button';
import { useExerciseStore } from '../../store';
import { useMuscleGroupUtils } from '../../hooks/useMuscleGroupUtils';

interface ExerciseDetailScreenProps {
  navigation: any;
  route: { params: { exerciseId: string } };
}

export const ExerciseDetailScreen: React.FC<ExerciseDetailScreenProps> = ({
  navigation,
  route,
}) => {
  const { exerciseId } = route.params;
  const { exercises } = useExerciseStore();
  const { getMuscleGroupName, getMuscleGroupColor } = useMuscleGroupUtils();

  const exercise = exercises.find(ex => ex.id === exerciseId);

  if (!exercise) {
    return (
      <View style={styles.container}>
        <Text variant="subtitle" style={styles.title}>
          Exercício não encontrado
        </Text>
        <Button
          title="Voltar"
          onPress={() => navigation.goBack()}
          style={styles.primaryButton}
        />
      </View>
    );
  }

  const primaryGroupName = getMuscleGroupName(exercise.muscleGroupId);
  const primaryGroupColor = getMuscleGroupColor(exercise.muscleGroupId);
  const secondaryGroups = (exercise.secondaryMuscleGroups || []).map(id => ({
    id,
    name: getMuscleGroupName(id),
    color: getMuscleGroupColor(id),
  }));

  const getGifSource = (gifLocal: any) => {
    if (!gifLocal) return null;
    if (typeof gifLocal === 'number') return gifLocal;
    if (typeof gifLocal === 'string') return { uri: gifLocal };
    if (typeof gifLocal === 'object' && gifLocal.uri) return gifLocal;
    return null;
  };

  const gifSource = getGifSource(exercise.gifLocal);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text variant="title" style={styles.title}>
          {exercise.name}
        </Text>
      </View>

      {exercise.description && (
        <View style={styles.section}>
          <Text variant="subtitle" style={styles.sectionTitle}>
            Descrição
          </Text>
          <Text style={styles.detailText}>{exercise.description}</Text>
        </View>
      )}

      <View style={styles.section}>
        <Text variant="subtitle" style={styles.sectionTitle}>
          Grupo Principal
        </Text>
        <View style={[styles.badge, { backgroundColor: primaryGroupColor }]}>
          <Text style={styles.badgeText}>{primaryGroupName}</Text>
        </View>

        {secondaryGroups.length > 0 && (
          <>
            <Text variant="subtitle" style={styles.sectionTitle}>
              Músculos Secundários
            </Text>
            <View style={styles.badgeRow}>
              {secondaryGroups.map(group => (
                <View
                  key={group.id}
                  style={[styles.badge, { backgroundColor: group.color }]}
                >
                  <Text style={styles.badgeText}>{group.name}</Text>
                </View>
              ))}
            </View>
          </>
        )}
      </View>

      <View style={styles.section}>
        <Text variant="subtitle" style={styles.sectionTitle}>
          Configurações Básicas
        </Text>
        <Text style={styles.detailText}>
          {exercise.defaultSets} séries × {exercise.defaultReps} reps
        </Text>
        <Text style={styles.detailText}>
          Descanso: {exercise.defaultRestTime}s
        </Text>
        {exercise.defaultWeight !== undefined && exercise.defaultWeight !== null && (
          <Text style={styles.detailText}>
            Peso base: {exercise.defaultWeight} {exercise.weightUnit || 'kg'}
          </Text>
        )}
      </View>

      {(exercise.warmupSets && exercise.warmupSets.length > 0) && (
        <View style={styles.section}>
          <Text variant="subtitle" style={styles.sectionTitle}>
            Séries de Aquecimento
          </Text>
          {exercise.warmupSets.map((set, idx) => (
            <Text key={idx} style={styles.detailText}>
              {set.reps} reps • {set.percentage}% do peso
            </Text>
          ))}
        </View>
      )}

      {(exercise.progressionType && exercise.progressionType !== 'fixed') && (
        <View style={styles.section}>
          <Text variant="subtitle" style={styles.sectionTitle}>
            Progressão
          </Text>
          <Text style={styles.detailText}>
            {exercise.progressionType === 'range'
              ? 'Faixa de repetições'
              : exercise.progressionType === 'linear'
                ? 'Progressão linear'
                : 'Outro'}
          </Text>
          {exercise.autoProgression && (
            <Text style={styles.detailText}>
              Incremento: {exercise.incrementSize || 2.5} {exercise.weightUnit || 'kg'} / sessão
            </Text>
          )}
        </View>
      )}

      {exercise.notes && (
        <View style={styles.section}>
          <Text variant="subtitle" style={styles.sectionTitle}>
            Notas
          </Text>
          <Text style={styles.detailText}>{exercise.notes}</Text>
        </View>
      )}

      {gifSource && (
        <View style={styles.section}>
          <Text variant="subtitle" style={styles.sectionTitle}>
            Demonstração
          </Text>
          <Image
            source={gifSource}
            style={styles.gif}
            contentFit="contain"
            transition={200}
          />
        </View>
      )}

      <View style={styles.actions}>
        <Button
          title="Editar"
          onPress={() => navigation.navigate('EditExercise', { exerciseId })}
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
  section: {
    backgroundColor: '#2D2D2D',
    padding: 12,
    borderRadius: 10,
    marginBottom: 14,
  },
  sectionTitle: {
    color: '#FFF',
    marginBottom: 8,
  },
  detailText: {
    color: '#DDD',
    marginBottom: 6,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 6,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  gif: {
    width: '100%',
    height: 240,
    borderRadius: 10,
    backgroundColor: '#1f1f1f',
  },
  actions: {
    gap: 12,
    marginTop: 8,
  },
  primaryButton: {
    backgroundColor: '#483148',
  },
  secondaryButton: {
    backgroundColor: '#332B33',
  },
});
