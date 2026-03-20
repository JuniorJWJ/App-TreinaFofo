import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Modal } from 'react-native';
import { Image } from 'expo-image';
import { ExerciseSearchBar } from '../../components/molecules/search-filters/ExerciseSearchBar';
import { MuscleGroupFilterChips } from '../../components/molecules/search-filters/MuscleGroupFilterChips';
import { ExerciseCard } from '../../components/molecules/cards/ExerciseCard';
import { EmptyExerciseList } from '../../components/molecules/cards/EmptyExerciseList';
import { useExerciseList } from '../../hooks/useExerciseList';
import { FloatingActionButton } from '../../components/molecules/buttons/FloatingActionButton';
import { ConfirmationModal } from '../../components/molecules/modals/ConfirmationModal';
import { useConfirmationModal } from '../../hooks/useConfirmationModal';
import { Text } from '../../components/atoms/Text';
import { Button } from '../../components/atoms/Button';

interface ExerciseListScreenProps {
  navigation: any;
}

export const ExerciseListScreen: React.FC<ExerciseListScreenProps> = ({
  navigation,
}) => {
  const modal = useConfirmationModal();
  const [gifModalVisible, setGifModalVisible] = useState(false);
  const [gifExercise, setGifExercise] = useState<any | null>(null);

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

  const handleOpenGif = (exercise: any) => {
    if (!exercise.gifLocal) {
      handleEditExercise(exercise.id);
      return;
    }
    setGifExercise(exercise);
    setGifModalVisible(true);
  };

  const handleCloseGif = () => {
    setGifModalVisible(false);
    setGifExercise(null);
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
        onPress={() => handleOpenGif(item)}
        onLongPress={() => handleDeleteExercise(item.id, item.name)}
        muscleGroupName={currentGroup}
        muscleGroupColor={getMuscleGroupColor(item.muscleGroupId)}
        showGroupHeader={showGroupHeader}
        hasGif={!!item.gifLocal}
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

      <Modal
        visible={gifModalVisible}
        transparent
        animationType="fade"
        onRequestClose={handleCloseGif}
      >
        <View style={styles.gifModalOverlay}>
          <View style={styles.gifModalContent}>
            <Text variant="subtitle" style={styles.gifTitle}>
              {gifExercise?.name}
            </Text>
            {gifExercise?.gifLocal && (
              <Image
                source={gifExercise.gifLocal}
                style={styles.gifImage}
                contentFit="contain"
                transition={200}
              />
            )}
            <Button
              title="Fechar"
              onPress={handleCloseGif}
              style={styles.gifCloseButton}
            />
          </View>
        </View>
      </Modal>

      <View style={styles.searchAndFilterContainer}>
        <ExerciseSearchBar search={search} onSearchChange={setSearch} />

        <MuscleGroupFilterChips
          groups={uniqueGroups}
          selectedGroup={selectedGroup}
          onSelectGroup={setSelectedGroup}
        />
      </View>

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
  gifModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gifModalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  gifTitle: {
    marginBottom: 12,
    color: '#1b1613ff',
  },
  gifImage: {
    width: '100%',
    height: 260,
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    marginBottom: 12,
  },
  gifCloseButton: {
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
