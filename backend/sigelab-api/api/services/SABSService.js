/**
 * SABSService
 *
 * @module SABSService
 * @description :: TODO: Este servicio permite consultar Inventario en SABS.
 * @docs        :: http://sailsjs.com/documentation/concepts/services/creating-a-service
 * @requires request
 * @requires dom-parser
 * @author Sebastian Rios Sabogal - https://about.me/sebaxtian
 * @license Univalle
 */



/**
 * Servicio para hacer llamados HTTP y HTTPS
 * https://www.codingdefined.com/2016/03/solved-error-unable-to-verify-first.html
 * @readonly
 * @const {request}
 */
const request = require('request');
/**
 * Fast dom parser based on regexps
 * @readonly
 * @const {dom-parser}
 */
const DomParser = require('dom-parser');
const domParser = new DomParser();


const sabs = sails.config.sabs;

module.exports = {
    

    /**
     * Ejecuta una peticion de busqueda de inventario en el SABS.
     * 
     * @param {string} codInventario Codigo de inventario.
     * @param {function} done Callback de buscar inventario.
     * @return {function} Callback de buscar inventario.
     * 
     * @example
     * SABSService.buscar(
     *   codInventario,
     *   function(error, response) {
     *     // Notifica el error
     *     if(error) return 1;
     *     // Busca el inventario con exito
     *     return 0;
     *   }
     * );
     */
    buscar: function(codInventario, done) {
        //sails.log('Inicia consulta de Inventario en SABS');
        // URL Base del Sistema SABS
        const URLSABS = sabs.sabsUrl + codInventario + '&accion=OtraPersona';
        sails.log('URLSABS: ' + URLSABS);
        // Ejecuta peticion de busqueda en SABS
        request.get({url: URLSABS, rejectUnauthorized: false}, function(error, response, body) {
            console.log('response: ', response);
            console.log('body: ', body);
            // Si no hay error
            if(!error) {
                //sails.log('statusCode: ', response.statusCode);
                // Valida el estatus de la respuesta
                if(response.statusCode == 200) {
                    //sails.log('Exito al obtener respuesta: ', response.statusMessage);
                    var dom = domParser.parseFromString(body);
                    // Obtiene la tabla de respuesta
                    var tabla = dom.getElementsByTagName('table')[3];
                    // Valida que existe una tabla con respuesta
                    if(tabla) {
                        var trs = tabla.getElementsByTagName('tr');
                        var tdsValores = trs[5].getElementsByTagName('td');
                        //sails.log('tdsValores: ', tdsValores);
                        // Objeto del data de inventario
                        var dataInventario = {};
                        // Valida que si existe informacion de inventario
                        if(tdsValores.length == 8) {
                            // El data de inventario si se encuentra
                            dataInventario.encontrado = true;
                            dataInventario.responsable = tdsValores[0].innerHTML;
                            dataInventario.fechaAceptacion = tdsValores[1].innerHTML;
                            dataInventario.codInventario = tdsValores[2].innerHTML;
                            dataInventario.numSerial = tdsValores[3].innerHTML;
                            dataInventario.estado = tdsValores[4].innerHTML;
                            dataInventario.ubicacion = tdsValores[5].innerHTML;
                            dataInventario.nombreMarca = tdsValores[6].innerHTML;
                            dataInventario.costoInicial = tdsValores[7].innerHTML;
                            // Obtiene un resultado de busqueda de inventario
                            //sails.log('dataInventario: ', dataInventario);
                            // Respuesta de la busqueda
                            return done(null, dataInventario);
                        } else {
                            // No obtiene un resultado de busqueda de inventario
                            //sails.log('No obtiene un resultado de busqueda de inventario.');
                            // El data de inventario no se encuentra
                            dataInventario.encontrado = false;
                            // Respuesta de la busqueda
                            return done(null, dataInventario);
                        }
                    } else {
                        //sails.log.error('El codigo de inventario [' + codInventario + '] no es valido.');
                        // El codigo de inventario no es valido
                        var dataError = {code: 400, message: 'El codigo de inventario [' + codInventario + '] no es valido.'};
                        return done(dataError, null);
                    }
                } else {
                    //sails.log.error('Error al obtener respuesta de peticion de consulta de inventario [' + codInventario + '] en SABS: ', response.statusMessage);
                    // Error al obtener respuesta de peticion
                    var dataError = {code: 500, message: 'Error al obtener respuesta de peticion de consulta de inventario [' + codInventario + '] en SABS: ' + response.statusMessage.toString()};
                    return done(dataError, null);
                }
            } else {
                //sails.log.error('Error al ejecutar peticion de consulta de inventario [' + codInventario + '] en SABS: ', error);
                // Error al ejecutar peticion
                var dataError = {code: 501, message: 'Error al ejecutar peticion de consulta de inventario [' + codInventario + '] en SABS: ' + error.toString()};
                return done(dataError, null);
            }
            //sails.log('Termina consulta de Inventario en SABS');
        });
    }

}
