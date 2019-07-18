import { Component, OnInit, ViewChild, AfterContentInit, OnDestroy } from '@angular/core';
import { ObservablesService } from '../../../shared/services/observables.service';
import { Observable } from 'rxjs/Observable';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import * as $AB from 'jquery';
import 'fullcalendar';
import swal from 'sweetalert2';

import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';
import { Modulo2Service } from '../services/modulo2.service';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';
import { Subscription } from 'rxjs/Subscription';

declare var $: any;

@Component({
  selector: 'app-admin-practicas',
  templateUrl: './admin-practicas.component.html',
  styleUrls: ['./admin-practicas.component.css']
})
export class AdminPracticasComponent implements OnInit, AfterContentInit, OnDestroy {
  events = [
  ];
  @ViewChild(SpinnerComponent) alert: SpinnerComponent;

  year = `${new Date().getFullYear().toString()}-01-01`;

  modalCalendar: JQuery ;
  programacionCalendar = [];
  id_prc;
  id_pro;
  residuos = false;
  vercalendario = false;
  consultarpractica = false;
  practica = {
    nombre: '',
    semestre: '',
    numeroEst: '',
    estado: false,
    equipos: [],
    space: [],
    activo: false
  };

  evento = {
    title: '',
    start: '',
    color: 'blue'
  };
  horaE;
  horaF;
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
  displayedColumnsPrac = [ 'codigo',  'nombre', 'programacion.semestre', 'programacion.estudiantes', 'activo'];
  dataSourcePrac = new MatTableDataSource([]);

  displayedColumnsPracIn = [ 'codigo', 'nombre', 'programacion.semestre', 'programacion.estudiantes', 'activo'];
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

  role: any;
  moduloNivel2 = false;
  addPractica = false ;
  sucriptionPractice: Subscription = null;


  user: any;
  paso2 = false;
  paso3;

  constructor(private obs: ObservablesService,
    private servicioMod2: Modulo2Service,
    private _formBuilder: FormBuilder) {

      this.user = this.servicioMod2.getLocalStorageUser();
  }


  ngOnInit() {
  //   $('html, body').animate({ scrollTop: '0px' }, 'slow');

  // this.year  = `${new Date().getFullYear().toString()}-00-00`;
  console.log(this.year);

  }

  ngOnDestroy() {


  }

  // METODO QUE ME TRAE EL ROL DE ACCESSO A NIVEL 2
  getRoles(rol) {
    console.log(rol);
    this.moduloNivel2 = false;
    for (const clave in rol) {
      if (rol[clave]) {
        if ((clave === 'moduloNivel2')) {
          this.moduloNivel2 = true;
        }
      }
    }
  }


  ngAfterContentInit() {

    this.metodoInicio();
  }


  async metodoInicio() {

    swal({
      title: 'Cargando un momento...',
      text: 'Espere mientras se cargan los datos',
      onOpen: () => {
        swal.showLoading();
      }
    });

    this.obs.currentObjectPra.subscribe(data => {

      this.getRoles(data.roles);

      if (data.length !== 0) {
        this.estructurarDataPrac(data.uid).then(() => {


          this.itemsel = Observable.of(this.pracestructurado);
          console.log(this.pracestructurado);

          this.id_lab = data.uid;
          this.mainSpace = this.pracestructurado.mainSpace;

          this.dataSourcePrac.data = (this.pracestructurado.practicas);

          this.dataSourcePracIn.data = (this.pracestructurado.practicasInactivas);

          this.dataSourceEquip.data = (this.pracestructurado.equipos);

          this.dataSourceEsp.data = (this.pracestructurado.espacios);


          setTimeout(() => {
            if (this.pracestructurado) {

              this.dataSourcePrac.sort = this.sortPrac;
              this.dataSourcePrac.paginator = this.paginatorPrac;

              this.dataSourcePracIn.sort = this.sortPracIn;
              this.dataSourcePracIn.paginator = this.paginatorPracIn;

              this.dataSourceEquip.sort = this.sortEquip;
              this.dataSourceEquip.paginator = this.paginatorEquip;

              this.dataSourceEsp.sort = this.sortEsp;
              this.dataSourceEsp.paginator = this.paginatorEsp;

              swal.close();
            } else {
              swal({
                type: 'error',
                title: 'No existen prácticas asociadas al laboratorio',
                showConfirmButton: true
              });
            }


          }, 2000);


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


        });


      } else {
        swal({
          type: 'error',
          title: 'No se ha seleccionado ningún laboratorio',
          showConfirmButton: true
        });
      }

    });


  }


  estructurarDataPrac(key) {

    const promise = new Promise((resolve, reject) => {
      this.servicioMod2.buscarLab(key).then(labo => {
        const laboratorio = labo.data();

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
          id_lab: key,
          nombre: laboratorio.cfName
        };

        if(this.pracestructurado){
          resolve();
        }


      });
    });

    return promise;

  }


  // METODO QUE ESTRUCTURA LA DATA DE LAS PRACTICAS EN LA VISTA BUSQUEDA DE LABORATORIOS
  // RECIBE EL NODO DE LABORATORIO QUE CONTIENE LAS PRACTICAestructurarPracticasS ASOCIADOS
  estructurarPracticas(item) {

    const arr = [];
    const arr3 = [];
    for (const clave in item) {
      // Controlando que json realmente tenga esa propiedad
      if (item.hasOwnProperty(clave)) {


        this.servicioMod2.buscarPractica(clave).then(data => {
          const practica = data.data();
          this.servicioMod2.buscarProgramacion(clave).then(data2 => {

            // funciona con una programacion, cuando hayan mas toca crear otro metodo

            data2.forEach(prog => {
              if (prog) {
                console.log('id que ingreso del espacio', prog['space']);

                const pract = {
                  id_pract: data.id,
                  nombre: practica.practiceName,
                  residuos: practica.residuos ?  practica.residuos : false,
                  codigo : practica.subjectCode,
                  equipos: this.estructurarEquipos(practica.relatedEquipments),
                  espacio: this.getOnlySpace(prog.data().space),
                  programacion: {
                    id_pro: prog.id,
                    estudiantes: prog.data().noStudents,
                    horario: prog.data().schedule,
                    semestre: prog.data().semester
                  },
                  activo: practica.active
                };
                // construye los eventos para el calendario de cada laboratorio


                if (practica.active) {

                  arr.push(pract);
                } else {
                  arr3.push(pract);
                }
              }

            });



          });

        });


      }
    }

    return { arr , arr3 };
  }
  // equipos
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.displayedColumnsEquip.length;
    return numSelected === numRows;
  }
  masterToggle() {
    this.isAllSelected() ?
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
      this.servicioMod2.buscarEspacio(clave).then(data => {
        const espacio = data.data();


        // funciona con una programacion, cuando hayan mas toca crear otro metodo
        if (espacio) {
          const space = {
            id_space: data.id,
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
         this.servicioMod2.buscarEspacio(clave).then(data => {
            const espacio = data.data();

            // funciona con una programacion, cuando hayan mas toca crear otro metodo
            if (espacio) {
              const space = {
                id_space: data.id,
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
          this.servicioMod2.buscarEquipo(clave).then(data => {
            const equip = data.data();

            // funciona con una programacion, cuando hayan mas toca crear otro metodo
            const equipo = {
              id: data.id,
              nombre: equip.cfName,
              activo: equip.active,
              precio: equip.price,
              espacio: equip.space
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

    this.addPractica = false;
    this.consultarpractica = true;
    console.log(row);
    this.practica = row;
    this.practica.activo = row.activo;

    this.practica.nombre = row.nombre;
    this.practica.numeroEst = row.programacion.estudiantes;
    this.practica.semestre = row.programacion.semestre;
    this.practica.estado = row.activo;
    this.practica.equipos = row.equipos;
    this.practica.space = row.espacio;
    this.id_prc = row.id_pract;
    this.id_pro = row.programacion.id_pro;
    console.log(row.programacion.horario);

    this.obs.centerView('mostrarpractica');
    if (row.programacion.horario.length > 0) {

      this.programacionCalendar = row.programacion.horario;

      // containerEl.fullCalendar( 'renderEvents', row.programacion.horario );

    }

  }

  activarData(row){
    console.log(row);
    $('html, body').animate({ scrollTop: '600px' }, 'slow');
    this.nameP = row.nombre;
    this.code = row.codigo;
    this.programming.semester = row.programacion.semestre;
    this.programming.noStudents = row.programacion.estudiantes;
    this.residuos = row.residuos;

    this.selection.clear();
    const arra = [];
    for (let i = 0; i < row.equipos.length; i++) {
      const element = row.equipos[i];
      for (let j = 0; j < this.pracestructurado.equipos.length; j++) {
        const element2 = this.pracestructurado.equipos[j];

        if (element.id == element2.id) {
          console.log(element2);
        // this.selection.isSelected(element2);
        this.selection.select(element2)
        console.log(this.selection.selected);
        }

      }

    }

  }

  addPractice(stepper) {

    const fecha = new Date();

    const practica = {

      practiceName: this.nameP,
      subjectCode: this.code,
      cfFacil: this.id_lab,
      relatedSpaces: {},
      relatedEquipments: {},
      residuos: this.residuos,
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


      console.log(element);

      if (element.id) {
        practica.relatedEquipments[element.id] = true;

      }

      if (element.espacio) {
        practica.relatedSpaces[element.espacio] = true;
      }

    });


    console.log(practica, 'programing', programming);
    console.log(this.mainSpace);
    if (practica) {


        this.servicioMod2.addPractica(practica).then(ok => {

          //agrega el objeto al cache de practicas
          this.servicioMod2.pushCachePractice(practica.active ,practica.subjectCode, practica.practiceName , programming.semester  , programming.noStudents    ,
            ok.id, practica.updatedAt)


          this.alert.show();
          this.servicioMod2.Trazability(
            this.user.uid, 'create', 'practice', ok.id, practica
          ).then(()=>{
            facil.relatedPractices[ok.id] = true;
            this.servicioMod2.Trazability(
              this.user.uid, 'update', 'cfFacil', this.id_lab, facil
            ).then(()=>{
              this.servicioMod2.setDocLaboratorio(this.id_lab,facil);
            });

            this.servicioMod2.addProgramacion(ok.id, programming).then(doc => {
              this.servicioMod2.TrazabilitySubCollection(
                this.user.uid, 'create', 'practice', ok.id, 'programmingData', doc.id, programming
              ).then(() => {

                this.alert.hide();
                swal({
                  type: 'success',
                  title: 'Almacenado correctamente',
                  showConfirmButton: true
                });

                this.clearObj();
                stepper.reset();
                this.addPractica = false;
              });
            });


        });
      });


    }

  }

  initCalendar(horario) {

    const containerEl: JQuery = $AB('#cal');
    containerEl.fullCalendar('destroy');

    containerEl.fullCalendar({
      // licencia
      schedulerLicenseKey: 'GPL-My-Project-Is-Open-Source',
      // options here
      height: 450,

      header: {
        left: 'month,agendaWeek,agendaDay',
        center: 'title',
        right: 'today prev,next',
      },

      events: horario,

      defaultView: 'month',
      timeFormat: 'H(:mm)'


    });

  }


   triggerCalendar() {

    this.vercalendario = true;
    setTimeout(() => {

      this.modalCalendar = $AB('#calendariomodal');
      this.modalCalendar.fullCalendar('destroy');
      console.log('entro al modal');
       this.modalCalendar.fullCalendar({
         // licencia
         schedulerLicenseKey: 'GPL-My-Project-Is-Open-Source',
         // options here
         header: {
           left:   'title',
           center: '',
           right:  'today prev,next'
         },
         events: this.programacionCalendar,
         timeFormat: 'H(:mm)'
       });
       if (this.programacionCalendar[0].start ) {

         this.modalCalendar.fullCalendar('gotoDate', this.programacionCalendar[0][0].start  );
       }
      }, 100);




   }

  changeColor(value) {

    this.evento.color = value;

  }
  agregarEvento() {

    if (!this.evento.title || !this.evento.start || !this.evento.start) {
      swal({
        type: 'error',
        title: 'Hay un campo importante vacío.',
        showConfirmButton: true
      });
    } else {


      const nev = {
        title: this.evento.title,
        start: this.evento.start + 'T' + this.horaE,
        end: this.evento.start + 'T' + this.horaF,
        allDay: false,
        color: this.evento.color
      };

      console.log(nev);

      this.events.push(nev);


      this.initCalendar(this.events);

      swal({
        type: 'success',
        text: 'Nueva clase agregada con éxito',
        showConfirmButton: true,
        timer: 3900
      });

      this.cerrarModal('myModal2');
    }

  }



  actualizarPractica() {

    const fecha = new Date();
    const practica = {

      practiceName: this.practica.nombre,
      active: this.practica.estado,
      updatedAt: fecha.toISOString()

    };

    const prog = {
      noStudents: this.practica.numeroEst,
      semester: this.practica.semestre

    };

    this.servicioMod2.Trazability(

      this.user.uid, 'update', 'practice', this.id_prc, practica
    ).then(() => {
      this.servicioMod2.setPractica(this.id_prc, practica).then(ok => {
        this.alert.show();
      this.servicioMod2.TrazabilitySubCollection(
        this.user.uid, 'update', 'practice', this.id_prc, 'programmingData', this.id_pro, prog
      ).then(() => {
        this.servicioMod2.setProgramacion(this.id_prc, this.id_pro, prog);


        this.cerrarModal('myModal3');
        this.alert.hide();
          swal({
            type: 'success',
            title: 'Actualizado Correctamente',
            showConfirmButton: true
          });
        });

      });
    });

  }

  down() {

    this.addPractica = true;
    this.consultarpractica = false;



    setTimeout(() => {
      document.getElementById('addpractica').scrollIntoView({block: 'end', behavior: 'smooth'});

    }, 100);
  }

  cerrarModal(modal) {
    $('#' + modal).modal('hide');
  }


  clearObj() {

    this.residuos = false;
    this.nameP = '';
    this.code = '';
    this.programming.semester = '';
    this.programming.noStudents = '';
    this.events = [];


  }


  initValidatorStepper() {

  }

  // deshabilitar button
  disabledcalendar(): boolean {
  return  this.events.length > 0 ? false : true;
  }

  showstp(st) {

    console.log(st);
  }


  onSubmit( form ) {
    if (form.valid) {
      console.log(form);
      form.reset();
    }
  }

}
