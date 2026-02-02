// components/atoms/HeaderLogo.tsx
import React from 'react';
import { TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

// Substitua isto pelo tipo real das rotas do seu app
type RootStackParamList = {
  Home: undefined;
  // outras rotas aqui, se houver
};

interface HeaderLogoProps {
  isHome?: boolean;
}

export const HeaderLogo: React.FC<HeaderLogoProps> = ({ isHome = false }) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const handlePress = () => {
    if (!isHome) {
      navigation.navigate('Home');
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={isHome}
      style={styles.container}
      activeOpacity={0.7}
    >
      <Image
        source={require('../../assets/icon.png')}
        style={styles.logo}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 8, // Opcional, se quiser bordas arredondadas
  },
});