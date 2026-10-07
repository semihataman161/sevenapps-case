import { render, screen, userEvent } from '@testing-library/react-native';

import { Button } from '@/components/commons/Button';

describe('Button', () => {
  it('calls onPress when pressed', async () => {
    const user = userEvent.setup();
    const onPress = jest.fn();
    await render(<Button title="Save" onPress={onPress} />);

    await user.press(screen.getByRole('button', { name: /save/i }));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('ignores presses while disabled', async () => {
    const user = userEvent.setup();
    const onPress = jest.fn();
    await render(<Button title="Save" disabled onPress={onPress} />);
    const button = screen.getByRole('button', { name: /save/i });

    await user.press(button);

    expect(onPress).not.toHaveBeenCalled();
    expect(button).toBeDisabled();
  });

  it('shows a busy button instead of its title while loading', async () => {
    const user = userEvent.setup();
    const onPress = jest.fn();
    await render(<Button title="Save" loading accessibilityLabel="Save" onPress={onPress} />);
    const button = screen.getByRole('button', { name: /save/i });

    await user.press(button);

    expect(onPress).not.toHaveBeenCalled();
    expect(button).toBeBusy();
    expect(screen.queryByText(/save/i)).toBeNull();
  });
});
