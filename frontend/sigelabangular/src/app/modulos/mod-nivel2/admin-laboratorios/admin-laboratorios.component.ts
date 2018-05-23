import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { AngularFirestore } from 'angularfire2/firestore';
import { ObservablesService } from './../../../shared/services/observables.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { Component, OnInit, ViewChild } from '@angular/core';
import swal from 'sweetalert2';

@Component({
  selector: 'app-admin-laboratorios',
  templateUrl: './admin-laboratorios.component.html',
  styleUrls: ['./admin-laboratorios.component.css']
})
export class AdminLaboratoriosComponent implements OnInit {


  itemsel: Observable<Array<any>>;

  tablesel = '';

  seleccionado: any;

    // INICIALIZACION DATATABLE EQUIPOS
    displayedColumnsEquipos = ['nombre'];
    dataSourceEquipos = new MatTableDataSource([]);
    @ViewChild('paginatorEquipos') paginatorEquipos: MatPaginator;
    @ViewChild('sortEquipos') sortEquipos: MatSort;

    // INICIALIZACION DATATABLE PERSONAL
    displayedColumnsPersonal = ['nombre'];
    dataSourcePersonal = new MatTableDataSource([]);
    @ViewChild('paginatorPersonal') paginatorPersonal: MatPaginator;
    @ViewChild('sortPersonal') sortPersonal: MatSort;

    // INICIALIZACION DATATABLE SERVICIOS
    displayedColumnsServicios = ['nombre'];
    dataSourceServicios = new MatTableDataSource([]);
    @ViewChild('paginatorServicios') paginatorServicios: MatPaginator;
    @ViewChild('sortServicios') sortServicios: MatSort;

    // INICIALIZACION DATATABLE PROYECTOS
    displayedColumnsProyectos = ['nombre'];
    dataSourceProyectos = new MatTableDataSource([]);
    @ViewChild('paginatorProyectos') paginatorProyectos: MatPaginator;
    @ViewChild('sortProyectos') sortProyectos: MatSort;

    // INICIALIZACION DATATABLE EQUIPOS
    displayedColumnsPracticas = ['nombre'];
    dataSourcePracticas = new MatTableDataSource([]);
    @ViewChild('paginatorPracticas') paginatorPracticas: MatPaginator;
    @ViewChild('sortPracticas') sortPracticas: MatSort;

    // INICIALIZACION DATATABLE SOLICITUDES
    displayedColumnsSolicitudes = ['nombre'];
    dataSourceSolicitudes = new MatTableDataSource([]);
    @ViewChild('paginatorSolicitudes') paginatorSolicitudes: MatPaginator;
    @ViewChild('sortSolicitudes') sortSolicitudes: MatSort;


  constructor(private obs: ObservablesService, private afs: AngularFirestore) {
  }

  ngOnInit() {
    this.obs.currentObject.subscribe(data => {
      console.log(data);
      const ambiente = this;
      this.itemsel = Observable.of(data);

      swal({
        title: 'Cargando un momento...',
        text: 'espere mientras se cargan los datos',
        onOpen: () => {
          swal.showLoading();
        }
      });

      setTimeout(function() {

        ambiente.dataSourceEquipos.data = data.equipos;

        ambiente.dataSourcePersonal.data = data.personal;

        ambiente.dataSourceServicios.data = data.servicios;

        ambiente.dataSourceProyectos.data = data.proyectos;

        ambiente.dataSourcePracticas.data = data.practicas;

        ambiente.dataSourceSolicitudes.data = data.solicitudes;
      }, 1000);

      setTimeout(function() {

        ambiente.dataSourceEquipos.sort = ambiente.sortEquipos;
        ambiente.dataSourceEquipos.paginator = ambiente.paginatorEquipos;

        ambiente.dataSourcePersonal.sort = ambiente.sortPersonal;
        ambiente.dataSourcePersonal.paginator = ambiente.paginatorPersonal;

        ambiente.dataSourceServicios.sort = ambiente.sortServicios;
        ambiente.dataSourceServicios.paginator = ambiente.paginatorServicios;

        ambiente.dataSourceProyectos.sort = ambiente.sortProyectos;
        ambiente.dataSourceProyectos.paginator = ambiente.paginatorProyectos;

        ambiente.dataSourcePracticas.sort = ambiente.sortPracticas;
        ambiente.dataSourcePracticas.paginator = ambiente.paginatorPracticas;

        ambiente.dataSourceSolicitudes.sort = ambiente.sortSolicitudes;
        ambiente.dataSourceSolicitudes.paginator = ambiente.paginatorSolicitudes;

        swal.close();
      }, 1500);

    });
  }

  cambiardata(item, table) {
    this.tablesel = table;
    this.seleccionado = item;
  }

  addEquipo() {
    const eq = {
     cfOrgUnit: '',
     ciNumber: '87696898',
     projectDesc: 'proyecto que busca la geomatizacion de zonas urbanas de cali',
     projectName: 'PROYECTO CARTOGRAPHER',
     relatedFacilities: {cfFacilId: true},
     relaedPers: {cfPersId: true}
    };

    this.afs.collection('project').add(eq);
  }

  applyFilterEquipos(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSourceEquipos.filter = filterValue;
  }
  applyFilterPersonal(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSourcePersonal.filter = filterValue;
  }
  applyFilterServicios(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSourceServicios.filter = filterValue;
  }
  applyFilterProyectos(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSourceProyectos.filter = filterValue;
  }
  applyFilterPracticas(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSourcePracticas.filter = filterValue;
  }

  applyFilterSolicitudes(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSourceSolicitudes.filter = filterValue;
  }
}
