import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { AppProvider } from './src/context/AppContext';
import CompetitionDetailScreen from './src/screens/CompetitionDetailScreen';

export default function App() {
  return (
    <AppProvider>
      <StatusBar style="dark" />
      <CompetitionDetailScreen />
    </AppProvider>
  );
}
