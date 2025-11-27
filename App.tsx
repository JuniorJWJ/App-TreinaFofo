// App.tsx
import React from 'react';
import { StoreProvider } from './src/providers/StoreProvider';
import { AppNavigator } from './src/navigation/AppNavigator';

const App = () => {
  return (
    <StoreProvider>
      <AppNavigator />
    </StoreProvider>
  );
};

export default App;