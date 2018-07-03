import { async } from '@angular/core/testing';
import { ObservablesService } from './../../../shared/services/observables.service';
import { Component, OnInit, ViewChild} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MatTableDataSource, MatPaginator, MatSort   } from '@angular/material';
import swal from 'sweetalert2';
import { LoginService } from '../../login/login-service/login.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireStorage } from 'angularfire2/storage';
import * as $ from 'jquery';
import 'fullcalendar';
import 'fullcalendar-scheduler';

@Component({
  selector: 'app-admin-espacios',
  templateUrl: './admin-espacios.component.html',
  styleUrls: ['./admin-espacios.component.css']
})
export class AdminEspaciosComponent implements OnInit {
  plano: Observable<any>;
  mensaje = false;
  idlab;
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



  // INICIALIZACION DATATABLE espacios
  displayedColumnsSpace = ['capacidad', 'arealibre', 'totalarea', 'spaceData.building', 'spaceData.place'];
  dataSourceSpace = new MatTableDataSource([]);

  @ViewChild('paginatorSpace') paginatorSpace: MatPaginator;
  @ViewChild('sortSpace') sortSpace: MatSort;

  espaestructurado: any;

  constructor(private obs: ObservablesService,
              private afs: AngularFirestore,
              private storage: AngularFireStorage,
              private register: LoginService) {
  }


  // tslint:disable-next-line:max-line-length

  ngOnInit() {

    this.obs.currentObjectEsp.subscribe(data => {

      if (data.length !== 0) {

        this.estructuraEspacio(data.uid).then(() => {
         this.itemsel = Observable.of(this.espaestructurado.espacios);
          console.log(this.espaestructurado);
          this.idlab = data.uid;
          this.dataSourceSpace = new MatTableDataSource(this.espaestructurado.espacios);


          this.dataSourceSpace.sortingDataAccessor = (item, property) => {
            switch (property) {
              case 'spaceData.place': return item.spaceData.place;

              case 'spaceData.building': return item.spaceData.building;

              default: return item[property];
            }
          };

          swal({
            title: 'Cargando un momento...',
            text: 'espere mientras se cargan los datos',
            onOpen: () => {
              swal.showLoading();
            }
          });


          setTimeout(() => {
              if (this.espaestructurado.espacios.length > 0 ) {
                this.dataSourceSpace.paginator = this.paginatorSpace;
                this.dataSourceSpace.sort = this.sortSpace;
              }
              swal.close();
            }, 1000);


       });

      }

    });



  }


  estructuraEspacio(key) {
    const promise = new Promise((resolve, reject) => {
      this.buscarLab(key).subscribe(labo => {
        const laboratorio = labo.payload.data();

        let estadoLab;
        if (laboratorio.active === true) {
           estadoLab = 'Activo';
        } else if ( laboratorio.active === false ) {
           estadoLab = 'Inactivo';
        }

         this.espaestructurado = {
          practicas: this.estructurarPracticas(laboratorio.relatedPractices).arr,
          espacios: this.estructurarSpace( laboratorio.relatedSpaces),
          uid: key
         };

         resolve();

      });
     });

     return promise;

  }

  // METODO QUE ESTRUCTURA LA DATA DE LAS PRACTICAS EN LA VISTA BUSQUEDA DE LABORATORIOS
  // RECIBE EL NODO DE LABORATORIO QUE CONTIENE LAS PRACTICAS ASOCIADOS
  estructurarPracticas(item) {

    const arr = [];
    const arr2 = [];
    const arr3 = [];
    for (const clave in item) {
      // Controlando que json realmente tenga esa propiedad
      if (item.hasOwnProperty(clave)) {

        if (item[clave]) {
          this.afs.doc('practice/' + clave).snapshotChanges().subscribe(data => {
            const practica = data.payload.data();
            this.afs.doc('practice/' + clave).collection('programmingData').valueChanges().subscribe(data2 => {

              // funciona con una programacion, cuando hayan mas toca crear otro metodo
              const prog = data2[0];

              if (prog) {
                const pract = {
                  nombre: practica.practiceName,
                  programacion: {
                    estudiantes: prog['noStudents'],
                    diahora: prog['schedule'],
                    semestre: prog['semester']
                  },
                  activo: practica.active
                };
                 // construye los eventos para el calendario de cada laboratorio
                const evento = {

                    title: this.ajustarTexto(practica.practiceName).nom1 ,
                    start: prog['schedule'],
                    color: 'green',
                };


                  arr2.push(evento);

                if ( practica.active ) {

                  arr.push( pract );
                } else {
                  arr3.push( pract );
                }
              }


            });

          });
        }

      }
    }

    return {arr, arr2, arr3};
  }

  estructurarSpace(item) {

    const arr = [];

    for (const clave in item) {
      // Controlando que json realmente tenga esa propiedad
      if (item.hasOwnProperty(clave)) {

        if (item[clave]) {
          this.afs.doc('space/' + clave).snapshotChanges().subscribe(data => {
            const espacio = data.payload.data();

              // funciona con una programacion, cuando hayan mas toca crear otro metodo
              if (espacio) {
                console.log('espacioo', espacio);
                const space = {
                  id_space: data.payload.id,
                  capacity: espacio.capacity,
                  createdAt: espacio.createdAt,
                  freeArea: espacio.freeArea,
                  headquarter: espacio.headquarter,
                  indxSa: espacio.indxSa,
                  map: espacio.map,
                  minArea: espacio.minArea,
                  ocupedArea: espacio.ocupedArea,
                  totalArea: espacio.totalArea,
                  spaceData: espacio.spaceData,
                  active: espacio.active

                };

                arr.push(space);
              }



          });
        }

      }
    }

    return arr;
  }

   // METODO QUE TRAE UN DIRECTOR ESPECIFICO DEPENDIENDO EL ID-DIRECTOR
   buscarLab(idlab) {
    return this.afs.doc('cfFacil/' + idlab).snapshotChanges();

  }

   // METODO QUE AJUSTA EL NOMBRE DEL LABORATORIO PARA EL SIDEBAR
   ajustarTexto(nombre) {
    console.log(nombre);
    const nombreArr = nombre.split(' ');
    let name1 = '';
    let name2 = '';
    for (let i = 0; i < nombreArr.length; i++) {
      if (i < 3) {
        name1 += nombreArr[i] + ' ';
      } else {
        name2 += nombreArr[i] + ' ';
      }
    }

    return { nom1: name1, nom2: name2 };
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
    this.space.active = item.active;

    this.cargarImagen(this.space.map);
    this.listPracticeforSpace();



  }

  /* este metodo carga la imagen desde firebase con un parametro nombre de la imagen */
  cargarImagen(name: string) {

    if (name) {
      this.mensaje = false;
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
      this.afs.collection('space').add(nuevoespacio).then( (data) => {
           // agrega el nuevo espacio al laboratorio actual
          this.updateFaciliti( data.id );
      });
      console.log(nuevoespacio);
    });
  }

  actualizarEspacio() {
    const nuevoespacio = this.space;

    this.buscarSede().then((ok: string) => {
      nuevoespacio.subHq = ok;
       this.afs.doc( 'space/' + this.idsp ).set( nuevoespacio, { merge: true} ).then( () => {
        swal({
          type: 'success',
          title: 'Actualizado Correctamente',
          showConfirmButton: true
        });

       });
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

  prueba() {
    this.dataSourceSpace.filterPredicate = (data, filter: string)  => {
      const accumulator = (currentTerm, key) => {
        return key === 'spaceData' ? currentTerm + data.spaceData.type : currentTerm + data[key];
      };
      const dataStr = Object.keys(data).reduce(accumulator, '').toLowerCase();
      // Transform the filter by converting it to lowercase and removing whitespace.
      const transformedFilter = filter.trim().toLowerCase();
      return dataStr.indexOf(transformedFilter) !== -1;
    };

  }

  initCalendar( horario  ) {


    console.log('entro este es el horario', horario );
    const containerEl: JQuery = $('#cal');
    containerEl.fullCalendar( 'destroy' );


    containerEl.fullCalendar({
      // licencia
      schedulerLicenseKey: 'GPL-My-Project-Is-Open-Source',
      // options here
      height: 420,

      header: {

        left: '',
        center: 'tittle',
        right: 'today prev,next'
      },
      events: horario  ,

      defaultView: 'month',

    });
  }

  updateFaciliti( idSp ) {


    const  relatedSpaces = this.register.setBoolean(  idSp );


    console.log('revisar este lab', this.idlab);
    this.afs.collection('cfFacil' ).doc(this.idlab).set({   relatedSpaces   }  , { merge: true })
                   .then( () => {

                    swal({
                      type: 'success',
                      title: 'Creado Correctamente',
                      showConfirmButton: true
                    });
                   });

  }

  /* listar horario por espacio  */

    listPracticeforSpace() {

      console.log('entro el prro');

      const arr = [];

        this.afs.doc('practice/AmtSFtg3m5SrSc5iO2vK').collection('programmingData',
        ref => ref.where('space', '==', '1xCjO5lRbstnW20U2Lyz'))
        .snapshotChanges().subscribe(data => {
            if ( data) {
            data.forEach(element => {
             const elemento = element.payload.doc.data();
               arr.push( elemento );
            });
          }
        });

        console.log(arr);

    }


  /* setea campos del objeto */
  clearObj() {
    this.space.totalArea = '';
    this.space.capacity = '';
    this.space.freeArea = '';
    this.space.indxSa = '';
    this.space.minArea = '';
    this.space.ocupedArea = '';
    this.space.spaceData.building = '';
    this.space.spaceData.floor = '';
    this.space.spaceData.place = '';
  }

}
