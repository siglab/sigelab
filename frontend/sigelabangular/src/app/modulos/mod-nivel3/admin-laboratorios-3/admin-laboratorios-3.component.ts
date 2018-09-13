
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireStorage } from 'angularfire2/storage';
import { Observable } from 'rxjs/Observable';

import swal from 'sweetalert2';
import { Subscription } from 'rxjs';

import 'fullcalendar';
import 'fullcalendar-scheduler';

import * as $ from 'jquery';

import { ActivatedRoute } from '@angular/router';
import { map, take, debounceTime } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-laboratorios-3',
  templateUrl: './admin-laboratorios-3.component.html',
  styleUrls: ['./admin-laboratorios-3.component.css']
})
export class AdminLaboratorios3Component implements OnInit {


  // INICIALIZACION DATATABLE lABORATORIOS
  displayedColumns = ['nombre', 'escuela', 'investigacion', 'director'];
  dataSource = new MatTableDataSource([]);
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('sort') sort: MatSort;


  user: any;


  // VARIABLES QUE SE UTILIZAN PARA LOS DATATABLES DE SERVICIOS Y PRACTICAS
  itemsel: any;


  moduloinfo = false;


  labestructurado:any;
  laboratoriosEstructurados = [];


  cambios:any;


  tablesel = '';

  seleccionado: any;

  infolab = {
    //facilityAdmin:'',
    knowledgeArea:'',
    researchGroup:'',
    cfName:'',
    otros: {
      direccion: '',
      email: '',
      telefono: ''
    }
  };

  checks = {};

  sugerencia:any;


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

    // INICIALIZACION DATATABLE espacios
    displayedColumnsSpace = ['capacidad', 'arealibre', 'totalarea', 'spaceData.building', 'spaceData.place'];
    dataSourceSpace = new MatTableDataSource([]);
    @ViewChild('paginatorSpace') paginatorSpace: MatPaginator;
    @ViewChild('sortSpace') sortSpace: MatSort;

    // INICIALIZACION DATATABLE PERSONAL Activo
    displayedColumnsPers = ['nombre', 'email', 'tipo'];
    dataSourcePers = new MatTableDataSource([]);
    @ViewChild('paginatorPers') paginatorPers: MatPaginator;
    @ViewChild('sortPers') sortPers: MatSort;

    // INICIALIZACION DATATABLE PERSONAL InActivo
    displayedColumnsPersIn = ['nombre', 'email', 'tipo'];
    dataSourcePersIn = new MatTableDataSource([]);
    @ViewChild('paginatorPersIn') paginatorPersIn: MatPaginator;
    @ViewChild('sortPersIn') sortPersIn: MatSort;


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


    /*VARIABLES DE LA VISTA DE ESPACIOS*/

    mensaje = false;
    idlab;
    sede = 'san fernando';
    idsp;
    space = {
      capacity: '',
      createdAt: '',
      freeArea: '',
      headquarter: 'Vp0lIaYQJ8RGSEBwckdi',
      subHq: '',
      indxSa: '',
      map: '',
      minArea: '',
      ocupedArea: '',
      totalArea: '',
      spaceData: { building: '', place: '', floor: '' },
      active: false
    };

    espaciosel:any;
    plano:Observable<any>;

    sus: Subscription;

    //espaestructurado: any;


    /*VARIABLES DE LA VISTA PERSONAL */
    status = '';
    dispo;
    rolc = 'editar';

    nombre;
    apellido;
    email;
    rol;
    estado;
    idu;
    idp;
    activos = [];
    inactivos = [];
    fecha = new Date();
    addP;
    // objeto persona:
    person = {
      cfBirthdate: '',
      cfGender: '',
      cfUri: '',
      cfFamilyNames: '',
      cfFirstNames: '',
      cfOtherNames: '',
      cfOrgUnit: 'UK6cYXc1iYXCdSU30xmr',
      cfClass: 'cf7799e0-3477-11e1-b86c-0800200c9a66',
      cfClassScheme: '6b2b7d24-3491-11e1-b86c-0800200c9a66',
      cfFacil: '',
      active: true,
      user: '',
      lvl: '',
      email: '',
      type: '',
      relatedEquipments: {},
      createdAt: this.fecha.toISOString(),
      updatedAt: this.fecha.toISOString()

    };
    // objeto usuario

    usuario = {
      email: '',
      cfOrgUnit: 'UK6cYXc1iYXCdSU30xmr',
      appRoles: { IKLoR5biu1THaAMG4JOz: true },
      cfPers: '',
      active: true,
      createdAt: this.fecha.toISOString(),
      updatedAt: this.fecha.toISOString()

    };

    labo = {
      nombre:'',
      email:''
    };

    persestructurado: any;


  constructor( private afs: AngularFirestore,
               private storage: AngularFireStorage,
               private toastr: ToastrService) {
  }

  ngOnInit() {

    this.getUserId();
    $('html, body').animate({ scrollTop: '0px' }, 'slow');

    this.estructurarLab().then(() => {
      console.log(this.laboratoriosEstructurados);
      this.dataSource.data = this.laboratoriosEstructurados;
      setTimeout(()=>{

        if(this.laboratoriosEstructurados.length != 0){
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
        }


      }, 1500);
     //s this.limpiarData();



    });
  }

  ngOnDestroy(){

  }

  cambiardata(item, table) {
    this.tablesel = table;
    this.seleccionado = item;
  }



  estructurarLab(){
    this.labestructurado = {};
    this.laboratoriosEstructurados = [];

   let promise = new Promise((resolve,reject)=>{

    this.getLaboratorios().subscribe(labo=>{
      for (let i = 0; i < labo.length; i++) {

        const laboratorio = labo[i].payload.doc.data();

        this.buscarDirector(laboratorio.facilityAdmin).subscribe(dueno => {
          const duenoLab = dueno.payload.data();
          if (duenoLab) {

              console.log('ejecutame este');

                // convertir boolean a cadena de caracteres para estado del laboratorio
              let estadoLab;
                if (laboratorio.active === true) {
                estadoLab = 'Activo';
                } else if ( laboratorio.active === false ) {
                estadoLab = 'Inactivo';
                }
              this.labestructurado = {
                uid: labo[i].payload.doc.id,
                nombre: laboratorio.cfName,
                escuela: laboratorio.knowledgeArea,
                inves: laboratorio.researchGroup,
                director: duenoLab.cfFirstNames + ' ' + duenoLab.cfFamilyNames,
                iddueno: laboratorio.facilityAdmin,
                espacioPrin:  this.buscarEspacio(laboratorio.mainSpace),
                info: {dir: laboratorio.otros.direccion, tel: laboratorio.otros.telefono, cel: '', email: laboratorio.otros.email},
                servicios: this.estructurarServicios(laboratorio.relatedServices).arr,
                practicas: this.estructurarPracticas(laboratorio.relatedPractices).arr,
                equipos: this.estructurarEquipos(laboratorio.relatedEquipments),
                personal: this.estructurarPers(laboratorio.relatedPers),
                personalIna: this.estructurarPersIna(laboratorio.relatedPers),
                proyectos: this.estructurarProyectos(laboratorio.relatedProjects),
                solicitudes: this.estructurarServicios(laboratorio.relatedServices).arr2,
                espacios: this.estructurarSpace(laboratorio.relatedSpaces),
                cambios: laboratorio.suggestedChanges,
                estado: estadoLab
              };

              //sconsole.log(this.labestructurado);

              this.laboratoriosEstructurados.push(this.labestructurado);

             this.cambios = this.pendientes(laboratorio.suggestedChanges);

             this.cambios = [];


          }
        });

        if(i == labo.length-1){
          resolve();
        }
      }

    })
   });

   return promise;

  }



  // METODO QUE TRAE UN DIRECTOR ESPECIFICO DEPENDIENDO EL ID-DIRECTOR
  buscarDirector(iddirector) {
    return this.afs.doc('cfPers/' + iddirector).snapshotChanges();

  }

  // METODO QUE TRAE UN ESPACIO ESPECIFICO DEPENDIENDO EL ID-ESPACIO
  buscarEspacio(idespacio) {
    let arr = [];
    for (let i = 0; i < 1; i++) {
      if(idespacio){
        this.afs.doc('space/' + idespacio).snapshotChanges().subscribe(data=>{
         arr.push(data.payload.data());
        });
      }
    }

    return arr;
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
                  componentes:this.estructurarComponents(clave)
                  // servicios:this.estructurarServicios(equip.relatedSrv).arr,
                  // practicas:this.estructurarPracticas(equip.relatedPrac)
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

  estructurarSpace(item) {

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
                  active: espacio.active
                };

                arr.push(space);
              }

          });
        }

      }
    }

    console.log(arr);
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

  getPersona(persid) {
    return  this.afs.doc('cfPers/'+persid).snapshotChanges();
  }

  // METODO QUE TRAE LA COLECCION DE TODOS LOS LABORATORIOS
  getLaboratorios() {
    return this.afs.collection<any>('cfFacil').snapshotChanges();

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

  cambiarLaboratorio(item){


    console.log(item);
    this.idlab = item.uid;
    this.dataSourceSpace = new MatTableDataSource(item.espacios);

    this.itemsel = Observable.of(item);
    this.dataSourceSpace.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'spaceData.place': return item.spaceData.place;

        case 'spaceData.building': return item.spaceData.building;

        default: return item[property];
      }
    };

    setTimeout(() => {
        if (item.espacios.length > 0 ) {
          this.dataSourceSpace.paginator = this.paginatorSpace;
          this.dataSourceSpace.sort = this.sortSpace;
        }
        swal.close();
      }, 1000);

    if(this.laboratoriosEstructurados){
      this.dataSourceEquipos.data = item.equipos;

      this.dataSourcePersonal.data = item.personal;

      this.dataSourceServicios.data = item.servicios;

      this.dataSourceProyectos.data = item.proyectos;

      this.dataSourcePracticas.data = item.practicas;

      this.dataSourceSolicitudes.data = item.solicitudes;

      setTimeout(() => {

        this.dataSourceEquipos.sort = this.sortEquipos;
        this.dataSourceEquipos.paginator = this.paginatorEquipos;

        this.dataSourcePersonal.sort = this.sortPersonal;
        this.dataSourcePersonal.paginator = this.paginatorPersonal;

        this.dataSourceServicios.sort = this.sortServicios;
        this.dataSourceServicios.paginator = this.paginatorServicios;

        this.dataSourceProyectos.sort = this.sortProyectos;
        this.dataSourceProyectos.paginator = this.paginatorProyectos;

        this.dataSourcePracticas.sort = this.sortPracticas;
        this.dataSourcePracticas.paginator = this.paginatorPracticas;

        this.dataSourceSolicitudes.sort = this.sortSolicitudes;
        this.dataSourceSolicitudes.paginator = this.paginatorSolicitudes;

      }, 1500);


    }


    this.dataSourcePers.data = item.personal;
    this.dataSourcePersIn.data = item.personalIna;

    const ambiente = this;

    swal({
      title: 'Cargando un momento...',
      text: 'espere mientras se cargan los datos',
      onOpen: () => {
        swal.showLoading();
      }
    });


    setTimeout(function () {
      if (item.personal !== 0) {

        ambiente.dataSourcePers.sort = ambiente.sortPers;
        ambiente.dataSourcePers.paginator = ambiente.paginatorPers;
        ambiente.dataSourcePersIn.sort = ambiente.sortPersIn;
        ambiente.dataSourcePersIn.paginator = ambiente.paginatorPersIn;

      }

      swal.close();

    }, 2000);
  }

  nuevoLaboratorio(){

    swal({
      title: 'Cargando un momento...',
      text: 'espere mientras se crea el Laboratorio',
      onOpen: () => {
        swal.showLoading();
      }
    });

    const objFacil = {
      cfAcro: '',
      cfUri: '',
      cfName: '',
      category: '',
      foundationYear: '',
      knowledgeArea: '',
      researchGroup: '',
      cfDescr: '',
      cfKeyw: [],
      headquarter: '',
      subHq: '',
      faculties: {},
      departments: {
        facultadid: {}
      },
      cfClass: 'cf7799e7-3477-11e1-b86c-0800200c9a66',
      cfClassScheme: 'da0e5a01-c73e-4489-8cf7-917e9efcdad4',
      cfAvailability: '',
      cfConditions: [],
      cfOrgUnit: 'UK6cYXc1iYXCdSU30xmr',
      facilityAdmin: '',
      mainSpace: '',
      facilActivity: { teaching: true, research: true, extension: false },
      relatedPers: {},
      relatedEquipments: {},
      relatedMeasurement: {},
      relatedServices: {},
      relatedFacilities: {},
      relatedSpaces: {},
      relatedPractices: {},
      relatedRequest: {},
      relatedProjects: {},
      suggestedChanges:[],
      otros: { direccion: '' , email: '', telefono: '' },
      cfPrice: 0,
      cfCurrCode: 'COP',
      active: false,
      createdAt: this.fecha.toISOString(),
      updatedAt: this.fecha.toISOString()

    };

    objFacil.cfName = this.labo.nombre;

    this.afs.collection('cfPers', ref => ref.where('email', '==', this.labo.email))
    .snapshotChanges().subscribe(data => {
      if(data.length){
        const keyDirector = data[0].payload.doc.id;
        objFacil.facilityAdmin = keyDirector;

        this.afs.collection('cfFacil').add(objFacil).then(dato=>{
          swal({
            type: 'success',
            title: 'Laboratorio creado',
            showConfirmButton: true
          });
          console.log(dato.id);
        });

      } else {
        swal({
          type: 'error',
          title: 'el correo ingresado no se encuentra en los registros',
          showConfirmButton: true
        });
      }
      console.log(objFacil);

    });

  }


  editar(){

    swal({
      title: 'Cargando un momento...',
      text: 'espere mientras se ejecuta la solicitud',
      onOpen: () => {
        swal.showLoading();
      }
    });
    this.afs.doc('cfFacil/' + this.itemsel.value.uid).update(this.infolab).then(data=>{
      //this.obs.changeObjectLab({nombre:this.labestructurado.nombre.nom1 + this.labestructurado.nombre.nom2, uid: this.labestructurado.uid})

      swal.close();
      swal({
        type: 'success',
        title: 'Sugerencia de cambios ingresada',
        showConfirmButton: true
      }).then(()=>{
        const mod = $('#modal2');
        mod.removeClass('show');
      });

    });

  }

  enviarSugerencia(){

    let cont = 0;
    const cambio = this.infolab;
    for (const key in this.checks) {
      if (this.checks.hasOwnProperty(key)) {
        const element = this.checks[key];
        if(element){
          const aux = this.sugerencia.data[cont].llave.split('.');

          if(aux.length != 2){
            cambio[aux[0]] = this.sugerencia.data[cont].info;
          } else {
            cambio[aux[0]][aux[1]] = this.sugerencia.data[cont].info;
          }

        }
        cont++;
      }
    }


    cambio['suggestedChanges'] =  this.cambiarEstadoSugerencia(this.sugerencia.uid, 'aprobado');


    console.log(cambio);

    this.afs.doc('cfFacil/' + this.labestructurado.uid).update(cambio);



  }

  cambiarEstadoSugerencia(uid, estado){
    const cam = this.labestructurado.cambios;
    for (let i = 0; i < cam.length; i++) {
      const element = cam[i];

      if(element.uid == uid){
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
    const cambio = {};
    cambio['suggestedChanges'] = this.cambiarEstadoSugerencia(this.sugerencia.uid, 'desaprobado');

    console.log(cambio);
    this.afs.doc('cfFacil/' + this.labestructurado.uid).update(cambio);
  }

  estructurarDataCambios(){
    const aux1 = ['info.dir','info.email','info.tel'];
    const aux2 = ['otros.direccion', 'otros.email', 'otros.telefono'];
    const data = [];
    let element;
    let element2;

    for (let i = 0; i < aux1.length; i++) {

      element = aux1[i].split('.');
      element2 = aux2[i].split('.');


      if(element.length != 2){

        if(this.labestructurado[element] != this.infolab[element2]){
           data.push({llave: aux2[i], nombre: element2[0], info:this.infolab[element2], cambio: false});
        }
      } else {

        if(this.labestructurado[element[0]][element[1]] != this.infolab[element2[0]][element2[1]]) {
          data.push({llave: aux2[i], nombre: element2[1], info: this.infolab[element2[0]][element2[1]], cambio: false});
        }

      }


    }
    console.log(data);
    return data;
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
    for (let i = 0; i < this.itemsel.value.cambios.length; i++) {
      const element = this.itemsel.value.cambios[i];
      if(element.uid == item){
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

    for (let i = 0; i < this.itemsel.value.espacios.length; i++) {
      const element = this.itemsel.value.espacios[i];
      if(element.id_space == item){
        return element;
      }
    }
  }

  limpiarData(){
    this.seleccionado = 'inicial';
    this.sugerencia = undefined;
    this.infolab.otros.email = this.itemsel.value.info.email;
    this.infolab.otros.direccion = this.itemsel.value.info.dir;
    this.infolab.otros.telefono = this.itemsel.value.info.tel;
    this.infolab.cfName = this.itemsel.value.nombre;
    this.infolab.knowledgeArea = this.itemsel.value.escuela;
    this.infolab.researchGroup = this.itemsel.value.inves;
   // this.infolab.facilityAdmin = this.itemsel.value.iddueno;

  }

  cambiarIcono(box){
    if(!this.iconos[box]){
      this.iconos[box] = true;
    } else {
      this.iconos[box] = false;
    }
  }





  // FILTADORES DE LAS TABLAS

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

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




  /*METODOS DE LA VISTA DE ESPACIOS*/



  // METODO QUE ESTRUCTURA LA DATA DE LAS PRACTICAS EN LA VISTA BUSQUEDA DE LABORATORIOS
  // RECIBE EL NODO DE LABORATORIO QUE CONTIENE LAS PRACTICAS ASOCIADOS
  estructurarPracticas(item) {

    const arr = [];
    const arr2 = [];
    const arr3 = [];
    for (const clave in item) {
      // Controlando que json realmente tenga esa propiedad
      if (item.hasOwnProperty(clave)) {

        if (item[clave]) {
          this.afs.doc('practice/' + clave).snapshotChanges().subscribe(data => {
            const practica = data.payload.data();
            this.afs.doc('practice/' + clave).collection('programmingData').valueChanges().subscribe(data2 => {

              // funciona con una programacion, cuando hayan mas toca crear otro metodo
              const prog = data2[0];

              if (prog) {
                const pract = {
                  nombre: practica.practiceName,
                  programacion: {
                    estudiantes: prog['noStudents'],
                    diahora: prog['schedule'],
                    semestre: prog['semester']
                  },
                  activo: practica.active
                };
                 // construye los eventos para el calendario de cada laboratorio
                const evento = {

                    title: this.ajustarTexto(practica.practiceName).nom1 ,
                    start: prog['schedule'],
                    color: 'green',
                };


                  arr2.push(evento);

                if ( practica.active ) {

                  arr.push( pract );
                } else {
                  arr3.push( pract );
                }
              }


            });

          });
        }

      }
    }

    return {arr, arr2, arr3};
  }




  /* asigna la fila de la tabla a variables ngmodel */
  cambiardataEspacio(item) {
    console.log(item);
    this.idsp = item.id_space;
    this.space.totalArea = item.totalArea;
    this.space.capacity = item.capacity;
    this.space.freeArea = item.freeArea;
    this.space.indxSa = item.indxSa;
    this.space.minArea = item.minArea;
    this.space.ocupedArea = item.ocupedArea;
    this.space.spaceData.building = item.spaceData.building;
    this.space.spaceData.floor = item.spaceData.floor;
    this.space.spaceData.place = item.spaceData.place;
    this.space.map = item.map;
    this.space.active = item.active;

    this.cargarImagenVistaEspacio(this.space.map);
    this.listPracticeforSpace();



  }

  /* este metodo carga la imagen desde firebase con un parametro nombre de la imagen */
  cargarImagenVistaEspacio(name: string) {

    if (name) {
      this.mensaje = false;
      const ref = this.storage.ref('planos/' + name + '.png');
      this.plano = ref.getDownloadURL();
    } else {
      this.mensaje = true;
    }



  }

  setSpace() {

    const nuevoespacio = this.space;
    this.buscarSede().then((ok: string) => {
      nuevoespacio.subHq = ok;
      this.afs.collection('space').add(nuevoespacio).then( (data) => {
           // agrega el nuevo espacio al laboratorio actual
          this.updateFaciliti( data.id );
      });
      console.log(nuevoespacio);
    });
  }

  actualizarEspacio() {
    const nuevoespacio = this.space;

    this.buscarSede().then((ok: string) => {
      nuevoespacio.subHq = ok;

       this.afs.doc( 'space/' + this.idsp ).set( nuevoespacio, { merge: true} ).then( () => {
        swal({
          type: 'success',
          title: 'Actualizado Correctamente',
          showConfirmButton: true
        });

       });
      console.log(this.itemsel.value);
    });


  }

  /* metodo para buscar una subsede de cali  */
  buscarSede() {

    return new Promise((resolve, reject) => {
      this.afs.collection<any>('cfPAddr',
        ref => ref.where('cfAddrline1', '==', this.sede))
        .snapshotChanges().subscribe(data => {
          const idnuevo = data[0].payload.doc.id;

          console.log(idnuevo);
          resolve(idnuevo);
        });
    });

  }



  applyFilterEspace(filterValue: string) {

    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSourceSpace.filter = filterValue;
  }


  initCalendar( horario  ) {


    console.log('entro este es el horario', horario );
    const containerEl = $('#cal');
    containerEl.fullCalendar( 'destroy' );


    containerEl.fullCalendar({
      // licencia
      schedulerLicenseKey: 'GPL-My-Project-Is-Open-Source',
      // options here
      height: 420,

      header: {

        left: '',
        center: 'tittle',
        right: 'today prev,next'
      },
      events: horario  ,

      defaultView: 'month',

    });
  }

  updateFaciliti( idSp ) {


    const  relatedSpaces = {};
    relatedSpaces[idSp] = true;


    console.log('revisar este lab', this.idlab);
    this.afs.collection('cfFacil' ).doc(this.idlab).set(relatedSpaces  , { merge: true })
                   .then( () => {

                    swal({
                      type: 'success',
                      title: 'Creado Correctamente',
                      showConfirmButton: true
                    });
                   });

  }

  /* listar horario por espacio  */

  listPracticeforSpace() {

    console.log('entro el prro');

    const arr = [];

      this.afs.doc('practice/AmtSFtg3m5SrSc5iO2vK').collection('programmingData',
      ref => ref.where('space', '==', '1xCjO5lRbstnW20U2Lyz'))
      .snapshotChanges().subscribe(data => {
          if ( data) {
          data.forEach(element => {
            const elemento = element.payload.doc.data();
              arr.push( elemento );
          });
        }
      });

      console.log(arr);

  }


  /* setea campos del objeto */
  clearObj() {
    this.space.totalArea = '';
    this.space.capacity = '';
    this.space.freeArea = '';
    this.space.indxSa = '';
    this.space.minArea = '';
    this.space.ocupedArea = '';
    this.space.spaceData.building = '';
    this.space.spaceData.floor = '';
    this.space.spaceData.place = '';
  }





  /*METODOS DE LA VISTA PERSONAS*/

  estructuraIdPers(key) {

    const promise = new Promise((resolve, reject) => {
      this.buscarLab(key).subscribe(labo => {
        const laboratorio = labo.payload.data();

        let estadoLab;
        if (laboratorio.active === true) {
          estadoLab = 'Activo';
        } else if (laboratorio.active === false) {
          estadoLab = 'Inactivo';
        }

        this.persestructurado = {
          personal: this.estructurarPers(laboratorio.relatedPers),
          personalInactivo: this.estructurarPersIna(laboratorio.relatedPers),
          estado: estadoLab,
          uid: key
        };

        resolve();

      });
    });

    return promise;

  }

  estructurarPers(item) {

    const arr1 = [];

    for (const clave in item) {
      // Controlando que json realmente tenga esa propiedad
      if (item.hasOwnProperty(clave)) {
        if (item[clave]) {
          this.afs.doc('cfPers/' + clave).snapshotChanges().subscribe(data => {
            const pers = data.payload.data();

            let persona = {};
            if (pers.user) {
              this.afs.doc('user/' + pers.user).snapshotChanges().subscribe(dataper => {
                const user = dataper.payload.data();
                // funciona con una programacion, cuando hayan mas toca crear otro metodo

                persona = {
                  roles: user.appRoles,
                  nombre: pers.cfFirstNames,
                  apellidos: pers.cfFamilyNames,
                  activo: pers.active,
                  tipo: pers.type,
                  email: user.email,
                  idpers: clave,
                  iduser: pers.user,
                };

                if (pers.active) {
                  arr1.push(persona);
                }

              });
            } else {

              persona = {
                roles: '',
                nombre: pers.cfFirstNames,
                apellidos: pers.cfFamilyNames,
                activo: pers.active,
                tipo: pers.type,
                email: pers.email,
                idpers: clave,
                iduser: pers.user,
              };

              if (pers.active) {
                arr1.push(persona);
              }
            }
          });
        }
      }
    }
    return arr1;
  }

  estructurarPersIna(item) {

    const arr1 = [];

    for (const clave in item) {
      // Controlando que json realmente tenga esa propiedad
      if (item.hasOwnProperty(clave)) {
        if (item[clave]) {
          this.afs.doc('cfPers/' + clave).snapshotChanges().subscribe(data => {
            const pers = data.payload.data();
            let persona = {};

            if (pers.user) {
              this.afs.doc('user/' + pers.user).snapshotChanges().subscribe(dataper => {
                // funciona con una programacion, cuando hayan mas toca crear otro metodo
                persona = {
                  nombre: pers.cfFirstNames,
                  apellidos: pers.cfFamilyNames,
                  activo: pers.active,
                  tipo: pers.type,
                  email: dataper.payload.data().email,
                  roles: dataper.payload.data().appRoles,
                  idpers: clave,
                  iduser: pers.user,
                };

                if (!pers.active) {
                  arr1.push(persona);
                }

              });
            } else {
              persona = {
                nombre: pers.cfFirstNames,
                apellidos: pers.cfFamilyNames,
                activo: pers.active,
                tipo: pers.type,
                email: '',
                roles: '',
                idpers: clave,
                iduser: pers.user,
              };

              if (!pers.active) {
                arr1.push(persona);
              }


            }
          });
        }
      }
    }
    return arr1;
  }

  // METODO QUE TRAE UN DIRECTOR ESPECIFICO DEPENDIENDO EL ID-DIRECTOR
  buscarLab(idlab) {
    return this.afs.doc('cfFacil/' + idlab).snapshotChanges();

  }


  consultarRol() {

    return new Promise((resolve, reject) => {
      this.afs.collection<any>('appRoles',
        ref => ref.where('roleName', '==', this.rolc))
        .snapshotChanges().subscribe(data => {
          const idnuevo = data[0].payload.doc.id;

          console.log(idnuevo);
          resolve(idnuevo);
        });
    });
  }

  applyFilterPers(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSourcePers.filter = filterValue;
  }

  cambiardataPersonal(item) {

    console.log(item);

    this.nombre = item.nombre;
    this.estado = item.activo;
    this.email = item.email;
    this.apellido = item.apellidos;
    this.rol = item.tipo;
    this.idp = item.idpers;
    this.idu = item.iduser;


    // this.seleccionado = item;

  }

  actualizarPers() {


    if (!this.idu) {


      swal({
        type: 'info',
        title: 'La persona seleccionada aun no cuenta con un usuario asociado',
        showConfirmButton: true
      });
    } else {

      // $('#modal').modal('hide');

      /* objeto para persona  */
      const pers = {
        active: this.estado,
        cfFirstNames: this.nombre,
        cfFamilyNames: this.apellido
      };
      /* objeto para usuario */
      const user = {
        active: this.estado,
        appRoles: ''
      };

      /* metodo que consulta el rol */

      console.log(' se va actualizar esta persona', pers);

      this.consultarRol().then((ok) => {
        console.log(ok);
       // user.appRoles = this.register.setBoolean(ok);
        /* metodo firebase para subir un usuario actualizado */

        console.log('usuario con el rol', user);

        this.afs.collection('user').doc(this.idu).set(user, { merge: true });

        console.log('usuario con el rol', user);

      }).then(() => {
        /* metodo firebase para subir una persona actualizada */
        this.afs.collection('cfPers/').doc(this.idp).update(pers).then(
          () => {
            swal({
              type: 'success',
              title: 'usuario actualizado correctamente',
              showConfirmButton: true
            });

          }

        );
      });

    }


  }



  /* metodo para crear una  nueva persona dentro dl lab*/

  setPers() {

    if (this.email) {
      this.person.email = this.email;
      const pers = this.person;
      pers.cfFacil = this.idlab;
      console.log(pers);
      this.afs.collection('cfPers').add(pers)
        .then(ok => {

          this.updateFacilitiPers(ok.id);

          swal({
            type: 'success',
            title: 'persona creada correctamente',
            showConfirmButton: true
          });

        });

    } else {

      this.toastr.info('Es necesario el campo email', 'Email requerido');

    }

  }


  /* actualizar la coleccion cfPers con el nuevo id del usuario */

  updatePers(idU, pathP) {

    this.afs.collection('cfPers').doc(pathP).update({ user: idU });

  }

  /* actualizar el laboratorio con el nuevo id del document pers */

  updateFacilitiPers(idP) {

    console.log('entrooooooo');
    const facil = {
      relatedPers: {}
    };
    facil.relatedPers[idP] = true;


    console.log('revisar este lab', this.idlab);
    this.afs.collection('cfFacil').doc(this.idlab).set(facil, { merge: true });

  }

  emailcheck($event) {
    this.addP = '';
    const q = $event.target.value;
    if (q.trim() === '') {
      this.status = 'Campo obligatorio';
      // this.dispo = false;
    } else {
      this.status = 'Confirmando disponibilidad';
      const collref = this.afs.collection('cfPers').ref;
      const queryref = collref.where('email', '==', q);
      queryref.get().then((snapShot) => {
        if (snapShot.empty) {
          this.status = 'Email disponible';
          this.dispo = true;
        } else {
          console.log(snapShot.docs[0].id);
          this.status = 'Ya existe un usuario en el sistema con el email ingresado, si desea vincularlo presione el boton vincular.';
          this.dispo = false;
          this.addP = snapShot.docs[0].id;
        }
      });
    }
  }

  addLabPers(id: string) {

    if (id) {
      const lab = {
        relatedPers: {}
      };

      lab.relatedPers[id] = true;

      this.afs.doc('cfFacil/' + this.idlab).set(lab, { merge: true })
        .then(() => {

          //$('#modal1').modal('hide');
          this.toastr.success('Almacenado correctamente.', 'exito!');
        });
    } else {

      this.toastr.warning('Ocurrio un error, intente ingresar el email otra vez.');

    }


  }


}
