import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from '../../atoms/Button';
import { ConfirmationModal } from '../modals/ConfirmationModal';
import { useConfirmationModal } from '../../../hooks/useConfirmationModal';

interface WaterActionsPanelProps {
  onAdjustGoal: () => void;
  onReset: () => void;
}

export const WaterActionsPanel: React.FC<WaterActionsPanelProps> = ({
  onAdjustGoal,
  onReset,
}) => {
  const modal = useConfirmationModal();

  const handleReset = () => {
    modal.showConfirmation(
      'Tem certeza que deseja zerar a ingestao de agua do dia',
      'Resetar Dia',
      () => {
        onReset();
      },
      'Zerar',
      'Cancelar',
    );
  };

  const modalConfig = modal.modalConfig;

  return (
    <>
      <View style={styles.container}>
        <Button
          title="Ajustar Meta"
          onPress={onAdjustGoal}
          style={styles.actionButton}
        />
        <Button
          title="Zerar Hoje"
          onPress={handleReset}
          style={[styles.actionButton, styles.resetButton]}
        />
      </View>

      {/* Modal de confirmacao */}
      {modalConfig && (
        <ConfirmationModal
          visible={modal.isVisible}
          type={modalConfig.type}
          title={modalConfig.title}
          message={modalConfig.message}
          confirmText={modalConfig.confirmText}
          cancelText={modalConfig.cancelText}
          onConfirm={() => {
            modalConfig.onConfirm?.();
            modal.hideModal();
          }}
          onCancel={() => {
            modalConfig.onCancel?.();
            modal.hideModal();
          }}
          showCancelButton={modalConfig.showCancelButton}
          hideIcon={modalConfig.hideIcon}
          onClose={modal.hideModal}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 5,
  },
  resetButton: {
    borderColor: '#F44336',
  },
});
