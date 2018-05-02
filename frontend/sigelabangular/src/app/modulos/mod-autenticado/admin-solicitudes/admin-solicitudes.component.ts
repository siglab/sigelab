import { ObserverAutenticadoService } from './../services/observer-autenticado.service';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { QuerysAutenticadoService } from './../services/querys-autenticado.service';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';

import swal from 'sweetalert2';

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

  constructor(private querys: QuerysAutenticadoService, private observer: ObserverAutenticadoService) {

   }

  ngOnInit() {
    $('#modal1').modal('show');

    if (localStorage.getItem('usuario')) {
      this.user = JSON.parse(localStorage.getItem('usuario'));
      this.querys.getCollectionReserv(this.user.uid).subscribe(data => {
        this.datos = this.querys.estructurarServiciosActivos(data);
        this.observer.changeDatatableServsAct(this.datos);
        console.log(this.datos);
      });

      this.querys.getCollectionsHisto(this.user.uid).subscribe(data => {
        this.histodatos = this.querys.estructurarHistoriaServicios(data);
        this.observer.changeDatatableHistoServs(this.histodatos);
        console.log(this.histodatos);
      });
    }



  }

  ngAfterViewInit() {

    this.observer.currentDatatableServActi.subscribe(data => {
      const ambiente = this;
      this.dataSource.data = data;

      setTimeout(function() {
        ambiente.dataSource.sort = ambiente.sort;
        ambiente.dataSource.paginator = ambiente.paginator;
        $('#modal1').modal('hide');
      }, 1000);

    });

    this.observer.currentDatatableHistoServs.subscribe(data2 => {
      const ambiente = this;
      this.dataSource2.data = data2;

      setTimeout(function() {
        ambiente.dataSource2.sort = ambiente.sort2;
        ambiente.dataSource2.paginator = ambiente.paginator2;
      }, 1000);

    });

  }



  mostrardata(item) {
    this.servsel = item;
    this.buttoncancel = false;
    this.moduloinfo = true;
    console.log(item);

  }

  mostrardata2(item) {
    this.servsel = item;
    this.moduloinfo = true;
    this.buttoncancel = true;
    console.log(item);

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
}
