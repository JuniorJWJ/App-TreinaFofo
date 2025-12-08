// src/components/molecules/WaterCalculatorModal.tsx
import React, { useState, useEffect } from 'react';
import { Modal, View, StyleSheet, ScrollView } from 'react-native';
import { WaterCalculatorForm } from './WaterCalculatorForm';
import { Text } from '../atoms/Text';
import { Button } from '../atoms/Button';
import { WaterActivityLevel, WaterClimate } from '../../utils/waterCalculator';

interface WaterCalculatorModalProps {
  visible: boolean;
  initialWeight?: number;
  initialActivityLevel?: WaterActivityLevel;
  initialClimate?: WaterClimate;
  onClose: () => void;
  onSave: (goal: number) => void;
  onProfileSave?: (profile: {
    weight: number;
    activityLevel: string;
    climate: string;
  }) => void;
}

export const WaterCalculatorModal: React.FC<WaterCalculatorModalProps> = ({
  visible,
  initialWeight,
  initialActivityLevel = 'sedentary',
  initialClimate = 'temperate',
  onClose,
  onSave,
  onProfileSave,
}) => {
  const [calculatedGoal, setCalculatedGoal] = useState<number | null>(null);

  useEffect(() => {
    if (visible) {
      setCalculatedGoal(null);
    }
  }, [visible]);

  const handleGoalCalculated = (goal: number) => {
    setCalculatedGoal(goal);
  };

  const handleSaveAndClose = () => {
    if (calculatedGoal) {
      onSave(calculatedGoal);
    }
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text variant="title" style={styles.modalTitle}>
              Calculadora de Hidratação
            </Text>
            <Button
              title="✕"
              onPress={onClose}
              style={styles.closeButton} 
            />
          </View>

          <ScrollView style={styles.modalContent}>
            <WaterCalculatorForm
              initialWeight={initialWeight}
              initialActivityLevel={initialActivityLevel}
              initialClimate={initialClimate}
              onGoalCalculated={handleGoalCalculated}
              onProfileSave={onProfileSave}
            />
          </ScrollView>

          {calculatedGoal && (
            <View style={styles.footer}>
              <Button
                title={`Usar ${calculatedGoal}ml como Meta`}
                onPress={handleSaveAndClose}
                style={styles.saveButton}
              />
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 500,
    backgroundColor: 'white',
    borderRadius: 20,
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
  },
  closeButtonText: {
    fontSize: 18,
    color: '#666',
  },
  modalContent: {
    maxHeight: 600,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    backgroundColor: '#F9F9F9',
  },
  saveButton: {
    backgroundColor: '#2196F3',
  },
});