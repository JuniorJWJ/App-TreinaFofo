import { useExerciseStore } from '../store/exerciseStore';
import { initializeMockExercises } from '../data/mockExercise';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FIRST_LAUNCH_KEY = '@gymtrack-first-launch';

export const initializeAppData = async (): Promise<boolean> => {
  try {
    // Verificar se é a primeira vez que o usuário abre o app
    const isFirstLaunch = await AsyncStorage.getItem(FIRST_LAUNCH_KEY);
    
    if (isFirstLaunch === null) {
      // Primeira vez: carregar exercícios mockados
      const mockExercises = initializeMockExercises();
      
      // Adicionar cada exercício na store
      const { addExercise } = useExerciseStore.getState();
      mockExercises.forEach((exercise) => {
        addExercise(exercise);
      });
      
      // Marcar que o app já foi inicializado
      await AsyncStorage.setItem(FIRST_LAUNCH_KEY, 'false');
      
      console.log(`[Initialization] ${mockExercises.length} exercícios mockados carregados com sucesso`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('[Initialization] Erro ao inicializar dados:', error);
    return false;
  }
};

export const resetAppData = async (): Promise<void> => {
  try {
    // Limpar flag de primeira inicialização
    await AsyncStorage.removeItem(FIRST_LAUNCH_KEY);
    
    // Limpar store de exercícios
    const { exercises } = useExerciseStore.getState();
    exercises.forEach((exercise) => {
      useExerciseStore.getState().deleteExercise(exercise.id);
    });
    
    console.log('[Initialization] Dados resetados com sucesso');
  } catch (error) {
    console.error('[Initialization] Erro ao resetar dados:', error);
  }
};

export const checkIsFirstLaunch = async (): Promise<boolean> => {
  try {
    const isFirstLaunch = await AsyncStorage.getItem(FIRST_LAUNCH_KEY);
    return isFirstLaunch === null;
  } catch (error) {
    console.error('[Initialization] Erro ao verificar primeira inicialização:', error);
    return false;
  }
};

export const markAppAsLaunched = async (): Promise<void> => {
  try {
    await AsyncStorage.setItem(FIRST_LAUNCH_KEY, 'false');
  } catch (error) {
    console.error('[Initialization] Erro ao marcar app como iniciado:', error);
  }
};
