import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ObservablesService } from '../../../shared/services/observables.service';

import swal from 'sweetalert2';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { AngularFirestore } from 'angularfire2/firestore';
@Component({
  selector: 'app-admin-equipos',
  templateUrl: './admin-equipos.component.html',
  styleUrls: ['./admin-equipos.component.css']
})
export class AdminEquiposComponent implements OnInit, AfterViewInit {



    // INICIALIZACION DATATABLE PRUEBAS
    displayedColumnsEquip = ['nombre'];
    dataSourceEquip = new MatTableDataSource([]);
    @ViewChild('paginatorEquip') paginatorEquip: MatPaginator;
    @ViewChild('sortEquip') sortEquip: MatSort;

    // INICIALIZACION DATATABLE COMPONENTES
    displayedColumnsComponentes = ['nombre'];
    dataSourceComponentes = new MatTableDataSource([]);
    @ViewChild('paginatorComponentes') paginatorComponentes: MatPaginator;
    @ViewChild('sortComponentes') sortComponentes: MatSort;

    // INICIALIZACION DATATABLE SERVICIOS
    displayedColumnsServicios = ['nombre'];
    dataSourceServicios = new MatTableDataSource([]);
    @ViewChild('paginatorServicios') paginatorServicios: MatPaginator;
    @ViewChild('sortServicios') sortServicios: MatSort;

    // INICIALIZACION DATATABLE PRACTICAS
    displayedColumnsPracticas = ['nombre'];
    dataSourcePracticas = new MatTableDataSource([]);
    @ViewChild('paginatorPracticas') paginatorPracticas: MatPaginator;
    @ViewChild('sortPracticas') sortPracticas: MatSort;



    equiposel: any;
    tablesel: any;
    seleccionado: any;
    itemsel: Observable<Array<any>>;

  constructor(private obs: ObservablesService, private afs: AngularFirestore) {

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


    this.obs.currentObject.subscribe(datos => {

      this.iniciliazarTablas();

      if (datos.equipos) {
        this.itemsel = Observable.of(datos);

        console.log(datos.equipos);
        this.dataSourceEquip.data = datos.equipos;

        const ambiente = this;
        setTimeout(function() {
          if (datos.equipos.data !== 0) {
            ambiente.dataSourceEquip.sort = ambiente.sortEquip;
            ambiente.dataSourceEquip.paginator = ambiente.paginatorEquip;

          }

        // cierra loading luego de cargados los datos
        swal.close();

        }, 1500);
      }



     });
  }

  ngAfterViewInit(): void {

  }


  cambiardataEquipos(item) {
   this.equiposel = this.buscarDato(item);

  }

  cambiarDataEquipo(item) {
    console.log(item);
    const ambiente = this;
    this.equiposel = item;
    this.dataSourceComponentes.data = item.componentes;
    this.dataSourceServicios.data = item.servicios;
    this.dataSourcePracticas.data = item.practicas;
    console.log(this.dataSourceComponentes.data);
    setTimeout(function() {
      ambiente.dataSourceComponentes.sort = ambiente.sortComponentes;
      ambiente.dataSourceComponentes.paginator = ambiente.paginatorComponentes;

      ambiente.dataSourceServicios.sort = ambiente.sortServicios;
      ambiente.dataSourceServicios.paginator = ambiente.paginatorServicios;

      ambiente.dataSourcePracticas.sort = ambiente.sortPracticas;
      ambiente.dataSourcePracticas.paginator = ambiente.paginatorPracticas;
    }, 1000);


  }

  iniciliazarTablas() {
    this.equiposel = undefined;
    this.dataSourceComponentes.data = [];
    this.dataSourcePracticas.data = [];
    this.dataSourceServicios.data = [];
  }

  cambiarInfoModal(row, table) {
    this.tablesel = table;
    this.seleccionado = row;
  }


 buscarDato(item) {
  //  for(let i=0;i<this.equipos.length;i++){
  //    if(item.nombre == this.equipos[i].nombre){
  //      return this.equipos[i];
  //    }
  //  }
 }

   applyFilterEquip(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSourceEquip.filter = filterValue;
  }

  applyFilterComponentes(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSourceComponentes.filter = filterValue;
  }

  applyFilterPracticas(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSourcePracticas.filter = filterValue;
  }

  applyFilterServicios(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSourceServicios.filter = filterValue;
  }

  subir() {
    const equipos = {

      cfAcro: '',
      cfUri: '',
      cfName: '',
      cfDescr: '',
      cfKey: '',
      cfClass: '',
      cfClassScheme: '',
      cfFacil: '',
      cfPers: '',
      relatedSrv:  {} ,
      realatedPract: {},
      relatedMeas: {},
      qr: '',
      space: '',
      brand: '',
      model: '',
      price : 0,
      timeUnit: 'minutes',
      workingHours: '',
      timeBeforeBooking: '',
      cfConditions: [],
      active: true,
      createdAt: '',
      updatedAt: ''

    };




        // METODO QUE AGREGA UNA NUEVA SOLICITUD DE SERVICIO

        this.afs.collection('cfEquipment').add(equipos).then(data => {
          console.log(data);
          this.subirComp();
        });


  }

  subirComp() {

    const fecha = new Date();
    const components = {

      cfName: 'bola de iones',
      cfClass : '',
      cfClassScheme: '',
      cfConditions: [],
      cfDescription: 'elemento que se usa para contener la implosion',
      cfPrice: 12300000,
      brand: 'SAMSUNG',
      model: '2018',
      active: true,
      createdAt: fecha.toISOString(),
      updatedAt: fecha.toISOString()


    };
    this.afs.collection('cfEquip/YrqiRtkF6RGBg7Gvz5iG/components').add(components).then(dta => {
      console.log('se hizo menar');
    });
  }

  subirVar() {
    const fecha = new Date();
    const va = {
      cfName: 'servicio banda ancha',
      cfConditions: ['debe traer cedula', 'debe traer recibo'],
      cfDescription: 'para utilizar la sala de computo',
      cfPrice: '1200',
      active: true,
      createdAt: fecha.toISOString(),
      updateAt: fecha.toISOString()
    };

    this.afs.collection('cfSrv/IkDMCt1fpuP8xg2iIXwA/variations').add(va).then(dta => {
      console.log('se hizo menar');
    });
  }

}


