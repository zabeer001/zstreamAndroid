import Constants from 'expo-constants';

const defaultBackendOrigin = 'https://api.zstream.zabeer.online';
const defaultWebOrigin = 'https://zstream.zabeer.online';

export const BACKEND_ORIGIN =
  process.env.EXPO_PUBLIC_BACKEND_ORIGIN ||
  Constants.expoConfig?.extra?.backendOrigin ||
  defaultBackendOrigin;

export const API_BASE_URL = `${BACKEND_ORIGIN}/api`;
export const MOBILE_SSO_START_URL = `${API_BASE_URL}/mobile/auth/google/start`;
export const MOBILE_SSO_CALLBACK_URL =
  process.env.EXPO_PUBLIC_MOBILE_SSO_CALLBACK_URL ||
  Constants.expoConfig?.extra?.mobileSsoCallbackUrl ||
  'zstream://sso-callback';
export const WEB_LOGIN_URL =
  process.env.EXPO_PUBLIC_WEB_LOGIN_URL ||
  Constants.expoConfig?.extra?.webLoginUrl ||
  `${defaultWebOrigin}/login`;
