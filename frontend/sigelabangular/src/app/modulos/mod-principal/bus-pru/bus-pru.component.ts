import { MatSort, MatTableDataSource, MatPaginator } from '@angular/material';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import { ObserverPrincipalService } from '../services/observer-principal.service';
import { QuerysPrincipalService } from '../services/querys-principal.service';

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
    $('#modal1').modal('show');

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
        $('#modal1').modal('hide');
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
    this.itemsel = item;
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


  agregarMarker(item) {
    this.layer = L.marker([item.coord.lat, item.coord.lon],{icon:this.DefaultIcon});
    this.layer.addTo(this.map)
    .bindPopup(item.nombreprub)
    .openPopup();



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
