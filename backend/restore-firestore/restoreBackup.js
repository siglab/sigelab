const fs = require('fs');
const firestoreService = require('firestore-export-import');
// Firebase project configureation and admin credentials
const config = require('./config');
const serviceAccount = require("./credentials.json");

firestoreService.initializeApp(serviceAccount, config.projectConfig.database);

/* Restores an existing backup.json on the same folder into the given firebase project config.*/
const restoreBackup = () => {
  firestoreService.restore('./backup.json');
}

restoreBackup();