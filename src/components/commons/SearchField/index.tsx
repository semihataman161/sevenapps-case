import { useEffect, useEffectEvent, useState } from 'react';

import { useDebouncedValue } from '@/lib';

import { Button } from '../Button';
import { Icon } from '../Icon';
import { Input } from '../Input';
import { DEFAULT_DEBOUNCE_MS } from './constants';
import type { SearchFieldProps } from './types';

export type * from './types';

export function SearchField({
  onSearch,
  clearLabel,
  initialQuery = '',
  debounceMs = DEFAULT_DEBOUNCE_MS,
  ...props
}: SearchFieldProps) {
  const [text, setText] = useState(initialQuery);
  const debouncedText = useDebouncedValue(text, debounceMs);
  const notifySearch = useEffectEvent((query: string) => onSearch(query));

  useEffect(() => {
    notifySearch(debouncedText.trim());
  }, [debouncedText]);

  return (
    <Input
      value={text}
      onChangeText={setText}
      returnKeyType="search"
      autoCorrect={false}
      autoCapitalize="none"
      clearButtonMode="never"
      leading={<Icon name="search-outline" size={18} tone="muted" />}
      trailing={
        text ? (
          <Button
            variant="text"
            icon="close"
            iconSize={18}
            textTone="muted"
            accessibilityLabel={clearLabel}
            onPress={() => setText('')}
          />
        ) : null
      }
      {...props}
    />
  );
}
