import Constants from 'expo-constants';
import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const MOBILE_AUTH_DEVICE_ID_KEY = 'zstream.mobileAuthDeviceId';

async function getStoredValue(key: string) {
  if (Platform.OS === 'web') {
    return typeof localStorage === 'undefined' ? null : localStorage.getItem(key);
  }

  return SecureStore.getItemAsync(key);
}

async function setStoredValue(key: string, value: string) {
  if (Platform.OS === 'web') {
    localStorage.setItem(key, value);
    return;
  }

  await SecureStore.setItemAsync(key, value);
}

function createDeviceName() {
  const appName = Constants.expoConfig?.name || Constants.name || 'Zstream';
  const platformName = Platform.OS === 'ios' ? 'iOS' : Platform.OS === 'android' ? 'Android' : Platform.OS;
  const platformVersion = Platform.Version ? ` ${Platform.Version}` : '';

  return `${appName} ${platformName}${platformVersion}`;
}

export async function getMobileAuthDeviceInfo() {
  let deviceId = await getStoredValue(MOBILE_AUTH_DEVICE_ID_KEY);

  if (!deviceId) {
    deviceId = Crypto.randomUUID();
    await setStoredValue(MOBILE_AUTH_DEVICE_ID_KEY, deviceId);
  }

  return {
    deviceId,
    deviceName: createDeviceName(),
  };
}
