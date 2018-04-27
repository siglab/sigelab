
import { element } from 'protractor';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import { AngularFirestoreCollection, AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ObserverPrincipalService } from '../services/observer-principal.service';
import { QuerysPrincipalService } from '../services/querys-principal.service';


@Component({
  selector: 'app-bus-lab',
  templateUrl: './bus-lab.component.html',
  styleUrls: ['./bus-lab.component.css']
})


export class BusLabComponent implements OnInit, AfterViewInit {

  corx = 3.42158;
  cory = -76.5205;
  map: any;

  convenios = [{nombre: 'LABORATORIO CIENCIAS', escuela: 'ESCUELA 1, ESCUELA 2, ESCUELA 3, ESCUELA 4, ESCUELA 5, ESCUELA 6, ESCUELA 7', inves: 'INVESTIGACION 1', director: 'JEFFERSON',coord: {lat: '3.425906', lon: '-76.540446'}, info: {dir: 'cra54 cambulos', tel: '53454636', cel: '43656537', email: 'jkhkhjk@univalle.edu.co'},
               servicios: [{nombre: 'QUIMICA'}, {nombre: 'TERMODINAMICA'}, {nombre: 'FISICA'}], practicas: [{nombre: 'EXSS'}, {nombre: 'FGFGFG'}]},
               {nombre: 'LABORATORIO SOCIAES', escuela: 'ESCUELA 2', inves: 'INVESTIGACION 2',  director: 'JHON JAIRO', coord: {lat: '3.419737', lon: '-76.540275'}, info: {dir: 'cra54 san fernado', tel: '53454543gdf636', cel: '43656537', email: 'fdgfgjh@univalle.edu.co'},
               servicios: [{nombre: 'CUANTICA'}, {nombre: 'MATE'}, {nombre: 'BIOLOGIA'}], practicas: [{nombre: 'DFGDFGDF'}]},
               {nombre: 'LABORATORIO X', escuela: 'ESCUELA 3', inves: 'INVESTIGACION 3', director: 'SEBAXTIAN', coord: {lat: '3.420380', lon: '-76.510105'}, info: {dir: 'cra54 sfdfsdfs', tel: '35345435', cel: '436574676537', email: 'fgjh@univalle.edu.co'},
               servicios: [{nombre: 'BUSQUEDA'}, {nombre: 'INVESTIGACION'}], practicas: [{nombre: 'HJGHJHJ'}]},
               {nombre: 'LABORATORIO Y', escuela: 'ESCUELA 4', inves: 'INVESTIGACION 4',  director: 'FRANCISCO', coord: {lat: '3.403437', lon: '-76.511292'}, info: {dir: 'cra54 dfsdfsdf', tel: '46363565', cel: '4357547656537', email: 'hkjkhjjh@univalle.edu.co'},
               servicios: [], practicas: []}];

  itemsel: any;
  servsel: any;
  prubsel: any;

  moduloinfo = false;
  layer = null;

  datosEstructurados = [];

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


  constructor(private observer: ObserverPrincipalService, private query: QuerysPrincipalService) {

    this.query.getPruebas();
  }


  ngOnInit() {
    this.query.getLaboratorios().subscribe(data => {

      this.observer.changeDatatableLabs(this.query.estructurarDataLab(data));

    });

  }

  ngAfterViewInit(): void {

    this.observer.currentDatatableLab.subscribe(datos => {

      console.log(datos);
      const ambiente = this;
      setTimeout(function() {
        ambiente.dataSource.data = datos;
        ambiente.dataSource.sort = ambiente.sort;
        ambiente.dataSource.paginator = ambiente.paginator;
      }, 1000);
     });


  }



  loadMap(item) {
    this.map = L.map('mapaa').setView([this.corx, this.cory], 13);
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    this.agregarMarker(item);
  }


  cambiardata(item) {

    this.itemsel  = item;

    this.dataSource2.data = item.servicios;
    this.dataSource3.data = item.practicas;

    console.log(item.practicas);
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

  cambiarDataServicio(item) {
    this.servsel = item;
    console.log(item);
  }

  cambiarDataPrueba(item) {
    this.prubsel = item;
    console.log(item);
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
