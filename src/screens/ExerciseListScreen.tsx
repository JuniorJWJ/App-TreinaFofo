import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Alert,
  TextInput,
  ScrollView
} from 'react-native';
import { useExerciseStore } from '../store';
import { useMuscleGroupStore } from '../store';
import { Text } from '../components/atoms/Text';
import { Button } from '../components/atoms/Button';

interface ExerciseListScreenProps {
  navigation: any;
}

export const ExerciseListScreen: React.FC<ExerciseListScreenProps> = ({ navigation }) => {
  const { exercises, deleteExercise } = useExerciseStore();
  const { muscleGroups } = useMuscleGroupStore();
  const [search, setSearch] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

  // Função para obter nome do grupo muscular
  const getMuscleGroupName = (muscleGroupId: string): string => {
    if (!muscleGroups || muscleGroups.length === 0) return 'Desconhecido';
    
    const group = muscleGroups.find(g => {
      // Tenta encontrar pelo ID
      if (g.id === muscleGroupId) return true;
      // Tenta encontrar pelo nome (case insensitive)
      if (g.name.toLowerCase() === muscleGroupId.toLowerCase()) return true;
      return false;
    });
    
    return group ? group.name : 'Desconhecido';
  };

  // Função para obter cor do grupo muscular
  const getMuscleGroupColor = (muscleGroupId: string): string => {
    if (!muscleGroups || muscleGroups.length === 0) return '#CCCCCC';
    
    const group = muscleGroups.find(g => {
      if (g.id === muscleGroupId) return true;
      if (g.name.toLowerCase() === muscleGroupId.toLowerCase()) return true;
      return false;
    });
    
    return group ? group.color || '#CCCCCC' : '#CCCCCC';
  };

  // Filtra exercícios por busca e grupo selecionado
  const filteredExercises = exercises.filter(exercise => {
    // Verifica se há match com a busca
    const matchesSearch = search === '' || 
      exercise.name.toLowerCase().includes(search.toLowerCase());
    
    // Verifica se há match com o grupo selecionado
    const matchesGroup = !selectedGroup || 
      getMuscleGroupName(exercise.muscleGroupId) === selectedGroup;
    
    return matchesSearch && matchesGroup;
  });

  // Ordena exercícios por grupo muscular e depois por nome
  const sortedExercises = [...filteredExercises].sort((a, b) => {
    const groupA = getMuscleGroupName(a.muscleGroupId);
    const groupB = getMuscleGroupName(b.muscleGroupId);
    
    if (groupA < groupB) return -1;
    if (groupA > groupB) return 1;
    
    return a.name.localeCompare(b.name);
  });

  // Obtém lista de grupos únicos para filtro
  const uniqueGroups = Array.from(
    new Set(exercises.map(ex => getMuscleGroupName(ex.muscleGroupId)))
  ).sort();

  const handleDeleteExercise = (exerciseId: string, exerciseName: string) => {
    Alert.alert(
      'Excluir Exercício',
      `Tem certeza que deseja excluir "${exerciseName}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive',
          onPress: () => deleteExercise(exerciseId)
        }
      ]
    );
  };

  const handleEditExercise = (exerciseId: string) => {
    navigation.navigate('EditExercise', { exerciseId });
  };

  // Renderiza um separador de grupo quando o grupo muda
  const renderItem = ({ item, index }: { item: any; index: number }) => {
    const currentGroup = getMuscleGroupName(item.muscleGroupId);
    const prevGroup = index > 0 
      ? getMuscleGroupName(sortedExercises[index - 1].muscleGroupId)
      : null;
    
    const showGroupHeader = currentGroup !== prevGroup;

    return (
      <View>
        {showGroupHeader && !selectedGroup && (
          <View style={styles.groupHeader}>
            <Text style={styles.groupHeaderText}>{currentGroup}</Text>
          </View>
        )}
        
        <TouchableOpacity 
          style={styles.exerciseCard}
          onPress={() => handleEditExercise(item.id)}
          onLongPress={() => handleDeleteExercise(item.id, item.name)}
        >
          <View style={styles.exerciseHeader}>
            <Text variant="subtitle" style={styles.exerciseName}>
              {item.name}
            </Text>
            <View 
              style={[
                styles.muscleGroupBadge,
                { backgroundColor: getMuscleGroupColor(item.muscleGroupId) }
              ]}
            >
              <Text style={styles.badgeText}>
                {currentGroup}
              </Text>
            </View>
          </View>
          
          <View style={styles.exerciseDetails}>
            <View style={styles.detailRow}>
              <Text variant="caption">
                {item.defaultSets} séries × {item.defaultReps} reps
              </Text>
              <Text variant="caption">
                Descanso: {item.defaultRestTime}s
              </Text>
            </View>
            {item.defaultWeight && (
              <Text variant="caption">
                Peso: {item.defaultWeight} {item.weightUnit || 'kg'}
              </Text>
            )}
          </View>

          <View style={styles.exerciseActions}>
            <Button
              title="Editar"
              onPress={() => handleEditExercise(item.id)}
              style={styles.editButton}
            />
            <Button
              title="Excluir"
              onPress={() => handleDeleteExercise(item.id, item.name)}
              style={styles.deleteButton}
            />
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Barra de busca personalizada */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar exercícios..."
            placeholderTextColor="#999"
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => setSearch('')}
            >
              <Text style={styles.clearButtonText}>X</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filtros de grupo muscular */}
      {uniqueGroups.length > 0 && (
        <View style={styles.filterContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.filterScroll}
          >
            <TouchableOpacity
              style={[
                styles.filterChip,
                !selectedGroup && styles.filterChipActive
              ]}
              onPress={() => setSelectedGroup(null)}
            >
              <Text style={[
                styles.filterChipText,
                !selectedGroup && styles.filterChipTextActive
              ]}>
                Todos
              </Text>
            </TouchableOpacity>
            
            {uniqueGroups.map(group => (
              <TouchableOpacity
                key={group}
                style={[
                  styles.filterChip,
                  selectedGroup === group && styles.filterChipActive
                ]}
                onPress={() => setSelectedGroup(
                  selectedGroup === group ? null : group
                )}
              >
                <Text style={[
                  styles.filterChipText,
                  selectedGroup === group && styles.filterChipTextActive
                ]}>
                  {group}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {sortedExercises.length === 0 ? (
        <View style={styles.emptyState}>
          <Text variant="subtitle" align="center">
            {search || selectedGroup 
              ? 'Nenhum exercício encontrado' 
              : 'Nenhum exercício cadastrado'}
          </Text>
          <Text variant="body" align="center" style={styles.emptyText}>
            {search || selectedGroup
              ? 'Tente ajustar sua busca ou filtro'
              : 'Toque no botão abaixo para criar seu primeiro exercício!'}
          </Text>
          {(search || selectedGroup) ? (
            <Button
              title="Limpar Filtros"
              onPress={() => {
                setSearch('');
                setSelectedGroup(null);
              }}
              style={styles.clearFiltersButton}
            />
          ) : (
            <Button
              title="Criar Primeiro Exercício"
              onPress={() => navigation.navigate('AddExercise')}
              style={styles.createButton}
            />
          )}
        </View>
      ) : (
        <FlatList
          data={sortedExercises}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      )}

      {exercises.length > 0 && (
        <View style={styles.fabContainer}>
          <TouchableOpacity 
            style={styles.fabButton}
            onPress={() => navigation.navigate('AddExercise')}
          >
            <Text style={styles.fabText}>+</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1b1613ff',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e9dfdfff',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  clearButton: {
    padding: 4,
    marginLeft: 8,
  },
  clearButtonText: {
    fontSize: 16,
    color: '#999',
    fontWeight: 'bold',
  },
  filterContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  filterScroll: {
    flexGrow: 0,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#e9dfdfff',
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#483148',
  },
  filterChipActive: {
    backgroundColor: '#483148',
  },
  filterChipText: {
    fontSize: 14,
    color: '#483148',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  groupHeader: {
    marginTop: 16,
    marginBottom: 8,
    paddingLeft: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#483148',
  },
  groupHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  exerciseCard: {
    backgroundColor: '#e9dfdfff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  exerciseName: {
    flex: 1,
    marginRight: 8,
  },
  muscleGroupBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  exerciseDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  exerciseActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  editButton: {
    flex: 1,
    marginRight: 8,
    backgroundColor: '#483148',
  },
  deleteButton: {
    flex: 1,
    marginLeft: 8,
    backgroundColor: '#332B33',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    marginTop: 8,
    marginBottom: 24,
    color: '#666',
    textAlign: 'center',
  },
  createButton: {
    width: '100%',
  },
  clearFiltersButton: {
    width: '100%',
    backgroundColor: '#483148',
  },
  fabContainer: {
    position: 'absolute',
    bottom: 40,
    right: 20,
  },
  fabButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#483148',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  fabText: {
    color: '#FFF',
    fontSize: 32,
    marginTop: -4,
  },
});