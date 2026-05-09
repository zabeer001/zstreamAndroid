import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, Text } from 'react-native';

import { useAuthStore } from '@/src/stores/auth.store';

export function LogoutButton() {
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  return (
    <Pressable
      accessibilityRole="button"
      className="mt-3 h-12 flex-row items-center justify-center gap-2 rounded-md border border-error-200 bg-error-50 px-4 active:bg-error-100 dark:border-error-900 dark:bg-background-900 dark:active:bg-background-800"
      onPress={handleLogout}>
      <Ionicons name="log-out-outline" size={18} color="#DC2626" />
      <Text className="text-sm font-bold text-error-600 dark:text-error-400">Logout</Text>
    </Pressable>
  );
}
