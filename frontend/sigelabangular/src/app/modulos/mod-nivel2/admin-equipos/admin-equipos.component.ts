import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ObservablesService } from '../../../shared/services/observables.service';

import swal from 'sweetalert2';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { AngularFirestore } from 'angularfire2/firestore';
import { Http } from '@angular/http';
// tslint:disable-next-line:import-blacklist
import { Subscription } from 'rxjs';

import 'fullcalendar';
import 'fullcalendar-scheduler';
import * as $AB from 'jquery';
import { Modulo2Service } from '../services/modulo2.service';
import { ENGINE_METHOD_DIGESTS } from 'constants';
import { SabsService } from '../../../shared/services/sabs/sabs.service';

declare var $: any;


@Component({
  selector: 'app-admin-equipos',
  templateUrl: './admin-equipos.component.html',
  styleUrls: ['./admin-equipos.component.css']
})
export class AdminEquiposComponent implements OnInit, AfterViewInit, OnDestroy {



  // INICIALIZACION DATATABLE PRUEBAS
  displayedColumnsEquip = ['nombre'];
  dataSourceEquip = new MatTableDataSource([]);
  @ViewChild('paginatorEquip') paginatorEquip: MatPaginator;
  @ViewChild('sortEquip') sortEquip: MatSort;

  // INICIALIZACION DATATABLE COMPONENTES
  displayedColumnsComponentes = ['nombre'];
  dataSourceComponentes = new MatTableDataSource([]);
  @ViewChild('paginatorComponentes') paginatorComponentes: MatPaginator;
  @ViewChild('sortComponentes') sortComponentes: MatSort;

  // INICIALIZACION DATATABLE SERVICIOS
  displayedColumnsServicios = ['nombre'];
  dataSourceServicios = new MatTableDataSource([]);
  @ViewChild('paginatorServicios') paginatorServicios: MatPaginator;
  @ViewChild('sortServicios') sortServicios: MatSort;

  // INICIALIZACION DATATABLE PRACTICAS
  displayedColumnsPracticas = ['nombre'];
  dataSourcePracticas = new MatTableDataSource([]);
  @ViewChild('paginatorPracticas') paginatorPracticas: MatPaginator;
  @ViewChild('sortPracticas') sortPracticas: MatSort;



  equiposel: any;
  tablesel: any;
  seleccionado: any;
  itemsel: Observable<Array<any>>;

  equiestructurado: any;
  infosabs = [];
  infosabsel: any;
  response: any;

  iconos = {
    info: false,
    componente: false,
    practica: false,
    servicio: false,
    sabs: false,
    sabsCompo: false
  };

  modelEquipoSel = {
    cfName: '',
    price: '',
    cfDescr: '',
    model: '',
    updatedAt: new Date().toISOString()
  };

  ventana = false;

  sus: Subscription;

  rol: any;
  moduloNivel2 = false;

  infosabsCompo: any;

  constructor(private obs: ObservablesService, private http: Http,
    private servicioMod2: Modulo2Service, private servicioSabs: SabsService) {

  }


  ngOnInit() {
    // abre loading mientras se cargan los datos
    this.ventana = true;

    $('html, body').animate({ scrollTop: '0px' }, 'slow');

    this.sus = this.obs.currentObjectequip.subscribe(data => {

      this.getRoles(data.roles);
      console.log(data);
      this.equiestructurado = undefined;
      this.iniciliazarTablas();

      if (data.length !== 0) {
        swal({
          title: 'Cargando un momento...',
          text: 'espere mientras se cargan los datos',
          onOpen: () => {
            swal.showLoading();
          }
        });
        if (!this.equiestructurado) {
          this.servicioMod2.buscarLab(data.uid).then(doc => {
            this.estructurarEquip(data.uid, doc.data()).then(() => {
              this.itemsel = Observable.of(this.equiestructurado.equipos);

              this.dataSourceEquip.data = this.equiestructurado.equipos;


              setTimeout(() => {
                if (this.equiestructurado.equipos !== 0) {
                  this.dataSourceEquip.sort = this.sortEquip;
                  this.dataSourceEquip.paginator = this.paginatorEquip;
                  // cierra loading luego de cargados los datos
                  swal.close();
                } else {
                  swal({
                    type: 'error',
                    title: 'No existen equipos asociados al laboratorio',
                    showConfirmButton: true
                  });
                }

              }, 1500);

            });
          });

        }

      } else {
        swal.close();
        swal({
          type: 'error',
          title: 'No se ha seleccionado ningún laboratorio',
          showConfirmButton: true
        });
      }

    });
  }


  ngAfterViewInit(): void {

  }

  ngOnDestroy() {
    this.sus.unsubscribe();
  }

  // METODO QUE ME TRAE EL ROL DE ACCESSO A NIVEL 2
  getRoles(rol) {
    this.moduloNivel2 = false;
    for (const clave in rol) {
      if (rol[clave]) {
        if ((clave === 'moduloNivel2')) {
          this.moduloNivel2 = true;
        }
      }
    }
  }

  estructurarEquip(key, objeto) {

    this.equiestructurado = {};
    const promise = new Promise((resolve, reject) => {

      let estadoLab;
      if (objeto.active === true) {
        estadoLab = 'Activo';
      } else if (objeto.active === false) {
        estadoLab = 'Inactivo';
      }

      this.equiestructurado = {
        uid: key,
        nombre: objeto.cfName,
        equipos: this.estructurarEquipos(objeto.relatedEquipments),
        estado: estadoLab
      };

      resolve();
    });

    return promise;

  }

  // METODO QUE ESTRUCTURA LA DATA DE LOS SERVICIOS EN LA VISTA BUSQUEDA DE LABORATORIOS

  // RECIBE EL NODO DE LABORATORIO QUE CONTIENE LOS SERVICIOS ASOCIADOS
  estructurarServicios(item) {

    const arr = [];
    const arr2 = [];

    for (const clave in item) {
      // Controlando que json realmente tenga esa propiedad
      if (item.hasOwnProperty(clave)) {

        if (item[clave]) {
          this.servicioMod2.buscarServicio(clave).then(data => {
            const servicio = data.data();

            this.servicioMod2.getSolicitudesServiciosForId(clave).then(dataSol => {

              const serv = {
                nombre: servicio.cfName,
                descripcion: servicio.cfDesc,
                precio: servicio.cfPrice,
                activo: servicio.active,
                variaciones: this.variations(clave),
                uid: data.id
              };
              arr.push(serv);

              dataSol.forEach(doc => {
                this.servicioMod2.buscarUsuario(doc.data().user).then(usuario => {
                  const solicitud = {
                    nombreServ: servicio.cfName,
                    descripcionServ: servicio.cfDesc,
                    precioServ: servicio.cfPrice,
                    activoServ: servicio.active,
                    email: usuario.data().email,
                    uidServ: doc.id,
                    estado: doc.data().status
                  };

                  arr2.push(solicitud);
                });
              });

            });

          });
        }

      }
    }

    return { arr, arr2 };
  }

  // METODO QUE ESTRUCTURA LA DATA DE LAS PRACTICAS EN LA VISTA BUSQUEDA DE LABORATORIOS
  // RECIBE EL NODO DE LABORATORIO QUE CONTIENE LAS PRACTICAS ASOCIADOS
  estructurarPracticas(item) {

    const arr = [];

    this.servicioMod2.getPracticesForIdEquipo(item).then(data => {
      data.forEach(doc => {
        const practica = doc.data();
        this.servicioMod2.buscarProgramacion(doc.id).then(data2 => {

          data2.forEach(progdoc => {

            const prog = progdoc.data();

            if (prog) {
              const pract = {
                nombre: practica.practiceName,
                programacion: {
                  id_pro: progdoc.id,
                  estudiantes: prog.noStudents,
                  horario: prog.schedule,
                  semestre: prog.semester
                },
                activo: practica.active
              };

              arr.push(pract);
            }
          });

        });
      });
    });

    return arr;
  }



  // METODO QUE ESTRUCTURA LA DATA DE LAS PRACTICAS EN LA VISTA BUSQUEDA DE LABORATORIOS
  // RECIBE EL NODO DE LABORATORIO QUE CONTIENE LAS PRACTICAS ASOCIADOS
  estructurarEquipos(item) {

    const arr = [];
    let cont = 0;
    for (const clave in item) {
      // Controlando que json realmente tenga esa propiedad
      if (item.hasOwnProperty(clave)) {

        if (item[clave]) {
          this.servicioMod2.buscarEquipo(clave).then(doc => {
            const equip = doc.data();
            console.log(equip);
            // funciona con una programacion, cuando hayan mas toca crear otro metodo
            const equipo = {
              id: doc.id,
              nombre: equip.cfName,
              descripcion: equip.cfDescr,
              modelo: equip.model,
              activo: equip.active,
              precio: equip.price,
              inventario: equip.inventory,
              componentes: this.estructurarComponents(clave),
              servicios: this.estructurarServicios(equip.relatedSrv).arr,
              practicas: this.estructurarPracticas(doc.id)
            };

            arr.push(equipo);

            cont++;
            this.consultarSabs(equip.inventory).then(data => {
              this.infosabs.push(data);
              swal.close();
            }).catch((error) => {
              console.log(cont, Object.keys(item).length);
              if (cont === Object.keys(item).length) {
                swal.close();
                swal({
                  type: 'error',
                  title: 'No se pudo conectar con SABS',
                  showConfirmButton: true
                });
                cont--;
              }
            });

          });
        }
      }
    }

    return arr;
  }

  // METODO QUE TRAE LOS DATOS EXISTENTES EN SABS
  consultarSabs(item) {

    this.infosabs = [];
    const promise = new Promise((resolve, reject) => {

      if (this.ventana) {
        this.servicioSabs.buscarEquip(item).then(
          dataEquip => {
            console.log('Consulta Equip en SABS: ', dataEquip);
            resolve(dataEquip);
          }
        ).catch(error => {
          reject();
          console.log('Error al consultar Equip en SABS: ', error);
        });
      }


    });


    return promise;
  }

  // METODO QUE ESTRUCTURA LA DATA DE LOS COMPONENTES EN LA VISTA BUSQUEDA DE LABORATORIOS
  // RECIBE EL NODO DE LABORATORIO QUE CONTIENE LAS PRACTICAS ASOCIADOS
  estructurarComponents(item) {
    const arr = [];

    this.servicioMod2.buscarComponente(item).then(data => {
      data.forEach(doc => {
        const element = doc.data();

        const componente = {
          id: doc.id,
          nombre: element.cfName,
          descripcion: element.cfDescription,
          precio: element.cfPrice,
          marca: element.brand,
          modelo: element.model,
          estado: element.estado,
          inventario: element.inventory
        };

        arr.push(componente);
      });

    });

    return arr;
  }



  // METODO QUE ESTRUCTURA LAS VARIACIONES DE UN SERVICIO
  variations(clave) {
    const variaciones = [];
    this.servicioMod2.getVariaciones(clave).then(data => {
      if (data) {
        data.forEach(doc => {
          variaciones.push(doc.data());
        });

      } else {
        return variaciones;
      }

    });
    return variaciones;
  }


  cambiarDataEquipo(item, index) {
    console.log(item);
    console.log(index);
    const ambiente = this;
    this.equiposel = item;


    console.log(this.infosabs);
    this.infosabsel = this.infosabs[index];

    this.modelEquipoSel.cfName = this.equiposel.nombre;
    this.modelEquipoSel.price = this.equiposel.precio;
    this.modelEquipoSel.cfDescr = this.equiposel.descripcion;
    this.modelEquipoSel.model = this.equiposel.modelo;


    this.dataSourceComponentes.data = item.componentes;
    this.dataSourceServicios.data = item.servicios;
    this.dataSourcePracticas.data = item.practicas;


    setTimeout(function () {
      ambiente.dataSourceComponentes.sort = ambiente.sortComponentes;
      ambiente.dataSourceComponentes.paginator = ambiente.paginatorComponentes;

      ambiente.dataSourceServicios.sort = ambiente.sortServicios;
      ambiente.dataSourceServicios.paginator = ambiente.paginatorServicios;

      ambiente.dataSourcePracticas.sort = ambiente.sortPracticas;
      ambiente.dataSourcePracticas.paginator = ambiente.paginatorPracticas;
    }, 1000);


  }

  editarEquipo() {
    swal({
      title: 'Cargando un momento...',
      text: 'espere por favor',
      onOpen: () => {
        swal.showLoading();
      }
    });
    const user = this.servicioMod2.getLocalStorageUser();
    this.servicioMod2.Trazability(
      user.uid, 'update', 'cfEquip', this.equiposel.id, this.modelEquipoSel).then(() => {

        this.servicioMod2.updateEquip(this.equiposel.id, this.modelEquipoSel).then(() => {
          swal.close();
          swal({
            type: 'success',
            title: 'Éxito',
            showConfirmButton: true
          }).then(() => {
            this.cerrarModal('modal2');
          });
        });
      });

  }

  iniciliazarTablas() {
    this.equiposel = undefined;
    this.dataSourceComponentes.data = [];
    this.dataSourcePracticas.data = [];
    this.dataSourceServicios.data = [];

    this.iconos.componente = false;
    this.iconos.info = false;
    this.iconos.practica = false;
    this.iconos.sabs = false;
    this.iconos.servicio = false;
  }

  cambiarInfoModal(row, table) {
    this.tablesel = table;
    this.seleccionado = row;
    if (table === 'practicas') {
      this.initCalendarModal(this.seleccionado.programacion.horario);
    } else {

      this.servicioSabs.buscarEquip(this.seleccionado.inventario).then(res => {
        this.infosabsCompo = res;
      }).catch(error => {
        swal({
          type: 'error',
          title: 'No se pudo conectar con SABS',
          showConfirmButton: true
        });
      });
    }



  }


  applyFilterEquip(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSourceEquip.filter = filterValue;
  }

  applyFilterComponentes(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSourceComponentes.filter = filterValue;
  }

  applyFilterPracticas(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSourcePracticas.filter = filterValue;
  }

  applyFilterServicios(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSourceServicios.filter = filterValue;
  }

  initCalendarModal(horario) {

    const containerEl: JQuery = $AB('#calendar2');

    if (containerEl.children().length > 0) {

      containerEl.fullCalendar('destroy');
    }

    containerEl.fullCalendar({
      // licencia
      schedulerLicenseKey: 'GPL-My-Project-Is-Open-Source',
      // options here
      height: 450,
      header: {
        left: 'month,agendaWeek,agendaDay',
        center: 'title',
        right: 'today prev,next'
      },
      events: horario,

      defaultView: 'month',
      timeFormat: 'H(:mm)'

    });
  }


  cambiarIcono(box) {
    if (!this.iconos[box]) {
      this.iconos[box] = true;
    } else {
      this.iconos[box] = false;
    }
  }


  cerrarModal(modal) {
    $('#' + modal).modal('hide');
  }



}


