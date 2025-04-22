# The Wall

## Project Overview

The Wall is a holy revolution platform built to provide a digital space where the LGBTQ+ community can find love, prayer, and hope. The application features two main components:

1. **Wailing Wall** - A place where users can post prayer requests and intentions
2. **Testimony Wall** - A collection of transformation stories that inspire and encourage

Built with Expo (React Native) for cross-platform compatibility, The Wall works on web, iOS, and Android from a single codebase.

## Tech Stack

- **Frontend**: React Native / Expo
- **Web**: React Native Web
- **Backend**: Firebase (Authentication, Firestore, Storage, Hosting)
- **Build Tools**: Expo CLI, Webpack
- **SEO**: Build-time HTML injection
- **Deployment**: Firebase Hosting

## Getting Started

### Prerequisites

- Node.js (v14 or newer)
- npm or yarn
- Firebase CLI (`npm install -g firebase-tools`)
- Expo CLI (`npm install -g expo-cli`)

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/your-username/thewall.git
   cd TheWall
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Set up environment variables:

   ```
   cp env .env
   ```

   Then open `.env` and update the Firebase configuration values:

   ```
   API_KEY=your_firebase_api_key
   AUTH_DOMAIN=your_firebase_auth_domain
   PROJECT_ID=your_firebase_project_id
   STORAGE_BUCKET=your_firebase_storage_bucket
   MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   APP_ID=your_firebase_app_id
   ```

## Development

### Running the App Locally

Start the development server:

```
npx expo start
```

This will open the Expo developer tools in your browser. From there, you can:

- Press `w` to open the web version
- Press `a` to open the Android version (requires Android simulator or device)
- Press `i` to open the iOS version (requires iOS simulator or Mac)
- Scan the QR code with the Expo Go app on your physical device

### Project Structure

- `/assets` - Images, fonts, and other static resources
- `/components` - Reusable UI components
- `/hooks` - Custom React hooks
- `/navigation` - Navigation configuration
- `/providers` - Context providers
- `/screens` - App screens/pages
- `/scripts` - Build and deployment scripts
- `/styles` - Global styles and theme
- `/utils` - Utility functions and Firebase helpers

### Key Features and Implementation

1. **Authentication** - Using Firebase Auth, implemented in `providers/AuthenticatedUserProvider.js`
2. **Database** - Firestore used for storing wall posts and testimonies
3. **Navigation** - React Navigation handles routing between screens
4. **File Uploads** - Firebase Storage for images and videos
5. **Responsive Design** - Works across web and mobile

## Deploy

```
# Build with SEO metadata
npm run build

# Build and deploy to Firebase in one step
npm run build:deploy

# Manual Firebase commands
firebase login
firebase login --reauth
firebase deploy
firebase deploy --only hosting
```

## Local Build Testing

```
# Build
npx expo export

# Test Build
npx http-server ./dist
```

## SEO Implementation

The app uses a build-time SEO injection strategy for optimal search engine and social media crawler compatibility:

- SEO metadata (title, description, Open Graph tags, Twitter Card tags) are injected directly into the HTML at build time
- All metadata is configurable in the `scripts/build.js` file
- No client-side JavaScript is required for metadata to be visible to crawlers and link preview services
- Configured to use `thewall.love` as the canonical domain

To modify SEO metadata:

1. Edit the `seoMetadata` object in `scripts/build.js`
2. Run `npm run build` to regenerate the HTML with updated SEO tags

```javascript
// Example SEO configuration (in scripts/build.js)
const seoMetadata = {
  title: "The Wall - A Holy Revolution for the LGBTQ+ Community",
  description:
    "The Wall is a holy revolution that provides a place to love, pray for, and evangelize the LGBTQ+ community through our Wailing Wall and Testimony Wall initiatives.",
  image: "https://thewall.love/assets/TheWall.png",
  url: "https://thewall.love",
};
```

## Common Issues & Troubleshooting

### Firebase Authentication Issues

If login/signup isn't working, verify your Firebase Auth configuration and that the service is enabled in your Firebase console.

### Image Upload Failures

Make sure Firebase Storage rules are properly configured to allow user uploads.

### Expo Build Errors

Try clearing the cache with:

```
expo r -c
```

### SEO Not Working

If SEO tags aren't being injected correctly:

1. Check that `web-build-template/index.html` exists
2. Make sure your Firebase hosting is correctly configured
3. Run a fresh build with `npm run build`

## Contributing

1. Create a feature branch
2. Make your changes
3. Submit a pull request

## License

This project is licensed under the terms of the license included in the LICENSE file.

## Contact

For any questions or support, please reach out to the project maintainers.
