import { async } from '@angular/core/testing';
import { ObservablesService } from './../../../shared/services/observables.service';
import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import swal from 'sweetalert2';

import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireStorage } from 'angularfire2/storage';
import * as $ from 'jquery';
import 'fullcalendar';

@Component({
  selector: 'app-admin-espacios',
  templateUrl: './admin-espacios.component.html',
  styleUrls: ['./admin-espacios.component.css']
})
export class AdminEspaciosComponent implements OnInit {
  plano: Observable<any>;
  mensaje = false;
  itemsel: Observable<Array<any>>;
  sede = 'san fernando';
  idsp;
  tablesel = '';
  space = {
    capacity: '',
    createdAt: '',
    freeArea: '',
    headquarter: 'Vp0lIaYQJ8RGSEBwckdi',
    subHq: '',
    indxSa: '',
    map: '',
    minArea: '',
    ocupedArea: '',
    totalArea: '',
    spaceData: { building: '', place: '', floor: '' },
    active: false
  };



  //  https://www.npmjs.com/package/angular-calendar
  // https://blog.ng-classroom.com/blog/ionic2/fullcalendar/
  // INICIALIZACION DATATABLE PERSONAL Activo
  displayedColumnsSpace = ['capacidad', 'arealibre', 'totalarea', 'edificio', 'espacio'];
  dataSourceSpace = new MatTableDataSource([]);

  @ViewChild('paginatorSpace') paginatorSpace: MatPaginator;
  @ViewChild('sortSpace') sortSpace: MatSort;

  constructor(private obs: ObservablesService, private afs: AngularFirestore, private storage: AngularFireStorage) {

  }


  // tslint:disable-next-line:max-line-length

  ngOnInit() {

    this.obs.currentObject.subscribe(data => {


      if (data.espacios) {
        this.itemsel = Observable.of(data);

        this.dataSourceSpace.data = data.espacios;
        console.log(data.espacios);
        console.log('si hay un espacio', data.espacios);
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
          // llamar metodo para iniciar calendario
      }
    });



  }

  /* asigna la fila de la tabla a variables ngmodel */
  cambiardata(item) {
    console.log(item);
    this.idsp = item.id_space;
    this.space.totalArea = item.totalArea;
    this.space.capacity = item.capacity;
    this.space.freeArea = item.freeArea;
    this.space.indxSa = item.indxSa;
    this.space.minArea = item.minArea;
    this.space.ocupedArea = item.ocupedArea;
    this.space.spaceData.building = item.spaceData.building;
    this.space.spaceData.floor = item.spaceData.floor;
    this.space.spaceData.place = item.spaceData.place;
    this.space.map = item.map;

    this.cargarImagen(this.space.map);

    this.initCalendar();

  }

  /* este metodo carga la imagen desde firebase con un parametro nombre de la imagen */
  cargarImagen(name: string) {

      if (name) {
        const ref = this.storage.ref('planos/' + name + '.png');
        this.plano = ref.getDownloadURL();
      } else {
        this.mensaje = true;
      }



  }

  setSpace() {
    const nuevoespacio = this.space;
    this.buscarSede().then((ok: string) => {
      nuevoespacio.subHq = ok;
      this.afs.collection('space').add(nuevoespacio);
      console.log(nuevoespacio);
    });

  }

  actualizarEspacio() {
    const nuevoespacio = this.space;

    this.buscarSede().then((ok: string) => {
      nuevoespacio.subHq = ok;
      // this.afs.doc( 'space/' + this.idsp ).set( nuevoespacio, { merge: true} );
      console.log(nuevoespacio);
    });


  }

  /* metodo para buscar una subsede de cali  */
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

  initCalendar() {

    const containerEl: JQuery = $('#calendario');
    containerEl.fullCalendar({
      // options here
      header: {
        left:   'Programacion Laboratorio',
        center: '',
        right:  'today prev,next'
      },
      events: [
        {
          title  : 'clase 1',
          start  : '2018-06-07',
          color: 'red'
        },
        {
          title  : 'clase 2',
          start  : '2018-06-07',
          end    : '2010-01-09'
        },
        {
          title  : 'clase 3',
          start  : '2018-06-10',
          allDay : false // will make the time show
        }
      ],
      defaultView: 'month',
    });
  }

}
