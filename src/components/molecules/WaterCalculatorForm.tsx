// src/components/molecules/WaterCalculatorForm.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Text } from '../atoms/Text';
import { Button } from '../atoms/Button';
import { calculateWaterGoal, WaterActivityLevel, WaterClimate } from '../../utils/waterCalculator';

interface WaterCalculatorFormProps {
  initialWeight?: number;
  initialActivityLevel?: WaterActivityLevel;
  initialClimate?: WaterClimate;
  onGoalCalculated?: (goal: number) => void;
  onProfileSave?: (profile: {
    weight: number;
    activityLevel: WaterActivityLevel;
    climate: WaterClimate;
  }) => void;
}

export const WaterCalculatorForm: React.FC<WaterCalculatorFormProps> = ({
  initialWeight,
  initialActivityLevel = 'sedentary',
  initialClimate = 'temperate',
  onGoalCalculated,
  onProfileSave,
}) => {
  const [weight, setWeight] = useState(initialWeight?.toString() || '');
  const [activityLevel, setActivityLevel] = useState<WaterActivityLevel>(initialActivityLevel);
  const [climate, setClimate] = useState<WaterClimate>(initialClimate);
  const [waterGoal, setWaterGoal] = useState<number | null>(null);
  const [showRecommendation, setShowRecommendation] = useState(false);

  // Atualiza quando os valores iniciais mudam
  useEffect(() => {
    if (initialWeight) {
      setWeight(initialWeight.toString());
    }
    setActivityLevel(initialActivityLevel);
    setClimate(initialClimate);
  }, [initialWeight, initialActivityLevel, initialClimate]);

  // Recalcula automaticamente quando os valores mudam
  useEffect(() => {
    const weightNum = parseFloat(weight);
    if (weight && weightNum > 0) {
      const goal = calculateWaterGoal({
        weight: weightNum,
        activityLevel,
        climate,
      });
      setWaterGoal(goal);
      
      if (onGoalCalculated) {
        onGoalCalculated(goal);
      }
    }
  }, [weight, activityLevel, climate, setWaterGoal, onGoalCalculated]);

  const handleSaveProfile = () => {
    const weightNum = parseFloat(weight);
    if (isNaN(weightNum) || weightNum <= 0) {
      return;
    }

    if (onProfileSave) {
      onProfileSave({
        weight: weightNum,
        activityLevel,
        climate,
      });
    }

    setShowRecommendation(true);
  };

  const activityLevels: { label: string; value: WaterActivityLevel }[] = [
    { label: 'Sedentário (pouco ou nenhum exercício)', value: 'sedentary' },
    { label: 'Moderado (exercício leve 1-3 dias/semana)', value: 'moderate' },
    { label: 'Ativo (exercício moderado 3-5 dias/semana)', value: 'active' },
    { label: 'Atleta (exercício intenso 6-7 dias/semana)', value: 'athlete' },
  ];

  const climates: { label: string; value: WaterClimate }[] = [
    { label: 'Temperado (15-25°C)', value: 'temperate' },
    { label: 'Quente (25-35°C)', value: 'hot' },
    { label: 'Muito Quente (>35°C ou seco)', value: 'very_hot' },
  ];

  const getActivityDescription = (level: WaterActivityLevel) => {
    switch (level) {
      case 'sedentary': return 'Pouco ou nenhum exercício físico';
      case 'moderate': return 'Exercício leve 1-3 vezes por semana';
      case 'active': return 'Exercício moderado 3-5 vezes por semana';
      case 'athlete': return 'Exercício intenso 6-7 vezes por semana';
      default: return '';
    }
  };

  const getClimateDescription = (climateValue: WaterClimate) => {
    switch (climateValue) {
      case 'temperate': return 'Clima ameno (15-25°C)';
      case 'hot': return 'Clima quente (25-35°C)';
      case 'very_hot': return 'Clima muito quente ou seco (>35°C)';
      default: return '';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text variant="title" align="center" style={styles.title}>
        Calculadora de Hidratação
      </Text>

      <Text variant="body" style={styles.description}>
        Calcule sua necessidade diária de água baseada no seu perfil
      </Text>

      {/* Peso */}
      <View style={styles.section}>
        <Text variant="subtitle" style={styles.sectionTitle}>
          Peso (kg)
        </Text>
        <TextInput
          style={styles.input}
          value={weight}
          onChangeText={setWeight}
          placeholder="Ex: 70"
          keyboardType="numeric"
          autoFocus={true}
        />
        <Text variant="caption" style={styles.hint}>
          Digite seu peso em quilogramas
        </Text>
      </View>

      {/* Nível de Atividade */}
      <View style={styles.section}>
        <Text variant="subtitle" style={styles.sectionTitle}>
          Nível de Atividade
        </Text>
        <View style={styles.optionsContainer}>
          {activityLevels.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.optionButton,
                activityLevel === option.value && styles.optionButtonActive,
              ]}
              onPress={() => setActivityLevel(option.value)}
            >
              <Text
                variant="body"
                style={[
                  styles.optionText,
                  activityLevel === option.value && styles.optionTextActive,
                ]}
              >
                {option.label}
              </Text>
              {activityLevel === option.value && (
                <Text variant="caption" style={styles.optionDescription}>
                  {getActivityDescription(option.value)}
                </Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Clima */}
      <View style={styles.section}>
        <Text variant="subtitle" style={styles.sectionTitle}>
          Clima Local
        </Text>
        <View style={styles.optionsContainer}>
          {climates.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.optionButton,
                climate === option.value && styles.optionButtonActive,
              ]}
              onPress={() => setClimate(option.value)}
            >
              <Text
                variant="body"
                style={[
                  styles.optionText,
                  climate === option.value && styles.optionTextActive,
                ]}
              >
                {option.label}
              </Text>
              {climate === option.value && (
                <Text variant="caption" style={styles.optionDescription}>
                  {getClimateDescription(option.value)}
                </Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Resultado */}
      {waterGoal && (
        <View style={styles.resultSection}>
          <View style={styles.resultCard}>
            <Text variant="title" align="center" style={styles.resultTitle}>
              Meta Diária Recomendada
            </Text>
            <Text variant="title" align="center" style={styles.resultValue}>
              {waterGoal} ml
            </Text>
            <Text variant="caption" align="center" style={styles.resultSubtitle}>
              Equivale a aproximadamente {Math.round(waterGoal / 250)} copos de 250ml
            </Text>

            <View style={styles.resultDetails}>
              <View style={styles.detailItem}>
                <Text variant="caption" style={styles.detailLabel}>
                  Peso:
                </Text>
                <Text variant="body" style={styles.detailValue}>
                  {weight} kg
                </Text>
              </View>
              <View style={styles.detailItem}>
                <Text variant="caption" style={styles.detailLabel}>
                  Atividade:
                </Text>
                <Text variant="body" style={styles.detailValue}>
                  {activityLevels.find(a => a.value === activityLevel)?.label}
                </Text>
              </View>
              <View style={styles.detailItem}>
                <Text variant="caption" style={styles.detailLabel}>
                  Clima:
                </Text>
                <Text variant="body" style={styles.detailValue}>
                  {climates.find(c => c.value === climate)?.label}
                </Text>
              </View>
            </View>
          </View>
        </View>
      )}

      {/* Ações */}
      <View style={styles.actionsContainer}>
        <Button
          title="Salvar Perfil e Meta"
          onPress={handleSaveProfile}
          style={styles.saveButton}
          disabled={!weight || parseFloat(weight) <= 0}
        />
      </View>

      {showRecommendation && waterGoal && (
        <View style={styles.recommendationBox}>
          <Text variant="body" style={styles.recommendationText}>
            ✅ Perfil salvo! Sua meta diária de {waterGoal}ml foi calculada com base nas suas características.
          </Text>
        </View>
      )}

      {/* Informações sobre hidratação */}
      <View style={styles.infoContainer}>
        <Text variant="subtitle" style={styles.infoTitle}>
          💡 Como funciona o cálculo?
        </Text>
        <Text variant="caption" style={styles.infoText}>
          • Base: 35ml por kg de peso corporal
        </Text>
        <Text variant="caption" style={styles.infoText}>
          • Multiplicador de atividade: 1.0 a 1.6
        </Text>
        <Text variant="caption" style={styles.infoText}>
          • Multiplicador de clima: 1.0 a 1.4
        </Text>
        <Text variant="caption" style={styles.infoText}>
          • Limites saudáveis: 1500ml mínimo, 4000ml máximo
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    marginBottom: 8,
    fontSize: 20,
  },
  description: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 12,
    color: '#333',
  },
  input: {
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#FAFAFA',
  },
  hint: {
    marginTop: 8,
    color: '#999',
    fontStyle: 'italic',
  },
  optionsContainer: {
    gap: 8,
  },
  optionButton: {
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#FAFAFA',
  },
  optionButtonActive: {
    color: '#fff',
    borderColor: '#433A3D',
    backgroundColor: '#483148',
  },
  optionText: {
    color: '#333',
  },
  optionTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  optionDescription: {
    marginTop: 4,
    color: '#fff',
    fontStyle: 'italic',
  },
  resultSection: {
    marginBottom: 24,
  },
  resultCard: {
    backgroundColor: '#F0F7FF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: '#433A3D',
  },
  resultTitle: {
    marginBottom: 8,
    color: '#433A3D',
    fontSize: 18,
  },
  resultValue: {
    fontSize: 36,
    color: '#433A3D',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  resultSubtitle: {
    color: '#666',
    marginBottom: 16,
  },
  resultDetails: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    color: '#666',
  },
  detailValue: {
    color: '#333',
    fontWeight: '500',
  },
  actionsContainer: {
    marginTop: 8,
    marginBottom: 24,
  },
  saveButton: {
    backgroundColor: '#433A3D',
  },
  recommendationBox: {
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  recommendationText: {
    color: '#2E7D32',
  },
  infoContainer: {
    backgroundColor: '#483148',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  infoTitle: {
    color: '#fff',
    marginBottom: 8,
  },
  infoText: {
    color: '#fff',
    marginBottom: 4,
    lineHeight: 18,
  },
});