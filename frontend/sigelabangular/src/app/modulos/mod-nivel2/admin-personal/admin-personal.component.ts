import { ObservablesService } from './../../../shared/services/observables.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import swal from 'sweetalert2';
@Component({
  selector: 'app-admin-personal',
  templateUrl: './admin-personal.component.html',
  styleUrls: ['./admin-personal.component.css']
})
export class AdminPersonalComponent implements OnInit {

  itemsel: Observable<Array<any>>;
  tablesel = '';

  // INICIALIZACION DATATABLE PERSONAL
  displayedColumnsPers = ['nombre'];
  dataSourcePers = new MatTableDataSource([]);

  @ViewChild('paginatorPers') paginatorPers: MatPaginator;
  @ViewChild('sortPers') sortPers: MatSort;


  constructor(private obs: ObservablesService) { }

  ngOnInit() {
    this.obs.currentObject.subscribe(data => {
      console.log(data);
      this.itemsel = Observable.of(data);
      swal({
        title: 'Cargando un momento...',
        text: 'espere mientras se cargan los datos',
        onOpen: () => {
          swal.showLoading();
        }
      });

      this.dataSourcePers.data = data.personal;

      const ambiente = this;
      setTimeout(function() {
        ambiente.dataSourcePers.sort = ambiente.sortPers;
        ambiente.dataSourcePers.paginator = ambiente.paginatorPers;

        swal.close();

      }, 1000);
    });
  }
  applyFilterPers(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSourcePers.filter = filterValue;
  }

  cambiardata(item, table) {
    this.tablesel = table;
   // this.seleccionado = item;
  }
}
