import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Text } from '../../atoms/Text';

interface WeeklyPlanHeaderProps {
  onPress: () => void;
  disabled: boolean;
  isLoading: boolean;
  isEditing: boolean;
}

export const WeeklyPlanHeader: React.FC<WeeklyPlanHeaderProps> = ({
  onPress,
  disabled,
  isLoading,
  isEditing,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={{
        marginRight: 16,
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <Text style={{ color: '#FFF', fontWeight: 'bold' }}>
        {isLoading ? 'Salvando...' : isEditing ? 'Atualizar' : 'Criar'}
      </Text>
    </TouchableOpacity>
  );
};