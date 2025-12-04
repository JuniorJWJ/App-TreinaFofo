import React from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { useWeeklyPlanStore } from '../store';
import { Text } from '../components/atoms/Text';
import { Button } from '../components/atoms/Button';

interface WeeklyPlanListScreenProps {
  navigation: any;
}

export const WeeklyPlanListScreen: React.FC<WeeklyPlanListScreenProps> = ({ navigation }) => {
  const { weeklyPlans, deleteWeeklyPlan, setActivePlan, activePlanId } = useWeeklyPlanStore();

  const handleDeletePlan = (planId: string, planName: string) => {
    Alert.alert(
      'Excluir Plano',
      `Tem certeza que deseja excluir "${planName}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive',
          onPress: () => deleteWeeklyPlan(planId)
        }
      ]
    );
  };

  const handleSetActivePlan = (planId: string) => {
    setActivePlan(planId);
    Alert.alert('Sucesso', 'Plano definido como ativo!');
  };

  const handleEditPlan = (planId: string) => {
    navigation.navigate('CreateWeeklyPlan', { planId });
  };

  const getCompletedWorkouts = (plan: any) => {
    return plan.days.filter((d: any) => d.isCompleted).length;
  };

  const renderPlanItem = ({ item }: { item: any }) => (
    <View style={[
      styles.planCard,
      activePlanId === item.id && styles.activePlanCard
    ]}>
      <View style={styles.planHeader}>
        <Text variant="subtitle" style={styles.planName}>
          {item.name}
        </Text>
        {activePlanId === item.id && (
          <View style={styles.activeBadge}>
            <Text style={styles.activeBadgeText}>ATIVO</Text>
          </View>
        )}
      </View>
      
      {item.description ? (
        <Text variant="caption" style={styles.planDescription}>
          {item.description}
        </Text>
      ) : null}

      <View style={styles.planStats}>
        <Text variant="caption">
          {getCompletedWorkouts(item)}/{item.days.length} treinos completados
        </Text>
        <Text variant="caption">
          Progresso: {item.completionRate.toFixed(0)}%
        </Text>
      </View>

      <View style={styles.planActions}>
        <Button
          title="Definir como Ativo"
          onPress={() => handleSetActivePlan(item.id)}
          style={styles.activeButton}
          disabled={activePlanId === item.id}
        />
        <Button
          title="Editar"
          onPress={() => handleEditPlan(item.id)}
          style={styles.editButton}
        />
        <Button
          title="Excluir"
          onPress={() => handleDeletePlan(item.id, item.name)}
          style={styles.deleteButton}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="title">Minhas Divisões Semanais</Text>
        <Text variant="caption">
          {weeklyPlans.length} plano{weeklyPlans.length !== 1 ? 's' : ''} cadastrado{weeklyPlans.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {weeklyPlans.length === 0 ? (
        <View style={styles.emptyState}>
          <Text variant="subtitle" align="center">
            Nenhum plano semanal cadastrado
          </Text>
          <Text variant="body" align="center" style={styles.emptyText}>
            Crie seu primeiro plano semanal para organizar seus treinos!
          </Text>
          <Button
            title="Criar Primeiro Plano"
            onPress={() => navigation.navigate('CreateWeeklyPlan')}
            style={styles.createButton}
          />
        </View>
      ) : (
        <FlatList
          data={weeklyPlans}
          keyExtractor={(item) => item.id}
          renderItem={renderPlanItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      )}

      {weeklyPlans.length > 0 && (
        <View style={styles.fabContainer}>
          <Button
            title="+ Nova Divisão"
            onPress={() => navigation.navigate('CreateWeeklyPlan')}
            style={styles.fabButton}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#e0b9a2ff',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  listContent: {
    paddingBottom: 80,
  },
  planCard: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  activePlanCard: {
    borderColor: '#d15710ff',
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
    backgroundColor: '#d15710ff',
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
    backgroundColor: '#28A745',
  },
  editButton: {
    flex: 1,
    marginHorizontal: 4,
    backgroundColor: '#FFC107',
  },
  deleteButton: {
    flex: 1,
    marginLeft: 4,
    backgroundColor: '#DC3545',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    marginTop: 8,
    marginBottom: 24,
    color: '#666',
  },
  createButton: {
    width: '100%',
  },
  fabContainer: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
  },
  fabButton: {
    backgroundColor: '#d15710ff',
  },
});