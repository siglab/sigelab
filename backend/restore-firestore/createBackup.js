const fs = require('fs');
const firestoreService = require('firestore-export-import');
// Firebase project configureation and admin credentials
const config = require('./config');
const serviceAccount = require("./credentials.json");

firestoreService.initializeApp(serviceAccount, config.projectConfig.database);

/* Creates a new backup of the given project config. This overrides any backup.json file existent on the same folder.*/
const createBackup = () => {
    firestoreService
      .backups()
      .then(collections => {
        const file = JSON.stringify(collections);
        fs.appendFile( `backup.json`, file, function (err) {
          if (err) throw err;
          console.log('backup completo!');
        });
      });
}

createBackup();