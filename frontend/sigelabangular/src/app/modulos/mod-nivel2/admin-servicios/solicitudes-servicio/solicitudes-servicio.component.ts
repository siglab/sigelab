
import { ObservablesService } from './../../../../shared/services/observables.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { AfterViewInit, Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { AngularFirestoreCollection, AngularFirestore } from 'angularfire2/firestore';

import swal from 'sweetalert2';
import { Http } from '@angular/http';
declare var $: any;

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



  displayedColumns = ['nombre', 'fecha', 'email', 'estado'];
  displayedColumns2 = ['nombre', 'fecha', 'laboratorio', 'estado'];

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

   buttons = true;

   user:any;

   iconos = {
     sabs:false,
     info:false
   }

constructor(private obs: ObservablesService, private afs: AngularFirestore, private http: Http) {
 //this.obs.changeSolServ(this.servicioso);
}

  ngOnInit() {
    

    if (localStorage.getItem('usuario')) {
      this.user = JSON.parse(localStorage.getItem('usuario'));   
    }

    this.obs.currentObjectSolSer.subscribe(data => {

      if(data.length != 0){
        this.alertaCargando();

        this.getCollectionReserv(data.uid).subscribe(data1 => {
          this.datos = this.estructurarServiciosActivos(data1, data);
          this.histodatos = this.estructurarHistorialServicios(data1, data);
          console.log(this.datos);
          this.dataSource.data = this.datos;
          this.dataSource2.data = this.histodatos;
          
            setTimeout(() => {
              if(this.datos){
                this.dataSource.sort = this.sort;
                this.dataSource.paginator = this.paginator;
              }

              if(this.histodatos){
                this.dataSource2.sort = this.sort2;
                this.dataSource2.paginator = this.paginator2;
              }
              this.cerrarAlerta();
            }, 1500);
                     
        });
      }


    });

  }

  ngAfterViewInit(): void {



  }

  ngOnDestroy() {

  }


  getCollectionReserv(labid) {
    this.collectionReserv = this.afs.collection('cfSrvReserv',
      ref => ref.where('cfFacil', '==', labid));

    return this.collectionReserv.snapshotChanges();
  }

  estructurarServiciosActivos(data, lab) {
    const activo = [];

    for (let index = 0; index < data.length; index++) {
      const elemento = data[index].payload.doc.data();
      this.afs.doc('cfSrv/' + elemento.cfSrv).snapshotChanges().subscribe(data2 => {
        const servicio =  data2.payload.data();     

            if(elemento.status != 'rechazada' && elemento.status != 'cancelada'){
              this.getEmailUser(elemento.user).subscribe(email =>{
                const Reserv = {
                  uidlab: elemento.cfFacil,
                  nombrelab: lab.nombre.nom1 + ' ' + lab.nombre.nom2,
                  status: elemento.status,
                  nombre: servicio.cfName,
                  descripcion: servicio.cfDesc,
                  precio: servicio.cfPrice,
                  activo: servicio.active,
                  variaciones: this.estructurarVariaciones(elemento.cfSrv, elemento.selectedVariations),
                  condiciones: elemento.conditionsLog,
                  comentario: elemento.comments,
                  usuario: email.payload.data().email,
                  fecha: elemento.createdAt.split('T')[0],
                  uidserv: data2.payload.id,
                  uidreserv: data[index].payload.doc.id,
                  acepto: elemento.acceptedBy
                };
                activo.push(Reserv);
              });
            } 

      });

    }

    return activo;
  }

  estructurarHistorialServicios(data, lab) {

    const historial = [];

    for (let index = 0; index < data.length; index++) {
      const elemento = data[index].payload.doc.data();
      this.afs.doc('cfSrv/' + elemento.cfSrv).snapshotChanges().subscribe(data2 => {
        const servicio =  data2.payload.data();     

            if(elemento.status != 'pendiente' || elemento.status == 'aceptada' ){
              this.getEmailUser(elemento.user).subscribe(email =>{
                this.getLab(lab.uid).subscribe(laboratorio => {
                  const Reserv = {
                    uidlab: elemento.cfFacil,
                    nombrelab: lab.nombre.nom1 + ' ' + lab.nombre.nom2,
                    infolab:laboratorio.payload.data(),
                    status: elemento.status,
                    nombre: servicio.cfName,
                    descripcion: servicio.cfDesc,
                    precio: servicio.cfPrice,
                    activo: servicio.active,
                    variaciones: this.estructurarVariaciones(elemento.cfSrv, elemento.selectedVariations),
                    condiciones: elemento.conditionsLog,
                    comentario: elemento.comments,
                    usuario: email.payload.data().email,
                    fecha: elemento.createdAt.split('T')[0],
                    uidserv: data2.payload.id,
                    uidreserv: data[index].payload.doc.id
                  };
                  historial.push(Reserv);

                });
     
              });
            } 

      });

    }

    return historial;
  }




  estructurarVariaciones(idser,item){
    const arr = [];

    for (const clave in item) {
      // Controlando que json realmente tenga esa propiedad
      if (item.hasOwnProperty(clave)) {

        if (item[clave]) {        
          this.afs.doc('cfSrv/' + idser + '/variations/' + clave).snapshotChanges().subscribe(data => {
           const variacion =  data.payload.data();
       
            const vari = {
              id: clave,
              nombre: variacion.cfName,
              descripcion: variacion.cfDescription,
              precio: variacion.cfPrice,
              activo: variacion.active
              };

              arr.push(vari);      

           });
        }

      }
    }

    return arr;
  }

  getEmailUser(userid){
    return this.afs.doc('user/' + userid).snapshotChanges();
  }

  getLab(labid){
    return this.afs.doc('cfFacil/' + labid).snapshotChanges();
  }

  getPersona(persid){
    return this.afs.doc('cfPers/' + persid).snapshotChanges();
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
      console.log(this.condicion);
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
      this.condicionesobjeto["checkbox"+i] = condiciones[i].accepted;
    }
  }

  // ESTRUCTURA OBJETO JSON QUE SE ENLAZA A LOS CHECKBOX DE LA VISTA DE MANERA DINAMICA
  estructurarVariacionesCond(condiciones){
    this.condicionesobjeto = {};
    for (let i = 0; i < condiciones.length; i++) {
      //const element = condiciones[i];
      this.condicionesobjeto["checkbox"+i] = condiciones[i].accepted;
    }
  }

  // ENVIA UN COMENTARIO A LA RESERVA DE SERVICIO CORRESPONDIENTE
  enviarComentario(){
    const fecha = new Date();
    let cfSrvReserv = {
      comments:this.servicioActivoSel.comentario
    };

    cfSrvReserv.comments.push({
      commentText: this.comentario, 
      fecha: fecha.getDate() + '/' + (fecha.getMonth()+1) + '/' + fecha.getFullYear(), 
      uid: 'hgyuhvguhv'});

    this.afs.doc('cfSrvReserv/' + this.servicioActivoSel.uidreserv).update( cfSrvReserv).then(()=>{
      if(this.servicioActivoSel.status == 'aceptada'){
        this.enviarEmails();
      }
    });
     
  }

  enviarEmails(){
    this.alertaCargando();
    let emailSolicitante = '';
    let emailAcepto = '';
    let emailEncargado = '';
    let emailLaboratorio = '';
    const url = 'https://us-central1-develop-univalle.cloudfunctions.net/enviarCorreo';
    const asunto = 'NUEVO COMENTARIO AÑADIDO A SOLICITTUD DE SERVICIO';
    let destino = '';
    this.getLab(this.servicioActivoSel.uidlab).subscribe(lab => {
      emailSolicitante = this.servicioActivoSel.usuario;
      emailLaboratorio = lab.payload.data().otros.email;
      emailAcepto = this.servicioActivoSel.acepto;
      const mensaje = 'se le notifica que se ha agregado un nuevo comentario a la solicitud del servicio ' + 
                      this.servicioActivoSel.nombre + ' solicitada la fecha ' + this.servicioActivoSel.fecha +
                      ' por el usuario con el correo ' + emailSolicitante;

      this.getPersona(lab.payload.data().facilityAdmin).subscribe(persona => {
        emailEncargado = persona.payload.data().email;
        destino = emailSolicitante + ',' + emailAcepto + ',' + emailEncargado + ',' + emailLaboratorio;
        this.http.post(url,{para: destino, asunto: asunto, mensaje: mensaje}).subscribe((res) => {
          if(res.status == 200){
            //this.cerrarAlerta();
            this.alertaExito('Comentario enviado');
          } else {
            this.alertaError('fallo al enviar correos');
          }
        });

      });
    });
  }


  aceptarSolicitud(){
    this.alertaCargando();


    const reserva = {
      status: 'aceptada',
      acceptedBy: this.user.email
    }

    this.afs.doc('cfSrvReserv/' + this.servicioActivoSel.uidreserv).update(reserva).then(()=>{
      this.cerrarAlerta();
          this.alertaExito('Reserva aceptada');
    });
  }

  rechazarSolicitud(){
    this.alertaCargando();

    const reserva = {
      status: 'rechazada',
      acceptedBy: this.user.email
    }

    this.afs.doc('cfSrvReserv/' + this.servicioActivoSel.uidreserv).update(reserva).then(()=>{
      
          this.cerrarAlerta();
          this.alertaExito('Reserva rechazada');
    });
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




}


