const functions = require('firebase-functions');

const admin = require('firebase-admin');

const nodemailer = require('nodemailer');

const cors = require('cors')({ origin: true });

const mod = require('./conf');


admin.initializeApp(functions.config().firebase);

const ref = admin.firestore();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase!");
});


const mailTrasport = nodemailer.createTransport({

  service: 'Gmail',

  auth: {

    type: mod.CREDENTIALS.TYPE,

    user: mod.CREDENTIALS.AUTHUSER,

    clientId: mod.CREDENTIALS.AUTHTCLIENTID,

    clientSecret: mod.CREDENTIALS.AUTHTCLIENTESECRET,

    refreshToken: mod.CREDENTIALS.AUTHREFRESHTOKEN

  }

});


exports.CreateUser = functions.auth.user().onCreate(event => {


  return ref.collection("cfPers").where("email", "==", event.email)
    .get()
    .then((querySnapshot) => {
      // si la consulta retorna vacia se crea el usuario sin una persona asignada
      if (querySnapshot.empty) {

        const fecha = new Date();
        const role = 'npKRYaA0u9l4C43YSruA';

        const usr = {
          cfOrgId: "i9dzCErPCO4n9WUfjxR9",
          cfPers: '',
          appRoles: {},
          createdAt: fecha.toISOString(),
          email: event.email
        };

        usr.appRoles[role] = true;

      return  ref.doc(`/user/${event.uid}`).set(usr)
                 .then( () => console.log('se creo un nuevo usuario') )
                 .catch( err => console.log('ocurrio un error al crear el nuevo usuario', err));

        // si la consulta retorna un valor se asigna el usuario a la persona y viceversa

      } else {

        const personas = [];
        let role;
        const fecha = new Date();

        querySnapshot.forEach(doc => {

          role = doc.data().roleId;
          personas.push(doc.id);

        });

        const persona = personas[0];

        const usr = {
          cfOrgId: "i9dzCErPCO4n9WUfjxR9",
          cfPers: persona,
          appRoles: {},
          createdAt: fecha.toISOString(),
          email: event.email

        };

        usr.appRoles[role] = true;

        const pers = { user: event.uid };
        ref.doc(`cfPers/${usr.cfPers}`).set(pers, { merge: true })
           .then( () => console.log('se asocio correctamente el usuario'))
           .catch( err => console.log('no se pudo asociar correctamente el usuario', err));

       return  ref.doc(`/user/${event.uid}`).set(usr)
            .then( () => console.log('se asocio correctamente la persona'))
            .catch( err => console.log('no se pudo asociar correctamente la persona', err) );

      }
    }).catch(err => console.log('fallo la consulta', err));

});

let sendMail = (req, res) => {

  var mailsolicitante = {

    from: 'SIGELAB <francisco.hurtado@geoprocess.com.co>',

    bcc: `${req.para}`,

    subject: req.asunto,

    html: req.mensaje

  };

  return mailTrasport.sendMail(mailsolicitante).then(() => {

    if (res) {

      res.status(200).send("Exito al enviar Email desde Firebase Functions.");



    } else {

      console.log("exito al enviar correo");

      const fecha = new Date();

      const uid = event.uid;

      const email = event.email;





    }

  }).catch(error => {

    if (res) {

      res.status(200).send("Exito al enviar Email desde Firebase Functions.");



    } else {

      console.log("exito al enviar correo");

    }

  });



};





exports.enviarCorreo = functions.https.onRequest((req, res) => {

  //res.send('Inicia enviarCorreo');

  //res.status(200).send('Para: ' + req.body.para + ' Asunto: ' + req.body.asunto + ' Mensaje: ' + req.body.mensaje);

  // Enable CORS using the `cors` express middleware.

  cors(req, res, () => {



    sendMail(req.body, res);



  });

});











//FUNCION QUE BUSCA LA INFORMACION PARA QUIUV

exports.consultaQuiUv = functions.https.onRequest((req, res) => {



  cors(req, res, () => {

    quiv(req.body, res);

  });



});













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



      // add data from the 5 most recent comments to the array

      querySnapshot.forEach(doc => {

        data.push(doc.data())

      });



      if (res) {

        res.status(200).send(data);

        console.log('hecho');

      }



    });



};
