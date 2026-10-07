import { act, render, screen, userEvent } from '@testing-library/react-native';

import { SearchField } from '@/components/commons/SearchField';

const DEBOUNCE_MS = 300;

async function renderSearchField(initialQuery?: string) {
  const onSearch = jest.fn();
  const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
  await render(
    <SearchField
      accessibilityLabel="Search clips"
      clearLabel="Clear search"
      initialQuery={initialQuery}
      debounceMs={DEBOUNCE_MS}
      onSearch={onSearch}
    />,
  );
  await act(() => jest.advanceTimersByTime(DEBOUNCE_MS));
  onSearch.mockClear();
  return { onSearch, user, input: screen.getByLabelText('Search clips') };
}

describe('SearchField', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('reports the trimmed query once typing pauses', async () => {
    const { onSearch, user, input } = await renderSearchField();

    await user.type(input, ' sea ');
    expect(onSearch).not.toHaveBeenCalled();
    await act(() => jest.advanceTimersByTime(DEBOUNCE_MS));

    expect(onSearch).toHaveBeenCalledTimes(1);
    expect(onSearch).toHaveBeenCalledWith('sea');
  });

  it('starts with the initial query', async () => {
    const { input } = await renderSearchField('pier');

    expect(input).toHaveDisplayValue('pier');
  });

  it('clears the text and reports an empty query', async () => {
    const { onSearch, user, input } = await renderSearchField('pier');

    await user.press(screen.getByRole('button', { name: 'Clear search' }));
    await act(() => jest.advanceTimersByTime(DEBOUNCE_MS));

    expect(input).toHaveDisplayValue('');
    expect(onSearch).toHaveBeenLastCalledWith('');
  });

  it('shows the clear button only when there is text', async () => {
    const { user, input } = await renderSearchField();
    expect(screen.queryByRole('button', { name: 'Clear search' })).toBeNull();

    await user.type(input, 'a');

    expect(screen.getByRole('button', { name: 'Clear search' })).toBeOnTheScreen();
  });
});
