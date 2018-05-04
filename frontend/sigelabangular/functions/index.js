const functions = require('firebase-functions');

const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

const ref = admin.firestore();

exports.CreateUser = functions.auth.user().onCreate(event => {

  console.log("FUNCIONO");
    crearUsuario(event);

});


function crearUsuario(event){
  console.log(event);
  const uid = event.uid;
  console.log(event.uid);
    const displayName = event.metadata.displayName || "";
     console.log(event);
    const email = event.email;
    const newUser = ref.doc(`/user/${uid}`);

    const fecha = new Date();

    newUser.set({
        cfOrgId: "UK6cYXc1iYXCdSU30xmr",
        cfPers: "",
        appRoles: { IKLoR5biu1THaAMG4JOz: true },
        createdAt: fecha.toISOString(),
        email: email,
        updatedAt: "2018-04-17T21:41:31.027Z"
    }).then( exito => {
      console.log('EL USUARIO SE CREO CON EXITO', exito);
    }).catch(error => {
      console.log('SE GENERO UN ERROR AL INTENTAR CREAR USUARIO');
      crearUsuario(event);
    });
}



// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
