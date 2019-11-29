// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebaseConfig : {
    apiKey: 'YOUR_FIREBASE_DEVELOPMENT_PROJECT_APIKEY',
    authDomain: 'YOUR_FIREBASE_DEVELOPMENT_AUTH_DOMAIN',
    databaseURL: 'YOUR_FIREBASE_DEVELOPMENT_DATABASE_URL',
    projectId: 'YOUR_FIREBASE_DEVELOPMENT_PROJECT_ID',
    storageBucket: 'YOUR_FIREBASE_DEVELOPMENT_STORAGE_BUCKED',
    messagingSenderId: 'YOUR_FIREBASE_DEVELOPMENT_MESSAGING_SENDER_ID',
    appId: 'YOUR_FIREBASE_DEVELOPMENT_APP_ID'
  }
};
