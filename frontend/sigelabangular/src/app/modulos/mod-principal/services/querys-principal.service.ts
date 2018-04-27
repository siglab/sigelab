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
    this.labs = this.labsCollection.valueChanges();

    return this.labs;
  }

  // METODO QUE TRAE LA COLECCION DE TODOS LOS SERVICIOS
  getServicios() {
    this.servsCollection = this.afs.collection<any>('cfSrv');
    this.servs = this.servsCollection.valueChanges();

    return this.servs;

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
      const elemento = data[index];

      this.buscarDirector(elemento.facilityAdmin).subscribe(dueno => {
        const duenoLab = dueno.payload.data();
        if (duenoLab && elemento.mainSpace) {

          this.buscarEspacio(elemento.mainSpace).subscribe(espacio => {

            const espacioLab = espacio.payload.data();

            const laboratorio = {
              nombre: elemento.cfName,
              escuela: elemento.knowledgeArea,
              inves: elemento.researchGroup,
              director: duenoLab.cfFirstNames + ' ' + duenoLab.cfFamilyNames,
              coord: {lat: espacioLab.spaceData.geoRep.longitud, lon: espacioLab.spaceData.geoRep.latitud},
              info: {dir: elemento.otros.direccion, tel: elemento.otros.telefono, cel: '', email: elemento.otros.email},
              servicios: this.estructurarServicios(elemento.relatedServices),
              practicas: this.estructurarPracticas(elemento.relatedPractices),
              estado: elemento.active
            };

              this.datosLabsEstructurados.push(laboratorio);
          });

        }
     });

    }

   // this.estructurarServicios(data[0].relatedServices);


    return this.datosLabsEstructurados;
  }

  // METODO QUE ESTRUCTURA LA DATA PARA LA VISTA BUSQUEDA DE SERVICIOS
  estructurarDataServ(data: any) {

    this.datosServEstructurados = [];

    for (let index = 0; index < data.length; index++) {
      const elemento = data[index];

      this.buscarLaboratorio(elemento.cfFacil).subscribe(lab => {
        const labencontrado = lab.payload.data();

        this.buscarDirector(labencontrado.facilityAdmin).subscribe(dueno => {
          const duenoLab = dueno.payload.data();
          if (duenoLab && labencontrado.mainSpace) {

            this.buscarEspacio(labencontrado.mainSpace).subscribe(espacio => {

              const espacioLab = espacio.payload.data();

              const servicios = {
                nombreserv: elemento.cfName,
                nombrelab: labencontrado.cfName,
                infoServ: {
                  descripcion: elemento.cfDesc,
                  precio: elemento.cfPrice,
                  estado: elemento.active
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

              this.datosServEstructurados.push(servicios);
            });

          }
       });


      });



    }

   // this.estructurarServicios(data[0].relatedServices);


    return this.datosServEstructurados;
  }

  // METODO QUE ESTRUCTURA LA DATA PARA LA VISTA BUSQUEDA DE PRUEBAS
  estructurarDataPruebas(data: any) {

    this.datosPrubEstructurados = [];


    for (let index = 0; index < data.length; index++) {
      const elemento = data[index].payload.doc.data();

      this.afs.doc('practice/' + data[index].payload.doc.id).collection('programmingData').valueChanges().subscribe(data2 => {

        // funciona con una programacion, cuando hayan mas toca crear otro metodo
        const prog = data2[0];

        this.buscarLaboratorio(elemento.cfFacil).subscribe(lab => {
          const labencontrado = lab.payload.data();

          this.buscarDirector(labencontrado.facilityAdmin).subscribe(dueno => {
            const duenoLab = dueno.payload.data();
            if (duenoLab && labencontrado.mainSpace) {

              this.buscarEspacio(labencontrado.mainSpace).subscribe(espacio => {

                const espacioLab = espacio.payload.data();

                const pruebas = {
                  nombreprub: elemento.practiceName,
                  nombrelab: labencontrado.cfName,
                  infoPrub: {
                    programacion: {
                      estudiantes: prog['noStudents'],
                      diahora: prog['schedule'],
                      semestre: prog['semester']
                    },
                    activo: elemento.active
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

console.log(this.datosPrubEstructurados);

    return this.datosPrubEstructurados;
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
             const serv = {
              nombre: servicio.cfName,
              descripcion: servicio.cfDesc,
              precio: servicio.cfPrice,
              activo: servicio.active
             };
             arr.push(serv);
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
            this.afs.doc('practice/' + clave ).collection('programmingData').valueChanges().subscribe(data2 => {

              // funciona con una programacion, cuando hayan mas toca crear otro metodo
              const prog = data2[0];

              const pract = {
                nombre: practica.practiceName,
                programacion: {
                  estudiantes: prog['noStudents'],
                  diahora: prog['schedule'],
                  semestre: prog['semester']
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


  addSolicitudServicio(item) {

  }


  addItem(item: any) {
    this.labsCollection.add(item);
  }


}
