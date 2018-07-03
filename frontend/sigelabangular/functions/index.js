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
    };


    return newUser.set(usr)

    //   return  console.log(' nuevo usuario para subir' , usr);


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

  if(tabla == 'espacios'){
    consulta = 'space';
  } else if(tabla == 'servicios'){
    consulta = 'cfSrv';
  } else if(tabla == 'pruebas'){
    consulta = 'practice';
  } else if(tabla == 'proyectos'){
    consulta = 'project';
  }else if(tabla == 'personal'){
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




