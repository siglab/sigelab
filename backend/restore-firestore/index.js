const fs = require('fs');



// credenciales de acceso de la primer base de datos generar desde google-cloud
const serviceAccount = require("./credentials2.json");

const firestoreService = require('firestore-export-import');


// service account credentials + firebase database url
firestoreService.initializeApp(serviceAccount, "https://paginaweb-a5fb7.firebaseio.com");



/* crea un backup completo de firestore en el archivo backup.json*/
const createdBackup = () => {
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


/* restaura un backup completo de firestore en el archivo backup.json*/
const restoreBackup = () => {

   firestoreService.restore('./backup.json');

}

/*  ejecutar la funcion restoreBackup o  createdBackup y luego correr la instruccion npm run start*/

createdBackup();
// createdBackup();