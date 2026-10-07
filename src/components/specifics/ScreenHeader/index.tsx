import { SafeAreaView } from 'react-native-safe-area-context';

import { Header } from '@/components/commons';

import { HeaderBackButton } from '../HeaderBackButton';
import type { ScreenHeaderProps } from './types';

export type * from './types';

export function ScreenHeader({
  left = <HeaderBackButton />,
  className = '',
  ...props
}: ScreenHeaderProps) {
  return (
    <SafeAreaView edges={['top']}>
      <Header left={left} className={`px-5 ${className}`} {...props} />
    </SafeAreaView>
  );
}
