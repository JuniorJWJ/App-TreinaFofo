import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Platform,
  StyleSheet,
  Switch,
  TouchableOpacity,
  View,
} from 'react-native';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { ScrollView } from 'react-native-gesture-handler';

import { WaterDashboard } from '../../components/molecules/water/WaterDashboard';
import { WaterGoalModal } from '../../components/molecules/modals/WaterGoalModal';
import { Text } from '../../components/atoms/Text';
import { useWaterStore } from '../../store/waterStore';
import {
  cancelWaterReminders,
  scheduleWaterReminders,
  setupWaterNotifications,
} from '../../services/waterNotificationService';

type ReminderTimeKey = 'wakeUpTime' | 'sleepTime';
const REMINDER_INTERVAL_OPTIONS = [1, 5, 15, 30, 60, 120, 180];

const createDefaultTime = (hour: number, minute: number) => {
  const date = new Date();
  date.setHours(hour, minute, 0, 0);
  return date;
};

const parseReminderDate = (
  value: Date | string | null | undefined,
  fallbackHour: number,
  fallbackMinute: number
) => {
  if (!value) {
    return createDefaultTime(fallbackHour, fallbackMinute);
  }

  const parsed = value instanceof Date  value : new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return createDefaultTime(fallbackHour, fallbackMinute);
  }

  return parsed;
};

const formatTime = (value: Date) => {
  return value.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const WaterDashboardScreen = () => {
  const [goalModalVisible, setGoalModalVisible] = useState(false);
  const [showWakePicker, setShowWakePicker] = useState(false);
  const [showSleepPicker, setShowSleepPicker] = useState(false);

  const {
    currentIntake,
    dailyGoal,
    isLoading,
    config,
    addWater,
    resetDay,
    updateGoal,
    updateConfig,
  } = useWaterStore();

  const wakeUpTime = useMemo(
    () => parseReminderDate(config.wakeUpTime, 8, 0),
    [config.wakeUpTime]
  );

  const sleepTime = useMemo(
    () => parseReminderDate(config.sleepTime, 22, 0),
    [config.sleepTime]
  );
  const intervalMinutes = config.notificationIntervalMinutes || 120;

  const handleAdjustGoal = () => setGoalModalVisible(true);

  const applyReminderSchedule = useCallback(async (
    nextWakeUpTime: Date,
    nextSleepTime: Date,
    enabled: boolean,
    goal: number,
    interval: number
  ) => {
    if (!enabled) {
      await cancelWaterReminders();
      return;
    }

    await scheduleWaterReminders({
      wakeUpTime: nextWakeUpTime,
      sleepTime: nextSleepTime,
      dailyGoal: goal,
      intervalMinutes: interval,
    });
  }, []);

  const handleToggleNotifications = async (enabled: boolean) => {
    if (!enabled) {
      await updateConfig({ notificationsEnabled: false });
      await cancelWaterReminders();
      return;
    }

    const permissionGranted = await setupWaterNotifications();

    if (!permissionGranted) {
      Alert.alert(
        'Permissao necessaria',
        'Ative as notificacoes do app para receber lembretes de agua.'
      );
      return;
    }

    const nextWakeUp = config.wakeUpTime  wakeUpTime : createDefaultTime(8, 0);
    const nextSleep = config.sleepTime  sleepTime : createDefaultTime(22, 0);

    await updateConfig({
      notificationsEnabled: true,
      wakeUpTime: nextWakeUp,
      sleepTime: nextSleep,
      notificationIntervalMinutes: intervalMinutes,
    });
  };

  const handleTimeChange = async (
    key: ReminderTimeKey,
    event: DateTimePickerEvent,
    selectedDate: Date
  ) => {
    if (key === 'wakeUpTime') {
      setShowWakePicker(false);
    } else {
      setShowSleepPicker(false);
    }

    if (event.type !== 'set' || !selectedDate) {
      return;
    }

    await updateConfig({
      [key]: selectedDate,
    });
  };

  const handleIntervalChange = async (nextInterval: number) => {
    await updateConfig({ notificationIntervalMinutes: nextInterval });
  };

  useEffect(() => {
    if (!config.notificationsEnabled) {
      return;
    }

    applyReminderSchedule(wakeUpTime, sleepTime, true, dailyGoal, intervalMinutes);
  }, [
    applyReminderSchedule,
    config.notificationsEnabled,
    dailyGoal,
    intervalMinutes,
    sleepTime,
    wakeUpTime,
  ]);

  if (isLoading) {
    return <View style={styles.container} />;
  }

  return (
    <ScrollView style={styles.container}>
      <WaterDashboard
        dailyGoal={dailyGoal}
        currentIntake={currentIntake}
        onAddWater={addWater}
        onReset={resetDay}
        onAdjustGoal={handleAdjustGoal}
      />

      <View style={styles.notificationCard}>
        <View style={styles.notificationHeader}>
          <View>
            <Text variant="subtitle" style={styles.notificationTitle}>
              Lembretes de agua
            </Text>
            <Text variant="caption" style={styles.notificationDescription}>
              Receba alertas diarios para bater sua meta.
            </Text>
          </View>

          <Switch
            value={config.notificationsEnabled}
            onValueChange={handleToggleNotifications}
            trackColor={{ false: '#8A8A8A', true: '#8E6C8E' }}
            thumbColor={config.notificationsEnabled  '#483148' : '#E0E0E0'}
          />
        </View>

        <TouchableOpacity
          style={styles.timeButton}
          onPress={() => setShowWakePicker(true)}
          disabled={!config.notificationsEnabled}
        >
          <Text style={styles.timeLabel}>Acordar</Text>
          <Text style={styles.timeValue}>{formatTime(wakeUpTime)}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.timeButton}
          onPress={() => setShowSleepPicker(true)}
          disabled={!config.notificationsEnabled}
        >
          <Text style={styles.timeLabel}>Dormir</Text>
          <Text style={styles.timeValue}>{formatTime(sleepTime)}</Text>
        </TouchableOpacity>

        <View style={styles.intervalContainer}>
          <Text style={styles.timeLabel}>Lembrar a cada</Text>
          <View style={styles.intervalChips}>
            {REMINDER_INTERVAL_OPTIONS.map(option => {
              const selected = option === intervalMinutes;
              return (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.intervalChip,
                    selected && styles.intervalChipSelected,
                  ]}
                  disabled={!config.notificationsEnabled}
                  onPress={() => handleIntervalChange(option)}
                >
                  <Text
                    style={[
                      styles.intervalChipText,
                      selected && styles.intervalChipTextSelected,
                    ]}
                  >
                    {option} min
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {showWakePicker && (
          <DateTimePicker
            value={wakeUpTime}
            mode="time"
            is24Hour
            display={Platform.OS === 'ios'  'spinner' : 'default'}
            onChange={(event, date) =>
              handleTimeChange('wakeUpTime', event, date)
            }
          />
        )}

        {showSleepPicker && (
          <DateTimePicker
            value={sleepTime}
            mode="time"
            is24Hour
            display={Platform.OS === 'ios'  'spinner' : 'default'}
            onChange={(event, date) =>
              handleTimeChange('sleepTime', event, date)
            }
          />
        )}
      </View>

      <WaterGoalModal
        visible={goalModalVisible}
        currentGoal={dailyGoal}
        onClose={() => setGoalModalVisible(false)}
        onSave={updateGoal}
        weight={config.weight || undefined}
        activityLevel={config.activityLevel}
        climate={config.climate}
        onProfileSave={profile =>
          updateConfig({
            weight: profile.weight,
            activityLevel: profile.activityLevel as any,
            climate: profile.climate as any,
          })
        }
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  notificationCard: {
    marginHorizontal: 20,
    marginBottom: 24,
    marginTop: 6,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#F4EEF4',
    borderWidth: 1,
    borderColor: '#DDCFDD',
    gap: 12,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  notificationTitle: {
    fontSize: 18,
    marginBottom: 4,
    color: '#2C2228',
  },
  notificationDescription: {
    color: '#5F4C57',
  },
  timeButton: {
    borderWidth: 1,
    borderColor: '#C9B8C7',
    borderRadius: 10,
    backgroundColor: '#FFF',
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timeLabel: {
    color: '#4A3A45',
    fontWeight: '600',
  },
  timeValue: {
    color: '#221A20',
    fontWeight: '700',
    fontSize: 16,
  },
  intervalContainer: {
    gap: 10,
  },
  intervalChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  intervalChip: {
    borderWidth: 1,
    borderColor: '#C9B8C7',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#FFF',
  },
  intervalChipSelected: {
    borderColor: '#6F4B68',
    backgroundColor: '#6F4B68',
  },
  intervalChipText: {
    color: '#4A3A45',
    fontWeight: '600',
    fontSize: 13,
  },
  intervalChipTextSelected: {
    color: '#FFFFFF',
  },
});
