/**
 * Inventario
 *
 * @module Inventario
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 * @author Sebastian Rios Sabogal - https://about.me/sebaxtian
 * @license Univalle
 */




/**
 * Definicion de tipo Inventario.
 * 
 * @typedef {object} Inventario
 * @property {string} codInventario Codigo de inventario.
 * @property {string=} responsable Responsable de inventario.
 * @property {string=} numSerial Numero serial de inventario.
 * @property {string=} nombreMarca Nombre o marca de inventario.
 * @property {string=} estado Estado de inventario
 * @property {string=} ubicacion Ubicacion de inventario.
 * @property {string=} costoInical Costo inicial de inventario.
 * @property {string=} fechaAceptacion Fecha de aceptacion de inventario.
 * @property {string=} codLab Codigo de laboratorio.
 * @property {string=} nomLab Nombre de laboratorio.
 * @property {string=} sede Sede donde se encuentra laboratorio.
 * @property {string=} edificio Edificio donde se encuentra laboratorio.
 * @property {string=} espacio Espacio donde esta el inventario.
 */
module.exports = {

  attributes: {

    codInventario: {
      type: 'string',
      required: true,
      unique: true
    },

    responsable: {
      type: 'string'
    },

    numSerial: {
      type: 'string'
    },

    nombreMarca: {
      type: 'string'
    },

    estado: {
      type: 'string'
    },

    ubicacion: {
      type: 'string'
    },

    costoInical: {
      type: 'string'
    },

    fechaAceptacion: {
      type: 'string'
    },

    codLab: {
      type: 'string'
    },

    nomLab: {
      type: 'string'
    },

    sede: {
      type: 'string'
    },

    edificio: {
      type: 'string'
    },

    espacio: {
      type: 'string'
    }

  }

};

