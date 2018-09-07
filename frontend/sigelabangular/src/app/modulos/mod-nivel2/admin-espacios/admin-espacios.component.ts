import { async } from '@angular/core/testing';
import { ObservablesService } from './../../../shared/services/observables.service';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import swal from 'sweetalert2';
import { LoginService } from '../../login/login-service/login.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireStorage } from 'angularfire2/storage';
import * as $AB from 'jquery';
import 'fullcalendar';
import 'fullcalendar-scheduler';
// tslint:disable-next-line:import-blacklist
import { Subscription } from 'rxjs';
import { ArrayType } from '@angular/compiler/src/output/output_ast';
import { all } from 'q';
import { EspaciosService } from '../services/espacios.service';

declare var $: any;

@Component({
  selector: 'app-admin-espacios',
  templateUrl: './admin-espacios.component.html',
  styleUrls: ['./admin-espacios.component.css']
})
export class AdminEspaciosComponent implements OnInit, OnDestroy {
  plano: Observable<any>;
  dispo;
  idnewSp;
  status;
  mensaje = false;
  idlab;
  idsh;
  itemsel: Observable<Array<any>>;
  sedes = [];
  subsedes = [];
  idsp;
  tablesel = '';
  horarios = [];
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

  horariopractica;
  formtrue = false;
  sus: Subscription;

  // INICIALIZACION DATATABLE espacios
  displayedColumnsSpace = ['capacidad', 'arealibre', 'totalarea', 'spaceData.building', 'spaceData.place'];
  dataSourceSpace = new MatTableDataSource([]);

  @ViewChild('paginatorSpace') paginatorSpace: MatPaginator;
  @ViewChild('sortSpace') sortSpace: MatSort;

  espaestructurado: any;

  role:any;
  moduloNivel2 = false;

  constructor(private obs: ObservablesService,
    private afs: AngularFirestore,
    private storage: AngularFireStorage,
    private register: LoginService,
    private spServ: EspaciosService) {
  }


  // tslint:disable-next-line:max-line-length

  ngOnInit() {

    this.getRoles();
    this.sus = this.obs.currentObjectEsp.subscribe(data => {

      if (data.length !== 0) {

        this.estructuraEspacio(data.uid).then(() => {
          this.listHq();
          this.itemsel = Observable.of(this.espaestructurado.espacios);
          console.log(this.espaestructurado);
          this.idlab = data.uid;
          this.dataSourceSpace = new MatTableDataSource(this.espaestructurado.espacios);
          // this.listSubHq();

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
            if (this.espaestructurado.espacios.length > 0) {
              this.dataSourceSpace.paginator = this.paginatorSpace;
              this.dataSourceSpace.sort = this.sortSpace;
              swal.close();
            }else{
              swal({
                type: 'error',
                title: 'No existen espacios asociados al laboratorio',
                showConfirmButton: true
              });
            }
          
          }, 1000);


        });

      } else {
        swal({
          type: 'error',
          title: 'No se ha seleccionado ningun laboratorio',
          showConfirmButton: true
        });
      }

    });



  }

  ngOnDestroy() {
    this.sus.unsubscribe();
  }

   // METODO QUE ME TRAE EL ROL DE ACCESSO A NIVEL 2
   getRoles() {

    this.role = JSON.parse(localStorage.getItem('rol'));
    for (const clave in this.role) {
      if (this.role[clave]) {
        if ((clave == 'moduloNivel2')) {
          this.moduloNivel2 = true;
        }
      }
    }
  }

  estructuraEspacio(key) {
    const promise = new Promise((resolve, reject) => {
      this.buscarLab(key).then(labo => {
        const laboratorio = labo.data();

        let estadoLab;
        if (laboratorio.active === true) {
          estadoLab = 'Activo';
        } else if (laboratorio.active === false) {
          estadoLab = 'Inactivo';
        }

        this.espaestructurado = {
          practicas: this.estructurarPracticas(laboratorio.relatedPractices).arr,
          espacios: this.estructurarSpace(laboratorio.relatedSpaces),
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

                  title: this.ajustarTexto(practica.practiceName).nom1,
                  start: prog['schedule'],
                  color: 'green',
                };


                arr2.push(evento);

                if (practica.active) {

                  arr.push(pract);
                } else {
                  arr3.push(pract);
                }
              }


            });

          });
        }

      }
    }

    return { arr, arr2, arr3 };
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
    return this.afs.doc('cfFacil/' + idlab).ref.get();

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

    this.formtrue = true;
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
    this.listPracticeforSpace(this.idsp).then((ok: any) => {

      console.log(ok);
      setTimeout(() => {
        ok.forEach(element => {

          this.getPrgramming(element);
        });
      }, 1000);
    });

  }

  /* este metodo carga la imagen desde firebase con un parametro nombre de la imagen */
  cargarImagen(name: string) {

    if (name) {
      this.mensaje = false;
      const ref = this.storage.ref('planos/' + name + '.png');

      ref.getDownloadURL()
        .subscribe(res => {
          this.plano = res;
        });

    } else {
      this.mensaje = true;
    }



  }

    // necesario el id de la subsede para almacenarlo en los metodos de los espacios
  setSpace() {

    if ( !this.space.spaceData.building && !this.space.spaceData.building   ) {

      swal({
        type: 'info',
        title: 'Hay campos vacios importantes.',
        showConfirmButton: true
      });

    }
    const nuevoespacio = this.space;

    nuevoespacio.subHq =  this.idsh;
    this.afs.collection('space').add(nuevoespacio).then((data) => {
      // agrega el nuevo espacio al laboratorio actual
      this.updateFaciliti(data.id);
    });
    console.log(nuevoespacio);



  }

  actualizarEspacio() {
    const nuevoespacio = this.space;

      this.afs.doc('space/' + this.idsp).set(nuevoespacio, { merge: true }).then(() => {
        swal({
          type: 'success',
          title: 'Actualizado Correctamente',
          showConfirmButton: true
        });

      });
      console.log(nuevoespacio);



  }


  listSubHq(sede) {

     console.log('si llego la sede', sede);
    this.spServ.listSubHq(sede).subscribe( res => {

     this.subsedes = res;

      console.log( 'subsedes',  res);

    });

  }

  // lista todas las sedes de la plataforma
  listHq() {

    this.spServ.listHq().subscribe(  (res) =>  {

       this.sedes = res;
       console.log( 'sedes', res);

    });

  }

  applyFilterPers(filterValue: string) {

    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSourceSpace.filter = filterValue;
  }


  initCalendar() {

    console.log(this.horarios);
    const horario = this.horarios;
    const containerEl: JQuery = $AB('#cal');
    containerEl.fullCalendar('destroy');


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
      events: horario,

      defaultView: 'month',

    });
  }
  // actualiza el laboratorio con una nueva referencia de espacio
  updateFaciliti(idSp) {

    if (idSp) {
      const  relatedSpaces = {};
      relatedSpaces[idSp] = true;


      console.log('revisar este lab', this.idlab);
      this.afs.collection('cfFacil').doc(this.idlab).set({ relatedSpaces }, { merge: true })
        .then(() => {

          swal({
            type: 'success',
            title: 'Creado Correctamente',
            showConfirmButton: true
          });
        });

    } else {

      swal({
        type: 'info',
        title: 'Hace falta campos importantes',
        showConfirmButton: true
      });
    }

  }

  /* listar horario por espacio  */

  listPracticeforSpace(idSpace) {
    // traer array con todas las referencias de practicas con el espacio relacionado
    return new Promise((resolve, reject) => {
      const pathPrograming = [];
      const pracRef = this.afs.collection('practice').ref;
      const query = pracRef.where('relatedSpaces.' + idSpace, '==', true);
      query.get().then(ok => {

        ok.forEach(doc => {
          pathPrograming.push(doc.id);
        });
      });

      resolve(pathPrograming);

    });



  }

  getPrgramming(id) {
    this.horarios = [];
    this.afs.collection('practice/' + id + '/programmingData')
      .valueChanges()
      .subscribe(data => {
        const prog = data[0];
        const el = prog['schedule'].forEach(element => {
          this.horarios.push(element);
        });
      });
  }

  // valida si ya existe un espacio para que pueda ser vinculado
  spaceCheck(ed, sp) {
    this.idnewSp = '';

    console.log(ed, sp);

    if (ed.trim() === '' || sp.trim() === '') {
      this.status = 'Campo obligatorio';
      // this.dispo = false;
    } else {
      this.status = 'Buscando espacio ...';
      const collref = this.afs.collection('space').ref;
      const queryref = collref.where('spaceData.building', '==', ed).where('spaceData.place', '==', sp);
      queryref.get().then((snapShot) => {
        if (snapShot.empty) {
          this.status = 'Espacio no encontrado, ingrese los datos de forma manual';
          this.dispo = true;
        } else {
          console.log(snapShot.docs[0].id);
          this.status = 'Ya existe el espacio, si desea vincularlo al laboratorio presione el boton vincular.';
          this.dispo = false;
          this.idnewSp = snapShot.docs[0].id;
        }
      });
    }
  }

  getIdSubHq( id ) {
    console.log( 'llego este id', id);
    this.idsh = id;
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


  cerrarModal(modal){
    $('#'+modal).modal('hide');
  }

}
