import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { StoreProvider } from './src/providers/StoreProvider';
import { AppNavigator } from './src/navigation/AppNavigator';
import { initializeAppData } from './src/utils/initializeData';

const App = () => {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        await Promise.all([
          initializeAppData(),
          MaterialIcons.loadFont(),
        ]);
      } catch (error) {
        console.error('Erro na inicialização:', error);
      } finally {
        setInitialized(true);
      }
    };

    init();
  }, []);

  if (!initialized) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1b1613ff' }}>
        <ActivityIndicator size="large" color="#483148" />
      </View>
    );
  }

  return (
    <StoreProvider>
      <AppNavigator />
    </StoreProvider>
  );
};

export default App;
