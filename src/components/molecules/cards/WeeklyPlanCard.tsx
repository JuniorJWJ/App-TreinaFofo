import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '../../atoms/Text';
import { Button } from '../../atoms/Button';

interface WeeklyPlanCardProps {
  plan: any;
  isActive: boolean;
  onSetActive: (planId: string, planName: string) => void;
  onEdit: (planId: string) => void;
  onDelete: (planId: string, planName: string) => void;
}

export const WeeklyPlanCard: React.FC<WeeklyPlanCardProps> = ({
  plan,
  isActive,
  onSetActive,
  onEdit,
  onDelete,
}) => {
  const getCompletedWorkouts = (plan: any) => {
    return plan.days.filter((d: any) => d.isCompleted).length;
  };

  return (
    <View style={[styles.planCard, isActive && styles.activePlanCard]}>
      <View style={styles.planHeader}>
        <Text variant="subtitle" style={styles.planName}>
          {plan.name}
        </Text>
        {isActive && (
          <View style={styles.activeBadge}>
            <Text style={styles.activeBadgeText}>ATIVO</Text>
          </View>
        )}
      </View>
      
      {plan.description ? (
        <Text variant="caption" style={styles.planDescription}>
          {plan.description}
        </Text>
      ) : null}

      <View style={styles.planStats}>
        <Text variant="caption">
          {getCompletedWorkouts(plan)}/{plan.days.length} treinos completados
        </Text>
        <Text variant="caption">
          Progresso: {plan.completionRate.toFixed(0)}%
        </Text>
      </View>

      <View style={styles.planActions}>
        {!isActive && (
          <Button
            title="Definir como Ativo"
            onPress={() => onSetActive(plan.id, plan.name)}
            style={styles.activeButton}
            disabled={isActive}
          />
        )}
        <Button
          title="Editar"
          onPress={() => onEdit(plan.id)}
          style={styles.editButton}
        />
        <Button
          title="Excluir"
          onPress={() => onDelete(plan.id, plan.name)}
          style={styles.deleteButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  planCard: {
    backgroundColor: '#e9dfdfff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  activePlanCard: {
    borderColor: '#483148',
    borderWidth: 2,
    backgroundColor: '#F0F8FF',
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  planName: {
    flex: 1,
  },
  activeBadge: {
    backgroundColor: '#985C73',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeBadgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  planDescription: {
    marginBottom: 8,
    color: '#666',
  },
  planStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  planActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  activeButton: {
    flex: 2,
    marginRight: 4,
    backgroundColor: '#985C73',
  },
  editButton: {
    flex: 1,
    marginHorizontal: 4,
    backgroundColor: '#483148',
  },
  deleteButton: {
    flex: 1,
    marginLeft: 4,
    backgroundColor: '#332B33',
  },
});