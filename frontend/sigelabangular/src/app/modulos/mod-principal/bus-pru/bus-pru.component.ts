import { MatSort, MatTableDataSource, MatPaginator } from '@angular/material';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import { ObserverPrincipalService } from '../services/observer-principal.service';
import { QuerysPrincipalService } from '../services/querys-principal.service';
@Component({
  selector: 'app-bus-pru',
  templateUrl: './bus-pru.component.html',
  styleUrls: ['./bus-pru.component.css']
})
export class BusPruComponent implements OnInit, AfterViewInit {

  corx = 3.42158;
  cory = -76.5205;
  map: any;

  servicios = [{nombre:"PRUEBA DE QUIMICOS",coord:{lat:"3.425906",lon:"-76.540446"},info:{dir:"cra54 cambulos",tel:"53454636",cel:"43656537",email:"jkhkhjk@univalle.edu.co"}
              },
              {nombre:"PRUEBA DE ALTURAS",coord:{lat:"3.419737",lon:"-76.540275"},info:{dir:"cra54 san fernado",tel:"53454543gdf636",cel:"43656537",email:"fdgfgjh@univalle.edu.co"}
              },
              {nombre:"PRUEBAS FISICAS",coord:{lat:"3.420380",lon:"-76.510105"},info:{dir:"cra54 sfdfsdfs",tel:"35345435",cel:"436574676537",email:"fgjh@univalle.edu.co"}
              },
              {nombre:"PRUEBAS SALUD OCUPACIONAL",coord:{lat:"3.403437",lon:"-76.511292"},info:{dir:"cra54 dfsdfsdf",tel:"46363565",cel:"4357547656537",email:"hkjkhjjh@univalle.edu.co"}}];

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
