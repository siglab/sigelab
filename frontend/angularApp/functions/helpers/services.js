/**
 * Created by: Julian Rodríguez
 * Created on: 10/02/2021
 * Last modification by: Julian Rodríguez
 * Description: Services information getter helper functions related.
 */

/**
 * Laboratories services information getter helper functions
 * @namespace servsFunctions
 **/

/**
 * @memberof servsFunctions
 * Get a service information by the given id
 * @param {String} srvId  A string containing the service identifier
 * @return {Promise} A promise with a JSON object with service data if it successfully execute it or an error message if it gets rejected
 */

exports.getServById = function (srvId) {
  return new Promise((resolve, reject) => {
    ref
      .doc(`/cfSrv/${srvId}`)
      .get()
      .then((response) => {
        if (!response || !response.data()) {
          reject(`No service found with id ${srvId}`);
        } else {
          resolve(response.data());
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};
