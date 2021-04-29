/**
 * Created by: Julian Rodríguez
 * Created on: 30/03/2021
 * Last modification by: Julian Rodríguez
 * Description: Subheadquarters information getter helper functions related.
 */

/**
 * Laboratories information getter helper functions
 * @namespace subheadquartersFunctions
 **/

/**
 * @memberof subheadquartersFunctions
 * Get a subheadquearter information by the given id
 * @param {String} subHqId  An string containing the subHq identifier
 * @return {Promise} A promise with a JSON object with subHq data if it successfully execute it or an error message if it get rejected
 */

exports.getSubHqById = function (subHqId) {
  return new Promise((resolve, reject) => {
    ref
      .doc(`/cfPAddr/${subHqId}`)
      .get()
      .then((response) => {
        if (!response || !response.data()) {
          reject(`No physical address found with id ${subHqId}`);
        } else {
          resolve(response.data());
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};
