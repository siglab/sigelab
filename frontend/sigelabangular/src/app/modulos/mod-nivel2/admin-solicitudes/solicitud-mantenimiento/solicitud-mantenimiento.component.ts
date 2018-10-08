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
import { Http } from '@angular/http';
import { URLCORREO } from '../../../../config';
import { Modulo2Service } from '../../services/modulo2.service';


declare var $: any;

@Component({
  selector: 'app-solicitud-mantenimiento',
  templateUrl: './solicitud-mantenimiento.component.html',
  styleUrls: ['./solicitud-mantenimiento.component.css']
})
export class SolicitudMantenimientoComponent implements OnInit {
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
    path:[],
    costo:'0',
    acceptedBy:'',
    faculties:{}
  };

  proovedor = {
    name:'',
    contactNumbers:'',
    attachments:{},
    cot:'',
    correo:''
  };


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

  lab_id:any;

  equipos:any;

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

  constructor(private obs: ObservablesService,  private servicioMod2:Modulo2Service, 
              private storage:AngularFireStorage, private http:Http) {
  }

  ngOnInit() {
    $('html, body').animate({ scrollTop: '0px' }, 'slow');

  

    if (localStorage.getItem('usuario')) {
      this.user = JSON.parse(localStorage.getItem('usuario'));   
    }
    this.obs.currentObjectSolMan.subscribe(data => {

      this.getRoles(data.roles);
      if(data.length != 0){

        this.alertaCargando();
        this.itemsel = data;
        this.lab_id = data.uid;

        this.servicioMod2.getCollectionSolicitudesMantenimiento(data.uid).then(data1 => {
          if(data1.size != 0){
            this.datos = this.estructurarSolicitudesActivas(data1, data).then(datos => {
              this.dataSource.data = datos['data'];
              this.dataSource.sort = this.sort;
              this.dataSource.paginator = this.paginator;
  
              this.dataSource2.data = datos['data2'];
              this.dataSource2.sort = this.sort2;
              this.dataSource2.paginator = this.paginator2;
  
              this.cerrarAlerta();
            });
          }else{
            swal({
              type: 'error',
              title: 'El laboratorio seleccionado aun no tiene solicitudes de mantenimiento',
              showConfirmButton: true
            });
          }

                     
        });

        this.servicioMod2.buscarLab(data.uid).then(labo => {
          this.equipos = this.estructurarEquipos(labo.data().relatedEquipments);

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
  getRoles(rol) {
    this.moduloNivel2 = false;
    this.moduloSolicitudes = false;
    for (const clave in rol) {
      if (rol[clave]) {
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



  estructurarSolicitudesActivas(data, lab) {

    let promise = new Promise((resolve, reject)=>{
      const activo = [];

      const historial = [];

      data.forEach(doc => {
        const elemento = doc.data();
  
        this.servicioMod2.buscarUsuario(elemento.createdBy).then(email => {
          const Solicitud = {
            uidsol:doc.id,
            uidlab: elemento.cfFacil,
            uidespacio: elemento.headquarter,
            nombrelab: lab.nombre.nom1 + ' ' + lab.nombre.nom2,
            status: elemento.status,
            tipo: elemento.maintenanceType,
            descripcion: elemento.requestDesc,
            usuario: email.data().email,
            activo: elemento.active,
            componentes: this.estructurarComponenteId(elemento.relatedEquipments,elemento.relatedComponents),
            fecha: elemento.createdAt.split('T')[0],
            editado: elemento.updatedAt.split('T')[0],
            proveedores: elemento.providersInfo,
            path: elemento.path
          };
          if(elemento.comment){
            Solicitud['comment'] = elemento.comment;
          }
          if(elemento.relatedEquipments != ''){
            this.servicioMod2.buscarEquipo(elemento.relatedEquipments).then(equipo => {
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


          if(data.size == (activo.length+historial.length)){
            resolve({data:activo, data2: historial});
          }


  
        });
      });
  
    });


    return promise;
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
      });

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
            this.servicioMod2.getComponentForId(item, clave).then(data => {
              const element =  data.data();

            const comp = {
              id: data.id,
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

  agregarSolicitudMan(tipo){
    this.alertaCargando();
    const fecha = new Date();
    this.reserMan.cfFacil = this.lab_id;
    this.reserMan.createdAt = fecha.toISOString();
    this.reserMan.updatedAt = fecha.toISOString();
    this.reserMan.createdBy = this.user.uid;
    this.selection.selected.forEach(equipo => {
      this.reserMan.relatedEquipments = equipo.id;
    });
    this.reserMan.faculties = this.itemsel.labo.faculties;
    this.selection2.selected.forEach(componente => {
      this.reserMan.relatedComponents[componente.id] = true;
    });

    this.reserMan.path = this.uploadMulti();

    if(tipo == 'panico'){
      this.reserMan.maintenanceType = 'panico';
      this.reserMan['panicoequipo'] = this.panico.nombre;
      this.reserMan['panicodescripcion'] = this.panico.descripcion;
    }

    this.servicioMod2.addSolicitudMantenimiento(this.reserMan).then(data => {
      this.servicioMod2.Trazability(
        this.user.uid, 'create', 'request', data.id, this.reserMan
      ).then(()=>{
        this.enviarNotificacionesCorreo();

        swal({
          type: 'success',
          title: 'Se ha agregado la solicitud, el ID de la solicitud es: '+data.id,
          showCancelButton: true,
          confirmButtonText: 'OK',
          timer: 5000,
  
  
        }).then((result) => {
  
          if (result.value) {
            result.dismiss === swal.DismissReason.cancel
            this.cerrarModal('modal2');
            this.listaArchivos = [];
            this.inicializarMante();
          }
  
        });
      });
             
    });
   
  }


  cambiarDataSolicitud(item){
    this.solsel = item;
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
      contactNumbers:'',
      attachments:{},
      cot:'',
      correo:''
    };

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
      path:[],
      costo:'0',
      acceptedBy:'',
      faculties:{}
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


  enviarNotificacionesCorreo(){
    let ids = [];
    let email = [];
    let cont = 1;
    this.servicioMod2.buscarUsuarioNivel3().then(docs => {
      docs.forEach(doc => {
        ids.push(doc.id);
        email.push(doc.data().email);
        if(docs.size == cont){
          this.enviarNotificaciones(ids, this.user.email);
          this.enviarEmails(email, this.user.email);
        }else{
          cont++;
        }
      })   
    });

    ids = [];
    email = [];
    cont = 1;

    this.servicioMod2.buscarUsuarioNivel25().then(docs => {
      docs.forEach(doc => {
        this.servicioMod2.buscarPersona(doc.data().cfPers).then(persona => {

          for (const key in this.itemsel.labo.faculties) {
            if (this.itemsel.labo.faculties.hasOwnProperty(key)) {
  
              if(persona.data().faculty[key]){
                ids.push(doc.id);
                email.push(doc.data().email);
              }
              
            }
          }
          
          if(docs.size == cont){
            this.enviarNotificaciones(ids, this.user.email);
            this.enviarEmails(email, this.user.email);
          }else{
            cont++;
          }
      
        });



      });  
    });


   
  }

  enviarNotificaciones(notificaciones, emailSolicitante){

    const fecha = new Date().toISOString().split('T')[0];

    const mensaje = 'Se le notifica que se ha realizado una nueva solicitud de mantenimiento:, esta fue solicitada en la fecha ' + 
                      fecha +
                      ' por el usuario con el correo: ' + emailSolicitante +'.';

    const obj = {
      asunto: 'Solicitud de mantenimiento',
      mensaje:mensaje,
      fecha: new Date().toISOString().split('T')[0],
      estado: 'sinver'
    };

    for (let i = 0; i < notificaciones.length; i++) {
      const element = notificaciones[i];

      this.servicioMod2.enviarNotificacion(element, obj).then(()=>{
       
      });

    }

  }

  enviarEmails(emailSolicitante,analistas){


    const fecha = new Date();
    const fechaes = fecha.getDate()+'/'+(fecha.getMonth()+1)+'/'+fecha.getFullYear();
   

    const url = URLCORREO;
    const asunto = 'NUEVA SOLICITTUD DE SERVICIO';
    let destino = '';
    if(analistas){
      for (let i = 0; i < analistas.length; i++) {
        destino += analistas[i] + ','     
      }
    }
 
    const mensaje = 'Se le notifica que se ha realizado una nueva solicitud de mantenimiento: ' + 
                       ', esta fue solicitada en la fecha ' + fechaes +
                      ' por el usuario con el correo: ' + emailSolicitante +'.';

    destino += emailSolicitante;

    this.http.post(url,{para: destino, asunto: asunto, mensaje: mensaje}).subscribe((res) => {
      if(res.status == 200){
        console.log('notificaciones enviadas');
      } else {
        console.log('error notificaciones');
      }
    });

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
      path:[],
      costo:'0',
      acceptedBy:'',
      faculties:{}
    };
  }
  
  limpiarDatos(){
    
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
    path:[],
    costo:'0',
    acceptedBy:'',
    faculties:{}
  };

  this.selection.clear();
  this.selection2.clear();
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