
import { element } from 'protractor';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import { AngularFirestoreCollection, AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ObserverPrincipalService } from '../services/observer-principal.service';
import { QuerysPrincipalService } from '../services/querys-principal.service';

import swal from 'sweetalert2';
import { Router } from '@angular/router';

declare var $: any;
@Component({
  selector: 'app-bus-lab',
  templateUrl: './bus-lab.component.html',
  styleUrls: ['./bus-lab.component.css']
})


export class BusLabComponent implements OnInit, AfterViewInit {

  user: any;
  selectedRowIndex = -1;
  corx = 3.42158;
  cory = -76.5205;
  map: any;

  // VARIABLES QUE SE UTILIZAN PARA LOS DATATABLES DE SERVICIOS Y PRACTICAS
  itemsel: any;
  servsel: any;
  prubsel: any;

  moduloinfo = false;
  layer = null;

  campoCondicion = '';
  condiciones = [];
  condicionesobjeto = {};

  variation:any;
  variacionSel = "";



  // INICIALIZACION DATATABLE lABORATORIOS
  displayedColumns = ['nombre', 'escuela', 'investigacion', 'director'];
  dataSource = new MatTableDataSource([]);
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('sort') sort: MatSort;

  // INICIALIZACION DATATABLE SERVICIOS
  displayedColumns2 = ['nombre'];
  dataSource2 = new MatTableDataSource([]);
  @ViewChild('paginator2') paginator2: MatPaginator;
  @ViewChild('sort2') sort2: MatSort;

  // INICIALIZACION DATATABLE PRUEBAS
  displayedColumns3 = ['nombre'];
  dataSource3 = new MatTableDataSource([]);
  @ViewChild('paginator3') paginator3: MatPaginator;
  @ViewChild('sort3') sort3: MatSort;

  DefaultIcon = L.icon({
    iconUrl: 'assets/leaflet/images/marker-icon.png',
    shadowUrl: 'assets/leaflet/images/marker-shadow.png'
  });

  listaVariaciones = [];


  constructor(private observer: ObserverPrincipalService, private query: QuerysPrincipalService, private ruta: Router) {
    if (localStorage.getItem('usuario')) {
      this.user = JSON.parse(localStorage.getItem('usuario'));
    }
  }


  ngOnInit() {
     // abre loading mientras se cargan los datos
    swal({
      title: 'Cargando un momento...',
      text: 'espere mientras se cargan los datos',
      onOpen: () => {
        swal.showLoading();
      }
    });
    // trae los datos de los laboratorios
      this.query.getLaboratorios().subscribe(data => {

      this.observer.changeDatatableLabs(this.query.estructurarDataLab(data));

    });

  }

  ngAfterViewInit(): void {

    this.observer.currentDatatableLab.subscribe(datos => {

      const ambiente = this;
      setTimeout(function() {
        ambiente.dataSource.data = datos;
        ambiente.dataSource.sort = ambiente.sort;
        ambiente.dataSource.paginator = ambiente.paginator;
    // cierra loading luego de cargados los datos
        swal.close();

      }, 1500);

     });




  }


  agregarSolicitudServicio() {
    const encontrado = this.listaVariaciones.find((element, index) => {
      if(element.id == this.variation.id){
        return true;
      }
      return false;
    });

    if(!encontrado){
      this.listaVariaciones.push({
        data: this.variation,
        condiciones: this.estructuraCondiciones(this.variation.data.cfConditions)
      }); 

      swal({
        type: 'success',
        title: 'Variacion agregada',
        showConfirmButton: true
      }); 
    }else{
      swal({
        type: 'error',
        title: 'Esta variacion ya se encuentra agregada',
        showConfirmButton: true
      });
    }
   
  }

  quitarVariacion(id){
    const encontrado = this.listaVariaciones.find((element, index) => {

      console.log(element);
      if(element.data.id == id){

        console.log(index);
        this.listaVariaciones.splice(index, 1);
        return true;
      }
      return false;
    });

    if(encontrado){
      swal({
        type: 'success',
        title: 'Variacion Eliminada',
        showConfirmButton: true
      });
    }

  }

  enviarSolicitudServicio(reserva){
    
    const fecha = new Date();

    if (this.user) {

      const cfSrvReserv = {
        cfFacil: this.itemsel.uid,
        namelab: this.itemsel.nombre,
        cfSrv: this.servsel.uid,
        user: this.user.uid,
        selectedVariations: {},
        cfStartDate: '',
        cfEndDate: '',
        cfClass: '',
        cfClassScheme: '',
        status: 'pendiente',
        createdAt: fecha.toISOString(),
        updatedAt:  fecha.toISOString(),
        conditionsLog: [],
        comments:[]
      };

        swal({

          type: 'warning',
          title: 'Esta seguro que desea solicitar este servicio',
          showCancelButton: true,
          confirmButtonText: 'Si, Solicitar',
          cancelButtonText: 'No, Cancelar'

        }).then((result) => {

          if (result.value) {
            if(reserva == 'convariaciones'){
          
              for (let j = 0; j < this.listaVariaciones.length; j++) {
                const element = this.listaVariaciones[j];
                cfSrvReserv.selectedVariations[element.data.id] = true; 
                cfSrvReserv.conditionsLog.push({condicion:element.condiciones, idvariacion: element.data.id});
              }
    
            } else {
              cfSrvReserv.conditionsLog =  this.estructuraCondiciones(this.servsel.condiciones);
            }

            cfSrvReserv.comments.push({
              commentText: this.campoCondicion, 
              fecha: fecha.getDate() + '/' + (fecha.getMonth()+1) + '/' + fecha.getFullYear(), 
              uid: this.user.uid});

            this.query.addSolicitudServicio(cfSrvReserv).then(() => {
              swal({
                type: 'success',
                title: 'Solicitud Creada Exitosamente',
                showConfirmButton: true
              }).then(()=>{
                $('#myModalLabs').modal('hide');
              });

             
  
            }).catch(error => {
  
              swal({
                type: 'error',
                title: error,
                showConfirmButton: true
              });
  
            });
          } else if (
            // Read more about handling dismissals
            result.dismiss === swal.DismissReason.cancel
          ) {
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
          title: 'Debe ingresar al sistema para poder solicitar este servicio',
          showConfirmButton: true
        });

    }

  }

  cambiardata(item) {

    /*  navega hacia bajo para mostrar al usuario la posicion de los datos */
    $('html, body').animate({ scrollTop: '400px' }, 'slow');

    this.itemsel  = item;

    this.dataSource2.data = item.servicios;
    this.dataSource3.data = item.practicas;

    const ambiente = this;

    if (!this.moduloinfo) {
      this.moduloinfo = true;

      setTimeout(function() {
        ambiente.loadMap(item);
        // ambiente.dataSource2.sort = ambiente.sort2;
        // ambiente.dataSource2.paginator = ambiente.paginator2;
        // ambiente.dataSource3.sort = ambiente.sort3;
        // ambiente.dataSource3.paginator = ambiente.paginator3;
      }, 1000);


     } else {

      this.removerMarker();
      this.agregarMarker(item);
     }

     setTimeout(function() {
      ambiente.dataSource2.sort = ambiente.sort2;
      ambiente.dataSource2.paginator = ambiente.paginator2;
      ambiente.dataSource3.sort = ambiente.sort3;
      ambiente.dataSource3.paginator = ambiente.paginator3;
    }, 1000);

  }

  cambiarVariacion(item){

    if(item != 'inicial'){
      this.variation = this.buscarVariacion(item);
      this.estructurarVariaciones(this.variation.data.cfConditions);
    } else {
      this.variation = undefined;
    }


  }

  cambiarDataServicio(item) {
    this.campoCondicion = '';
    this.variation = undefined;
    this.servsel = item;
    this.listaVariaciones = [];

    if(item.variaciones.length == 0){
      if(item.condiciones.length !== 0){
        console.log('entro');
        this.estructurarVariaciones(item.condiciones);
      }

    }
 
  }

  cambiarDataPrueba(item) {
    this.prubsel = item;
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

  //METODO QUE ME ESTRUCTURA EL ARREGLO DE CONDICIONES PARA EL OBJETO RESERVAS DE SERVICIOS
  estructuraCondiciones(variations){
    const arr = [];
    for (let i = 0; i < variations.length; i++) {
      const element = variations[i];

      const vari = {
        conditionText: variations[i],
        accepted: this.condicionesobjeto["checkbox"+i]
      }
      arr.push(vari);
    }
    return arr;
  }

  // ESTRUCTURA OBJETO JSON QUE SE ENLAZA A LOS CHECKBOX DE LA VISTA DE MANERA DINAMICA
  estructurarVariaciones(condiciones){
    this.condicionesobjeto = {};
    for (let i = 0; i < condiciones.length; i++) {
      //const element = condiciones[i];
      this.condicionesobjeto["checkbox"+i] = true;
    }
  }


  loadMap(item) {
    this.map = L.map('mapaa').setView([this.corx, this.cory], 13);
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    this.agregarMarker(item);
  }

  agregarMarker(item) {
    this.layer = L.marker([item.coord.lat, item.coord.lon], {icon: this.DefaultIcon});
    this.layer.addTo(this.map)
    .bindPopup(item.nombre)
    .openPopup();
  }

  removerMarker() {
    if (this.layer != null) {
      console.log('remover');
      this.layer.remove();
    }
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
  applyFilter3(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource3.filter = filterValue;
  }




}
