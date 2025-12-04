// services/waterNotificationService.ts
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

export const setupWaterNotifications = async (): Promise<boolean> => {
  try {
    // Solicitar permissões - método atualizado
    let permissions;
    
    if (Platform.OS === 'ios') {
      // No iOS precisa pedir permissão separada
      permissions = await Notifications.requestPermissionsAsync({
        ios: {
          allowAlert: true,
          allowBadge: true,
          allowSound: true,
        },
      });
    } else {
      // Android
      permissions = await Notifications.requestPermissionsAsync();
    }

    // Verificar se as permissões foram concedidas
    const granted = permissions.granted || 
                   permissions.status === 'granted' ||
                   permissions.ios?.status === 2; // 2 = granted no iOS
    
    if (!granted) {
      console.warn('Permissão para notificações não concedida');
      return false;
    }

    // Configurar comportamento das notificações
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });

    return true;
  } catch (error) {
    console.error('Erro ao configurar notificações:', error);
    return false;
  }
};

export const scheduleWaterReminders = async (): Promise<void> => {
  try {
    const configStr = await AsyncStorage.getItem('@waterConfig');
    if (!configStr) {
      console.log('Configuração de água não encontrada');
      return;
    }

    const config = JSON.parse(configStr);
    
    // Verificar se temos os dados necessários
    if (!config.wakeUpTime || !config.sleepTime) {
      console.log('Horários não configurados');
      return;
    }

    const wakeUp = new Date(config.wakeUpTime);
    const sleep = new Date(config.sleepTime);
    const dailyGoal = config.dailyGoal || 2000;

    // Cancelar notificações antigas
    await Notifications.cancelAllScheduledNotificationsAsync();

    // Calcular quantas notificações e intervalos
    const hoursAwake = (sleep.getHours() - wakeUp.getHours() + 24) % 24;
    const notificationsCount = Math.max(3, Math.floor(hoursAwake / 2)); // Mínimo 3 notificações
    const amountPerNotification = Math.round(dailyGoal / notificationsCount);

    console.log(`Agendando ${notificationsCount} notificações de ${amountPerNotification}ml cada`);

    // Agendar notificações ao longo do dia
    for (let i = 1; i <= notificationsCount; i++) {
      const notificationTime = new Date(wakeUp);
      const hoursToAdd = Math.floor((hoursAwake / (notificationsCount + 1)) * i);
      notificationTime.setHours(wakeUp.getHours() + hoursToAdd);

      // Garantir que o horário é válido
      if (notificationTime.getHours() >= sleep.getHours()) {
        continue;
      }

      const trigger = {
        hour: notificationTime.getHours(),
        minute: notificationTime.getMinutes(),
        repeats: true,
      };

      await Notifications.scheduleNotificationAsync({
        content: {
          title: '💧 Hora de beber água!',
          body: `Beba ${amountPerNotification}ml de água. Meta diária: ${dailyGoal}ml`,
          sound: true,
          data: { 
            type: 'water_reminder', 
            amount: amountPerNotification,
            notificationId: `water_${i}` 
          },
        },
        trigger,
      });

      console.log(`Notificação ${i} agendada para: ${notificationTime.getHours()}:${notificationTime.getMinutes()}`);
    }

    // Notificação matinal (30 min depois de acordar)
    const morningTime = new Date(wakeUp);
    morningTime.setMinutes(morningTime.getMinutes() + 30);

    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🌅 Bom dia!',
        body: 'Comece seu dia bem hidratado! Beba seu primeiro copo de água.',
        sound: true,
        data: { type: 'morning_reminder' },
      },
      trigger: {
        hour: morningTime.getHours(),
        minute: morningTime.getMinutes(),
        repeats: true,
      },
    });

    console.log('Todas as notificações foram agendadas com sucesso!');
    
  } catch (error) {
    console.error('Erro detalhado ao agendar notificações:', error);
  }
};

// Função para cancelar todas as notificações de água
export const cancelWaterReminders = async (): Promise<void> => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log('Todas as notificações de água foram canceladas');
  } catch (error) {
    console.error('Erro ao cancelar notificações:', error);
  }
};

// Função para verificar o status das permissões
export const checkNotificationPermissions = async (): Promise<{
  granted: boolean;
  canAskAgain: boolean;
  status: string;
}> => {
  try {
    const settings = await Notifications.getPermissionsAsync();
    
    return {
      granted: settings.granted || settings.status === 'granted',
      canAskAgain: settings.canAskAgain || true,
      status: settings.status || 'unknown',
    };
  } catch (error) {
    console.error('Erro ao verificar permissões:', error);
    return { granted: false, canAskAgain: false, status: 'error' };
  }
};