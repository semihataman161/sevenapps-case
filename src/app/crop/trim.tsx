import { Redirect } from 'expo-router';

import { TrimEditor } from '@/components';
import { useCropDraftStore } from '@/store';

export default function TrimScreen() {
  const source = useCropDraftStore((s) => s.source);
  if (!source) return <Redirect href="/crop" />;
  return <TrimEditor source={source} />;
}
