
import { ObservablesService } from './../../../../shared/services/observables.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { AfterViewInit, Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { AngularFirestoreCollection, AngularFirestore } from 'angularfire2/firestore';

import swal from 'sweetalert2';
import { Http } from '@angular/http';
import { Subscription } from 'rxjs';
import { AngularFireStorage } from 'angularfire2/storage';
declare var $: any;

import * as _ from "lodash";
import * as firebase from 'firebase/app';
import { URLCORREO } from '../../../../config';
import { Modulo2Service } from '../../services/modulo2.service';

@Component({
  selector: 'app-solicitudes-servicio',
  templateUrl: './solicitudes-servicio.component.html',
  styleUrls: ['./solicitudes-servicio.component.css']
})
export class SolicitudesServicioComponent implements OnInit, AfterViewInit, OnDestroy  {


moduloinfo = false;

itemsel: any;

// service: Observable<Array<any>>;
service: any;
histoservice: any;

servicioActivoSel:any;
histoServicioSel:any;

comentario = '';


  displayedColumns = ['nombre', 'fecha', 'edicion','aceptacion','estado', 'email'];
  displayedColumns2 = ['nombre', 'fecha', 'laboratorio', 'edicion', 'aceptacion', 'estado'];

  dataSource = new MatTableDataSource([]);
  dataSource2 = new MatTableDataSource([]);

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('sort') sort: MatSort;

  @ViewChild('paginator2') paginator2: MatPaginator;
  @ViewChild('sort2') sort2: MatSort;

   // INICIALIZACION DE CONSULTAS PARA SERVICIOS RESERVADOS POR EL USUARIO
   private collectionReserv: AngularFirestoreCollection<any>;

   private collectionHisto: AngularFirestoreCollection<any>;

   datos:any;
   histodatos:any;

   variation:any;
   condicion:any;

   condicionesobjeto = {};
   condicionesobjetoSrv = {};

   buttons = true;

   user:any;

   iconos = {
     sabs:false,
     info:false,
     archivos:false
   }

   sus: Subscription;

  files = [];

  listaArchivos = [];
  filePath:any;
  ref:any;


  selectedFiles: FileList;
  currentUpload: Upload;
  private basePath:string = '/archivos';

   rol:any;
   moduloNivel2 = false;
   moduloServicios = false;


   valorParametro = [];

  constructor(private obs: ObservablesService, private servicioMod2:Modulo2Service,
              private http: Http, private storage: AngularFireStorage) {
  //this.obs.changeSolServ(this.servicioso);
  }

  ngOnInit() {


    $('html, body').animate({ scrollTop: '0px' }, 'slow');

    if (localStorage.getItem('usuario')) {
      this.user = JSON.parse(localStorage.getItem('usuario'));
    }

    this.sus = this.obs.currentObjectSolSer.subscribe(data => {
      this.getRoles(data.roles);
      if(data.length != 0){
        this.alertaCargando();

        this.servicioMod2.getCollectionReservasServicios(data.uid).then(data1 => {
          if(data1.size != 0){
            this.estructurarServiciosActivos(data1, data).then(datos => {
              this.dataSource.data = datos['data'];
              this.dataSource.sort = this.sort;
              this.dataSource.paginator = this.paginator;

              this.dataSource2.data = datos['data2'];
              this.dataSource2.sort = this.sort2;
              this.dataSource2.paginator = this.paginator2;

              this.cerrarAlerta();
            });
          } else {
            this.alertaError('No tiene solicitudes de servicio registradas aún')
          }
              
                          
        });
      } else{
        swal({
          type: 'error',
          title: 'No se ha seleccionado ningún laboratorio',
          showConfirmButton: true
        });
      }


    });

  }

  ngAfterViewInit(): void {



  }

  ngOnDestroy(){
    this.sus.unsubscribe();
  }

  // METODO QUE ME TRAE EL ROL DE ACCESSO A NIVEL 2
  getRoles(rol) {
    this.moduloNivel2 = false;
    this.moduloServicios = false;
    for (const clave in rol) {
      if (rol[clave]) {
        if ((clave === 'moduloNivel2')) {
          this.moduloNivel2 = true;
        }

        if ((clave === 'moduloServicios')) {
          this.moduloServicios = true;
        }
      }
    }
  }



  estructurarServiciosActivos(data, lab) {

    let promise = new Promise((resolve, reject) => {
      const activo = [];
      const historial = [];
      
      data.forEach(doc => {
        const elemento = doc.data();
        this.servicioMod2.buscarServicio(elemento.cfSrv).then(data2 => {
          const servicio =  data2.data();   
          const Reserv = {
            uidlab: elemento.cfFacil,
            nombrelab: lab.nombre.nom1 + ' ' + lab.nombre.nom2,
            infolab: lab.labo,
            status: elemento.status,
            nombre: servicio.cfName,
            descripcion: servicio.cfDesc,
            precio: elemento.cfPrice,
            activo: servicio.active,
            variaciones: this.estructurarVariaciones(elemento.cfSrv, elemento.selectedVariations),
            condiciones: elemento.conditionsLog,
            condicionesSrv: elemento.conditionsLogServ,
            comentario: elemento.comments,
            usuario: elemento.emailuser,
            fecha: elemento.createdAt.split('T')[0],
            uidserv: data2.id,
            uidreserv: doc.id,
            path: elemento.path,
            residuos:servicio.residuos ? 'Si' : 'No',
            acepto: elemento.acceptedBy != '' ? elemento.acceptedBy : 'sin aceptar',
            fechaTermino: elemento.updatedAt.split('T')[0],
            parametrosVar:elemento.parametros,
            parametrosSrv: elemento.parametrosSrv,
            nombreParametros:servicio.parametros,
            precioTotal: elemento.precioTotal,
            descuento:elemento.descuento,
            fechaAceptacion: elemento.dateAccepted ? elemento.dateAccepted.split('T')[0] : 'sin aceptar'
          };

          if(elemento.dateAccepted){
            Reserv['fechaAcepto'] = elemento.dateAccepted.split('T')[0];
          }
  
            if(elemento.status == 'procesada' || elemento.status == 'aceptada' || elemento.status == 'pendiente' ){                 
              activo.push(Reserv);        
            }else{
              historial.push(Reserv);
            } 
  
            if(data.size == (activo.length + historial.length)){
              resolve({data:activo, data2:historial});
            }
  
  
        });
      });
     
    });
   

    return promise;
  }

  
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
        'Uno o más archivos tienen más peso del límite permitido (32 Mgb)',
        '',
        'error'
      );
    }else{
      for (let i = 0; i < event.target.files.length; i++) {
        this.listaArchivos.push(event.target.files[i]);
      }
      
    }

  }

  uploadMulti() {

    let filespath = [];

    if(this.servicioActivoSel.path.length != 0){
      filespath = this.servicioActivoSel.path;
    }

    let files = this.listaArchivos;
    let filesIndex = _.range(files.length);
    _.each(filesIndex, (idx) => {
      this.currentUpload = new Upload(files[idx]);
      this.uploadFile(this.currentUpload);

      filespath.push('archivos/' + this.currentUpload.file.name);
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



  estructurarVariaciones(idser,item){
    const arr = [];

    for (const clave in item) {
      // Controlando que json realmente tenga esa propiedad
      if (item.hasOwnProperty(clave)) {

        if (item[clave]) {
         this.servicioMod2.buscarVariacion(idser, clave).then(data => {
           const variacion =  data.data();

            const vari = {
              id: clave,
              nombre: variacion.cfName,
              descripcion: variacion.cfDescription,
              precio: variacion.cfPrice,
              activo: variacion.active,
              parametros:variacion.parametros,
              residuos: variacion.residuos ? 'Si' : 'No'
            };

              arr.push(vari);

           });
        }

      }
    }

    return arr;
  }


  quitarArchivo(index){

    this.listaArchivos.splice(index, 1);
    swal(
      'archivo retirado',
      '',
      'error'
    );
  }

  eliminarArchivo(index){
    swal({

      type: 'warning',
      title: '¿Está seguro que desea eliminar este archivo de la solicitud?',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'No, Cancelar'

    }).then((result) => {

      if (result.value) {
        let nuevopath = [];
        this.servicioActivoSel.path.forEach(element => {
          if(element != this.servicioActivoSel.path[index]){
            nuevopath.push(element);
          }
        });
        
        const ref = this.storage.ref(this.servicioActivoSel.path[index]);
        ref.delete().subscribe(() => {

          this.servicioMod2.updateReservasServicios(
            this.servicioActivoSel.uidreserv, {path:nuevopath})
          .then(() => {

            
            swal({
              type: 'success',
              title: 'Archivo eliminado',
              showConfirmButton: true
            }).then(() => {
              this.servicioActivoSel.path.splice(index,1);
            });
          });
        }); ;
       
      } else if (result.dismiss === swal.DismissReason.cancel) {
        swal(
          'Solicitud Cancelada',
          '',
          'error'
        );
      }

    });
 
  }

  descargarArchivo(index){
    const ref = this.storage.ref(this.servicioActivoSel.path[index]);
    ref.getDownloadURL().subscribe(data => {
      window.open(data);
    }); ;
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


  ocultar() {
   this.moduloinfo = false;
  }

  cambiarIcono(box){
    if(!this.iconos[box]){
      this.iconos[box] = true;
    } else {
      this.iconos[box] = false;
    }
  }



  cambiarDataServicio(item, table) {
    this.servicioActivoSel = item;
    this.variation = undefined;
    this.condicion = undefined;
    this.estructurarCondiciones(item.condiciones);
    this.estructurarCondicionesSrv(item.condicionesSrv);
    this.moduloinfo = true;
    console.log(item);
    if(table == 'activo'){
      this.buttons = true;
      console.log('activpo');
    } else {
      this.buttons = false;
      console.log('historia');
    }

  }

  cambiarVariacion(item){

    if(item != 'inicial'){
      this.variation = this.buscarVariacion(item);
      this.condicion =  this.buscarCondicion(item);
      for (let i = 0; i < this.servicioActivoSel.parametrosVar.find(o => o.id == this.variation.id).parametros.length; i++) {
        const element = this.servicioActivoSel.parametrosVar.find(o => o.id == this.variation.id).parametros[i];
        this.valorParametro.push(element.value);
      }
    
      this.estructurarCondiciones(this.condicion.condicion);
    } else {
      this.variation = undefined;
      this.condicion = undefined;
    }

    console.log(item);

  }

  // METODO QUE BUSCA LA VARIACION QUE COINCIDE CON EL ID ENVIADO DESDE LA VISTA
  buscarVariacion(item){
    for (let i = 0; i < this.servicioActivoSel.variaciones.length; i++) {
      const element = this.servicioActivoSel.variaciones[i];
      if(element.id == item){
        return element;
      }
    }
  }

  buscarCondicion(item){
    for (let i = 0; i < this.servicioActivoSel.condiciones.length; i++) {
      const element = this.servicioActivoSel.condiciones[i];
      if(element.idvariacion == item){
        return element;
      }
    }
  }

  // ESTRUCTURA OBJETO JSON QUE SE ENLAZA A LOS CHECKBOX DE LA VISTA DE MANERA DINAMICA
  estructurarCondiciones(condiciones){
    this.condicionesobjeto = {};
    for (let i = 0; i < condiciones.length; i++) {
      //const element = condiciones[i];
      this.condicionesobjeto["checkbox" + i] = condiciones[i].aceptada;
    }
  }

   // ESTRUCTURA OBJETO JSON QUE SE ENLAZA A LOS CHECKBOX DE LA VISTA DE MANERA DINAMICA
   estructurarCondicionesSrv(condiciones){
    this.condicionesobjetoSrv = {};
    for (let i = 0; i < condiciones.length; i++) {
      this.condicionesobjetoSrv["checkboxSrv" + i] = condiciones[i].aceptada;
 
    }
  }


  // ENVIA UN COMENTARIO A LA RESERVA DE SERVICIO CORRESPONDIENTE
  enviarComentario(){
    swal({

      type: 'warning',
      title: '¿Está seguro que desea enviar este comentario?',
      showCancelButton: true,
      confirmButtonText: 'Sí, Solicitar',
      cancelButtonText: 'No, Cancelar'

    }).then((result) => {

      if (result.value) {
        this.alertaCargando();
        const fecha = new Date();
        let cfSrvReserv = {
          comments:this.servicioActivoSel.comentario
        };

        cfSrvReserv.comments.push({
          commentText: this.comentario,
          fecha: fecha.getDate() + '/' + (fecha.getMonth() + 1) + '/' + fecha.getFullYear(),
          autor: 'lab'
        });

        this.servicioMod2.updateReservasServicios(this.servicioActivoSel.uidreserv, cfSrvReserv)
          .then(() => {
            if(this.servicioActivoSel.status != 'pendiente'){
              this.alertaExito('Comentario enviado');
              this.enviarNotificacionEmails();
            }
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

  enviarNotificacionEmails(){

    let emailSolicitante = '';
    let emailAcepto = '';
    let emailEncargado = '';
    let emailLaboratorio = '';
    const url = URLCORREO;
    const asunto = 'NUEVO COMENTARIO AÑADIDO A SOLICITTUD DE SERVICIO';
    let destino = '';

    emailSolicitante = this.servicioActivoSel.usuario;
    emailLaboratorio = this.servicioActivoSel.infolab.otros.email;
    emailAcepto = this.servicioActivoSel.acepto;
    const mensaje = 'se le notifica que se ha agregado un nuevo comentario a la solicitud del servicio ' +
                    this.servicioActivoSel.nombre + ' solicitada la fecha ' + this.servicioActivoSel.fecha +
                    ' por el usuario con el correo ' + emailSolicitante;

    this.servicioMod2.buscarPersona(this.servicioActivoSel.infolab.facilityAdmin).then(persona => {
      emailEncargado = persona.data().email;
      destino = emailSolicitante + ',' + emailAcepto + ',' + emailEncargado + ',' + emailLaboratorio;
      this.http.post(url,{para: destino, asunto: asunto, mensaje: mensaje}).subscribe((res) => {
        if(res.status == 200){
          //this.cerrarAlerta();
        } else {
          this.alertaError('Fallo al enviar correos');
        }
      });

    });
  }

  enviarEmails(estado, emaildirector){

    let emailSolicitante = '';

    const url = URLCORREO;
    const asunto = 'CAMBIO DE ESTADO DE LA SOLICITTUD DE SERVICIO';
    let destino = '';

    emailSolicitante = this.servicioActivoSel.usuario;

    const mensaje = 'Se le notifica que se ha cambiado el estado de la solicitud del servicio '  +
                    this.servicioActivoSel.nombre + ', solicitada la fecha ' + this.servicioActivoSel.fecha +
                    ' por el usuario con el correo ' + emailSolicitante + '. El estado al que cambio fue: ' + estado ;

    
    destino = emailSolicitante + ',' + emaildirector;
    this.http.post(url,{para: destino, asunto: asunto, mensaje: mensaje}).subscribe((res) => {
      if(res.status == 200){
        //this.cerrarAlerta();
      } else {
        this.alertaError('Fallo al enviar correos');
      }
    });
  }

  cambiarEstadoSolicitud(estado){
    swal({
      type: 'warning',
      title: '¿Está seguro de cambiar el estado de la solicitud?',
      showCancelButton: true,
      confirmButtonText: 'Sí, Cambiar',
      cancelButtonText: 'No, Cancelar'

    }).then((result) => {

      if (result.value) {

        //this.alertaCargando();
        const reserva = {
          status: estado,
          updatedAt: new Date().toISOString()
        };
        if(estado == 'procesada'){
          const filespath = this.uploadMulti();
          reserva['path'] = filespath;                        
        } else if(estado == 'aceptada'){
          reserva['acceptedBy'] = this.user.email;
          reserva['dateAccepted'] = new Date().toISOString();
        }

        this.servicioActivoSel.status = estado;     

        this.servicioMod2.updateReservasServicios(this.servicioActivoSel.uidreserv, reserva)
        .then(() => {
          if(estado == 'procesada'){
            swal({
              type: 'success',
              title: 'Solicitud procesada',
              showConfirmButton: true
            }).then(() => {
              this.cerrarModal('modalProcesar');
              this.listaArchivos = [];
            });
           
          }else{
            this.cerrarAlerta();
            this.alertaExito('Reserva ' + estado);
          }
         
        });
        this.servicioMod2.buscarPersona(this.servicioActivoSel.infolab.facilityAdmin).then(persona => {
          this.enviarEmails(estado, persona.data().email);
    
        });
   
        this.moduloinfo = false;
        this.resetIconos();
       
      } else if (result.dismiss === swal.DismissReason.cancel) {
        swal(
          'Solicitud Cancelada',
          '',
          'error'
        );
      }

    });


  }


  alertaCargando(){
    swal({
      title: 'Cargando un momento...',
      text: 'Espere mientras se cargan los datos',
      onOpen: () => {
        swal.showLoading();
      }
    });
  }

  alertaExito(mensaje){
    swal({
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



  cerrarModal(modal){
    $('#' + modal).modal('hide');
  }

  resetIconos(){
    this.iconos.info = false;
    this.iconos.sabs = false;
    this.iconos.archivos = false;
  }


}


export class Upload {

  $key: string;
  file: File;
  name: string;
  url: string;
  progress: number;
  createdAt: Date = new Date();

  constructor(file: File) {
    this.file = file;
  }
};
