import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from '../../atoms/Button';
import { ConfirmationModal } from '../modals/ConfirmationModal';
import { useConfirmationModal } from '../../../hooks/useConfirmationModal';

interface WaterActionsPanelProps {
  onAdjustGoal?: () => void;
  onReset?: () => void;
}

export const WaterActionsPanel: React.FC<WaterActionsPanelProps> = ({
  onAdjustGoal,
  onReset,
}) => {
  const modal = useConfirmationModal();

  const handleReset = () => {
    if (!onReset) return;
    
    modal.showConfirmation(
      'Tem certeza que deseja zerar a ingestão de água do dia?',
      'Resetar Dia',
      () => {
        onReset();
      },
      'Zerar',
      'Cancelar'
    );
  };

  return (
    <>
      <View style={styles.container}>
        {onAdjustGoal && (
          <Button
            title="Ajustar Meta"
            onPress={onAdjustGoal}
            style={styles.actionButton}
          />
        )}
        {onReset && (
          <Button
            title="Zerar Hoje"
            onPress={handleReset}
            style={[styles.actionButton, styles.resetButton]}
          />
        )}
      </View>

      {/* Modal de confirmação */}
      {modal.modalConfig && (
        <ConfirmationModal
          visible={modal.isVisible}
          type={modal.modalConfig.type}
          title={modal.modalConfig.title}
          message={modal.modalConfig.message}
          confirmText={modal.modalConfig.confirmText}
          cancelText={modal.modalConfig.cancelText}
          onConfirm={() => {
            modal.modalConfig?.onConfirm?.();
            modal.hideModal();
          }}
          onCancel={() => {
            modal.modalConfig?.onCancel?.();
            modal.hideModal();
          }}
          showCancelButton={modal.modalConfig.showCancelButton}
          hideIcon={modal.modalConfig.hideIcon}
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