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
import { FormControl } from '@angular/forms';
import { Modulo2Service } from '../services/modulo2.service';


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
        email: '',
      },
      facilActivity:{
        extension:false,
        research:false,
        teaching:false
      },
      updatedAt: new Date().toISOString()
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
    listaTelefonos = [];
    listaActividad = [
      {id:'extension', name:'Extension'}, {id:'research', name:'Investigacion'},
      {id:'teaching', name:'Docencia'}];
    selectfacul = '';
    selectdepar = '';

    selectdia = 0;
    selectHinicio = '';
    selectHFinal = '';

    telefono = '';

    listaFaculSugeridos = [];
    listaDeparSugeridos = [];
    listaDispoSugeridos = [];
    listaTelSugeridos = [];

    fecha = new Date();

    selecactividad = new FormControl();

  constructor(private obs: ObservablesService, private servicioMod2:Modulo2Service,
              private storage: AngularFireStorage, private service:EspaciosService) {
  }

  ngOnInit() {
    $('html, body').animate({ scrollTop: '0px' }, 'slow');

    this.getUserId();
   
    this.cargarSedes();
    this.cargarSubsedes();
    this.cargarFacultades();

    this.sus = this.obs.currentObjectLab.subscribe(data => {
      console.log(data);
     this.getRoles(data.roles);
     this.resetIconos();

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
          
            console.log(this.labestructurado);
            if(this.labestructurado){
              if(this.labestructurado.objectActividad.extension){
                this.dataSourceServicios.data = this.labestructurado.servicios;
               

                this.dataSourceSolicitudes.data = this.labestructurado.solicitudes;
               

                setTimeout(()=>{
                  this.dataSourceServicios.sort = this.sortServicios;
                  this.dataSourceServicios.paginator = this.paginatorServicios;
                  
                  this.dataSourceSolicitudes.sort = this.sortSolicitudes;
                  this.dataSourceSolicitudes.paginator = this.paginatorSolicitudes;
                }, 1500);
              }
              if(this.labestructurado.objectActividad.research){
                this.dataSourceProyectos.data = this.labestructurado.proyectos;
               

                setTimeout(()=>{
                  this.dataSourceProyectos.sort = this.sortProyectos;
                  this.dataSourceProyectos.paginator = this.paginatorProyectos;
                }, 1500);

              }
              if(this.labestructurado.objectActividad.teaching){
                this.dataSourcePracticas.data = this.labestructurado.practicas;

                setTimeout(()=>{
                  this.dataSourcePracticas.sort = this.sortPracticas;
                  this.dataSourcePracticas.paginator = this.paginatorPracticas;
                }, 1500);
              }
          
                this.dataSourceEquipos.data = this.labestructurado.equipos;
                
                this.dataSourcePersonal.data = this.labestructurado.personal;
                

                setTimeout(()=>{
                  this.dataSourceEquipos.sort = this.sortEquipos;
                  this.dataSourceEquipos.paginator = this.paginatorEquipos;

                  this.dataSourcePersonal.sort = this.sortPersonal;
                  this.dataSourcePersonal.paginator = this.paginatorPersonal;
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


  estructurarLab(key){
    this.labestructurado = {};
   let promise = new Promise((resolve,reject)=>{
    this.servicioMod2.buscarLab(key).then(labo => {
      const laboratorio = labo.data();
   
        this.servicioMod2.buscarSede(laboratorio.headquarter ? laboratorio.headquarter : 'tygd').then(se=>{
          const sede = se.data();
     
            this.servicioMod2.buscarSubSede(laboratorio.subHq ? laboratorio.subHq : 'mfij').then(sub=>{
              const subsede = sub.data();
              this.servicioMod2.buscarDirector(laboratorio.facilityAdmin).then(dueno => {
                const duenoLab = dueno.data();
                if (duenoLab) {
                      // convertir boolean a cadena de caracteres para estado del laboratorio
                    let estadoLab;
                      if (laboratorio.active === true) {
                      estadoLab = 'Activo';
                      } else if ( laboratorio.active === false ) {
                      estadoLab = 'Inactivo';
                      }
                    this.labestructurado = {
                      uid: labo.id,
                      nombre: this.ajustarTexto(laboratorio.cfName),
                      descripcion: laboratorio.cfDescr,
                      escuela: laboratorio.knowledgeArea,
                      inves: laboratorio.researchGroup,
                      objectActividad: laboratorio.facilActivity,
                      actividad: this.actividades(laboratorio.facilActivity),
                      director: duenoLab.cfFirstNames + ' ' + duenoLab.cfFamilyNames,
                      iddueno: laboratorio.facilityAdmin,
                      sede: {id:laboratorio.headquarter, nombre:sede ? sede.cfName : ''},
                      subsede: {id:laboratorio.subHq, 
                                nombre:subsede ? subsede.cfAddrline1 : ''},
                      espacioPrin: this.buscarEspacio(laboratorio.mainSpace),
                      espacioPrincipal: laboratorio.mainSpace,
                      telefonos: this.estructuraTelefonos(labo.id),
                      info:{email: laboratorio.otros.email},
                      equipos: this.estructurarEquipos(laboratorio.relatedEquipments),
                      personal: this.estructurarPersonas(laboratorio.relatedPers),   
                      facultades: this.estructurarFacultades(laboratorio.faculties),
                      departamentos: this.estructurarDepartamentos(laboratorio.departments),
                      espacios: this.estructurarSpace(laboratorio.relatedSpaces, laboratorio.mainSpace),
                      cambios: laboratorio.suggestedChanges,
                      disponibilidad: laboratorio.cfAvailability,
                      condiciones: laboratorio.cfConditions,
                      estado: estadoLab
                    };

                    if(laboratorio.facilActivity.extension){
                      const servicesol = this.estructurarServicios(laboratorio.relatedServices);
                      this.labestructurado['solicitudes'] = servicesol.arr2;
                      this.labestructurado['servicios'] = servicesol.arr;
                    }
                    if(laboratorio.facilActivity.research){
                      this.labestructurado['proyectos'] =  this.estructurarProyectos(laboratorio.relatedProjects);
                    }
                    if(laboratorio.facilActivity.teaching){
                      this.labestructurado['practicas'] = this.estructurarPracticas(laboratorio.relatedPractices);
                    }
                
                    this.cambios = this.pendientes(laboratorio.suggestedChanges);


                    if(this.labestructurado){
                      resolve();
                    } else {
                      reject();
                    }

                }
              });
            });
          


        });
      


    })
   });

   return promise;

  }


  selectorActividad(){
    this.infolab.facilActivity = {
      extension:false,
      research:false,
      teaching:false
    };
    this.selecactividad.value.forEach(element => {

      for (let i = 0; i < this.listaActividad.length; i++) {
        if(this.listaActividad[i].name == element){
          this.infolab.facilActivity[this.listaActividad[i].id] = true;
        }     
      }
    
    });
   
  }



  // METODO QUE TRAE UN ESPACIO ESPECIFICO DEPENDIENDO EL ID-ESPACIO
  buscarEspacio(idespacio) {
    let arr = [];
    for (let i = 0; i < 1; i++) {
      if(idespacio){
       this.servicioMod2.buscarEspacio(idespacio).then(data=>{
       
         arr.push(data.data());
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
          this.servicioMod2.buscarServicio(clave).then(data => {
            const servicio =  data.data();
            const serv = {
              nombre: servicio.cfName,
              descripcion: servicio.cfDesc,
              precio: servicio.cfPrice,
              activo: servicio.active,
              variaciones: this.variations(clave),
              uid: data.id,
              residuos: servicio.residuos ? 'Si' : 'No'
             };
             arr.push(serv);

            this.servicioMod2.getSolicitudesServiciosForId(clave).then(dataSol => {
   
              dataSol.forEach(doc => {
                const element = doc.data();

                  const solicitud = {
                    nombreServ: servicio.cfName,
                    descripcionServ: servicio.cfDesc,
                    precioServ: element.cfPrice,
                    activoServ: servicio.active,
                    email: element.emailuser,
                    uidServ: doc.id,
                    fecha: element.createdAt.split('T')[0],
                    estado: element.status
                  };

                  arr2.push(solicitud);
               
              });


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
           this.servicioMod2.buscarPractica(clave).then(data => {
           const practica =  data.data();
            this.servicioMod2.buscarProgramacion(clave).then(data2 => {

              data2.forEach(doc=>{
                const prog = doc.data();

                if(prog){
                  const pract = {
                    nombre: practica.practiceName,
                    programacion: {
                      id_pro: doc.id,
                      estudiantes: prog.noStudents,
                      horario: prog.schedule,
                      semestre: prog.semester
                    },
                    activo: practica.active
                   };

                   arr.push(pract);
                }
              })



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
           this.servicioMod2.buscarEquipo(clave).then(data => {
           const equip =  data.data();

             // funciona con una programacion, cuando hayan mas toca crear otro metodo
                const equipo = {
                  nombre: equip.cfName,
                  activo: equip.active,
                  precio: equip.price,
                  componentes:this.estructurarComponents(clave)
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

    this.servicioMod2.buscarComponente(item).then(data => {
      data.forEach(doc => {
        const element = doc.data();
        const componente = {
          id: doc.id,
          nombre: element.cfName,
          descripcion: element.cfDescription,
          precio: element.cfPrice,
          marca: element.brand,
          modelo: element.model,
          estado: element.active
        };

        arr.push(componente);

      })
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
           this.servicioMod2.buscarPersona(clave).then(data => {
            const pers =  data.data();
            let persona = {};
            if(pers.user){
              this.servicioMod2.buscarUsuario(pers.user).then(dataper => {
                // funciona con una programacion, cuando hayan mas toca crear otro metodo
                if(dataper.data()){

                  persona = {
                    id: clave,
                    nombre: pers.cfFirstNames + ' ' + pers.cfFamilyNames,
                    activo: pers.active,
                    email: dataper.data().email,
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
           this.servicioMod2.buscarProyectos(clave).then(data => {
            const project =  data.data();

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
           this.servicioMod2.buscarFacultad(clave).then(data => {
           const facultad =  data.data();
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
              this.servicioMod2.buscarDepartamento(clave, key).then(data => {
              const departamento =  data.data();
                arr.push({idfacul:clave, id:key, nombre:departamento.departmentName});
              });
           }

          }
        }

      }
    }

    return arr;
  }

  estructuraTelefonos(idlab){
    let tels = [];
    this.servicioMod2.buscarTelefono(idlab).then(data=>{
      data.forEach(element=>{
        tels.push({id:element.id, nombre:element.data().cfEAddrValue});
      });
    });

    return tels;
  }

  estructurarSpace(item, keyprincipal) {

    const arr = [];

    for (const clave in item) {
      // Controlando que json realmente tenga esa propiedad
      if (item.hasOwnProperty(clave)) {

        if (item[clave]) {
          this.servicioMod2.buscarEspacio(clave).then(data => {
            const espacio = data.data();

              // funciona con una programacion, cuando hayan mas toca crear otro metodo
              if (espacio) {
                const space = {
                  id_space: data.id,
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

  actividades(actividad){
    let arrayActividades = [];
    const actividades = {
      extension: 'Extension',
      research: 'Investigacion',
      teaching: 'Docencia'
    };
    for (const key in actividad) {
      if (actividad.hasOwnProperty(key)) {
        if(actividad[key]){
          arrayActividades.push(actividades[key]);
        }
        
      }
    }

    return arrayActividades;
  }


  cargarSedes(){
    this.servicioMod2.getSedes().then(data=>{
      data.forEach(doc => {
        this.sedes.push({id:doc.id, nombre:doc.data().cfName});
      });
    });
  }

  cargarSubsedes(){
    this.servicioMod2.getSubSedes().then(data=>{
      data.forEach(doc => {
        this.subsedes.push({id:doc.id, nombre:doc.data().cfAddrline1});
      });
    });
  }

  cargarFacultades(){
    this.servicioMod2.getFacultades().then(data=>{
      data.forEach(doc => {
        this.facultades.push({id:doc.id, nombre:doc.data().facultyName});
        this.cargarDepartamentos(doc.id);
      });
    });
  }


  cargarDepartamentos(idfacul){
    this.servicioMod2.getDepartamentos(idfacul).then(data=>{
      data.forEach(doc => {
        this.departamentos.push({id:doc.id, idfacul:idfacul, nombre:doc.data().departmentName});
      });
    });
  }



  // METODO QUE ESTRUCTURA LAS VARIACIONES DE UN SERVICIO
  variations(clave){
    const variaciones = [];
    this.servicioMod2.getVariaciones(clave).then(data => {
      if(data){
        data.forEach(doc => {
          variaciones.push(doc.data());
        });
      } else {
        return variaciones;
      }

    });
    return variaciones;
  }


  getUserId() {
    this.user = this.servicioMod2.getLocalStorageUser();
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
  getRoles(rol) {
    this.moduloNivel2 = false;
    this.moduloPermiso = false;
    for (const clave in rol) {
      if (rol[clave]) {

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

      for (let i = 0; i < data.length; i++) {
        const element = data[i].payload.doc.data().spaceData;
        this.espacios.push({id:data[i].payload.doc.id, nombre:element.building + ' - ' +element.place});
      }
    });
  }


  editar(){

    if(this.moduloNivel2){
      swal({

        type: 'warning',
        title: 'Esta seguro que desea enviar los cambios realizados',
        showCancelButton: true,
        confirmButtonText: 'Si, enviar',
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
    
          this.infolab.cfAvailability = this.listaDisponibilidad;
          this.infolab.faculties = this.estructurarEnvioSugerenciaFacDep(this.listaFacultades,'faculties');
          this.infolab.departments = this.estructurarEnvioSugerenciaFacDep(this.listaDepartamentos,'departments');
          this.selectorActividad();
    
          this.estructurarEnvioActividades();
          
          if(this.infolab.mainSpace){
            this.infolab['active'] = true; 
          }
    
          this.servicioMod2.updateDocLaboratorio(this.labestructurado.uid, this.infolab)
              .then(data=>{
    
            swal.close();
            swal({
              type: 'success',
              title: 'Cambios Realizados',
              showConfirmButton: true
            }).then(()=>{
               this.obs.changeObjectLab({nombre:this.labestructurado.nombre.nom1 + this.labestructurado.nombre.nom2, uid: this.labestructurado.uid})
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


            this.servicioMod2.buscarPersona(this.servicioMod2.getLocalStoragePers().cfPers)
              .then(person=>{
              aux.suggestedChanges.push({
                pos: this.labestructurado.cambios.length,
                data: dataEstructurada,
                uid: this.user.uid,
                fecha: this.fecha.getDate()+'/'+(this.fecha.getMonth()+1)+'/'+this.fecha.getFullYear(),
                nombre: person.data().cfFirstNames + ' ' + person.data().cfFamilyNames,
                estado: 'pendiente'
              });

             this.servicioMod2.setDocLaboratorio(this.labestructurado.uid, aux).then(()=>{
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
        const cambio = JSON.parse(JSON.stringify(this.infolab));
        cambio['cfAvailability'] = this.listaDisponibilidad;
        cambio['facilActivity'] = {};
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
                    this.servicioMod2.updateDocLaboratorio(this.labestructurado.uid, obj);
                  }else{
                    cambio[aux[0]] = this.estructurarEnvioSugerenciaFacDep(this.sugerencia.data[cont].info, aux);
                  }
                }else if(aux == 'cfAvailability'){

                  cambio[aux[0]] = this.estructurarEnvioSuferenciaDisponibilidad(this.sugerencia.data[cont].info,this.sugerencia.data[cont].quitar);

                }else if (aux == 'cfEAddr'){
                  if(this.sugerencia.data[cont].quitar){               
                    this.EnviarcfEAddr(this.sugerencia.data[cont].infoaux, false);
                  }else{
                    this.EnviarcfEAddr(this.sugerencia.data[cont].info, true);
                  }
                }else if(aux == 'facilActivity'){
              
                  if(this.sugerencia.data[cont].quitar){
                    const obj = {};
                    obj[aux] = this.estructurarEnvioSugerenciaActividad(this.sugerencia.data[cont].infoaux, false);
                                    
                    this.servicioMod2.setDocLaboratorio(this.labestructurado.uid, obj);
                  }else{
                    cambio[aux[0]] = {};

                    cambio[aux[0]] = this.estructurarEnvioSugerenciaActividad(this.sugerencia.data[cont].info, true);
                  }
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
        cambio['suggestedChanges'] =  this.cambiarEstadoSugerencia(this.sugerencia.pos, 'aprobado');

        this.servicioMod2.setDocLaboratorio(this.labestructurado.uid, cambio).then(data=>{
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
    return obj;
  }

  estructurarEnvioActividades(){
    const retirado = this.elementosRetirados(this.listaTelefonos, this.labestructurado.telefonos);
    this.EnviarcfEAddr(retirado,false)
    const agregado =  this.elementosRetirados(this.labestructurado.telefonos, this.listaTelefonos);
    this.EnviarcfEAddr(agregado, true);
  }

  EnviarcfEAddr(data, accion){
    for (let i = 0; i < data.length; i++) {
      const element = data[i];
      if(accion){
        this.servicioMod2.addAddrLaboratorio(this.labestructurado.uid,element.nombre);
      }else{
        this.servicioMod2.deleteAddrLaboratorio(this.labestructurado.uid, element.id);
      }

    }
  }

  estructurarEnvioSugerenciaActividad(data, value){
    let auxactiviti = {};

    for (let i = 0; i < data.length; i++) {
      auxactiviti[data[i].id] = value;
    }

    return auxactiviti;
  }



  cambiarEstadoSugerencia(pos, estado){
    const cam = this.labestructurado.cambios.slice();
    for (let i = 0; i < cam.length; i++) {
      const element = cam[i];

      if(element.pos == pos  && element.estado == 'pendiente'){
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
    cambio['suggestedChanges'] = this.cambiarEstadoSugerencia(this.sugerencia.pos, 'desaprobado');

    this.servicioMod2.updateDocLaboratorio(this.labestructurado.uid, cambio).then(data=>{
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
    const aux1 = ['facultades','departamentos','disponibilidad', 'telefonos','actividad', 'descripcion', 'condiciones', 'sede', 'subsede', 'espacioPrincipal','info.email'];
    const aux2 = ['faculties', 'departments', 'cfAvailability', 'cfEAddr', 'facilActivity','cfDescr', 'cfConditions','headquarter', 'subHq', 'mainSpace', 'otros.email'];
    const aux3 = ['this.listaFaculSugeridos', 'this.listaDeparSugeridos', 'this.listaDispoSugeridos', 'this.listaTelSugeridos'];
    const aux4 = ['this.listaFacultades', 'this.listaDepartamentos', 'this.listaDisponibilidad', 'this.listaTelefonos'];
    const data = [];
    let element;
    let element2;

    for (let i = 0; i < aux1.length; i++) {

      element = aux1[i].split('.');
      element2 = aux2[i].split('.');
      let infoauxiliar = this.infolab[element2];

      if(element.length != 2){
        if((aux1[i] == 'facultades') || (aux1[i] == 'departamentos') || (aux1[i] == 'disponibilidad') || (aux1[i] == 'telefonos')){
          const sugeridos = [];
          for (let j = 0; j < eval(aux3[i]).length; j++) {
            const element = eval(aux3[i])[j];
            sugeridos.push(element);
          }

          if(sugeridos.length != 0){
            data.push({llave: aux2[i], nombre: aux1[i],info:sugeridos, cambio: false});
          }

            const arr1 = eval(aux4[i]);
            const arr2 = eval('this.labestructurado.'+aux1[i]);
            const retirados = this.elementosRetirados(arr1,arr2);
            if(retirados.length != 0){
              data.push({llave: aux2[i], quitar:true,nombre: aux1[i],infoaux:retirados, info:arr1,cambio: false});
            }
          
         
        }else if(aux1[i] == 'actividad'){
          this.selectorActividad();

          const sugeridosAct = [];
          const retiradosAct = [];

          for (const key in this.infolab.facilActivity) {
            if (this.infolab.facilActivity.hasOwnProperty(key)) {

              if(this.infolab.facilActivity[key] != this.labestructurado.objectActividad[key]){
                if(this.infolab.facilActivity[key]){
                  sugeridosAct.push({id:key, nombre:this.listaActividad.find(o => o.id == key).name});
                }else{
                  retiradosAct.push({id:key, nombre:this.listaActividad.find(o => o.id == key).name});
                }
              }
              
            }
          }


          if(sugeridosAct.length != 0){
            data.push({llave: aux2[i], nombre: aux1[i],info:sugeridosAct, cambio: false});
           
          }
          
          if(retiradosAct.length != 0){
            data.push({llave: aux2[i], quitar:true,nombre: aux1[i],infoaux:retiradosAct, info:[],cambio: false});
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

  elementosAgregados(arr1, arr2){
    let arr = [];
    let encontro = false;

    for (let i = 0; i < arr2.length; i++) {
      encontro = false;
   
      for (let j = 0; j < arr1.length; j++) {

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
      if(element.pos == item && element.estado == 'pendiente'){
        return element;
      }
    }
  }

  cambiarEspacioSel(item){
    if(item != 'inicial'){
      this.espaciosel = this.buscarEspacioLocal(item);
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


    this.infolab.headquarter = this.labestructurado.sede.id;
    this.infolab.subHq = this.labestructurado.subsede.id;
    this.infolab.cfDescr = this.labestructurado.descripcion;
    this.listaFacultades = this.labestructurado.facultades.slice();
    this.listaDepartamentos = this.labestructurado.departamentos.slice();
    this.infolab.mainSpace = this.labestructurado.espacioPrincipal;
    this.infolab.cfConditions = this.labestructurado.condiciones;
    this.listaDisponibilidad = this.labestructurado.disponibilidad.slice();
    this.listaTelefonos = this.labestructurado.telefonos.slice();

    this.selecactividad.setValue(this.labestructurado.actividad);

    this.listaFaculSugeridos = [];
    this.listaDeparSugeridos = [];
    this.listaDispoSugeridos = [];
    this.listaTelSugeridos = [];
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

    swal({
      type: 'success',
      title: 'disponibilidad agregada',
      showConfirmButton: true
    });

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

  agregarTelefonos(){
    this.listaTelefonos.push({id:this.listaTelefonos.length,nombre:this.telefono});
    if(this.moduloPermiso){
      this.listaTelSugeridos.push({id:this.listaTelefonos.length,nombre:this.telefono});
    }

    swal({
      type: 'success',
      title: 'telefono agregado',
      showConfirmButton: true
    });
    this.telefono = '';

  }

  quitarTelefonos(id){
    const encontrado = this.listaTelefonos.find((element, index) => {
      if(element.id == id){
        this.listaTelefonos.splice(index, 1);
        if(this.moduloPermiso){
          this.listaTelSugeridos.splice(index, 1);
        }
        return true;
      }
      return false;
    });

    swal({
      type: 'success',
      title:'Telefono Eliminado',
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


  cerrarModal(modal){
    $('#'+modal).modal('hide');
  }

  resetIconos(){ 
    this.iconos = {
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
  }



}
