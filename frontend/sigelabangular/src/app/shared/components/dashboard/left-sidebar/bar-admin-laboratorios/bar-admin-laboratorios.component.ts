import { ObservablesService } from './../../../../services/observables.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestoreCollection, AngularFirestore } from 'angularfire2/firestore';
import { Observable } from '@firebase/util';

@Component({
  selector: 'app-bar-admin-laboratorios',
  templateUrl: './bar-admin-laboratorios.component.html',
  styleUrls: ['./bar-admin-laboratorios.component.css']
})
export class BarAdminLaboratoriosComponent implements OnInit {

  laboratorios2 = [];
  // INICIALIZACION DE CONSULTAS PARA LABORATORIOS
  private labsColection: AngularFirestoreCollection<any>;
  labs: Observable<any[]>;

  datosLabsEstructurados = [];

  user: any;

  constructor(private obs: ObservablesService, private route: Router, private afs: AngularFirestore) { }

  ngOnInit() {
    if (localStorage.getItem('usuario')) {
      this.getUserId();
      this.getPersonId(this.user.uid).subscribe(person => {
        this.getLaboratorios(person.payload.data().cfPers).subscribe(labs => {
          this.laboratorios2 = this.estructurarDataLab(labs);

        });

      });



    }
  }

  getUserId() {
    this.user = JSON.parse(localStorage.getItem('usuario'));
  }

  getPersonId(userid) {
    return this.afs.doc('user/' + userid).snapshotChanges();
  }

  // METODO QUE TRAE LA COLECCION DE TODOS LOS LABORATORIOS
  getLaboratorios(persid) {
    this.labsColection = this.afs.collection<any>('cfFacil',
      ref => ref.where('facilityAdmin', '==', persid));
    return this.labsColection.valueChanges();
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
               // convertir boolean a cadena de caracteres para estado del laboratorio
              let estadoLab;
               if (elemento.active === true) {
                estadoLab = 'Activo';
               } else if ( elemento.active === false ) {
                estadoLab = 'Inactivo';
               }
              const laboratorio = {
                nombre: this.ajustarTexto(elemento.cfName),
                escuela: elemento.knowledgeArea,
                inves: elemento.researchGroup,
                director: duenoLab.cfFirstNames + ' ' + duenoLab.cfFamilyNames,
                coord: {lat: espacioLab.spaceData.geoRep.longitud, lon: espacioLab.spaceData.geoRep.latitud},
                info: {dir: elemento.otros.direccion, tel: elemento.otros.telefono, cel: '', email: elemento.otros.email},
                servicios: this.estructurarServicios(elemento.relatedServices).arr,
                practicas: this.estructurarPracticas(elemento.relatedPractices),
                equipos: this.estructurarEquipos(elemento.relatedEquipments),
                personal: this.estructurarPersonas(elemento.relatedPers),
                proyectos: this.estructurarProyectos(elemento.relatedProjects),
                solicitudes: this.estructurarServicios(elemento.relatedServices).arr2,
                estado: estadoLab
              };

                this.datosLabsEstructurados.push(laboratorio);
            });

          }
       });

      }

     // this.estructurarServicios(data[0].relatedServices);


      return this.datosLabsEstructurados;
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
    const arr2 = [];

    for (const clave in item) {
      // Controlando que json realmente tenga esa propiedad
      if (item.hasOwnProperty(clave)) {

        if (item[clave]) {
          this.afs.doc('cfSrv/' + clave).snapshotChanges().subscribe(data => {
            const servicio =  data.payload.data();

            this.afs.collection<any>('cfSrvReserv',
            ref => ref.where('cfSrv', '==', clave).where('status', '==', 'creada'))
            .snapshotChanges().subscribe(dataSol => {

              const serv = {
               nombre: servicio.cfName,
               descripcion: servicio.cfDesc,
               precio: servicio.cfPrice,
               activo: servicio.active,
               uid: data.payload.id
              };
              arr.push(serv);

              for (let i = 0; i < dataSol.length; i++) {
                const element = dataSol[i].payload.doc.data();
                this.getPersonId(element.user).subscribe(usuario => {
                  const solicitud = {
                    nombreServ: servicio.cfName,
                    descripcionServ: servicio.cfDesc,
                    precioServ: servicio.cfPrice,
                    activoServ: servicio.active,
                    email: usuario.payload.data().email,
                    uidServ: dataSol[i].payload.doc.id,
                    estado: element.status
                  };

                  arr2.push(solicitud);
                });

              }


            });

           });
        }

      }
    }

    return {arr, arr2};
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
            this.afs.doc('itempractice/' + clave ).collection('programmingData').valueChanges().subscribe(data2 => {

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
                  activo: equip.active,
                  precio: equip.price
                };

                arr.push(equipo);


           });
        }

      }
    }

    return arr;
  }


    // METODO QUE ESTRUCTURA LA DATA DE LAS PRACTICAS EN LA VISTA BUSQUEDA DE LABORATORIOS
  // RECIBE EL NODO DE LABORATORIO QUE CONTIENE LAS PRACTICAS ASOCIADOS
  estructurarPersonas(item) {

    const arr = [];

    for (const clave in item) {
      // Controlando que json realmente tenga esa propiedad
      if (item.hasOwnProperty(clave)) {

        if (item[clave]) {
           this.afs.doc('cfPers/' + clave).snapshotChanges().subscribe(data => {
            const pers =  data.payload.data();

            this.afs.doc('user/' + pers.user).snapshotChanges().subscribe(dataper => {
              // funciona con una programacion, cuando hayan mas toca crear otro metodo
              console.log(dataper.payload.data());
              const persona = {
                nombre: pers.cfFirstNames + ' ' + pers.cfFamilyNames,
                activo: pers.active,
                email: dataper.payload.data().email
              };

              arr.push(persona);
            });
           });
        }

      }
    }

    return arr;
  }


    // METODO QUE ESTRUCTURA LA DATA DE LAS PRACTICAS EN LA VISTA BUSQUEDA DE LABORATORIOS
  // RECIBE EL NODO DE LABORATORIO QUE CONTIENE LAS PRACTICAS ASOCIADOS
  estructurarProyectos(item) {

    const arr = [];

    for (const clave in item) {
      // Controlando que json realmente tenga esa propiedad
      if (item.hasOwnProperty(clave)) {

        if (item[clave]) {
           this.afs.doc('project/' + clave).snapshotChanges().subscribe(data => {
            const project =  data.payload.data();

              // funciona con una programacion, cuando hayan mas toca crear otro metodo
              const proyecto = {
                nombre: project.projectName,
                descripcion: project.projectDesc,
                id: project.ciNumber
              };

              arr.push(proyecto);

           });
        }

      }
    }

    return arr;
  }

  // METODO QUE ESTRUCTURA LA DATA DE LAS PRACTICAS EN LA VISTA BUSQUEDA DE LABORATORIOS
  // RECIBE EL NODO DE LABORATORIO QUE CONTIENE LAS PRACTICAS ASOCIADOS
  estructurarSolicitudesActivas(item) {

    const arr = [];

    for (const clave in item) {
      // Controlando que json realmente tenga esa propiedad
      if (item.hasOwnProperty(clave)) {

        if (item[clave]) {



        }

      }
    }

    return arr;
  }

  // METODO QUE AJUSTA EL NOMBRE DEL LABORATORIO PARA EL SIDEBAR
  ajustarTexto(nombre) {
    const nombreArr = nombre.split(' ');
    let name1 = '';
    let name2 = '';
    for (let i = 0; i < nombreArr.length; i++) {
      if (i < 3) {
        name1 += nombreArr[i] + ' ';
      } else {
        name2 += nombreArr[i] + ' ';
      }
    }

    return {nom1: name1, nom2: name2};
  }

  enviaritem(item) {
    this.obs.changeObject(item);
  }


  enviaritemSolicitudServicios(item) {
/*
    this.obs.changeSolServ(this.servicioso);
    this.obs.changeHistoSolserv(this.servicioshechos); */

  }

}
