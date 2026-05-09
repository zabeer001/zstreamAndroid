import { Ionicons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MOBILE_SSO_CALLBACK_URL, MOBILE_SSO_START_URL } from '@/src/lib/config';
import { getMobileAuthDeviceInfo } from '@/src/lib/mobile-auth-device';
import { useAuthStore } from '@/src/stores/auth.store';

WebBrowser.maybeCompleteAuthSession();

const LoginPage = () => {
  const router = useRouter();
  const loginWithBackendSsoCode = useAuthStore((state) => state.loginWithBackendSsoCode);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const completeSsoLogin = async (callbackUrl: string) => {
    const parsedUrl = Linking.parse(callbackUrl);
    const codeParam = parsedUrl.queryParams?.code;
    const errorParam = parsedUrl.queryParams?.error;
    const code = Array.isArray(codeParam) ? codeParam[0] : codeParam;
    const ssoError = Array.isArray(errorParam) ? errorParam[0] : errorParam;

    if (ssoError) {
      throw new Error(String(ssoError));
    }

    if (!code) {
      throw new Error('Google did not return a login code.');
    }

    await loginWithBackendSsoCode(String(code));
    router.replace('/explore');
  };

  const handleGoogleLogin = async () => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      const { deviceId, deviceName } = await getMobileAuthDeviceInfo();
      const startUrl = new URL(MOBILE_SSO_START_URL);
      startUrl.searchParams.set('device_id', deviceId);
      startUrl.searchParams.set('device_name', deviceName);

      const result = await WebBrowser.openAuthSessionAsync(startUrl.toString(), MOBILE_SSO_CALLBACK_URL);

      if (result.type === 'success') {
        await completeSsoLogin(result.url);
        return;
      }

      setIsSubmitting(false);
    } catch (error) {
      console.log('Google prompt failed:', error);
      setIsSubmitting(false);
      Alert.alert('Google login failed', error instanceof Error ? error.message : 'Please try again.');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background-0 dark:bg-background-950">
      <View className="flex-1 justify-between px-6 py-8">
        <View className="gap-8">
          <View className="gap-3">
            <View className="h-14 w-14 items-center justify-center rounded-2xl bg-success-50 dark:bg-background-900">
              <Ionicons name="boat-outline" size={28} color="#14A800" />
            </View>
            <View className="gap-2">
              <Text className="text-xs font-semibold uppercase tracking-[0.2em] text-success-700 dark:text-success-500">
                Join The Crew
              </Text>
              <Text className="text-4xl font-bold text-typography-950 dark:text-typography-0">
                Zstream
              </Text>
              <Text className="text-base leading-6 text-typography-600 dark:text-typography-300">
                Sign in with Google to continue your language journey.
              </Text>
            </View>
          </View>

          <View className="rounded-2xl border border-outline-200 bg-background-50 p-5 dark:border-outline-800 dark:bg-background-900">
            <Text className="text-2xl font-bold text-typography-950 dark:text-typography-0">
              Welcome back
            </Text>
            <Text className="mt-2 text-sm leading-6 text-typography-500 dark:text-typography-400">
              Use your Google account to open Zstream on this device.
            </Text>

            <Pressable
              accessibilityRole="button"
              className="mt-5 h-12 flex-row items-center justify-center gap-2 rounded-xl border border-outline-200 bg-background-0 px-4 active:bg-background-100 disabled:opacity-60 dark:border-outline-800 dark:bg-background-950 dark:active:bg-background-900"
              disabled={isSubmitting}
              onPress={handleGoogleLogin}>
              {isSubmitting ? (
                <ActivityIndicator color="#14A800" size="small" />
              ) : (
                <Ionicons name="logo-google" size={18} color="#14A800" />
              )}
              <Text className="text-sm font-bold text-typography-950 dark:text-typography-0">
                {isSubmitting ? 'Connecting...' : 'Continue with Google'}
              </Text>
            </Pressable>
          </View>
        </View>

        <View className="rounded-2xl border border-outline-200 bg-background-50 p-5 dark:border-outline-800 dark:bg-background-900">
          <Text className="text-lg font-bold text-typography-950 dark:text-typography-0">
            Connect with language partners worldwide
          </Text>
          <Text className="mt-2 text-sm leading-6 text-typography-500 dark:text-typography-400">
            Live chat, video calls, and real conversations in one place.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LoginPage;
