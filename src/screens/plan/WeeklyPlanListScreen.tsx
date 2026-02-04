import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useWeeklyPlanStore } from '../../store';
import { FloatingActionButton } from '../../components/molecules/buttons/FloatingActionButton';
import { ConfirmationModal } from '../../components/molecules/modals/ConfirmationModal';
import { WeeklyPlanList } from '../../components/organisms/WeeklyPlanList';
import { EmptyWeeklyPlans } from '../../components/molecules/workout/EmptyWeeklyPlans';
import { useWeeklyPlanActions } from '../../hooks/useWeeklyPlanActions';

interface WeeklyPlanListScreenProps {
  navigation: any;
}

export const WeeklyPlanListScreen: React.FC<WeeklyPlanListScreenProps> = ({ navigation }) => {
  const { weeklyPlans, activePlanId } = useWeeklyPlanStore();
  const { handleDeletePlan, handleSetActivePlan, modal } = useWeeklyPlanActions();

  const handleEditPlan = (planId: string) => {
    navigation.navigate('CreateWeeklyPlan', { planId });
  };

  return (
    <View style={styles.container}>
      {weeklyPlans.length === 0 ? (
        <EmptyWeeklyPlans onCreatePlan={() => navigation.navigate('CreateWeeklyPlan')} />
      ) : (
        <WeeklyPlanList
          plans={weeklyPlans}
          activePlanId={activePlanId}
          onSetActivePlan={handleSetActivePlan}
          onEditPlan={handleEditPlan}
          onDeletePlan={handleDeletePlan}
        />
      )}

      {weeklyPlans.length > 0 && (
        <FloatingActionButton
          onPress={() => navigation.navigate('CreateWeeklyPlan')}
          position="bottom-right"
          offset={{ bottom: 40, right: 20 }}
          label="+"
          backgroundColor="#483148"
          color="#FFF"
          size="medium"
          visible={weeklyPlans.length > 0}
        />
      )}

      {/* Modal de confirmação */}
      {modal.modalConfig && (
        <ConfirmationModal
          visible={modal.isVisible}
          type={modal.modalConfig.type}
          title={modal.modalConfig.title}
          message={modal.modalConfig.message}
          confirmText={modal.modalConfig.confirmText}
          cancelText={modal.modalConfig.cancelText}
          onConfirm={() => {
            modal.modalConfig?.onConfirm?.();
            modal.hideModal();
          }}
          onCancel={() => {
            modal.modalConfig?.onCancel?.();
            modal.hideModal();
          }}
          showCancelButton={modal.modalConfig.showCancelButton}
          hideIcon={modal.modalConfig.hideIcon}
          onClose={modal.hideModal}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#1b1613ff',
  },
});