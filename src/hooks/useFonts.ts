import { useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';

export const useFonts = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const loadFonts = async () => {
      try {
        // Carrega as fontes do MaterialIcons
        await Icon.loadFont();
        console.log('Fontes carregadas com sucesso!');
        setFontsLoaded(true);
      } catch (error) {
        console.error('Erro ao carregar fontes:', error);
        setFontsLoaded(false);
      }
    };

    loadFonts();
  }, []);

  return fontsLoaded;
};