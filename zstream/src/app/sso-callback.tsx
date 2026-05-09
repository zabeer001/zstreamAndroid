import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuthStore } from '@/src/stores/auth.store';

export default function SSOCallbackPage() {
  const router = useRouter();
  const params = useLocalSearchParams<{ code?: string | string[]; error?: string | string[] }>();
  const loginWithBackendSsoCode = useAuthStore((state) => state.loginWithBackendSsoCode);
  const [message, setMessage] = useState('Finishing Google login...');

  const code = useMemo(() => {
    return Array.isArray(params.code) ? params.code[0] : params.code;
  }, [params.code]);

  const ssoError = useMemo(() => {
    return Array.isArray(params.error) ? params.error[0] : params.error;
  }, [params.error]);

  useEffect(() => {
    const finishLogin = async () => {
      try {
        if (ssoError) {
          throw new Error(ssoError);
        }

        if (!code) {
          throw new Error('Missing login code.');
        }

        await loginWithBackendSsoCode(code);
        router.replace('/explore');
      } catch (error) {
        console.log('SSO callback failed:', error);
        setMessage(error instanceof Error ? error.message : 'Google login failed.');
        setTimeout(() => router.replace('/login'), 1400);
      }
    };

    finishLogin();
  }, [code, loginWithBackendSsoCode, router, ssoError]);

  return (
    <SafeAreaView className="flex-1 bg-background-0 dark:bg-background-950">
      <View className="flex-1 items-center justify-center gap-3 px-6">
        <ActivityIndicator color="#14A800" size="small" />
        <Text className="text-center text-sm font-semibold text-typography-700 dark:text-typography-200">
          {message}
        </Text>
      </View>
    </SafeAreaView>
  );
}
