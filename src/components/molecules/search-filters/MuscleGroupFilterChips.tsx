// src/components/molecules/MuscleGroupFilterChips.tsx
import React from 'react';
import { ScrollView, TouchableOpacity, StyleSheet, View } from 'react-native';
import { Text } from '../../atoms/Text';

interface MuscleGroupFilterChipsProps {
  groups: string[];
  selectedGroup: string | null;
  onSelectGroup: (group: string | null) => void;
}

export const MuscleGroupFilterChips: React.FC<MuscleGroupFilterChipsProps> = ({
  groups,
  selectedGroup,
  onSelectGroup,
}) => {
  if (groups.length === 0) return null;

  return (
    <View style={styles.container}>
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
          onPress={() => onSelectGroup(null)}
        >
          <Text style={[
            styles.filterChipText,
            !selectedGroup && styles.filterChipTextActive
          ]}>
            Todos
          </Text>
        </TouchableOpacity>
        
        {groups.map(group => (
          <TouchableOpacity
            key={group}
            style={[
              styles.filterChip,
              selectedGroup === group && styles.filterChipActive
            ]}
            onPress={() => onSelectGroup(
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
  );
};

const styles = StyleSheet.create({
  container: {
    // paddingHorizontal: 16,
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
});