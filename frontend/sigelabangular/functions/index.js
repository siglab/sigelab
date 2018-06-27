const functions = require('firebase-functions');

const admin = require('firebase-admin');

 const nodemailer = require('nodemailer');

 const cors = require('cors')({origin: true});

admin.initializeApp(functions.config().firebase);

const ref = admin.firestore();

const mailTrasport = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
      type: 'OAuth2',
      user: 'francisco.hurtado@geoprocess.com.co',
      clientId: '731094417333-mf72n4qkv0kv3d4pedcsnhdbl9cad2rk.apps.googleusercontent.com',
      clientSecret: 'yYR_LE_rvRRHE2uuSGhYePVW',
      refreshToken: '1/G5iHoswJgCmZzGEySCk2aHXAeaXkcmIJrmWXYlbRmjs'
  }
});


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
      }
  }).catch(error => {
      if (res) {
          res.status(200).send("Exito al enviar Email desde Firebase Functions.");

      } else {
          console.log("exito al enviar correo");
      }
  });

}


exports.enviarCorreo = functions.https.onRequest((req, res) => {
  //res.send('Inicia enviarCorreo');
  //res.status(200).send('Para: ' + req.body.para + ' Asunto: ' + req.body.asunto + ' Mensaje: ' + req.body.mensaje);
  // Enable CORS using the `cors` express middleware.
  cors(req, res, () => {

      sendMail(req.body, res);

  });
});



// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
