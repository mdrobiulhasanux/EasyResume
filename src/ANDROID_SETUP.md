# Android App Setup Guide

## Prerequisites

1. **Install Android Studio**
   - Download from [developer.android.com](https://developer.android.com/studio)
   - Install Android SDK and emulator

2. **Install Capacitor CLI**
   ```bash
   npm install -g @capacitor/cli
   ```

3. **Install Java Development Kit (JDK) 11 or higher**

## Setup Steps

### 1. Initialize Capacitor
```bash
# Install dependencies
npm install

# Build the web app
npm run build

# Add Android platform
npx cap add android

# Sync files to native project
npx cap sync
```

### 2. Configure Android App
```bash
# Open Android Studio
npx cap open android
```

### 3. Update App Information
Edit `android/app/src/main/AndroidManifest.xml`:
- Change package name
- Add permissions
- Configure app settings

### 4. App Icons and Splash Screen
- Place app icons in `android/app/src/main/res/mipmap-*/`
- Update splash screen in `android/app/src/main/res/drawable/`

### 5. Build Commands

**Development Build:**
```bash
npm run build:mobile  # Build web app and sync
npx cap run android   # Run on device/emulator
```

**Production Build:**
```bash
# Build optimized web app
npm run build

# Sync to native project
npx cap sync

# Open Android Studio for signing and release
npx cap open android
```

### 6. Google Play Store Release

1. **Generate Signed APK/Bundle:**
   - In Android Studio: Build → Generate Signed Bundle/APK
   - Create keystore for signing
   - Build release bundle (.aab file)

2. **Upload to Google Play Console:**
   - Create developer account ($25 one-time fee)
   - Upload .aab file
   - Complete store listing
   - Submit for review

## App Permissions

Add to `android/app/src/main/AndroidManifest.xml`:
```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
```

## Testing

1. **Emulator Testing:**
   ```bash
   npx cap run android
   ```

2. **Physical Device:**
   - Enable Developer Options
   - Enable USB Debugging
   - Connect device
   ```bash
   npx cap run android --target=device-id
   ```

## Troubleshooting

- **Build Issues:** Clean and rebuild project
- **Sync Issues:** Run `npx cap sync` after web changes
- **Permission Errors:** Check AndroidManifest.xml permissions
- **Network Issues:** Ensure HTTPS in production

## Auto-Updates

Your web content will auto-update when users have internet connection. Native changes require app store updates.