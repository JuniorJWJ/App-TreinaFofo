// src/components/molecules/CustomWaterInputModal.tsx
import React from 'react';
import {
  Modal,
  View,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Text } from '../../atoms/Text';
import { Button } from '../../atoms/Button';

interface CustomWaterInputModalProps {
  visible: boolean;
  amount: string;
  error: string;
  onAmountChange: (text: string) => void;
  onClose: () => void;
  onSubmit: () => void;
}

export const CustomWaterInputModal: React.FC<CustomWaterInputModalProps> = ({
  visible,
  amount,
  error,
  onAmountChange,
  onClose,
  onSubmit,
}) => {
  const suggestionAmounts = [150, 200, 300, 500];

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalOverlay}
      >
        <ScrollView style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text variant="title" align="center">
              Adicionar Água Personalizada
            </Text>

            <Text variant="body" style={styles.modalInstruction}>
              Digite a quantidade em mililitros (ml)
            </Text>

            <TextInput
              style={styles.modalInput}
              value={amount}
              onChangeText={onAmountChange}
              placeholder="Ex: 300"
              keyboardType="numeric"
              autoFocus={true}
              maxLength={5}
            />

            {error ? (
              <Text variant="caption" style={styles.errorText}>
                {error}
              </Text>
            ) : null}

            <View style={styles.modalButtons}>
              <Button
                title="Cancelar"
                onPress={onClose}
                style={styles.modalCancelButton} 
              />
              <Button
                title="Adicionar"
                onPress={onSubmit}
                style={styles.modalSubmitButton}
              />
            </View>

            <View style={styles.modalQuickSuggestions}>
              <Text variant="caption" style={styles.suggestionTitle}>
                Sugestões:
              </Text>
              <View style={styles.suggestionButtons}>
                {suggestionAmounts.map((suggestion) => (
                  <Button
                    key={suggestion}
                    title={`${suggestion}ml`}
                    onPress={() => onAmountChange(suggestion.toString())}
                    style={styles.suggestionButton} 
                  />
                ))}
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
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
    maxHeight: '50%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalContent: {
    padding: 24,
  },
  modalInstruction: {
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 20,
    color: '#666',
  },
  modalInput: {
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 8,
    backgroundColor: '#FAFAFA',
  },
  errorText: {
    color: '#F44336',
    textAlign: 'center',
    marginBottom: 16,
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
  modalQuickSuggestions: {
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
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
    backgroundColor: '#1b1613ff',
    borderRadius: 8,
  },
});