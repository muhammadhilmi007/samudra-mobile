# Samudra ERP Mobile App - Installation Guide

This document provides detailed instructions for setting up the development environment, building, and deploying the Samudra ERP Mobile Application.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14.x or newer) - [Download](https://nodejs.org/)
- **npm** (v6.x or newer) or **Yarn** (v1.22.x or newer)
- **Git** - [Download](https://git-scm.com/downloads)
- **Expo CLI** - Install using npm: `npm install -g expo-cli`
- **Android Studio** (for Android development) - [Download](https://developer.android.com/studio)
- **Xcode** (for iOS development, macOS only) - Available on Mac App Store
- **Visual Studio Code** (recommended editor) - [Download](https://code.visualstudio.com/)

## Getting Started

Follow these steps to set up and run the Samudra ERP Mobile App:

### 1. Clone the Repository

```bash
git clone https://github.com/your-organization/samudra-mobile.git
cd samudra-mobile
```

### 2. Install Dependencies

Using npm:
```bash
npm install
```

Or, using Yarn:
```bash
yarn install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory with the following variables:

```
API_URL=https://api.samudrapaket.com/api
# For local development use:
# API_URL=http://localhost:5000/api
```

### 4. Start the Development Server

```bash
expo start
```

This will start the Metro bundler and open the Expo DevTools in your browser.

### 5. Run on a Device or Emulator

#### Android

To run on an Android emulator:
1. Open Android Studio
2. Open AVD Manager and start an emulator
3. In Expo DevTools, click "Run on Android device/emulator"

To run on a physical Android device:
1. Install the Expo Go app from the Google Play Store
2. Scan the QR code shown in Expo DevTools with the Expo Go app

#### iOS (macOS only)

To run on an iOS simulator:
1. Open Xcode
2. In Expo DevTools, click "Run on iOS simulator"

To run on a physical iOS device:
1. Install the Expo Go app from the App Store
2. Scan the QR code shown in Expo DevTools with the Camera app

## Project Structure

The Samudra ERP Mobile App follows this structure:

```
samudra-mobile/
├── App.tsx                  # Root component
├── app.json                 # Expo configuration
├── assets/                  # Static assets
├── src/
│   ├── api/                 # API services
│   ├── components/          # Reusable components
│   ├── constants/           # App constants
│   ├── hooks/               # Custom React hooks
│   ├── navigation/          # Navigation configuration
│   ├── screens/             # Screen components
│   ├── services/            # Business logic services
│   ├── store/               # Redux store configuration
│   ├── types/               # TypeScript type definitions
│   └── utils/               # Utility functions
└── .gitignore               # Git ignore configuration
```

## Configuring for Production

When preparing for production, follow these steps:

### 1. Update app.json

Edit the `app.json` file to include correct production values:

```json
{
  "expo": {
    "name": "Samudra ERP",
    "slug": "samudra-erp",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#1565C0"
    },
    "updates": {
      "fallbackToCacheTimeout": 0
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.samudrapaket.erp"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#1565C0"
      },
      "package": "com.samudrapaket.erp",
      "permissions": [
        "CAMERA",
        "ACCESS_FINE_LOCATION"
      ]
    },
    "web": {
      "favicon": "./assets/favicon.png"
    }
  }
}
```

### 2. Configure Environment

Create a `.env.production` file with production variables:

```
API_URL=https://api.samudrapaket.com/api
```

### 3. Build for Production

#### Android

To build an Android App Bundle (AAB):

```bash
expo build:android -t app-bundle
```

Or to build an APK:

```bash
expo build:android -t apk
```

#### iOS

To build an iOS IPA:

```bash
expo build:ios
```

## Common Issues and Troubleshooting

### Network Issues

If experiencing network issues:
- Check if your API URL is correctly configured
- Verify internet connectivity
- Check if backend services are running

### Build Issues

If encountering build problems:
- Clean the cache: `expo r -c`
- Delete node_modules and reinstall: `rm -rf node_modules && npm install`
- Update Expo CLI: `npm install -g expo-cli`

### Barcode Scanner Issues

If the barcode scanner isn't working:
- Ensure camera permissions are granted
- Check for the correct imports and implementation
- Verify that the device has a compatible camera

### Location Tracking Issues

If location tracking isn't working:
- Ensure location permissions are granted
- Check location services are enabled on the device
- Make sure you're using the correct Expo location API

## Development Workflow

### Code Updates

1. Make code changes
2. Test on development server using `expo start`
3. Commit changes to Git repository
4. Pull latest changes from the repository
5. Resolve any conflicts
6. Push changes to remote repository

### Version Updates

When updating the app version:

1. Update version in `app.json` and `package.json`
2. Document changes in `CHANGELOG.md`
3. Tag the version in Git: `git tag v1.0.x`
4. Push the tag: `git push --tags`

## Support

For technical support or questions:
- Email: dev@samudrapaket.com
- Internal issue tracker: https://tracker.samudrapaket.com

## Security Considerations

- Never commit sensitive data (e.g., API keys, credentials) to the repository
- Use environment variables for sensitive configuration
- Ensure proper authentication and authorization
- Validate user input to prevent security vulnerabilities
- Keep dependencies updated to avoid security issues

## Additional Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/introduction/getting-started)
- [React Navigation Documentation](https://reactnavigation.org/docs/getting-started)