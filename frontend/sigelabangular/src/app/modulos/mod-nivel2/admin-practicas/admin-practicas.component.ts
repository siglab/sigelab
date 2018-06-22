import { Component, OnInit, ViewChild } from '@angular/core';
import { ObservablesService } from '../../../shared/services/observables.service';
import { Observable } from 'rxjs/Observable';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import * as $ from 'jquery';
import 'fullcalendar';
import 'fullcalendar-scheduler';
import swal from 'sweetalert2';
import { AngularFirestore } from 'angularfire2/firestore';
import { constrainPoint } from 'fullcalendar/src/util';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-admin-practicas',
  templateUrl: './admin-practicas.component.html',
  styleUrls: ['./admin-practicas.component.css']
})
export class AdminPracticasComponent implements OnInit {
  events = [
  ];

  id_prc;
  id_pro;

  practica = {
    nombre: '',
    semestre: '',
    numeroEst: '',
    estado: false,
    equipos: [],
    space: [
    ]
  };

  evento = {
    title: '',
    start: '',
    color: ''
  };

  programming = {
    semester: '',
    noStudents: '',
  };

  code;
  nameP;
  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  id_lab;
  mainSpace;
  selection = new SelectionModel(true, []);
  selection2 = new SelectionModel(true, []);

  itemsel: Observable<Array<any>>;
  interfaz: boolean;

  info: any;
  displayedColumnsPrac = ['nombre', 'programacion.semestre', 'programacion.estudiantes', 'activo'];
  dataSourcePrac = new MatTableDataSource([]);

  displayedColumnsPracIn = ['nombre', 'programacion.semestre', 'programacion.estudiantes', 'activo'];
  dataSourcePracIn = new MatTableDataSource([]);
  // equipos
  displayedColumnsEquip = ['select', 'nombre'];
  dataSourceEquip = new MatTableDataSource([]);
  // espacios
  displayedColumnsEsp = ['select', 'nombre', 'freeArea'];
  dataSourceEsp = new MatTableDataSource([]);

  // practicas activas
  @ViewChild('paginatorPrac') paginatorPrac: MatPaginator;
  @ViewChild('sortPrac') sortPrac: MatSort;

  // practicas inactivas
  @ViewChild('paginatorPracIn') paginatorPracIn: MatPaginator;
  @ViewChild('sortPracIn') sortPracIn: MatSort;

  // equipos
  @ViewChild('paginatorEquip') paginatorEquip: MatPaginator;
  @ViewChild('sortEquip') sortEquip: MatSort;

  // espacios
  @ViewChild('paginatorEsp') paginatorEsp: MatPaginator;
  @ViewChild('sortEsp') sortEsp: MatSort;

  pracestructurado: any;

  constructor(private obs: ObservablesService, private afs: AngularFirestore, private _formBuilder: FormBuilder) {


  }


  ngOnInit() {

     this.metodoInicio();

  }





   async metodoInicio() {

    this.obs.currentObject.subscribe(data => {


      if (data.length !== 0) {
        this.estructurarDataPrac(data.uid).then(() => {

          this.itemsel = Observable.of(this.pracestructurado);
          console.log(this.pracestructurado);

          this.id_lab = data.uid;
          this.mainSpace = this.pracestructurado.mainSpace;

          this.dataSourcePrac = new MatTableDataSource(this.pracestructurado.practicas);

          this.dataSourcePracIn = new MatTableDataSource(this.pracestructurado.practicasInactivas);

          this.dataSourceEquip = new MatTableDataSource(this.pracestructurado.equipos);

          this.dataSourceEsp = new MatTableDataSource(this.pracestructurado.espacios);

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
          this.dataSourcePrac.filterPredicate = (dat, filter: string) => {
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
            if (this.pracestructurado.practicas.length > 0) {

              this.dataSourcePrac.sort = this.sortPrac;
              this.dataSourcePrac.paginator = this.paginatorPrac;

              this.dataSourcePracIn.sort = this.sortPracIn;
              this.dataSourcePracIn.paginator = this.paginatorPracIn;

              this.dataSourceEquip.sort = this.sortEquip;
              this.dataSourceEquip.paginator = this.paginatorEquip;

              this.dataSourceEsp.sort = this.sortEsp;
              this.dataSourceEsp.paginator = this.paginatorEsp;

            }
               swal.close();
          }, 2000);


        });
      }

    });


  }


  estructurarDataPrac(key) {

    const promise = new Promise((resolve, reject) => {
      this.buscarLab(key).subscribe(labo => {
        const laboratorio = labo.payload.data();

        let estadoLab;
        if (laboratorio.active === true) {
          estadoLab = 'Activo';
        } else if (laboratorio.active === false) {
          estadoLab = 'Inactivo';
        }

        this.pracestructurado = {
          practicas: this.estructurarPracticas(laboratorio.relatedPractices).arr,
          practicasInactivas: this.estructurarPracticas(laboratorio.relatedPractices).arr3,
          equipos: this.estructurarEquipos(laboratorio.relatedEquipments),
          espacios: this.estructurarSpace(laboratorio.relatedSpaces),
          estado: estadoLab,
          mainSpace: laboratorio.mainSpace,
          id_lab: key
        };
        resolve();

      });
    });

    return promise;

  }

  // METODO QUE TRAE UN DIRECTOR ESPECIFICO DEPENDIENDO EL ID-DIRECTOR
  buscarLab(idlab) {
    return this.afs.doc('cfFacil/' + idlab).snapshotChanges();

  }

  // METODO QUE ESTRUCTURA LA DATA DE LAS PRACTICAS EN LA VISTA BUSQUEDA DE LABORATORIOS
  // RECIBE EL NODO DE LABORATORIO QUE CONTIENE LAS PRACTICAestructurarPracticasS ASOCIADOS
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
            this.afs.doc('practice/' + clave).collection('programmingData').snapshotChanges().subscribe(data2 => {

              // funciona con una programacion, cuando hayan mas toca crear otro metodo
              const prog = data2[0].payload.doc.data();

              if (prog) {
                console.log('id que ingreso del espacio', prog['space']);

                const pract = {
                  id_pract: data.payload.id,
                  nombre: practica.practiceName,
                  equipos: this.estructurarEquipos(practica.relatedEquipments),
                  espacio: this.getOnlySpace(prog['space']),
                  programacion: {
                    id_pro: data2[0].payload.doc.id,
                    estudiantes: prog.noStudents,
                    horario: prog.schedule,
                    semestre: prog.semester
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
  // equipos
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.displayedColumnsEquip.length;
    return numSelected === numRows;
  }
  masterToggle() {
    this.isAllSelected2() ?
      this.selection.clear() :
      this.dataSourceEquip.data.forEach(row => this.selection.select(row));
  }

  // espacios
  isAllSelected2() {
    const numSelected = this.selection2.selected.length;
    const numRows = this.displayedColumnsEsp.length;
    return numSelected === numRows;
  }
  masterToggle2() {
    this.isAllSelected2() ?
      this.selection2.clear() :
      this.dataSourceEsp.data.forEach(row => this.selection2.select(row));
  }


  getOnlySpace(clave) {

    const arr = [];
    if (clave) {
      this.afs.doc('space/' + clave).snapshotChanges().subscribe(data => {
        const espacio = data.payload.data();


        // funciona con una programacion, cuando hayan mas toca crear otro metodo
        if (espacio) {
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
          };

          arr.push(space);

        }

      });
    }
    return arr;
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

              };

              arr.push(space);
            }

          });
        }

      }
    }

    return arr;
  }

  // METODO QUE ESTRUCTURA LA DATA DE LAS PRACTICAS EN LA VISTA BUSQUEDA DE LABORATORIOS
  // RECIBE EL NODO DE LABORATORIO QUE CONTIENE LAS PRACTICAS ASOCIADOS
  estructurarEquipos(item) {

    const arr = [];

    for (const clave in item) {
      // Controlando que json realmente tenga esa propiedad
      if (item.hasOwnProperty(clave)) {

        if (item[clave]) {
          this.afs.doc('cfEquip/' + clave).snapshotChanges().subscribe(data => {
            const equip = data.payload.data();

            // funciona con una programacion, cuando hayan mas toca crear otro metodo
            const equipo = {
              id: data.payload.id,
              nombre: equip.cfName,
              activo: equip.active,
              precio: equip.price,
            };



            arr.push(equipo);


          });
        }

      }
    }

    return arr;
  }



  // METODO QUE AJUSTA EL NOMBRE DEL LABORATORIO PARA EL SIDEBAR
  ajustarTexto(nombre) {
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
    console.log(row);
    this.practica.nombre = row.nombre;
    this.practica.numeroEst = row.programacion.estudiantes;
    this.practica.semestre = row.programacion.semestre;
    this.practica.estado = row.activo;
    this.practica.equipos = row.equipos;
    this.practica.space = row.espacio;
    this.id_prc = row.id_pract;
    this.id_pro = row.programacion.id_pro;
    this.initCalendarModal( row.programacion.horario);
    console.log(row.programacion.horario);
  }

  addPractice() {

    const fecha = new Date();

    const practica = {

      practiceName: this.nameP,
      subjectCode: this.code,
      cfFacil: this.id_lab,
      relatedSpaces: {},
      relatedEquipments: {},
      active: true,
      createdAt: fecha.toISOString(),
      updatedAt: fecha.toISOString()

    };

    const programming = {
      semester: this.programming.semester,
      schedule: this.events,
      noStudents: this.programming.noStudents,
      createdAt: fecha.toISOString(),
      space: this.mainSpace
    };

    const facil = {

           relatedPractices: {}
    };

    this.selection.selected.forEach((element) => {




      if (element.id) {
        practica.relatedEquipments[element.id] = true;

      }

      if (element.id_space) {
        practica.relatedSpaces[element.id_space] = true;
      }

    });

    console.log(practica, 'programing', programming);
    console.log(this.mainSpace);
    if (practica) {

      this.afs.collection('practice').add(practica).then(ok => {
         facil.relatedPractices[ok.id] = true;
        this.afs.doc('cfFacil/'  + this.id_lab).set(facil, { merge: true });
        this.afs.doc('practice/' + ok.id).collection('programmingData').add(programming);

        swal({
          type: 'success',
          title: 'creado correctamente',
          showConfirmButton: true
        });
      });

    }

  }

  initCalendar(horario) {

    const containerEl: JQuery = $('#cal');
    containerEl.fullCalendar('destroy');

    containerEl.fullCalendar({

      // licencia
      schedulerLicenseKey: 'GPL-My-Project-Is-Open-Source',
      // options here
      height: 450,
      header: {

        left: '',
        center: 'tittle',
        right: 'today prev,next'
      },
      events: horario,

      defaultView: 'month',

    });
  }


  initCalendarModal(horario) {

    const containerEl: JQuery = $('#cal2');
    containerEl.fullCalendar('destroy');

    containerEl.fullCalendar({
      // licencia
      schedulerLicenseKey: 'GPL-My-Project-Is-Open-Source',
      // options here
      height: 450,
      header: {

        left: '',
        center: 'tittle',
        right: 'today prev,next'
      },
      events: horario,

      defaultView: 'month',

    });
  }

  agregarEvento() {

    const arr = this.events;
    const nev = {
      title: this.evento.title,
      start: this.evento.start,
      color: this.evento.color
    };

    arr.push(nev);

    this.initCalendar(arr);
  }

  actualizarPractica() {

    const fecha = new Date();
    const practica = {

      practiceName: this.practica.nombre,
      active: this.practica.estado,
      updatedAt: fecha.toISOString()

    };

    const prog = {
      noStudents: this.practica.numeroEst ,
      semester: this.practica.semestre

    };

      this.afs.doc('practice/' + this.id_prc).set(practica , {merge: true }).then(ok => {

      this.afs.doc('practice/' + this.id_prc + '/programmingData/' + this.id_pro).set(prog, {merge: true});

      swal({
        type: 'success',
        title: 'actualizado correctamente',
        showConfirmButton: true
      });

    });


  }


}
