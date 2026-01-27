// src/components/molecules/FloatingActionButtonWithIcon.tsx
import React from 'react';
import { StyleSheet } from 'react-native';
import { FloatingActionButton, FloatingActionButtonProps } from './FloatingActionButton';
import Icon from 'react-native-vector-icons/MaterialIcons'; // ou sua biblioteca de ícones

export interface FabWithIconProps extends Omit<FloatingActionButtonProps, 'icon' | 'label'> {
  /** Nome do ícone */
  iconName: string;
  /** Tamanho do ícone */
  iconSize?: number;
  /** Cor do ícone */
  iconColor?: string;
}

export const FloatingActionButtonWithIcon: React.FC<FabWithIconProps> = ({
  iconName,
  iconSize = 24,
  iconColor = '#FFF',
  ...props
}) => {
  return (
    <FloatingActionButton
      {...props}
      icon={
        <Icon
          name={iconName}
          size={iconSize}
          color={iconColor}
          style={styles.icon}
        />
      }
    />
  );
};

const styles = StyleSheet.create({
  icon: {
    marginTop: -2,
  },
});