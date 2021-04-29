/**
 * Created by: Geoprocess S.A.S
 * Created on: Unknown
 * Last modification by: Julian Rodríguez
 * Description: Firebase cloud functions index file.
 */

// Variable initialization
"use strict";
global.functions = require("firebase-functions");
global.admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);
global.ref = admin.firestore();
ref.settings({ timestampsInSnapshots: true });
const nodemailer = require("nodemailer");

// CORS configuration for api points response only for whitelisted domains.
const whitelist = [
  "http://localhost:4200",
  "https://sigelab.univalle.edu.co",
  "https://siglab-2bdb6.web.app",
  "https://siglab-2bdb6.firebaseapp.com",
  "https://demosigelab.univalle.edu.co",
  "https://sigelab-univalle.web.app",
  "https://sigelab-univalle.firebaseapp.com",
  "https://cron-job.org/",
];
let corsOptions = {
  origin: function (origin, callback) {
    console.log("Request received from: ", origin);
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};
global.cors = require("cors")(corsOptions);
// let cors = require("cors")({
//   origin: true,
// });

// Email configuration
// Configure the email transport using the default SMTP transport and a GMail account.
// For Gmail, enable these:
// 1. https://www.google.com/settings/security/lesssecureapps
// 2. https://accounts.google.com/DisplayUnlockCaptcha
// For other types of transports such as Sendgrid see https://nodemailer.com/transports/
// TODO: Configure the `gmail.email` and `gmail.password` Google Cloud environment variables executing at your firebase project folder the command "firebase functions:config:set gmail.email="youremailhere@gmail.com" gmail.password="your password here"".
global.gmailEmail = encodeURIComponent(functions.config().gmail.email);
global.gmailPassword = encodeURIComponent(functions.config().gmail.password);
global.mailTrasport = nodemailer.createTransport(
  `smtps://${gmailEmail}:${gmailPassword}@smtp.gmail.com`
);

// SigeLAB specific modules load
const administrativeTracking = require("./modules/administrativeTracking.js");
const systemInteroperability = require("./modules/systemInteroperability.js");

const createUser = (req, res) => {
  const fecha = new Date();
  const usr = {
    cfOrgId: "i9dzCErPCO4n9WUfjxR9",
    active: true,
    cfPers: "",
    appRoles: {
      npKRYaA0u9l4C43YSruA: true,
    },
    createdAt: fecha.toISOString(),
    email: req.email,
  };
  console.log("params", req.email, req.uid);
  console.log("datos auth", req);
  return ref
    .collection("cfPers")
    .where("email", "==", req.email)
    .get()
    .then((querySnapshot) => {
      // si la consulta retorna vacia se crea el usuario sin una persona asignada
      if (querySnapshot.empty) {
        return ref
          .doc(`/user/${req.uid}`)
          .set(usr)
          .then(() => {
            console.log("se creo un nuevo usuario");
            pushCacheUsuario(
              usr.active,
              "",
              usr.appRoles,
              usr.email,
              "",
              req.uid,
              usr.createdAt
            );
            return res.status(200).send({ msj: "exito creando el usuario." });
          })
          .catch((err) =>
            console.log("ocurrio un error al crear el nuevo usuario", err)
          );
        // si la consulta retorna un valor se asigna el usuario a la persona y viceversa
      } else {
        const persona = querySnapshot.docs[0].data();
        // asigna la persona al usario
        usr.cfPers = querySnapshot.docs[0].id;
        // asigna los roles almacenados en la persona al nodo usuario
        if (persona.nouser) {
          usr.appRoles = persona.appRoles;
        }
        return ref
          .doc(`cfPers/${usr.cfPers}`)
          .set({ user: req.uid }, { merge: true })
          .then(() => {
            console.log("se asocio correctamente el usuario");
            return ref
              .doc(`/user/${req.uid}`)
              .set(usr)
              .then(() => {
                pushCacheUsuario(
                  usr.active,
                  persona.cfFamilyNames,
                  usr.appRoles,
                  usr.email,
                  persona.cfFirstNames,
                  req.uid,
                  usr.createdAt
                );
                console.log("se asocio correctamente la persona");
                return res
                  .status(200)
                  .send({ msj: "exito creando el usuario" });
              })
              .catch((err) =>
                console.log("no se pudo asociar correctamente la persona", err)
              );
          })
          .catch((err) =>
            console.log("no se pudo asociar correctamente el usuario", err)
          );
      }
    })
    .catch((err) => console.log("fallo la consulta", err));
};

let pushCacheUsuario = (
  active,
  apellido,
  appRoles,
  email,
  nombre,
  uid,
  updatedAt
) => {
  const usuario = { active, apellido, appRoles, email, nombre, uid, updatedAt };
  const newusuario = {};
  newusuario[uid] = usuario;
  return ref.doc("cache/user/").set(newusuario, { merge: true });
};

let sendMail = (req, res) => {
  var mailsolicitante = {
    from: "SigeLAB <noReply>",
    bcc: `${req.para}`,
    subject: req.asunto,
    html: req.mensaje,
  };
  return mailTrasport
    .sendMail(mailsolicitante)
    .then(() => {
      if (res) {
        res.status(200).send("Exito al enviar Email desde Firebase Functions.");
      }
    })
    .catch((error) => {
      if (res) {
        res.status(500).send("Exito al enviar Email desde Firebase Functions.");
      }
    });
};

// Modules exposts
exports.newServAdminTrackingNot =
  administrativeTracking.newServiceRequestTrackingNotification;
exports.getLabData = systemInteroperability.getAcreditedLabData;
exports.getRecentAcceptedServices =
  systemInteroperability.getLatestAcceptedServiceRequest;

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

let userDisabled = (req, res) => {
  admin
    .auth()
    .deleteUser(req.id)
    .then(() => {
      console.log("Successfully deleted user");
      res.status(200).send({ resp: " Usuario eliminado con exito!" });
    })
    .catch((error) => {
      console.log("Error deleting user:", error);
      res.status(500).send({ resp: " Ocurrio un error eliminando el usuario" });
    });
};

let quiv = (req, res) => {
  var tabla = req.tabla;
  let consulta = "";
  if (tabla == "espacios") {
    consulta = "space";
  } else if (tabla == "servicios") {
    consulta = "cfSrv";
  } else if (tabla == "pruebas") {
    consulta = "practice";
  } else if (tabla == "proyectos") {
    consulta = "project";
  } else if (tabla == "personal") {
    consulta = "cfPers";
  }
  ref
    .collection(consulta)
    .get()
    .then((querySnapshot) => {
      const data = [];
      if (querySnapshot.empty) {
        res.status(404).send({ resp: "La coleccion no existe" });
      }
      // add data from the 5 most recent comments to the array
      querySnapshot.forEach((doc) => {
        data.push(doc.data());
      });
      if (res) {
        res.status(200).send(data);
        console.log("hecho");
      } else {
        res.status(500).send({ error: "ocurrio un error" });
      }
    });
};

let quivId = (req, res) => {
  var tabla = req.tabla;
  var id = req.id;
  console.log("id de la consulta", id);
  let consulta = "";
  if (tabla == "espacios") {
    consulta = "space";
  } else if (tabla == "servicios") {
    consulta = "cfSrv";
  } else if (tabla == "pruebas") {
    consulta = "practice";
  } else if (tabla == "proyectos") {
    consulta = "project";
  } else if (tabla == "personal") {
    consulta = "cfPers";
  }
  ref
    .doc(`/${consulta}/${id}`)
    .get()
    .then((consulta) => {
      if (!consulta.exists) {
        res.status(404).send({ resp: "El id no existe" });
      }
      if (consulta.exists) {
        res.status(200).send(consulta.data());
        console.log("hecho");
      } else {
        res.status(500).send({ resp: "Ocurrio un error inesperado" });
      }
    });
};

exports.disablePractices = functions.https.onRequest((req, res) => {
  var token = req.get("x-token");
  if (token == "123456789") {
    ref
      .collection("practice")
      .get()
      .then((querySnapshot) => {
        const data = {};
        querySnapshot.forEach((doc) => {
          data[doc.id] = doc.data();
        });
        return data;
      })
      .then((data) => {
        var promisePractices = new Promise((resolve, reject) => {
          var datalength = Object.keys(data).length;
          var cont = 0;
          for (const key in data) {
            if (data.hasOwnProperty(key)) {
              var datalab = data[key];
              ref
                .doc(`practice/${key}/`)
                .update({ active: false })
                .then(function (done) {
                  cont++;
                  // console.log(datalength,cont);
                  if (cont == datalength) {
                    resolve();
                  }
                })
                .catch((error) => {
                  // console.log(datalength,cont)
                  reject(error);
                });
            }
          }
        });
        var promisecfFacil = new Promise((resolve, reject) => {
          var datalength = Object.keys(data).length;
          var cont = 0;
          for (const key in data) {
            if (data.hasOwnProperty(key)) {
              var datalab = data[key];
              var pathPractice = `cfFacil/${datalab.cfFacil}/`;
              var practica = {
                relatedPractices: {},
              };
              practica.relatedPractices[key] = false;
              ref
                .doc(pathPractice)
                .set(practica, { merge: true })
                .then(function (done) {
                  cont++;
                  // console.log(datalength,cont);
                  if (cont == datalength) {
                    resolve();
                  }
                })
                .catch((error) => {
                  // console.log(datalength,cont)
                  reject(error);
                });
            }
          }
        });
        return Promise.all([promisePractices, promisecfFacil])
          .then((data) => {
            console.log("success");
          })
          .catch((error) => {
            return error;
          });
      })
      .then((data) => {
        res.send("success");
      })
      .catch((error) => {
        res.send(error);
      });
  } else {
    res.send("not authorized");
  }
});

exports.activePractices = functions.https.onRequest((req, res) => {
  var token = req.get("x-token");
  if (token == "123456789") {
    ref
      .collection("practice")
      .get()
      .then((querySnapshot) => {
        const data = {};
        querySnapshot.forEach((doc) => {
          data[doc.id] = doc.data();
        });
        return data;
      })
      .then((data) => {
        var promisePractices = new Promise((resolve, reject) => {
          var datalength = Object.keys(data).length;
          var cont = 0;
          for (const key in data) {
            if (data.hasOwnProperty(key)) {
              var datalab = data[key];
              ref
                .doc(`practice/${key}/`)
                .update({ active: true })
                .then(function (done) {
                  cont++;
                  // console.log(datalength,cont);
                  if (cont == datalength) {
                    resolve();
                  }
                })
                .catch((error) => {
                  // console.log(datalength,cont)
                  reject(error);
                });
            }
          }
        });
        var promisecfFacil = new Promise((resolve, reject) => {
          var datalength = Object.keys(data).length;
          var cont = 0;
          for (const key in data) {
            if (data.hasOwnProperty(key)) {
              var datalab = data[key];
              var pathPractice = `cfFacil/${datalab.cfFacil}/`;
              var practica = {
                relatedPractices: {},
              };
              practica.relatedPractices[key] = true;
              ref
                .doc(pathPractice)
                .set(practica, { merge: true })
                .then(function (done) {
                  cont++;
                  // console.log(datalength,cont);
                  if (cont == datalength) {
                    resolve();
                  }
                })
                .catch((error) => {
                  // console.log(datalength,cont)
                  reject(error);
                });
            }
          }
        });
        return Promise.all([promisePractices, promisecfFacil])
          .then((data) => {
            console.log("success");
          })
          .catch((error) => {
            return error;
          });
      })
      .then((data) => {
        res.send("success");
      })
      .catch((error) => {
        res.send(error);
      });
  } else {
    res.send("not authorized");
  }
});
