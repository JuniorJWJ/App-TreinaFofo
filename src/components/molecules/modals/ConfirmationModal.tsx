import React from 'react';
import {
  Modal,
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { Text } from '../../atoms/Text';
import { Button } from '../../atoms/Button';

// Adicione a interface ModalConfig ou importe do seu hook
export interface ModalConfig {
  type?: 'success' | 'error' | 'warning' | 'info' | 'confirmation';
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  showCancelButton?: boolean;
  hideIcon?: boolean;
}

interface ConfirmationModalProps extends ModalConfig {
  visible: boolean;
  onClose: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  visible,
  type = 'info',
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  onConfirm,
  onCancel,
  showCancelButton = false,
  hideIcon = false,
  onClose,
}) => {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text variant="title" style={styles.title}>
            {title}
          </Text>

          <Text variant="body" style={styles.message}>
            {message}
          </Text>

          <View style={styles.actions}>
            {showCancelButton && onCancel && (
              <TouchableOpacity onPress={onCancel} style={styles.cancelButton}>
                <Text style={styles.cancelText}>{cancelText}</Text>
              </TouchableOpacity>
            )}

            <Button
              title={confirmText}
              onPress={onConfirm || onClose}
              style={styles.confirmButton}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  container: {
    width: Math.min(width * 0.9, 360),
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 24,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
    color: '#111',
  },
  message: {
    textAlign: 'center',
    marginBottom: 24,
    color: '#555',
    lineHeight: 22,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  cancelButton: {
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  cancelText: {
    color: '#777',
  },
  confirmButton: {
    minWidth: 120,
  },
});