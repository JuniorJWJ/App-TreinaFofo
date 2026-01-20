import React, { useEffect } from 'react';
import { StoreProvider } from './src/providers/StoreProvider';
import { AppNavigator } from './src/navigation/AppNavigator';
import { initializeAppData } from './src/utils/initializeData';

const App = () => {
  useEffect(() => {
    initializeAppData();
  }, []);

  return (
    <StoreProvider>
      <AppNavigator />
    </StoreProvider>
  );
};

export default App;