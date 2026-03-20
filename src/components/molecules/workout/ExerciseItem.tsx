// components/molecules/ExerciseItem.tsx
import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from '../../atoms/Text';

interface ExerciseItemProps {
  exercise: any;
  index: number;
  isExpanded: boolean;
  isCompleted: boolean;
  hasAdditionalDetails: boolean;
  onToggleExpand: () => void;
  onToggleCompleted: () => void;
  getMuscleGroupName: (muscleGroupId: string) => string;
}

export const ExerciseItem: React.FC<ExerciseItemProps> = ({
  exercise,
  index,
  isExpanded,
  isCompleted,
  hasAdditionalDetails,
  onToggleExpand,
  onToggleCompleted,
  getMuscleGroupName,
}) => {
  return (
    <View style={[styles.container, isCompleted && styles.completedContainer]}>
      <TouchableOpacity
        style={styles.header}
        onPress={hasAdditionalDetails ? onToggleExpand : undefined}
        activeOpacity={hasAdditionalDetails ? 0.7 : 1}
      >
        <View style={styles.info}>
          <Text variant="body" style={[styles.name, isCompleted && styles.completedText]}>
            {index + 1}. {exercise.name}
          </Text>
          <View style={styles.muscleGroupTag}>
            <Text style={styles.muscleGroupText}>
              {getMuscleGroupName(exercise.muscleGroupId)}
            </Text>
          </View>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity
            onPress={onToggleCompleted}
            activeOpacity={0.7}
            style={styles.checkButton}
          >
            <View
              style={[
                styles.checkCircle,
                isCompleted && styles.checkCircleCompleted,
              ]}
            >
              <Text
                style={[
                  styles.checkText,
                  isCompleted && styles.checkTextCompleted,
                ]}
              >
                {isCompleted ? '✓' : ''}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

      <View style={styles.details}>
        <View style={styles.basicDetails}>
          <Text
            variant="caption"
            style={[styles.basicText, isCompleted && styles.completedText]}
          >
            {exercise.defaultSets} séries × {exercise.defaultReps} reps
          </Text>
          <Text
            variant="caption"
            style={[styles.basicText, isCompleted && styles.completedText]}
          >
            Descanso: {exercise.defaultRestTime}s
          </Text>
        </View>

        {hasAdditionalDetails && (
          <TouchableOpacity
            style={styles.bottomToggle}
            onPress={onToggleExpand}
            activeOpacity={0.7}
          >
            <Text style={styles.bottomToggleText}>
              {isExpanded ? '▴' : '▾'}
            </Text>
          </TouchableOpacity>
        )}

        {isExpanded && (
          <View style={styles.additionalDetails}>
            {exercise.defaultWeight !== undefined &&
              exercise.defaultWeight !== null && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Peso padrão</Text>
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
                    .map(
                      (set: any) =>
                        `${set.reps} reps${
                          set.weight
                            ? ` @ ${set.weight}${exercise.weightUnit || 'kg'}`
                            : ''
                        }`,
                    )
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
                  {exercise.incrementSize || 2.5} {exercise.weightUnit || 'kg'} /
                  sessão
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
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ECE7EF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  completedContainer: {
    backgroundColor: '#F3F3F3',
    borderColor: '#DADADA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  info: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  name: {
    flex: 1,
    marginRight: 8,
    fontWeight: '700',
    color: '#2B1D2E',
  },
  muscleGroupTag: {
    backgroundColor: '#332B33',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  muscleGroupText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkButton: {
    marginLeft: 6,
  },
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#A8A1AA',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  checkCircleCompleted: {
    backgroundColor: '#28A745',
    borderColor: '#28A745',
  },
  checkText: {
    fontSize: 12,
    color: '#FFF',
    fontWeight: 'bold',
  },
  checkTextCompleted: {
    color: '#FFF',
  },
  bottomToggle: {
    alignSelf: 'center',
    marginTop: 6,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  bottomToggleText: {
    fontSize: 16,
    color: '#483148',
    fontWeight: '700',
  },
  details: {
    marginTop: 4,
  },
  basicDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  basicText: {
    color: '#5B4C60',
  },
  completedText: {
    color: '#7B7B7B',
    textDecorationLine: 'line-through',
  },
  additionalDetails: {
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
});
