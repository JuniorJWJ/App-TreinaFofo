// src/hooks/useConfirmationModal.ts
import { useState, useCallback } from 'react';

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

export const useConfirmationModal = () => {
  const [modalConfig, setModalConfig] = useState<ModalConfig | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const showModal = useCallback((config: ModalConfig) => {
    setModalConfig(config);
    setIsVisible(true);
  }, []);

  const hideModal = useCallback(() => {
    setIsVisible(false);
    // Limpa o config após a animação
    setTimeout(() => setModalConfig(null), 300);
  }, []);

  const showSuccess = (
    title: string,
    message: string,
    onConfirm?: () => void
  ) => {
    showAlert(title, message, onConfirm);
  };

  const showError = useCallback((message: string, title = 'Erro!', onConfirm?: () => void) => {
    showModal({
      type: 'error',
      title,
      message,
      confirmText: 'OK',
      onConfirm: onConfirm || hideModal,
      showCancelButton: false,
    });
  }, [showModal, hideModal]);

  const showWarning = useCallback((message: string, title = 'Atenção!', onConfirm?: () => void) => {
    showModal({
      type: 'warning',
      title,
      message,
      confirmText: 'Entendi',
      onConfirm: onConfirm || hideModal,
      showCancelButton: false,
    });
  }, [showModal, hideModal]);

  const showInfo = useCallback((message: string, title = 'Informação', onConfirm?: () => void) => {
    showModal({
      type: 'info',
      title,
      message,
      confirmText: 'OK',
      onConfirm: onConfirm || hideModal,
      showCancelButton: false,
    });
  }, [showModal, hideModal]);

  const showConfirmation = useCallback((
    message: string,
    title = 'Confirmação',
    onConfirm: () => void,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar'
  ) => {
    showModal({
      type: 'confirmation',
      title,
      message,
      confirmText,
      cancelText,
      onConfirm: () => {
        onConfirm();
        hideModal();
      },
      onCancel: hideModal,
      showCancelButton: true,
    });
  }, [showModal, hideModal]);

  const showAlert = (
    title: string,
    message: string,
    onConfirm?: () => void
  ) => {
    setModalConfig({
      title,
      message,
      confirmText: 'OK',
      onConfirm: () => {
        onConfirm?.();
        hideModal();
      },
    });
    setIsVisible(true);
  };


  return {
    modalConfig,
    isVisible,
    showModal,
    hideModal,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showConfirmation,
    showAlert
  };
};