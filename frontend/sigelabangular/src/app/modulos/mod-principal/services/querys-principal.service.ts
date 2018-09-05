import { AngularFirestoreCollection, AngularFirestore } from 'angularfire2/firestore';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

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

  constructor(private afs: AngularFirestore) {

   }

  // METODO QUE TRAE LA COLECCION DE TODOS LOS LABORATORIOS
  getLaboratorios() {
    this.labsCollection = this.afs.collection<any>('cfFacil');
    this.labs = this.labsCollection.snapshotChanges();

    return this.labs;
  }

  // METODO QUE TRAE LA COLECCION DE TODOS LOS SERVICIOS
  getServicios() {
    this.servsCollection = this.afs.collection<any>('cfSrv');
    // this.servs = this.servsCollection.valueChanges();

    return this.servsCollection.snapshotChanges();

  }

  // tslint:disable-next-line:member-ordering
  private racesCollection: AngularFirestoreCollection<any>;
  // METODO QUE TRAE LA COLECCION DE TODOS LAS PRUEBAS
  getPruebas() {
    this.racesCollection = this.afs.collection<any>('practice');

    return this.racesCollection.snapshotChanges();

  }

   // METODO QUE ESTRUCTURA LA DATA PARA LA VISTA BUSQUEDA DE LABORATORIOS
  estructurarDataLab(data: any) {

    this.datosLabsEstructurados = [];

    for (let index = 0; index < data.length; index++) {

      const elemento = data[index].payload.doc.data();
      console.log(elemento);
      if(elemento.facilityAdmin !== '') {
        this.buscarDirector(elemento.facilityAdmin).subscribe(dueno => {
          const duenoLab = dueno.payload.data();
          if (duenoLab && elemento.otros) {

            if (elemento.mainSpace !== '') {

              this.buscarEspacio(elemento.mainSpace).subscribe(espacio => {

                const espacioLab = espacio.payload.data();

                this.buscarDireccion(elemento.headquarter,elemento.subHq,elemento.mainSpace).then(direspa=>{
                  const laboratorio = {
                    uid: data[index].payload.doc.id,
                    nombre: elemento.cfName,
                    escuela: elemento.knowledgeArea,
                    inves: elemento.researchGroup,
                    desc: elemento.cfDescr,
                    direspacio: direspa,
                    director: duenoLab.cfFirstNames + ' ' + duenoLab.cfFamilyNames,
                    coord: {lat: espacioLab.spaceData.geoRep.longitud, lon: espacioLab.spaceData.geoRep.latitud},
                    info: {dir: elemento.otros.direccion, tel: elemento.otros.telefono, cel: '', email: elemento.otros.email},
                    servicios: this.estructurarServicios(elemento.relatedServices),
                    practicas: this.estructurarPracticas(elemento.relatedPractices),
                    condiciones: elemento.cfConditions,
                    disponibilidad: elemento.cfAvailability
                  };

                    this.datosLabsEstructurados.push(laboratorio);
                });

              });
            }

          }
       });
      }


    }

   console.log(this.datosLabsEstructurados);

    return this.datosLabsEstructurados;
  }

  // METODO QUE ESTRUCTURA LA DATA PARA LA VISTA BUSQUEDA DE SERVICIOS
  estructurarDataServ(data: any) {

    this.datosServEstructurados = [];

    for (let index = 0; index < data.length; index++) {
      const elemento = data[index].payload.doc.data();

      if (elemento.cfFacil) {
        this.buscarLaboratorio(elemento.cfFacil).subscribe(lab => {
          const labencontrado = lab.payload.data();

          if (labencontrado) {
            this.buscarDirector(labencontrado.facilityAdmin).subscribe(dueno => {
              const duenoLab = dueno.payload.data();
              if (duenoLab && labencontrado.mainSpace) {

                this.buscarEspacio(labencontrado.mainSpace).subscribe(espacio => {

                  const espacioLab = espacio.payload.data();

                  this.buscarDireccion(labencontrado.headquarter,labencontrado.subHq,labencontrado.mainSpace).then(direspa=>{
                    const servicios = {
                      nombreserv: elemento.cfName,
                      nombrelab: labencontrado.cfName,
                      infoServ: {
                        descripcion: elemento.cfDesc,
                        precio: elemento.cfPrice,
                        variaciones: this.variations(data[index].payload.doc.id),
                        equipos: this.estructurarEquipos(elemento.relatedEquipments),
                        condiciones: elemento.cfCondition,
                        uid: data[index].payload.doc.id
                      },
                      infoLab: {
                        uid: elemento.cfFacil,
                        direspacio: direspa,
                        tel: labencontrado.otros.telefono,
                        cel: '',
                        desc: labencontrado.cfDescr,
                        email: labencontrado.otros.email,
                        escuela: labencontrado.knowledgeArea,
                        inves: labencontrado.researchGroup,
                        director: duenoLab.cfFirstNames + ' ' + duenoLab.cfFamilyNames,
                        condiciones: labencontrado.cfConditions,
                        disponibilidad: labencontrado.cfAvailability},

                      coord: {lat: espacioLab.spaceData.geoRep.longitud, lon: espacioLab.spaceData.geoRep.latitud}
                    };

                    this.datosServEstructurados.push(servicios);
                  });

                });

              }
           });
          }



        });
      }

    }

    return this.datosServEstructurados;
  }

  // METODO QUE ESTRUCTURA LA DATA PARA LA VISTA BUSQUEDA DE PRUEBAS
  estructurarDataPruebas(data: any) {

    this.datosPrubEstructurados = [];


    for (let index = 0; index < data.length; index++) {
      const elemento = data[index].payload.doc.data();

      this.afs.doc('practice/' + data[index].payload.doc.id).collection('programmingData').snapshotChanges().subscribe(data2 => {

        // funciona con una programacion, cuando hayan mas toca crear otro metodo
        const prog = data2[0].payload.doc.data();

        this.buscarLaboratorio(elemento.cfFacil).subscribe(lab => {
          const labencontrado = lab.payload.data();

          this.buscarDirector(labencontrado.facilityAdmin).subscribe(dueno => {
            const duenoLab = dueno.payload.data();
            if (duenoLab && labencontrado.mainSpace) {

              this.buscarEspacio(labencontrado.mainSpace).subscribe(espacio => {

                const espacioLab = espacio.payload.data();
                  let estado;
                 // cambiar variable boolean a cadena de caracteres
                 if (elemento.active === true) {
                    estado = 'activo';
                 } else if (elemento.active === false ) {
                   estado = 'inactivo';

                 }

                const pruebas = {
                  nombreprub: elemento.practiceName,
                  nombrelab: labencontrado.cfName,
                  infoPrub: {
                    programacion: {
                      id_pro: data2[0].payload.doc.id,
                      estudiantes: prog.noStudents,
                      horario: prog.schedule,
                      semestre: prog.semester
                    },

                    activo: estado
                  },
                  infoLab: {
                    dir: labencontrado.otros.direccion,
                    tel: labencontrado.otros.telefono,
                    cel: '',
                    email: labencontrado.otros.email,
                    escuela: labencontrado.knowledgeArea,
                    inves: labencontrado.researchGroup,
                    director: duenoLab.cfFirstNames + ' ' + duenoLab.cfFamilyNames},
                  coord: {lat: espacioLab.spaceData.geoRep.longitud, lon: espacioLab.spaceData.geoRep.latitud}
                };

                this.datosPrubEstructurados.push(pruebas);
              });

            }
          });


        });
      });


    }
    return this.datosPrubEstructurados;
  }


   // METODO QUE ESTRUCTURA LA DATA DE LAS PRACTICAS EN LA VISTA BUSQUEDA DE LABORATORIOS
  // RECIBE EL NODO DE LABORATORIO QUE CONTIENE LAS PRACTICAS ASOCIADOS
  estructurarEquipos(item) {

    const arr = [];

    for (const clave in item) {
      // Controlando que json realmente tenga esa propiedad
      if (item.hasOwnProperty(clave)) {

        if (item[clave]) {
           this.afs.doc('cfEquip/' + clave).snapshotChanges().subscribe(data => {
           const equip =  data.payload.data();

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
    return this.afs.doc('cfFacil/' + idLab).snapshotChanges();
  }

  // METODO QUE TRAE UN DIRECTOR ESPECIFICO DEPENDIENDO EL ID-DIRECTOR
  buscarDirector(iddirector) {
    return this.afs.doc('cfPers/' + iddirector).snapshotChanges();

  }

  // METODO QUE TRAE UN ESPACIO ESPECIFICO DEPENDIENDO EL ID-ESPACIO
  buscarEspacio(idespacio) {
    return this.afs.doc('space/' + idespacio).snapshotChanges();
  }

  buscarDireccion(sede, subsede, espacio){
    let direccion = '';
    let espa = '';
    const promise = new Promise((resolve, reject) => {
      this.afs.doc('headquarter/' + sede).ref.get().then(sedereturn => {
        this.afs.doc('cfPAddr/' + subsede).ref.get().then(subreturn => {
          this.afs.doc('space/' + espacio).ref.get().then(espareturn => {
            direccion = sedereturn.data().cfName + ' ' + subreturn.data().cfAddrline2
                        + ' ' + subreturn.data().cfAddrline1;
            espa = espareturn.data().spaceData.building;

            resolve({dir:direccion, espa: espa});
          });
        });
      });
    })

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
          this.afs.doc('cfSrv/' + clave).snapshotChanges().subscribe(data => {
           const servicio =  data.payload.data();

           if (servicio.cfName) {
            const serv = {
              nombre: servicio.cfName,
              descripcion: servicio.cfDesc,
              precio: servicio.cfPrice,
              activo: servicio.active,
              equipos: this.estructurarEquipos(servicio.relatedEquipments),
              condiciones: servicio.cfCondition,
              variaciones: this.variations(clave),
              uid: data.payload.id
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

    for (const clave in item) {
      // Controlando que json realmente tenga esa propiedad
      if (item.hasOwnProperty(clave)) {

        if (item[clave]) {
           this.afs.doc('practice/' + clave).snapshotChanges().subscribe(data => {
           const practica =  data.payload.data();
            this.afs.doc('practice/' + clave ).collection('programmingData').snapshotChanges().subscribe(data2 => {

              // funciona con una programacion, cuando hayan mas toca crear otro metodo
              const prog = data2[0].payload.doc.data();

              const pract = {
                nombre: practica.practiceName,
                programacion: {
                  id_pro: data2[0].payload.doc.id,
                  estudiantes: prog.noStudents,
                  horario: prog.schedule,
                  semestre: prog.semester
                },
                activo: practica.active
               };

               arr.push(pract);

              });

           });
        }

      }
    }

    return arr;
  }

  // METODO QUE ESTRUCTURA LAS VARIACIONES DE UN SERVICIO
  variations(clave){

    const variaciones = [];
    this.afs.doc('cfSrv/' + clave).collection('variations').snapshotChanges().subscribe(data => {
      if(data){
        for (let i = 0; i < data.length; i++) {
          const element = data[i].payload.doc.data();

          variaciones.push({data: element, id: data[i].payload.doc.id});
        }
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


}
