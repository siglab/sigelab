/**
 * Created by: Julian Rodríguez
 * Created on: 29/03/2021
 * Last modification by: Julian Rodríguez
 * Description: Project Api points routes or functions related to system interoperability.
 */

const labInfoHelper = require("../helpers/laboratories.js");
const spaceInfoHelper = require("../helpers/spaces");
const subHeadquarterInfoHelper = require("../helpers/subHeadquarters");
const servicesRequestsList = require("../helpers/reserves.js");
const stripHtml = require("string-strip-html");
const json2csv = require("json2csv").parse;
const url = require("url");

// The following imports represents data which was stored as a static file to reduce the databse operations.
const availableServList = require("../data/services.js");
const labs = require("../data/cfFacil.json")["cfFacil"];
const headquarters = require("../data/headquarter.json")["headquarter"];
const subHq = require("../data/cfPAddr.json")["cfPAddr"];
const faculties = require("../data/faculty.json")["faculty"];

/**
 * System interoperability functions
 * @namespace interoperabilityFunctions
 **/

/**
 * @memberof interoperabilityFunctions
 * Interoperability API point access for accredited Univalle labs available data
 * @param {Http request object} req  An http object containing request params
 * @param {Http response object} res  An http object to use on response
 * @return {Http response object}
 */
exports.getAcreditedLabData = functions.https.onRequest((req, res) => {
  try {
    const acreditedLabKeys = [
      "kTn49yLFCPuSV85HFWYK",
      "6NdmeFukNfST1QWbHh1T",
      "H3NHxwp8rH4LOaCfyZ3b",
      "e88H6B0C4dZexfuws15e",
      "OOdtx1TEE8EzwUxBvyiV",
      "FcZdJrF2TgoPPyldpeyo",
    ];
    // Since there is not enought info about the services for this laboratories in SigeLAB, we load a static JSON with services for each lab of interest here.
    // TODO: Load this info to SigeLAB and retrieve it from the database.
    const services = availableServList.services;
    let utcDate = new Date();
    // Setting Colombia time (-5 hours)
    utcDate.setTime(utcDate.getTime() - 5 * 60 * 60 * 1000);
    let labsInfo = {
      dataOrigin: "Universidad del Valle",
      dataSource: "https://sigelab.univalle.edu.co/",
      dataOriginatedOn: utcDate.toISOString(),
      labsData: [],
    };
    res.set({
      "Access-Control-Allow-Headers": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST",
    });
    let promiseStack = [];
    acreditedLabKeys.forEach((key) => {
      promiseStack.push(labInfoHelper.getLabById(key));
    });
    Promise.all(promiseStack)
      .then((response) => {
        let newPromiseStack = [];
        response.forEach((element, index) => {
          newPromiseStack.push(
            buildLabDataStructure(element, acreditedLabKeys[index], services)
          );
        });
        Promise.all(newPromiseStack)
          .then((labsData) => {
            labsData.forEach((element) => {
              labsInfo["labsData"].push(element);
            });
            res.status(200).json({ status: 200, data: labsInfo });
          })
          .catch((e) => {
            console.error(e);
            res.status(500).json({ status: 500, mensaje: e.message });
          });
      })
      .catch((e) => {
        console.error(e);
        res.status(500).json({ status: 500, mensaje: e.message });
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 500, mensaje: error.message });
  }
});

/**
 * @memberof interoperabilityFunctions
 * Laboratory data structure builder helper function
 * @param {Firebase snapshot object} labData  An object containing the cfFacil db document for an specific laboratory
 * @param {String} labKey  An string containing the laboratory identification key
 * @param {Object} servicesList  An object containing the available services for included laboratories
 * @return {Promise} Returns required lab data structure to share as JSON object if succeed
 */
async function buildLabDataStructure(labData, labKey, servicesList) {
  // Univalle's NIT
  const nit = "890399010";
  return new Promise((resolve, reject) => {
    try {
      let structuredLabData = {
        cfName: "",
        cfDescr: "",
        webPage: "",
        contactEmail: "",
        location: "",
        nitNumber: nit,
        dataOrigin: "Universidad del Valle",
        dataSource: "https://sigelab.univalle.edu.co/",
        externalServices: true,
        services: {
          testServices: [],
          calibServices: [],
        },
      };
      if (servicesList[labKey]) {
        structuredLabData["services"] = servicesList[labKey];
      }
      const labName = labData["cfName"] ? labData["cfName"] : "";
      const labDesc = labData["cfDescr"]
        ? stripHtml.stripHtml(labData["cfDescr"]).result.replace(/\n|\r/g, " ")
        : "";
      const labEmail =
        labData["otros"] && labData["otros"]["email"]
          ? labData["otros"]["email"]
          : "";
      structuredLabData["cfName"] = labName;
      structuredLabData["cfDescr"] = labDesc;
      structuredLabData["contactEmail"] = labEmail;
      let promises = [];
      labData["mainSpace"]
        ? promises.push(spaceInfoHelper.getSpaceById(labData["mainSpace"]))
        : promises.push(Promise.resolve({}));
      labData["subHq"]
        ? promises.push(subHeadquarterInfoHelper.getSubHqById(labData["subHq"]))
        : promises.push(Promise.resolve({}));
      Promise.all(promises)
        .then((values) => {
          let cfPAddr = "";
          if (Object.keys(values[0]).length > 0) {
            if (values[0]["spaceData"]) {
              values[0]["spaceData"]["building"]
                ? (cfPAddr =
                    cfPAddr + "Edificio " + values[0]["spaceData"]["building"])
                : (cfPAddr = cfPAddr + "");
              values[0]["spaceData"]["floor"]
                ? (cfPAddr =
                    cfPAddr + ", Piso " + values[0]["spaceData"]["floor"])
                : (cfPAddr = cfPAddr + "");
              values[0]["spaceData"]["place"]
                ? (cfPAddr =
                    cfPAddr +
                    ", Espacio " +
                    values[0]["spaceData"]["place"] +
                    ", ")
                : (cfPAddr = cfPAddr + "");
            }
          }
          if (Object.keys(values[1]).length > 0) {
            values[1]["cfAddrline1"]
              ? (cfPAddr = cfPAddr + values[1]["cfAddrline1"])
              : (cfPAddr = cfPAddr + "");
            values[1]["cfAddrline2"]
              ? (cfPAddr = cfPAddr + ", " + values[1]["cfAddrline2"])
              : (cfPAddr = cfPAddr + "");
            values[1]["cfAddrline3"]
              ? (cfPAddr = cfPAddr + ", " + values[1]["cfAddrline3"])
              : (cfPAddr = cfPAddr + "");
            values[1]["cfAddrline4"]
              ? (cfPAddr = cfPAddr + ", " + values[1]["cfAddrline4"])
              : (cfPAddr = cfPAddr + "");
            values[1]["cfCountry"] && values[1]["cfCountry"]["cfName"]
              ? (cfPAddr = cfPAddr + ", " + values[1]["cfCountry"]["cfName"])
              : (cfPAddr = cfPAddr + "");
          }
          structuredLabData["location"] = cfPAddr;
          resolve(structuredLabData);
        })
        .catch((error) => {
          console.error(error);
          reject();
        });
    } catch (error) {
      console.error(error);
      reject();
    }
  });
}

/**
 * @memberof interoperabilityFunctions
 * Interoperability API point access to get the latests accepted Univalle's labs services requests
 * @param {Http request object} req  An http object containing request params
 * @param {Http response object} res  An http object to use on response
 * @return {Http response object}
 */
exports.getLatestAcceptedServiceRequest = functions.https.onRequest(
  (req, res) => {
    try {
      const queryObject = url.parse(req.url, true).query;
      console.log(queryObject);
      let days = 15;
      if (queryObject["days"]) {
        try {
          days = parseInt(queryObject["days"]);
        } catch (error) {}
      }
      let utcDate = new Date();
      // Setting Colombia time (-5 hours)
      utcDate.setTime(utcDate.getTime() - 5 * 60 * 60 * 1000);
      utcDate.setUTCHours(0, 0, 0, 0);
      servicesRequestsList
        .getLatestsAcceptedServiceRequests(utcDate, days)
        .then((snapshot) => {
          if (snapshot.empty) {
            res.status(404).json({
              status: 404,
              mensaje: "No service requests matches this params",
            });
          } else {
            let rows = [];
            snapshot.forEach((doc) => {
              const requestData = doc.data();
              const vinOptions = [
                "Trabajo de grado",
                "Maestria",
                "Doctorado",
                "Proyecto de investigacion",
                "Laboratorista",
              ];
              let requestVin = "";
              requestData.datauser["type"].forEach((e, index) => {
                requestVin = requestVin + vinOptions[e] + ",";
                if (index + 1 == requestData.datauser["type"].length) {
                  requestVin = requestVin.substring(0, requestVin.length - 1);
                }
              });
              let newRow = {};
              if (requestData.parametrosSrv) {
                newRow = {
                  "Fecha de aceptación": requestData.dateAccepted
                    ? requestData.dateAccepted
                    : "",
                  "Tipo de documento de identidad": requestData.parametrosSrv[4]
                    ? requestData.parametrosSrv[4]["value"]
                    : "",
                  "Número de identificación": requestData.parametrosSrv[5]
                    ? requestData.parametrosSrv[5]["value"]
                    : "",
                  Nombres: requestData.parametrosSrv[2]
                    ? requestData.parametrosSrv[2]["value"]
                    : "",
                  Apellidos: requestData.parametrosSrv[3]
                    ? requestData.parametrosSrv[3]["value"]
                    : "",
                  "Número de celular": requestData.parametrosSrv[13]
                    ? requestData.parametrosSrv[13]["value"]
                    : "",
                  "Correo electrónico": requestData.emailuser,
                  Edad: requestData.parametrosSrv[6]
                    ? requestData.parametrosSrv[6]["value"]
                    : "",
                  EPS: requestData.parametrosSrv[12]
                    ? requestData.parametrosSrv[12]["value"]
                    : "",
                  "Tipo de vinculación": requestData.parametrosSrv[7]
                    ? requestData.parametrosSrv[7]["value"]
                    : "",
                  Cargo: requestData.parametrosSrv[8]
                    ? requestData.parametrosSrv[8]["value"]
                    : "",
                  "Empresa en la que labora": requestData.parametrosSrv[9]
                    ? requestData.parametrosSrv[9]["value"]
                    : "",
                  "Contrato/Obra": requestData.parametrosSrv[10]
                    ? requestData.parametrosSrv[10]["value"]
                    : "",
                  "Suprevisor de contrato/obra": requestData.parametrosSrv[11]
                    ? requestData.parametrosSrv[11]["value"]
                    : "",
                  Edificio: requestData.parametrosSrv[0]
                    ? requestData.parametrosSrv[0]["value"]
                    : "",
                  "Espacio solicitado": requestData.parametrosSrv[1]
                    ? requestData.parametrosSrv[1]["value"]
                    : "",
                  "Actividad a realizar": requestData.parametrosSrv[27]
                    ? requestData.parametrosSrv[27]["value"]
                    : "",
                  "Vinculación de solicitud": requestVin,
                  SICOP: requestData.datauser["ci"],
                  "Fecha de inicio de reserva": requestData.parametrosSrv[21]
                    ? requestData.parametrosSrv[21]["value"]
                    : "",
                  "Fecha final de reserva": requestData.parametrosSrv[22]
                    ? requestData.parametrosSrv[22]["value"]
                    : "",
                  "Frecuencia de uso del espacio": requestData.parametrosSrv[23]
                    ? requestData.parametrosSrv[23]["value"]
                    : "",
                  "Número de días de uso en la semana": requestData
                    .parametrosSrv[24]
                    ? requestData.parametrosSrv[24]["value"]
                    : "",
                  "Dias de uso en la semana": requestData.parametrosSrv[25]
                    ? requestData.parametrosSrv[25]["value"]
                    : "",
                  "Horas de uso por día": requestData.parametrosSrv[26]
                    ? requestData.parametrosSrv[26]["value"]
                    : "",
                  "Nombre de laboratorio":
                    labs[requestData["cfFacil"]]["cfName"],
                  Seccional:
                    headquarters[labs[requestData["cfFacil"]]["headquarter"]][
                      "cfName"
                    ],
                  Sede:
                    subHq[labs[requestData["cfFacil"]]["subHq"]][
                      "cfAddrline1"
                    ] +
                    " - " +
                    subHq[labs[requestData["cfFacil"]]["subHq"]]["cfAddrline2"],
                  Facultad: Object.keys(
                    labs[requestData["cfFacil"]]["faculties"]
                  )[0]
                    ? faculties[
                        Object.keys(
                          labs[requestData["cfFacil"]]["faculties"]
                        )[0]
                      ]["facultyName"]
                    : "",
                  // "Unidad académica":
                  "Nombre de proyecto": requestData.parametrosSrv[14]
                    ? requestData.parametrosSrv[14]["value"]
                    : "",
                  "Nombre de director de proyecto": requestData
                    .parametrosSrv[15]
                    ? requestData.parametrosSrv[15]["value"]
                    : "",
                  "Número de identificación de director de proyecto": requestData
                    .parametrosSrv[16]
                    ? requestData.parametrosSrv[16]["value"]
                    : "",
                  "Correo electrónico de director de proyecto": requestData
                    .parametrosSrv[17]
                    ? requestData.parametrosSrv[17]["value"]
                    : "",
                  "Fecha de inicio de proyecto": requestData.parametrosSrv[18]
                    ? requestData.parametrosSrv[18]["value"]
                    : "",
                  "Fecha de finalización de proyecto": requestData
                    .parametrosSrv[19]
                    ? requestData.parametrosSrv[19]["value"]
                    : "",
                  "Porcentaje de avance de proyecto": requestData
                    .parametrosSrv[20]
                    ? requestData.parametrosSrv[20]["value"]
                    : "",
                };
                rows.push(newRow);
              }
            });
            const csvContent = json2csv(rows);
            res.set({
              "Content-Disposition": 'attachment; filename="resume.csv"',
              "Content-type": "text/csv",
            });
            res.send(csvContent);
          }
        })
        .catch((error) => {
          res.status(500).json({ status: 500, mensaje: error.message });
        });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: 500, mensaje: error.message });
    }
  }
);
