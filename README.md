## Installation

```
npm i

copy the env file and rename .env then update config values
```

## Run project

Local development:

```
npx expo start

```

Deploy:

```
# Build
npm run build

# Login
firebase login
firebase login --reauth

#Deploy Web
firebase deploy
firebase deploy --only hosting
```

Local Build:

```
# Build
npx expo export

# Test Build
npx http-server ./dist
```
