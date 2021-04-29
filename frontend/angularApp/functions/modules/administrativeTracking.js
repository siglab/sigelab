/**
 * Created by: Julian Rodríguez
 * Created on: 10/02/2021
 * Last modification by: Julian Rodríguez
 * Description: Project Api points routes, functions or triggers related to system tracking for data aquisition for administrative management.
 */

const labInfoHelper = require("../helpers/laboratories.js");
const servInfoHelper = require("../helpers/services.js");
const mailsHelper = require("../helpers/mails.js");
const projectConfig = require("../config/config.js");

/**
 * System administrative tracking functions
 * @namespace trackingFunctions
 **/

/**
 * @memberof trackingFunctions
 * New service request trigger for email notification creation for administrative tracking on new service request created
 * @param {Firebase snapshot object} snap  An object containing the version of the document to create
 * @param {Firebase context} context  Unknown
 * @return {Promise}
 */

exports.newServiceRequestTrackingNotification = functions.firestore
  .document("cfSrvReserv/{reservId}")
  .onCreate((snap, context) => {
    return new Promise((resolve, reject) => {
      const newServiceRequest = snap.data();
      if (newServiceRequest.cfFacil && newServiceRequest.cfSrv) {
        Promise.all([
          labInfoHelper.getLabById(newServiceRequest.cfFacil),
          servInfoHelper.getServById(newServiceRequest.cfSrv),
        ])
          .then((response) => {
            const srvName = response[1]["cfName"]
              ? response[1]["cfName"]
              : "Nombre de servicio no especificado";
            const userEmail = newServiceRequest.emailuser
              ? newServiceRequest.emailuser
              : "Correo de usuario no especificado";
            const subject =
              "Notificación SigeLAB: Nuevo servicio solicitado - " +
              srvName +
              " - " +
              userEmail;
            const message = `Se ha registrado una nueva solicitud de servicio en SigeLAB. A continuación se incluye información relevante de la solicitud de servicio registrada:\n
            Nombre de servicio solicitado: ${
              response[1]["cfName"] ? response[1]["cfName"] : "No registra"
            }
            Nombre de laboratorio prestador del servicio: ${
              response[0]["cfName"] ? response[0]["cfName"] : "No registra"
            }
            Correo electrónico de contacto de laboratorio: ${
              response[0]["otros"] && response[0]["otros"]["email"]
                ? response[0]["otros"]["email"]
                : "No registra"
            }
            Correo electrónico de usuario solicitante: ${
              newServiceRequest["emailuser"]
                ? newServiceRequest["emailuser"]
                : "No registra"
            }
            Fecha de generación de solicitud: ${
              newServiceRequest["createdAt"]
                ? newServiceRequest["createdAt"]
                : "No registra"
            }
            \nEste es un mensaje autogenerado. Por favor no intente responder este mensaje.`;
            mailsHelper
              .sendEmail(
                projectConfig.configData.trackingDataEmail
                  ? projectConfig.configData.trackingDataEmail
                  : "",
                subject,
                message
              )
              .then(() => {
                resolve();
              })
              .catch((error) => {
                console.warn(
                  "Could not continue sending new service tracking notification."
                );
                console.error(error);
                reject();
              });
          })
          .catch((error) => {
            console.warn(
              "Could not continue sending new service tracking notification."
            );
            console.error(error);
            reject();
          });
      } else {
        console.warn(
          "Could not continue sending new service tracking notification. Lab id or service id missing."
        );
        reject();
      }
    });
  });
