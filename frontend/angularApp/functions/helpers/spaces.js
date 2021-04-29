/**
 * Created by: Julian Rodríguez
 * Created on: 30/03/2021
 * Last modification by: Julian Rodríguez
 * Description: Spaces information getter helper functions related.
 */

/**
 * Laboratories information getter helper functions
 * @namespace spacesFunctions
 **/

/**
 * @memberof spacesFunctions
 * Get a space information by the given id
 * @param {String} spaceId  An string containing the space identifier
 * @return {Promise} A promise with a JSON object with space data if it successfully execute it or an error message if it get rejected
 */

exports.getSpaceById = function (spaceId) {
  return new Promise((resolve, reject) => {
    ref
      .doc(`/space/${spaceId}`)
      .get()
      .then((response) => {
        if (!response || !response.data()) {
          reject(`No space found with id ${spaceId}`);
        } else {
          resolve(response.data());
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};
