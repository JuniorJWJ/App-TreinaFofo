// types/water.ts
export interface WaterConfig {
  weight: number; // em kg
  age: number;
  activityLevel: 'sedentary' | 'moderate' | 'active' | 'athlete';
  climate: 'temperate' | 'hot' | 'very_hot';
  wakeUpTime: Date;
  sleepTime: Date;
  customGoal?: number; // em ml (se o usuário quiser definir manualmente)
}

export interface WaterReminder {
  id: string;
  time: Date;
  amount: number; // ml por notificação
  enabled: boolean;
}