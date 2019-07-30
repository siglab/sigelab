/**
 * InventarioController
 *
 * @module InventarioController
 * @description :: Server-side logic for managing inventarios
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 * @author Sebastian Rios Sabogal - https://about.me/sebaxtian
 * @license Univalle
 */



module.exports = {
    
    /**
     * Esta acción se encarga de buscar la información de un inventario.
     * 
     * @param {object} req.body Objeto con atributos del inventario a buscar.
     * @return {object} El inventario encontrado en la busqueda.
     * @example
     * POST /inventario/buscar
     * BODY
     * {
     *   codInventario: '05317500',
     *   codLab: '123456',
     *   nomLab: 'GISMODEL',
     *   sede: 'MELENDEZ',
     *   edificio: '331',
     *   espacio: '2026'
     * }
     */
    buscar: function(req, res) {
        sails.log('Inicia accion de Buscar Inventario');
        // Atributos de inventario a buscar
        sails.log('Body: ', req.body);
        const codInventario = req.body.codInventario;;
        const codLab = req.body.codLab;
        const nomLab = req.body.nomLab;
        const sede = req.body.sede;
        const edificio = req.body.edificio;
        const espacio = req.body.espacio;
        // Valida el codigo de inventario
        if(!codInventario) {
            // No existe un codigo de inventario para la busqueda
            sails.log.error('No se ha especificado un codigo de inventario para la busqueda.');
            return res.badRequest('No se ha especificado un codigo de inventario para la busqueda.');
        } else if(!codLab || !nomLab || !sede || !edificio || !espacio) {
            // No existe atributos necesarios
            sails.log.error('No se han especificado los atributos de codLab, nomLab, sede, edificio, espacio.');
            return res.badRequest('No se han especificado los atributos de codLab, nomLab, sede, edificio, espacio.');
        } else {
            // Existe un codigo de inventario para realizar la busqueda
            // Ejecuta servicio para realizar busqueda en SABS
            SABSService.buscar(
                codInventario,
                function(error, response) {
                    // Notifica error
                    if(error) {
                        sails.log.error(error);
                        if(error.code = 400) {
                            sails.log.error(error.message);
                            return res.badRequest(error.message);
                        }
                        if(error.code == 500 || error.code == 501) {
                            sails.log.error(error.message);
                            return res.serverError(error.message);
                        }
                    }
                    // Busca el inventario con exito
                    // Configura Objeto de respuesta
                    const objResponse = {
                        mensaje: 'Exito al ejecutar peticion de busqueda en SABS.',
                        inventario: response
                    };
                    // Valida si se encuentra inventario en la busqueda en SABS
                    if(objResponse.inventario.encontrado) {
                        // Si encuentra inventario en SABS
                        sails.log('Si encuentra inventario en SABS');
                        // Busca si el inventario en Sigelab
                        Inventario.findOne({codInventario: objResponse.inventario.codInventario}).exec(function(err, inventario) {
                            // Notifica el error
                            if(err) {
                                sails.log('Error al buscar inventario en Sigelab. ', err);
                                return res.serverError('Error al buscar inventario en Sigelab.');
                            }
                            // Busca inventario en Sigelab
                            if(!inventario) {
                                // No existe inventario en Sigelab
                                // Agrega a la respuesta atributos de inventario
                                objResponse.inventario.codLab = codLab;
                                objResponse.inventario.nomLab = nomLab;
                                objResponse.inventario.sede = sede;
                                objResponse.inventario.edificio = edificio;
                                objResponse.inventario.espacio = espacio;
                                // Crea el inventario en Sigelab
                                Inventario.create(objResponse.inventario).exec(function(err, response) {
                                    // Notifica el error
                                    if(err) {
                                        sails.log('Error al crear registro de inventario en Sigelab. ', err);
                                        return res.serverError('Error al crear registro de inventario en Sigelab.');
                                    }
                                    // Responde al usuario
                                    sails.log('Termina accion de Buscar Inventario');
                                    // Objeto Response
                                    sails.log('objResponse: ', objResponse);
                                    // Respuesta
                                    return res.ok(objResponse);
                                });
                            } else {
                                // Si existe inventario en Sigelab
                                // Actualiza algunos datos nuevos del inventario
                                objResponse.inventario.codLab = codLab;
                                objResponse.inventario.nomLab = nomLab;
                                objResponse.inventario.sede = sede;
                                objResponse.inventario.edificio = edificio;
                                objResponse.inventario.espacio = espacio;
                                // Actualiza
                                Inventario.update({codInventario: inventario.codInventario}, objResponse.inventario).exec(function afterwards(err, updated){
                                    // Notifica el error
                                    if(err) {
                                        sails.log('Error en actualizar inventario en Sigelab. ', err);
                                        return res.serverError('Error en actualizar inventario en Sigelab.');
                                    }
                                    // Responde al usuario
                                    sails.log('Termina accion de Buscar Inventario');
                                    // Objeto Response
                                    sails.log('objResponse: ', objResponse);
                                    // Respuesta
                                    return res.ok(objResponse);
                                });
                            }
                        });
                    } else {
                        // No encuentra inventario en SABS
                        sails.log('No encuentra inventario en SABS');
                        // Busca si el inventario en Sigelab
                        Inventario.findOne({codInventario: codInventario}).exec(function(err, inventario) {
                            // Notifica el error
                            if(err) {
                                sails.log('Error al buscar inventario en Sigelab. ', err);
                                return res.serverError('Error al buscar inventario en Sigelab.');
                            }
                            // Busca inventario en Sigelab
                            if(!inventario) {
                                // No encuentra inventario en Sigelab
                                sails.log('No encuentra inventario en Sigelab');
                                // Responde al usuario
                                sails.log('Termina accion de Buscar Inventario');
                                // Agrega a la respuesta atributos de inventario
                                objResponse.inventario.codLab = codLab;
                                objResponse.inventario.nomLab = nomLab;
                                objResponse.inventario.sede = sede;
                                objResponse.inventario.edificio = edificio;
                                objResponse.inventario.espacio = espacio;
                                // Objeto Response
                                sails.log('objResponse: ', objResponse);
                                // Respuesta
                                return res.ok(objResponse);
                            } else {
                                // Si encuentra inventario en Sigelab
                                sails.log('Si encuentra inventario en Sigelab');
                                // Responde al usuario
                                sails.log('Termina accion de Buscar Inventario');
                                // Agrega a la respuesta atributos de inventario
                                objResponse.inventario = inventario;
                                objResponse.inventario.encontrado = true;
                                // Borra algunos datos
                                delete objResponse.inventario.id;
                                delete objResponse.inventario.createdAt;
                                delete objResponse.inventario.updatedAt;
                                // Objeto Response
                                sails.log('objResponse: ', objResponse);
                                // Respuesta
                                return res.ok(objResponse);
                            }
                        });
                    }
                }
            );
        }
    }

};

