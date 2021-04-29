/**
 * Created by: Julian Rodríguez
 * Created on: 10/02/2021
 * Last modification by: Julian Rodríguez
 * Description: Email sender helper functions.
 */

/**
 * Email helper functions
 * @namespace mailFunctions
 **/

/**
 * @memberof mailsHelpers
 * Send a new email
 * @param  {string} email  An email as a string or a group of emails as an array
 * @param  {string} subject  Email subject as string
 * @param  {string} message  Email message as string
 * @return {Promise} A mailTransport promise
 */
exports.sendEmail = function (email, subject, message) {
  const mailOptions = {
    from: "SigeLAB <noReply>",
    to: email,
    subject: subject,
    text: message,
  };
  return mailTrasport.sendMail(mailOptions).then(() => {
    console.log("New email about " + subject + " sent to:", email);
  });
};
