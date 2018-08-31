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

    user: mod.CREDENTIALS.AUTHUSER ,

    clientId: mod.CREDENTIALS.AUTHTCLIENTID,

    clientSecret: mod.CREDENTIALS.AUTHTCLIENTESECRET,

    refreshToken: mod.CREDENTIALS.AUTHREFRESHTOKEN

  }

});


exports.CreateUser = functions.auth.user().onCreate(event => {



  ref.collection("cfPers").where("email", "==", event.email)

    .get()

    .then((querySnapshot) => {

      if (querySnapshot.empty) {

        const persona = '';

        const role = 'npKRYaA0u9l4C43YSruA';

        return { persona, role };

      } else {

        const personas = [];
        let role;


        // add data from the 5 most recent comments to the array

        querySnapshot.forEach(doc => {

          role = doc.data().roleId;
          personas.push(doc.id);

        });



         const persona = personas[0];


          return {persona , role };







      }





    }



    ).then((result) => {





      const fecha = new Date();

      const email = event.email;



      const usr = {

        cfOrgId: "i9dzCErPCO4n9WUfjxR9",

        cfPers: result.persona,

        appRoles: {},

        createdAt: fecha.toISOString(),

        email: email

      };

      usr.appRoles[result.role] = true;

      return usr;


      // return console.log(' nuevo usuario para subir' , usr);



    }).then((usr) => {



      if (usr.cfPers) {



        const pers = { user: event.uid };

        ref.doc(`cfPers/${usr.cfPers}`).set(pers, { merge: true });

        return ref.doc(`/user/${event.uid}`).set(usr)

      } else {

        return ref.doc(`/user/${event.uid}`).set(usr)

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
