import { DayOfWeek } from '../types';
import { PopularWorkoutTemplate, popularWorkouts } from './popularWorkouts';

export type WeeklySplitTemplate = {
  id: string;
  name: string;
  description: string;
  tags: string[];
  days: { day: DayOfWeek; workoutTemplateId: string | null }[];
};

const byId = (id: string): PopularWorkoutTemplate | undefined =>
  popularWorkouts.find(w => w.id === id);

export const weeklySplitTemplates: WeeklySplitTemplate[] = [
  {
    id: 'ppl-3x',
    name: 'PPL 3x (Push/Pull/Legs)',
    description: 'Divisão clássica 3x na semana (Seg/Qua/Sex).',
    tags: ['ppl', 'hipertrofia', 'intermediate'],
    days: [
      { day: 'monday', workoutTemplateId: byId('push-day')?.id || null },
      { day: 'tuesday', workoutTemplateId: null },
      { day: 'wednesday', workoutTemplateId: byId('pull-day')?.id || null },
      { day: 'thursday', workoutTemplateId: null },
      { day: 'friday', workoutTemplateId: byId('legs-day')?.id || null },
      { day: 'saturday', workoutTemplateId: null },
      { day: 'sunday', workoutTemplateId: null },
    ],
  },
  {
    id: 'upper-lower-4x',
    name: 'Upper/Lower 4x',
    description: 'Divisão 4x para evolução consistente (Seg/Ter/Qui/Sex).',
    tags: ['upper-lower', 'hipertrofia'],
    days: [
      { day: 'monday', workoutTemplateId: byId('upper-lower-upper')?.id || null },
      { day: 'tuesday', workoutTemplateId: byId('lower-day')?.id || null },
      { day: 'wednesday', workoutTemplateId: null },
      { day: 'thursday', workoutTemplateId: byId('upper-lower-upper')?.id || null },
      { day: 'friday', workoutTemplateId: byId('lower-day')?.id || null },
      { day: 'saturday', workoutTemplateId: null },
      { day: 'sunday', workoutTemplateId: null },
    ],
  },
  {
    id: 'fullbody-3x',
    name: 'Full Body 3x',
    description: 'Full body em dias alternados (Seg/Qua/Sex).',
    tags: ['fullbody', 'iniciante'],
    days: [
      { day: 'monday', workoutTemplateId: byId('fullbody-beginner')?.id || null },
      { day: 'tuesday', workoutTemplateId: null },
      { day: 'wednesday', workoutTemplateId: byId('fullbody-beginner')?.id || null },
      { day: 'thursday', workoutTemplateId: null },
      { day: 'friday', workoutTemplateId: byId('fullbody-beginner')?.id || null },
      { day: 'saturday', workoutTemplateId: null },
      { day: 'sunday', workoutTemplateId: null },
    ],
  },
];
