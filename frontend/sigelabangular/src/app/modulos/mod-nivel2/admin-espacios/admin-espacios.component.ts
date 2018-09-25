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
import { EspaciosService } from '../services/espacios.service';
import * as moment from 'moment';
declare var $: any;

@Component({
  selector: 'app-admin-espacios',
  templateUrl: './admin-espacios.component.html',
  styleUrls: ['./admin-espacios.component.css']
})
export class AdminEspaciosComponent implements OnInit, OnDestroy {
  plano: Observable<any>;
  activitySpaces = [];
  actividadAct = [];
  dispo;
  idnewSp;
  status;
  mensaje = false;
  ocupacionAct;
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
    freeArea: '',
    headquarter: 'Vp0lIaYQJ8RGSEBwckdi',
    subHq: '',
    indxSa: 0,
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
  displayedColumnsSpace = ['capacidad', 'arealibre', 'active', 'totalarea', 'spaceData.building', 'spaceData.place'];
  dataSourceSpace = new MatTableDataSource([]);

  @ViewChild('paginatorSpace') paginatorSpace: MatPaginator;
  @ViewChild('sortSpace') sortSpace: MatSort;

  espaestructurado: any;

  role: any;
  moduloNivel2 = false;

  constructor(private obs: ObservablesService,
    private afs: AngularFirestore,
    private storage: AngularFireStorage,
    private register: LoginService,
    private spServ: EspaciosService) {
  }


  // tslint:disable-next-line:max-line-length

  ngOnInit() {
    $('html, body').animate({ scrollTop: '0px' }, 'slow');

    const now = moment().format();
    console.log(now);
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
        if ((clave === 'moduloNivel2')) {
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
                    semestre: prog['semester'],
                    spaceid: prog['space']
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
              active: item[clave]

            };

            arr.push(space);
          }



        });


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

    console.log('capacidad a', item.capacity);
    // optener datos un espacio especifico

    this.cargarImagen(this.space.map);
    this.listPracticeforSpace(this.idsp).then((ok: any) => {

      console.log(ok);
      setTimeout(() => {
        ok.forEach(element => {

          this.getPrgramming(element).then(() => {

            this.totalOcupacion();
            this.getActividadAct().then(res => {

              console.log('array resultado', res);
            });

          });

        });
      }, 2000);
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

    if (!this.space.spaceData.building && !this.space.spaceData.building) {

      swal({
        type: 'info',
        title: 'Hay campos vacios importantes.',
        showConfirmButton: true
      });

    }
    const nuevoespacio = this.space;

    nuevoespacio.subHq = this.idsh;
    this.afs.collection('space').add(nuevoespacio).then((data) => {
      // agrega el nuevo espacio al laboratorio actual
      this.updateFaciliti(data.id);
    });
    console.log(nuevoespacio);



  }

  actualizarEspacio() {

    const nuevoespacio = {
      capacity: this.space.capacity,
      createdAt: '',
      freeArea: this.space.freeArea,
      headquarter: 'Vp0lIaYQJ8RGSEBwckdi',
      subHq: this.space.subHq,
      map: this.space.capacity,
      minArea: this.space.minArea,
      ocupedArea: this.space.ocupedArea,
      totalArea: this.space.totalArea,
      spaceData: {
        building: this.space.spaceData.building,
        place: this.space.spaceData.place,
        floor: this.space.spaceData.floor
      },
    };

    const nuevoEstado = {
      relatedSpaces: {}
    };
    // asigna el estado editado al espacio dentro del lab
    nuevoEstado.relatedSpaces[this.idsp] = this.space.active;

    this.afs.doc('space/' + this.idsp).set(nuevoespacio, { merge: true }).then(() => {

      // actualiza el estado del espacio dentro del laboratorio
      this.afs.doc('cfFacil/' + this.idlab).set(nuevoEstado, { merge: true });

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
    this.spServ.listSubHq(sede).subscribe(res => {

      this.subsedes = res;

      console.log('subsedes', res);

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

    console.log('id de la practica', id);
    this.horarios = [];
    this.noEsPrac = [];
    return this.afs.collection('practice/' + id + '/programmingData')
      .ref.get()
      .then(data => {
        data.forEach(onSnapshop => {

          const Pr = onSnapshop.data();

          console.log(Pr.noStudents);

          const practicaH = {

            numeroEs: Pr.noStudents,
            horario: Pr.schedule,
            id
          };
          //  crear un array de objetos numero de estudiantes y practicas
          this.noEsPrac.push(practicaH);
          // crea un array con los horarios de la practica
          Pr.schedule.forEach(element => {

            this.horarios.push(element);
          });

        });

        //  crear un array de objetos numero de estudiantes y practicas
        // this.noEsPrac.push(practica);
        // prog['schedule'].forEach(element => {
        //   this.horarios.push(element);
        // });

      }).catch(e => console.log('ocurrio un err', e));




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

  getIdSubHq(id) {
    console.log('llego este id', id);
    this.idsh = id;
  }

  /* setea campos del objeto */
  clearObj() {
    this.space.totalArea = '';
    this.space.capacity = 0;
    this.space.freeArea = '';
    this.space.indxSa = 0;
    this.space.minArea = '';
    this.space.ocupedArea = '';
    this.space.spaceData.building = '';
    this.space.spaceData.floor = '';
    this.space.spaceData.place = '';
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
      this.afs.doc('cfFacil/' + this.idlab)
        .ref.get()
        .then((res) => {
          pers = res.data().relatedPers;

          for (const key in pers) {
            if (pers.hasOwnProperty(key)) {
              const element = pers[key];

              console.log(element);
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


  getTotalEstPrac() {

    return new Promise((resolve, reject) => {
      const now = moment().format();
      console.log('momento actual', now);
      let estudiantesPractica = 0;
      // recorrer cada una de las programaciones del espacio
      this.noEsPrac.forEach(programing => {
        // recorrer cada uno de los horarios de las programming
        programing.horario.forEach(fecha => {
          console.log('fecha que llega al foreach', fecha);
          // si la fecha coincide con la actual acomular en el total de estudiantes
          if (moment(now).isBetween(fecha.start, fecha.end)) {

            console.log('todo correcto');
            // tslint:disable-next-line:radix
            estudiantesPractica += parseInt(programing.numeroEs);
          }
        });

      });

      // devuelve el total de estudiantes en el momento actual
      console.log('total de estudiantes en la practica', estudiantesPractica);
      resolve(estudiantesPractica);
    });
  }

  totalOcupacion() {

    this.getTotalLab().then((personalLab: number) => {

      console.log('personal actual en el laboratorio', personalLab);
      this.getTotalEstPrac().then((estudiantesPract: number) => {
        console.log('personal actual en la practica ', estudiantesPract);
        this.ocupacionAct = (personalLab ? personalLab : 0) + (estudiantesPract ? estudiantesPract : 0);
        // tslint:disable-next-line:radix
        this.space.indxSa = (this.ocupacionAct / this.space.capacity);

      });
    });
  }

  getActividadAct() {

    this.actividadAct = [];

     const actSpaces = [];

    // let encontrado = false;

    return new Promise((resolve, reject) => {

      console.log('array para la consulta', this.noEsPrac);

      this.noEsPrac.forEach(prog => {

        prog.horario.forEach(fecha => {

          const now = moment().format();

          if (moment(now).isBetween(fecha.start, fecha.end)) {

            // console.log(fecha.start);

            actSpaces.push(prog.id);

          }
        });
      });

      resolve( actSpaces);
    });


    // console.log( 'arreglo de practicas act', this.activitySpaces);

    /*
    this.afs.doc('practice/' + prog.id)
      .valueChanges()
      .subscribe(ok => {

        console.log('llego este id', prog.id);

        this.actividadAct.push(ok['practiceName']);
        console.log('resultado consulta', ok);

      });

      */
  }
}
