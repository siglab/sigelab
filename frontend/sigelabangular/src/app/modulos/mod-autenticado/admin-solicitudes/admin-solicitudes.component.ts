import { ObserverAutenticadoService } from './../services/observer-autenticado.service';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { QuerysAutenticadoService } from './../services/querys-autenticado.service';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';

import swal from 'sweetalert2';
import { Http } from '@angular/http';
import { AngularFireStorage } from 'angularfire2/storage';

declare var $: any;
@Component({
  selector: 'app-admin-solicitudes',
  templateUrl: './admin-solicitudes.component.html',
  styleUrls: ['./admin-solicitudes.component.css']
})
export class AdminSolicitudesComponent implements OnInit, AfterViewInit {

  user: any;

  // INICIALIZACION DATATABLE SERVICIO ACTIVOS
  displayedColumns = ['nombre', 'precio', 'estado'];
  dataSource = new MatTableDataSource([]);
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('sort') sort: MatSort;


  // INICIALIZACION DATATABLE SERVICIOS
  displayedColumns2 = ['nombre', 'precio', 'estado'];
  dataSource2 = new MatTableDataSource([]);
  @ViewChild('paginator2') paginator2: MatPaginator;
  @ViewChild('sort2') sort2: MatSort;

  dtOptions: any = {};
  dtOptions1: any = {};

  moduloinfo = false;

  servsel: any;

  // servicios: any;
  datos: any;
  histodatos: any;

  buttoncancel = false;

  variation:any;
  condicion:any;
  condicionesobjeto = {};

  comentario = '';

  iconos = {
    info:false,
    sabs:false
  }

  constructor(private querys: QuerysAutenticadoService, 
              private observer: ObserverAutenticadoService,
              private http:Http, private storage: AngularFireStorage) {

   }

  ngOnInit() {
     // abre loading mientras se cargan los datos
     

    if (localStorage.getItem('usuario')) {
      this.alertaCargando();
      this.user = JSON.parse(localStorage.getItem('usuario'));
      this.querys.getCollectionReserv(this.user.uid).subscribe(data => {
         this.querys.estructurarSolicitudesServicios(this.user.email, data).then(datos => {
          this.dataSource.data = datos['data'];
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator

          this.dataSource2.data = datos['data2'];
          this.dataSource2.sort = this.sort2;
          this.dataSource2.paginator = this.paginator2;


          this.cerrarAlerta();
         });
        
      });

    
    }



  }

  ngAfterViewInit() {



  }



  mostrardata(item) {
    this.servsel = item;
    this.variation = undefined;
    this.condicion = undefined;
    this.estructurarCondiciones(item.condiciones);
    this.buttoncancel = false;
    this.moduloinfo = true;
   
  }

  mostrardata2(item) {
    this.servsel = item;
    this.variation = undefined;
    this.condicion = undefined;
    this.estructurarCondiciones(item.condiciones);
    this.moduloinfo = true;
    if(this.servsel.status == 'pendiente'){
      this.buttoncancel = true;
    }else{
      this.buttoncancel = false;
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

  descargarDoc(){
    console.log(this.servsel.path);

    for (let i = 0; i < this.servsel.path.length; i++) {
      const ref = this.storage.ref(this.servsel.path[i]);
    
      ref.getDownloadURL().subscribe(data => {
        window.open(data);
      }); 
    }
  }

   // METODO QUE BUSCA LA VARIACION QUE COINCIDE CON EL ID ENVIADO DESDE LA VISTA
  buscarVariacion(item){
    for (let i = 0; i < this.servsel.variaciones.length; i++) {
      const element = this.servsel.variaciones[i];
      if(element.id == item){
        return element;
      }   
    }
  }

  buscarCondicion(item){
    for (let i = 0; i < this.servsel.condiciones.length; i++) {
      const element = this.servsel.condiciones[i];
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

  cancelarSolicitudServicio() {
    swal({
      type: 'warning',
      title: 'Esta seguro que desea cancelar este servicio',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.querys.cancerlarSolicitud(this.servsel.uidreserv).then(() => {

          swal({
            type: 'success',
            title: 'Solicitud de servicio Cancelada',
            showConfirmButton: true
          });

          this.moduloinfo = false;
          this.incializarIconos();
        });

      } else if (
        // Read more about handling dismissals
        result.dismiss === swal.DismissReason.cancel
      ) {
        swal(
          'Cancelado',
          '',
          'error'
        );
      }

    });

  }

  // ENVIA UN COMENTARIO A LA RESERVA DE SERVICIO CORRESPONDIENTE
  enviarComentario(){
    swal({

      type: 'warning',
      title: 'Esta seguro que desea enviar este comentario',
      showCancelButton: true,
      confirmButtonText: 'Si, Solicitar',
      cancelButtonText: 'No, Cancelar'

    }).then((result) => {

      if (result.value) {

        const fecha = new Date();
        let cfSrvReserv = {
          comments:this.servsel.comentario
        };
    
        cfSrvReserv.comments.push({
          commentText: this.comentario, 
          fecha: fecha.getDate() + '/' + (fecha.getMonth()+1) + '/' + fecha.getFullYear(), 
          autor: 'usuario',
          email: this.user.email,
          uid: this.user.uid});
    
        this.querys.updateComments(this.servsel.uidreserv, cfSrvReserv).then(()=>{
          if(this.servsel.status != 'pendiente'){
            //this.enviarEmails();
            console.log('envio emails');
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

  enviarEmails(){
    this.alertaCargando();
    let emailSolicitante = '';
    let emailAcepto = '';
    let emailEncargado = '';
    let emailLaboratorio = '';
    const url = 'https://us-central1-develop-univalle.cloudfunctions.net/enviarCorreo';
    const asunto = 'NUEVO COMENTARIO AÑADIDO A SOLICITTUD DE SERVICIO';
    let destino = '';
    this.querys.getLab(this.servsel.uidlab).subscribe(lab => {
      emailSolicitante = this.servsel.usuario;
      emailLaboratorio = lab.payload.data().otros.email;
      emailAcepto = this.servsel.acepto;
      const mensaje = 'se le notifica que se ha agregado un nuevo comentario a la solicitud del servicio ' + 
                      this.servsel.nombre + ' solicitada la fecha ' + this.servsel.fecha +
                      ' por el usuario con el correo ' + emailSolicitante +'. a continuacion vera el comentario: " '+
                      this.comentario +' "';

      this.querys.getPersona(lab.payload.data().facilityAdmin).subscribe(persona => {
        emailEncargado = persona.payload.data().email;
        destino = emailSolicitante + ',' + emailAcepto + ',' + emailEncargado + ',' + emailLaboratorio;
        console.log(destino);
        this.http.post(url,{para: destino, asunto: asunto, mensaje: mensaje}).subscribe((res) => {
          if(res.status == 200){
            //this.cerrarAlerta();
            this.alertaExito('Comentario enviado');
            this.comentario = '';
          } else {
            this.alertaError('fallo al enviar correos');
          }
        });

      });
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

  incializarIconos(){
    this.iconos.info = false;
    this.iconos.sabs = false;
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
