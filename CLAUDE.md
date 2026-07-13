# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

"Heal" is a React Native 0.81 (New Architecture, React 19) mental-health/wellness app: onboarding flow, journaling, guided modules/challenges, an AI chat feature ("Healy Chat"), and a subscription/premium paywall.

## Commands

```bash
yarn install           # install deps (postinstall runs patch-package automatically)
yarn start             # start Metro bundler
yarn android           # build & run on Android
yarn ios               # build & run on iOS
yarn lint              # eslint .
yarn test              # jest
npx jest path/to/File.test.tsx   # run a single test file
npx jest -t "test name"          # run tests matching a name
```

There is no root README. iOS uses CocoaPods (see `ios/`, `Gemfile`) — after adding a native dependency, run `bundle exec pod install` from `ios/`.

## Architecture

### Feature-first structure under `src/`
- `src/features/<Domain>/screens/<ScreenName>/` — each screen is a folder containing the component, `style.ts`, and sometimes local `components/` and `hooks/` subfolders (see `src/features/Home/screens/HealyChat/`). Domains: `auth`, `onboard`, `Home`, `Journal`, `Modules`, `Challenges`, `premium`, `settings`, `common`.
- `src/components/` — shared, cross-feature UI components.
- `src/hooks/` — shared hooks, notably the API hooks below.
- `src/constants/` — `colors.tsx` (Light/Dark themes), `variables.tsx` (`strings` keys used for AsyncStorage keys and elsewhere), `urls.tsx`, `fonts.tsx`, `Sensitive/sensitiveData` (gitignored/local secrets, referenced by `config.tsx`).
- `src/modals/` — global overlay modals (`Loader`, `SuccessModal`, `UpdatePopup`) rendered from stack roots, not pushed as routes.

### Navigation — naming is inverted, read carefully
`src/routes/mainStack/mainStack.tsx` renders exactly two top-level stacks:
- **`AuthStack`** (`src/routes/auth/AuthStack.tsx`) is actually the **pre-login** flow: Splash, onboarding questions, Welcome/SignIn/SignUp/Verification, Terms/Privacy.
- **`NonAuthStack`** (`src/routes/NoAuth/NonAuthStack.tsx`) is actually the **post-login, authenticated** app: `TabNavigator` (bottom tabs / Home, Journal, Modules, Challenges, Settings), Offer/Premium paywall, and all deep-linked feature screens (chat, journal, module detail, settings, etc.).

Route names are centralized in `src/routes/RouteKeys/appRoutes.tsx` (`AppRoutes.X` string constants) — always add new screens there rather than hardcoding route name strings.

`MainStack` also owns app-wide bootstrapping on mount: reading persisted tokens from Keychain, restoring auth state into Redux, initializing localization, handling deep links (magic-link login via `/link/<code>?...` URLs — see the `handleUrl` logic), and showing a connectivity banner via `useNetInfo`.

### Auth & tokens
- Access/refresh tokens live in Redux (`src/redux/Reducers/userData.tsx`) but are **not** persisted by redux-persist (`omitTokensTransform` in `src/redux/Store/store.tsx` strips them before persisting `userData`). Tokens are instead persisted to the OS Keychain via `src/utils/tokenStorage.ts`, kept in sync by the `tokenPersistenceMiddleware` in the store.
- `src/api/Manager/manager.tsx` is the single apisauce/axios instance (`api`). It injects the bearer token via a request transform, and its response interceptor handles silent 401 refresh-token retries (with a request queue for concurrent 401s), plus force-logout on 409 (deactivated) / 410 (deleted) accounts. `logoutUser()` there clears Redux auth state and resets navigation back to `AuthStack > Welcome`.
- Never call `api` directly from screens for new endpoints — add the endpoint to `src/api/Services/endpoints.tsx` and, if there's shared logic, a function in `src/api/Services/services.tsx`.

### Data fetching
Network calls from components go through TanStack Query wrapper hooks in `src/hooks/`: `useGetApi`, `useInfiniteGetApi`, `usePostApi`, `useDeleteApi`. These wrap `api` from the manager and normalize `apisauce` responses (`response.ok` / `response.data` / `response.problem`) into thrown errors so `onError`/`isError` work as expected. Prefer these over calling `api` directly in components.

### State management
Redux Toolkit with two slices: `userData` (auth, user profile, onboarding answers/progress, app language, biometric/remember-me prefs — persisted) and `tempData` (ephemeral UI state like the global loader — not persisted). Onboarding progress/answers are modeled inside `userData.onboarding` and rehydrated defensively (`ensureOnboardingState`) to tolerate schema changes across app versions.

### Localization
`src/localization/localization.tsx` provides `LocalizationContext` (`react-native-localization` + `react-native-localize`). Language auto-detects from device locale/region on first launch (mapped in `languageCodeMapping` / `regionLanguageMapping`), then persists the user's choice to AsyncStorage. Translation strings live in `src/localization/langFiles/{en,fr,es,de,ru,pt,it}.json` — keep these key sets in sync when adding new UI strings, and access via `localization.appkeys?.<key>` with an English fallback (see usage in `NonAuthStack`).

### Config / environments
`config.tsx` defines `Mode` (`DEV`/`STAGE`/`PROD`) and pulls URLs/keys from `src/constants/Sensitive/sensitiveData` (not committed). `env.tsx` derives the active `apiUrl`/`fileUrl`/`stripeKey`/`googleMapKey` from `config.mode` — switch environments by changing `config.mode`, not by editing `env.tsx`.

### Subscriptions
`src/hooks/useSubscription.tsx` wraps `react-native-purchases` (RevenueCat) in a `SubscriptionProvider`, mounted above navigation in `App.tsx` so paywall/entitlement state is available app-wide.
