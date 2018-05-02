import { MatSort, MatTableDataSource, MatPaginator } from '@angular/material';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import { ObserverPrincipalService } from '../services/observer-principal.service';
import { QuerysPrincipalService } from '../services/querys-principal.service';
import swal from 'sweetalert2';
import { Router } from '@angular/router';

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



    // INICIALIZACION DATATABLE lABORATORIOS
    displayedColumns = ['nombreserv', 'nombrelab'];
    dataSource = new MatTableDataSource([]);
    @ViewChild('paginator') paginator: MatPaginator;
    @ViewChild('sort') sort: MatSort;


  constructor(private observer: ObserverPrincipalService, private query: QuerysPrincipalService, private ruta: Router) {
    if (localStorage.getItem('usuario')) {
      this.user = JSON.parse(localStorage.getItem('usuario'));
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

  agregarSolicitudServicio() {
    console.log(this.itemsel);
    console.log(this.user);
    if (this.user) {
      const cfSrvReserv = {
        cfSrv: this.itemsel.infoServ.uid,
        user: this.user.uid,
        selectedVariations: [],
        cfStartDate: '',
        cfEndDate: '',
        cfClass: '',
        cfClassScheme: '',
        status: 'creada',
        createdAt: '',
        updatedAt:  '',
        conditionsLog: [{ conditionText: '', accepted: ''} ]
      };

      swal({
        type: 'warning',
        title: 'Esta seguro que desea solicitar este servicio',
        showCancelButton: true,
        confirmButtonText: 'Si, Solciitar',
        cancelButtonText: 'No, Cancelar'
      }).then((result) => {
        if (result.value) {
          this.query.addSolicitudServicio(cfSrvReserv).then(() => {
            swal({
              type: 'success',
              title: 'Solicitud Creada Exitosamente',
              showConfirmButton: true
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
        }).then(() => {
          this.ruta.navigate(['login']);
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
    this.layer = L.marker([item.coord.lat, item.coord.lon], {icon: this.DefaultIcon});
    this.layer.addTo(this.map)
    .bindPopup(item.nombrelab)
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
