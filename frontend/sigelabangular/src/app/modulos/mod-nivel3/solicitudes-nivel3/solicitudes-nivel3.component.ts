import { Observable } from 'rxjs/Observable';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ObservablesService } from '../../../shared/services/observables.service';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import swal from 'sweetalert2';

import * as _ from "lodash";
import * as firebase from 'firebase/app';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireStorage } from 'angularfire2/storage';

import { URLAPI } from '../../../config';
import { Http } from '@angular/http';

declare var $: any;
@Component({
  selector: 'app-solicitudes-nivel3',
  templateUrl: './solicitudes-nivel3.component.html',
  styleUrls: ['./solicitudes-nivel3.component.css']
})
export class SolicitudesNivel3Component implements OnInit {

  itemsel: any;

  datos:any;
  histodatos:any;

  displayedColumns = ['id','nombre', 'fecha', 'tipo', 'estado'];
  displayedColumns2 = ['id','nombre', 'fecha', 'laboratorio', 'estado'];

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
    componentes:false,
    panico:false
  };

  panico = {
    nombre:'',
    descripcion:''
  };


  user:any;

  listaArchivos = [];
  files = [];
  filePath:any;
  ref:any;

  selectedFiles: FileList;
  currentUpload: Upload;
  private basePath:string = '/cotizaciones';

  rol:any;
  moduloNivel2 = false;
  moduloSolicitudes = false;

  solicitudesCoin = [];
  solicitudesEjecu = 0;
  montoSolicitudes = 0;

  infosabs:any;
  response:any;

  comentario = '';
  costo = '';

  constructor(private afs: AngularFirestore, private storage:AngularFireStorage, private http:Http) {
  }

   ngOnInit() {

    this.getRoles();

    if (localStorage.getItem('usuario')) {
      this.user = JSON.parse(localStorage.getItem('usuario'));   
    }
    
    this.alertaCargando();
                

    this.getCollectionSolicitudes().then(data1 => {
      this.itemsel = data1;
      this.estructurarSolicitudesActivas(data1).then(datos => {

        this.dataSource.data = datos['data'];
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;

        this.dataSource2.data = datos['data2'];
        this.dataSource2.sort = this.sort2;
        this.dataSource2.paginator = this.paginator2;

        this.cerrarAlerta();
      });
                 
    });

  }

  // METODOS PARA SUBIR UNA COTIZACION

  cambiarEstadoSolicitud(estado){
    const obj = {
      acceptedBy:this.user.email,
      updatedAt: new Date().toISOString(),
      status:'',
      path:this.solsel.path
    };

    if(estado == 'rechazado'){
      obj['comment'] = this.comentario;
      obj.status = 'rechazada';
      this.afs.collection('request').doc(this.solsel.uidsol).update(obj).then(()=>{
        console.log('hecho');
        this.solsel.status = 'rechazada';
      });
    }else if(estado == 'aceptada'){
      obj.status = 'aceptada';
      this.afs.collection('request').doc(this.solsel.uidsol).update(obj).then(()=>{
        console.log('hecho');
        this.solsel.status = 'aceptada';
      });
    }else{
      obj.status = 'realizada';
      obj['costo'] = this.costo;
      const upload = this.uploadMulti();
      for (let i = 0; i < upload.length; i++) {
        obj.path.push(upload[i]);      
      }
      
      this.afs.collection('request').doc(this.solsel.uidsol).update(obj).then(()=>{
        console.log('hecho');
        this.solsel.status = 'realizada';
      });
    }


  }

   
  alistarVariables(event){
  
    let tamano = false;
    for (let i = 0; i < event.target.files.length; i++) {
      
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
      for (let i = 0; i < event.target.files.length; i++) {
        this.listaArchivos.push(event.target.files[i]);
      }
      
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

    let files = this.listaArchivos;
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


  getCollectionSolicitudes() {
    const col = this.afs.collection('request');
    const refer = col.ref.where('requestType', '==', 'mantenimiento');
    return refer.get();
  }

  estructurarSolicitudesActivas(data) {
    this.datos = [];
    let promise = new Promise((resolve, reject)=>{
      const activo = [];

      const historial = [];

      data.forEach(doc => {
        const elemento = doc.data();
        this.getLaboratorio(elemento.cfFacil).then(lab => {
          this.getEmailUser(elemento.createdBy).then(email => {
            const Solicitud = {
              uidsol:doc.id,
              uidlab: elemento.cfFacil,
              uidespacio: elemento.headquarter,
              nombrelab: lab.data().cfName,
              status: elemento.status,
              tipo: elemento.maintenanceType,
              descripcion: elemento.requestDesc,
              usuario: email.data().email,
              activo: elemento.active,
              idEquipo: elemento.relatedEquipments,
              componentes: this.estructurarComponenteId(elemento.relatedEquipments,elemento.relatedComponents),
              fecha: elemento.createdAt.split('T')[0],
              editado: elemento.updatedAt.split('T')[0],
              proveedores: elemento.providersInfo,
              path: elemento.path,
              costo:elemento.costo
            };
            if(elemento.comment){
              Solicitud['comment'] = elemento.comment;
            }
            if(elemento.relatedEquipments != ''){
              this.getEquipo(elemento.relatedEquipments).then(equipo => {
                Solicitud['equipo'] = equipo.data();
                Solicitud['nombreEquip'] = equipo.data().cfName;
              });
            }else{
              Solicitud['equipo'] = {};
              Solicitud['nombreEquip'] = 'no especificado';  
              Solicitud['panicoequipo'] =  elemento.panicoequipo;
              Solicitud['panicodescripcion'] =  elemento.panicodescripcion;
  
            }
            if(elemento.status == 'pendiente' || elemento.status == 'aceptada'){
              activo.push(Solicitud);
            } else {
              historial.push(Solicitud);
            }

            this.datos.push(Solicitud);
  
  
            if(data.size == (activo.length+historial.length)){
              resolve({data:activo, data2: historial});
            }
  
  
    
          });
        });
        
      });
  
    });


    return promise;
  }

   getEmailUser(userid){
    return this.afs.doc('user/' + userid).ref.get();
  }

  getEquipo(equipid){
    return this.afs.doc('cfEquip/' + equipid).ref.get();
  }

  getLaboratorio(labid){
    return this.afs.doc('cfFacil/' + labid).ref.get();
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
           const equip =  data.data();

             // funciona con una programacion, cuando hayan mas toca crear otro metodo
                const equipo = {
                  id: data.id,
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



  cambiarDataSolicitud(item){
    this.solsel = item;
    const aux = this.buscarCoincidenciasSolicitudes(item);
    this.solicitudesCoin = aux.coin;
    this.solicitudesEjecu = aux.mane;
    this.montoSolicitudes = aux.monto;


    this.infosabs = undefined;

    if(item.idEquipo){
      console.log('paso');
      this.consultaEquipo(item.idEquipo).then(data => {
        this.alertaCargando();
        this.consultarSabs(data.data().inventory).then(() => {
          this.infosabs = this.response;
          swal.close();
        }).catch((error)=>{
       
            swal.close();
            swal({
              type: 'error',
              title: 'No se pudo conectar con SABS',
              showConfirmButton: true
            });

            this.infosabs = undefined;
          
        });
      });
    }



  }

  // METODO QUE TRAE LOS DATOS EXISTENTES EN SABS
  consultarSabs(item) {

    this.infosabs = {};
    const promise = new Promise((resolve, reject) => {

      const url =  URLAPI;
      const body = {
        codInventario: item,
        codLab: '5646',
        nomLab: 'fgh',
        sede: 'fgh',
        edificio: '567',
        espacio: 'fghgf'
      };

      this.http.post(url, body). subscribe((res) => {
        console.log(res.json());
        if (res.status === 200) {
          console.log('funco');
          this.response =  res.json().inventario;
          resolve();
        } else {
          reject();
        }

      }, (error) => {
          console.log('faio', error);
          this.response = {};
          reject();
      });


    });


    return promise;
  }

  

  buscarCoincidenciasSolicitudes(item){
    const coincidencias = [];
    let manejecutados = 0;
    let montosol = 0;
    const fechaActual = parseInt(new Date().toISOString().split('-')[0])-2;

    for (let i = 0; i < this.datos.length; i++) {

        
      if((this.datos[i].idEquipo == item.idEquipo)){
        coincidencias.push(this.datos[i]);
        if(this.datos[i].status == 'realizada'){
          const fecha = parseInt(this.datos[i].editado.split('-')[0]);
         
          if(fechaActual <= fecha){
            manejecutados++;
            montosol += parseInt(this.datos[i].costo);
          }
        } 
      }
    }

    return {coin:coincidencias, mane:manejecutados, monto:montosol};
  }

  consultaEquipo(id){
    return this.afs.collection('cfEquip').doc(id).ref.get();
  }

  cambiarDataComponentes(item){
   this.dataSourceComp = new MatTableDataSource(item.componentes);
  }

  descargarArchivo(index){
    const ref = this.storage.ref(this.solsel.path[index]);
    ref.getDownloadURL().subscribe(data => {
      window.open(data);
    }); ;
  }

  quitarArchivo(index){

    this.listaArchivos.splice(index, 1);
    swal(
      'archivo retirado',
      '',
      'error'
    );
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

  cerrarModal(modal){
    $('#'+modal).modal('hide');
  }

  inicializarMante(){
    this.reserMan = {
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
}
