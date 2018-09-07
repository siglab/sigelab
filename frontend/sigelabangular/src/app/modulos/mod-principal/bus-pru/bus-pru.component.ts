import { MatSort, MatTableDataSource, MatPaginator } from '@angular/material';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import { ObserverPrincipalService } from '../services/observer-principal.service';
import { QuerysPrincipalService } from '../services/querys-principal.service';
import swal from 'sweetalert2';
import 'fullcalendar';
import 'fullcalendar-scheduler';
import * as $AB from 'jquery';
declare var $: any;


@Component({
  selector: 'app-bus-pru',
  templateUrl: './bus-pru.component.html',
  styleUrls: ['./bus-pru.component.css']
})
export class BusPruComponent implements OnInit, AfterViewInit {

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



    // INICIALIZACION DATATABLE lABORATORIOS
    displayedColumns = ['nombre'];
    dataSource = new MatTableDataSource([]);
    @ViewChild('paginator') paginator: MatPaginator;
    @ViewChild('sort') sort: MatSort;


  constructor(private observer: ObserverPrincipalService, private query: QuerysPrincipalService) { }

  ngOnInit() {
         // abre loading mientras se cargan los datos
     swal({
      title: 'Cargando un momento...',
      onOpen: () => {
        swal.showLoading();
      }

    }) ;
    this.query.getPruebas().subscribe(data => {

      this.observer.changeDatatablePrueba(this.query.estructurarDataPruebas(data));

    });
  }

  ngAfterViewInit(): void {

    this.observer.currentDatatablePruebas.subscribe(datos => {

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


  loadMap(item) {
    this.map = L.map('mapaaser').setView([this.corx, this.cory], 13);
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    this.agregarMarker(item);
  }

  cambiardata(item) {

    /*  navega hacia bajo para mostrar al usuario la posicion de los datos */
    $AB('html, body').animate({ scrollTop: '400px' }, 'slow');

    this.itemsel = item;

    this.initCalendarModal( item.infoPrub.programacion.horario);
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

  initCalendarModal(horario) {

    const containerEl: JQuery = $AB('#cal2');
    
    if(containerEl.children().length > 0){
 
      containerEl.fullCalendar('destroy');
    }


    containerEl.fullCalendar({
      // licencia
      schedulerLicenseKey: 'GPL-My-Project-Is-Open-Source',
      // options here
      height: 450,
      header: {
        left: 'month,agendaWeek,agendaDay',
        center: 'title',
        right: 'today prev,next'
      },
      events: horario,

      defaultView: 'month',
      timeFormat: 'H(:mm)'

    });
  }


  agregarMarker(item) {
    this.layer = L.marker([item.coord.lat, item.coord.lon], {icon: this.DefaultIcon});
    this.layer.addTo(this.map)
    .bindPopup(item.nombreprub)
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

}
