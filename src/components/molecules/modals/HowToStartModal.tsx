import React from 'react';
import { Modal, View, StyleSheet } from 'react-native';
import { Text } from '../../atoms/Text';
import { Button } from '../../atoms/Button';

type Props = {
  visible: boolean;
  title: string;
  description: string;
  onNext?: () => void;
  onClose: () => void;
  isLastStep?: boolean;
};

export const HowToStartModal = ({
  visible,
  title,
  description,
  onNext,
  onClose,
  isLastStep,
}: Props) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text variant="subtitle">{title}</Text>
          <Text variant="body" style={styles.description}>
            {description}
          </Text>

          <Button
            title={isLastStep ? 'Entendi' : 'Próximo'}
            onPress={isLastStep ? onClose : onNext}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '85%',
    padding: 20,
    borderRadius: 16,
    backgroundColor: '#F8F9FA',
  },
  description: {
    marginTop: 12,
    marginBottom: 20,
    opacity: 0.9,
  },
});
