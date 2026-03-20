import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { Image } from 'expo-image';
import { Text } from '../../atoms/Text';
import { Button } from '../../atoms/Button';
import { useExerciseStore } from '../../../store';
import { useMuscleGroupUtils } from '../../../hooks/useMuscleGroupUtils';
import { ExerciseItem } from '../workout/ExerciseItem';
import { WorkoutStats } from '../../molecules/workout/WorkoutStats';
import { RestDayContent } from '../workout/RestDayContent';

interface TodayWorkoutModalProps {
  visible: boolean;
  onClose: () => void;
  workout: any;
  workoutDetails: any;
  isCompleted: boolean;
  onToggleCompletion: () => void;
}

export const TodayWorkoutModal: React.FC<TodayWorkoutModalProps> = ({
  visible,
  onClose,
  workoutDetails,
  isCompleted,
  onToggleCompletion,
}) => {
  const { exercises } = useExerciseStore();
  const { getMuscleGroupName } = useMuscleGroupUtils();
  const [expandedExerciseId, setExpandedExerciseId] = useState<string | null>(
    null,
  );

  const toggleExerciseExpand = (exerciseId: string) => {
    setExpandedExerciseId(expandedExerciseId === exerciseId ? null : exerciseId);
  };

  const totalSets =
    workoutDetails?.exerciseIds?.reduce((total: number, exerciseId: string) => {
      const exercise = exercises.find(ex => ex.id === exerciseId);
      return total + (exercise?.defaultSets || 0);
    }, 0) || 0;

  const renderModalContent = (content: React.ReactNode) => (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <TouchableOpacity
                  style={styles.closeIconButton}
                  onPress={onClose}
                  activeOpacity={0.7}
                >
                  <View style={styles.closeIconCircle}>
                    <Text style={styles.closeIconText}>✕</Text>
                  </View>
                </TouchableOpacity>

                {content}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );

  if (!workoutDetails) {
    return renderModalContent(<RestDayContent />);
  }

  return renderModalContent(
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.modalHeader}>
        <Text variant="title" align="center">
          {workoutDetails.name}
        </Text>
        <Text variant="caption" align="center" style={styles.workoutInfo}>
          {workoutDetails.exerciseIds.length} exercícios •{' '}
          {workoutDetails.estimatedDuration} min
        </Text>
      </View>

      <View
        style={[
          styles.statusBadge,
          isCompleted ? styles.completedStatus : styles.pendingStatus,
        ]}
      >
        <Text style={styles.statusText}>
          {isCompleted ? '✓ CONCLUÍDO' : '🔄 PENDENTE'}
        </Text>
      </View>

      <View style={styles.exercisesSection}>
        <Text variant="subtitle" style={styles.sectionTitle}>
          Exercícios do Treino:
        </Text>

        {workoutDetails.exerciseIds.map((exerciseId: string, index: number) => {
          const exercise = exercises.find(ex => ex.id === exerciseId);
          if (!exercise) return null;

          const isExpanded = expandedExerciseId === exerciseId;
          const hasAdditionalDetails =
            exercise.defaultWeight ||
            exercise.notes ||
            (exercise.warmupSets && exercise.warmupSets.length > 0) ||
            exercise.progressionType !== 'fixed';

          return (
            <View key={exerciseId} style={styles.exerciseBlock}>
              <ExerciseItem
                exercise={exercise}
                index={index}
                isExpanded={isExpanded}
                hasAdditionalDetails={!!hasAdditionalDetails}
                onToggleExpand={() => toggleExerciseExpand(exerciseId)}
                getMuscleGroupName={getMuscleGroupName}
              />

              {isExpanded && exercise.gifLocal && (
                <View style={styles.gifContainer}>
                  <Image
                    source={exercise.gifLocal}
                    style={styles.gifImage}
                    contentFit="contain"
                    transition={200}
                  />
                </View>
              )}
            </View>
          );
        })}
      </View>

      <WorkoutStats
        exerciseCount={workoutDetails.exerciseIds.length}
        totalSets={totalSets}
        estimatedDuration={workoutDetails.estimatedDuration}
      />

      <View style={styles.actionsContainer}>
        <Button
          title={isCompleted ? '✓ Treino Concluído' : 'Marcar como Concluído'}
          onPress={onToggleCompletion}
          style={[
            styles.actionButton,
            isCompleted ? styles.completedButton : styles.pendingButton,
          ]}
        />
        <Button
          title="Fechar"
          onPress={onClose}
          style={[styles.actionButton, styles.closeButton]}
        />
      </View>
    </ScrollView>,
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    width: '100%',
    maxHeight: '90%',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
    position: 'relative',
  },
  closeIconButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
  },
  closeIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#6C757D',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  closeIconText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  scrollContent: {
    paddingTop: 10,
  },
  modalHeader: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  workoutInfo: {
    marginTop: 8,
    color: '#666',
  },
  statusBadge: {
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 20,
  },
  completedStatus: {
    backgroundColor: '#E8F5E8',
    borderColor: '#28A745',
    borderWidth: 1,
  },
  pendingStatus: {
    backgroundColor: '#FFF3CD',
    borderColor: '#483148',
    borderWidth: 1,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  exercisesSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    marginBottom: 12,
    color: '#333',
  },
  exerciseBlock: {
    marginBottom: 12,
  },
  gifContainer: {
    marginTop: 8,
    backgroundColor: '#F2F2F2',
    borderRadius: 10,
    padding: 8,
  },
  gifImage: {
    width: '100%',
    height: 220,
  },
  actionsContainer: {
    gap: 12,
    marginTop: 10,
  },
  actionButton: {
    marginBottom: 0,
  },
  completedButton: {
    backgroundColor: '#28A745',
  },
  pendingButton: {
    backgroundColor: '#483148',
  },
  closeButton: {
    backgroundColor: '#6C757D',
  },
});
