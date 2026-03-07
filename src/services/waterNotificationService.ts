import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export interface WaterReminderScheduleConfig {
  wakeUpTime: Date | string | null;
  sleepTime: Date | string | null;
  dailyGoal: number;
  intervalMinutes: number;
}

const DAY_MINUTES = 24 * 60;

const parseDate = (value: Date | string | null): Date | null => {
  if (!value) {
    return null;
  }

  const parsed = value instanceof Date ? value : new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const minutesToHourMinute = (totalMinutes: number) => {
  const normalized = ((totalMinutes % DAY_MINUTES) + DAY_MINUTES) % DAY_MINUTES;

  return {
    hour: Math.floor(normalized / 60),
    minute: normalized % 60,
  };
};

export const setupWaterNotifications = async (): Promise<boolean> => {
  try {
    let permissions;

    if (Platform.OS === 'ios') {
      permissions = await Notifications.requestPermissionsAsync({
        ios: {
          allowAlert: true,
          allowBadge: true,
          allowSound: true,
        },
      });
    } else {
      permissions = await Notifications.requestPermissionsAsync();
    }

    const granted =
      permissions.granted ||
      permissions.status === 'granted' ||
      permissions.ios?.status === 2;

    if (!granted) {
      console.warn('Permissao para notificacoes nao concedida');
      return false;
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'Lembretes de agua',
        importance: Notifications.AndroidImportance.HIGH,
        sound: 'default',
      });
    }

    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });

    return true;
  } catch (error) {
    console.error('Erro ao configurar notificacoes:', error);
    return false;
  }
};

export const scheduleWaterReminders = async (
  reminderConfig: WaterReminderScheduleConfig
): Promise<void> => {
  try {
    const wakeUp = parseDate(reminderConfig.wakeUpTime);
    const sleep = parseDate(reminderConfig.sleepTime);
    const dailyGoal = reminderConfig.dailyGoal || 2000;
    const intervalMinutes = Math.max(1, reminderConfig.intervalMinutes || 120);

    if (!wakeUp || !sleep) {
      console.log('Horario de acordar e dormir nao configurado para lembretes');
      return;
    }

    await Notifications.cancelAllScheduledNotificationsAsync();

    if (intervalMinutes <= 5) {
      const quickTestTrigger: Notifications.TimeIntervalTriggerInput = {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        channelId: 'default',
        seconds: intervalMinutes * 60,
        repeats: true,
      };

      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Hora de beber agua',
          body: `Lembrete a cada ${intervalMinutes} min. Meta diaria: ${dailyGoal}ml`,
          sound: true,
          data: { type: 'water_reminder_quick_test' },
        },
        trigger: quickTestTrigger,
      });

      return;
    }

    const wakeMinutes = wakeUp.getHours() * 60 + wakeUp.getMinutes();
    const sleepMinutes = sleep.getHours() * 60 + sleep.getMinutes();
    const awakeWindowMinutes =
      sleepMinutes > wakeMinutes
        ? sleepMinutes - wakeMinutes
        : DAY_MINUTES - wakeMinutes + sleepMinutes;
    const safeAwakeWindow = Math.max(awakeWindowMinutes, 60);
    const notificationsCount = Math.min(
      64,
      Math.max(1, Math.floor(safeAwakeWindow / intervalMinutes))
    );
    const amountPerNotification = Math.round(dailyGoal / notificationsCount);
    const triggerInterval = safeAwakeWindow / (notificationsCount + 1);

    for (let i = 1; i <= notificationsCount; i++) {
      const reminderTotalMinutes = Math.round(wakeMinutes + triggerInterval * i);
      const { hour, minute } = minutesToHourMinute(reminderTotalMinutes);
      const trigger: Notifications.DailyTriggerInput = {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        channelId: 'default',
        hour,
        minute,
      };

      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Hora de beber agua',
          body: `Beba ${amountPerNotification}ml. Meta diaria: ${dailyGoal}ml`,
          sound: true,
          data: {
            type: 'water_reminder',
            amount: amountPerNotification,
            notificationId: `water_${i}`,
          },
        },
        trigger,
      });
    }

    const morningTime = minutesToHourMinute(wakeMinutes + 30);

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Bom dia',
        body: 'Comece o dia hidratando. Beba seu primeiro copo de agua.',
        sound: true,
        data: { type: 'morning_reminder' },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        channelId: 'default',
        hour: morningTime.hour,
        minute: morningTime.minute,
      },
    });
  } catch (error) {
    console.error('Erro ao agendar lembretes de agua:', error);
  }
};

export const cancelWaterReminders = async (): Promise<void> => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (error) {
    console.error('Erro ao cancelar notificacoes:', error);
  }
};

export const checkNotificationPermissions = async (): Promise<{
  granted: boolean;
  canAskAgain: boolean;
  status: string;
}> => {
  try {
    const settings = await Notifications.getPermissionsAsync();

    return {
      granted: settings.granted || settings.status === 'granted',
      canAskAgain: settings.canAskAgain ?? true,
      status: settings.status || 'unknown',
    };
  } catch (error) {
    console.error('Erro ao verificar permissoes:', error);
    return { granted: false, canAskAgain: false, status: 'error' };
  }
};
