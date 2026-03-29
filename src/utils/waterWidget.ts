import { NativeModules, Platform } from 'react-native';

const { WaterWidget } = NativeModules;

export const updateWaterWidget = (current: number, goal: number) => {
  if (Platform.OS !== 'android') return;
  if (!WaterWidget || typeof WaterWidget.update !== 'function') return;
  WaterWidget.update(current, goal);
};
