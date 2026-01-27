// src/components/molecules/ExerciseCard.tsx
import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from '../../atoms/Text';
import { Button } from '../../atoms/Button';

interface ExerciseCardProps {
  exercise: any;
  onEdit: () => void;
  onDelete: () => void;
  onPress: () => void;
  onLongPress: () => void;
  muscleGroupName: string;
  muscleGroupColor: string;
  showGroupHeader?: boolean;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  onEdit,
  onDelete,
  onPress,
  onLongPress,
  muscleGroupName,
  muscleGroupColor,
  showGroupHeader = false,
}) => {
  return (
    <View>
      {showGroupHeader && (
        <View style={styles.groupHeader}>
          <Text style={styles.groupHeaderText}>{muscleGroupName}</Text>
        </View>
      )}
      
      <TouchableOpacity 
        style={styles.exerciseCard}
        onPress={onPress}
        onLongPress={onLongPress}
      >
        <View style={styles.exerciseHeader}>
          <Text variant="subtitle" style={styles.exerciseName}>
            {exercise.name}
          </Text>
          <View 
            style={[
              styles.muscleGroupBadge,
              { backgroundColor: muscleGroupColor }
            ]}
          >
            <Text style={styles.badgeText}>
              {muscleGroupName}
            </Text>
          </View>
        </View>
        
        <View style={styles.exerciseDetails}>
          <View style={styles.detailRow}>
            <Text variant="caption">
              {exercise.defaultSets} séries × {exercise.defaultReps} reps
            </Text>
            <Text variant="caption">
              Descanso: {exercise.defaultRestTime}s
            </Text>
          </View>
          {exercise.defaultWeight && (
            <Text variant="caption">
              Peso: {exercise.defaultWeight} {exercise.weightUnit || 'kg'}
            </Text>
          )}
        </View>

        <View style={styles.exerciseActions}>
          <Button
            title="Editar"
            onPress={onEdit}
            style={styles.editButton}
          />
          <Button
            title="Excluir"
            onPress={onDelete}
            style={styles.deleteButton}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  groupHeader: {
    marginTop: 16,
    marginBottom: 8,
    paddingLeft: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#483148',
  },
  groupHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  exerciseCard: {
    backgroundColor: '#e9dfdfff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
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
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
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
});