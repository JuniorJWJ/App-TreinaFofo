import React, {  useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { WaterDashboard } from '../../components/molecules/water/WaterDashboard';
import { WaterGoalModal } from '../../components/molecules/modals/WaterGoalModal';
import { useWaterStore } from '../../store/waterStore';
import { ScrollView } from 'react-native-gesture-handler';

export const WaterDashboardScreen = () => {
  const [goalModalVisible, setGoalModalVisible] = useState(false);
  
  const {
    currentIntake,
    dailyGoal,
    isLoading,
    config,
    addWater,
    resetDay,
    updateGoal,
    updateConfig,
  } = useWaterStore();

  const handleAdjustGoal = () => setGoalModalVisible(true);

  if (isLoading) {
    return <View style={styles.container} />;
  }

  return (
    <ScrollView style={styles.container}>
      <WaterDashboard
        dailyGoal={dailyGoal}
        currentIntake={currentIntake}
        onAddWater={addWater}
        onReset={resetDay}
        onAdjustGoal={handleAdjustGoal}
      />

      <WaterGoalModal
        visible={goalModalVisible}
        currentGoal={dailyGoal}
        onClose={() => setGoalModalVisible(false)}
        onSave={updateGoal}
        weight={config.weight || undefined}
        activityLevel={config.activityLevel}
        climate={config.climate}
        onProfileSave={(profile) => updateConfig({
          weight: profile.weight,
          activityLevel: profile.activityLevel as any,
          climate: profile.climate as any,
        })}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});