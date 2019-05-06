import { Injectable } from '@angular/core';

/**
 * Fast dom parser based on regexps
 * @readonly
 * @const {dom-parser}
 */
const DomParser = require('dom-parser');
const domParser = new DomParser();

declare var $: any;


@Injectable()
export class SabsService {

  constructor() { }


  /**
   * Ejecuta una peticion de busqueda de inventario en el SABS.
   *
   * @param {string} codInventario Codigo de inventario.
   * @return {any} Objeto de inventario
  */
  buscarEquip(codInventario: string): Promise<any> {
    // tslint:disable-next-line:max-line-length
    const URLSABS = 'https://swebse12.univalle.edu.co/sabs//paquetes/reportes/BienesPersona/index_popup.php?numero_bien=' + codInventario + '&accion=OtraPersona';
    // tslint:disable-next-line:max-line-length
    // const URLSABS2 = 'https://swebse12.univalle.edu.co/sabs/paquetes/reportes/BienesPersona/index_popup.php?numero_bien=' + codInventario + '&accion=OtraPersona';
    console.log('URLSABS: ' + URLSABS);
    // console.log('URLSABS2: ' + URLSABS2);
    return new Promise<any>(function (resolve, reject) {

      // $.getJSON('http://www.whateverorigin.org/get?url=' + encodeURIComponent(URLSABS) + '&callback=?', function(data) {
      //   console.log('whateverorigin: ', data.contents);
      // });

      // Solucion a CORS temporal usando un Free Proxy
      // http://www.whateverorigin.org/
      $.ajax({
        type: 'GET',
        url: 'https://www.whateverorigin.org/get?url=' + encodeURIComponent(URLSABS) + '&callback=?',
        dataType: 'jsonp',
        // tslint:disable-next-line:no-shadowed-variable
        success: function (response, status, request) {
          // console.log('Success');
          // console.log('response: ', response);
          // console.log('status: ', status);
          // console.log('request: ', request);
          if (status === 'success') {
            // console.log('Responde con Exito SABS: ', response);
            // Respuesta de la busqueda
            // resolve('Responde con Exito SABS: ' + response.contents);

            const dom = domParser.parseFromString(response.contents);
            // Obtiene la tabla de respuesta
            const tabla = dom.getElementsByTagName('table')[3];
            // Valida que existe una tabla con respuesta
            if (tabla) {
              const trs = tabla.getElementsByTagName('tr');
              const tdsValores = trs[5].getElementsByTagName('td');
              // console.log('tdsValores: ', tdsValores);
              // Objeto del data de inventario
              const dataInventario = {
                encontrado: false,
                responsable: 'N.A',
                fechaAceptacion: 'N.A',
                codInventario: 'N.A',
                numSerial: 'N.A',
                estado: 'N.A',
                ubicacion: 'N.A',
                nombreMarca: 'N.A',
                costoInicial: 'N.A'
              };
              // Valida que si existe informacion de inventario
              if (tdsValores.length === 8) {
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
                // console.log('dataInventario: ', dataInventario);
                // Respuesta de la busqueda
                resolve(dataInventario);
              } else {
                // No obtiene un resultado de busqueda de inventario
                // console.log('No obtiene un resultado de busqueda de inventario.');
                // El data de inventario no se encuentra
                dataInventario.encontrado = false;
                // Respuesta de la busqueda
                resolve(dataInventario);
              }
            } else {
              // console.log('El codigo de inventario [' + codInventario + '] no es valido.');
              // El codigo de inventario no es valido
              // const dataError = { code: 400, message: 'El codigo de inventario [' + codInventario + '] no es valido.' };
              // Respuesta de la busqueda
              reject(new Error('El codigo de inventario [' + codInventario + '] no es valido.'));
            }

          } else {
            // console.log('No responde con Exito SABS: ', response);
            // Respuesta de la busqueda
            reject(new Error('No responde con Exito SABS: ' + response));
          }
        },
        // tslint:disable-next-line:no-shadowed-variable
        error: function (request, textStatus, errorThrown) {
          // console.log('Error');
          // console.log('request.status: ', request.status);
          // console.log('request.statusText: ', request.statusText);
          // console.log('request.readyState: ', request.readyState);
          // console.log('textStatus: ', textStatus);
          // console.log('errorThrown: ', errorThrown);
          // Respuesta de la busqueda
          reject(new Error('Error al consultar en SABS: ' + errorThrown));
        }
      });

      // $.ajax({
      //   method: 'GET',
      //   url: URLSABS2,
      //   dataType: 'jsonp',
      //   crossDomain: true,
      //   // tslint:disable-next-line:no-shadowed-variable
      //   success: function (response, status, request) {
      //     console.log('Success');
      //     console.log('response: ', response);
      //     console.log('status: ', status);
      //     console.log('request: ', request);
      //     if (status === 'success') {
      //       console.log('Responde con Exito SABS: ', response);
      //       // Respuesta de la busqueda
      //       resolve('Responde con Exito SABS: ' + response);
      //     } else {
      //       console.log('No responde con Exito SABS: ', response);
      //       // Respuesta de la busqueda
      //       reject(new Error('No responde con Exito SABS: ' + response));
      //     }
      //   },
      //   // tslint:disable-next-line:no-shadowed-variable
      //   error: function (request, textStatus, errorThrown) {
      //     console.log('Error');
      //     console.log('request.status: ', request.status);
      //     console.log('request.statusText: ', request.statusText);
      //     console.log('request.readyState: ', request.readyState);
      //     console.log('textStatus: ', textStatus);
      //     console.log('errorThrown: ', errorThrown);
      //     // Respuesta de la busqueda
      //     reject(new Error('Error al consultar en SABS: ' + errorThrown));
      //   }
      // });

    });
  }

}
