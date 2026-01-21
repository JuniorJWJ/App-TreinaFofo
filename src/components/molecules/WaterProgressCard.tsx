import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { WaterProgressMiniChart } from './WaterProgressMiniChart';
import { Text } from '../atoms/Text'; 

interface WaterProgressCardProps {
  currentIntake: number;
  dailyGoal: number;
  onPress?: () => void;
  onQuickAdd?: (amount: number) => void;
  showActions?: boolean;
}

export const WaterProgressCard: React.FC<WaterProgressCardProps> = ({
  currentIntake,
  dailyGoal,
  onPress,
  onQuickAdd,
  showActions = false,
}) => {
  const progress = Math.min(currentIntake / dailyGoal, 1);
  const remaining = dailyGoal - currentIntake;
  const quickAmounts = [100, 250, 500, 750, 1000];

  const getStatusText = () => {
    if (progress >= 1) return 'Meta atingida! 🎉';
    if (remaining > 0) return `${remaining}ml restantes`;
    return 'Continue hidratando-se!';
  };

  const getProgressPercentage = () => {
    return Math.round(progress * 100);
  };

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.9}
      disabled={!onPress}
    >
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text variant="subtitle" style={styles.title}>💧 Hidratação</Text>
          <Text variant="caption" style={styles.subtitle}>
            {getStatusText()}
          </Text>
        </View>
        <WaterProgressMiniChart
          currentIntake={currentIntake}
          dailyGoal={dailyGoal}
          compact={true}
        />
      </View>

      <View style={styles.progressBarContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill,
              { width: `${Math.min(progress * 100, 100)}%` }
            ]} 
          />
        </View>
        <Text variant="caption" style={styles.percentageText}>
          {getProgressPercentage()}%
        </Text>
      </View>

      {showActions && onQuickAdd && (
        <View style={styles.actionsContainer}>
          <View style={styles.quickButtons}>
            {quickAmounts.map(amount => (
              <TouchableOpacity
                key={amount}
                style={styles.quickButton}
                onPress={() => onQuickAdd(amount)}
              >
                <Text style={styles.quickButtonText}>+{amount}ml</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleContainer: {
    flex: 1,
    paddingRight: 12,
  },
  title: {
    color: '#332B33',
    marginBottom: 4,
  },
  subtitle: {
    color: '#666',
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    overflow: 'hidden',
    marginRight: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4A90E2',
    borderRadius: 3,
  },
  percentageText: {
    color: '#332B33',
    fontWeight: '600',
    minWidth: 40,
    textAlign: 'right',
  },
  actionsContainer: {
    marginTop: 8,
  },
  quickAddLabel: {
    color: '#666',
    marginBottom: 8,
  },
  quickButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  quickButton: {
    backgroundColor: '#723B73',
    paddingHorizontal: 4,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#985C73',
    marginHorizontal: 2,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickButtonText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '500',
    textAlign: 'center',
  },
});
