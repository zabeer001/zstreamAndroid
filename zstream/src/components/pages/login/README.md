# Mobile Google Login Flow

This app does not run native Google login on Android/iOS.

Instead, the mobile app opens the normal web login page, lets the web app and backend handle Google, then receives a short one-time code back from the browser.

## Why this flow exists

Native Google auth can be painful because it needs mobile client IDs, package names, SHA fingerprints, and platform-specific setup.

This flow keeps almost all auth logic in the web/backend, where the existing Google login already works.

The mobile app only does three simple things:

1. Open the web login page.
2. Receive a one-time code through the `zstream://sso-callback` deep link.
3. Exchange that code for app tokens and save them securely.

## Full Flow

```txt
Mobile app login button
  -> opens https://zstream.zabeer.online/login?client=mobile&redirect_uri=zstream://sso-callback
  -> web page auto-starts Google login
  -> backend verifies Google account
  -> backend creates a short-lived one-time SSO code
  -> browser redirects to zstream://sso-callback?code=ONE_TIME_CODE
  -> Expo app receives the code
  -> app calls POST /api/mobile/auth/exchange-code
  -> backend returns accessToken, refreshToken, and user
  -> app stores tokens in Expo SecureStore
```

## Important Security Rule

The app must never receive JWTs or Google tokens directly in the URL.

Good:

```txt
zstream://sso-callback?code=ONE_TIME_CODE
```

Bad:

```txt
zstream://sso-callback?token=JWT
zstream://sso-callback?googleToken=GOOGLE_TOKEN
```

The one-time code is safe because it is short-lived, single-use, and exchanged through the backend.

## Mobile Files

### `LoginPage.tsx`

This screen shows the mobile login button.

When the user taps **Continue with Google**, it opens:

```txt
https://zstream.zabeer.online/login?client=mobile&redirect_uri=zstream://sso-callback
```

It uses:

```ts
WebBrowser.openAuthSessionAsync(startUrl, MOBILE_SSO_CALLBACK_URL)
```

The login page does not exchange the code itself. The callback screen handles that.

### `src/app/sso-callback.tsx`

This screen receives:

```txt
zstream://sso-callback?code=ONE_TIME_CODE
```

Then it calls:

```ts
loginWithBackendSsoCode(code)
```

After success, it sends the user into the app.

### `src/stores/auth.store.ts`

This store exchanges the code with the backend:

```ts
POST /api/mobile/auth/exchange-code
```

Then it saves:

- `accessToken`
- `refreshToken`

On native mobile, tokens are saved with Expo SecureStore.

## Web/Backend Files

These files live in the web/backend repo:

```txt
/home/zabeer/dev/node-express/zstream
```

### Web frontend

```txt
frontend/src/pages/auth/LoginPage.jsx
frontend/src/components/GoogleAuthButton.jsx
frontend/src/lib/api.js
```

The web login page checks for:

```txt
client=mobile
redirect_uri=zstream://sso-callback
```

When `client=mobile`, it shows a simple **Logging in with Google** screen and auto-starts the Google prompt.

After Google succeeds, the frontend asks the backend for a mobile handoff URL.

### Backend

```txt
backend/src/controllers/auth/services/google.auth.service.js
backend/src/models/mobileSsoCode.model.js
```

When `/api/auth/google` receives `client: "mobile"`, the backend:

1. Verifies the Google credential.
2. Finds or creates the user.
3. Creates a one-time code in `MobileSsoCode`.
4. Returns:

```json
{
  "success": true,
  "mobileRedirectUrl": "zstream://sso-callback?code=ONE_TIME_CODE"
}
```

The web frontend then redirects the browser to that URL.

## Environment Values

Mobile defaults:

```txt
WEB_LOGIN_URL=https://zstream.zabeer.online/login
MOBILE_SSO_CALLBACK_URL=zstream://sso-callback
BACKEND_ORIGIN=https://api.zstream.zabeer.online
```

Optional Expo overrides:

```env
EXPO_PUBLIC_WEB_LOGIN_URL=https://zstream.zabeer.online/login
EXPO_PUBLIC_MOBILE_SSO_CALLBACK_URL=zstream://sso-callback
EXPO_PUBLIC_BACKEND_ORIGIN=https://api.zstream.zabeer.online
```

Backend should allow the callback:

```env
MOBILE_SSO_CALLBACK_URL=zstream://sso-callback
```

## Testing Locally

Run the web frontend:

```bash
cd /home/zabeer/dev/node-express/zstream/frontend
npm run dev
```

Open this in a browser to preview the mobile handoff screen:

```txt
http://localhost:5173/login?client=mobile&redirect_uri=zstream://sso-callback
```

Run the mobile app:

```bash
cd /home/zabeer/dev/node-express/expo/zstreamAndroid/zstream
npx expo run:android
```

Tap **Continue with Google**.

Expected result:

1. Browser opens the web login page.
2. Google login prompt appears.
3. After login, browser returns to the app.
4. App opens the main authenticated screen.

## VPS Deploy Checklist

After pulling changes on the server:

```bash
cd /path/to/zstream
git pull

cd frontend
npm run build

cd ../backend
pm2 restart <backend-app-name>
```

No backend package install is needed unless `package.json` changed.

## Common Problems

### `SSO code is invalid or expired`

The one-time code was already used or expired.

Make sure only `sso-callback.tsx` exchanges the code. `LoginPage.tsx` should not exchange the code.

### Google prompt does not auto-open

Some browsers may block an automatic prompt. The page still loads the Google login logic, but the user may need to interact depending on browser behavior.

### Browser does not return to app

Check:

- `scheme` in `app.json` is `zstream`
- callback URL is `zstream://sso-callback`
- Expo route `src/app/sso-callback.tsx` exists

### Web login page looks wrong in mobile flow

Open:

```txt
https://zstream.zabeer.online/login?client=mobile&redirect_uri=zstream://sso-callback
```

It should show the simplified **Logging in with Google** screen, not the full web login page.
