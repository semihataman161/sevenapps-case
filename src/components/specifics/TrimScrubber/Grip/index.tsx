import { View } from 'react-native';

export function Grip() {
  return (
    <View className="h-full w-1.5 items-center justify-center bg-accent dark:bg-accent-dark">
      <View className="h-4 w-px bg-paper" />
    </View>
  );
}
