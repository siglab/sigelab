/**
 * Created by: Julian Rodríguez
 * Created on: 28/04/2021
 * Last modification by: Julian Rodríguez
 * Description: Services requests information getter helper functions related.
 */

/**
 * Laboratories services requests information getter helper functions
 * @namespace servsRequestFunctions
 **/

/**
 * @memberof servsRequestFunctions
 * Get accepted services requests information from a determinated period of time, from a given date to a given number of days back.
 * @param {Date} from A date object containing the date that represents the starting date to go back in days to fetch the data according to the number of days required
 * @param {Integer} days An integer with the number of previous days to include in the resume. Defaults to 15 days
 * @return {Promise} A promise with a JSON object with accepted requests data if it successfully execute it or an error message if it gets rejected
 */

exports.getLatestsAcceptedServiceRequests = function (from, days = 15) {
  const hours = 24 * days;
  from.setTime(from.getTime() - hours * 60 * 60 * 1000);
  return new Promise((resolve, reject) => {
    ref
      .collection("cfSrvReserv")
      .where("dateAccepted", ">=", from.toISOString())
      .orderBy("dateAccepted", "asc")
      .get()
      .then((snapshot) => {
        if (!snapshot) {
          reject("No service requests matches this params");
        } else {
          resolve(snapshot);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};
