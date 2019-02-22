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

@Injectable()
export class QuerysPrincipalService {

  // INICIALIZACION DE CONSULTAS PARA LABORATORIOS
  private labsCollection: AngularFirestoreCollection < any > ;
  labs: Observable < any[] > ;

  // INICIALIZACION DE CONSULTAS PARA SERVICIOS
  private servsCollection: AngularFirestoreCollection < any > ;
  servs: Observable < any[] > ;

  // INICIALIZACION DE CONSULTAS PARA SERVICIOS
  private pruebasCollection: AngularFirestoreCollection < any > ;
  pruebas: Observable < any[] > ;


  datosLabsEstructurados = [];
  datosServEstructurados = [];
  datosPrubEstructurados = [];

  constructor(private afs: AngularFirestore, private http: Http) {

  }

  // METODO QUE TRAE LA COLECCION DE TODOS LOS LABORATORIOS
  getLaboratorios() {
    const colle = this.afs.collection('cfFacil');
    return colle.ref.where('active', '==', true).get();

  }

  // METODO QUE TRAE LA COLECCION DE TODOS LOS SERVICIOS
  getServicios() {
    const coll = this.afs.collection('cfSrv');
    const refer = coll.ref.where('active', '==', true);
    // this.servs = this.servsCollection.valueChanges();

    return refer.get();

  }

  // tslint:disable-next-line:member-ordering
  private racesCollection: AngularFirestoreCollection < any > ;
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

        if ( elemento.facilityAdmin === '' ) {

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


  }


























  // METODO QUE ESTRUCTURA LA DATA PARA LA VISTA BUSQUEDA DE LABORATORIOS
  estructurarDataLab(data: any) {
    this.datosLabsEstructurados = [];

    const promise = new Promise((resolve, reject) => {

      data.forEach(doc => {

        const elemento = doc.data();
        if (elemento.facilityAdmin !== '') {
          this.buscarDirector(elemento.facilityAdmin).then(dueno => {
            const duenoLab = dueno.data();

            if (duenoLab && elemento.otros) {

              if (elemento.mainSpace !== '') {

                this.buscarEspacio(elemento.mainSpace).then(espacio => {

                  const espacioLab = espacio.data();

                  this.buscarDireccion(elemento.headquarter, elemento.subHq, elemento.mainSpace).then(direspa => {
                    const laboratorio = {
                      uid: doc.id,
                      nombre: elemento.cfName,
                      escuela: elemento.knowledgeArea !== '' ? elemento.knowledgeArea : 'ninguno',
                      inves: elemento.researchGroup !== '' ? elemento.researchGroup : 'ninguno',
                      iddirecto: elemento.facilityAdmin,
                      desc: elemento.cfDescr,
                      direspacio: direspa,
                      director: duenoLab.cfFirstNames + ' ' + duenoLab.cfFamilyNames,
                      emaildir: duenoLab.email,
                      coord: {
                        lat: espacioLab.spaceData.geoRep ? espacioLab.spaceData.geoRep.longitud : 0,
                        lon: espacioLab.spaceData.geoRep ? espacioLab.spaceData.geoRep.latitud : 0
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

                    this.datosLabsEstructurados.push(laboratorio);

                    // console.log(this.datosLabsEstructurados, data.size);
                    if (this.datosLabsEstructurados.length === data.size) {
                      resolve({
                        data: this.datosLabsEstructurados
                      });
                    }
                  });

                });
              }

            }
          });
        }

      });
    });


    return promise;
  }

  // METODO QUE ESTRUCTURA LA DATA PARA LA VISTA BUSQUEDA DE SERVICIOS
  estructurarDataServ(data: any) {

    let promise = new Promise((resolve, reject) => {
      this.datosServEstructurados = [];
      console.log(data.size);
      if (data.size != 0) {
        data.forEach(doc => {
          const elemento = doc.data();

          if (elemento.active) {
            if (elemento.cfFacil) {
              this.buscarLaboratorio(elemento.cfFacil).then(lab => {
                const labencontrado = lab.data();

                if (labencontrado) {
                  this.buscarDirector(labencontrado.facilityAdmin).then(dueno => {
                    const duenoLab = dueno.data();
                    if (duenoLab && labencontrado.mainSpace) {

                      this.buscarEspacio(labencontrado.mainSpace).then(espacio => {

                        const espacioLab = espacio.data();

                        this.buscarDireccion(labencontrado.headquarter, labencontrado.subHq, labencontrado.mainSpace).then(direspa => {
                          const servicios = {
                            nombreserv: elemento.cfName,
                            nombrelab: labencontrado.cfName,
                            infoServ: {
                              descripcion: elemento.cfDesc,
                              precio: elemento.cfPrice,
                              variaciones: this.variations(doc.id),
                              equipos: this.estructurarEquipos(elemento.relatedEquipments),
                              condiciones: elemento.cfCondition,
                              parametros: elemento.parametros,
                              descuento: elemento.descuento,
                              uid: doc.id
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


                          this.datosServEstructurados.push(servicios);

                          if (this.datosServEstructurados.length == data.size) {
                            resolve({
                              data: this.datosServEstructurados
                            });
                          }
                        });

                      });

                    }
                  });
                }

              });
            }
          }

        });
      } else {
        reject();
      }

    });


    return promise;
  }

  // METODO QUE ESTRUCTURA LA DATA PARA LA VISTA BUSQUEDA DE PRUEBAS
  estructurarDataPruebas(data: any) {

    let promise = new Promise((resolve, reject) => {
      this.datosPrubEstructurados = [];

      if (data.size != 0) {
        data.forEach(doc => {
          const elemento = doc.data();
          if (elemento.active) {

            this.afs.doc('practice/' + doc.id).collection('programmingData').snapshotChanges().subscribe(data2 => {

              // funciona con una programacion, cuando hayan mas toca crear otro metodo
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

                      if (this.datosPrubEstructurados.length == data.size) {
                        resolve({
                          data: this.datosPrubEstructurados
                        });
                      }
                    });

                  }
                });


              });
            });
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


  // METODO QUE TRAE UN LABORATORIO ESPECIFICO DEPENDIENDO EL ID-LABORATORIO
  buscarLaboratorio(idLab) {
    return this.afs.doc('cfFacil/' + idLab).ref.get();
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

    const arr = [];

    for (const clave in item) {
      // Controlando que json realmente tenga esa propiedad
      if (item.hasOwnProperty(clave)) {

        if (item[clave]) {
          this.afs.doc('cfSrv/' + clave).ref.get().then(data => {
            const servicio = data.data();

            if (servicio.cfName) {
              const serv = {
                nombre: servicio.cfName,
                descripcion: servicio.cfDesc,
                precio: servicio.cfPrice,
                activo: servicio.active,
                equipos: this.estructurarEquipos(servicio.relatedEquipments),
                condiciones: servicio.cfCondition,
                descuento: servicio.descuento,
                parametros: servicio.parametros,
                variaciones: this.variations(clave),
                uid: data.id
              };
              arr.push(serv);
            }

          });
        }

      }
    }

    return arr;
  }

  // METODO QUE ESTRUCTURA LA DATA DE LAS PRACTICAS EN LA VISTA BUSQUEDA DE LABORATORIOS
  // RECIBE EL NODO DE LABORATORIO QUE CONTIENE LAS PRACTICAS ASOCIADOS
  estructurarPracticas(item) {


  const arr = [];
   if (item) {

     for (const clave in item) {
       // Controlando que json realmente tenga esa propiedad
       if (item.hasOwnProperty(clave)) {

         if (item[clave]) {
           this.afs.doc('practice/' + clave).ref.get().then(data => {

             if (!data.exists) {
               console.log(data.id);
             }
             const practica = data.data();
             this.afs.doc('practice/' + clave).collection('programmingData').ref.get().then(data2 => {

               // funciona con una programacion, cuando hayan mas toca crear otro metodo
               if (data2.docs[0].exists) {
                 const prog = data2.docs[0].data();

                 const pract = {
                   nombre: practica.practiceName,
                   id : data.id,
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

             }).catch( err =>  console.log(err));

           });
         }

       }
     }
   }

    return arr;
  }

  estructuraTelefonos(idlab) {
    let tels = [];
    this.afs.doc('cfFacil/' + idlab).collection('cfEAddr').ref.get().then(data => {
      data.forEach(element => {
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
    const asunto = 'NUEVA SOLICITTUD DE SERVICIO';
    let destino = '';
    if (analistas) {
      for (let i = 0; i < analistas.length; i++) {
        destino += analistas[i] + ','
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
      if (res.status == 200) {
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
            if (doc.data().user != '') {
              this.buscarUsuario(doc.data().user).then(user => {
                if (user) {
                  for (const key in user.data().appRoles) {
                    if (user.data().appRoles.hasOwnProperty(key)) {
                      if (user.data().appRoles[key]) {
                        if (key == '6ITqecW7XrgTLaW6fpn6') {
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



}
