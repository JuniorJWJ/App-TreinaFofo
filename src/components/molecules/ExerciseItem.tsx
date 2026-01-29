// components/molecules/ExerciseItem.tsx
import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from '../atoms/Text';

interface ExerciseItemProps {
  exercise: any;
  index: number;
  isExpanded: boolean;
  hasAdditionalDetails: boolean;
  onToggleExpand: () => void;
  getMuscleGroupName: (muscleGroupId: string) => string;
}

export const ExerciseItem: React.FC<ExerciseItemProps> = ({
  exercise,
  index,
  isExpanded,
  hasAdditionalDetails,
  onToggleExpand,
  getMuscleGroupName,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.header}
        onPress={hasAdditionalDetails ? onToggleExpand : undefined}
        activeOpacity={hasAdditionalDetails ? 0.7 : 1}
      >
        <View style={styles.info}>
          <Text variant="body" style={styles.name}>
            {index + 1}. {exercise.name}
          </Text>
          <View style={styles.muscleGroupTag}>
            <Text style={styles.muscleGroupText}>
              {getMuscleGroupName(exercise.muscleGroupId)}
            </Text>
          </View>
        </View>
        
        {hasAdditionalDetails && (
          <View style={styles.expandIcon}>
            <Text style={styles.expandIconText}>
              {isExpanded ? '▲' : '▼'}
            </Text>
          </View>
        )}
      </TouchableOpacity>
      
      <View style={styles.details}>
        <View style={styles.basicDetails}>
          <Text variant="caption">
            {exercise.defaultSets} séries × {exercise.defaultReps} repetições
          </Text>
          <Text variant="caption">
            Descanso: {exercise.defaultRestTime}s
          </Text>
        </View>

        {isExpanded && (
          <View style={styles.additionalDetails}>
            {/* Peso Padrão */}
            {exercise.defaultWeight && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Peso Padrão:</Text>
                <Text style={styles.detailValue}>
                  {exercise.defaultWeight} {exercise.weightUnit || 'kg'}
                </Text>
              </View>
            )}

            {/* Séries de Aquecimento */}
            {exercise.warmupSets && exercise.warmupSets.length > 0 && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Aquecimento:</Text>
                <Text style={styles.detailValue}>
                  {exercise.warmupSets.map((set: any) => 
                    `${set.reps} reps ${set.weight ? `@ ${set.weight}${exercise.weightUnit || 'kg'}` : ''}`
                  ).join(', ')}
                </Text>
              </View>
            )}

            {/* Tipo de Progressão */}
            {exercise.progressionType && exercise.progressionType !== 'fixed' && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Progressão:</Text>
                <Text style={styles.detailValue}>
                  {exercise.progressionType === 'range' ? 'Faixa de Repetições' : 
                   exercise.progressionType === 'linear' ? 'Progressão Linear' : 
                   'Outro'}
                </Text>
              </View>
            )}

            {/* Progressão Automática */}
            {exercise.autoProgression && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Progressão Auto:</Text>
                <Text style={styles.detailValue}>
                  {exercise.incrementSize || 2.5} {exercise.weightUnit || 'kg'} por sessão
                </Text>
              </View>
            )}

            {/* Notas */}
            {exercise.notes && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Notas:</Text>
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
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E9ECEF',
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
    fontWeight: '600',
  },
  muscleGroupTag: {
    backgroundColor: '#332B33',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  muscleGroupText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '600',
  },
  expandIcon: {
    marginLeft: 8,
    paddingHorizontal: 8,
  },
  expandIconText: {
    fontSize: 14,
    color: '#483148',
    fontWeight: 'bold',
  },
  details: {
    marginTop: 4,
  },
  basicDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  additionalDetails: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#483148',
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