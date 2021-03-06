import { ObservablesService } from './../../../shared/services/observables.service';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import swal from 'sweetalert2';
import { AngularFireStorage } from 'angularfire2/storage';
import * as $AB from 'jquery';
import 'fullcalendar';
import 'fullcalendar-scheduler';
// tslint:disable-next-line:import-blacklist
import { Subscription } from 'rxjs';
import { EspaciosService } from '../services/espacios.service';
import * as moment from 'moment';
import { Modulo2Service } from '../services/modulo2.service';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';
import { Router } from '@angular/router';
import { EDIFICIOSMELENDEZ } from './edificios';
import { FormControl, NgForm } from '@angular/forms';

import { map } from 'rxjs/operators/map';
import { startWith } from 'rxjs/operators';
declare var $: any;


@Component({
  selector: 'app-admin-espacios',
  templateUrl: './admin-espacios.component.html',
  styleUrls: ['./admin-espacios.component.css']
})
export class AdminEspaciosComponent implements OnInit, OnDestroy {
  plano: Observable<any>;
  @ViewChild(SpinnerComponent) alert: SpinnerComponent;

  actSpaces = [];
  actividadAct = [];
  dispo;
  idnewSp;
  status;
  fcu = false;
  mensaje = false;
  edificios = [];
  ocupacionAct;
  laboratorio;
  idlab;
  idsh;
  itemsel: Observable<Array<any>>;
  sedes = [];
  subsedes = [];
  noEsPrac = [];
  idsp;
  tablesel = '';
  horarios = [];
  space = {
    capacity: 0,
    createdAt: '',
    freeArea: 0,
    headquarter: '',
    subHq: '',
    indxSa: 0,
    map: '',
    minArea: 0,
    ocupedArea: 0,
    totalArea: 0,
    outcampus: false,
    spaceData: {
      building: '', place: 0,
      floor: '', descripcion: '', direccion: '', ciudad: ''
    },
    active: true
  };

  horariopractica;
  formtrue = false;
  sus: Subscription;

  // INICIALIZACION DATATABLE espacios
  displayedColumnsSpace = ['capacidad', 'arealibre', 'active', 'totalarea', 'spaceData.building', 'spaceData.place'];
  dataSourceSpace = new MatTableDataSource([]);

  @ViewChild('paginatorSpace') paginatorSpace: MatPaginator;
  @ViewChild('sortSpace') sortSpace: MatSort;

  espaestructurado: any;

  role: any;
  moduloNivel2 = false;
  moduloNivel3 = false;
  moduloNivel25 = false;

  user = this.servicioMod2.getLocalStorageUser();
  lab: any;
  otraSede: boolean;
  myControl: FormControl = new FormControl();
  filteredOptions: Observable<string[]>;



  constructor(private obs: ObservablesService,
    private servicioMod2: Modulo2Service,
    private storage: AngularFireStorage,
    private router: Router,
    private spServ: EspaciosService) {
  }


  // tslint:disable-next-line:max-line-length

  ngOnInit() {
    $('html, body').animate({ scrollTop: '0px' }, 'slow');


    this.initDataComponent();


    this.filteredOptions = this.myControl.valueChanges
    .pipe(
      startWith(''),

      map(val => this.filter(val))
    );


  }




  initDataComponent() {

    const now = moment().format();
    console.log(now);

    this.sus = this.obs.currentObjectEsp.subscribe(data => {
      this.getRoles(data.roles);
      if (data.length !== 0) {

        this.estructuraEspacio(data.uid).then(() => {
          this.listHq();
          this.itemsel = Observable.of(this.espaestructurado.espacios);
          console.log(this.espaestructurado);
          this.idlab = data.uid;
          this.dataSourceSpace.data = (this.espaestructurado.espacios);
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
            } else {
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
          title: 'No se ha seleccionado ningún laboratorio',
          showConfirmButton: true
        });
      }

    });
  }

  ngOnDestroy() {
    this.sus.unsubscribe();
  }

  // METODO QUE ME TRAE EL ROL DE ACCESSO A NIVEL 2
  getRoles(rol) {
    this.moduloNivel2 = false;
    this.moduloNivel3 = false;
    this.moduloNivel25 = false;
    for (const clave in rol) {
      if (rol[clave]) {
        if ((clave === 'moduloNivel2')) {
          this.moduloNivel2 = true;
        }

        if ((clave === 'moduloNivel3')) {
          this.moduloNivel3 = true;
        }

        if ((clave === 'moduloNivel25')) {
          this.moduloNivel25 = true;
        }
      }
    }
  }


  estructuraEspacio(key) {
    const promise = new Promise((resolve, reject) => {
      this.servicioMod2.buscarLab(key).then(labo => {
        const laboratorio = labo.data();
        this.laboratorio = labo.data();
        let estadoLab;
        if (laboratorio.active === true) {
          estadoLab = 'Activo';
        } else if (laboratorio.active === false) {
          estadoLab = 'Inactivo';
        }

        this.espaestructurado = {
          practicas: this.estructurarPracticas(laboratorio.relatedPractices).arr,
          espacios: this.estructurarSpace(laboratorio.relatedSpaces),
          personal: this.contarPersonal(laboratorio.relatedPers),
          uid: key
        };

        this.listSubHq();
        resolve();

      });
    });

    return promise;

  }

  // METODO QUE ESTRUCTURA LA DATA DE LAS PRACTICAS EN LA VISTA BUSQUEDA DE LABORATORIOS
  // RECIBE EL NODO DE LABORATORIO QUE CONTIENE LAS PRACTICAS ASOCIADOS
  estructurarPracticas(item) {

    const arr = [];

    const arr3 = [];
    for (const clave in item) {
      // Controlando que json realmente tenga esa propiedad
      if (item.hasOwnProperty(clave)) {

        if (item[clave]) {
          this.servicioMod2.buscarPractica(clave).then(data => {
            const practica = data.data();
            this.servicioMod2.buscarProgramacion(clave).then(data2 => {


              data2.forEach(doc => {
                const prog = doc.data();
                if (prog) {
                  const pract = {
                    nombre: practica.practiceName,
                    programacion: {
                      estudiantes: prog['noStudents'],
                      diahora: prog['schedule'],
                      semestre: prog['semester'],
                      spaceid: prog['space']
                    },
                    activo: practica.active
                  };

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
    }

    return { arr, arr3 };
  }

  estructurarSpace(item) {

    const arr = [];

    for (const clave in item) {
      // Controlando que json realmente tenga esa propiedad
      if (item.hasOwnProperty(clave)) {

        this.servicioMod2.buscarEspacio(clave).then(data => {
          const espacio = data.data();

          // funciona con una programacion, cuando hayan mas toca crear otro metodo
          if (espacio) {
            console.log('espacioo', espacio);
            const space = {
              id_space: data.id,
              capacity: espacio.capacity,
              createdAt: espacio.createdAt,
              freeArea: espacio.freeArea,
              headquarter: espacio.headquarter,
              indxSa: espacio.indxSa,
              map: espacio.map,
              minArea: espacio.minArea,
              outcampus: espacio.outcampus,
              ocupedArea: espacio.ocupedArea,
              totalarea: espacio.totalArea,
              spaceData: espacio.spaceData,
              active: item[clave]

            };

            arr.push(space);
          }



        });


      }
    }

    return arr;
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


  filter(val: string): string[] {
    return this.edificios.filter(option =>
      option.toLowerCase().indexOf(val.toLowerCase()) === 0);
  }



  /* asigna la fila de la tabla a variables ngmodel */
  cambiardata(item) {

    this.formtrue = true;
    console.log(item);
    this.idsp = item.id_space;
    this.space.totalArea = item.totalarea;
    this.space.capacity = item.capacity;
    this.space.freeArea = item.freeArea;
    this.space.indxSa = item.indxSa;
    this.space.minArea = item.minArea;
    this.space.ocupedArea = item.ocupedArea;
    this.space.spaceData.building = item.spaceData.building;
    this.space.spaceData.floor = item.spaceData.floor;
    this.space.spaceData.place = item.spaceData.place;
    this.space.map = item.map;
    this.space.spaceData.descripcion = item.spaceData.descripcion;
    this.space.spaceData.ciudad = item.spaceData.ciudad;
    this.space.spaceData.direccion = item.spaceData.direccion;
    this.space.outcampus = item.outcampus;

    console.log('capacidad a', item.capacity);
    // optener datos un espacio especifico

    console.log('id del espacio', this.idsp);
    this.cargarImagen(this.space.map);
    this.listPracticeforSpace(this.idsp).then((ok: any) => {

      console.log(ok['data']);
      this.getActividadAct(ok['data']).then((datos: any) => {

        this.actividadAct = datos['data'];

        this.totalOcupacion(datos['data2']);
      });

    });

    this.obs.centerView('spacebox');

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
  setSpace(form) {


    swal({
      type: 'info',
      title: 'Confirmar',
      text: '¿Está seguro que desea guardar los cambios?',
      showConfirmButton: true,
      showCancelButton: true,

    }).then(val => {
      if (val.value) {


        if (this.space.spaceData.descripcion !== '') {

          this.space.outcampus = true;

        }

        this.alert.show();
        console.log('acepto guardar');
        this.space.spaceData.building =   this.myControl.value;
        const nuevoespacio = this.space;
        nuevoespacio.subHq = this.idsh;
        this.servicioMod2.addESpacio(nuevoespacio).then((data) => {

          // agrega el nuevo espacio al laboratorio actual
          this.servicioMod2.Trazability(
            this.user.uid, 'create', 'space', data.id, nuevoespacio).then(() => {
              this.updateFaciliti(data.id);
            });
          this.alert.hide();


          $('#modalespace').modal('hide');

          swal({
            type: 'success',
            title: 'Almacenado correctamente',
            text: 'Datos guardados correctamente.',
            showConfirmButton: true
          });
        });

      }


    });


  }

  actualizarEspacio() {


    this.space.spaceData.building = this.myControl.value;
    const nuevoespacio = {
      capacity: this.space.capacity,
      freeArea: this.space.freeArea,
      map: this.space.capacity,
      minArea: this.space.minArea,
      ocupedArea: this.space.ocupedArea,
      totalArea: this.space.totalArea,
      spaceData: {
        building: this.space.spaceData.building,
        place: this.space.spaceData.place,
        floor: this.space.spaceData.floor
      },
      updatedAt: new Date().toISOString()
    };

    const nuevoEstado = {
      relatedSpaces: {}
    };
    // asigna el estado editado al espacio dentro del lab
    nuevoEstado.relatedSpaces[this.idsp] = this.space.active;

    this.servicioMod2.Trazability(
      this.user.uid, 'update', 'space', this.idsp, nuevoespacio).then(() => {
        this.servicioMod2.setEspacio(this.idsp, nuevoespacio).then(() => {
          this.alert.show();

          // actualiza el estado del espacio dentro del laboratorio
          this.servicioMod2.Trazability(
            this.user.uid, 'update', 'cfFacil', this.idlab, nuevoEstado
          ).then(() => {

            this.servicioMod2.setDocLaboratorio(this.idlab, nuevoEstado);


            this.alert.hide();

            swal({
              type: 'success',
              title: 'Actualizado Correctamente',
              showConfirmButton: true,
              timer: 1000
            }).then(result => {



              this.initDataComponent();


            });
          });


        });
      });


    console.log(nuevoespacio);
  }


  listSubHq() {

    this.space.headquarter = this.laboratorio.headquarter;
    this.spServ.listSubHq(this.laboratorio.headquarter).subscribe(res => {
      this.subsedes = res;

    });

  }

  // lista todas las sedes de la plataforma
  listHq() {

    this.spServ.listHq().subscribe((res) => {
      this.sedes = res;
      console.log('sedes', res);
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
        left: 'title',
        center: '',
        right: 'today prev,next'
      },
      events: horario,

      defaultView: 'month',

    });

    containerEl.fullCalendar('gotoDate', horario[0].start);
  }
  // actualiza el laboratorio con una nueva referencia de espacio
  updateFaciliti(idSp) {

    if (idSp) {
      const relatedSpaces = {};
      relatedSpaces[idSp] = true;


      this.servicioMod2.Trazability(
        this.user.uid, 'update', 'cfFacil', this.idlab, { relatedSpaces }
      ).then(() => {

        this.servicioMod2.setDocLaboratorio(this.idlab, { relatedSpaces })
          .then(() => {


            this.alert.hide();


            swal({
              type: 'success',
              title: 'Espacio vinculado con éxito',
              timer: 1500,
              showConfirmButton: true
            });


            $('#modalespace').modal('hide');
            this.idnewSp = '';


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
    const array = [];
    let cont = 1;
    console.log(idSpace, this.espaestructurado.practicas);
    // traer array con todas las referencias de practicas con el espacio relacionado
    return new Promise((resolve, reject) => {
      this.espaestructurado.practicas.forEach(element => {
        console.log('element array', element);
        if (element.programacion.spaceid === idSpace) {
          array.push(element);
        }
        console.log(cont, this.espaestructurado.practicas.length);
        if (cont === this.espaestructurado.practicas.length) {
          resolve({ data: array });
        } else {
          cont++;
        }
      });

    });



  }

  getPrgramming(id) {

    console.log('id de la practica', id);
    this.horarios = [];
    // this.noEsPrac = [];
    const array = [];
    return this.servicioMod2.buscarProgramacion(id).then(data => {
      let conta = 1;
      data.forEach(onSnapshop => {

        const Pr = onSnapshop.data();

        console.log(Pr.noStudents);

        const practicaH = {

          numeroEs: Pr.noStudents,
          horario: Pr.schedule,
          id
        };
        //  crear un array de objetos numero de estudiantes y practicas
        array.push(practicaH);
        // crea un array con los horarios de la practica
        Pr.schedule.forEach(element => {

          this.horarios.push(element);
        });

        if (conta === data.size) {
          return array;
        } else {
          conta++;
        }

      });

      //  crear un array de objetos numero de estudiantes y practicas
      // this.noEsPrac.push(practica);
      // prog['schedule'].forEach(element => {
      //   this.horarios.push(element);
      // });

    }).catch(e => console.log('ocurrio un err', e));




  }

  // valida si ya existe un espacio para que pueda ser vinculado
  spaceCheck( espacio ) {
    this.idnewSp = '';


   console.log(espacio);
     const edificio = this.myControl.value;

     console.log(edificio);
    if ( espacio.trim() === '') {
      this.status = 'Campo obligatorio';
       this.dispo = false;
     } else {
      this.status = 'Buscando espacio ...';
       this.servicioMod2.getEspaceForBuildAndPlace( edificio, espacio ).then((snapShot) => {
       if (snapShot.empty) {
         this.status = 'Espacio no encontrado';
         this.dispo = true;
       } else {
          console.log(snapShot.docs[0].id);
         this.status = 'Ya existe el espacio, si desea vincularlo al laboratorio presione el botón vincular.';
         this.dispo = false;
         this.idnewSp = snapShot.docs[0].id;
       }
    });
    }
  }

  getIdSubHq(item) {


    const sede =  JSON.parse(item);
    this.fcu = false;
    this.otraSede = false;

     this.idsh = sede.id;

       switch (sede.cfAddrline2) {


        case 'Fuera del campus universitario': {

          this.fcu = true;
          break;
        }

        default : {

          console.log(sede.id);
          this.servicioMod2.getEdificiosBySede(sede.id)
          .then( res =>  {

            console.log(res.data());

            this.edificios = res.data().edificios;

          });

          break;
        }

      }

    }




  setEdificio() {

    this.space.spaceData.building =   this.myControl.value;

    console.log(this.myControl.value);
  }

  /* setea campos del objeto */
  clearObj() {
    this.dispo = false;
    this.space.totalArea = 0;
    this.space.active = true;
    this.space.capacity = 0;
    this.space.freeArea = 0;
    this.space.indxSa = 0;
    this.space.minArea = 0;
    this.space.ocupedArea = 0;
    this.space.spaceData.building = '';
    this.space.spaceData.floor = '';
    this.space.spaceData.place = 0;
  }


  cerrarModal(modal) {
    $('#' + modal).modal('hide');
  }

  // obtiene el total de personas dentro de un laboratorio
  getTotalLab() {
    console.log('obtiene total del laboratorio');

    return new Promise((resolve, reject) => {
      let pers;
      let cont = 0;
      let personalLab;
      this.servicioMod2.buscarLab(this.idlab)
        .then((res) => {
          pers = res.data().relatedPers;

          for (const key in pers) {
            if (pers.hasOwnProperty(key)) {
              const element = pers[key];

              // valida si es personal activo
              if (element) {
                cont++;
              }

            }
          }
          personalLab = cont;

          // devuelve la cantidad de personas en el laboratorio actual
          resolve(personalLab);

        }).catch(err => console.log('ocurrio un error', err));
    });

  }



  totalOcupacion(estudiantesPract) {
    console.log(estudiantesPract, this.espaestructurado.personal);
    const personalLab = this.espaestructurado.personal;
    this.ocupacionAct = (personalLab ? personalLab : 0) + (estudiantesPract ? estudiantesPract : 0);
    // tslint:disable-next-line:radix

    if (this.space.capacity === 0) {

      console.log(' capacidad igual a cero');

      this.space.indxSa = 0;

    } if (this.space.capacity > 0) {

      console.log(' capacidad mayor a cero');
      this.space.indxSa = (this.ocupacionAct / this.space.capacity);

    }
  }

  getActividadAct(arreglo) {

    console.log('si entro al metodo act actual');
    return new Promise((resolve, reject) => {

      this.actSpaces = [];
      let estudiantes = 0;
      let cont = 1;
      let encontrado = false;
      console.log('array para la consulta', arreglo);

      arreglo.forEach(prog => {

        encontrado = false;

        prog.programacion.diahora.forEach(fecha => {

          const now = moment().format();
          if (moment(now).isBetween(fecha.start, fecha.end)) {

            console.log('entro a la condicion actual');
            encontrado = true;

          }
        });

        if (encontrado) {
          this.actSpaces.push(prog.nombre);

          estudiantes += parseInt(prog.programacion.estudiantes, 10);
        }

        if (cont === arreglo.length) {
          console.log(this.actSpaces);
          resolve({ data: this.actSpaces, data2: estudiantes });
        } else {
          cont++;
        }


      });

    });


  }

  contarPersonal(item) {

    let cont = 0;
    for (const key in item) {
      if (item.hasOwnProperty(key)) {
        if (item[key]) {
          cont++;
        }
      }

    }
    return cont;
  }




  refreshContent() {
    this.router.navigateByUrl('/principal', { skipLocationChange: true })
      .then(() => this.router.navigate(['/principal/adminespacios']));
  }







}
