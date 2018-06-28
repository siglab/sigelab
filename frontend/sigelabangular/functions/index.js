const functions = require('firebase-functions');

const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

const ref = admin.firestore();

exports.CreateUser = functions.auth.user().onCreate(event => {

  console.log("FUNCIONO");
    crearUsuario(event);
    getPerson( event.email)

});



function crearUsuario(event){

  const fecha = new Date();
  console.log(event);
  const uid = event.uid;
  console.log(event.uid);
    const displayName = event.metadata.displayName || "";
     console.log(event);
    const email = event.email;
    const newUser = ref.doc(`/user/${uid}`);
    const usr = {
      cfOrgId: "UK6cYXc1iYXCdSU30xmr",
      cfPers: "",
      appRoles: { IKLoR5biu1THaAMG4JOz: true },
      createdAt: fecha.toISOString(),
      email: email,
      updatedAt: "2018-04-17T21:41:31.027Z"
  }



    newUser.set(usr).then( exito => {
     console.log('EL USUARIO SE CREO CON EXITO', exito);
    }).catch(error => {
      console.log('SE GENERO UN ERROR AL INTENTAR CREAR USUARIO');
      crearUsuario(event);
    });
}



/* function getPerson(email) {
  return new Promise((resolve, reject) => {


    console.log('llego este email' , email);

    const personRef = ref.collection('cfPers');

    const query = personRef.where('email' === email);

    const uns= query.onSnapshot((ok) => {

      console.log('consol de la consulta', ok);
    const resp = ok[0].doc.id;
      console.log(ok[0].doc.id);
      resolve(resp);

    }, err => {

      console.log('no existe', err)

    });
    uns();
  });

} */

function getPerson(email) {


   ref.collection("cfPers").where("email", "==", email)
     .get()
     .then( (querySnapshot) => {

    return    console.log(object);

    }

  ).catch( err => console.log('fallo la consulta', err)  );

    uns ();



}

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
