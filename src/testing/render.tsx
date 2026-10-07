import '@/i18n';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, renderHook, type RenderHookOptions } from '@testing-library/react-native';
import type { ReactElement, ReactNode } from 'react';
import { SafeAreaProvider, type Metrics } from 'react-native-safe-area-context';

const SAFE_AREA: Metrics = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 47, right: 0, bottom: 34, left: 0 },
};

export function createTestQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
}

function providers(client: QueryClient) {
  return function Providers({ children }: { children: ReactNode }) {
    return (
      <SafeAreaProvider initialMetrics={SAFE_AREA}>
        <QueryClientProvider client={client}>{children}</QueryClientProvider>
      </SafeAreaProvider>
    );
  };
}

export async function renderWithProviders(ui: ReactElement, client = createTestQueryClient()) {
  return { client, ...(await render(ui, { wrapper: providers(client) })) };
}

export async function renderHookWithProviders<Result, Props>(
  hook: (props: Props) => Result,
  options: Omit<RenderHookOptions<Props>, 'wrapper'> & { client?: QueryClient } = {},
) {
  const { client = createTestQueryClient(), ...hookOptions } = options;
  return {
    client,
    ...(await renderHook(hook, { ...hookOptions, wrapper: providers(client) })),
  };
}
