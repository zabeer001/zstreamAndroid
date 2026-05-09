import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { create } from 'zustand';

import {
  exchangeMobileSsoCode,
  getCurrentUser,
  login,
  logout as logoutFromBackend,
  refreshAuth,
  signup,
  type AfterLoginResponse,
  type AuthUser,
} from '@/src/lib/api';

const ACCESS_TOKEN_KEY = 'zstream.accessToken';
const REFRESH_TOKEN_KEY = 'zstream.refreshToken';

type StoredSession = {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
};

type AuthState = {
  accessToken: string | null;
  backendAuth: AfterLoginResponse | null;
  isLoaded: boolean;
  refreshToken: string | null;
  user: AuthUser | null;
  clearBackendAuth: () => Promise<void>;
  getAccessToken: () => Promise<string | null>;
  hydrate: () => Promise<void>;
  loginWithBackendSsoCode: (code: string) => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setBackendAuth: (backendAuth: AfterLoginResponse | null) => Promise<void>;
  signupWithEmail: (email: string, password: string, fullName: string) => Promise<void>;
};

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

async function deleteStoredValue(key: string) {
  if (Platform.OS === 'web') {
    localStorage.removeItem(key);
    return;
  }

  await SecureStore.deleteItemAsync(key);
}

async function persistSession(session: StoredSession) {
  await Promise.all([
    setStoredValue(ACCESS_TOKEN_KEY, session.accessToken),
    setStoredValue(REFRESH_TOKEN_KEY, session.refreshToken),
  ]);
}

async function clearStoredSession() {
  await Promise.all([deleteStoredValue(ACCESS_TOKEN_KEY), deleteStoredValue(REFRESH_TOKEN_KEY)]);
}

function normalizeAuthResponse(response: AfterLoginResponse): StoredSession {
  return {
    accessToken: response.accessToken,
    refreshToken: response.refreshToken,
    user: response.user,
  };
}

function isJwtExpiring(token: string) {
  try {
    const payload = token.split('.')[1];
    if (!payload || typeof atob === 'undefined') return false;

    const normalizedPayload = payload.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(payload.length / 4) * 4, '=');
    const decodedPayload = JSON.parse(atob(normalizedPayload)) as { exp?: number };

    if (!decodedPayload.exp) return false;

    return decodedPayload.exp * 1000 < Date.now() + 30_000;
  } catch {
    return false;
  }
}

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  backendAuth: null,
  isLoaded: false,
  refreshToken: null,
  user: null,
  clearBackendAuth: async () => {
    await clearStoredSession();
    set({ accessToken: null, backendAuth: null, refreshToken: null, user: null });
  },
  getAccessToken: async () => {
    const state = get();

    if (state.accessToken && !isJwtExpiring(state.accessToken)) {
      return state.accessToken;
    }

    if (!state.refreshToken) {
      return null;
    }

    try {
      const refreshedSession = await refreshAuth(state.refreshToken);
      const session = normalizeAuthResponse(refreshedSession);
      await persistSession(session);
      set({
        accessToken: session.accessToken,
        backendAuth: refreshedSession,
        refreshToken: session.refreshToken,
        user: session.user,
      });

      return session.accessToken;
    } catch {
      await clearStoredSession();
      set({ accessToken: null, backendAuth: null, refreshToken: null, user: null });
      return null;
    }
  },
  hydrate: async () => {
    try {
      const [accessToken, storedRefreshToken] = await Promise.all([
        getStoredValue(ACCESS_TOKEN_KEY),
        getStoredValue(REFRESH_TOKEN_KEY),
      ]);

      if (!accessToken || !storedRefreshToken) {
        set({ accessToken: null, backendAuth: null, isLoaded: true, refreshToken: null, user: null });
        return;
      }

      try {
        const me = await getCurrentUser(accessToken, storedRefreshToken);
        const backendAuth = {
          success: true,
          accessToken,
          refreshToken: storedRefreshToken,
          user: me.user,
        };

        set({
          accessToken,
          backendAuth,
          isLoaded: true,
          refreshToken: storedRefreshToken,
          user: me.user,
        });
      } catch {
        const refreshedSession = await refreshAuth(storedRefreshToken);
        const session = normalizeAuthResponse(refreshedSession);
        await persistSession(session);
        set({
          accessToken: session.accessToken,
          backendAuth: refreshedSession,
          isLoaded: true,
          refreshToken: session.refreshToken,
          user: session.user,
        });
      }
    } catch (error) {
      console.log('Error hydrating auth session:', error);
      await clearStoredSession();
      set({ accessToken: null, backendAuth: null, isLoaded: true, refreshToken: null, user: null });
    }
  },
  loginWithEmail: async (email, password) => {
    const response = await login(email, password);
    await get().setBackendAuth(response);
  },
  loginWithBackendSsoCode: async (code) => {
    const response = await exchangeMobileSsoCode(code);
    await get().setBackendAuth(response);
  },
  logout: async () => {
    const { accessToken, refreshToken } = get();

    if (accessToken) {
      await logoutFromBackend(accessToken, refreshToken || undefined).catch(() => null);
    }

    await clearStoredSession();
    set({ accessToken: null, backendAuth: null, refreshToken: null, user: null });
  },
  setBackendAuth: async (backendAuth) => {
    if (!backendAuth) {
      await clearStoredSession();
      set({ accessToken: null, backendAuth: null, refreshToken: null, user: null });
      return;
    }

    const session = normalizeAuthResponse(backendAuth);
    await persistSession(session);
    set({
      accessToken: session.accessToken,
      backendAuth,
      refreshToken: session.refreshToken,
      user: session.user,
    });
  },
  signupWithEmail: async (email, password, fullName) => {
    const response = await signup(email, password, fullName);
    await get().setBackendAuth(response);
  },
}));
