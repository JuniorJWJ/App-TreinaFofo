// src/components/molecules/WorkoutExerciseCard.tsx
import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from '../../atoms/Text';

interface WorkoutExerciseCardProps {
  exercise: {
    id: string;
    name: string;
    defaultSets: number;
    defaultReps: number;
    defaultRestTime: number;
    muscleGroupId: string;
  };
  isSelected: boolean;
  muscleGroupName: string;
  muscleGroupColor: string;
  onPress: () => void;
}

export const WorkoutExerciseCard: React.FC<WorkoutExerciseCardProps> = ({
  exercise,
  isSelected,
  muscleGroupName,
  muscleGroupColor,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.exerciseCard,
        isSelected ? styles.exerciseCardSelected : styles.exerciseCardUnselected
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.exerciseCardContent}>
        <View style={styles.exerciseInfo}>
          <Text style={[
            styles.exerciseName,
            isSelected && styles.exerciseNameSelected
          ]} numberOfLines={2}>
            {exercise.name}
          </Text>
          <Text style={styles.exerciseDetails}>
            {exercise.defaultSets} × {exercise.defaultReps} • {exercise.defaultRestTime}s
          </Text>
          <View style={styles.muscleGroupRow}>
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
        </View>
        <View style={[
          styles.selectionIndicator,
          isSelected && styles.selectionIndicatorSelected
        ]}>
          {isSelected && (
            <Text style={styles.checkmark}>✓</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  exerciseCard: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    overflow: 'hidden',
  },
  exerciseCardSelected: {
    borderColor: '#483148',
    borderWidth: 2,
    backgroundColor: '#FFF5F0',
  },
  exerciseCardUnselected: {
    borderColor: '#E0E0E0',
  },
  exerciseCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 12,
  },
  exerciseInfo: {
    flex: 1,
    marginRight: 8,
  },
  exerciseName: {
    fontWeight: '500',
    marginBottom: 2,
    color: '#333',
  },
  exerciseNameSelected: {
    color: '#483148',
  },
  exerciseDetails: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  muscleGroupRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  muscleGroupBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  badgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '600',
  },
  selectionIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
    marginTop: 4,
  },
  selectionIndicatorSelected: {
    backgroundColor: '#483148',
    borderColor: '#483148',
  },
  checkmark: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
});