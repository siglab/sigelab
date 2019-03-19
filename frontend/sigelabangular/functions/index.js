const functions = require('firebase-functions');

const admin = require('firebase-admin');

const nodemailer = require('nodemailer');

const cors = require('cors')({
  origin: true
});

const mod = require('./conf');


admin.initializeApp(functions.config().firebase);

const ref = admin.firestore();

ref.settings({ timestampsInSnapshots: true });


// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((req, res) => {
//   cors(req, res, () => {

//     // verifica si el usuario existe como persona
//     ref.collection("cfPers").where("email", "==", req.email)
//       .get()
//       .then((querySnapshot) => {

//         if (querySnapshot.empty) {

//           const fecha = new Date();
//           const role = 'npKRYaA0u9l4C43YSruA';

//           const usr = {
//             cfOrgId: "i9dzCErPCO4n9WUfjxR9",
//             cfPers: '',
//             appRoles: {},
//             createdAt: fecha.toISOString(),
//             email: req.email,
//             active: true
//           };

//           usr.appRoles[role] = true;

//           ref.doc(`/user/${event.uid}`).set(usr)
//             .then(() => {

//               console.log('se creo un nuevo usuario');

//               res.status(200).send({
//                 response: 'Usuario creado con exito!'
//               });

//             })
//             .catch(err => {

//               res.status(500).send({
//                 response: 'ocurrio un error al crear el nuevo usuario'
//               });
//               console.log('ocurrio un error al crear el nuevo usuario', err)

//             });

//           // si la consulta retorna un valor se asigna el usuario a la persona y viceversa

//         } else {

//           const personas = [];
//           let role;
//           const fecha = new Date();

//           querySnapshot.forEach(doc => {

//             personas.push(doc.id);

//           });

//           const persona = personas[0];

//           const usr = {
//             cfOrgId: "i9dzCErPCO4n9WUfjxR9",
//             cfPers: persona,
//             appRoles: {
//               npKRYaA0u9l4C43YSruA : true
//             },
//             createdAt: fecha.toISOString(),
//             email: event.email,
//             active: true

//           };



//           const pers = {
//             user: event.uid,

//           };

//           ref.doc(`cfPers/${usr.cfPers}`).set(pers, {
//             merge: true
//           })
//             .then(() => {
//               console.log('se asocio correctamente el usuario')
//               res.status(200).send({
//                 response: 'Se asocio correctamente el usuario!'
//               });
//             })
//             .catch(err => console.log('no se pudo asociar correctamente el usuario', err));

//           return ref.doc(`/user/${event.uid}`).set(usr)
//             .then(() => console.log('se asocio correctamente la persona'))
//             .catch(err => console.log('no se pudo asociar correctamente la persona', err));


//         }

//       });




//     res.status(200).send(req.body);

//   });
// });


const gmailEmail = encodeURIComponent(functions.config().gmail.email);
const gmailPassword = encodeURIComponent(functions.config().gmail.password);

const mailTrasport = nodemailer.createTransport(`smtps://${gmailEmail}:${gmailPassword}@smtp.gmail.com`);


// exports.CreateUser = functions.auth.user().onCreate(event => {

//   console.log('evento de auth', event);
//   return ref.collection("cfPers").where("email", "==", event.email)
//     .get()
//     .then((querySnapshot) => {
//       // si la consulta retorna vacia se crea el usuario sin una persona asignada
//       if (querySnapshot.empty) {

//         const fecha = new Date();


//         const usr = {
//           cfOrgId: "i9dzCErPCO4n9WUfjxR9",
//           active:  true,
//           cfPers: '',
//           appRoles: {
//             npKRYaA0u9l4C43YSruA : true
//           },
//           createdAt: fecha.toISOString(),
//           email: event.email,
//           active:true
//         };


//         return ref.doc(`/user/${event.uid}`).set(usr)
//           .then(() => console.log('se creo un nuevo usuario'))
//           .catch(err => console.log('ocurrio un error al crear el nuevo usuario', err));

//         // si la consulta retorna un valor se asigna el usuario a la persona y viceversa

//       } else {

//         let persona;
//         let role;
//         const fecha = new Date();
//         let personaid = '';

//         querySnapshot.forEach(doc => {

//           persona = doc.data();
//           personaid = doc.id;

//         });


//         const usr = {
//           cfOrgId: "i9dzCErPCO4n9WUfjxR9",
//           cfPers: personaid,
//           appRoles: {
//             npKRYaA0u9l4C43YSruA : true
//           },
//           createdAt: fecha.toISOString(),
//           email: event.email,
//           active:true
//         };

//         // para el nivel 3 es necesario pasar el campo tipo string a un objeto

//         const pers = {
//           user: event.uid
//         };


//         if(persona.nouser){
//           usr.appRoles = persona.appRoles;
//         }

//         ref.doc(`cfPers/${usr.cfPers}`).set(pers, {
//           merge: true
//         })
//           .then(() => console.log('se asocio correctamente el usuario'))
//           .catch(err => console.log('no se pudo asociar correctamente el usuario', err));

//         return ref.doc(`/user/${event.uid}`).set(usr)
//           .then(() => console.log('se asocio correctamente la persona'))
//           .catch(err => console.log('no se pudo asociar correctamente la persona', err));

//       }
//     }).catch(err => console.log('fallo la consulta', err));

// });



const createUser = (req, res) => {

  const fecha = new Date();
  const usr = {
  cfOrgId: "i9dzCErPCO4n9WUfjxR9",
  active:  true,
  cfPers: '',
  appRoles: {
  npKRYaA0u9l4C43YSruA : true
   },
  createdAt: fecha.toISOString(),
  email: req.email,
   };

   console.log('datos auth', req);
   return ref.collection("cfPers").where("email", "==", req.email)
    .get()
    .then((querySnapshot) => {
      // si la consulta retorna vacia se crea el usuario sin una persona asignada
       if (querySnapshot.empty) {

        return ref.doc(`/user/${req.uid}`).set(usr)
         .then(() => {

          console.log('se creo un nuevo usuario');
          return res.status(200).send({ msj: "exito creando el usuario."});

        }).catch(err => console.log('ocurrio un error al crear el nuevo usuario', err));

       // si la consulta retorna un valor se asigna el usuario a la persona y viceversa

      } else {

      const persona = querySnapshot.docs[0].data();
       // asigna la persona al usario
       usr.cfPers = querySnapshot.docs[0].id;

       // asigna los roles almacenados en la persona al nodo usuario
        if(persona.nouser){
          usr.appRoles = persona.appRoles;
       }
      return  ref.doc(`cfPers/${usr.cfPers}`).set({user: req.uid}, { merge: true })
        .then(() => {

           console.log('se asocio correctamente el usuario');
           return ref.doc(`/user/${req.uid}`).set(usr)
                   .then(() =>{ console.log('se asocio correctamente la persona');

               return res.status(200).send({ msj: "exito creando el usuario"});

            }).catch(err => console.log('no se pudo asociar correctamente la persona', err));

         }).catch(err => console.log('no se pudo asociar correctamente el usuario', err));


      }
     }).catch(err => console.log('fallo la consulta', err));
};





let sendMail = (req, res) => {

  var mailsolicitante = {

    from: 'SIGELAB <noREply>',

    bcc: `${req.para}`,

    subject: req.asunto,

    html: req.mensaje

  };

  return mailTrasport.sendMail(mailsolicitante).then(() => {

    if (res) {

      res.status(200).send("Exito al enviar Email desde Firebase Functions.");


    }

  }).catch(error => {

    if (res) {

      res.status(500).send("Exito al enviar Email desde Firebase Functions.");



    }

  });



};





exports.enviarCorreo = functions.https.onRequest((req, res) => {

  cors(req, res, () => {
    sendMail(req.body, res);
  });

});



exports.disabledUser = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    userDisabled(req.body, res);

  });

});


exports.createUser = functions.https.onRequest((req, res) => {

  cors(req, res, () => {
    createUser(req.body, res);

  });

});








//FUNCION QUE BUSCA LA INFORMACION PARA QUIUV

exports.consultaQuiUv = functions.https.onRequest((req, res) => {



  cors(req, res, () => {

    quiv(req.body, res);

  });



});



//FUNCION QUE BUSCA LA INFORMACION PARA QUIUV POR ID

exports.consultaQuiUvId = functions.https.onRequest((req, res) => {



  cors(req, res, () => {

    quivId(req.body, res);

  });



});




 let userDisabled = ( req, res ) => {


  admin.auth().deleteUser( req.id ).then(() => {

    console.log("Successfully deleted user");
    res.status(200).send( {resp : ' Usuario eliminado con exito!' } )
  })
  .catch((error) => {
    console.log("Error deleting user:", error);
    res.status(500).send( {resp : ' Ocurrio un error eliminando el usuario' } )

  });

 }




let quiv = (req, res) => {


  var tabla = req.tabla;

  let consulta = '';

  if (tabla == 'espacios') {

    consulta = 'space';

  } else if (tabla == 'servicios') {

    consulta = 'cfSrv';

  } else if (tabla == 'pruebas') {

    consulta = 'practice';

  } else if (tabla == 'proyectos') {

    consulta = 'project';

  } else if (tabla == 'personal') {

    consulta = 'cfPers';

  }



  ref.collection(consulta)

    .get()
    .then((querySnapshot) => {

      const data = []

      if (querySnapshot.empty) {

        res.status(404).send({ resp: 'La coleccion no existe' });

      }

      // add data from the 5 most recent comments to the array

      querySnapshot.forEach(doc => {

        data.push(doc.data())

      });

      if (res) {

        res.status(200).send(data);

        console.log('hecho');

      } else {

        res.status(500).send({ error: 'ocurrio un error' });
      }



    });



};


let quivId = (req, res) => {

  var tabla = req.tabla;
  var id = req.id;

  console.log('id de la consulta', id);
  let consulta = '';



  if (tabla == 'espacios') {

    consulta = 'space';

  } else if (tabla == 'servicios') {

    consulta = 'cfSrv';

  } else if (tabla == 'pruebas') {

    consulta = 'practice';

  } else if (tabla == 'proyectos') {

    consulta = 'project';

  } else if (tabla == 'personal') {

    consulta = 'cfPers';

  }

  ref.doc(`/${consulta}/${id}`)
    .get()
    .then((consulta) => {


      if (!consulta.exists) {

        res.status(404).send({ resp: 'El id no existe' });
      }


      if (consulta.exists) {

        res.status(200).send(consulta.data());

        console.log('hecho');

      } else {
        res.status(500).send({ resp: 'Ocurrio un error inesperado' });

      }



    });



};



exports.disablePractices = functions.https.onRequest((req, res) => {
  var token = req.get('x-token');
  if (token == '123456789') {
    ref.collection('practice')
      .get()
      .then((querySnapshot) => {
        const data = {}

        querySnapshot.forEach(doc => {
          data[doc.id] = doc.data();
        });
        return data;

      }).then((data) => {

        var promisePractices = new Promise((resolve, reject) => {
          var datalength = Object.keys(data).length;
          var cont = 0;

          for (const key in data) {
            if (data.hasOwnProperty(key)) {
              var datalab = data[key];
              ref.doc(`practice/${key}/`)
                .update({ active: false })
                .then(function (done) {

                  cont++;
                  // console.log(datalength,cont);

                  if (cont == datalength) {
                    resolve();
                  }

                }).catch(error => {
                  // console.log(datalength,cont)

                  reject(error);
                });

            }
          }
        })

        var promisecfFacil = new Promise((resolve, reject) => {

          var datalength = Object.keys(data).length;
          var cont = 0;

          for (const key in data) {
            if (data.hasOwnProperty(key)) {
              var datalab = data[key];
              var pathPractice = `cfFacil/${datalab.cfFacil}/`;

              var practica = {
                relatedPractices: {}
              };
              practica.relatedPractices[key] = false;


              ref.doc(pathPractice)
                .set(practica, { merge: true })
                .then(function (done) {

                  cont++;
                  // console.log(datalength,cont);

                  if (cont == datalength) {
                    resolve();
                  }

                }).catch(error => {
                  // console.log(datalength,cont)

                  reject(error);
                });
            }
          }
        })
        return Promise.all([promisePractices, promisecfFacil]).then((data) => {
          console.log('success')
        }).catch(error => {
          return error;
        });

      })
      .then((data) => {
        res.send('success');

      }).catch(error => {
        res.send(error);
      });

  } else {
    res.send('not authorized');

  }

});


exports.activePractices = functions.https.onRequest((req, res) => {
  var token = req.get('x-token');
  if (token == '123456789') {
    ref.collection('practice')
      .get()
      .then((querySnapshot) => {
        const data = {}

        querySnapshot.forEach(doc => {
          data[doc.id] = doc.data();
        });
        return data;

      }).then((data) => {

        var promisePractices = new Promise((resolve, reject) => {
          var datalength = Object.keys(data).length;
          var cont = 0;

          for (const key in data) {
            if (data.hasOwnProperty(key)) {
              var datalab = data[key];
              ref.doc(`practice/${key}/`)
                .update({ active: true })
                .then(function (done) {

                  cont++;
                  // console.log(datalength,cont);

                  if (cont == datalength) {
                    resolve();
                  }

                }).catch(error => {
                  // console.log(datalength,cont)

                  reject(error);
                });

            }
          }
        })

        var promisecfFacil = new Promise((resolve, reject) => {

          var datalength = Object.keys(data).length;
          var cont = 0;

          for (const key in data) {
            if (data.hasOwnProperty(key)) {
              var datalab = data[key];
              var pathPractice = `cfFacil/${datalab.cfFacil}/`;

              var practica = {
                relatedPractices: {}
              };
              practica.relatedPractices[key] = true;


              ref.doc(pathPractice)
                .set(practica, { merge: true })
                .then(function (done) {

                  cont++;
                  // console.log(datalength,cont);

                  if (cont == datalength) {
                    resolve();
                  }

                }).catch(error => {
                  // console.log(datalength,cont)

                  reject(error);
                });
            }
          }
        })
        return Promise.all([promisePractices, promisecfFacil]).then((data) => {
          console.log('success')
        }).catch(error => {
          return error;
        });

      })
      .then((data) => {
        res.send('success');

      }).catch(error => {
        res.send(error);
      });
  } else {
    res.send('not authorized');

  }

});

exports.dbonUpdate = functions.firestore
  .document('cfFacil/{labId}').onUpdate((change, context) => {

    const newValue = change.after.data();

    // ...or the previous value before this update
    const previousValue = change.before.data();


    // access a particular field as you would any JS property
    const authVar = context.params; // Auth information for the user.
    // const authType = context.authType; // Permissions level for the user.
    const contexto = context;
    const pathId = context.params.labId; // The ID in the Path.
    const eventId = context.eventId; // A unique event ID.
    const timestamp = context.timestamp; // The timestamp at which the event happened.
    const eventType = context.eventType; // The type of the event that triggered this function.
    const resource = context.resource; // The resource which triggered the event.
    console.log('pathId', pathId, 'newValue*:', newValue, 'previousValue*:', previousValue);
    return ref.collection(`logs`)
      .add({
        currentVer: newValue,
        previousVer: previousValue,
        context: context
      });
    // ...
  });
