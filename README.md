# Heal - React Native Application

"Heal" is a cross-platform (iOS & Android) React Native mental health and wellness application. It features a paywalled onboarding flow, daily journaling, guided modules & wellness challenges, AI-assisted chat ("Healy Chat"), and integrated in-app subscriptions.

---

## 📋 Table of Contents
1. [Prerequisites](#-prerequisites)
2. [Repository Decryption (`git-crypt`)](#-repository-decryption-git-crypt)
3. [Environment Configuration](#-environment-configuration)
4. [Installation & Setup](#-installation--setup)
5. [Running the Application](#-running-the-application)
6. [Building for Production](#-building-for-production)
7. [Third-Party Integrations](#-third-party-integrations)
8. [Sensitive Credentials & Security Notice](#-sensitive-credentials--security-notice)

---

## 🛠 Prerequisites

Before setting up the project, ensure you have the following installed on your machine:

- **Node.js**: `v18.x` or higher
- **Yarn**: `v1.22.x` or higher
- **Ruby**: `v3.x` (managed via `rbenv` or `rvm`)
- **CocoaPods**: `bundle exec pod` (via Gemfile)
- **Xcode**: `v15.0+` (for iOS development)
- **Android Studio**: Android SDK target level `34`, NDK, and Java 11/17
- **git-crypt**: Required to decrypt sensitive project configuration files

To install `git-crypt`:
- **macOS (Homebrew):** `brew install git-crypt`
- **Linux (Debian/Ubuntu):** `sudo apt-get install git-crypt`

---

## 🔐 Repository Decryption (`git-crypt`)

Sensitive files in this repository (such as `src/constants/Sensitive/sensitiveData.tsx`) are encrypted using `git-crypt` for security.

### How to Unlock the Repository:
1. Obtain the secret key file (`my-secret-key`) provided separately by the development team.
2. Place `my-secret-key` in a secure location outside or inside the project root directory.
3. Open your terminal in the root of this project and run:

```bash
git-crypt unlock /path/to/my-secret-key
```

Once unlocked, `src/constants/Sensitive/sensitiveData.tsx` will be decrypted automatically into readable source code.

---

## ⚙️ Environment Configuration

The application supports three operational modes: **Development**, **Staging**, and **Production**.

Environments are configured in `config.tsx`:

```typescript
export const config: Config = {
  mode: Mode.PROD, // Options: Mode.DEV | Mode.STAGE | Mode.PROD
  ...
};
```

- **DEV**: Connects to the development API (`https://apidev.heal-app.com/api/v1`).
- **STAGE**: Connects to staging environments.
- **PROD**: Connects to the live production server (`https://api.heal-app.com/api/v1`).

---

## 🚀 Installation & Setup

1. **Clone the Repository:**
   ```bash
   git clone <repository-url>
   cd heal_rn_new
   ```

2. **Unlock Encrypted Files:**
   ```bash
   git-crypt unlock my-secret-key
   ```

3. **Install Dependencies:**
   ```bash
   yarn install
   ```

4. **Install iOS Native Dependencies:**
   ```bash
   cd ios
   bundle install
   bundle exec pod install
   cd ..
   ```

---

## 📱 Running the Application

### Start Metro Bundler:
```bash
yarn start
```

### Run on Android:
```bash
yarn android
```

### Run on iOS:
```bash
yarn ios
```

---

## 📦 Building for Production

### Android (APK & AAB Release)
1. Ensure `config.tsx` is set to `Mode.PROD`.
2. Generate the Android App Bundle (AAB):
   ```bash
   cd android
   ./gradlew bundleRelease
   ```
3. The generated bundle will be located at:
   `android/app/build/outputs/bundle/release/app-release.aab`

*Note: The Android release signing keystore (`release.keystore`) is located under `android/app/release.keystore`. Keystore alias and passwords are provided in the separate security handover document.*

### iOS (App Store Build)
1. Open `ios/Heal.xcworkspace` in Xcode.
2. Select your Target (`Heal`) and set the active scheme to **Any iOS Device (arm64)**.
3. Verify signing certificates and Provisioning Profiles in **Signing & Capabilities**.
4. Select **Product > Archive**.
5. Once archived, distribute to **App Store Connect / TestFlight**.

---

## 🔌 Third-Party Integrations

- **Superwall SDK**: Configures onboarding paywalls and triggers (`App.tsx`).
- **RevenueCat (`react-native-purchases`)**: Manages in-app subscriptions, entitlements, and offerings (`src/utils/purchasesService.ts`).
- **Firebase Messaging (FCM) & Notifee**: Handles push notifications (`android/app/google-services.json` and `ios/GoogleService-Info.plist`).
- **LogRocket**: Session replay and crash tracking in production (`App.tsx`).

---

## 🛡 Sensitive Credentials & Security Notice

For security reasons, live API keys, signing passwords, keystores, and dashboard admin credentials are **NOT** committed in cleartext to version control. 

All production credentials, APNs certificates, keystore passwords, and 3rd-party account logins are documented separately in the **Client Handover Credentials Document**.
