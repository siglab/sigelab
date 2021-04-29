/**
 * Created by: Julian Rodríguez
 * Created on: 10/02/2021
 * Last modification by: Julian Rodríguez
 * Description: Laboratories information getter helper functions related.
 */

/**
 * Laboratories information getter helper functions
 * @namespace labsFunctions
 **/

/**
 * @memberof labsFunctions
 * Get a laboratory information by the given id
 * @param {String} labId  Laboratory identifier string
 * @return {Promise} A promise with a JSON object with lab data if it successfully execute it or an error message if it get rejected
 */

exports.getLabById = function (labId) {
  return new Promise((resolve, reject) => {
    ref
      .doc(`/cfFacil/${labId}`)
      .get()
      .then((response) => {
        if (!response || !response.data()) {
          reject(`No laboratory found with id ${labId}`);
        } else {
          resolve(response.data());
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};
