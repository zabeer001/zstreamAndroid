import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

import LoginPage from '@/src/components/pages/login/LoginPage';
import { useAuthStore } from '@/src/stores/auth.store';

export default function LoginScreen() {
  const isLoaded = useAuthStore((state) => state.isLoaded);
  const isSignedIn = useAuthStore((state) => Boolean(state.accessToken));

  if (!isLoaded) {
    return (
      <View className="flex-1 items-center justify-center bg-background-0 dark:bg-background-950">
        <ActivityIndicator color="#14A800" size="large" />
      </View>
    );
  }

  if (isSignedIn) {
    return <Redirect href="/explore" />;
  }

  return <LoginPage />;
}
