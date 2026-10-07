import type { EmptyStateAlign } from './types';

export const alignClasses: Record<EmptyStateAlign, { container: string; text: string }> = {
  start: { container: 'items-start', text: '' },
  center: { container: 'items-center', text: 'text-center' },
};
