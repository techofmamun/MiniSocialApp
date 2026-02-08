# Push Notifications Setup Guide

Push notifications are now implemented in TwitterX! Follow these steps to complete the setup.

## 📱 Frontend Setup

### 1. Get Your Expo Project ID

1. Go to [expo.dev](https://expo.dev)
2. Sign in or create an account
3. Create a new project or link existing: `npx eas init`
4. Copy your project ID from the Expo dashboard

### 2. Update app.json

Open `app.json` and replace `your-expo-project-id-here` with your actual Expo project ID:

```json
{
  "expo": {
    "extra": {
      "eas": {
        "projectId": "your-actual-project-id-here"
      }
    }
  }
}
```

### 3. Run on Physical Device

⚠️ **Important:** Push notifications don't work on simulators/emulators. You must test on a physical device.

```bash
npx expo start
# Scan QR code with Expo Go app on your phone
```

---

## 🔥 Backend Firebase Setup

### 1. Get Firebase Service Account Credentials

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (or create a new one)
3. Go to **Project Settings** → **Service Accounts**
4. Click **Generate New Private Key**
5. Save the downloaded JSON file

### 2. Update Backend .env

Open `/Users/mamun/Documents/TwitterX-Backend/.env` and add your Firebase credentials:

```bash
# Firebase Admin SDK (for FCM Push Notifications)
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
```

**Extract from the downloaded JSON:**

- `project_id` → `FIREBASE_PROJECT_ID`
- `private_key` → `FIREBASE_PRIVATE_KEY` (keep the quotes and newlines as `\n`)
- `client_email` → `FIREBASE_CLIENT_EMAIL`

### 3. Restart Backend

```bash
cd /Users/mamun/Documents/TwitterX-Backend
npm run dev
```

---

## ✅ Testing Push Notifications

### 1. Grant Permissions

When you open the app on a physical device, it will ask for notification permissions. **Allow** them.

### 2. Check Device Token Registration

Look at the console logs - you should see:

```
Expo Push Token: ExponentPushToken[xxxxxxxxxxxxxx]
Device token registered with backend
```

### 3. Trigger Notifications

**Like a Post:**

1. User A logs in and creates a post
2. User B logs in on another device and likes User A's post
3. User A should receive a notification: "User B liked your post"

**Comment on a Post:**

1. User A logs in and creates a post
2. User B logs in on another device and comments on User A's post
3. User A should receive a notification: "User B commented on your post"

### 4. Tap Notifications

When you tap a notification, it should navigate you directly to the post.

---

## 🎯 What's Implemented

✅ **Frontend:**

- Notification permission requests
- Device token registration with backend
- FCM integration via Expo
- Notification listeners (foreground + background)
- Deep linking to posts when tapping notifications

✅ **Backend:**

- Firebase Admin SDK integration
- Device token storage in MongoDB
- Automatic notifications sent on:
  - Post likes (unless liking own post)
  - Post comments (unless commenting on own post)
- Invalid token cleanup

---

## 🐛 Troubleshooting

### "Push notifications only work on physical devices"

- You're testing on a simulator/emulator
- **Solution:** Use a physical iPhone or Android device with Expo Go app

### "Expo project ID not configured"

- The project ID in `app.json` is still the placeholder
- **Solution:** Update it with your real Expo project ID

### "Firebase not initialized"

- Backend Firebase credentials are missing or invalid
- **Solution:** Double-check `.env` file has correct Firebase credentials

### Not receiving notifications

1. Check device has notification permissions enabled
2. Verify device token was registered (check backend logs)
3. Ensure Firebase credentials are correct
4. Make sure you're not liking/commenting on your own posts
5. Check that backend is running and reachable

### Notifications received but can't tap them

- This is normal in Expo Go during development
- For production, build a standalone app with `eas build`

---

## 📚 Additional Resources

- [Expo Push Notifications Guide](https://docs.expo.dev/push-notifications/overview/)
- [Firebase Cloud Messaging](https://firebase.google.com/docs/cloud-messaging)
- [Expo Application Services (EAS)](https://docs.expo.dev/eas/)

---

## 🚀 Production Deployment

For production apps, you'll need to:

1. Build standalone apps:

   ```bash
   npx eas build --platform android
   npx eas build --platform ios
   ```

2. Submit to app stores:

   ```bash
   npx eas submit --platform android
   npx eas submit --platform ios
   ```

3. Configure FCM for Android (APNs for iOS) by following Expo's guides

---

## 🎉 Done!

Your push notifications are fully set up! Users will now receive real-time notifications when:

- Someone likes their post
- Someone comments on their post

The notifications will navigate them directly to the relevant post when tapped.
