# zstreamAndroid

zstreamAndroid is a React Native Android app built with Expo. The app lives in the `zstream/` directory and uses Expo Router, NativeWind, Gluestack UI foundations, and Zustand to provide a clean mobile experience for social discovery, chat, learning content, and theme settings.

## Features

- Tab-based mobile navigation for Explore, Courses, Chat, and Settings
- Explore feed with category filters, post cards, tags, reactions, shares, and comments
- Courses screen with searchable course cards, categories, saved state, and course metadata
- Chat inbox with search, recent/all/favorite filters, unread counts, and favorite conversations
- Settings screen with system, light, and dark theme modes
- Expo Router file-based routing under `src/app`
- Android package configured as `com.zabeer32.zstream`

## Tech Stack

- Expo 54
- React 19
- React Native 0.81
- Expo Router 6
- TypeScript
- NativeWind and Tailwind CSS
- Zustand
- Gluestack UI core utilities
- Expo Vector Icons

## Project Structure

```text
zstreamAndroid/
├── README.md
├── .gitignore
└── zstream/
    ├── app.json
    ├── package.json
    ├── src/
    │   ├── app/
    │   ├── components/
    │   ├── constants/
    │   ├── hooks/
    │   └── stores/
    ├── tailwind.config.js
    └── tsconfig.json
```

## Getting Started

From the repository root:

```bash
cd zstream
npm install
npm start
```

Run on Android:

```bash
npm run android
```

Run in the browser:

```bash
npm run web
```

Run linting:

```bash
npm run lint
```

## Development Notes

- Main app code is inside `zstream/src`.
- Routes are defined in `zstream/src/app`.
- Page-level UI is grouped under `zstream/src/components/pages`.
- Shared tab bar components are in `zstream/src/components/tabbar`.
- Theme state lives in `zstream/src/stores/theme.store.ts`.
- Generated folders such as `node_modules`, `.expo`, `dist`, and native build output are ignored.

## Git

This repository tracks the app from the parent `zstreamAndroid` Git repo. The nested Git metadata that was previously inside `zstream/` has been moved aside and ignored so `zstream/` is tracked as normal source code.

After making changes:

```bash
git status
git add .
git commit -m "Describe your change"
git push
```
