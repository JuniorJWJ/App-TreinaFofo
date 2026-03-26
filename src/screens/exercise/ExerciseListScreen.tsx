import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Modal,
  ScrollView,
  TouchableOpacity,
  Share,
} from 'react-native';
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
import { Input } from '../../components/atoms/Input';
import {
  useExerciseStore,
  useWorkoutStore,
  useWeeklyPlanStore,
} from '../../store';

interface ExerciseListScreenProps {
  navigation: any;
}

export const ExerciseListScreen: React.FC<ExerciseListScreenProps> = ({
  navigation,
}) => {
  const modal = useConfirmationModal();
  const [exportVisible, setExportVisible] = useState(false);
  const [importVisible, setImportVisible] = useState(false);
  const [exportJson, setExportJson] = useState('');
  const [importJson, setImportJson] = useState('');
  const [importError, setImportError] = useState<string | null>(null);
  const [importPreview, setImportPreview] = useState<{
    exercises: number;
    workouts: number;
    weeklyPlans: number;
  } | null>(null);

  // ========== Export State ==========
  const [exportSelection, setExportSelection] = useState({
    exercises: true,
    workouts: true,
    weeklyPlans: true,
  });
  const [selectedExerciseIds, setSelectedExerciseIds] = useState<string[]>([]);
  const [selectedWorkoutIds, setSelectedWorkoutIds] = useState<string[]>([]);
  const [selectedWeeklyPlanIds, setSelectedWeeklyPlanIds] = useState<string[]>(
    [],
  );

  // ========== Import State ==========
  const [importPayload, setImportPayload] = useState<{
    exercises: any[];
    workouts: any[];
    weeklyPlans: any[];
  } | null>(null);
  const [importSelection, setImportSelection] = useState({
    exercises: true,
    workouts: true,
    weeklyPlans: true,
  });
  const [selectedImportExerciseIds, setSelectedImportExerciseIds] = useState<
    string[]
  >([]);
  const [selectedImportWorkoutIds, setSelectedImportWorkoutIds] = useState<
    string[]
  >([]);
  const [selectedImportWeeklyPlanIds, setSelectedImportWeeklyPlanIds] =
    useState<string[]>([]);

  // Data from stores
  const allExercises = useExerciseStore(state => state.exercises);
  const allWorkouts = useWorkoutStore(state => state.workouts);
  const allWeeklyPlans = useWeeklyPlanStore(state => state.weeklyPlans);

  // Hook for exercise list logic
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

  const toIso = (value: any) => {
    if (!value) return new Date().toISOString();
    if (value instanceof Date) return value.toISOString();
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime())
      ? new Date().toISOString()
      : parsed.toISOString();
  };

  const serializeExercise = (exercise: any) => {
    const gifLocal =
      typeof exercise.gifLocal === 'string' ||
      (exercise.gifLocal &&
        typeof exercise.gifLocal === 'object' &&
        exercise.gifLocal.uri)
        ? exercise.gifLocal
        : undefined;

    return {
      ...exercise,
      gifLocal,
      createdAt: toIso(exercise.createdAt),
      updatedAt: toIso(exercise.updatedAt),
    };
  };

  const serializeWorkout = (workout: any) => ({
    id: workout.id,
    name: workout.name,
    description: workout.description,
    muscleGroupIds: workout.muscleGroupIds,
    exerciseIds: workout.exerciseIds,
    estimatedDuration: workout.estimatedDuration,
    difficulty: workout.difficulty,
    tags: workout.tags,
    createdAt: toIso(workout.createdAt),
    updatedAt: toIso(workout.updatedAt),
  });

  const serializeWeeklyPlan = (plan: any) => ({
    id: plan.id,
    name: plan.name,
    description: plan.description,
    days: (plan.days || []).map((day: any) => ({
      day: day.day,
      workoutId: day.workoutId ?? null,
      notes: day.notes,
    })),
    startDate: plan.startDate ? toIso(plan.startDate) : undefined,
    endDate: plan.endDate ? toIso(plan.endDate) : undefined,
    workoutSplitId: plan.workoutSplitId,
    currentWeek: plan.currentWeek,
    totalWeeks: plan.totalWeeks,
    isActive: plan.isActive,
    isTemplate: plan.isTemplate,
    createdAt: toIso(plan.createdAt),
    updatedAt: toIso(plan.updatedAt),
  });

  const buildExportPayload = (opts?: {
    selection?: {
      exercises: boolean;
      workouts: boolean;
      weeklyPlans: boolean;
    };
    exerciseIds?: string[];
    workoutIds?: string[];
    weeklyPlanIds?: string[];
  }) => {
    const selection = opts?.selection || exportSelection;
    const exerciseIds = new Set(opts?.exerciseIds || selectedExerciseIds);
    const workoutIds = new Set(opts?.workoutIds || selectedWorkoutIds);
    const weeklyPlanIds = new Set(
      opts?.weeklyPlanIds || selectedWeeklyPlanIds,
    );

    return {
      version: 1,
      exportedAt: new Date().toISOString(),
      exercises: selection.exercises
        ? allExercises
            .filter(ex => exerciseIds.has(ex.id))
            .map(serializeExercise)
        : [],
      workouts: selection.workouts
        ? allWorkouts
            .filter(w => workoutIds.has(w.id))
            .map(serializeWorkout)
        : [],
      weeklyPlans: selection.weeklyPlans
        ? allWeeklyPlans
            .filter(p => weeklyPlanIds.has(p.id))
            .map(serializeWeeklyPlan)
        : [],
    };
  };

  const updateExportJson = (opts?: {
    selection?: {
      exercises: boolean;
      workouts: boolean;
      weeklyPlans: boolean;
    };
    exerciseIds?: string[];
    workoutIds?: string[];
    weeklyPlanIds?: string[];
  }) => {
    const payload = buildExportPayload(opts);
    setExportJson(JSON.stringify(payload, null, 2));
  };

  const toggleId = (ids: string[], id: string) =>
    ids.includes(id) ? ids.filter(item => item !== id) : [...ids, id];

  const handleOpenExport = () => {
    const exerciseIds = allExercises.map(ex => ex.id);
    const workoutIds = allWorkouts.map(w => w.id);
    const weeklyPlanIds = allWeeklyPlans.map(p => p.id);
    const selection = {
      exercises: true,
      workouts: true,
      weeklyPlans: true,
    };

    setExportSelection(selection);
    setSelectedExerciseIds(exerciseIds);
    setSelectedWorkoutIds(workoutIds);
    setSelectedWeeklyPlanIds(weeklyPlanIds);
    updateExportJson({
      selection,
      exerciseIds,
      workoutIds,
      weeklyPlanIds,
    });
    setExportVisible(true);
  };

  const handleOpenImport = () => {
    setImportJson('');
    setImportError(null);
    setImportPreview(null);
    setImportPayload(null);
    setImportVisible(true);
  };

  const handleImportTextChange = (text: string) => {
    setImportJson(text);
    try {
      const payload = JSON.parse(text);
      const exercisesData = Array.isArray(payload?.exercises)
        ? payload.exercises
        : [];
      const workoutsData = Array.isArray(payload?.workouts)
        ? payload.workouts
        : [];
      const weeklyPlansData = Array.isArray(payload?.weeklyPlans)
        ? payload.weeklyPlans
        : [];
      const exercisesCount = exercisesData.length;
      const workoutsCount = workoutsData.length;
      const weeklyPlansCount = weeklyPlansData.length;
      setImportPreview({
        exercises: exercisesCount,
        workouts: workoutsCount,
        weeklyPlans: weeklyPlansCount,
      });
      setImportPayload({
        exercises: exercisesData,
        workouts: workoutsData,
        weeklyPlans: weeklyPlansData,
      });
      setImportSelection({
        exercises: exercisesCount > 0,
        workouts: workoutsCount > 0,
        weeklyPlans: weeklyPlansCount > 0,
      });
      setSelectedImportExerciseIds(
        exercisesData.map((item: any) => item.id).filter(Boolean),
      );
      setSelectedImportWorkoutIds(
        workoutsData.map((item: any) => item.id).filter(Boolean),
      );
      setSelectedImportWeeklyPlanIds(
        weeklyPlansData.map((item: any) => item.id).filter(Boolean),
      );
      setImportError(null);
    } catch {
      setImportPreview(null);
      setImportPayload(null);
      setImportError('JSON inválido');
    }
  };

  const handleImportConfirm = () => {
    if (!importJson.trim() || !importPayload) return;
    const selectedExercises = importSelection.exercises
      ? importPayload.exercises.filter(item =>
          selectedImportExerciseIds.includes(item.id),
        )
      : [];
    const selectedWorkouts = importSelection.workouts
      ? importPayload.workouts.filter(item =>
          selectedImportWorkoutIds.includes(item.id),
        )
      : [];
    const selectedWeeklyPlans = importSelection.weeklyPlans
      ? importPayload.weeklyPlans.filter(item =>
          selectedImportWeeklyPlanIds.includes(item.id),
        )
      : [];

    const exerciseResult = useExerciseStore
      .getState()
      .importExercisesFromJson(
        JSON.stringify({ exercises: selectedExercises }),
      );
    const workoutResult = useWorkoutStore
      .getState()
      .importWorkoutsFromData(selectedWorkouts);
    const weeklyPlanResult = useWeeklyPlanStore
      .getState()
      .importWeeklyPlansFromData(selectedWeeklyPlans);

    setImportVisible(false);
    modal.showSuccess(
      'Importação concluída',
      `Exercícios: +${exerciseResult.added} / ${exerciseResult.updated} atualizados\n` +
        `Treinos: +${workoutResult.added} / ${workoutResult.updated} atualizados\n` +
        `Planos: +${weeklyPlanResult.added} / ${weeklyPlanResult.updated} atualizados`,
      () => {},
    );
  };

  const handleShareWhatsapp = async () => {
    if (!exportJson.trim()) return;
    await Share.share({ message: exportJson });
  };

  const toggleExportSection = (
    key: 'exercises' | 'workouts' | 'weeklyPlans',
  ) => {
    const selection = { ...exportSelection, [key]: !exportSelection[key] };
    setExportSelection(selection);
    updateExportJson({ selection });
  };

  const toggleImportSection = (
    key: 'exercises' | 'workouts' | 'weeklyPlans',
  ) => {
    setImportSelection(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleToggleExportExerciseId = (id: string) => {
    if (!id) return;
    const next = toggleId(selectedExerciseIds, id);
    setSelectedExerciseIds(next);
    updateExportJson({ exerciseIds: next });
  };

  const handleToggleExportWorkoutId = (id: string) => {
    if (!id) return;
    const next = toggleId(selectedWorkoutIds, id);
    setSelectedWorkoutIds(next);
    updateExportJson({ workoutIds: next });
  };

  const handleToggleExportWeeklyPlanId = (id: string) => {
    if (!id) return;
    const next = toggleId(selectedWeeklyPlanIds, id);
    setSelectedWeeklyPlanIds(next);
    updateExportJson({ weeklyPlanIds: next });
  };

  const handleSelectAllExportExercises = () => {
    const ids = allExercises.map(ex => ex.id);
    setSelectedExerciseIds(ids);
    updateExportJson({ exerciseIds: ids });
  };

  const handleClearExportExercises = () => {
    setSelectedExerciseIds([]);
    updateExportJson({ exerciseIds: [] });
  };

  const handleSelectAllExportWorkouts = () => {
    const ids = allWorkouts.map(w => w.id);
    setSelectedWorkoutIds(ids);
    updateExportJson({ workoutIds: ids });
  };

  const handleClearExportWorkouts = () => {
    setSelectedWorkoutIds([]);
    updateExportJson({ workoutIds: [] });
  };

  const handleSelectAllExportWeeklyPlans = () => {
    const ids = allWeeklyPlans.map(p => p.id);
    setSelectedWeeklyPlanIds(ids);
    updateExportJson({ weeklyPlanIds: ids });
  };

  const handleClearExportWeeklyPlans = () => {
    setSelectedWeeklyPlanIds([]);
    updateExportJson({ weeklyPlanIds: [] });
  };

  const handleToggleImportExerciseId = (id: string) => {
    if (!id) return;
    setSelectedImportExerciseIds(prev => toggleId(prev, id));
  };

  const handleToggleImportWorkoutId = (id: string) => {
    if (!id) return;
    setSelectedImportWorkoutIds(prev => toggleId(prev, id));
  };

  const handleToggleImportWeeklyPlanId = (id: string) => {
    if (!id) return;
    setSelectedImportWeeklyPlanIds(prev => toggleId(prev, id));
  };

  const handleDeleteExercise = (exerciseId: string, exerciseName: string) => {
    modal.showConfirmation(
      `Tem certeza que deseja excluir "${exerciseName}"`,
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

  const handleOpenDetails = (exerciseId: string) => {
    navigation.navigate('ExerciseDetail', { exerciseId });
  };

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    const currentGroup = getMuscleGroupName(item.muscleGroupId);
    const prevGroup =
      index > 0
        ? getMuscleGroupName(exercises[index - 1].muscleGroupId)
        : null;

    const showGroupHeader = currentGroup !== prevGroup && !selectedGroup;

    return (
      <ExerciseCard
        exercise={item}
        onEdit={() => handleEditExercise(item.id)}
        onDelete={() => handleDeleteExercise(item.id, item.name)}
        onPress={() => handleOpenDetails(item.id)}
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

      <Modal visible={exportVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text variant="subtitle" style={styles.modalTitle}>
              Exportar JSON
            </Text>
            <Text variant="caption" style={styles.modalSubtitle}>
              Copie o texto abaixo e envie para o aluno.
            </Text>
            <ScrollView style={styles.modalScroll}>
              <View style={styles.sectionHeader}>
                <TouchableOpacity
                  style={styles.checkboxRow}
                  onPress={() => toggleExportSection('exercises')}
                >
                  <View
                    style={[
                      styles.checkbox,
                      exportSelection.exercises && styles.checkboxChecked,
                    ]}
                  />
                  <Text style={styles.checkboxLabel}>Exercícios</Text>
                </TouchableOpacity>
                <View style={styles.sectionActions}>
                  <TouchableOpacity onPress={handleSelectAllExportExercises}>
                    <Text style={styles.sectionActionText}>Selecionar todos</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleClearExportExercises}>
                    <Text style={styles.sectionActionText}>Limpar</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {exportSelection.exercises &&
                allExercises.map((item, index) => (
                  <TouchableOpacity
                    key={item.id || `exercise-${index}`}
                    style={styles.itemRow}
                    onPress={() => handleToggleExportExerciseId(item.id)}
                  >
                    <View
                      style={[
                        styles.checkbox,
                        selectedExerciseIds.includes(item.id) &&
                          styles.checkboxChecked,
                      ]}
                    />
                    <Text style={styles.itemText}>{item.name}</Text>
                  </TouchableOpacity>
                ))}

              <View style={styles.sectionHeader}>
                <TouchableOpacity
                  style={styles.checkboxRow}
                  onPress={() => toggleExportSection('workouts')}
                >
                  <View
                    style={[
                      styles.checkbox,
                      exportSelection.workouts && styles.checkboxChecked,
                    ]}
                  />
                  <Text style={styles.checkboxLabel}>Treinos</Text>
                </TouchableOpacity>
                <View style={styles.sectionActions}>
                  <TouchableOpacity onPress={handleSelectAllExportWorkouts}>
                    <Text style={styles.sectionActionText}>Selecionar todos</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleClearExportWorkouts}>
                    <Text style={styles.sectionActionText}>Limpar</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {exportSelection.workouts &&
                allWorkouts.map((item, index) => (
                  <TouchableOpacity
                    key={item.id || `workout-${index}`}
                    style={styles.itemRow}
                    onPress={() => handleToggleExportWorkoutId(item.id)}
                  >
                    <View
                      style={[
                        styles.checkbox,
                        selectedWorkoutIds.includes(item.id) &&
                          styles.checkboxChecked,
                      ]}
                    />
                    <Text style={styles.itemText}>{item.name}</Text>
                  </TouchableOpacity>
                ))}

              <View style={styles.sectionHeader}>
                <TouchableOpacity
                  style={styles.checkboxRow}
                  onPress={() => toggleExportSection('weeklyPlans')}
                >
                  <View
                    style={[
                      styles.checkbox,
                      exportSelection.weeklyPlans && styles.checkboxChecked,
                    ]}
                  />
                  <Text style={styles.checkboxLabel}>Divisões</Text>
                </TouchableOpacity>
                <View style={styles.sectionActions}>
                  <TouchableOpacity onPress={handleSelectAllExportWeeklyPlans}>
                    <Text style={styles.sectionActionText}>Selecionar todos</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleClearExportWeeklyPlans}>
                    <Text style={styles.sectionActionText}>Limpar</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {exportSelection.weeklyPlans &&
                allWeeklyPlans.map((item, index) => (
                  <TouchableOpacity
                    key={item.id || `weekly-${index}`}
                    style={styles.itemRow}
                    onPress={() => handleToggleExportWeeklyPlanId(item.id)}
                  >
                    <View
                      style={[
                        styles.checkbox,
                        selectedWeeklyPlanIds.includes(item.id) &&
                          styles.checkboxChecked,
                      ]}
                    />
                    <Text style={styles.itemText}>{item.name}</Text>
                  </TouchableOpacity>
                ))}

              <Text style={styles.previewTitle}>Prévia do JSON</Text>
              <View style={styles.jsonContainer}>
                <Input
                  value={exportJson}
                  color="#FFF"
                  multiline
                  editable={false}
                  style={styles.jsonInput}
                />
              </View>
            </ScrollView>
            <View style={styles.modalActions}>
              <Button
                title="Enviar no WhatsApp"
                onPress={handleShareWhatsapp}
                style={styles.modalPrimaryButton}
              />
              <Button
                title="Fechar"
                onPress={() => setExportVisible(false)}
                style={styles.modalSecondaryButton}
              />
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={importVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text variant="subtitle" style={styles.modalTitle}>
              Importar JSON
            </Text>
            <Text variant="caption" style={styles.modalSubtitle}>
              Cole o JSON recebido. Vamos validar antes de importar.
            </Text>
            <ScrollView style={styles.modalScroll}>
              <View style={styles.jsonContainer}>
                <Input
                  value={importJson}
                  onChangeText={handleImportTextChange}
                  color="#FFF"
                  multiline
                  placeholder="Cole o JSON aqui..."
                  placeholderTextColor="#AAA"
                  style={styles.jsonInput}
                />
              </View>

              {importError && (
                <Text variant="caption" style={styles.errorText}>
                  {importError}
                </Text>
              )}

              {importPreview && (
                <Text variant="caption" style={styles.previewText}>
                  Exercícios: {importPreview.exercises} | Treinos:{' '}
                  {importPreview.workouts} | Planos: {importPreview.weeklyPlans}
                </Text>
              )}

              {importPayload && (
                <>
                  <View style={styles.sectionHeader}>
                    <TouchableOpacity
                      style={styles.checkboxRow}
                      onPress={() => toggleImportSection('exercises')}
                    >
                      <View
                        style={[
                          styles.checkbox,
                          importSelection.exercises && styles.checkboxChecked,
                        ]}
                      />
                      <Text style={styles.checkboxLabel}>Exercícios</Text>
                    </TouchableOpacity>
                  </View>
                  {importSelection.exercises &&
                    importPayload.exercises.map((item, index) => (
                      <TouchableOpacity
                        key={item.id || `import-exercise-${index}`}
                        style={styles.itemRow}
                        onPress={() => handleToggleImportExerciseId(item.id)}
                      >
                        <View
                          style={[
                            styles.checkbox,
                            selectedImportExerciseIds.includes(item.id) &&
                              styles.checkboxChecked,
                          ]}
                        />
                        <Text style={styles.itemText}>{item.name}</Text>
                      </TouchableOpacity>
                    ))}

                  <View style={styles.sectionHeader}>
                    <TouchableOpacity
                      style={styles.checkboxRow}
                      onPress={() => toggleImportSection('workouts')}
                    >
                      <View
                        style={[
                          styles.checkbox,
                          importSelection.workouts && styles.checkboxChecked,
                        ]}
                      />
                      <Text style={styles.checkboxLabel}>Treinos</Text>
                    </TouchableOpacity>
                  </View>
                  {importSelection.workouts &&
                    importPayload.workouts.map((item, index) => (
                      <TouchableOpacity
                        key={item.id || `import-workout-${index}`}
                        style={styles.itemRow}
                        onPress={() => handleToggleImportWorkoutId(item.id)}
                      >
                        <View
                          style={[
                            styles.checkbox,
                            selectedImportWorkoutIds.includes(item.id) &&
                              styles.checkboxChecked,
                          ]}
                        />
                        <Text style={styles.itemText}>{item.name}</Text>
                      </TouchableOpacity>
                    ))}

                  <View style={styles.sectionHeader}>
                    <TouchableOpacity
                      style={styles.checkboxRow}
                      onPress={() => toggleImportSection('weeklyPlans')}
                    >
                      <View
                        style={[
                          styles.checkbox,
                          importSelection.weeklyPlans && styles.checkboxChecked,
                        ]}
                      />
                      <Text style={styles.checkboxLabel}>Divisões</Text>
                    </TouchableOpacity>
                  </View>
                  {importSelection.weeklyPlans &&
                    importPayload.weeklyPlans.map((item, index) => (
                      <TouchableOpacity
                        key={item.id || `import-weekly-${index}`}
                        style={styles.itemRow}
                        onPress={() => handleToggleImportWeeklyPlanId(item.id)}
                      >
                        <View
                          style={[
                            styles.checkbox,
                            selectedImportWeeklyPlanIds.includes(item.id) &&
                              styles.checkboxChecked,
                          ]}
                        />
                        <Text style={styles.itemText}>{item.name}</Text>
                      </TouchableOpacity>
                    ))}
                </>
              )}
            </ScrollView>

            <View style={styles.modalActions}>
              <Button
                title="Cancelar"
                onPress={() => setImportVisible(false)}
                style={styles.modalSecondaryButton}
              />
              <Button
                title="Importar"
                onPress={handleImportConfirm}
                style={styles.modalPrimaryButton}
                disabled={!!importError || !importPreview || !importPayload}
              />
            </View>
          </View>
        </View>
      </Modal>

      <View style={styles.searchAndFilterContainer}>
        <View style={styles.transferActions}>
          <Button
            title="Exportar JSON"
            onPress={handleOpenExport}
            style={styles.exportButton}
          />
          <Button
            title="Importar JSON"
            onPress={handleOpenImport}
            style={styles.importButton}
          />
        </View>

        <ExerciseSearchBar
          search={search}
          onSearchChange={setSearch}
          placeholder="Buscar exercícios..."
        />

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
  transferActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
    marginBottom: 8,
  },
  exportButton: {
    flex: 1,
    backgroundColor: '#483148',
  },
  importButton: {
    flex: 1,
    backgroundColor: '#332B33',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#1b1613ff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2D2D2D',
  },
  modalTitle: {
    color: '#FFF',
    marginBottom: 6,
  },
  modalSubtitle: {
    color: '#CFCFCF',
    marginBottom: 12,
  },
  modalScroll: {
    maxHeight: 420,
  },
  sectionHeader: {
    marginTop: 8,
    marginBottom: 6,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#6A4C6A',
    backgroundColor: 'transparent',
  },
  checkboxChecked: {
    backgroundColor: '#6A4C6A',
  },
  checkboxLabel: {
    color: '#FFF',
    fontWeight: '600',
  },
  sectionActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 6,
  },
  sectionActionText: {
    color: '#CFCFCF',
    fontSize: 12,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 6,
  },
  itemText: {
    color: '#DDD',
    flex: 1,
  },
  previewTitle: {
    color: '#CFCFCF',
    marginTop: 12,
    marginBottom: 6,
    fontSize: 12,
  },
  jsonContainer: {
    maxHeight: 240,
    marginBottom: 12,
  },
  jsonInput: {
    minHeight: 200,
    textAlignVertical: 'top',
    backgroundColor: '#2D2D2D',
    borderColor: '#3A3A3A',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 8,
  },
  modalPrimaryButton: {
    flex: 1,
    backgroundColor: '#483148',
  },
  modalSecondaryButton: {
    flex: 1,
    backgroundColor: '#332B33',
  },
  errorText: {
    color: '#FF8A80',
    marginBottom: 6,
  },
  previewText: {
    color: '#BDBDBD',
    marginBottom: 10,
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