import { ObservablesService } from './../../../shared/services/observables.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from 'angularfire2/firestore';
@Component({
  selector: 'app-admin-personal',
  templateUrl: './admin-personal.component.html',
  styleUrls: ['./admin-personal.component.css']
})
export class AdminPersonalComponent implements OnInit {

  itemsel: Observable<Array<any>>;
  tablesel = '';
  nombre;
  email;
  estado;

  // INICIALIZACION DATATABLE PERSONAL Activo
  displayedColumnsPers = ['nombre'];
  dataSourcePers = new MatTableDataSource([]);

  @ViewChild('paginatorPers') paginatorPers: MatPaginator;
  @ViewChild('sortPers') sortPers: MatSort;

    // INICIALIZACION DATATABLE PERSONAL InActivo
    displayedColumnsPersIn = ['nombre'];
    dataSourcePersIn = new MatTableDataSource([]);

    @ViewChild('paginatorPersIn') paginatorPersIn: MatPaginator;
    @ViewChild('sortPersIn') sortPersIn: MatSort;








  constructor(private obs: ObservablesService, private afs: AngularFirestore   ) { }

  ngOnInit() {

    const activos = [];
    const inactivos = [];

    this.obs.currentObject.subscribe( data => {
      if (data.personal) {
       console.log(data);
       this.itemsel = Observable.of(data);

        data.personal.forEach(element => {

          if ( element.activo === true ) {
              activos.push( element );
            console.log( 'is true', element);
          } else {
            inactivos.push( element );
          }

        });

        if ((activos.length > 0) || (inactivos.length > 0)) {
          console.log('entro');
          this.dataSourcePers.data = activos;
          this.dataSourcePersIn.data = inactivos;
        }

      }


      console.log( 'datos personal', data );
      swal({
        title: 'Cargando un momento...',
        text: 'espere mientras se cargan los datos',
        onOpen: () => {
          swal.showLoading();
        }
      });

      const ambiente = this;
      setTimeout(function() {

        ambiente.dataSourcePers.sort = ambiente.sortPers;
        ambiente.dataSourcePers.paginator = ambiente.paginatorPers;
        ambiente.dataSourcePersIn.sort = ambiente.sortPersIn;
        ambiente.dataSourcePersIn.paginator = ambiente.paginatorPersIn;


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
    console.log(item);

    this.nombre = item.nombre;
    console.log( this.nombre);
    this.estado = item.activo;
    this.email = item.email;
   // this.seleccionado = item;
  }

  actualizarPers(idU, idP, nombre?, email?, estado?) {

    /* objeto para persona  */
   const pers = {
   nombre,
   estado
   };
    /* objeto para usuario */
   const user = {
    email,
    estado
    };

   /* metodo firebase para subir una persona */
    this.afs.collection('cfPers/').doc( idP ).update (pers);
   /* metodo firebase para subir un usuario */
   this.afs.collection('user/').doc( idU ).update (pers);
  }


}
