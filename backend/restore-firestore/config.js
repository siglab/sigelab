/**
 * Default variables initialization
 * Set this values according to your firebase project config.
 *  */
const DATABASE_URL = 'YOUR_PROJECT_DATABASE_URL_HERE';

/**
 * DO NOT TOUCH ANYTHING FROM HERE
 */
// Config JSON
var firebaseConfig = {
  database: DATABASE_URL
}

//Module exportation
module.exports = {
  projectConfig: firebaseConfig
};