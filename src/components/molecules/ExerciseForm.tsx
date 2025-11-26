import React from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Input } from '../atoms/Input';
import { Button } from '../atoms/Button';
import { Text } from '../atoms/Text';
import { useExerciseStore } from '../../store';
import { useMuscleGroupStore } from '../../store';

interface ExerciseFormProps {
  onSave: () => void;
  onCancel: () => void;
}

export const ExerciseForm: React.FC<ExerciseFormProps> = ({ onSave, onCancel }) => {
  const { addExercise, exercises } = useExerciseStore();
  const { muscleGroups } = useMuscleGroupStore();
  
  const [name, setName] = React.useState('');
  const [selectedMuscleGroupId, setSelectedMuscleGroupId] = React.useState('');
  const [sets, setSets] = React.useState('3');
  const [reps, setReps] = React.useState('12');
  const [restTime, setRestTime] = React.useState('60');
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSave = async () => {
    if (!name || !selectedMuscleGroupId) {
      Alert.alert('Atenção', 'Preencha o nome e selecione um grupo muscular');
      return;
    }

    setIsLoading(true);

    try {
      // Encontra o grupo muscular selecionado
      const selectedGroup = muscleGroups.find(group => group.id === selectedMuscleGroupId);
      
      if (!selectedGroup) {
        Alert.alert('Erro', 'Grupo muscular não encontrado');
        return;
      }

      // Adiciona o exercício
      addExercise({
        name: name.trim(),
        muscleGroupId: selectedMuscleGroupId,
        defaultSets: parseInt(sets) || 3,
        defaultReps: parseInt(reps) || 12,
        defaultRestTime: parseInt(restTime) || 60,
      });

      // Feedback de sucesso
      Alert.alert(
        'Sucesso!', 
        `Exercício "${name}" salvo no grupo ${selectedGroup.name}`,
        [
          {
            text: 'OK',
            onPress: () => {
              // Limpa o formulário
              setName('');
              setSelectedMuscleGroupId('');
              setSets('3');
              setReps('12');
              setRestTime('60');
              setIsLoading(false);
            }
          }
        ]
      );

      console.log('Exercício salvo! Total de exercícios:', exercises.length + 1);
      
      // Chama o callback do pai (se necessário)
      onSave();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar o exercício');
      setIsLoading(false);
    }
  };

  const selectedGroup = muscleGroups.find(group => group.id === selectedMuscleGroupId);

  return (
    <ScrollView style={styles.container}>
      <Text variant="title" align="center">Novo Exercício</Text>
      
      {/* Feedback do grupo selecionado */}
      {selectedGroup && (
        <View style={styles.selectedGroup}>
          <Text variant="caption">Grupo selecionado: </Text>
          <Text variant="body" style={{ color: selectedGroup.color, fontWeight: 'bold' }}>
            {selectedGroup.name}
          </Text>
        </View>
      )}
      
      <Input
        placeholder="Nome do exercício"
        value={name}
        onChangeText={setName}
      />
      
      <Text variant="subtitle">Grupo Muscular:</Text>
      <View style={styles.muscleGroupsContainer}>
        {muscleGroups.map((group) => (
          <Button
            key={group.id}
            title={group.name}
            onPress={() => setSelectedMuscleGroupId(group.id)}
            style={[
              styles.muscleGroupButton,
              selectedMuscleGroupId === group.id ? styles.primaryButton : styles.secondaryButton,
            ]}
          />
        ))}
      </View>

      <View style={styles.row}>
        <View style={styles.column}>
          <Text variant="subtitle">Séries:</Text>
          <Input
            value={sets}
            onChangeText={setSets}
            keyboardType="numeric"
            placeholder="3"
          />
        </View>
        
        <View style={styles.column}>
          <Text variant="subtitle">Repetições:</Text>
          <Input
            value={reps}
            onChangeText={setReps}
            keyboardType="numeric"
            placeholder="12"
          />
        </View>
        
        <View style={styles.column}>
          <Text variant="subtitle">Descanso (s):</Text>
          <Input
            value={restTime}
            onChangeText={setRestTime}
            keyboardType="numeric"
            placeholder="60"
          />
        </View>
      </View>

      <View style={styles.buttonsContainer}>
        <Button 
          title="Cancelar" 
          onPress={onCancel}
          style={[styles.button, styles.secondaryButton]}
          disabled={isLoading}
        />
        <Button 
          title={isLoading ? "Salvando..." : "Salvar Exercício"}
          onPress={handleSave}
          style={[styles.button, styles.primaryButton]}
          disabled={!name || !selectedMuscleGroupId || isLoading}
        />
      </View>

      {/* Debug info - pode remover depois */}
      <View style={styles.debugInfo}>
        <Text variant="caption">Exercícios cadastrados: {exercises.length}</Text>
        <Text variant="caption">Grupos musculares: {muscleGroups.length}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  selectedGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginBottom: 12,
  },
  muscleGroupsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 8,
  },
  muscleGroupButton: {
    margin: 4,
    flex: 1,
    minWidth: 100,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  column: {
    flex: 1,
    marginHorizontal: 4,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
  },
  primaryButton: {
    backgroundColor: '#007bff',
  },
  secondaryButton: {
    backgroundColor: '#e0e0e0',
  },
  debugInfo: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
});