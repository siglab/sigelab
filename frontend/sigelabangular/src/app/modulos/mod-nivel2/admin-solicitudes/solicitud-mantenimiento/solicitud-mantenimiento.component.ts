import { ObservablesService } from './../../../../shared/services/observables.service';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import swal from 'sweetalert2';
import { SelectionModel } from '@angular/cdk/collections';
import { AngularFireStorage } from 'angularfire2/storage';

import * as _ from "lodash";
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-solicitud-mantenimiento',
  templateUrl: './solicitud-mantenimiento.component.html',
  styleUrls: ['./solicitud-mantenimiento.component.css']
})
export class SolicitudMantenimientoComponent implements OnInit {
  itemsel: any;

  datos:any;
  histodatos:any;

  displayedColumns = ['nombre', 'fecha', 'tipo', 'estado'];
  displayedColumns2 = ['nombre', 'fecha', 'laboratorio', 'estado'];

  dataSource = new MatTableDataSource([]);
  dataSource2 = new MatTableDataSource([]);

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('sort') sort: MatSort;

  @ViewChild('paginator2') paginator2: MatPaginator;
  @ViewChild('sort2') sort2: MatSort;

  // equipos
  displayedColumnsEquip = ['select', 'nombre'];
  dataSourceEquip = new MatTableDataSource([]);
  @ViewChild('paginatorEquip') paginatorEquip: MatPaginator;
  @ViewChild('sortEquip') sortEquip: MatSort;

  // componentes
  displayedColumnsComp = ['select', 'nombre'];
  dataSourceComp = new MatTableDataSource([]);
  @ViewChild('paginatorComp') paginatorComp: MatPaginator;
  @ViewChild('sortComp') sortComp: MatSort;
  
  selection = new SelectionModel(true, []);
  selection2 = new SelectionModel(true, []);

  
  solsel:any;

  reserMan = {
    cfOrgUnit:'',
    headquarter:'',
    cfFacil:'',
    createdBy:'',
    requestDesc:'',
    requestType:'mantenimiento',
    maintenanceType:'',
    providersInfo:[],
    relatedEquipments:'',
    relatedComponents:{},
    status:'pendiente',
    active:true,
    createdAt:'',
    updatedAt:'',
    path:[]
  };

  proovedor = {
    name:'',
    contactNumbers:[],
    attachments:{}
  };

  telproov = {
    tel1:'',
    tel2:''
  }

  iconosModal = {
    servicio:false,
    variacion:false,
    equipos:false,
    componentes:false
  };

  lab_id:any;

  equipos:any;

  user:any;

  files = [];
  filePath:any;
  ref:any;

  selectedFiles: FileList;
  currentUpload: Upload;
  private basePath:string = '/cotizaciones';

  rol:any;
  moduloNivel2 = false;
  moduloSolicitudes = false;

  constructor(private obs: ObservablesService, private afs: AngularFirestore, private storage:AngularFireStorage) {
  }

  ngOnInit() {
    this.getRoles();

    if (localStorage.getItem('usuario')) {
      this.user = JSON.parse(localStorage.getItem('usuario'));   
    }
    this.obs.currentObjectSolMan.subscribe(data => {

      if(data.length != 0){

        this.alertaCargando();
                
        this.itemsel = data;
        this.lab_id = data.uid;

        this.getCollectionSolicitudes(data.uid).subscribe(data1 => {
          console.log(data1);
          this.datos = this.estructurarSolicitudesActivas(data1, data);
          this.histodatos = this.datos;
          
            setTimeout(() => {
              if(this.datos){
                this.dataSource.data = this.datos;
                this.dataSource.sort = this.sort;
                this.dataSource.paginator = this.paginator;
              }

              if(this.histodatos){
                this.dataSource2.data = this.histodatos;
                this.dataSource2.sort = this.sort2;
                this.dataSource2.paginator = this.paginator2;
              }

              if(this.datos.length != 0 || this.histodatos.length != 0){
                this.cerrarAlerta();
              } else {    
                swal({
                  type: 'error',
                  title: 'No existen solicitudes de mantenimiento a la fecha',
                  showConfirmButton: true
                });
                
              }
             
            }, 1500);
                     
        });

        this.getLaboratorio(data.uid).subscribe(labo => {
          this.equipos = this.estructurarEquipos(labo.payload.data().relatedEquipments);

          this.dataSourceEquip = new MatTableDataSource(this.equipos);

            setTimeout(() => {
              
              this.dataSourceEquip.sort = this.sortEquip;
              this.dataSourceEquip.paginator = this.paginatorEquip;

            }, 1000);
        });
      } else {
      
        swal({
          type: 'error',
          title: 'No se ha seleccionado ningun laboratorio',
          showConfirmButton: true
        });
        
      }
    });
  }

  // METODOS PARA SUBIR UNA COTIZACION

  alistarVariables(event){
    console.log(event.target.files);
    let tamano = false;
    for (let i = 0; i < event.target.files.length; i++) {
      console.log(event.target.files[i].size);
      if(event.target.files[i].size >= 33554432){
        tamano = true;
        break;
      }
    }

    if(tamano){
      swal(
        'Uno o mas archivos tienen mas peso del limite permitido (32 Mgb)',
        '',
        'error'
      );
    }else{
      this.files = event.target.files; 
    }
  }

  // METODO QUE ME TRAE EL ROL DE ACCESSO A NIVEL 2
  getRoles() {

    this.rol = JSON.parse(localStorage.getItem('rol'));
    console.log(this.rol);
    for (const clave in this.rol) {
      if (this.rol[clave]) {
        if ((clave === 'moduloNivel2')) {
          this.moduloNivel2 = true;
        }

        if ((clave === 'moduloSolicitudes')) {
          this.moduloSolicitudes = true;
        }
      }
    }
  }

  uploadMulti() {
    let filespath = [];

    let files = this.files;
    let filesIndex = _.range(files.length)
    _.each(filesIndex, (idx) => {
      this.currentUpload = new Upload(files[idx]);
      this.uploadFile(this.currentUpload);

      filespath.push('cotizaciones/'+ this.currentUpload.file.name);
    });

    return filespath;
  }

  uploadFile(upload: Upload) {

    let storageRef = firebase.storage().ref();
    let uploadTask = storageRef.child(`${this.basePath}/${upload.file.name}`).put(upload.file);

    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot) =>  {
        // upload in progress
        upload.progress = (snapshot['bytesTransferred'] / snapshot['totalBytes']) * 100
      },
      (error) => {
        // upload failed
        return false;
      },
      () => {
        // upload success
        return true;
      }
    );
  }

  // TABLA EQUIPOS PERTENECIENTES AL LABORATORIO
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.displayedColumnsEquip.length;
    return numSelected === numRows;
    
  }
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSourceEquip.data.forEach(row => this.selection.select(row));
  }

  // TABLA EQUIPOS PERTENECIENTES AL LABORATORIO
  isAllSelected2() {
    const numSelected = this.selection2.selected.length;
    const numRows = this.displayedColumnsComp.length;
    return numSelected === numRows;
    
  }
  masterToggle2() {
    this.isAllSelected() ?
      this.selection2.clear() :
      this.dataSourceComp.data.forEach(row => this.selection2.select(row));
  }


  getCollectionSolicitudes(labid) {
    return this.afs.collection('request',
      ref => ref.where('requestType', '==', 'mantenimiento').where('cfFacil','==',labid)).snapshotChanges();
  }

  estructurarSolicitudesActivas(data, lab) {
    const activo = [];

    for (let index = 0; index < data.length; index++) {
      const elemento = data[index].payload.doc.data();

      this.getEmailUser(elemento.createdBy).subscribe(email => {
        this.getEquipo(elemento.relatedEquipments).subscribe(equipo => {
          const Solicitud = {
            uidsol:data[index].payload.id,
            uidlab: elemento.cfFacil,
            uidespacio: elemento.headquarter,
            nombrelab: lab.nombre.nom1 + ' ' + lab.nombre.nom2,
            status: elemento.status,
            tipo: elemento.maintenanceType,
            descripcion: elemento.requestDesc,
            usuario: email.payload.data().email,
            activo: elemento.active,
            equipo: equipo.payload.data(),
            nombreEquip: equipo.payload.data().cfName,
            componentes: this.estructurarComponenteId(elemento.relatedEquipments,elemento.relatedComponents),
            fecha: elemento.createdAt.split('T')[0],
            editado: elemento.updatedAt.split('T')[0],
            proveedores: elemento.providersInfo
          };
          activo.push(Solicitud);
        });

      });

    }

    return activo;
  }

  getEmailUser(userid){
    return this.afs.doc('user/' + userid).snapshotChanges();
  }

  getEquipo(equipid){
    return this.afs.doc('cfEquip/' + equipid).snapshotChanges();
  }

  getLaboratorio(labid){
    return this.afs.doc('cfFacil/' + labid).snapshotChanges();
  }

  estructurarHistorialSolicitudes(data, lab) {

    const historial = [];

    for (let index = 0; index < data.length; index++) {
      const elemento = data[index].payload.doc.data();

      this.getEmailUser(elemento.createdBy).subscribe(email => {
        this.getEquipo(elemento.relatedEquipments).subscribe(equipo => {
          const Solicitud = {
            uidsol:data[index].payload.id,
            uidlab: elemento.cfFacil,
            uidespacio: elemento.headquarter,
            nombrelab: lab.nombre.nom1 + ' ' + lab.nombre.nom2,
            status: elemento.status,
            tipo: elemento.maintenanceType,
            descripcion: elemento.requestDesc,
            usuario: email.payload.data().email,
            activo: elemento.active,
            equipo: equipo.payload.data(),
            nombreEquip: equipo.payload.data().cfName,
            componentes: this.estructurarComponenteId(elemento.relatedEquipments,elemento.relatedComponents),
            fecha: elemento.createdAt.split('T')[0],
            editado: elemento.updatedAt.split('T')[0],
            proveedores: elemento.providersInfo
          };

          historial.push(Solicitud);
        });

      });
      
      

    }

    return historial;
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
                  id: data.payload.id,
                  nombre: equip.cfName,
                  activo: equip.active,
                  precio: equip.price,
                  componentes:this.estructurarComponents(clave),
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

   // METODO QUE ESTRUCTURA LA DATA DE LOS COMPONENTES EN LA VISTA BUSQUEDA DE LABORATORIOS
  // RECIBE EL NODO DE LABORATORIO QUE CONTIENE LAS PRACTICAS ASOCIADOS
  estructurarComponenteId(item, componente){
     const arr = [];

     for (const clave in componente) {
       // Controlando que json realmente tenga esa propiedad
       if (componente.hasOwnProperty(clave)) {
 
         if (componente[clave]) {
            this.afs.collection('cfEquip/' + item + '/components').doc(clave).snapshotChanges().subscribe(data => {
              const element =  data.payload.data();

            const comp = {
              id: data.payload.id,
              nombre: element.cfName,
              descripcion: element.cfDescription,
              precio: element.cfPrice,
              marca: element.brand,
              modelo: element.model,
              estado: element.active
            };
    
            arr.push(comp);
            });
         }
 
       }
     }
 
     return arr;
  }

  agregarSolicitudMan(){
    this.alertaCargando();
    const fecha = new Date();
    this.reserMan.cfFacil = this.lab_id;
    this.reserMan.createdAt = fecha.toISOString();
    this.reserMan.updatedAt = fecha.toISOString();
    this.reserMan.createdBy = this.user.uid;
    this.selection.selected.forEach(equipo => {
      this.reserMan.relatedEquipments = equipo.id;
    });

    this.selection2.selected.forEach(componente => {
      this.reserMan.relatedComponents[componente.id] = true;
    });

    this.reserMan.path = this.uploadMulti();

    console.log(this.reserMan);

    this.afs.collection('request').add(this.reserMan).then(data => {

      swal({
        type: 'success',
        title: 'Se ha agregado la solicitud, el ID de la solicitud es: '+data.id,
        showCancelButton: true,
        confirmButtonText: 'OK',
        timer: 5000,


      }).then((result) => {

        if (result.value) {
          result.dismiss === swal.DismissReason.cancel
        }

      });
         
    });
   
  }


  cambiarDataSolicitud(item){
    this.solsel = item;
  }

  cambiarDataComponentes(item){
   this.dataSourceComp = new MatTableDataSource(item.componentes);

    console.log(item);
  }

  agregarProovedor(){
    this.proovedor.contactNumbers.push(this.telproov.tel1);
    this.proovedor.contactNumbers.push(this.telproov.tel2);
    this.reserMan.providersInfo.push(this.proovedor);
    this.inicializarProovedor();

    console.log(this.reserMan.providersInfo);
  }

  quitarProovedor(index){
    this.reserMan.providersInfo.splice(index, 1);
  }


  inicializarProovedor(){
    this.proovedor = {
      name:'',
      contactNumbers:[],
      attachments:{}
    };
  
    this.telproov = {
      tel1:'',
      tel2:''
    }
  }

  inicializarSolicitud(){
    
    this.reserMan = {
      cfOrgUnit:'',
      headquarter:'',
      cfFacil:'',
      createdBy:'',
      requestDesc:'',
      requestType:'',
      maintenanceType:'',
      providersInfo:[],
      relatedEquipments:'',
      relatedComponents:{},
      status:'pendiente',
      active:true,
      createdAt:'',
      updatedAt:'',
      path:[]
    };
  }

  alertaCargando(){
    swal({
      title: 'Cargando un momento...',
      text: 'espere mientras se cargan los datos',
      onOpen: () => {
        swal.showLoading();
      }
    });
  }

  alertaExito(mensaje){
    return swal({
      type: 'success',
      title: mensaje,
      showConfirmButton: true
    });
  }

  alertaError(mensaje){
    swal({
      type: 'error',
      title: mensaje,
      showConfirmButton: true
    });
  }

  cerrarAlerta(){
    swal.close();
  }

  subir(){
    const fecha = new Date();
    const reser = {
      cfOrgUnit:'',
      headquarter:'',
      cfFacil:'jf2M1PRazsokIxoJpiJs',
      createdBy:'bZXTVtCUyXN2pqU9PUf4r4jEy1j2',
      requestDesc:'el equipo no enciende',
      requestType:'mentenimiento',
      maintenanceType:'preventivo',
      providersInfo:[{name:'samsungrepuestos',contactNumbers:['4534534','3344444'],attachments:{}},
                     {name:'lgrepuestos',contactNumbers:['242542','674353486787'],attachments:{}}],
      relatedEquipments:{
        CiRKr35nQQx0287yp7DN: true
      },
      relatedComponents:{
        m9hgyQKVt9XCgbHPl9gX:true
      },
      status:'pendiente',
      active:true,
      createdAt:fecha.toISOString(),
      updatedAt:fecha.toISOString()
    }

    this.afs.collection('request').add(reser);
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  applyFilter2(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource2.filter = filterValue;
  }

  cambiarIconoModal(box){
    if(!this.iconosModal[box]){
      this.iconosModal[box] = true;
    } else {
      this.iconosModal[box] = false;
    }
  }

  
}


export class Upload {

  $key: string;
  file:File;
  name:string;
  url:string;
  progress:number;
  createdAt: Date = new Date();

  constructor(file:File) {
    this.file = file;
  }
};