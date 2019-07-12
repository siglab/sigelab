import {
  AngularFirestoreCollection,
  AngularFirestore
} from 'angularfire2/firestore';
import {
  Injectable
} from '@angular/core';
import {
  Observable
} from 'rxjs/Observable';
import {
  Http
} from '@angular/http';
import {
  URLCORREO
} from '../../../config';
import { promise } from 'protractor';

@Injectable()
export class QuerysPrincipalService {

  // INICIALIZACION DE CONSULTAS PARA LABORATORIOS
  private labsCollection: AngularFirestoreCollection<any>;
  labs: Observable<any[]>;

  // INICIALIZACION DE CONSULTAS PARA SERVICIOS
  private servsCollection: AngularFirestoreCollection<any>;
  servs: Observable<any[]>;

  // INICIALIZACION DE CONSULTAS PARA SERVICIOS
  private pruebasCollection: AngularFirestoreCollection<any>;
  pruebas: Observable<any[]>;


  datosLabsEstructurados = [];
  datosServEstructurados = [];
  datosPrubEstructurados = [];

  constructor(private afs: AngularFirestore, private http: Http) {

  }

  // METODO QUE TRAE LA COLECCION DE TODOS LOS LABORATORIOS
  getLaboratorios() {
    const colle = this.afs.collection('cache').doc('cfFacil');
    return colle.ref.get();
  }

  // METODO QUE TRAE LA COLECCION DE TODOS LOS SERVICIOS
  getServicios() {
    const colle = this.afs.collection('cache').doc('cfSrv');
    return colle.ref.get();
  }

  // tslint:disable-next-line:member-ordering
  private racesCollection: AngularFirestoreCollection<any>;
  // METODO QUE TRAE LA COLECCION DE TODOS LAS PRUEBAS
  getPruebas() {
    const coll = this.afs.collection('practice');
    const ref = coll.ref.where('active', '==', true);

    return ref.get();

  }


  // estructurar datos lab 2.0
  async estructurarDataCf(data: any) {

    console.log('entro');
    this.datosLabsEstructurados = [];

    return new Promise((resolve, reject) => {
      data.forEach(doc => {
        const elemento = doc.data();

        if (elemento.facilityAdmin === '') {

          console.log(doc.id);

        }

        this.buscarDirector(elemento.facilityAdmin).then(adminlab => {
          const duenoLab = adminlab.data();
          console.log(adminlab.exists);


          this.datosLabsEstructurados.push(elemento);

          // console.log(this.datosLabsEstructurados, data.size);
          if (this.datosLabsEstructurados.length === data.size) {
            resolve({
              data: this.datosLabsEstructurados
            });
          }


        });

      });
    });


  }// METODO QUE ESTRUCTURA LA DATA PARA LA VISTA BUSQUEDA DE LABORATORIOS
  estructurarDataLab(data: any) {
    this.datosLabsEstructurados = [];
    var laboratorios = data.data()

    const promise = new Promise((resolve, reject) => {
      var cont = 0
      var datasize = Object.keys(data)

      for (const key in laboratorios) {
        if (laboratorios.hasOwnProperty(key)) {
          const laboratorio = laboratorios[key];

          if (laboratorio.active) {
            this.datosLabsEstructurados.push(laboratorio);

          }
          cont++

          if (cont === datasize.length) {
            resolve({
              data: this.datosLabsEstructurados
            });
          }
        }
      }

    });


    return promise;
  }
  // METODO QUE ESTRUCTURA LA DATA PARA LA VISTA BUSQUEDA DE LABORATORIOS
  estructurarDataLabAdmin(data: any) {
    this.datosLabsEstructurados = []
    var laboratorios = data.data()

    const promise = new Promise((resolve, reject) => {
      var cont = 0
      var datasize = Object.keys(data)

      for (const key in laboratorios) {
        if (laboratorios.hasOwnProperty(key)) {
          const laboratorio = laboratorios[key]
          if (laboratorio.active) {
            laboratorio.active = 'Activo'
          } else {
            laboratorio.active = 'Inactivo'
          }
          this.datosLabsEstructurados.push(laboratorio)

          cont++

          if (cont === datasize.length) {
            resolve({
              data: this.datosLabsEstructurados
            })
          }
        }
      }

    });


    return promise
  }


  // METODO QUE ESTRUCTURA LA DATA PARA LA VISTA BUSQUEDA DE LABORATORIOS
  estructurarDataServ(data: any) {
    this.datosServEstructurados = [];
    var servicios = data.data()

    const promise = new Promise((resolve, reject) => {
      var cont = 0
      var datasize = Object.keys(servicios)

      for (const key in servicios) {
        if (servicios.hasOwnProperty(key)) {
          const laboratorio = servicios[key];

          if (laboratorio.active) {
            this.datosServEstructurados.push(laboratorio);

          }
          cont++
          if (cont === datasize.length) {
            resolve({
              data: this.datosServEstructurados
            });
          }
        }
      }

    });


    return promise;
  }
  //VIEJO!!!
  // METODO QUE ESTRUCTURA LA DATA PARA LA VISTA BUSQUEDA DE SERVICIOS   
  getDataServ(data: any) {

    return this.buscarServicio(data.uid).then(serv => {
      const elemento = serv.data();

      if (elemento.active) {
        if (elemento.cfFacil) {
        return  this.buscarLaboratorio(elemento.cfFacil).then(lab => {
            const labencontrado = lab.data();

            if (labencontrado) {
              return this.buscarDirector(labencontrado.facilityAdmin).then(dueno => {
                const duenoLab = dueno.data();
                if (duenoLab && labencontrado.mainSpace) {

                  return this.buscarEspacio(labencontrado.mainSpace).then(espacio => {

                    const espacioLab = espacio.data();

                   return  this.buscarDireccion(labencontrado.headquarter, labencontrado.subHq, labencontrado.mainSpace).then(direspa => {
                      const servicios = {
                        nombreserv: elemento.cfName,
                        nombrelab: labencontrado.cfName,
                        infoServ: {
                          descripcion: elemento.cfDesc,
                          precio: elemento.cfPrice,
                          variaciones: this.variations(serv.id),
                          equipos: this.estructurarEquipos(elemento.relatedEquipments),
                          condiciones: elemento.cfCondition,
                          parametros: elemento.parametros,
                          descuento: elemento.descuento,
                          uid: serv.id
                        },
                        infoLab: {
                          uid: elemento.cfFacil,
                          direspacio: direspa,
                          telefonos: this.estructuraTelefonos(elemento.cfFacil),
                          personal: this.buscarAnalistas(labencontrado.relatedPers),
                          iddirecto: labencontrado.facilityAdmin,
                          desc: labencontrado.cfDescr,
                          email: labencontrado.otros.email,
                          escuela: labencontrado.knowledgeArea,
                          inves: labencontrado.researchGroup,
                          director: duenoLab.cfFirstNames + ' ' + duenoLab.cfFamilyNames,
                          emaildir: duenoLab.email,
                          condiciones: labencontrado.cfConditions,
                          disponibilidad: labencontrado.cfAvailability
                        },

                        coord: {
                          lat: espacioLab.spaceData.geoRep.longitud,
                          lon: espacioLab.spaceData.geoRep.latitud
                        }
                      };


                      return servicios


                    });

                  });

                }
              });
            }

          });
        }
      }


    })



  }

  // METODO QUE ESTRUCTURA LA DATA PARA LA VISTA BUSQUEDA DE PRUEBAS
  estructurarDataPruebas(data: any) {

    const promise = new Promise((resolve, reject) => {
      this.datosPrubEstructurados = [];

      if (data.size !== 0) {
        data.forEach(doc => {
          const elemento = doc.data();
          if (elemento.active) {

            console.log(doc.id);
            this.afs.doc('practice/' + doc.id).collection('programmingData').snapshotChanges().subscribe(data2 => {

              // funciona con una programacion, cuando hayan mas toca crear otro metodo

              if (!data2[0].payload.doc.exists) {

                console.log('id no existe', data2[0].payload.doc.id);
              }
              const prog = data2[0].payload.doc.data();

              this.buscarLaboratorio(elemento.cfFacil).then(lab => {
                const labencontrado = lab.data();

                this.buscarDirector(labencontrado.facilityAdmin).then(dueno => {
                  const duenoLab = dueno.data();
                  if (duenoLab && labencontrado.mainSpace) {

                    this.buscarEspacio(labencontrado.mainSpace).then(espacio => {

                      const espacioLab = espacio.data();

                      const pruebas = {
                        nombreprub: elemento.practiceName,
                        nombrelab: labencontrado.cfName,
                        infoPrub: {
                          programacion: {
                            id_pro: data2[0].payload.doc.id,
                            estudiantes: prog.noStudents,
                            horario: prog.schedule,
                            semestre: prog.semester
                          }
                        },
                        infoLab: {
                          dir: labencontrado.otros.direccion,
                          desc: labencontrado.cfDescr,
                          telefonos: this.estructuraTelefonos(elemento.cfFacil),
                          email: labencontrado.otros.email,
                          escuela: labencontrado.knowledgeArea,
                          inves: labencontrado.researchGroup,
                          director: duenoLab.cfFirstNames + ' ' + duenoLab.cfFamilyNames,
                          condiciones: labencontrado.cfConditions,
                          disponibilidad: labencontrado.cfAvailability
                        },
                        coord: {
                          lat: espacioLab.spaceData.geoRep.longitud,
                          lon: espacioLab.spaceData.geoRep.latitud
                        }
                      };

                      this.datosPrubEstructurados.push(pruebas);

                      if (this.datosPrubEstructurados.length === data.size) {
                        resolve({
                          data: this.datosPrubEstructurados
                        });
                      }
                    });

                  }
                });


              });
            }, err => console.log(err));
          }
        });
      } else {
        reject();
      }

    });


    return promise;
  }


  // METODO QUE ESTRUCTURA LA DATA DE LAS PRACTICAS EN LA VISTA BUSQUEDA DE LABORATORIOS
  // RECIBE EL NODO DE LABORATORIO QUE CONTIENE LAS PRACTICAS ASOCIADOS
  estructurarEquipos(item) {

    const arr = [];

    for (const clave in item) {
      // Controlando que json realmente tenga esa propiedad
      if (item.hasOwnProperty(clave)) {

        if (item[clave]) {
          this.afs.doc('cfEquip/' + clave).ref.get().then(data => {
            const equip = data.data();

            // funciona con una programacion, cuando hayan mas toca crear otro metodo
            const equipo = {
              nombre: equip.cfName,
              descripcion: equip.cfDescr,
            };
            arr.push(equipo);
          });
        }

      }
    }

    return arr;
  }
  getDataLab(lab: any) {
    console.log(lab)
    return this.buscarLaboratorio(lab.uid).then(labsnapshot => {
      const elemento = labsnapshot.data()
      console.log(elemento)
      if (lab.facilityAdmin !== '') {
        return this.buscarDirector(elemento.facilityAdmin).then(dueno => {
          const duenoLab = dueno.data();
          var promesas = []
          var disponibilidad = []
          if (elemento.cfAvailability) {
            disponibilidad = elemento.cfAvailability
          }
          promesas.push(this.estructurarServicios(elemento.relatedServices))
          let laboratorio = {
            uid: labsnapshot.id,
            nombre: elemento.cfName,
            escuela: elemento.knowledgeArea !== '' ? elemento.knowledgeArea : 'ninguno',
            inves: elemento.researchGroup !== '' ? elemento.researchGroup : 'ninguno',
            iddirecto: elemento.facilityAdmin,
            desc: elemento.cfDescr,
            direspacio: {},
            director: '',
            emaildir: '',
            coord: {
              lat: 0,
              lon: 0
            },
            telefonos: this.estructuraTelefonos(labsnapshot.id),
            info: {
              email: elemento.otros.email
            },
            practicas: this.estructurarPracticas(elemento.relatedPractices),
            personal: this.buscarAnalistas(elemento.relatedPers),
            condiciones: elemento.cfConditions,
            disponibilidad: disponibilidad
          };

          if (duenoLab && elemento.otros) {

            laboratorio.director = duenoLab.cfFirstNames + ' ' + duenoLab.cfFamilyNames;
            laboratorio.emaildir = duenoLab.email;

          }

          if (elemento.mainSpace !== '') {

            var buscarespacios = this.buscarEspacio(elemento.mainSpace).then(espacio => {

              const espacioLab = espacio.data();
              return this.buscarDireccion(elemento.headquarter, elemento.subHq, elemento.mainSpace).then(direspa => {
                laboratorio.direspacio = direspa;

                laboratorio.coord.lat = espacioLab.spaceData.geoRep ? espacioLab.spaceData.geoRep.longitud : 0;
                laboratorio.coord.lon = espacioLab.spaceData.geoRep ? espacioLab.spaceData.geoRep.latitud : 0;
              });

            })
            promesas.push(buscarespacios)
          }


          return Promise.all(promesas).then(values => {
            console.log(439, values); // [3, 1337, "foo"] 
            laboratorio['servicios'] = values[0]
            return laboratorio
          });

        });
      }

    })




  }

  // METODO QUE TRAE UN LABORATORIO ESPECIFICO DEPENDIENDO EL ID-LABORATORIO
  buscarLaboratorio(idLab) {
    return this.afs.doc('cfFacil/' + idLab).ref.get();
  }

  // METODO QUE TRAE UN SERVICIO ESPECIFICO DEPENDIENDO EL ID-SERVICIO
  buscarServicio(idService) {
    return this.afs.doc('cfSrv/' + idService).ref.get();
  }
  // METODO QUE TRAE UN DIRECTOR ESPECIFICO DEPENDIENDO EL ID-DIRECTOR
  buscarDirector(iddirector) {
    return this.afs.doc('cfPers/' + iddirector).ref.get();

  }

  // METODO QUE TRAE UN ESPACIO ESPECIFICO DEPENDIENDO EL ID-ESPACIO
  buscarEspacio(idespacio) {
    return this.afs.doc('space/' + idespacio).ref.get();
  }

  buscarDireccion(sede, subsede, espacio) {
    let direccion = '';
    let espa = '';
    const promise = new Promise((resolve, reject) => {
      this.afs.doc('headquarter/' + sede).ref.get().then(sedereturn => {
        this.afs.doc('cfPAddr/' + subsede).ref.get().then(subreturn => {
          this.afs.doc('space/' + espacio).ref.get().then(espareturn => {
            direccion = sedereturn.data().cfName + ' ' + subreturn.data().cfAddrline2 +
              ' ' + subreturn.data().cfAddrline1;
            espa = espareturn.data().spaceData.building;

            resolve({
              dir: direccion,
              espa: espa
            });
          });
        });
      });
    });

    return promise;

  }



  // METODO QUE ESTRUCTURA LA DATA DE LOS SERVICIOS EN LA VISTA BUSQUEDA DE LABORATORIOS
  // RECIBE EL NODO DE LABORATORIO QUE CONTIENE LOS SERVICIOS ASOCIADOS
  estructurarServicios(item) {

    var arr = [];
    var promesas = []

    for (const clave in item) {
      // Controlando que json realmente tenga esa propiedad
      if (item.hasOwnProperty(clave)) {

        if (item[clave]) {
          var serv = this.afs.doc('cfSrv/' + clave).ref.get()
          promesas.push(serv)
        }

      }
    }

    return Promise.all(promesas).then(responses => {
      responses.forEach(data => {
        var servicio = data.data();

        if (servicio.cfName) {
          var serv = {
            nombre: servicio.cfName,
            descripcion: servicio.cfDesc,
            precio: servicio.cfPrice,
            activo: servicio.active,
            equipos: this.estructurarEquipos(servicio.relatedEquipments),
            condiciones: servicio.cfCondition,
            descuento: servicio.descuento,
            parametros: servicio.parametros,
            variaciones: this.variations(data.key),
            uid: data.id
          };
          arr.push(serv);
        }
      })
      console.log(arr)
      return arr
    })
  }

  // METODO QUE ESTRUCTURA LA DATA DE LAS PRACTICAS EN LA VISTA BUSQUEDA DE LABORATORIOS
  // RECIBE EL NODO DE LABORATORIO QUE CONTIENE LAS PRACTICAS ASOCIADOS
  estructurarPracticas(item) {
    const arr = [];
    if (item) {
      return new Promise((resolve, reject) => {
        var keys = Object.keys(item)
        var cont = 0
        for (const clave in item) {
          // Controlando que json realmente tenga esa propiedad
          cont++
          if (item.hasOwnProperty(clave)) {

            this.afs.doc('practice/' + clave).ref.get().then(data => {

              const practica = data.data();
              this.afs.doc('practice/' + clave).collection('programmingData').ref.get().then(data2 => {

                // funciona con una programacion, cuando hayan mas toca crear otro metodo
                if (data2.docs[0].exists) {
                  const prog = data2.docs[0].data();

                  const pract = {
                    nombre: practica.practiceName,
                    id: data.id,
                    programacion: {

                      id_pro: data2.docs[0].id,
                      estudiantes: prog.noStudents,
                      horario: prog.schedule,
                      semestre: prog.semester
                    },
                    activo: practica.active
                  };


                  if (practica.active) {
                    arr.push(pract);
                  }

                } else {

                  const pract = {
                    nombre: practica ? practica.practiceName : 'ninguno',
                    activo: practica ? practica.active : 'none'
                  };

                  if (practica.active) {
                    arr.push(pract);
                  }

                }
                if (cont == keys.length) {
                  resolve(arr)
                }

              }).catch(err => {
                if (cont == keys.length) {
                  resolve(arr)
                }
                console.log(err)
              });

            });


          }
        }
      });


    } else {
      return arr;
    }

  }

  estructuraTelefonos(idlab) {
    var tels = [];

    this.afs.doc('cfFacil/' + idlab).collection('cfEAddr').ref.get().then(data => {
      data.forEach(element => {
        console.log(element.data())

        tels.push(element.data().cfEAddrValue);
      });
    });
    return tels;

  }

  // METODO QUE ESTRUCTURA LAS VARIACIONES DE UN SERVICIO
  variations(clave) {

    const variaciones = [];
    this.afs.doc('cfSrv/' + clave).collection('variations').ref.get().then(data => {
      if (data) {
        data.forEach(doc => {
          const element = doc.data();

          if (element.active) {
            variaciones.push({
              data: element,
              id: doc.id
            });
          }
        });

      } else {
        return variaciones;
      }

    });
    return variaciones;
  }


  // METODO QUE AGREGA UNA NUEVA SOLICITUD DE SERVICIO
  addSolicitudServicio(item) {
    return this.afs.collection('cfSrvReserv').add(item);
  }


  addItem(item: any) {
    this.labsCollection.add(item);
  }


  enviarEmails(nombreserv, emailSolicitante, emailEncargado, emailLaboratorio, analistas) {


    const fecha = new Date();
    const fechaes = fecha.getDate() + '/' + (fecha.getMonth() + 1) + '/' + fecha.getFullYear();


    const url = URLCORREO;
    const asunto = 'NUEVA SOLICITUD DE SERVICIO';
    let destino = '';
    if (analistas) {
      for (let i = 0; i < analistas.length; i++) {
        destino += analistas[i] + ',';
      }
    }

    const mensaje = 'Se le notifica que se ha realizado una nueva solicitud del servicio: ' +
      nombreserv + ', esta fue solicitada en la fecha ' + fechaes +
      ' por el usuario con el correo: ' + emailSolicitante + '.';

    destino += emailSolicitante + ',' + emailEncargado + ',' + emailLaboratorio;


    console.log(destino);

    this.http.post(url, {
      para: destino,
      asunto: asunto,
      mensaje: mensaje
    }).subscribe((res) => {
      if (res.status === 200) {
        console.log('notificaciones enviadas');
      } else {
        console.log('error notificaciones');
      }
    });

  }

  buscarAnalistas(personas) {
    const arra = [];
    for (const key in personas) {
      if (personas.hasOwnProperty(key)) {

        if (personas[key]) {
          this.buscarDirector(key).then(doc => {
            if (doc.data().user !== '') {
              this.buscarUsuario(doc.data().user).then(user => {
                if (user) {
                  for (const key in user.data().appRoles) {
                    if (user.data().appRoles.hasOwnProperty(key)) {
                      if (user.data().appRoles[key]) {
                        if (key === '6ITqecW7XrgTLaW6fpn6') {
                          arra.push(doc.data().email);
                        }
                      }
                    }
                  }
                }

              });
            }

          });
        }

      }
    }

    return arra;
  }


  enviarNotificaciones(notificaciones, nombreserv, emailSolicitante) {
    console.log(notificaciones);
    const fecha = new Date().toISOString().split('T')[0];

    const mensaje = 'Se le notifica que se ha realizado una nueva solicitud del servicio: ' +
      nombreserv + ', esta fue solicitada en la fecha ' + fecha +
      ' por el usuario con el correo: ' + emailSolicitante + '.';

    const obj = {
      asunto: 'Solicitud de servicio',
      mensaje: mensaje,
      fecha: new Date().toISOString().split('T')[0],
      estado: 'sinver'
    };

    for (let i = 0; i < notificaciones.length; i++) {
      const element = notificaciones[i];

      this.enviarNotificacion(element, obj).then(() => {

      });

    }

  }


  buscarUsuario(id) {
    return this.afs.collection('user').doc(id).ref.get();
  }

  buscarUsuarioWithEmail(email) {
    const col = this.afs.collection('user');
    const refer = col.ref.where('email', '==', email);
    return refer.get();
  }

  enviarNotificacion(iduser, object) {
    return this.afs.doc('user/' + iduser).collection('notification').add(object);
  }
  //METODOS VIEJOS CON MUCHAS CONSULTAS
  old_estructurarDataLab(data: any) {
    this.datosLabsEstructurados = [];

    const promise = new Promise((resolve, reject) => {
      var cont = 0
      data.forEach(doc => {

        const elemento = doc.data();
        console.log(elemento.facilityAdmin)
        if (elemento.facilityAdmin !== '') {
          this.buscarDirector(elemento.facilityAdmin).then(dueno => {
            const duenoLab = dueno.data();

            const laboratorio = {
              uid: doc.id,
              nombre: elemento.cfName,
              escuela: elemento.knowledgeArea !== '' ? elemento.knowledgeArea : 'ninguno',
              inves: elemento.researchGroup !== '' ? elemento.researchGroup : 'ninguno',
              iddirecto: elemento.facilityAdmin,
              desc: elemento.cfDescr,
              direspacio: {},
              director: '',
              emaildir: '',
              coord: {
                lat: 0,
                lon: 0
              },
              telefonos: this.estructuraTelefonos(doc.id),
              info: {
                email: elemento.otros.email
              },
              servicios: this.estructurarServicios(elemento.relatedServices),
              practicas: this.estructurarPracticas(elemento.relatedPractices),
              personal: this.buscarAnalistas(elemento.relatedPers),
              condiciones: elemento.cfConditions,
              disponibilidad: elemento.cfAvailability
            };

            if (duenoLab && elemento.otros) {

              laboratorio.director = duenoLab.cfFirstNames + ' ' + duenoLab.cfFamilyNames;
              laboratorio.emaildir = duenoLab.email;

            }

            if (elemento.mainSpace !== '') {

              this.buscarEspacio(elemento.mainSpace).then(espacio => {

                const espacioLab = espacio.data();

                this.buscarDireccion(elemento.headquarter, elemento.subHq, elemento.mainSpace).then(direspa => {
                  laboratorio.direspacio = direspa;

                  laboratorio.coord.lat = espacioLab.spaceData.geoRep ? espacioLab.spaceData.geoRep.longitud : 0;
                  laboratorio.coord.lon = espacioLab.spaceData.geoRep ? espacioLab.spaceData.geoRep.latitud : 0;
                });

              });
            }

            cont++


            this.datosLabsEstructurados.push(laboratorio);

            console.log(this.datosLabsEstructurados, data.size, cont);
            if (cont === data.size) {
              resolve({
                data: this.datosLabsEstructurados
              });
            }
          });
        }

      });
    });


    return promise;
  }


}
