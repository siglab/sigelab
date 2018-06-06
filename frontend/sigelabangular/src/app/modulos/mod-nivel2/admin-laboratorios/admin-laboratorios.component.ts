import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { AngularFirestore } from 'angularfire2/firestore';
import { ObservablesService } from './../../../shared/services/observables.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { Component, OnInit, ViewChild } from '@angular/core';
import swal from 'sweetalert2';
import { reject } from 'q';

@Component({
  selector: 'app-admin-laboratorios',
  templateUrl: './admin-laboratorios.component.html',
  styleUrls: ['./admin-laboratorios.component.css']
})
export class AdminLaboratoriosComponent implements OnInit {


  itemsel: Observable<Array<any>>;

  tablesel = '';

  seleccionado: any;

    // INICIALIZACION DATATABLE EQUIPOS
    displayedColumnsEquipos = ['nombre'];
    dataSourceEquipos = new MatTableDataSource([]);
    @ViewChild('paginatorEquipos') paginatorEquipos: MatPaginator;
    @ViewChild('sortEquipos') sortEquipos: MatSort;

    // INICIALIZACION DATATABLE PERSONAL
    displayedColumnsPersonal = ['nombre'];
    dataSourcePersonal = new MatTableDataSource([]);
    @ViewChild('paginatorPersonal') paginatorPersonal: MatPaginator;
    @ViewChild('sortPersonal') sortPersonal: MatSort;

    // INICIALIZACION DATATABLE SERVICIOS
    displayedColumnsServicios = ['nombre'];
    dataSourceServicios = new MatTableDataSource([]);
    @ViewChild('paginatorServicios') paginatorServicios: MatPaginator;
    @ViewChild('sortServicios') sortServicios: MatSort;

    // INICIALIZACION DATATABLE PROYECTOS
    displayedColumnsProyectos = ['nombre'];
    dataSourceProyectos = new MatTableDataSource([]);
    @ViewChild('paginatorProyectos') paginatorProyectos: MatPaginator;
    @ViewChild('sortProyectos') sortProyectos: MatSort;

    // INICIALIZACION DATATABLE EQUIPOS
    displayedColumnsPracticas = ['nombre'];
    dataSourcePracticas = new MatTableDataSource([]);
    @ViewChild('paginatorPracticas') paginatorPracticas: MatPaginator;
    @ViewChild('sortPracticas') sortPracticas: MatSort;

    // INICIALIZACION DATATABLE SOLICITUDES
    displayedColumnsSolicitudes = ['nombre'];
    dataSourceSolicitudes = new MatTableDataSource([]);
    @ViewChild('paginatorSolicitudes') paginatorSolicitudes: MatPaginator;
    @ViewChild('sortSolicitudes') sortSolicitudes: MatSort;


    user:any;
    datosLabsEstructurados = [];
    labestructurado:any;

    infolab = {
      otros: {
        direccion: '',
        email: '',
        telefono: ''
      }
      
    };

  constructor(private obs: ObservablesService, private afs: AngularFirestore) {
  }

  ngOnInit() {
    this.obs.currentObject.subscribe(data => {
      console.log(data);
      if(data.length != 0){
         this.estructurarLab(data.uid).then(() => {
          this.itemsel = Observable.of(this.labestructurado);
          this.infolab.otros.email = this.labestructurado.info.email;
          this.infolab.otros.direccion = this.labestructurado.info.dir;
          this.infolab.otros.telefono = this.labestructurado.info.tel;
          const ambiente = this;
        
          swal({
            title: 'Cargando un momento...',
            text: 'espere mientras se cargan los datos',
            onOpen: () => {
              swal.showLoading();
            }
          });
    
          setTimeout(function() {
    
            ambiente.dataSourceEquipos.data = ambiente.labestructurado.equipos;
    
            ambiente.dataSourcePersonal.data = ambiente.labestructurado.personal;
    
            ambiente.dataSourceServicios.data = ambiente.labestructurado.servicios;
    
            ambiente.dataSourceProyectos.data = ambiente.labestructurado.proyectos;
    
            ambiente.dataSourcePracticas.data = ambiente.labestructurado.practicas;
    
            ambiente.dataSourceSolicitudes.data = ambiente.labestructurado.solicitudes;
          }, 1000);
    
          setTimeout(function() {
    
            ambiente.dataSourceEquipos.sort = ambiente.sortEquipos;
            ambiente.dataSourceEquipos.paginator = ambiente.paginatorEquipos;
    
            ambiente.dataSourcePersonal.sort = ambiente.sortPersonal;
            ambiente.dataSourcePersonal.paginator = ambiente.paginatorPersonal;
    
            ambiente.dataSourceServicios.sort = ambiente.sortServicios;
            ambiente.dataSourceServicios.paginator = ambiente.paginatorServicios;
    
            ambiente.dataSourceProyectos.sort = ambiente.sortProyectos;
            ambiente.dataSourceProyectos.paginator = ambiente.paginatorProyectos;
    
            ambiente.dataSourcePracticas.sort = ambiente.sortPracticas;
            ambiente.dataSourcePracticas.paginator = ambiente.paginatorPracticas;
    
            ambiente.dataSourceSolicitudes.sort = ambiente.sortSolicitudes;
            ambiente.dataSourceSolicitudes.paginator = ambiente.paginatorSolicitudes;
    
            swal.close();
          }, 1500);
    
  
        });
       
      }

    });
  }

  cambiardata(item, table) {
    this.tablesel = table;
    this.seleccionado = item;
  }

  addEquipo() {
    const eq = {
     cfOrgUnit: '',
     ciNumber: '87696898',
     projectDesc: 'proyecto que busca la geomatizacion de zonas urbanas de cali',
     projectName: 'PROYECTO CARTOGRAPHER',
     relatedFacilities: {cfFacilId: true},
     relaedPers: {cfPersId: true}
    };

    this.afs.collection('project').add(eq);
  }


  estructurarLab(key){

   let promise = new Promise((resolve,reject)=>{
    this.buscarLab(key).subscribe(labo => {
      const laboratorio = labo.payload.data();
      console.log(laboratorio);
      this.buscarDirector(laboratorio.facilityAdmin).subscribe(dueno => {
        const duenoLab = dueno.payload.data();
        if (duenoLab && laboratorio.mainSpace) {

          this.buscarEspacio(laboratorio.mainSpace).subscribe(espacio => {

            const espacioLab = espacio.payload.data();
              // convertir boolean a cadena de caracteres para estado del laboratorio
            let estadoLab;
              if (laboratorio.active === true) {
              estadoLab = 'Activo';
              } else if ( laboratorio.active === false ) {
              estadoLab = 'Inactivo';
              }
            this.labestructurado = {
              uid: labo.payload.id,
              nombre: this.ajustarTexto(laboratorio.cfName),
              escuela: laboratorio.knowledgeArea,
              inves: laboratorio.researchGroup,
              director: duenoLab.cfFirstNames + ' ' + duenoLab.cfFamilyNames,
              coord: {lat: espacioLab.spaceData.geoRep.longitud, lon: espacioLab.spaceData.geoRep.latitud},
              info: {dir: laboratorio.otros.direccion, tel: laboratorio.otros.telefono, cel: '', email: laboratorio.otros.email},
              servicios: this.estructurarServicios(laboratorio.relatedServices).arr,
              practicas: this.estructurarPracticas(laboratorio.relatedPractices),
              equipos: this.estructurarEquipos(laboratorio.relatedEquipments),
              personal: this.estructurarPersonas(laboratorio.relatedPers),
              proyectos: this.estructurarProyectos(laboratorio.relatedProjects),
              solicitudes: this.estructurarServicios(laboratorio.relatedServices).arr2,
              estado: estadoLab
            };

            resolve();

          });

        }
      });

    })
   });

   return promise;

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
  buscarLab(idlab) {
    return this.afs.doc('cfFacil/' + idlab).snapshotChanges();

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
               variaciones: this.variations(clave),
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
            this.afs.doc('practice/' + clave ).collection('programmingData').valueChanges().subscribe(data2 => {

              // funciona con una programacion, cuando hayan mas toca crear otro metodo
              const prog = data2[0];

              if(prog){
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
              }
   

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
                  precio: equip.price,
                  componentes:this.estructurarComponents(clave),
                  servicios:this.estructurarServicios(equip.relatedSrv).arr,
                  practicas:this.estructurarPracticas(equip.relatedPrac)
                };

              

                arr.push(equipo);


           });
        }

      }
    }

    return arr;
  }

      // METODO QUE ESTRUCTURA LA DATA DE LOS COMPONENTES EN LA VISTA BUSQUEDA DE LABORATORIOS
  // RECIBE EL NODO DE LABORATORIO QUE CONTIENE LAS PRACTICAS ASOCIADOS
  estructurarComponents(item){
    const arr = [];

    this.afs.collection('cfEquip/' + item + '/components').snapshotChanges().subscribe(data => {
      for (let i = 0; i < data.length; i++) {
        const element = data[i].payload.doc.data();

          const componente = {
            id: data[i].payload.doc.id,
            nombre: element.cfName,
            descripcion: element.cfDescription,
            precio: element.cfPrice,
            marca: element.brand,
            modelo: element.model,
            estado: element.active
          };
  
          arr.push(componente);
     

        
      }

     });

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

            if(pers){
              this.afs.doc('user/' + pers.user).snapshotChanges().subscribe(dataper => {
                // funciona con una programacion, cuando hayan mas toca crear otro metodo
                const persona = {
                  id: clave,
                  nombre: pers.cfFirstNames + ' ' + pers.cfFamilyNames,
                  activo: pers.active,
                  email: dataper.payload.data().email,
                  idpers: clave,
                  iduser: pers.user
                };
  
                arr.push(persona);
              });
            }

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

  // METODO QUE ESTRUCTURA LAS VARIACIONES DE UN SERVICIO
  variations(clave){
    const variaciones = [];
    this.afs.doc('cfSrv/' + clave).collection('variations').snapshotChanges().subscribe(data => {
      if(data){
        for (let i = 0; i < data.length; i++) {
          const element = data[i].payload.doc.data();
          variaciones.push(element);
        }
      } else {
        return variaciones;
      }
      
    });
    return variaciones;
  }


  getUserId() {
    this.user = JSON.parse(localStorage.getItem('usuario'));
  }

  getPersonId(userid) {
    return this.afs.doc('user/' + userid).snapshotChanges();
  }

  // METODO QUE TRAE LA COLECCION DE TODOS LOS LABORATORIOS
  getLaboratorios(persid) {
  return this.afs.collection<any>('cfFacil',
      ref => ref.where('facilityAdmin', '==', persid)).snapshotChanges();

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


  editar(){
    this.afs.doc('cfFacil/' + this.labestructurado.uid).update(this.infolab).then(data=>{console.log(data);});
    this.obs.changeObject({nombre:this.labestructurado.nombre.nom1 + this.labestructurado.nombre.nom2, uid: this.labestructurado.uid})
  }




  // FILTADORES DE LAS TABLAS

  applyFilterEquipos(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSourceEquipos.filter = filterValue;
  }
  applyFilterPersonal(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSourcePersonal.filter = filterValue;
  }
  applyFilterServicios(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSourceServicios.filter = filterValue;
  }
  applyFilterProyectos(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSourceProyectos.filter = filterValue;
  }
  applyFilterPracticas(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSourcePracticas.filter = filterValue;
  }

  applyFilterSolicitudes(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSourceSolicitudes.filter = filterValue;
  }
}
