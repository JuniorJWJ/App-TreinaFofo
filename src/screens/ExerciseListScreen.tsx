// src/screens/ExerciseListScreen.tsx
import React from 'react';
import { 
  View, 
  StyleSheet, 
  FlatList, 
  Alert,
  TouchableOpacity 
} from 'react-native';
import { Text } from '../components/atoms/Text';
import { ExerciseSearchBar } from '../components/molecules/ExerciseSearchBar';
import { MuscleGroupFilterChips } from '../components/molecules/MuscleGroupFilterChips';
import { ExerciseCard } from '../components/molecules/ExerciseCard';
import { EmptyExerciseList } from '../components/molecules/EmptyExerciseList';
import { useExerciseList } from '../hooks/useExerciseList';

interface ExerciseListScreenProps {
  navigation: any;
}

export const ExerciseListScreen: React.FC<ExerciseListScreenProps> = ({ navigation }) => {
  const {
    exercises,
    uniqueGroups,
    search,
    setSearch,
    selectedGroup,
    setSelectedGroup,
    getMuscleGroupName,
    getMuscleGroupColor,
    deleteExercise,
  } = useExerciseList();

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

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    const currentGroup = getMuscleGroupName(item.muscleGroupId);
    const prevGroup = index > 0 
      ? getMuscleGroupName(exercises[index - 1].muscleGroupId)
      : null;
    
    const showGroupHeader = currentGroup !== prevGroup && !selectedGroup;

    return (
      <ExerciseCard
        exercise={item}
        onEdit={() => handleEditExercise(item.id)}
        onDelete={() => handleDeleteExercise(item.id, item.name)}
        onPress={() => handleEditExercise(item.id)}
        onLongPress={() => handleDeleteExercise(item.id, item.name)}
        muscleGroupName={currentGroup}
        muscleGroupColor={getMuscleGroupColor(item.muscleGroupId)}
        showGroupHeader={showGroupHeader}
      />
    );
  };

  const hasSearchOrFilter = search.length > 0 || selectedGroup !== null;
  const hasExercises = exercises.length > 0;

  return (
    <View style={styles.container}>
      {/* Barra de busca */}
      <ExerciseSearchBar
        search={search}
        onSearchChange={setSearch}
      />

      {/* Filtros de grupo muscular */}
      <MuscleGroupFilterChips
        groups={uniqueGroups}
        selectedGroup={selectedGroup}
        onSelectGroup={setSelectedGroup}
      />

      {/* Lista de exercícios ou estado vazio */}
      {!hasExercises ? (
        <EmptyExerciseList
          hasSearchOrFilter={hasSearchOrFilter}
          onClearFilters={() => {
            setSearch('');
            setSelectedGroup(null);
          }}
          onCreateFirst={() => navigation.navigate('AddExercise')}
        />
      ) : (
        <FlatList
          data={exercises}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      )}

      {/* Botão flutuante para adicionar exercício */}
      {hasExercises && (
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
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 80,
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