/**
  * Created by: Geoprocess S.A.S
  * Created on: 27/07/2018
  * Last modification by: Julian Rodríguez
  * Description: Project Api points routes and default application config.
*/

// Application default config variables initialization
const APP_DOMAIN_URL = 'sigelab.univalle.edu.co';
const ORG_EMAIL_DOMAIL = 'correounivalle.edu.co';
const MAIN_CLOUD_FUNCTIONS_ROUTE = 'us-central1-siglab-2bdb6.cloudfunctions.net';
// Use the following constant definitions just for Universidad del Valle deployments.
const MAIN_SABS_API_URL = 'UNIVERSIDAD_DEL_VALLE_SABS_API_URL';
const SABS_PORT = '1337';

/**
 * DO NOT TOUCH ANYTHING FROM HERE TO BELOW
 */
/* Application API routes */
export const URLCORREO = 'https://' + MAIN_CLOUD_FUNCTIONS_ROUTE + '/enviarCorreo';
export const URLUSER = 'https://' + MAIN_CLOUD_FUNCTIONS_ROUTE + '/createUser';
export const URLDISABLED = 'https://' + MAIN_CLOUD_FUNCTIONS_ROUTE + '/disablePractices';
export const URLQR = 'https://' + APP_DOMAIN_URL + 'principal/qrinventario/';
/* Organization restrictions variable for internal users */
/* Users logged with this email domain will see some options and functionalities that other users will not */
export const correoUnivalle = ORG_EMAIL_DOMAIL;
/*Default application base roles */
export const ROLESARRAY = ['UlcSFw3BLPAdLa533QKP', 'lCpNW2BmPgMSHCD1EBpT', 'PFhLR4X2n9ybaZU3CR75',
'k7uRIEzj99l7EjZ3Ppql', 'W6ihltvrx8Gc7jVucH8M'];
/* Default Universidad del Valle SABS API */
export const URLAPI = MAIN_SABS_API_URL + ':' + SABS_PORT + '/inventario/buscar';
