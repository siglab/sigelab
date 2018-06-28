const functions = require('firebase-functions');

const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

const ref = admin.firestore();

exports.CreateUser = functions.auth.user().onCreate(event => {


  ref.collection("cfPers").where("email", "==", event.email)
    .get()
    .then((querySnapshot) => {
      const personas = []

      // add data from the 5 most recent comments to the array
      querySnapshot.forEach(doc => {
        personas.push(doc.id)
      });

      if (personas.length > 0) {

        return personas[0];

      } else {

        return '';
      }


    }

    ).then((idp) => {


      const fecha = new Date();
      const uid = event.uid;
      const email = event.email;
      const newUser = ref.doc(`/user/${uid}`);
      const usr = {
        cfOrgId: "UK6cYXc1iYXCdSU30xmr",
        cfPers: idp,
        appRoles: { IKLoR5biu1THaAMG4JOz: true },
        createdAt: fecha.toISOString(),
        email: email,
      }


      return newUser.set(usr)

      //   return  console.log(' nuevo usuario para subir' , usr);


    }).catch(err => console.log('fallo la consulta', err));


});



// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
