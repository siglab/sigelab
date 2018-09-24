import { MatSort, MatTableDataSource, MatPaginator } from '@angular/material';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import { ObserverPrincipalService } from '../services/observer-principal.service';
import { QuerysPrincipalService } from '../services/querys-principal.service';
import swal from 'sweetalert2';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { Http } from '@angular/http';

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
    condicionesobjetoServ = {};

    parametros = {};
    parametrosServ = {};

    variation:any;
    variacionSel = "";

    preciototal = 0;
    descuento = 0;
    preciocondescuento = 0;

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

  constructor(private observer: ObserverPrincipalService, private query: QuerysPrincipalService,
              private ruta: Router, private http: Http) {
    if (localStorage.getItem('usuario')) {
      this.user = JSON.parse(localStorage.getItem('usuario'));
      if(this.user.email.split('@')[1] == 'gmail.com'){
        this.usuariounivalle = true;
      }
    }
  }

  ngOnInit() {
    $('html, body').animate({ scrollTop: '0px' }, 'slow');
    // abrer loading mientras se cargan los datos
    swal({
      title: 'Cargando un momento...',
      onOpen: () => {
        swal.showLoading();
      }

    });

    this.query.getServicios().then(data => {

      this.query.estructurarDataServ(data).then(datos => {

        this.dataSource.data = datos['data'];
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        // cierra loading luego de cargados los datos
        swal.close();
      });

    });
  }

  ngAfterViewInit(): void {


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
      this.estructurarVariaciones(this.variation.data.cfConditions, this.variation.data.parametros);
    } else {
      this.variation = undefined;
    }


  }

  //METODO QUE ME ESTRUCTURA EL ARREGLO DE CONDICIONES PARA EL OBJETO RESERVAS DE SERVICIOS
  estructuraCondiciones(condiciones, tipo){
    const arr = [];
    for (let i = 0; i < condiciones.length; i++) {

      let aux;
      if(tipo != 'servicio'){
        aux = this.condicionesobjeto["checkbox"+i]
      }else{
        aux = this.condicionesobjetoServ["checkboxServ"+i]
      }
      const vari = {
        conditionText: condiciones[i],
        aceptada: aux
      }
      arr.push(vari);
    }
    return arr;
  }

   // ESTRUCTURA OBJETO JSON QUE SE ENLAZA A LOS CHECKBOX DE LA VISTA DE MANERA DINAMICA
  estructurarVariaciones(condiciones, parametros){
    this.condicionesobjeto = {};
    this.parametros = {};
    for (let i = 0; i < condiciones.length; i++) {
      this.condicionesobjeto["checkbox"+i] = true;
    }

    for (let i = 0; i < parametros.length; i++) {
      this.parametros["input"+i] = '';
    }
  }

  estructurarCondicionesServicio(condiciones, parametros){
    this.condicionesobjetoServ = {};
    this.parametrosServ = {};
    for (let i = 0; i < condiciones.length; i++) {

      this.condicionesobjetoServ["checkboxServ"+i] = true;
    }

    for (let i = 0; i < parametros.length; i++) {
      //const element = condiciones[i];
      this.parametrosServ["inputServ"+i] = '';
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
      const auxiliar = [];
      if(this.parametros){
        let cont = 0;
      
        for (const key in this.parametros) {
          if (this.parametros.hasOwnProperty(key)) {
            auxiliar.push({id:cont, value:this.parametros[key]});
            cont++;
          }
        }
      }
      this.listaVariaciones.push({
        data: this.variation,
        condiciones: this.estructuraCondiciones(this.variation.data.cfConditions, 'var'),
        parametros: auxiliar
      });
      this.preciototal += parseInt(this.variation.data.cfPrice);
      if(this.usuariounivalle){
        this.descuento = this.preciototal*(parseFloat(this.itemsel.infoServ.descuento)/100);
        this.preciocondescuento = this.preciototal - this.descuento;
      }
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
        datauser:{type:'', ci:''},
        emailuser: this.user.email,
        acceptedBy:'',
        parametrosSrv:[],
        parametros:[],
        descuento:this.descuento,
        precioTotal:this.itemsel.infoServ.precio
      };

      if(this.usuariounivalle){
        cfSrvReserv.cfPrice = ''+this.preciocondescuento;
      }

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
                
                cfSrvReserv.parametros.push({parametros:element.parametros, id:element.data.id});
              }

              cfSrvReserv.precioTotal = ''+this.preciototal;

              if(this.usuariounivalle){
                cfSrvReserv.cfPrice = ''+this.preciocondescuento;
              }else{
                cfSrvReserv.cfPrice = ''+this.preciototal;
              
              }
    
            } 

            if(this.itemsel.infoServ.condiciones.length != 0){
              cfSrvReserv['conditionsLogServ'] = this.estructuraCondiciones(this.itemsel.infoServ.condiciones, 'servicio');
            }

            if(this.parametrosServ){
              let cont = 0;
              for (const key in this.parametrosServ) {
                if (this.parametrosServ.hasOwnProperty(key)) {
                  cfSrvReserv.parametrosSrv.push({id:cont, value:this.parametrosServ[key]});
                  cont++;
                }
              }
            }
            if(this.usuariounivalle){
              cfSrvReserv.typeuser = 'interno'
             // cfSrvReserv.datauser.type = this.univalle[this.selecunivalle];
              cfSrvReserv.datauser.ci = this.valorci;
            }

            cfSrvReserv.comments.push({
              commentText: this.campoCondicion, 
              fecha: fecha.getDate() + '/' + (fecha.getMonth()+1) + '/' + fecha.getFullYear(),
              autor: 'usuario',
              email: this.user.email, 
              uid: this.user.uid});
           

            this.query.addSolicitudServicio(cfSrvReserv).then(() => {

              swal({
                type: 'success',
                title: 'Solicitud Creada Exitosamente',
                showConfirmButton: true
              }).then(()=>{
                this.query.enviarEmails(this.itemsel.nombreserv,this.user.email,this.itemsel.infoLab.emaildir,this.itemsel.infoLab.email, this.itemsel.infoLab.personal);

                this.limpiarDatos();

                this.moduloinfo = false;

                $('html, body').animate({ scrollTop: '0px' }, 'slow');
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
    this.limpiarDatos();
    this.variation = undefined;
 
     /*  navega hacia bajo para mostrar al usuario la posicion de los datos */
   $('html, body').animate({ scrollTop: '400px' }, 'slow');
    this.itemsel = item;

    if(item.infoServ.condiciones.length !== 0){
      this.estructurarCondicionesServicio(item.infoServ.condiciones, item.infoServ.parametros);
    }

    if(this.usuariounivalle){
      if(item.infoServ.variaciones.length == 0){
        this.descuento = this.itemsel.infoServ.precio*(parseFloat(this.itemsel.infoServ.descuento)/100);
        this.preciocondescuento = this.itemsel.infoServ.precio - this.descuento;
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


  cerrarModal(modal){
    $('#'+modal).modal('hide');
  }

  limpiarDatos(){
    this.campoCondicion = '';
    this.listaVariaciones = [];
    this.preciototal = 0;
    this.descuento = 0; 
    this.preciocondescuento = 0;
  }


}
