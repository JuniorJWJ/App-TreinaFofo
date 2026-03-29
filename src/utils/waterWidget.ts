import { NativeModules, Platform } from 'react-native';

const { WaterWidget } = NativeModules;

export const updateWaterWidget = (current: number, goal: number) => {
  if (Platform.OS !== 'android') return;
  if (!WaterWidget || typeof WaterWidget.update !== 'function') return;
  WaterWidget.update(current, goal);
};

export const getWaterWidgetValues = async (): Promise<{
  current: number;
  goal: number;
} | null> => {
  if (Platform.OS !== 'android') return null;
  if (!WaterWidget || typeof WaterWidget.getValues !== 'function') return null;
  try {
    return await WaterWidget.getValues();
  } catch {
    return null;
  }
};
