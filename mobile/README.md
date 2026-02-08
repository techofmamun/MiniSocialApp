# TwitterX

A minimalist social feed app built with React Native (Expo) and Node.js.

## 📱 Screens & Features

### 🔐 Authentication

- **Secure Access:** Register and Login with email/password.
- **Session Management:** Persistent login state using JWT and secure storage.
- **Profile:** View user details and sign out securely.

### 🏠 Home Feed

- **Timeline:** Infinite scrolling list of posts.
- **Search:** Filter posts by specific usernames in real-time.
- **Interactions:**
  - **Like:** Instant optimistic updates when liking posts.
  - **Pull-to-Refresh:** Update the feed with the latest content.

### ✍️ Creation & details

- **Compose:** Create posts with a 280-character limit and real-time validation.
- **Thread View:** Tap any post to view full details and the comment list.
- **Comments:** Post comments on post details.
- **Management:** Users can delete their own posts.

### 🔔 Notifications

- **Real-time Alerts:** Native push notifications for engagement.
- **Triggers:**
  - Receive an alert when someone **likes** your post.
  - Receive an alert when someone **comments** on your post.

## 🚀 Quick Start (Development Build)

This app uses native code for push notifications. Use the development build instead of Expo Go.

> **⚠️ Important Check:** Push notifications require a physical device.
>
> - ✅ **Working:** Physical Android Device (Development Build or APK)
> - ❌ **Not Working:** Android Emulator (FCM limitations)

1. **Install Dependencies:**

   ```bash
   npm install
   ```

2. **Setup Backend:**
   Update `src/config/api.ts` with your local IP:

   ````ts
   BASE_URL: "http://YOUR_LOCAL_IP:3000/api";
   ```:**
   Connect a physical device via USB for the best experience.

   or keep the default prod URL.

   ````

3. **Run on Android:**
   Connect a physical device via USB for the best experience.

   ```bash
   npx expo run:android
   ```

   **OR:** Install the APK directly on your device (`android/app/build/outputs/apk/debug/app-debug.apk`).

4. **Start Bundler:**
   ```bash
   npx expo start --dev-client
   ```

## 🛠 Tech Stack

- **Framework:** React Native + Expo (SDK 54)
- **Routing:** Expo Router
- **State:** TanStack Query + Zustand
- **UI:** React Native Paper
