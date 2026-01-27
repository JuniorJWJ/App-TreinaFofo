import React from 'react';
import { Modal, View, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Text } from '../../atoms/Text';
import { Button } from '../../atoms/Button';
import { Workout } from '../../../types';

interface WorkoutSelectorModalProps {
  visible: boolean;
  workouts: Workout[];
  onClose: () => void;
  onSelect: (workoutId: string | null) => void;
}

export const WorkoutSelectorModal: React.FC<WorkoutSelectorModalProps> = ({
  visible,
  workouts,
  onClose,
  onSelect
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      {/* Overlay para fechar ao clicar fora */}
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose} />

      {/* Conteúdo do modal */}
      <View style={styles.modalContainer}>
        <View style={styles.header}>
          <Text variant="subtitle">Selecionar Treino</Text>

          {/* Botão X */}
          <TouchableOpacity onPress={onClose}>
            <Text variant="title" style={styles.closeButton}>×</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={workouts}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={
            <Button
              title="Descanso"
              onPress={() => onSelect(null)}
              style={styles.restButton}
            />
          }
          renderItem={({ item }) => (
            <Button
              title={item.name}
              onPress={() => onSelect(item.id)}
              style={styles.workoutButton}
            />
          )}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#FFF',
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '75%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  closeButton: {
    fontSize: 28,
    paddingHorizontal: 8,
  },
  workoutButton: {
    marginVertical: 4,
  },
  restButton: {
    backgroundColor: '#6C757D',
    marginBottom: 12,
  },
});
