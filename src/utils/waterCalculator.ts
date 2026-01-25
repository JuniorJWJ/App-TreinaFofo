/**
 * Calcula a necessidade diária de água baseada em fatores pessoais
 * Referência científica: Institute of Medicine (IOM)
 */

// Tipos para configuração usada no cálculo de ingestão de água
export type WaterActivityLevel = 'sedentary' | 'moderate' | 'active' | 'athlete';
export type WaterClimate = 'temperate' | 'hot' | 'very_hot';

export interface WaterConfig {
  weight: number; // em kg
  activityLevel?: WaterActivityLevel; // padrão: 'sedentary'
  climate?: WaterClimate; // padrão: 'temperate'
}

export const calculateWaterGoal = (config: WaterConfig): number => {
  // Método 1: Baseado no peso (método mais comum)
  // 35ml por kg para adultos
  const baseByWeight = config.weight * 35;
  
  // Método 2: Para atletas ou pessoas muito ativas
  let activityMultiplier = 1.0;
  switch (config.activityLevel) {
    case 'sedentary': activityMultiplier = 1.0; break;
    case 'moderate': activityMultiplier = 1.2; break;
    case 'active': activityMultiplier = 1.4; break;
    case 'athlete': activityMultiplier = 1.6; break;
  }
  
  // Método 3: Ajuste pelo clima
  let climateMultiplier = 1.0;
  switch (config.climate) {
    case 'temperate': climateMultiplier = 1.0; break;
    case 'hot': climateMultiplier = 1.2; break;
    case 'very_hot': climateMultiplier = 1.4; break;
  }
  
  let calculatedGoal = baseByWeight * activityMultiplier * climateMultiplier;
  
  // Arredonda para o múltiplo de 100 mais próximo
  calculatedGoal = Math.round(calculatedGoal / 100) * 100;

  // Limites saudáveis (min 1500ml, max 6000ml para pessoas sem condições especiais)
  return Math.max(1500, Math.min(calculatedGoal, 6000));
};

/**
 * Calcula a quantidade por gole/copo
 */
export const getRecommendedSipAmount = (weight: number): number => {
  // Recomendação: 7-10ml por kg por hora
  const hourlyNeed = weight * 8; // média de 8ml
  return Math.round(hourlyNeed / 6) * 50; // Divide em 6 momentos, arredonda para múltiplo de 50
};