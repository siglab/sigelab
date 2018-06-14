import { Component, OnInit, ViewChild } from '@angular/core';
import { ObservablesService } from '../../../shared/services/observables.service';
import { Observable } from 'rxjs/Observable';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import swal from 'sweetalert2';

@Component({
  selector: 'app-admin-practicas',
  templateUrl: './admin-practicas.component.html',
  styleUrls: ['./admin-practicas.component.css']
})
export class AdminPracticasComponent implements OnInit {

  itemsel: Observable<Array<any>>;
  interfaz: boolean;
  practica = {nombre: ''};
  info: any;
  displayedColumnsPrac = ['nombre', 'programacion.semestre', 'programacion.estudiantes', 'activo'];
  dataSourcePrac = new MatTableDataSource([]);

  displayedColumnsPracIn = ['nombre', 'estado', 'semestre', 'estudiantes', 'horario'];
  dataSourcePracIn = new MatTableDataSource([]);

  // practicas activas
  @ViewChild('paginatorPrac') paginatorPrac: MatPaginator;
  @ViewChild('sortPrac') sortPrac: MatSort;

   // practicas inactivas
   @ViewChild('paginatorPracIn') paginatorPracIn: MatPaginator;
   @ViewChild('sortPracIn') sortPracIn: MatSort;

  constructor(private obs: ObservablesService) {

   }

  ngOnInit() {
    this.obs.currentObject.subscribe(data => {
      if (data.practicas) {
        this.itemsel = Observable.of(data);

        console.log('data ob', data);

        this.dataSourcePrac = new MatTableDataSource(data.practicas);

        this.dataSourcePracIn = new MatTableDataSource(data.practicasInactivas);
        // data acesor activos
       this.dataSourcePrac.sortingDataAccessor = (item, property) => {
         switch (property) {
           case 'programacion.semestre': return item.programacion.semestre;
           case 'programacion.estudiantes': return item.programacion.estudiantes;
           default: return item[property];
         }
       };

           // data acesor inactivos
           this.dataSourcePracIn.sortingDataAccessor = (item, property) => {
            switch (property) {
              case 'programacion.semestre': return item.programacion.semestre;
              case 'programacion.estudiantes': return item.programacion.estudiantes;
              default: return item[property];
            }
          };



       // data filter
       this.dataSourcePrac.filterPredicate = (dat, filter: string)  => {
        const accumulator = (currentTerm, key) => {
          return key === 'orderInfo' ? currentTerm + dat.orderInfo.type : currentTerm + dat[key];
        };
        const dataStr = Object.keys(dat).reduce(accumulator, '').toLowerCase();
        // Transform the filter by converting it to lowercase and removing whitespace.
        const transformedFilter = filter.trim().toLowerCase();
        return dataStr.indexOf(transformedFilter) !== -1;
      };

        swal({
          title: 'Cargando un momento...',
          text: 'espere mientras se cargan los datos',
          onOpen: () => {
            swal.showLoading();
          }
        });

        setTimeout(() => {
          if (data.practicas.length > 0 ) {

          this.dataSourcePrac.sort = this.sortPrac;
          this.dataSourcePrac.paginator = this.paginatorPrac;

          this.dataSourcePracIn.sort = this.sortPracIn;
          this.dataSourcePracIn.paginator = this.paginatorPracIn;

          }
          swal.close();
        }, 1000);





      }
    });
  }


  equipoSeleccionado(item, bool) {
    this.interfaz = bool;
    this.practica = item;
    console.log(item);

  }
  applyFilter(filterValue: string) {

    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSourcePrac.filter = filterValue;
  }
  cambiardata(row) {

  }

 addPractice() {


 }

}
