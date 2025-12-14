import React from 'react';
import { 
  View, 
  StyleSheet, 
  Modal, 
  ScrollView, 
  TouchableOpacity, 
  TouchableWithoutFeedback 
} from 'react-native';
import { Text } from '../atoms/Text';
import { Button } from '../atoms/Button';
import { useExerciseStore } from '../../store';
import { useMuscleGroupStore } from '../../store';

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
  // workout,
  workoutDetails,
  isCompleted,
  onToggleCompletion,
}) => {
  const { exercises } = useExerciseStore();
  const { muscleGroups } = useMuscleGroupStore();

  // const getExerciseName = (exerciseId: string) => {
  //   const exercise = exercises.find(ex => ex.id === exerciseId);
  //   return exercise ? exercise.name : 'Exercício não encontrado';
  // };

  const getMuscleGroupName = (muscleGroupId: string) => {
    const group = muscleGroups.find(mg => mg.id === muscleGroupId);
    return group ? group.name : 'Grupo não encontrado';
  };

  // Renderizar conteúdo comum (com botão de fechar)
  const renderModalContent = (content: React.ReactNode) => (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      {/* Overlay que cobre toda a tela e fecha o modal ao clicar */}
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          {/* Conteúdo do modal que NÃO fecha quando clicado */}
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                {/* Botão de fechar no canto superior direito */}
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
    return renderModalContent(
      <View style={styles.restContent}>
        <Text variant="title" align="center" style={styles.restTitle}>Descanso</Text>
        <Text variant="body" align="center" style={styles.restMessage}>
          Hoje é seu dia de descanso! 💤
        </Text>
        <Text variant="caption" align="center" style={styles.restTip}>
          O descanso é fundamental para a recuperação muscular e progresso.
        </Text>
      </View>
    );
  }

  return renderModalContent(
    <ScrollView 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Header */}
      <View style={styles.modalHeader}>
        <Text variant="title" align="center">{workoutDetails.name}</Text>
        <Text variant="caption" align="center" style={styles.workoutInfo}>
          {workoutDetails.exerciseIds.length} exercícios • {workoutDetails.estimatedDuration} min
        </Text>
      </View>

      {/* Status */}
      <View style={[
        styles.statusBadge,
        isCompleted ? styles.completedStatus : styles.pendingStatus
      ]}>
        <Text style={styles.statusText}>
          {isCompleted ? '✓ CONCLUÍDO' : '🔄 PENDENTE'}
        </Text>
      </View>

      {/* Exercícios */}
      <View style={styles.exercisesSection}>
        <Text variant="subtitle" style={styles.sectionTitle}>
          Exercícios do Treino:
        </Text>
        
        {workoutDetails.exerciseIds.map((exerciseId: string, index: number) => {
          const exercise = exercises.find(ex => ex.id === exerciseId);
          if (!exercise) return null;

          return (
            <View key={exerciseId} style={styles.exerciseItem}>
              <View style={styles.exerciseHeader}>
                <Text variant="body" style={styles.exerciseName}>
                  {index + 1}. {exercise.name}
                </Text>
                <View style={styles.muscleGroupTag}>
                  <Text style={styles.muscleGroupText}>
                    {getMuscleGroupName(exercise.muscleGroupId)}
                  </Text>
                </View>
              </View>
              
              <View style={styles.exerciseDetails}>
                <Text variant="caption">
                  {exercise.defaultSets} séries × {exercise.defaultReps} repetições
                </Text>
                <Text variant="caption">
                  Descanso: {exercise.defaultRestTime}s
                </Text>
              </View>
            </View>
          );
        })}
      </View>

      {/* Estatísticas Rápidas */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text variant="title" style={styles.statNumber}>
            {workoutDetails.exerciseIds.length}
          </Text>
          <Text variant="caption" align="center">
            Exercícios
          </Text>
        </View>
        
        <View style={styles.statItem}>
          <Text variant="title" style={styles.statNumber}>
            {workoutDetails.exerciseIds.reduce((total: number, exerciseId: string) => {
              const exercise = exercises.find(ex => ex.id === exerciseId);
              return total + (exercise?.defaultSets || 0);
            }, 0)}
          </Text>
          <Text variant="caption" align="center">
            Séries
          </Text>
        </View>
        
        <View style={styles.statItem}>
          <Text variant="title" style={styles.statNumber}>
            {workoutDetails.estimatedDuration}
          </Text>
          <Text variant="caption" align="center">
            Minutos
          </Text>
        </View>
      </View>

      {/* Ações */}
      <View style={styles.actionsContainer}>
        <Button
          title={isCompleted ? "✓ Treino Concluído" : "Marcar como Concluído"}
          onPress={onToggleCompletion}
          style={[
            styles.actionButton,
            isCompleted ? styles.completedButton : styles.pendingButton
          ]}
        />
        <Button
          title="Fechar"
          onPress={onClose}
          style={[styles.actionButton, styles.closeButton]}
          //variant="secondary"
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  // Overlay que cobre toda a tela
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  // Container do modal
  modalContainer: {
    width: '100%',
    maxHeight: '90%',
  },
  // Conteúdo do modal
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
  // Botão de fechar no canto superior direito
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
  // Estilos para conteúdo de descanso
  restContent: {
    paddingTop: 20,
    alignItems: 'center',
  },
  restTitle: {
    marginBottom: 16,
  },
  restMessage: {
    marginVertical: 16,
    fontSize: 18,
    color: '#666',
  },
  restTip: {
    marginBottom: 20,
    fontStyle: 'italic',
  },
  // Estilos do conteúdo com scroll
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
  exerciseItem: {
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  exerciseName: {
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
  exerciseDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    color: '#483148',
    marginBottom: 4,
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