// src/components/molecules/WaterGoalModal.tsx - ATUALIZADO
import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
} from 'react-native';
import { Text } from '../atoms/Text';
import { Button } from '../atoms/Button';
import { WaterCalculatorModal } from './WaterCalculatorModal'; // Importe o novo modal

interface WaterGoalModalProps {
  visible: boolean;
  currentGoal: number;
  onClose: () => void;
  onSave: (goal: number) => void;
  weight?: number;
  activityLevel?: 'sedentary' | 'light' | 'moderate' | 'intense' | undefined;
  climate?: 'cold' | 'temperate' | 'hot' | undefined;
  onProfileSave?: (profile: {
    weight: number;
    activityLevel: string;
    climate: string;
  }) => void;
}

export const WaterGoalModal: React.FC<WaterGoalModalProps> = ({
  visible,
  currentGoal,
  onClose,
  onSave,
  weight,
  activityLevel = 'sedentary',
  climate = 'temperate',
  onProfileSave,
}) => {
  const [goal, setGoal] = useState(currentGoal.toString());
  const [inputError, setInputError] = useState('');
  const [calculatorModalVisible, setCalculatorModalVisible] = useState(false);

  useEffect(() => {
    if (visible) {
      setGoal(currentGoal.toString());
      setInputError('');
    }
  }, [visible, currentGoal]);

  const handleSave = () => {
    const goalNum = parseInt(goal);
    
    if (isNaN(goalNum) || goalNum <= 0) {
      setInputError('Por favor, digite um valor válido maior que 0');
      return;
    }
    
    if (goalNum < 1000) {
      Alert.alert(
        'Meta Baixa',
        'Uma meta abaixo de 1000ml pode não ser suficiente para manter uma boa hidratação. Tem certeza?',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Confirmar', onPress: () => {
            onSave(goalNum);
            onClose();
          }}
        ]
      );
    } else if (goalNum > 5000) {
      Alert.alert(
        'Meta Alta',
        'Uma meta acima de 5000ml pode ser excessiva para a maioria das pessoas. Consulte um médico se necessário. Deseja continuar?',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Confirmar', onPress: () => {
            onSave(goalNum);
            onClose();
          }}
        ]
      );
    } else {
      onSave(goalNum);
      onClose();
    }
  };

  const handleClose = () => {
    setGoal(currentGoal.toString());
    setInputError('');
    onClose();
  };

  const openCalculator = () => {
    setCalculatorModalVisible(true);
  };

  const closeCalculator = () => {
    setCalculatorModalVisible(false);
  };

  const handleCalculatorSave = (calculatedGoal: number) => {
    setGoal(calculatedGoal.toString());
    onSave(calculatedGoal);
    setCalculatorModalVisible(false);
    onClose();
  };

  return (
    <>
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={handleClose}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContainer}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
              <View style={styles.modalContent}>
                <Text variant="title" align="center" style={styles.modalTitle}>
                  Definir Meta Diária
                </Text>

                {/* Modo Manual */}
                <Text variant="body" style={styles.modalInstruction}>
                  Digite a meta de água em mililitros (ml)
                </Text>

                <TextInput
                  style={styles.modalInput}
                  value={goal}
                  onChangeText={(text) => {
                    setGoal(text.replace(/[^0-9]/g, ''));
                    setInputError('');
                  }}
                  placeholder="Ex: 2000"
                  keyboardType="numeric"
                  autoFocus={true}
                  maxLength={5}
                />

                {inputError ? (
                  <Text variant="caption" style={styles.errorText}>
                    {inputError}
                  </Text>
                ) : null}

                {/* Botão para abrir a calculadora */}
                <Button
                  title="Usar Calculadora Avançada"
                  onPress={openCalculator}
                  style={styles.calculatorButton} 
                />

                {/* Sugestões de meta */}
                <View style={styles.suggestionsContainer}>
                  <Text variant="caption" style={styles.suggestionTitle}>
                    Sugestões comuns:
                  </Text>
                  <View style={styles.suggestionButtons}>
                    {[1500, 2000, 2500, 3000, 4000].map((amount) => (
                      <Button
                        key={amount}
                        title={`${amount}ml`}
                        onPress={() => setGoal(amount.toString())}
                        style={styles.suggestionButton} 
                      />
                    ))}
                  </View>
                </View>

                <View style={styles.modalButtons}>
                  <Button
                    title="Cancelar"
                    onPress={handleClose}
                    style={styles.modalCancelButton} 
                  />
                  <Button
                    title="Salvar Meta"
                    onPress={handleSave}
                    style={styles.modalSubmitButton}
                  />
                </View>

                <View style={styles.guidelinesContainer}>
                  <Text variant="caption" style={styles.guidelinesTitle}>
                    Diretrizes Gerais:
                  </Text>
                  <Text variant="caption" style={styles.guideline}>
                    • Mínimo recomendado: 1500ml
                  </Text>
                  <Text variant="caption" style={styles.guideline}>
                    • Média geral: 2000-3000ml
                  </Text>
                  <Text variant="caption" style={styles.guideline}>
                    • Atletas: 3000-4000ml
                  </Text>
                </View>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Modal da Calculadora */}
      <WaterCalculatorModal
        visible={calculatorModalVisible}
        initialWeight={weight}
        initialActivityLevel={activityLevel as any}
        initialClimate={climate as any}
        onClose={closeCalculator}
        onSave={handleCalculatorSave}
        onProfileSave={onProfileSave}
      />
    </>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: 'white',
    borderRadius: 20,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  scrollContent: {
    flexGrow: 1,
  },
  modalContent: {
    padding: 24,
  },
  modalTitle: {
    marginBottom: 20,
    fontSize: 20,
  },
  modalInstruction: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
    lineHeight: 20,
  },
  modalInput: {
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 16,
    backgroundColor: '#FAFAFA',
  },
  errorText: {
    color: '#F44336',
    textAlign: 'center',
    marginBottom: 16,
  },
  calculatorButton: {
    marginBottom: 20,
    borderColor: '#2196F3',
  },
  suggestionsContainer: {
    marginBottom: 20,
  },
  suggestionTitle: {
    textAlign: 'center',
    marginBottom: 12,
    color: '#666',
    fontWeight: '600',
  },
  suggestionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  suggestionButton: {
    margin: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F0F7FF',
    borderColor: '#2196F3',
    borderWidth: 1,
    borderRadius: 8,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  modalCancelButton: {
    flex: 1,
    marginRight: 8,
  },
  modalSubmitButton: {
    flex: 1,
    marginLeft: 8,
    backgroundColor: '#2196F3',
  },
  guidelinesContainer: {
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  guidelinesTitle: {
    fontWeight: '600',
    marginBottom: 8,
    color: '#555',
  },
  guideline: {
    color: '#666',
    marginBottom: 4,
  },
});