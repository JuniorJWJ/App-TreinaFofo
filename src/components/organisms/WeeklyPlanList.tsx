import React, { useCallback } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { WeeklyPlanCard } from '../molecules/cards/WeeklyPlanCard';
import type { WeeklyPlan } from '../../types';

interface WeeklyPlanListProps {
  plans: WeeklyPlan[];
  activePlanId: string | null;
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
  const safePlans = (plans || []).filter(Boolean);

  const renderPlanItem = useCallback(
    ({ item }: { item: WeeklyPlan }) => (
      <WeeklyPlanCard
        plan={item}
        isActive={activePlanId === item.id}
        onSetActive={onSetActivePlan}
        onEdit={onEditPlan}
        onDelete={onDeletePlan}
      />
    ),
    [activePlanId, onSetActivePlan, onEditPlan, onDeletePlan],
  );

  return (
    <FlatList
      data={safePlans}
      keyExtractor={(item, index) =>
        item?.id || item?.name || `plan-${index}`
      }
      removeClippedSubviews
      initialNumToRender={8}
      maxToRenderPerBatch={8}
      windowSize={7}
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
