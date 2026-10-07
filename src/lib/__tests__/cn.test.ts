import { cn } from '@/lib';

describe('cn', () => {
  it('lets later classes override conflicting earlier ones', () => {
    expect(cn('px-5 py-2', 'px-0')).toBe('py-2 px-0');
    expect(cn('bg-paper', 'bg-ink')).toBe('bg-ink');
    expect(cn('text-ink', 'text-secondary')).toBe('text-secondary');
  });

  it('keeps unrelated classes and drops empty values', () => {
    expect(cn('flex-row', false, undefined, '', 'border-rule border')).toBe(
      'flex-row border-rule border',
    );
  });
});
