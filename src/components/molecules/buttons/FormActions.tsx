// components/molecules/FormActions.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from '../../atoms/Button';

interface FormActionsProps {
  isEditing: boolean;
  onSave: () => void;
  onCancel: () => void;
  isSaveDisabled: boolean;
}

export const FormActions: React.FC<FormActionsProps> = ({
  isEditing,
  onSave,
  onCancel,
  isSaveDisabled,
}) => {
  return (
    <View style={styles.buttonsContainer}>
      <Button
        title={isEditing ? 'Atualizar Plano' : 'Criar Plano'}
        onPress={onSave}
        style={[styles.button, styles.saveButton]}
        disabled={isSaveDisabled}
      />
      <Button
        title="Cancelar"
        onPress={onCancel}
        style={[styles.button, styles.cancelButton]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingBottom: 40,
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
  },
  cancelButton: {
    backgroundColor: '#6C757D',
  },
  saveButton: {
    backgroundColor: '#332B33',
  },
});