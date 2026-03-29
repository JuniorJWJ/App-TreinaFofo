import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
// @ts-ignore
import { ProgressCircle } from 'react-native-svg-charts';
import { Text } from '../../components/atoms/Text';
import { Button } from '../../components/atoms/Button';
import { CustomWaterInputModal } from '../../components/molecules/modals/CustomWaterInputModal';
import { ConfirmationModal } from '../../components/molecules/modals/ConfirmationModal';
import { useConfirmationModal } from '../../hooks/useConfirmationModal';

interface WaterDashboardProps {
  dailyGoal: number;
  currentIntake: number;
  onAddWater: (amount: number) => void;
  onReset: () => void;
  onAdjustGoal: () => void;
}

export const WaterDashboard: React.FC<WaterDashboardProps> = ({
  dailyGoal,
  currentIntake,
  onAddWater,
  onReset,
  onAdjustGoal,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [customAmount, setCustomAmount] = useState('');
  const [inputError, setInputError] = useState('');

  const modal = useConfirmationModal();

  const progress = Math.min(currentIntake / dailyGoal, 1);
  const remaining = dailyGoal - currentIntake;

  const quickAmounts = [100, 250, 500, 1000];

  const handleAddCustom = () => {
    setModalVisible(true);
    setCustomAmount('');
    setInputError('');
  };

  const handleReset = () => {
    modal.showConfirmation(
      'Tem certeza que deseja zerar a ingestao de agua do dia',
      'Resetar Dia',
      () => {
        onReset();
      },
      'Zerar',
      'Cancelar',
    );
  };

  const handleSubmitCustomAmount = () => {
    const amount = parseInt(customAmount, 10);

    if (Number.isNaN(amount) || amount <= 0) {
      setInputError('Por favor, digite um valor valido maior que 0');
      return;
    }

    if (amount > 10000) {
      setInputError('Valor muito alto. Digite um valor menor que 10.000 ml');
      return;
    }

    onAddWater(amount);
    setModalVisible(false);
    setCustomAmount('');
    setInputError('');
  };

  const closeModal = () => {
    setModalVisible(false);
    setCustomAmount('');
    setInputError('');
  };

  const handleAmountChange = (text: string) => {
    setCustomAmount(text.replace(/[^0-9]/g, ''));
    setInputError('');
  };

  const modalConfig = modal.modalConfig;

  return (
    <View style={styles.container}>
      <Text variant="title" align="center">
        Hidratacao Hoje
      </Text>

      <View style={styles.progressContainer}>
        <ProgressCircle
          style={styles.progressCircle}
          progress={progress}
          progressColor={progress >= 1 ? '#4CAF50' : '#4A90E2'}
          backgroundColor="#E0E0E0"
          strokeWidth={20}
        />
        <View style={styles.progressTextContainer}>
          <Text variant="title" style={styles.currentAmount}>
            {currentIntake}ml
          </Text>
          <Text variant="caption">de {dailyGoal}ml</Text>
          <Text
            variant="caption"
            style={[
              styles.remainingText,
              progress >= 1 && { color: '#4CAF50', fontWeight: 'bold' },
            ]}
          >
            {remaining > 0 ? `${remaining}ml restantes` : 'Meta alcancada!'}
          </Text>
        </View>
      </View>

      <View style={styles.quickAddContainer}>
        <Text variant="subtitle">Adicionar rapido:</Text>
        <View style={styles.quickButtons}>
          {quickAmounts.map(amount => (
            <Button
              key={amount}
              title={`+${amount}ml`}
              onPress={() => onAddWater(amount)}
              style={styles.quickButton}
            />
          ))}
        </View>
        <Button
          title="Adicionar Valor Personalizado"
          onPress={handleAddCustom}
          style={styles.customButton}
        />
      </View>

      {/* Estatisticas */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text variant="title" style={styles.statValue}>
            {Math.round(progress * 100)}%
          </Text>
          <Text variant="caption">Progresso</Text>
        </View>
        <View style={styles.statItem}>
          <Text variant="title" style={styles.statValue}>
            {Math.max(0, Math.ceil(remaining / 250))}
          </Text>
          <Text variant="caption">Copos restantes</Text>
        </View>
        <View style={styles.statItem}>
          <Text variant="title" style={styles.statValue}>
            {(currentIntake / 1000).toFixed(1)}L
          </Text>
          <Text variant="caption">Total hoje</Text>
        </View>
      </View>

      {/* Acoes */}
      <View style={styles.actionsContainer}>
        <Button
          title="Ajustar Meta"
          onPress={onAdjustGoal}
          style={styles.actionButton}
        />
        <Button
          title="Zerar Hoje"
          onPress={handleReset}
          style={[styles.actionButton, styles.resetButton]}
        />
      </View>

      {/* Modal para entrada personalizada */}
      <CustomWaterInputModal
        visible={modalVisible}
        amount={customAmount}
        error={inputError}
        onAmountChange={handleAmountChange}
        onClose={closeModal}
        onSubmit={handleSubmitCustomAmount}
      />

      {/* Modal de confirmacao */}
      {modalConfig && (
        <ConfirmationModal
          visible={modal.isVisible}
          type={modalConfig.type}
          title={modalConfig.title}
          message={modalConfig.message}
          confirmText={modalConfig.confirmText}
          cancelText={modalConfig.cancelText}
          onConfirm={() => {
            modalConfig.onConfirm?.();
            modal.hideModal();
          }}
          onCancel={() => {
            modalConfig.onCancel?.();
            modal.hideModal();
          }}
          showCancelButton={modalConfig.showCancelButton}
          hideIcon={modalConfig.hideIcon}
          onClose={modal.hideModal}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  progressContainer: {
    alignItems: 'center',
    marginVertical: 30,
  },
  progressCircle: {
    height: 200,
    width: 200,
  },
  progressTextContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  currentAmount: {
    fontSize: 32,
    color: '#4A90E2',
  },
  remainingText: {
    marginTop: 4,
    color: '#666',
  },
  quickAddContainer: {
    marginBottom: 30,
  },
  quickButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
    marginBottom: 15,
  },
  quickButton: {
    backgroundColor: '#004170ff',
    paddingHorizontal: 12,
  },
  customButton: {
    backgroundColor: '#2196F3',
    marginTop: 10,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#F8F9FA',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    color: '#4A90E2',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 5,
  },
  resetButton: {
    borderColor: '#F44336',
  },
});
