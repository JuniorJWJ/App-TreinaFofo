import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { WeeklyPlanCard } from '../molecules/cards/WeeklyPlanCard';

interface WeeklyPlanListProps {
  plans: any[];
  activePlanId: string;
  onSetActivePlan: (planId: string, planName: string) => void;
  onEditPlan: (planId: string) => void;
  onDeletePlan: (planId: string, planName: string) => void;
}

export const WeeklyPlanList: React.FC<WeeklyPlanListProps> = ({
  plans,
  activePlanId,
  onSetActivePlan,
  onEditPlan,
  onDeletePlan,
}) => {
  const renderPlanItem = ({ item }: { item: any }) => (
    <WeeklyPlanCard
      plan={item}
      isActive={activePlanId === item.id}
      onSetActive={onSetActivePlan}
      onEdit={onEditPlan}
      onDelete={onDeletePlan}
    />
  );

  return (
    <FlatList
      data={plans}
      keyExtractor={(item) => item.id}
      renderItem={renderPlanItem}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.listContent}
    />
  );
};

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 80,
  },
});