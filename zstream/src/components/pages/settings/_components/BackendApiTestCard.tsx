import { Ionicons } from '@expo/vector-icons';
import { useCallback, useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { testMobileAppApi } from '@/src/lib/api';
import { API_BASE_URL } from '@/src/lib/config';

type ApiTestState = 'idle' | 'loading' | 'success' | 'error';

export function BackendApiTestCard() {
  const [status, setStatus] = useState<ApiTestState>('idle');
  const [message, setMessage] = useState('Tap test to check the backend connection');
  const [timestamp, setTimestamp] = useState('');

  const testBackend = useCallback(async () => {
    try {
      setStatus('loading');
      setMessage('Checking backend...');
      setTimestamp('');

      const response = await testMobileAppApi();

      setStatus('success');
      setMessage(response.message || 'Backend API is online');
      setTimestamp(response.timestamp || '');
    } catch (error) {
      console.error('Failed to test backend API', error);
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Backend API test failed');
      setTimestamp('');
    }
  }, []);

  useEffect(() => {
    testBackend();
  }, [testBackend]);

  const isLoading = status === 'loading';
  const isSuccess = status === 'success';
  const iconName = isLoading
    ? 'sync-outline'
    : isSuccess
      ? 'checkmark-circle-outline'
      : status === 'error'
        ? 'alert-circle-outline'
        : 'server-outline';
  const iconColor = isSuccess ? '#14A800' : status === 'error' ? '#DC2626' : '#6B7280';

  return (
    <View className="mt-3 rounded-md border border-outline-200 bg-background-0 p-3 dark:border-outline-800 dark:bg-background-900">
      <View className="flex-row items-start gap-3">
        <View className="h-10 w-10 items-center justify-center rounded-md bg-background-50 dark:bg-background-800">
          <Ionicons name={iconName} size={20} color={iconColor} />
        </View>

        <View className="min-w-0 flex-1">
          <Text className="text-base font-bold text-typography-950 dark:text-typography-0">
            Backend API
          </Text>
          <Text className="mt-1 text-sm text-typography-500 dark:text-typography-400">
            Test the app server connection
          </Text>
        </View>
      </View>

      <View
        className={`mt-3 rounded-md border px-3 py-3 ${
          isSuccess
            ? 'border-success-200 bg-success-50 dark:border-success-900 dark:bg-success-950'
            : status === 'error'
              ? 'border-error-200 bg-error-50 dark:border-error-900 dark:bg-error-950'
              : 'border-outline-200 bg-background-50 dark:border-outline-800 dark:bg-background-950'
        }`}>
        <Text
          className={`text-sm font-semibold ${
            isSuccess
              ? 'text-success-700 dark:text-success-300'
              : status === 'error'
                ? 'text-error-700 dark:text-error-300'
                : 'text-typography-700 dark:text-typography-300'
          }`}>
          {message}
        </Text>
        {timestamp ? (
          <Text className="mt-1 text-xs text-typography-500 dark:text-typography-400">
            Last response: {new Date(timestamp).toLocaleString()}
          </Text>
        ) : null}
      </View>

      <Text className="mt-3 text-xs text-typography-500 dark:text-typography-400">
        {API_BASE_URL}/test-mobile-app
      </Text>

      <Pressable
        accessibilityRole="button"
        disabled={isLoading}
        className={`mt-3 h-11 flex-row items-center justify-center gap-2 rounded-md px-4 ${
          isLoading ? 'bg-background-100 dark:bg-background-800' : 'bg-success-600 active:bg-success-700'
        }`}
        onPress={testBackend}>
        <Ionicons name="flash-outline" size={17} color={isLoading ? '#6B7280' : '#FFFFFF'} />
        <Text
          className={`text-sm font-bold ${
            isLoading ? 'text-typography-500 dark:text-typography-400' : 'text-white'
          }`}>
          {isLoading ? 'Testing...' : 'Test API'}
        </Text>
      </Pressable>
    </View>
  );
}
