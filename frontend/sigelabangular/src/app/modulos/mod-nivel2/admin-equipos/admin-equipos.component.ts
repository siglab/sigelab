import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ObservablesService } from '../../../shared/services/observables.service';

import swal from 'sweetalert2';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
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


    itemsel = false;
    //equiposel = {nombre:"", servicios:[],practicas:[],componentes:[],info:{dir:"",tel:"",cel:"",email:""}};

    equiposel:any;

  constructor(private obs:ObservablesService) {
    // this.obs.changeObject({nombre:"SELECCIONE UN LABORATORIO",coord:{lat:"3.403437",lon:"-76.511292"},info:{dir:"",tel:"",cel:"4",email:""},
    // servicios:[],practicas:[],equipos:[],personal:[],proyectos:[],solicitudes:[]});
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
  }

  ngAfterViewInit(): void {

    this.obs.currentObject.subscribe(datos => {

      if (datos.length === 0) {
        this.itemsel = true;
      }

      const ambiente = this;
      setTimeout(function() {
   
        ambiente.dataSourceEquip.data = datos;
        ambiente.dataSourceEquip.sort = ambiente.sortEquip;
        ambiente.dataSourceEquip.paginator = ambiente.paginatorEquip;
    // cierra loading luego de cargados los datos
        swal.close();

      }, 1500);

     });
  }


  cambiardataEquipos(item) {
   this.equiposel = this.buscarDato(item);
  }


 buscarDato(item){
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

}
