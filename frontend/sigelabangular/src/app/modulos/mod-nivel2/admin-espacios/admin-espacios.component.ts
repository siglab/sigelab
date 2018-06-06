import { ObservablesService } from './../../../shared/services/observables.service';
import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import swal from 'sweetalert2';
import { Subject } from 'rxjs/Subject';
import { DataTableDirective } from 'angular-datatables';

@Component({
  selector: 'app-admin-espacios',
  templateUrl: './admin-espacios.component.html',
  styleUrls: ['./admin-espacios.component.css']
})
export class AdminEspaciosComponent implements OnInit {

  itemsel: Observable<Array<any>>;
  tablesel = '';

   // INICIALIZACION DATATABLE PERSONAL Activo
   displayedColumnsSpace = ['nombre'];
   dataSourceSpace = new MatTableDataSource([]);

   @ViewChild('paginatorSpace') paginatorSpace: MatPaginator;
   @ViewChild('sortSpace') sortSpace: MatSort;

  constructor(private obs: ObservablesService) {

  }


  // tslint:disable-next-line:max-line-length

  ngOnInit() {

    this.obs.currentObject.subscribe(data => {

      console.log(data);
      if (data) {

        this.itemsel = Observable.of(data);

        this.dataSourceSpace.data = data.espacios;

        console.log('si hay un espacio', data.espacios );

        setTimeout(() => {
          this.dataSourceSpace.paginator = this.paginatorSpace;
          this.dataSourceSpace.sort = this.sortSpace;
        }, 1000);


      }
    });

  }


  cambiardataEspacios(item) {

  }




mostrardata(item) {
  console.log(item);
}

cambiardata() {

}

applyFilterPers(filterValue: string) {
  filterValue = filterValue.trim(); // Remove whitespace
  filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
  this.dataSourceSpace.filter = filterValue;
}

}
