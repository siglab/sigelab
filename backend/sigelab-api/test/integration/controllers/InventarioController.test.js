/**
 * Definicion de pruebas para el Controlador Inventario.
 * 
 * http://sailsjs.com/documentation/concepts/testing
 * https://mochajs.org/
 */


const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
chai.use(chaiHttp);


describe('Controlador Inventario', function() {


    // Datos de Prueba
    var dataBusqueda = {
        codInventario: '53888407',
        codLab: '123456',
        nomLab: 'GISMODEL',
        sede: 'MELENDEZ',
        edificio: '331',
        espacio: '2026'
    };


    /*
    describe('#find()', function() {
        it('deberia probar la funcion find()', function (done) {

            // Prueba funcion Find
            Inventario.find().then(function(results) {
                // Prueba si existen resultados correctos
                expect(results).to.be.an('array');
                expect(results.length).to.be.at.least(1);
                expect(results[0].codInventario).to.be.a('string');
                // Actualiza el Codigo de Activacion de Prueba
                codInventario = results[0].codInventario;
                done();
            }).catch(done);

        });
    });
    */



    describe('#buscar()', function() {
        it('deberia buscar un inventario sin error', function (done) {

            // Prueba de Accion Buscar
            chai.request(sails.hooks.http.app)
            .post('/inventario/buscar')
            .send(dataBusqueda)
            .end(function(err, res) {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('mensaje');
                expect(res.body).to.have.property('inventario');
                expect(res.body.inventario).to.have.property('encontrado');
                if(res.body.inventario.encontrado) {
                    expect(res.body.inventario).to.have.property('codInventario');
                    expect(res.body.inventario).to.have.property('responsable');
                    expect(res.body.inventario).to.have.property('numSerial');
                    expect(res.body.inventario).to.have.property('nombreMarca');
                    expect(res.body.inventario).to.have.property('estado');
                    expect(res.body.inventario).to.have.property('ubicacion');
                    expect(res.body.inventario).to.have.property('costoInicial');
                    expect(res.body.inventario).to.have.property('fechaAceptacion');
                    expect(res.body.inventario).to.have.property('codLab');
                    expect(res.body.inventario).to.have.property('nomLab');
                    expect(res.body.inventario).to.have.property('sede');
                    expect(res.body.inventario).to.have.property('edificio');
                    expect(res.body.inventario).to.have.property('espacio');
                }
                done();
            });

        });
    });


});
