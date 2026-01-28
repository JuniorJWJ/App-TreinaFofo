import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { ExerciseSearchBar } from '../../components/molecules/search-filters/ExerciseSearchBar';
import { MuscleGroupFilterChips } from '../../components/molecules/search-filters/MuscleGroupFilterChips';
import { ExerciseCard } from '../../components/molecules/cards/ExerciseCard';
import { EmptyExerciseList } from '../../components/molecules/cards/EmptyExerciseList';
import { useExerciseList } from '../../hooks/useExerciseList';
import { FloatingActionButton } from '../../components/molecules/buttons/FloatingActionButton';
import { ConfirmationModal } from '../../components/molecules/modals/ConfirmationModal';
import { useConfirmationModal } from '../../hooks/useConfirmationModal';

interface ExerciseListScreenProps {
  navigation: any;
}

export const ExerciseListScreen: React.FC<ExerciseListScreenProps> = ({
  navigation,
}) => {
  const modal = useConfirmationModal();
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
    modal.showConfirmation(
      `Tem certeza que deseja excluir "${exerciseName}"?`,
      'Excluir Exercício',
      () => {
        deleteExercise(exerciseId);
        modal.hideModal();
      },
      'Excluir',
      'Cancelar',
    );
  };

  const handleEditExercise = (exerciseId: string) => {
    navigation.navigate('EditExercise', { exerciseId });
  };

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    const currentGroup = getMuscleGroupName(item.muscleGroupId);
    const prevGroup =
      index > 0 ? getMuscleGroupName(exercises[index - 1].muscleGroupId) : null;

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
      {modal.modalConfig && (
        <ConfirmationModal
          visible={modal.isVisible}
          title={modal.modalConfig.title}
          message={modal.modalConfig.message}
          confirmText={modal.modalConfig.confirmText}
          cancelText={modal.modalConfig.cancelText}
          onConfirm={modal.modalConfig.onConfirm}
          onCancel={modal.modalConfig.onCancel}
          showCancelButton={modal.modalConfig.showCancelButton}
          hideIcon={modal.modalConfig.hideIcon}
          onClose={modal.hideModal}
        />
      )}
      {/* Barra de busca */}
      <View style={styles.searchAndFilterContainer}>
        <ExerciseSearchBar search={search} onSearchChange={setSearch} />

        {/* Filtros de grupo muscular */}
        <MuscleGroupFilterChips
          groups={uniqueGroups}
          selectedGroup={selectedGroup}
          onSelectGroup={setSelectedGroup}
        />
      </View>
      {/* Lista de exercícios ou estado vazio */}
      {!hasExercises ? (
        <EmptyExerciseList
          hasSearchOrFilter={hasSearchOrFilter}
          onClearFilters={() => {
            setSearch('');
            setSelectedGroup(null);
          }}
          onCreateFirst={() => navigation.navigate('CreateExercise')}
        />
      ) : (
        <FlatList
          data={exercises}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      )}

      {hasExercises && (
        <FloatingActionButton
          onPress={() => navigation.navigate('CreateExercise')}
          position="bottom-right"
          offset={{ bottom: 40, right: 20 }}
          label="+"
          backgroundColor="#483148"
          color="#FFF"
          size="medium"
          visible={hasExercises}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1b1613ff',
  },
  searchAndFilterContainer: {
    paddingHorizontal: 16,
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
