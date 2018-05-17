import { ObservablesService } from './../../../../services/observables.service';
import { Component, OnInit } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from 'angularfire2/firestore';
import { Observable } from '@firebase/util';

@Component({
  selector: 'app-bar-admin-laboratorio-superior',
  templateUrl: './bar-admin-laboratorio-superior.component.html',
  styleUrls: ['./bar-admin-laboratorio-superior.component.css']
})
export class BarAdminLaboratorioSuperiorComponent implements OnInit {

  laboratorios = [{nombre: 'LABORATORIO CIENCIAS', coord: {lat: '3.425906', lon: '-76.540446'}, info: {dir: 'cra54 cambulos', tel: '53454636', cel: '43656537', email: 'jkhkhjk@univalle.edu.co'},
                   servicios: [{nombre: 'QUIMICA'}, {nombre: 'TERMODINAMICA'}, {nombre: 'FISICA'}], practicas: [{nombre: 'EXSS'}, {nombre: 'FGFGFG'}],
                   equipos: [{nombre: 'PORTATIL HP'}, {nombre: 'TELESCOPIO'}, {nombre: 'MICROSCOPIO'}],
                   personal: [{nombre: 'MBAPPE HERNANDEZ'}, {nombre: 'SAMIR ALBERTO'}, {nombre: 'FRANCISCO JULIAN'}],
                   proyectos: [{nombre: 'PROYECTO X'}, {nombre: 'PROYECTO Y'}, {nombre: 'PROYECTO Z'}],
                   solicitudes: [{nombre: 'SUR CALI'}, {nombre: 'AUTONOMA'}, {nombre: 'ICESI'}],
                   espacios: [{edificio: '1', planta: '002', espacio: '9002', estado: 'ACTIVO'}, {edificio: '2', planta: '004', espacio: '9006', estado: 'ACTIVO'}, {edificio: '9', planta: '004', espacio: '9009', estado: 'INACTIVO'}]},
                {nombre: 'LABORATORIO SOCIAES', coord: {lat: '3.419737', lon: '-76.540275'}, info: {dir: 'cra54 san fernado', tel: '53454543gdf636', cel: '43656537', email: 'fdgfgjh@univalle.edu.co'},
                  servicios: [{nombre: 'CUANTICA'}, {nombre: 'MATE'}, {nombre: 'BIOLOGIA'}], practicas: [{nombre: 'DFGDFGDF'}],
                  equipos: [{nombre: 'MARACA'}, {nombre: 'YODO'}, {nombre: 'CIANURO'}],
                  personal: [{nombre: 'JHON DIAZ'}, {nombre: 'JUAN ROBERTO'}, {nombre: 'JULIAN'}],
                  proyectos: [{nombre: 'PROYECTO R'}, {nombre: 'PROYECTO D'}, {nombre: 'PROYECTO G'}],
                  solicitudes: [{nombre: 'SANTIAGO'}, {nombre: 'AUTONOMA'}, {nombre: 'SANBUENAVENTURA'}],
                  espacios: [{edificio: '1', planta: '002', espacio: '9002', estado: 'ACTIVO'}]},
                {nombre: 'LABORATORIO X', coord: {lat: '3.420380', lon: '-76.510105'}, info: {dir: 'cra54 sfdfsdfs', tel: '35345435', cel: '436574676537', email: 'fgjh@univalle.edu.co'},
                  servicios: [{nombre: 'BUSQUEDA'}, {nombre: 'INVESTIGACION'}], practicas: [{nombre: 'HJGHJHJ'}],
                  equipos: [{nombre: 'SODIO'}, {nombre: 'CREMA'}, {nombre: 'BATOLA'}],
                  personal: [{nombre: 'SEBASTIAN'}, {nombre: 'JIGGY DRAMA'}, {nombre: 'FRANCISCO'}],
                  proyectos: [{nombre: 'PROYECTO DFGDF'}, {nombre: 'PROYECTO GFD'}, {nombre: 'PROYECTO FUE'}],
                  solicitudes: [{nombre: 'SUR CALI'}, {nombre: 'AUTONOMA'}, {nombre: 'ICESI'}],
                  espacios: [{edificio: '6', planta: '0FD2', espacio: '945302', estado: 'ACTIVO'}, {edificio: '8', planta: '00354', espacio: '92346', estado: 'INACTIVO'}, {edificio: '9', planta: '004', espacio: '9009', estado: 'INACTIVO'}]},
                {nombre: 'LABORATORIO Y', coord: {lat: '3.403437', lon: '-76.511292'}, info: {dir: 'cra54 dfsdfsdf', tel: '46363565', cel: '4357547656537', email: 'hkjkhjjh@univalle.edu.co'},
                servicios: [], practicas: [], equipos: [], personal: [], proyectos: [], solicitudes: [], espacios: []}];


  // INICIALIZACION DE CONSULTAS PARA LABORATORIOS
  private labsCollection: AngularFirestoreCollection<any>;
  labs: Observable<any[]>;

  datosLabsEstructurados = [];

  user: any;

  constructor(private obs: ObservablesService, private afs: AngularFirestore) { }

  ngOnInit() {
    if (localStorage.getItem('usuario')) {
      this.getUserId();
      this.getPersonId(this.user.uid).subscribe(person => {
        this.getLaboratorios(person.payload.data().cfPers).subscribe(labs => {

          

        });

      });


      
    }
  }

  getUserId(){ 
    this.user = JSON.parse(localStorage.getItem('usuario'));  
  }

  getPersonId(userid) {
    return this.afs.doc('user/' + userid).snapshotChanges();
  }

  // METODO QUE TRAE LA COLECCION DE TODOS LOS LABORATORIOS
  getLaboratorios(persid) {
    this.labsCollection = this.afs.collection<any>('cfFacil',
      ref => ref.where('facilityAdmin', "==", persid));
    return this.labsCollection.valueChanges();
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
               if(elemento.active == true) {
                estadoLab = 'Activo';
               } else if( elemento.active == false ) {
                estadoLab = 'Inactivo';
               }
              const laboratorio = {
                nombre: elemento.cfName,
                escuela: elemento.knowledgeArea,
                inves: elemento.researchGroup,
                director: duenoLab.cfFirstNames + ' ' + duenoLab.cfFamilyNames,
                coord: {lat: espacioLab.spaceData.geoRep.longitud, lon: espacioLab.spaceData.geoRep.latitud},
                info: {dir: elemento.otros.direccion, tel: elemento.otros.telefono, cel: '', email: elemento.otros.email},
                servicios: this.estructurarServicios(elemento.relatedServices),
                practicas: this.estructurarPracticas(elemento.relatedPractices),
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
              activo: servicio.active,
              uid: data.payload.id
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



  enviaritem() {
    this.obs.changeObject(this.laboratorios);
  }
}
