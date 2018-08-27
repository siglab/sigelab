import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { AngularFirestore } from 'angularfire2/firestore';
import { ObservablesService } from './../../../shared/services/observables.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import swal from 'sweetalert2';
import { AngularFireStorage } from 'angularfire2/storage';
import { Subscription } from 'rxjs';
import { EspaciosService } from '../services/espacios.service';

declare var $: any;

import 'fullcalendar';
import 'fullcalendar-scheduler';
import * as $AB from 'jquery';


@Component({
  selector: 'app-admin-laboratorios',
  templateUrl: './admin-laboratorios.component.html',
  styleUrls: ['./admin-laboratorios.component.css']
})
export class AdminLaboratoriosComponent implements OnInit, OnDestroy {


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
    displayedColumnsSolicitudes = ['nombre', 'email'];
    dataSourceSolicitudes = new MatTableDataSource([]);
    @ViewChild('paginatorSolicitudes') paginatorSolicitudes: MatPaginator;
    @ViewChild('sortSolicitudes') sortSolicitudes: MatSort;


    user:any;

    labestructurado:any;

    infolab = {
      headquarter:'',
      subHq:'',
      cfDescr:'',
      faculties:{},
      departments:{},
      mainSpace:'',
      cfConditions:'',
      cfAvailability:[],
      otros: {
        direccion: '',
        email: '',
        telefono: ''
      }    
    };

   
    checks = {};

    cambios = [];

    sugerencia:any;

    encargado = '';

    moduloNivel2 = false;
    moduloPermiso = false;
    rol: any;


    iconos = {
      info:false,
      equipos:false,
      personal:false,
      espacio:false,
      espacioaso:false,
      servicio:false,
      proyecto:false,
      practica:false,
      solicitud:false
    };

    espaciosel:any;
    plano:Observable<any>;

    sus: Subscription;

    sedes = [];
    subsedes = [];
    facultades = [];
    departamentos = [];

    diassemana = [{id:'1', nombre:'LUNES'},{id:'2', nombre:'MARTES'},{id:'3', nombre:'MIERCOLES'},
                  {id:'4', nombre:'JUEVES'},{id:'5', nombre:'VIERNES'},{id:'6', nombre:'SABADO'},
                  {id:'7', nombre:'DOMINGO'}];

    espacios = [];

    listaFacultades = [];
    listaDepartamentos = [];
    listaDisponibilidad = [];
    selectfacul = '';
    selectdepar = '';

    selectdia = 0;
    selectHinicio = '';
    selectHFinal = '';

    listaFaculSugeridos = [];
    listaDeparSugeridos = [];
    listaDispoSugeridos = [];

  constructor(private obs: ObservablesService, private afs: AngularFirestore, 
              private storage: AngularFireStorage, private service:EspaciosService) {
  }

  ngOnInit() {

    this.getUserId();
    this.getRoles();
    this.cargarSedes();
    this.cargarSubsedes();
    this.cargarFacultades();

    this.sus = this.obs.currentObjectLab.subscribe(data => {

      console.log(data);
      console.log(this.labestructurado);

      this.labestructurado = undefined;
      this.itemsel = Observable.of(this.labestructurado);
      if(data.length != 0){
        swal({
          title: 'Cargando un momento...',
          text: 'espere mientras se cargan los datos',
          onOpen: () => {
            swal.showLoading();
          }
        });

        if(!this.labestructurado){
          this.estructurarLab(data.uid).then(() => {
            this.itemsel = Observable.of(this.labestructurado);
            this.limpiarData();
            const ambiente = this;
            console.log(this.labestructurado);
          
            if(this.labestructurado){
                this.dataSourceEquipos.data = this.labestructurado.equipos;
                  
                this.dataSourcePersonal.data = this.labestructurado.personal;
        
                this.dataSourceServicios.data = this.labestructurado.servicios;
        
                this.dataSourceProyectos.data = this.labestructurado.proyectos;
        
                this.dataSourcePracticas.data = this.labestructurado.practicas;
        
                this.dataSourceSolicitudes.data = this.labestructurado.solicitudes;
  
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
  
               
            }    
    
          });
        } else {
          swal.close();
        }
     
      }

    });
  }

  ngOnDestroy(){
    this.sus.unsubscribe();
 
  }

  initCalendarModal(horario) {

    const containerEl: JQuery = $AB('#calendar2');

    if(containerEl.children().length > 0){
 
      containerEl.fullCalendar('destroy');
    }

    containerEl.fullCalendar({
      // licencia
      schedulerLicenseKey: 'GPL-My-Project-Is-Open-Source',
      // options here
      height: 450,
      header: {
        left: 'month,agendaWeek,agendaDay',
        center: 'title',
        right: 'today prev,next'
      },
      events: horario,

      defaultView: 'month',
      timeFormat: 'H(:mm)'

    });
  }

  cambiardata(item, table) {
    this.tablesel = table;
    this.seleccionado = item;
    if(this.tablesel == 'practicas'){
      this.initCalendarModal(item.programacion.horario);
    }
  
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
    this.labestructurado = {};
   let promise = new Promise((resolve,reject)=>{
    this.buscarLab(key).subscribe(labo => {
      const laboratorio = labo.payload.data();
      if(laboratorio.headquarter){
        this.buscarSede(laboratorio.headquarter).subscribe(se=>{
          const sede = se.payload.data();
          if(laboratorio.subHq){
            this.buscarSubSede(laboratorio.subHq).subscribe(sub=>{
              const subsede = sub.payload.data();
              this.buscarDirector(laboratorio.facilityAdmin).subscribe(dueno => {
                const duenoLab = dueno.payload.data();
                if (duenoLab) {
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
                      descripcion: laboratorio.cfDescr,
                      escuela: laboratorio.knowledgeArea,
                      inves: laboratorio.researchGroup,
                      director: duenoLab.cfFirstNames + ' ' + duenoLab.cfFamilyNames,
                      iddueno: laboratorio.facilityAdmin,
                      sede: {id:laboratorio.headquarter, nombre:sede.cfName},
                      subsede: {id:laboratorio.subHq, nombre:subsede.cfAddrline1},
                      espacioPrin: this.buscarEspacio(laboratorio.mainSpace),
                      espacioPrincipal: laboratorio.mainSpace,
                      info: {dir: laboratorio.otros.direccion, tel: laboratorio.otros.telefono, cel: '', email: laboratorio.otros.email},
                      servicios: this.estructurarServicios(laboratorio.relatedServices).arr,
                      practicas: this.estructurarPracticas(laboratorio.relatedPractices),
                      equipos: this.estructurarEquipos(laboratorio.relatedEquipments),
                      personal: this.estructurarPersonas(laboratorio.relatedPers),
                      proyectos: this.estructurarProyectos(laboratorio.relatedProjects),
                      solicitudes: this.estructurarServicios(laboratorio.relatedServices).arr2,
                      facultades: this.estructurarFacultades(laboratorio.faculties),
                      departamentos: this.estructurarDepartamentos(laboratorio.departments),
                      espacios: this.estructurarSpace(laboratorio.relatedSpaces, laboratorio.mainSpace),
                      cambios: laboratorio.suggestedChanges,
                      disponibilidad: laboratorio.cfAvailability,
                      condiciones: laboratorio.cfConditions,
                      estado: estadoLab
                    };
                    

                    this.cambios = this.pendientes(laboratorio.suggestedChanges);


                    if(this.labestructurado){
                      resolve();
                    } else {
                      reject();
                    }  
        
                }
              });
            });
          }
          
        
        });
      }
 

    })
   });

   return promise;

  }



  // METODO QUE TRAE UN DIRECTOR ESPECIFICO DEPENDIENDO EL ID-DIRECTOR
  buscarLab(idlab) {
    return this.afs.doc('cfFacil/' + idlab).snapshotChanges();
  }

  // METODO QUE TRAE UN DIRECTOR ESPECIFICO DEPENDIENDO EL ID-DIRECTOR
  buscarDirector(iddirector) {
    return this.afs.doc('cfPers/' + iddirector).snapshotChanges();
  }

   // METODO QUE TRAE UNA SEDE ESPECIFICA DEPENDIENDO EL ID-SEDE
  buscarSede(idsede) {
    return this.afs.doc('headquarter/' + idsede).snapshotChanges();
  }

  // METODO QUE TRAE UNA SUBSEDE ESPECIFICA DEPENDIENDO EL ID-SUBSEDE
  buscarSubSede(idsub) {
    return this.afs.doc('cfPAddr/' + idsub).snapshotChanges();
  }

  // METODO QUE TRAE UN ESPACIO ESPECIFICO DEPENDIENDO EL ID-ESPACIO
  buscarEspacio(idespacio) {
    let arr = [];
    for (let i = 0; i < 1; i++) {
      if(idespacio){
        this.afs.doc('space/' + idespacio).snapshotChanges().subscribe(data=>{
          console.log(data);
         arr.push(data.payload.data());
        });
      }      
    }
    
    return arr;;
   
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
            const serv = {
              nombre: servicio.cfName,
              descripcion: servicio.cfDesc,
              precio: servicio.cfPrice,
              activo: servicio.active,
              variaciones: this.variations(clave),
              uid: data.payload.id
             };
             arr.push(serv);

            this.afs.collection<any>('cfSrvReserv',
            ref => ref.where('cfSrv', '==', clave).where('status', '==', 'pendiente'))
            .snapshotChanges().subscribe(dataSol => {

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
            this.afs.doc('practice/' + clave ).collection('programmingData').snapshotChanges().subscribe(data2 => {

              // funciona con una programacion, cuando hayan mas toca crear otro metodo
              const prog = data2[0].payload.doc.data();

              if(prog){
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
            let persona = {};
            if(pers.user){
              this.afs.doc('user/' + pers.user).snapshotChanges().subscribe(dataper => {
                // funciona con una programacion, cuando hayan mas toca crear otro metodo
                if(dataper.payload.data()){

                  persona = {
                    id: clave,
                    nombre: pers.cfFirstNames + ' ' + pers.cfFamilyNames,
                    activo: pers.active,
                    email: dataper.payload.data().email,
                    idpers: clave,
                    iduser: pers.user
                  };
    
                  arr.push(persona);
                } else {

                  persona = {
                    id: clave,
                    nombre: pers.cfFirstNames + ' ' + pers.cfFamilyNames,
                    activo: pers.active,
                    email: '',
                    idpers: clave,
                    iduser: ''
                  };
                  arr.push(persona);
    
                }
              
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

    // METODO QUE ESTRUCTURA LA DATA DE LAS FACULTADES EN LA VISTA BUSQUEDA DE LABORATORIOS
  // RECIBE EL NODO DE LABORATORIO QUE CONTIENE LAS PRACTICAS ASOCIADOS
  estructurarFacultades(item) {

    const arr = [];

    for (const clave in item) {
      // Controlando que json realmente tenga esa propiedad
      if (item.hasOwnProperty(clave)) {

        if (item[clave]) {
           this.afs.doc('faculty/' + clave).snapshotChanges().subscribe(data => {
           const facultad =  data.payload.data();
             arr.push({id:clave, nombre:facultad.facultyName});
           });
        }

      }
    }

    return arr;
  }

   // METODO QUE ESTRUCTURA LA DATA DE LAS FACULTADES EN LA VISTA BUSQUEDA DE LABORATORIOS
  // RECIBE EL NODO DE LABORATORIO QUE CONTIENE LAS PRACTICAS ASOCIADOS
  estructurarDepartamentos(facultades) {

    const arr = [];

    for (const clave in facultades) {
      if (facultades.hasOwnProperty(clave)) {
        for (const key in facultades[clave]) {
          if (facultades[clave].hasOwnProperty(key)) {
            if (facultades[clave][key]) {
              this.afs.doc('faculty/' + clave).collection('departments')
              .doc(key).snapshotChanges().subscribe(data => {
              const departamento =  data.payload.data();
                arr.push({idfacul:clave, id:key, nombre:departamento.departmentName});
              });
           }    
            
          }
        }

      }
    }

    return arr;
  }

  estructurarSpace(item, keyprincipal) {

    const arr = [];

    for (const clave in item) {
      // Controlando que json realmente tenga esa propiedad
      if (item.hasOwnProperty(clave)) {

        if (item[clave]) {
          this.afs.doc('space/' + clave).snapshotChanges().subscribe(data => {
            const espacio = data.payload.data();

              // funciona con una programacion, cuando hayan mas toca crear otro metodo
              if (espacio) {
                const space = {
                  id_space: data.payload.id,
                  capacity: espacio.capacity,
                  createdAt: espacio.createdAt,
                  freeArea: espacio.freeArea,
                  headquarter: espacio.headquarter,
                  indxSa: espacio.indxSa,
                  map: espacio.map,
                  minArea: espacio.minArea,
                  ocupedArea: espacio.ocupedArea,
                  totalArea: espacio.totalArea,
                  spaceData: espacio.spaceData,

                };

                arr.push(space);
              }

          });
        }

      }
    }

    return arr;
  }


  cargarSedes(){
    this.afs.collection('headquarter').snapshotChanges().subscribe(data=>{
      for (let i = 0; i < data.length; i++) {
        const element = data[i].payload.doc.data();      
        this.sedes.push({id:data[i].payload.doc.id, nombre:element.cfName});
      }
    });
  }

  cargarSubsedes(){
    this.afs.collection('cfPAddr').snapshotChanges().subscribe(data=>{
      for (let i = 0; i < data.length; i++) {
        const element = data[i].payload.doc.data();      
        this.subsedes.push({id:data[i].payload.doc.id, nombre:element.cfAddrline1});
      }
    });
  }

  cargarFacultades(){
    this.afs.collection('faculty').snapshotChanges().subscribe(data=>{
      for (let i = 0; i < data.length; i++) {
        const element = data[i].payload.doc.data();      
        this.facultades.push({id:data[i].payload.doc.id, nombre:element.facultyName});
        this.cargarDepartamentos(data[i].payload.doc.id);
      }   
    });
  }


  cargarDepartamentos(idfacul){
    this.afs.doc('faculty/'+idfacul).collection('departments').snapshotChanges().subscribe(data=>{
      for (let i = 0; i < data.length; i++) {
        const element = data[i].payload.doc.data();      
        this.departamentos.push({id:data[i].payload.doc.id, idfacul:idfacul, nombre:element.departmentName});
      }
    });
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

  getPersona(persid) {
    return  this.afs.doc('cfPers/'+persid).snapshotChanges();
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

  // METODO QUE ME TRAE EL ROL DE ACCESSO A NIVEL 2
  getRoles() {

    this.rol = JSON.parse(localStorage.getItem('rol'));
    
    for (const clave in this.rol) {
      if (this.rol[clave]) {

        if ((clave === 'moduloNivel2')) {
          this.moduloNivel2 = true;
        }
        if ((clave === 'moduloDosPermiso')) {
          this.moduloPermiso = true;
        }
      }
    }
  }

  arregloEspacios(){
    this.espacios = [];
    this.service.listSpaceWithSubHq(this.infolab.subHq).subscribe(data=>{
      console.log(data);
      for (let i = 0; i < data.length; i++) {   
        const element = data[i].payload.doc.data().spaceData;
        this.espacios.push({id:data[i].payload.doc.id, nombre:element.building + ' - ' +element.place});
      } 
    });  
  }


  editar(){

    if(this.moduloNivel2){
      swal({
        title: 'Cargando un momento...',
        text: 'espere mientras se ejecuta la solicitud',
        onOpen: () => {
          swal.showLoading();
        }
      });

      this.infolab.cfAvailability = this.listaDisponibilidad;
      this.infolab.faculties = this.estructurarEnvioSugerenciaFacDep(this.listaFacultades,'faculties');
      this.infolab.departments = this.estructurarEnvioSugerenciaFacDep(this.listaDepartamentos,'departments');
      console.log(this.infolab);
      this.afs.doc('cfFacil/' + this.labestructurado.uid).update(this.infolab).then(data=>{
             
        swal.close();
        swal({
          type: 'success',
          title: 'Sugerencia de cambios ingresada',
          showConfirmButton: true
        }).then(()=>{
          this.obs.changeObjectLab({nombre:this.labestructurado.nombre.nom1 + this.labestructurado.nombre.nom2, uid: this.labestructurado.uid})
        });

      });
    } else {
      let aux = {
        suggestedChanges: this.labestructurado.cambios
      };

      const dataEstructurada = this.estructurarDataCambios();

      if(dataEstructurada.length != 0){

        swal({

          type: 'warning',
          title: 'Esta seguro que desea enviar la sugerencia de cambios',
          showCancelButton: true,
          confirmButtonText: 'Si, Solicitar',
          cancelButtonText: 'No, Cancelar'
    
        }).then((result) => {
    
          if (result.value) {
            swal({
              title: 'Cargando un momento...',
              text: 'espere mientras se ejecuta la solicitud',
              onOpen: () => {
                swal.showLoading();
              }
            });
    
            this.getPersona(JSON.parse(localStorage.getItem('persona')).cfPers).subscribe(person=>{
              aux.suggestedChanges.push({
                data: dataEstructurada,
                uid: this.user.uid,
                nombre: person.payload.data().cfFirstNames + ' ' + person.payload.data().cfFamilyNames,
                estado: 'pendiente'
              });    
              
              console.log(aux);
              this.afs.doc('cfFacil/' + this.labestructurado.uid).set(aux,{merge:true}).then(()=>{
                  swal.close();
                  swal({
                    type: 'success',
                    title: 'Sugerencia de cambios ingresada',
                    showConfirmButton: true
                  });
              });
            });
    
           
    
          } else if (result.dismiss === swal.DismissReason.cancel) {
            swal(
              'Solicitud Cancelada',
              '',
              'error'
            );
          }
    
        });

      } else {
        swal({
          type: 'error',
          title: 'No ha sugerido ningun cambio',
          showConfirmButton: true
        });
      }

    }
    
  }


  enviarSugerencia(){

    swal({

      type: 'warning',
      title: 'Esta seguro que desea editar los datos actuales con la sugerencia seleccionada',
      showCancelButton: true,
      confirmButtonText: 'Si, Solicitar',
      cancelButtonText: 'No, Cancelar'

    }).then((result) => {

      if (result.value) {

        swal({
          title: 'Cargando un momento...',
          text: 'espere mientras se ejecuta la solicitud',
          onOpen: () => {
            swal.showLoading();
          }
        });

        let cont = 0;
        const cambio = this.infolab;
        cambio['cfAvailability'] = this.listaDisponibilidad;
        for (const key in this.checks) {
          if (this.checks.hasOwnProperty(key)) {
            const element = this.checks[key];
            if(element){
              const aux = this.sugerencia.data[cont].llave.split('.');
    
              if(aux.length != 2){      
                if(aux == 'faculties' || aux == 'departments'){
                  if(this.sugerencia.data[cont].quitar){
                    const obj = {};
                    obj[aux] = this.estructurarEnvioSugerenciaFacDep(this.sugerencia.data[cont].info, aux);
                    cambio[aux[0]] = {};
                    this.servicioEditarFacDep(obj);
                  }else{
                    cambio[aux[0]] = this.estructurarEnvioSugerenciaFacDep(this.sugerencia.data[cont].info, aux);  
                  }
                }else if(aux == 'cfAvailability'){               
                 
                  cambio[aux[0]] = this.estructurarEnvioSuferenciaDisponibilidad(this.sugerencia.data[cont].info,this.sugerencia.data[cont].quitar);  
                  
                }else{
                  cambio[aux[0]] = this.sugerencia.data[cont].info;  
                } 
                       
              } else {           
                cambio[aux[0]][aux[1]] = this.sugerencia.data[cont].info;
              }
             
            }
            cont++;
          }
        }
        console.log(cambio);
        cambio['suggestedChanges'] =  this.cambiarEstadoSugerencia(this.sugerencia.uid, 'aprobado');

        this.afs.doc('cfFacil/' + this.labestructurado.uid).set(cambio,{merge:true}).then(data=>{
          swal(
            'Cambios Aprobados',
            '',
            'success'
          );
          this.sugerencia = undefined;
          this.limpiarData();
          this.obs.changeObject({nombre:this.labestructurado.nombre.nom1 + this.labestructurado.nombre.nom2, uid: this.labestructurado.uid})
             
        });
       

      } else if (result.dismiss === swal.DismissReason.cancel) {
        swal(
          'Solicitud Cancelada',
          '',
          'error'
        );
      }

    });


    
  }

  estructurarEnvioSugerenciaFacDep(arr, tipo){
    const obj = {};
    for (let i = 0; i < arr.length; i++) {
      if(tipo == 'faculties'){
        obj[arr[i].id] = true;   
      }else{
        if(!obj[arr[i].idfacul]){
          obj[arr[i].idfacul] = {};
          obj[arr[i].idfacul][arr[i].id] = true;   
        }else{
          obj[arr[i].idfacul][arr[i].id] = true;   
        }
      }    
    }
    return obj;
  }

  estructurarEnvioSuferenciaDisponibilidad(arr, quitar){
    let obj = [];
    if(!quitar){
      obj =  this.labestructurado.disponibilidad;
    }
   
    for (let i = 0; i < arr.length; i++) {
      obj.push(arr[i]);
    }
    console.log(obj);
    return obj;
  }

  servicioEditarFacDep(obj){
    return this.afs.doc('cfFacil/'+this.labestructurado.uid).update(obj);
  }


  cambiarEstadoSugerencia(uid, estado){
    const cam = this.labestructurado.cambios.slice();
    for (let i = 0; i < cam.length; i++) {
      const element = cam[i];

      if(element.uid == uid  && element.estado == 'pendiente'){
        element.estado = estado;
        for (let j = 0; j < element.data.length; j++) {
          const element2 = element.data[j];
          
          element2.cambio = this.checks['checkbox'+j];

        }     
      }    
    }
    return cam;
  }

  desaprobarSugerencia(){
    swal({
      title: 'Cargando un momento...',
      text: 'espere mientras se ejecuta la solicitud',
      onOpen: () => {
        swal.showLoading();
      }
    });

    const cambio = {};
    cambio['suggestedChanges'] = this.cambiarEstadoSugerencia(this.sugerencia.uid, 'desaprobado');

    console.log(cambio);
    this.afs.doc('cfFacil/' + this.labestructurado.uid).update(cambio).then(data=>{
      swal({
        type: 'success',
        title:'Cambios Desaprobados',
        showConfirmButton: true
      });
      this.sugerencia = undefined;
      this.obs.changeObject({nombre:this.labestructurado.nombre.nom1 + this.labestructurado.nombre.nom2, uid: this.labestructurado.uid})
    });
  }

  estructurarDataCambios(){
    const aux1 = ['facultades','departamentos','disponibilidad','descripcion', 'condiciones', 'sede', 'subsede', 'espacioPrincipal','info.dir','info.email','info.tel'];
    const aux2 = ['faculties', 'departments', 'cfAvailability', 'cfDescr', 'cfConditions','headquarter', 'subHq', 'mainSpace','otros.direccion', 'otros.email', 'otros.telefono'];
    const aux3 = ['this.listaFaculSugeridos', 'this.listaDeparSugeridos', 'this.listaDispoSugeridos'];
    const aux4 = ['this.listaFacultades', 'this.listaDepartamentos', 'this.listaDisponibilidad'];
    const data = [];
    let element;
    let element2;

    for (let i = 0; i < aux1.length; i++) {

      element = aux1[i].split('.');  
      element2 = aux2[i].split('.');
      let infoauxiliar = this.infolab[element2];

      if(element.length != 2){
        if((aux1[i] == 'facultades') || (aux1[i] == 'departamentos') || (aux1[i] == 'disponibilidad')){
          const sugeridos = [];
          for (let j = 0; j < eval(aux3[i]).length; j++) {
            const element = eval(aux3[i])[j];
            sugeridos.push(element);
          }

          if(sugeridos.length != 0){
            data.push({llave: aux2[i], nombre: aux1[i],info:sugeridos, cambio: false});
          }else{
            const arr1 = eval(aux4[i]);
            const arr2 = eval('this.labestructurado.'+aux1[i]);
            if(arr1.length != arr2.length){
              data.push({llave: aux2[i], quitar:true,nombre: aux1[i],infoaux:this.elementosRetirados(arr1,arr2), info:arr1,cambio: false});
            }         
          }

        }else{
          let auxiliar = this.labestructurado[element];
          let nombre = element2[0];
        
  
          if(aux1[i] == 'sede' || aux1[i] == 'subsede' ){
            auxiliar = this.labestructurado[element].id;
            nombre = aux1[i];
    
            infoauxiliar = this.buscarArreglo(this.infolab[element2], aux1[i]);
          }
          if((aux1[i] == 'descripcion')||aux1[i] == 'condiciones'){
            nombre = aux1[i];
           
          }

          if(aux1[i] == 'espacioPrincipal'){
            nombre = aux1[i];
            infoauxiliar = this.buscarArreglo(this.infolab[element2], aux1[i]);
          }
  
          if(auxiliar != this.infolab[element2]){
             data.push({llave: aux2[i], nombre: nombre, infoaux: infoauxiliar, info:this.infolab[element2], cambio: false});
          }
        }

      } else {
        infoauxiliar = this.infolab[element2[0]][element2[1]];
        if(this.labestructurado[element[0]][element[1]] != this.infolab[element2[0]][element2[1]]) {
          data.push({llave: aux2[i], nombre: element2[1], infoaux: infoauxiliar, info: this.infolab[element2[0]][element2[1]], cambio: false});
        }

      }
     
      
    }

    console.log(data);
    return data;
  }

  buscarArreglo(id, arreglo){
    let arr = '';
    if(arreglo == 'sede'){
      arr = 'this.sedes';
    }else if(arreglo == 'subsede'){
      arr = 'this.subsedes';
    }else{
      arr = 'this.espacios';
    }

    for (let i = 0; i < eval(arr).length; i++) {
      const element = eval(arr)[i];
      if(element.id == id){
        return element.nombre;
      }
      
    }
  }

  elementosRetirados(arr1, arr2){
    let arr = [];
    let encontro = false;

    for (let i = 0; i < arr2.length; i++) {
      encontro = false;

      if(arr1.length == 0){
        arr.push(arr2[i]);

      }else{

        for (let j = 0; j < arr1.length; j++) {
       
          if(arr2[i].idfacul){
            if(arr2[i].idfacul == arr1[j].idfacul){
              encontro = true;
              break;
            }
          }

          if(arr2[i].id){
            if(arr2[i].id == arr1[j].id){
              encontro = true;
              break;
            }
          }
  
          if(arr2[i].id){
            if(arr2[i].id == arr1[j].id){
              encontro = true;
              break;
            }
          }
         
       }

       if(!encontro){
         arr.push(arr2[i]);
       }
      }   
    }

    return arr;
  }

  pendientes(item){
   const arr = [];
    for (let j = 0; j < item.length; j++) {
      const element = item[j];

      if(element.estado == 'pendiente'){
        arr.push(element);
      }
      
    }

    return arr;
  }

  cambiarSugerencia(item){

    if(item != 'inicial'){
      this.sugerencia = this.buscarSugerencia(item);
      this.estructurarChecks(this.sugerencia.data);
    } else {
      this.sugerencia = undefined;
    }

  }

  // ESTRUCTURA OBJETO JSON QUE SE ENLAZA A LOS CHECKBOX DE LA VISTA DE MANERA DINAMICA
  estructurarChecks(item){
    this.checks = {};
    for (let i = 0; i < item.length; i++) {
      //const element = condiciones[i];
      this.checks["checkbox"+i] = false;
    }
  }

  // METODO QUE BUSCA LA SUGERENCIA QUE COINCIDE CON EL ID ENVIADO DESDE LA VISTA
  buscarSugerencia(item){
    for (let i = 0; i < this.labestructurado.cambios.length; i++) {
      const element = this.labestructurado.cambios[i];
      if(element.uid == item && element.estado == 'pendiente'){
        return element;
      }   
    }
  }

  cambiarEspacioSel(item){
    if(item != 'inicial'){
      this.espaciosel = this.buscarEspacioLocal(item);
      console.log(this.espaciosel);
    } else {
      this.espaciosel = undefined;
    }
  }

  /* este metodo carga la imagen desde firebase con un parametro nombre de la imagen */
  cargarImagen() {

    if (this.espaciosel.map) {  
      swal({
        title: 'Cargando un momento...',
        text: 'espere mientras se cargan los datos',
        onOpen: () => {
          swal.showLoading();
        }
      });  
     const ref = this.storage.ref('planos/' + this.espaciosel.map + '.png');
      this.plano = ref.getDownloadURL();
      if(this.plano){
        swal.close();
      }
    } 

  }

  // METODO QUE BUSCA LA VARIACION QUE COINCIDE CON EL ID ENVIADO DESDE LA VISTA
  buscarEspacioLocal(item){
    for (let i = 0; i < this.labestructurado.espacios.length; i++) {
      const element = this.labestructurado.espacios[i];
      if(element.id_space == item){
        return element;
      }   
    }
  }

  limpiarData(){
    this.seleccionado = undefined;
    this.sugerencia = undefined;

    this.infolab.otros.email = this.labestructurado.info.email;
    this.infolab.otros.direccion = this.labestructurado.info.dir;
    this.infolab.otros.telefono = this.labestructurado.info.tel;
    this.infolab.headquarter = this.labestructurado.sede.id;
    this.infolab.subHq = this.labestructurado.subsede.id;   
    this.infolab.cfDescr = this.labestructurado.descripcion;
    this.listaFacultades = this.labestructurado.facultades.slice();
    this.listaDepartamentos = this.labestructurado.departamentos.slice();
    this.infolab.mainSpace = this.labestructurado.espacioPrincipal;
    this.infolab.cfConditions = this.labestructurado.condiciones;
    this.listaDisponibilidad = this.labestructurado.disponibilidad.slice();
 
    this.listaFaculSugeridos = [];
    this.listaDeparSugeridos = [];
    this.listaDispoSugeridos = [];
    this.arregloEspacios();
   
  }

  cambiarIcono(box){
    if(!this.iconos[box]){
      this.iconos[box] = true;
    } else {
      this.iconos[box] = false;
    }
  }


  quitarelemento(id, list){

    let lista;
    let sugerido;
    if(list == 'facultad'){
      lista = eval('this.listaFacultades');
      sugerido = eval('this.listaFaculSugeridos');
    }else{
      lista = eval('this.listaDepartamentos');
      sugerido = eval('this.listaDeparSugeridos');
    }
      const encontrado = lista.find((element, index) => {
        if(element.id == id){
          lista.splice(index, 1);
          if(this.moduloPermiso){
            sugerido.splice(index, 1);
          }
          return true;
        }
        return false;
      });   

      swal({
        type: 'success',
        title: list+' Eliminada',
        showConfirmButton: true
      });
    
  }

  agregarElemento(list){
    let lista = '';

    let select = '';

    const objeto = {};

    if(list == 'facultad'){
      lista = 'this.listaFacultades';
      select = 'this.selectfacul';

    }else{
      lista = 'this.listaDepartamentos';
      select = 'this.selectdepar';
    }
  

    const selecsss = eval(select);

    const encontrado = eval(lista).find((element, index) => {
    
      if(element.id == selecsss){
        return true;
      }
      return false;    
    });
  
    if(!encontrado){
      
     this.buscarElemento(list,select,lista);
   
      swal({
        type: 'success',
        title: list + ' agregada',
        showConfirmButton: true
      }); 
    }else{
      swal({
        type: 'error',
        title: 'Esta '+list+' ya se encuentra agregada',
        showConfirmButton: true
      });
    }
  }

  buscarElemento(list, select, lista){
    let array = '';
    let sugerido = '';
    if(list == 'facultad'){
      array = 'this.facultades';
      sugerido = 'this.listaFaculSugeridos';
    }else{
      array = 'this.departamentos';
      sugerido = 'this.listaDeparSugeridos';
    }
    const selector = eval(select);
    const listafinal =  eval(lista);
    const listasugerida = eval(sugerido);
    eval(array).find((element, index) => {

      if(element.id == selector){
        listafinal.push(element); 
        if(this.moduloPermiso){
          listasugerida.push(element);
        }
      }

    });
  }

  agregarDisponibilidad(){
    const cadena = this.diassemana[this.selectdia-1].nombre + ' : ' + this.selectHinicio + '-' +this.selectHFinal;
    this.listaDisponibilidad.push({id:this.selectdia,nombre:cadena});
    if(this.moduloPermiso){
      this.listaDispoSugeridos.push({id:this.selectdia,nombre:cadena});
    }

  }

  
  quitarDisponibilidad(id){
    const encontrado = this.listaDisponibilidad.find((element, index) => {
      if(element.id == id){
        this.listaDisponibilidad.splice(index, 1);  
        if(this.moduloPermiso){
          this.listaDispoSugeridos.splice(index, 1);
        }  
        return true;
      }
      return false;
    });   

    swal({
      type: 'success',
      title:'Diponibilidad Eliminada',
      showConfirmButton: true
    });
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
