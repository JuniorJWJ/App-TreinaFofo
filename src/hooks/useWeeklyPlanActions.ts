import { useConfirmationModal } from './useConfirmationModal';
import { useWeeklyPlanStore } from '../store';

export const useWeeklyPlanActions = () => {
  const { deleteWeeklyPlan, setActivePlan } = useWeeklyPlanStore();
  const modal = useConfirmationModal();

  const handleDeletePlan = (planId: string, planName: string) => {
    modal.showConfirmation(
      `Tem certeza que deseja excluir "${planName}"?`,
      'Excluir Plano',
      () => {
        deleteWeeklyPlan(planId);
        modal.showSuccess('Plano excluído com sucesso!', 'Sucesso!');
      },
      'Excluir',
      'Cancelar'
    );
  };

  const handleSetActivePlan = (planId: string, planName: string) => {
    setActivePlan(planId);
    
    modal.showSuccess(
      `"${planName}" definido como plano ativo!`,
      'Plano Ativo',
      () => {
        // Nada a fazer aqui, apenas fecha o modal
      }
    );
  };

  return {
    handleDeletePlan,
    handleSetActivePlan,
    modal,
  };
};