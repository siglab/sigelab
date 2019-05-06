import { Observable } from 'rxjs/Observable';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ObservablesService } from '../../../shared/services/observables.service';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import swal from 'sweetalert2';

import * as _ from 'lodash';
import * as firebase from 'firebase/app';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireStorage } from 'angularfire2/storage';

import { URLAPI } from '../../../config';
import { Http } from '@angular/http';
import { ServicesNivel3Service } from '../services/services-nivel3.service';
import { SabsService } from '../../../shared/services/sabs/sabs.service';

declare var $: any;
@Component({
  selector: 'app-solicitudes-nivel3',
  templateUrl: './solicitudes-nivel3.component.html',
  styleUrls: ['./solicitudes-nivel3.component.css']
})
export class SolicitudesNivel3Component implements OnInit {

  itemsel: any;

  datos: any;
  histodatos: any;

  displayedColumns = ['id', 'nombre', 'fecha', 'tipo', 'estado'];
  displayedColumns2 = ['id', 'nombre', 'fecha', 'laboratorio', 'estado'];

  dataSource = new MatTableDataSource([]);
  dataSource2 = new MatTableDataSource([]);

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('sort') sort: MatSort;

  @ViewChild('paginator2') paginator2: MatPaginator;
  @ViewChild('sort2') sort2: MatSort;

  // equipos
  displayedColumnsEquip = ['select', 'nombre'];
  dataSourceEquip = new MatTableDataSource([]);
  @ViewChild('paginatorEquip') paginatorEquip: MatPaginator;
  @ViewChild('sortEquip') sortEquip: MatSort;

  // componentes
  displayedColumnsComp = ['select', 'nombre'];
  dataSourceComp = new MatTableDataSource([]);
  @ViewChild('paginatorComp') paginatorComp: MatPaginator;
  @ViewChild('sortComp') sortComp: MatSort;

  selection = new SelectionModel(true, []);
  selection2 = new SelectionModel(true, []);


  solsel: any;

  reserMan = {
    cfOrgUnit: '',
    headquarter: '',
    cfFacil: '',
    createdBy: '',
    requestDesc: '',
    requestType: 'mantenimiento',
    maintenanceType: '',
    providersInfo: [],
    relatedEquipments: '',
    relatedComponents: {},
    status: 'pendiente',
    active: true,
    createdAt: '',
    updatedAt: '',
    path: []
  };

  proovedor = {
    name: '',
    contactNumbers: [],
    attachments: {}
  };

  telproov = {
    tel1: '',
    tel2: ''
  };

  iconosModal = {
    servicio: false,
    variacion: false,
    equipos: false,
    componentes: false,
    panico: false
  };

  panico = {
    nombre: '',
    descripcion: ''
  };


  user: any;

  listaArchivos = [];
  files = [];
  filePath: any;
  ref: any;

  selectedFiles: FileList;
  currentUpload: Upload;
  private basePath = '/cotizaciones';

  rol: any;
  moduloNivel2 = false;
  moduloSolicitudes = false;

  solicitudesCoin = [];
  solicitudesEjecu = 0;
  montoSolicitudes = 0;

  infosabs: any;
  viewsabs = false;

  response: any;

  comentario = '';
  costo = '';

  role: any;
  moduloNivel3 = false;
  moduloNivel25 = false;

  persona: any;
  faculty: any;

  constructor(private serviceMod3: ServicesNivel3Service, private storage: AngularFireStorage, 
    private http: Http, private servicioSabs: SabsService) {
  }

  ngOnInit() {

    $('html, body').animate({ scrollTop: '0px' }, 'slow');

    this.getRoles();

    if (sessionStorage.getItem('usuario')) {
      this.user = JSON.parse(sessionStorage.getItem('usuario'));
    }

    if (sessionStorage.getItem('persona')) {
      this.persona = JSON.parse(sessionStorage.getItem('persona'));
    }

    this.alertaCargando();

    if (this.moduloNivel3) {
      this.serviceMod3.getCollectionSolicitudes().then(data1 => {
        if (data1.size !== 0) {
          this.itemsel = data1;
          this.estructurarSolicitudesActivas(data1).then(datos => {

            this.dataSource.data = datos['data'];
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;

            this.dataSource2.data = datos['data2'];
            this.dataSource2.sort = this.sort2;
            this.dataSource2.paginator = this.paginator2;

            this.cerrarAlerta();
          });
        } else {
          this.alertaError('No se han generado solicitudes de mantenimiento aún');
        }


      });
    }

    if (this.moduloNivel25) {
      this.getFaculty().then(retor => {
        let cont = 1;
        const array = [];
        for (const key in this.faculty) {
          if (this.faculty.hasOwnProperty(key)) {
            this.serviceMod3.getCollectionSolicitudesFacultad(key).then(data1 => {
              data1.forEach(doc => {
                array.push(doc);
              });

              console.log(retor['size'], cont);
              if (retor['size'] === cont) {
                this.itemsel = array;
                if (array.length !== 0) {
                  this.estructurarSolicitudesActivas(array).then(datos => {

                    this.dataSource.data = datos['data'];
                    this.dataSource.sort = this.sort;
                    this.dataSource.paginator = this.paginator;

                    this.dataSource2.data = datos['data2'];
                    this.dataSource2.sort = this.sort2;
                    this.dataSource2.paginator = this.paginator2;

                    this.cerrarAlerta();
                  });
                } else {
                  this.alertaError('No se han generado solicitudes de mantenimiento aún');
                }

              } else {
                cont++;
              }


            });

          }
        }

      });

    }



  }

  // METODOS PARA SUBIR UNA COTIZACION

  cambiarEstadoSolicitud(estado) {
    this.alertaCargando();
    const obj = {
      acceptedBy: this.user.email,
      updatedAt: new Date().toISOString(),
      status: '',
      path: this.solsel.path
    };

    if (estado === 'rechazado') {
      obj['comment'] = this.comentario;
      obj.status = 'rechazada';

      this.serviceMod3.updateSolicitudMantenimiento(this.solsel.uidsol, obj).then(() => {
        this.alertaExito('Solicitud Rechazada');
        this.solsel.status = 'rechazada';
        $('#modal2').modal('hide');
      });
    } else if (estado === 'aceptada') {
      obj.status = 'aceptada';
      obj['dateAccepted'] = new Date().toISOString();
      this.serviceMod3.updateSolicitudMantenimiento(this.solsel.uidsol, obj).then(() => {
        this.alertaExito('Solicitud Aceptada');
        this.solsel.status = 'aceptada';
      });
    } else {
      obj.status = 'realizada';
      obj['costo'] = this.costo;
      const upload = this.uploadMulti();
      for (let i = 0; i < upload.length; i++) {
        obj.path.push(upload[i]);
      }

      this.serviceMod3.updateSolicitudMantenimiento(this.solsel.uidsol, obj).then(() => {
        this.alertaExito('Solicitud Concluida');
        this.solsel.status = 'realizada';

        $('#modal1').modal('hide');
      });
    }


    this.serviceMod3.Trazability(
      this.user.uid, 'update', 'request', this.solsel.uidsol, obj
    );


  }


  alistarVariables(event) {

    let tamano = false;
    for (let i = 0; i < event.target.files.length; i++) {

      if (event.target.files[i].size >= 33554432) {
        tamano = true;
        break;
      }
    }

    if (tamano) {
      swal(
        'Uno o mÁs archivos tienen más peso del límite permitido (32 Mgb)',
        '',
        'error'
      );
    } else {
      for (let i = 0; i < event.target.files.length; i++) {
        this.listaArchivos.push(event.target.files[i]);
      }

    }

  }


  uploadMulti() {
    const filespath = [];

    const files = this.listaArchivos;
    const filesIndex = _.range(files.length);
    _.each(filesIndex, (idx) => {
      this.currentUpload = new Upload(files[idx]);
      this.uploadFile(this.currentUpload);

      filespath.push('cotizaciones/' + this.currentUpload.file.name);
    });

    return filespath;
  }

  uploadFile(upload: Upload) {

    const storageRef = firebase.storage().ref();
    const uploadTask = storageRef.child(`${this.basePath}/${upload.file.name}`).put(upload.file);

    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot) => {
        // upload in progress
        upload.progress = (snapshot['bytesTransferred'] / snapshot['totalBytes']) * 100;
      },
      (error) => {
        // upload failed
        return false;
      },
      () => {
        // upload success
        return true;
      }
    );
  }

  // TABLA EQUIPOS PERTENECIENTES AL LABORATORIO
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

  // TABLA EQUIPOS PERTENECIENTES AL LABORATORIO
  isAllSelected2() {
    const numSelected = this.selection2.selected.length;
    const numRows = this.displayedColumnsComp.length;
    return numSelected === numRows;

  }
  masterToggle2() {
    this.isAllSelected() ?
      this.selection2.clear() :
      this.dataSourceComp.data.forEach(row => this.selection2.select(row));
  }




  estructurarSolicitudesActivas(data) {
    this.datos = [];
    let size = data.size;
    if (data.length) {
      size = data.length;
    }
    const promise = new Promise((resolve, reject) => {
      const activo = [];

      const historial = [];

      data.forEach(element => {

        const elemento = element.data();
        console.log(elemento);
        this.serviceMod3.getLaboratorio(elemento.cfFacil).then(lab => {
          this.serviceMod3.consultarNotificaciones(elemento.createdBy).then(email => {
            const Solicitud = {
              uidsol: element.id,
              uidlab: elemento.cfFacil,
              uidespacio: elemento.headquarter,
              nombrelab: lab.data().cfName,
              status: elemento.status,
              tipo: elemento.maintenanceType,
              descripcion: elemento.requestDesc,
              usuario: email.data().email,
              activo: elemento.active,
              idEquipo: elemento.relatedEquipments,
              componentes: this.estructurarComponenteId(elemento.relatedEquipments, elemento.relatedComponents),
              fecha: elemento.createdAt.split('T')[0],
              editado: elemento.updatedAt.split('T')[0],
              proveedores: elemento.providersInfo,
              path: elemento.path,
              costo: elemento.costo,
              acepto: elemento.dateAccepted ? elemento.dateAccepted.split('T')[0] : 'sin aceptar'
            };
            if (elemento.comment) {
              Solicitud['comment'] = elemento.comment;
            }
            if (elemento.relatedEquipments !== '') {
              this.serviceMod3.getEquipo(elemento.relatedEquipments).then(equipo => {
                Solicitud['equipo'] = equipo.data();
                Solicitud['nombreEquip'] = equipo.data().cfName;
              });
            } else {
              Solicitud['equipo'] = {};
              Solicitud['nombreEquip'] = 'no especificado';
              Solicitud['panicoequipo'] = elemento.panicoequipo;
              Solicitud['panicodescripcion'] = elemento.panicodescripcion;

            }
            if (elemento.status === 'pendiente' || elemento.status === 'aceptada') {
              activo.push(Solicitud);
            } else {
              historial.push(Solicitud);
            }

            this.datos.push(Solicitud);

            console.log(size, activo.length + historial.length);
            if (size === (activo.length + historial.length)) {
              resolve({ data: activo, data2: historial });
            }

          });
        });
      });


    });


    return promise;
  }



  // METODO QUE ESTRUCTURA LA DATA DE LAS PRACTICAS EN LA VISTA BUSQUEDA DE LABORATORIOS
  // RECIBE EL NODO DE LABORATORIO QUE CONTIENE LAS PRACTICAS ASOCIADOS
  estructurarEquipos(item) {

    const arr = [];

    for (const clave in item) {
      // Controlando que json realmente tenga esa propiedad
      if (item.hasOwnProperty(clave)) {

        if (item[clave]) {
          this.serviceMod3.getEquipo(clave).then(data => {
            const equip = data.data();

            // funciona con una programacion, cuando hayan mas toca crear otro metodo
            const equipo = {
              id: data.id,
              nombre: equip.cfName,
              activo: equip.active,
              precio: equip.price,
              componentes: this.estructurarComponents(clave),
            };

            arr.push(equipo);
          });
        }

      }
    }

    return arr;
  }

  // METODO QUE ESTRUCTURA LA DATA DE LOS COMPONENTES EN LA VISTA BUSQUEDA DE LABORATORIOS
  // RECIBE EL NODO DE LABORATORIO QUE CONTIENE LAS PRACTICAS ASOCIADOS
  estructurarComponents(item) {
    const arr = [];

    this.serviceMod3.getcomponents(item).then(data => {

      data.forEach(doc => {
        const element = doc.data();

        const componente = {
          id: doc.id,
          nombre: element.cfName,
          descripcion: element.cfDescription,
          precio: element.cfPrice,
          marca: element.brand,
          modelo: element.model,
          estado: element.active
        };

        arr.push(componente);
      });

    });

    return arr;
  }

  // METODO QUE ESTRUCTURA LA DATA DE LOS COMPONENTES EN LA VISTA BUSQUEDA DE LABORATORIOS
  // RECIBE EL NODO DE LABORATORIO QUE CONTIENE LAS PRACTICAS ASOCIADOS
  estructurarComponenteId(item, componente) {
    const arr = [];

    for (const clave in componente) {
      // Controlando que json realmente tenga esa propiedad
      if (componente.hasOwnProperty(clave)) {

        if (componente[clave]) {
          this.serviceMod3.getComponenteForId(item, clave).then(data => {
            const element = data.data();

            const comp = {
              id: data.id,
              nombre: element.cfName,
              descripcion: element.cfDescription,
              precio: element.cfPrice,
              marca: element.brand,
              modelo: element.model,
              estado: element.active
            };

            arr.push(comp);
          });
        }

      }
    }

    return arr;
  }



  cambiarDataSolicitud(item) {
    this.solsel = item;
    const aux = this.buscarCoincidenciasSolicitudes(item);
    this.solicitudesCoin = aux.coin;
    this.solicitudesEjecu = aux.mane;
    this.montoSolicitudes = aux.monto;


    this.infosabs = undefined;
    this.viewsabs = false;
    if (item.idEquipo) {

      this.serviceMod3.getEquipo(item.idEquipo).then(data => {

        this.consultarSabs(data.data().inventory).then(() => {
          console.log('hecho');
          this.infosabs = this.response;
        }).catch((error) => {

          swal({
            type: 'error',
            title: 'No se pudo conectar con SABS',
            showConfirmButton: true
          });
          this.viewsabs = true;
          this.infosabs = undefined;

        });
      });
    }



  }

  // METODO QUE TRAE LOS DATOS EXISTENTES EN SABS
  consultarSabs(item) {

    const promise = new Promise((resolve, reject) => {

      this.servicioSabs.buscarEquip('05317500').then(
        dataEquip => {
          this.response = dataEquip.inventario;
          resolve();
          console.log('Consulta Equip en SABS: ', dataEquip);
        }
      ).catch(error => {
        reject();
        console.log('Error al consultar Equip en SABS: ', error);
      });


    });


    return promise;
  }

  getRoles() {

    this.role = JSON.parse(sessionStorage.getItem('rol'));
    for (const clave in this.role) {
      if (this.role[clave]) {
        if ((clave === 'moduloNivel3')) {
          this.moduloNivel3 = true;
        }

        if ((clave === 'moduloNivel25')) {
          this.moduloNivel25 = true;
        }
      }
    }
  }

  getFaculty() {
    let size = 0;
    const promise = new Promise((resolve, reject) => {
      this.serviceMod3.buscarDirector(this.persona.cfPers).then(doc => {
        this.faculty = doc.data().faculty;
        for (const key in this.faculty) {
          if (this.faculty.hasOwnProperty(key)) {

            size++;
          }
        }
        resolve({ size: size });
      });
    });
    return promise;
  }



  buscarCoincidenciasSolicitudes(item) {
    const coincidencias = [];
    let manejecutados = 0;
    let montosol = 0;
    const fechaActual = parseInt(new Date().toISOString().split('-')[0], 10) - 2;

    for (let i = 0; i < this.datos.length; i++) {


      if ((this.datos[i].idEquipo === item.idEquipo)) {
        coincidencias.push(this.datos[i]);
        if (this.datos[i].status === 'realizada') {
          const fecha = parseInt(this.datos[i].editado.split('-')[0], 10);

          if (fechaActual <= fecha) {
            manejecutados++;
            montosol += parseInt(this.datos[i].costo, 10);
          }
        }
      }
    }

    return { coin: coincidencias, mane: manejecutados, monto: montosol };
  }


  cambiarDataComponentes(item) {
    this.dataSourceComp = new MatTableDataSource(item.componentes);
  }

  descargarArchivo(index) {
    const ref = this.storage.ref(this.solsel.path[index]);
    ref.getDownloadURL().subscribe(data => {
      window.open(data);
    });
  }

  quitarArchivo(index) {

    this.listaArchivos.splice(index, 1);
    swal(
      'archivo retirado',
      '',
      'error'
    );
  }


  agregarProovedor() {
    this.proovedor.contactNumbers.push(this.telproov.tel1);
    this.proovedor.contactNumbers.push(this.telproov.tel2);
    this.reserMan.providersInfo.push(this.proovedor);
    this.inicializarProovedor();

    console.log(this.reserMan.providersInfo);
  }

  quitarProovedor(index) {
    this.reserMan.providersInfo.splice(index, 1);
  }


  inicializarProovedor() {
    this.proovedor = {
      name: '',
      contactNumbers: [],
      attachments: {}
    };

    this.telproov = {
      tel1: '',
      tel2: ''
    };
  }

  inicializarSolicitud() {

    this.reserMan = {
      cfOrgUnit: '',
      headquarter: '',
      cfFacil: '',
      createdBy: '',
      requestDesc: '',
      requestType: '',
      maintenanceType: '',
      providersInfo: [],
      relatedEquipments: '',
      relatedComponents: {},
      status: 'pendiente',
      active: true,
      createdAt: '',
      updatedAt: '',
      path: []
    };
  }

  alertaCargando() {
    swal({
      title: 'Cargando un momento...',
      text: 'Espere mientras se cargan los datos',
      onOpen: () => {
        swal.showLoading();
      }
    });
  }

  alertaExito(mensaje) {
    return swal({
      type: 'success',
      title: mensaje,
      showConfirmButton: true
    });
  }

  alertaError(mensaje) {
    swal({
      type: 'error',
      title: mensaje,
      showConfirmButton: true
    });
  }

  cerrarAlerta() {
    swal.close();
  }



  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  applyFilter2(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource2.filter = filterValue;
  }

  cambiarIconoModal(box) {
    if (!this.iconosModal[box]) {
      this.iconosModal[box] = true;
    } else {
      this.iconosModal[box] = false;
    }
  }

  cerrarModal(modal) {
    $('#' + modal).modal('hide');
  }

  inicializar() {
    this.solsel = undefined;
  }

  inicializarMante() {
    this.reserMan = {
      cfOrgUnit: '',
      headquarter: '',
      cfFacil: '',
      createdBy: '',
      requestDesc: '',
      requestType: 'mantenimiento',
      maintenanceType: '',
      providersInfo: [],
      relatedEquipments: '',
      relatedComponents: {},
      status: 'pendiente',
      active: true,
      createdAt: '',
      updatedAt: '',
      path: []
    };
  }

}


export class Upload {

  $key: string;
  file: File;
  name: string;
  url: string;
  progress: number;
  createdAt: Date = new Date();

  constructor(file: File) {
    this.file = file;
  }
}
