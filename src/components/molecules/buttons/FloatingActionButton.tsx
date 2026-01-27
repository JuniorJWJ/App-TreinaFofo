// src/components/molecules/FloatingActionButton.tsx
import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
} from 'react-native';
import { Text } from '../../atoms/Text';

export type FabPosition = 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'bottom-center' | 'top-center';

export interface FloatingActionButtonProps extends TouchableOpacityProps {
  /** Texto ou ícone do botão */
  label?: string;
  /** Ícone personalizado (sobrescreve o label) */
  icon?: React.ReactNode;
  /** Posição do FAB na tela */
  position?: FabPosition;
  /** Offset personalizado para posicionamento */
  offset?: {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
  };
  /** Cor de fundo */
  backgroundColor?: string;
  /** Cor do texto/ícone */
  color?: string;
  /** Tamanho do FAB */
  size?: 'small' | 'medium' | 'large';
  /** Elevação/shadow */
  elevation?: number;
  /** Callback de clique */
  onPress: () => void;
  /** Se o botão está visível */
  visible?: boolean;
  /** Estilos adicionais */
  containerStyle?: ViewStyle;
  /** Estilos adicionais para o texto */
  labelStyle?: TextStyle;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  label = '+',
  icon,
  position = 'bottom-right',
  offset = {},
  backgroundColor = '#483148',
  color = '#FFF',
  size = 'medium',
  elevation = 6,
  onPress,
  visible = true,
  containerStyle,
  labelStyle,
  style,
  ...rest
}) => {
  if (!visible) return null;

  // Tamanhos
  const sizeMap = {
    small: 48,
    medium: 60,
    large: 72,
  };

  const fabSize = sizeMap[size];
  const fontSize = size === 'small' ? 24 : size === 'medium' ? 32 : 40;

  // Posicionamento
  const positionStyles: ViewStyle = {};
  
  switch (position) {
    case 'bottom-right':
      positionStyles.bottom = offset.bottom ?? 40;
      positionStyles.right = offset.right ?? 20;
      break;
    case 'bottom-left':
      positionStyles.bottom = offset.bottom ?? 40;
      positionStyles.left = offset.left ?? 20;
      break;
    case 'top-right':
      positionStyles.top = offset.top ?? 40;
      positionStyles.right = offset.right ?? 20;
      break;
    case 'top-left':
      positionStyles.top = offset.top ?? 40;
      positionStyles.left = offset.left ?? 20;
      break;
    case 'bottom-center':
      positionStyles.bottom = offset.bottom ?? 40;
      positionStyles.left = '50%';
      positionStyles.transform = [{ translateX: -fabSize / 2 }];
      break;
    case 'top-center':
      positionStyles.top = offset.top ?? 40;
      positionStyles.left = '50%';
      positionStyles.transform = [{ translateX: -fabSize / 2 }];
      break;
  }

  const buttonStyle: ViewStyle = {
    width: fabSize,
    height: fabSize,
    borderRadius: fabSize / 2,
    backgroundColor,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    ...positionStyles,
    elevation,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  };

  return (
    <TouchableOpacity
      style={[styles.button, buttonStyle, containerStyle, style]}
      onPress={onPress}
      activeOpacity={0.8}
      {...rest}
    >
      {icon ? (
        icon
      ) : (
        <Text style={[styles.label, { color, fontSize }, labelStyle]}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    zIndex: 1000,
  },
  label: {
    fontWeight: 'bold',
    marginTop: -2,
  },
});