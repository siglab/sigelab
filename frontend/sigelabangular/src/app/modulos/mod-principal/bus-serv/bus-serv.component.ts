import { MatSort, MatTableDataSource, MatPaginator } from '@angular/material';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import { ObserverPrincipalService } from '../services/observer-principal.service';
import { QuerysPrincipalService } from '../services/querys-principal.service';
import swal from 'sweetalert2';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';

declare var $: any;
@Component({
  selector: 'app-bus-serv',
  templateUrl: './bus-serv.component.html',
  styleUrls: ['./bus-serv.component.css']
})
export class BusServComponent implements OnInit, AfterViewInit {

  user: any;

  corx = 3.42158;
  cory = -76.5205;
  map: any;

   itemsel: any;

    moduloinfo = false;
    layer = null;

    DefaultIcon = L.icon({
      iconUrl: 'assets/leaflet/images/marker-icon.png',
      shadowUrl: 'assets/leaflet/images/marker-shadow.png'
    });

    campoCondicion = '';
    condicionesobjeto = {};

    variation:any;
    variacionSel = "";

    preciototal = 0;

    // INICIALIZACION DATATABLE lABORATORIOS
    displayedColumns = ['nombreserv', 'nombrelab'];
    dataSource = new MatTableDataSource([]);
    @ViewChild('paginator') paginator: MatPaginator;
    @ViewChild('sort') sort: MatSort;


    listaVariaciones = [];

    iconos = {
      info:true,
      var:false
    };

    selecunivalle = new FormControl();
    univalle = ['Trabajo de grado', 'Maestria', 'Doctorado', 'Proyecto de investigacion'];
    habilitarci = false;
    valorci = '';

    usuariounivalle = false;

  constructor(private observer: ObserverPrincipalService, private query: QuerysPrincipalService, private ruta: Router) {
    if (localStorage.getItem('usuario')) {
      this.user = JSON.parse(localStorage.getItem('usuario'));
      if(this.user.email.split('@')[1] == 'correounivalle.edu.co'){
        this.usuariounivalle = true;
      }
    }
  }

  ngOnInit() {
    // abrer loading mientras se cargan los datos
    swal({
      title: 'Cargando un momento...',
      onOpen: () => {
        swal.showLoading();
      }

    });

    this.query.getServicios().subscribe(data => {

      this.observer.changeDatatableServs(this.query.estructurarDataServ(data));

    });
  }

  ngAfterViewInit(): void {

    this.observer.currentDatatableServs.subscribe(datos => {

      const ambiente = this;
      setTimeout(function() {
        ambiente.dataSource.data = datos;
        ambiente.dataSource.sort = ambiente.sort;
        ambiente.dataSource.paginator = ambiente.paginator;
        // cierra loading luego de cargados los datos
        swal.close();
      }, 1000);

     });

  }

   // METODO QUE BUSCA LA VARIACION QUE COINCIDE CON EL ID ENVIADO DESDE LA VISTA
   buscarVariacion(item){
    for (let i = 0; i < this.itemsel.infoServ.variaciones.length; i++) {
      const element = this.itemsel.infoServ.variaciones[i];
      if(element.id == item){
        return element;
      }   
    }
  }

  cambiarVariacion(item){

    if(item != 'inicial'){
      this.variation = this.buscarVariacion(item);
      console.log(this.variation);
      this.estructurarVariaciones(this.variation.data.cfConditions);
    } else {
      this.variation = undefined;
    }


  }

  //METODO QUE ME ESTRUCTURA EL ARREGLO DE CONDICIONES PARA EL OBJETO RESERVAS DE SERVICIOS
  estructuraCondiciones(variations){
    const arr = [];
    for (let i = 0; i < variations.length; i++) {
      const element = variations[i];

      const vari = {
        conditionText: variations[i],
        aceptada: this.condicionesobjeto["checkbox"+i]
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

  agregarSolicitudServicio() {
    const encontrado = this.listaVariaciones.find((element, index) => {

      if(element.data.id == this.variation.id){
        return true;
      }
      return false;    
    });
  
    if(!encontrado){
      this.listaVariaciones.push({
        data: this.variation,
        condiciones: this.estructuraCondiciones(this.variation.data.cfConditions)
      }); 
      this.preciototal += parseInt(this.variation.data.cfPrice);
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


      if(element.data.id == id){
        this.preciototal -= parseInt(element.data.data.cfPrice);        
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
        cfFacil: this.itemsel.infoLab.uid,
        namelab: this.itemsel.nombrelab,
        cfSrv: this.itemsel.infoServ.uid,
        user: this.user.uid,
        selectedVariations: {},
        cfStartDate: '',
        cfEndDate: '',
        cfClass: '',
        cfClassScheme: '',
        cfPrice: this.itemsel.infoServ.precio,
        status: 'pendiente',
        createdAt: fecha.toISOString(),
        updatedAt:  fecha.toISOString(),
        conditionsLog: [],
        comments:[],
        typeuser:'externo',
        path:[],
        datauser:{type:'', ci:''}
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

              cfSrvReserv.cfPrice = ''+this.preciototal;
    
            } else {
              cfSrvReserv.conditionsLog =  this.estructuraCondiciones(this.itemsel.infoServ.condiciones);
            }

            if(this.usuariounivalle){
              cfSrvReserv.typeuser = 'interno'
             // cfSrvReserv.datauser.type = this.univalle[this.selecunivalle];
              cfSrvReserv.datauser.ci = this.valorci;
            }

            cfSrvReserv.comments.push({
              commentText: this.campoCondicion, 
              fecha: fecha.getDate() + '/' + (fecha.getMonth()+1) + '/' + fecha.getFullYear(), 
              uid: this.user.uid});
           
              console.log(cfSrvReserv);

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


  loadMap(item) {
    this.map = L.map('mapaaser').setView([this.corx, this.cory], 13);
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    this.agregarMarker(item);
  }

  cambiardata(item) { 
    console.log(item);
    this.listaVariaciones = [];
    this.variation = undefined;
    this.campoCondicion = '';
     /*  navega hacia bajo para mostrar al usuario la posicion de los datos */
   $('html, body').animate({ scrollTop: '400px' }, 'slow');
    this.itemsel = item;

    if(item.infoServ.variaciones.length == 0){
      if(item.infoServ.condiciones.length !== 0){
        this.estructurarVariaciones(item.infoServ.condiciones);
      }

    }
    

    if (!this.moduloinfo) {
      this.moduloinfo = true;
      const ambiente = this;
      setTimeout(function() {
        ambiente.loadMap(item);
      }, 1000);
     } else {

      this.removerMarker();
      this.agregarMarker(item);
     }
  }

  selectorunivalle(){
    this.habilitarci = false;
    this.selecunivalle.value.forEach(element => {
      if(element == 3){
        this.habilitarci = true;
      }
    });
  }


  cambiarIcono(box){
    if(!this.iconos[box]){
      this.iconos[box] = true;
    } else {
      this.iconos[box] = false;
    }
  }


  agregarMarker(item) {
    this.layer = L.marker([item.coord.lat, item.coord.lon], {icon: this.DefaultIcon});
    this.layer.addTo(this.map)
    .bindPopup(item.nombrelab)
    .openPopup();
    this.map.setView([item.coord.lat, item.coord.lon], 17);
  }

  removerMarker() {
    if (this.layer != null) {
      this.layer.remove();
    }
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

}
