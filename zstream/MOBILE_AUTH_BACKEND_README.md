# Mobile Auth Backend Notes

The Expo app now uses the backend auth system directly. Clerk is not used.

## Required Backend Routes

The mobile app calls these routes:

```http
GET /api/mobile/auth/google/start
POST /api/mobile/auth/exchange-code
POST /api/mobile/auth/refresh
POST /api/mobile/auth/logout
GET /api/mobile/auth/me
```

Successful login/signup/refresh responses must include:

```json
{
  "success": true,
  "user": {},
  "accessToken": "...",
  "refreshToken": "..."
}
```

Protected mobile requests send:

```http
Authorization: Bearer <accessToken>
```

## Mobile Token Behavior

- `accessToken` and `refreshToken` are stored in Expo SecureStore on native.
- On web, they are stored in `localStorage`.
- App startup restores the session with `GET /api/mobile/auth/me`.
- If the access token is near expiry, the app calls `POST /api/mobile/auth/refresh`.
- Logout calls `POST /api/mobile/auth/logout` and clears local tokens.

## Backend Requirements

- `JWT_SECRET_KEY` must be set.
- `JWT_REFRESH_SECRET_KEY` is recommended.
- `protectRoute` must accept Bearer access tokens.
- `/mobile/auth/refresh` must accept `{ "refreshToken": "..." }` in the JSON body.
- `/mobile/auth/logout` should accept the Bearer access token and optional refresh token body.

## Google Web SSO

The mobile app does not use Android Google auth. The Google login button opens the backend SSO URL in a browser:

```http
GET /api/mobile/auth/google/start
```

After Google login, the backend redirects back to the app:

```txt
zstream://sso-callback?code=<one-time-code>
```

The callback screen exchanges that code:

```http
POST /api/mobile/auth/exchange-code
Content-Type: application/json

{
  "code": "<one-time-code>"
}
```

Then the app stores the returned `accessToken` and `refreshToken` in SecureStore.

Expo `.env` can override the defaults:

```env
EXPO_PUBLIC_BACKEND_ORIGIN="https://api.zstream.zabeer.online"
EXPO_PUBLIC_MOBILE_SSO_CALLBACK_URL="zstream://sso-callback"
```

Backend `.env`:

```env
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GOOGLE_MOBILE_REDIRECT_URI="https://api.zstream.zabeer.online/api/mobile/auth/google/callback"
MOBILE_SSO_CALLBACK_URL="zstream://sso-callback"
```
