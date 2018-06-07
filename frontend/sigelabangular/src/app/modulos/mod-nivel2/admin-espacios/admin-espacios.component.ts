import { ObservablesService } from './../../../shared/services/observables.service';
import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import swal from 'sweetalert2';
import { Subject } from 'rxjs/Subject';
import { DataTableDirective } from 'angular-datatables';
import { AngularFirestore } from 'angularfire2/firestore';

@Component({
  selector: 'app-admin-espacios',
  templateUrl: './admin-espacios.component.html',
  styleUrls: ['./admin-espacios.component.css']
})
export class AdminEspaciosComponent implements OnInit {

  itemsel: Observable<Array<any>>;
  sede;
  tablesel = '';
  space = {
    capacity: '',
    createdAt: '',
    freeArea: '',
    headquarter: '',
    indxSa: '',
    map: '',
    minArea: '',
    ocupedArea: '',
    totalArea: '',
    spaceData: { building: '' , place: '', floor: ''  },
    active: false
  };




   // INICIALIZACION DATATABLE PERSONAL Activo
   displayedColumnsSpace = ['capacidad', 'arealibre', 'totalarea', 'edificio', 'espacio' ];
   dataSourceSpace = new MatTableDataSource([]);

   @ViewChild('paginatorSpace') paginatorSpace: MatPaginator;
   @ViewChild('sortSpace') sortSpace: MatSort;

  constructor(private obs: ObservablesService,  private afs: AngularFirestore,   ) {

  }


  // tslint:disable-next-line:max-line-length

  ngOnInit() {

    this.obs.currentObject.subscribe(data => {


      if (data.espacios) {
        this.afs.collection<any>('cfPAddr',
        ref => ref.where('cfAddrline1', '==', 'san fernando'))
       .snapshotChanges().subscribe(sedes => {
         const idnuevo = sedes[0].payload.doc.id;

         console.log(idnuevo);
       });

        this.itemsel = Observable.of(data);

        this.dataSourceSpace.data = data.espacios;
        console.log(data.espacios);
        console.log('si hay un espacio', data.espacios );
        console.log('datos del observer', data);
        swal({
          title: 'Cargando un momento...',
          text: 'espere mientras se cargan los datos',
          onOpen: () => {
            swal.showLoading();
          }
        });

        setTimeout(() => {
          this.dataSourceSpace.paginator = this.paginatorSpace;
          this.dataSourceSpace.sort = this.sortSpace;
          swal.close();
        }, 1000);

      }
    });



  }

/* asigna la fila de la tabla a variables ngmodel */
cambiardata( item) {
   console.log (item);
  this.space.totalArea = item.totalArea;
   this.space.capacity = item.capacity;
   this.space.freeArea = item.freeArea;
   this.space.indxSa = item.indxSa;
   this.space.minArea = item.minArea;
   this.space.ocupedArea = item.ocupedArea;
   this.space.spaceData.building = item.spaceData.building;
   this.space.spaceData.floor = item.spaceData.floor;
   this.space.spaceData.place = item.spaceData.place;
}

actualizarEspacio() {
  const nuevoespacio = this.space;
   let head;
   this.buscarSede().then( ok => {
     head = ok ;
     nuevoespacio.headquarter = head;
    console.log(nuevoespacio);
  } );


}

buscarSede() {

  return new Promise((resolve, reject) => {
    this.afs.collection<any>('cfPAddr',
    ref => ref.where('cfAddrline1', '==', this.sede))
   .snapshotChanges().subscribe(data => {
     const idnuevo = data[0].payload.doc.id;

     console.log(idnuevo);
     resolve(idnuevo);
   });
  });

}



applyFilterPers(filterValue: string) {
  filterValue = filterValue.trim(); // Remove whitespace
  filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
  this.dataSourceSpace.filter = filterValue;
}

}
