
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireStorage } from 'angularfire2/storage';
import { Observable } from 'rxjs/Observable';

import * as moment from 'moment';

import swal from 'sweetalert2';
import { Subscription } from 'rxjs';

import 'fullcalendar';
import 'fullcalendar-scheduler';

import * as $AB from 'jquery';

declare var $: any;

import { ActivatedRoute } from '@angular/router';
import { map, take, debounceTime } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators, AbstractControl, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { EspaciosService } from '../../mod-nivel2/services/espacios.service';
import { ServicesNivel3Service } from '../services/services-nivel3.service';

@Component({
  selector: 'app-admin-laboratorios-3',
  templateUrl: './admin-laboratorios-3.component.html',
  styleUrls: ['./admin-laboratorios-3.component.css']
})
export class AdminLaboratorios3Component implements OnInit {


  // VARIABLES DE LA VISTA ADMIN LABORATORIOS 3

  laboratoriosEstructurados = [];

  labo = {
    nombre: '',
    email: ''
  };


  idlab: any;

  persona: any;

  faculty: any;

  size = 0;

  actSpaces;

  // INICIALIZACION DATATABLE lABORATORIOS
  displayedColumns = ['nombre', 'correolab', 'ultima', 'director', 'estado', 'correodir'];
  dataSource = new MatTableDataSource([]);
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('sort') sort: MatSort;


  // VARIABLES DE LA VISTA ADMIN LABORATORIOS 2

  itemsel: Observable<Array<any>>;

  tablesel = '';

  seleccionado: any;

  // INICIALIZACION DATATABLE EQUIPOS
  displayedColumnsEquipos = ['nombre'];
  dataSourceEquipos = new MatTableDataSource([]);
  @ViewChild('paginatorEquipos') paginatorEquipos: MatPaginator;
  @ViewChild('sortEquipos') sortEquipos: MatSort;

  // INICIALIZACION DATATABLE PERSONAL
  displayedColumnsPersonal = ['nombre'];
  dataSourcePersonal = new MatTableDataSource([]);
  @ViewChild('paginatorPersonal') paginatorPersonal: MatPaginator;
  @ViewChild('sortPersonal') sortPersonal: MatSort;

  // INICIALIZACION DATATABLE SERVICIOS
  displayedColumnsServicios = ['nombre'];
  dataSourceServicios = new MatTableDataSource([]);
  @ViewChild('paginatorServicios') paginatorServicios: MatPaginator;
  @ViewChild('sortServicios') sortServicios: MatSort;

  // INICIALIZACION DATATABLE PROYECTOS
  displayedColumnsProyectos = ['nombre'];
  dataSourceProyectos = new MatTableDataSource([]);
  @ViewChild('paginatorProyectos') paginatorProyectos: MatPaginator;
  @ViewChild('sortProyectos') sortProyectos: MatSort;

  // INICIALIZACION DATATABLE EQUIPOS
  displayedColumnsPracticas = ['nombre'];
  dataSourcePracticas = new MatTableDataSource([]);
  @ViewChild('paginatorPracticas') paginatorPracticas: MatPaginator;
  @ViewChild('sortPracticas') sortPracticas: MatSort;

  // INICIALIZACION DATATABLE SOLICITUDES
  displayedColumnsSolicitudes = ['nombre', 'email'];
  dataSourceSolicitudes = new MatTableDataSource([]);
  @ViewChild('paginatorSolicitudes') paginatorSolicitudes: MatPaginator;
  @ViewChild('sortSolicitudes') sortSolicitudes: MatSort;


  user: any;

  labestructurado: any;

  infolab = {
    cfName: '',
    headquarter: '',
    subHq: '',
    cfDescr: '',
    faculties: {},
    departments: {},
    mainSpace: '',
    cfConditions: '',
    cfAvailability: [],
    otros: {
      email: '',
    },
    facilActivity: {
      extension: false,
      research: false,
      teaching: false
    },
    updatedAt: new Date().toISOString()
  };

  activo = true;


  checks = {};

  cambios = [];

  sugerencia: any;

  encargado = '';

  moduloNivel3 = false;
  moduloNivel25 = false;
  moduloPermiso = false;
  rol: any;


  iconos = {
    info: false,
    equipos: false,
    personal: false,
    espacio: false,
    espacioaso: false,
    servicio: false,
    proyecto: false,
    practica: false,
    solicitud: false
  };

  espaciosel: any;
  plano: Observable<any>;

  sus: Subscription;

  sedes = [];
  subsedes = [];
  facultades = [];
  departamentos = [];

  diassemana = [{ id: '1', nombre: 'LUNES' }, { id: '2', nombre: 'MARTES' }, { id: '3', nombre: 'MIERCOLES' },
  { id: '4', nombre: 'JUEVES' }, { id: '5', nombre: 'VIERNES' }, { id: '6', nombre: 'SABADO' },
  { id: '7', nombre: 'DOMINGO' }];

  espacios = [];

  listaFacultades = [];
  listaDepartamentos = [];
  listaDisponibilidad = [];
  listaTelefonos = [];
  listaActividad = [
    { id: 'extension', name: 'Extension' }, { id: 'research', name: 'Investigacion' },
    { id: 'teaching', name: 'Docencia' }];
  selectfacul = '';
  selectdepar = '';

  selectdia = 0;
  selectHinicio = '';
  selectHFinal = '';

  telefono = '';

  listaFaculSugeridos = [];
  listaDeparSugeridos = [];
  listaDispoSugeridos = [];
  listaTelSugeridos = [];

  fecha = new Date();

  selecactividad = new FormControl();


  // VARIABLES DE LA VISTA ADMIN ESPACIOS

  itemselesp: Observable<Array<any>>;
  //plano: Observable<any>;
  actividadAct = [];
  dispo;
  idnewSp;
  status;
  mensaje = false;
  ocupacionAct;

  idsh;

  sedesEsp = [];
  subsedesEsp = [];
  noEsPrac = [];
  idsp;

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
    geoRep: { latitud : 0 , longitud : 0   },
    spaceData: { building: '', place: '', floor: '' },
    active: false
  };

  horariopractica;
  formtrue = false;
  // sus: Subscription;

  // INICIALIZACION DATATABLE espacios
  displayedColumnsSpace = ['capacidad', 'arealibre', 'active', 'totalarea', 'spaceData.building', 'spaceData.place'];
  dataSourceSpace = new MatTableDataSource([]);

  @ViewChild('paginatorSpace') paginatorSpace: MatPaginator;
  @ViewChild('sortSpace') sortSpace: MatSort;

  espaestructurado: any;

  role: any;



  // VARIABLES DE LA VISTA ADMIN PERSONAL
  rolc = '';
  itemselPrac: Observable<Array<any>>;
  nombre;
  apellido;
  email;

  estado;
  idu;
  idp;
  tipo = ['Funcionario', 'Estudiante', 'Contratista', 'Otro'];
  type;

  activos = [];
  inactivos = [];
  addP;
  // objeto persona:
  person = {
    cfBirthdate: '',
    cfGender: '',
    cfUri: '',
    cfFamilyNames: '',
    cfFirstNames: '',
    cfOtherNames: '',
    cfOrgUnit: 'UK6cYXc1iYXCdSU30xmr',
    cfClass: 'cf7799e0-3477-11e1-b86c-0800200c9a66',
    cfClassScheme: '6b2b7d24-3491-11e1-b86c-0800200c9a66',
    cfFacil: {},
    active: true,
    user: '',
    roleId: '',
    email: '',
    cc: '',
    type: '',
    relatedEquipments: {},
    createdAt: this.fecha.toISOString(),
    updatedAt: this.fecha.toISOString()

  };
  // objeto usuario

  usuario = {
    email: '',
    cfOrgUnit: 'UK6cYXc1iYXCdSU30xmr',
    appRoles: { IKLoR5biu1THaAMG4JOz: true },
    cfPers: '',
    active: true,
    createdAt: this.fecha.toISOString(),
    updatedAt: this.fecha.toISOString()

  };


  persestructurado: any;

  // INICIALIZACION DATATABLE PERSONAL Activo
  displayedColumnsPers = ['nombre', 'email', 'tipo', 'estado', 'codigo'];
  dataSourcePers = new MatTableDataSource([]);

  @ViewChild('paginatorPers') paginatorPers: MatPaginator;
  @ViewChild('sortPers') sortPers: MatSort;

  // INICIALIZACION DATATABLE PERSONAL InActivo
  displayedColumnsPersIn = ['nombre', 'email', 'tipo', 'estado', 'codigo'];
  dataSourcePersIn = new MatTableDataSource([]);

  @ViewChild('paginatorPersIn') paginatorPersIn: MatPaginator;
  @ViewChild('sortPersIn') sortPersIn: MatSort;


  niveles = [];

  constructor(private afs: AngularFirestore, private storage: AngularFireStorage,
    private service: EspaciosService, private toastr: ToastrService, 
    private serviceMod3: ServicesNivel3Service) {
  }

  ngOnInit() {
    this.persona = JSON.parse(localStorage.getItem('persona'));

    this.getUserId();
    this.getRoles();
    this.cargarSedes();
    this.cargarSubsedes();
    this.cargarFacultades();

    this.getRolesNivel2();

    const now = moment().format();

    $('html, body').animate({ scrollTop: '0px' }, 'slow');


    this.estructurarLaboratorios().then(() => {
      console.log(this.laboratoriosEstructurados);
      this.resetIconos();

      this.dataSource.data = this.laboratoriosEstructurados;
      setTimeout(() => {

        if (this.laboratoriosEstructurados.length != 0) {
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
        }

      }, 1500);
    });
  }

  ngOnDestroy() {

  }

  disponible = false;
  // METODOS DE LA INTERFAZ NIVEL 3
  ciCheck($event) {
    const q = $event.target.value;
    if (q.trim() === '') {
      this.status = 'Campo obligatorio';
      // this.dispo = false;
    } else {
      this.status = 'Confirmando disponibilidad';
      const collref = this.afs.collection('cfPers').ref;
      const queryref = collref.where('email', '==', q);
      queryref.get().then((snapShot) => {
        if (snapShot.empty) {
          this.status = 'El email ingresado no se encuentra registrado';
          this.disponible = false;
        } else {
          console.log(snapShot.docs[0].id);
          const nameProject = snapShot.docs[0].data().cfFirstNames;
          this.status = 'Nombre del administrador: ' + nameProject;
          this.disponible = true;
        }
      });
    }
  }

  // METODO QUE CAMBIA AL LABORATORIO SELECCIONADO
  cambiarLaboratorio(item) {
    swal({
      title: 'Cargando un momento...',
      text: 'espere mientras se cargan los datos',
      onOpen: () => {
        swal.showLoading();
      }
    });

    this.idlab = item.uid;


    this.itemsel = Observable.of(item);
    this.labestructurado = item;
    console.log(item.active);
    this.activo = item.active;
    this.limpiarData();

    if (this.labestructurado) {
      if (this.labestructurado.objectActividad.extension) {
        this.dataSourceServicios.data = this.labestructurado.servicios;
        this.dataSourceServicios.sort = this.sortServicios;
        this.dataSourceServicios.paginator = this.paginatorServicios;

        this.dataSourceSolicitudes.data = this.labestructurado.solicitudes;
        this.dataSourceSolicitudes.sort = this.sortSolicitudes;
        this.dataSourceSolicitudes.paginator = this.paginatorSolicitudes;
      }
      if (this.labestructurado.objectActividad.research) {
        this.dataSourceProyectos.data = this.labestructurado.proyectos;
        this.dataSourceProyectos.sort = this.sortProyectos;
        this.dataSourceProyectos.paginator = this.paginatorProyectos;
      }
      if (this.labestructurado.objectActividad.teaching) {
        this.dataSourcePracticas.data = this.labestructurado.practicas;
        this.dataSourcePracticas.sort = this.sortPracticas;
        this.dataSourcePracticas.paginator = this.paginatorPracticas;
      }

      this.dataSourceEquipos.data = this.labestructurado.equipos;
      this.dataSourceEquipos.sort = this.sortEquipos;
      this.dataSourceEquipos.paginator = this.paginatorEquipos;

      this.dataSourcePersonal.data = this.labestructurado.personal;
      this.dataSourcePersonal.sort = this.sortPersonal;
      this.dataSourcePersonal.paginator = this.paginatorPersonal;

    }

    this.estructuraEspacio(item.uid).then(() => {
      this.listHq();
      this.itemselesp = Observable.of(this.espaestructurado.espacios);
      console.log(this.espaestructurado);

      this.dataSourceSpace = new MatTableDataSource(this.espaestructurado.espacios);
      // this.listSubHq();

      this.dataSourceSpace.sortingDataAccessor = (item, property) => {
        switch (property) {

          case 'spaceData.place': return item.spaceData.place;

          case 'spaceData.building': return item.spaceData.building;

          default: return item[property];
        }
      };


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

    this.estructuraIdPers(item.uid).then(() => {

      this.itemselPrac = Observable.of(this.persestructurado.personal);
      console.log(this.persestructurado);

      this.dataSourcePers.data = this.persestructurado.personal;
      this.dataSourcePersIn.data = this.persestructurado.personalInactivo;

      const ambiente = this;

      setTimeout(function () {
        if (ambiente.persestructurado.personal !== 0) {

          ambiente.dataSourcePers.sort = ambiente.sortPers;
          ambiente.dataSourcePers.paginator = ambiente.paginatorPers;
          ambiente.dataSourcePersIn.sort = ambiente.sortPersIn;
          ambiente.dataSourcePersIn.paginator = ambiente.paginatorPersIn;

          swal.close();

        } else {
          swal({
            type: 'error',
            title: 'No existe personal asociado al laboratorio',
            showConfirmButton: true
          });
        }



      }, 2000);

    });

  }

  // METODOS DE LA VISTA ADMIN LABORATORIOS 3
  estructurarLaboratorios() {
    let laboratorioObject = {};
    this.laboratoriosEstructurados = [];

    let promise = new Promise((resolve, reject) => {

    let contlabo = 0;

      if (this.moduloNivel25) {
        this.getFaculty().then(() => {
          for (const key in this.faculty) {
            if (this.faculty.hasOwnProperty(key)) {

              this.getLaboratoriosFaculty(key).then(labo => {

                contlabo += labo.size;
                labo.forEach(doc => {
                  const laboratorio = doc.data();

                  this.buscarDirector(laboratorio.facilityAdmin).then(dueno => {
                    const duenoLab = dueno.data();
                    if (duenoLab) {
                      if (laboratorio.headquarter) {
                        this.buscarSede(laboratorio.headquarter).then(se => {
                          const sede = se.data();
                          if (laboratorio.subHq) {
                            this.buscarSubSede(laboratorio.subHq).then(sub => {
                              const subsede = sub.data();
                              // convertir boolean a cadena de caracteres para estado del laboratorio


                              laboratorioObject = {
                                uid: doc.id,
                                nombre: laboratorio.cfName,
                                descripcion: laboratorio.cfDescr,
                                escuela: laboratorio.knowledgeArea,
                                inves: laboratorio.researchGroup,
                                objectActividad: laboratorio.facilActivity,
                                actividad: this.actividades(laboratorio.facilActivity),
                                director: duenoLab.cfFirstNames + ' ' + duenoLab.cfFamilyNames,
                                iddueno: laboratorio.facilityAdmin,
                                emaildirector: duenoLab.email,
                                sede: { id: laboratorio.headquarter, nombre: sede.cfName },
                                subsede: { id: laboratorio.subHq, nombre: subsede.cfAddrline1 },
                                espacioPrin: this.buscarEspacio(laboratorio.mainSpace),
                                espacioPrincipal: laboratorio.mainSpace,
                                telefonos: this.estructuraTelefonos(doc.id),
                                info: { email: laboratorio.otros.email },
                                equipos: this.estructurarEquipos(laboratorio.relatedEquipments),
                                personal: this.estructurarPersonas(laboratorio.relatedPers),
                                facultades: this.estructurarFacultades(laboratorio.faculties),
                                departamentos: this.estructurarDepartamentos(laboratorio.departments),
                                espacios: this.estructurarSpace(laboratorio.relatedSpaces, laboratorio.mainSpace),
                                cambios: laboratorio.suggestedChanges,
                                disponibilidad: laboratorio.cfAvailability,
                                condiciones: laboratorio.cfConditions,
                                estado: laboratorio.active ? 'Activo' : 'Inactivo',
                                active: laboratorio.active,
                                ultima: laboratorio.updatedAt.split('T')[0]
                              };

                              if (laboratorio.facilActivity.extension) {
                                const aux = this.estructurarServicios(laboratorio.relatedServices);
                                laboratorioObject['solicitudes'] = aux.arr2;
                                laboratorioObject['servicios'] = aux.arr;
                              }
                              if (laboratorio.facilActivity.research) {
                                laboratorioObject['proyectos'] = this.estructurarProyectos(laboratorio.relatedProjects);
                              }
                              if (laboratorio.facilActivity.teaching) {
                                laboratorioObject['practicas'] = this.estructurarPracticas(laboratorio.relatedPractices).arr4;
                              }

                              this.cambios = this.pendientes(laboratorio.suggestedChanges);

                              this.laboratoriosEstructurados.push(laboratorioObject);

                              console.log(this.laboratoriosEstructurados.length, contlabo);
                              if (this.laboratoriosEstructurados.length == contlabo) {
                                resolve();
                              }

                            });
                          }


                        });
                      }

                    }
                  });


                });

              });

            }
          }

        });
      } else {
        this.getLaboratorios().then(labo => {
          console.log(labo);
          labo.forEach(doc => {
            const laboratorio = doc.data();

            this.buscarDirector(laboratorio.facilityAdmin).then(dueno => {
              const duenoLab = dueno.data();
              if (duenoLab) {
                if (laboratorio.headquarter) {
                  this.buscarSede(laboratorio.headquarter).then(se => {
                    const sede = se.data();
                    if (laboratorio.subHq) {
                      this.buscarSubSede(laboratorio.subHq).then(sub => {
                        const subsede = sub.data();
                        // convertir boolean a cadena de caracteres para estado del laboratorio

                        laboratorioObject = {
                          uid: doc.id,
                          nombre: laboratorio.cfName,
                          descripcion: laboratorio.cfDescr,
                          escuela: laboratorio.knowledgeArea,
                          inves: laboratorio.researchGroup,
                          objectActividad: laboratorio.facilActivity,
                          actividad: this.actividades(laboratorio.facilActivity),
                          director: duenoLab.cfFirstNames + ' ' + duenoLab.cfFamilyNames,
                          emaildirector: duenoLab.email,
                          iddueno: laboratorio.facilityAdmin,
                          sede: { id: laboratorio.headquarter, nombre: sede.cfName },
                          subsede: { id: laboratorio.subHq, nombre: subsede.cfAddrline1 },
                          espacioPrin: this.buscarEspacio(laboratorio.mainSpace),
                          espacioPrincipal: laboratorio.mainSpace,
                          telefonos: this.estructuraTelefonos(doc.id),
                          info: { email: laboratorio.otros.email },
                          equipos: this.estructurarEquipos(laboratorio.relatedEquipments),
                          personal: this.estructurarPersonas(laboratorio.relatedPers),
                          facultades: this.estructurarFacultades(laboratorio.faculties),
                          departamentos: this.estructurarDepartamentos(laboratorio.departments),
                          espacios: this.estructurarSpace(laboratorio.relatedSpaces, laboratorio.mainSpace),
                          cambios: laboratorio.suggestedChanges,
                          disponibilidad: laboratorio.cfAvailability,
                          condiciones: laboratorio.cfConditions,
                          estado: laboratorio.active ? 'Activo' : 'Inactivo',
                          active: laboratorio.active,
                          ultima: laboratorio.updatedAt.split('T')[0]
                        };

                        if (laboratorio.facilActivity.extension) {
                          const aux = this.estructurarServicios(laboratorio.relatedServices);
                          laboratorioObject['solicitudes'] = aux.arr2;
                          laboratorioObject['servicios'] = aux.arr;
                        }
                        if (laboratorio.facilActivity.research) {
                          laboratorioObject['proyectos'] = this.estructurarProyectos(laboratorio.relatedProjects);
                        }
                        if (laboratorio.facilActivity.teaching) {
                          laboratorioObject['practicas'] = this.estructurarPracticas(laboratorio.relatedPractices).arr4;
                        }

                        this.cambios = this.pendientes(laboratorio.suggestedChanges);

                        this.laboratoriosEstructurados.push(laboratorioObject);

                        if (this.laboratoriosEstructurados.length == labo.size) {
                          resolve();
                        }


                      });
                    }


                  });
                }

              }
            });


          });

        });
      }

    });

    return promise;

  }

  nuevoLaboratorio() {

    swal({
      title: 'Cargando un momento...',
      text: 'espere mientras se crea el Laboratorio',
      onOpen: () => {
        swal.showLoading();
      }
    });

    const objFacil = {
      cfAcro: '',
      cfUri: '',
      cfName: '',
      category: '',
      foundationYear: '',
      knowledgeArea: '',
      researchGroup: '',
      cfDescr: '',
      cfKeyw: [],
      headquarter: '',
      subHq: '',
      faculties: {},
      departments: {},
      cfClass: 'cf7799e7-3477-11e1-b86c-0800200c9a66',
      cfClassScheme: 'da0e5a01-c73e-4489-8cf7-917e9efcdad4',
      cfAvailability: '',
      cfConditions: [],
      cfOrgUnit: 'UK6cYXc1iYXCdSU30xmr',
      facilityAdmin: '',
      mainSpace: '',
      facilActivity: { teaching: false, research: false, extension: false },
      relatedPers: {},
      relatedEquipments: {},
      relatedMeasurement: {},
      relatedServices: {},
      relatedFacilities: {},
      relatedSpaces: {},
      relatedPractices: {},
      relatedRequest: {},
      relatedProjects: {},
      suggestedChanges: [],
      otros: { direccion: '', email: '', telefono: '' },
      cfPrice: 0,
      cfCurrCode: 'COP',
      active: false,
      createdAt: this.fecha.toISOString(),
      updatedAt: this.fecha.toISOString()

    };

    objFacil.cfName = this.labo.nombre;

    this.getFacilityAdmin(this.labo.email).then(data => {
      if (data.size != 0) {
        data.forEach(doc => {
          const keyDirector = doc.id;
          objFacil.facilityAdmin = keyDirector;

          this.afs.collection('cfFacil').add(objFacil).then(dato => {
            this.serviceMod3.Trazability(
              this.user.uid, 'create', 'cfFacil', dato.id, objFacil
            ).then(() => {
              swal({
                type: 'success',
                title: 'Laboratorio creado',
                showConfirmButton: true
              });
            });

          });
        });

      } else {
        swal({
          type: 'error',
          title: 'el correo ingresado no se encuentra en los registros',
          showConfirmButton: true
        });
      }
      console.log(objFacil);

    });

  }

  cambiardata(item, table) {
    this.tablesel = table;
    this.seleccionado = item;
  }

  getLaboratorios() {
    const col = this.afs.collection('cfFacil');
    let refer = col.ref.where('active', '==', true);
    return refer.get();
  }

  getLaboratoriosFaculty(id) {
    const col = this.afs.collection('cfFacil');
    let refer = col.ref.where('active', '==', true).where('faculties.' + id, '==', true);
    return refer.get();
  }


  getFaculty() {
    let promise = new Promise((resolve, reject) => {
      this.getPersona(this.persona.cfPers).then(doc => {
        this.faculty = doc.data().faculty;
        resolve();
      });
    });
    return promise;
  }

  getFacilityAdmin(email) {
    const col = this.afs.collection('cfPers');
    const refer = col.ref.where('email', '==', this.labo.email);
    return refer.get();
  }


  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  // METODOS DE LA VISTA ADMIN LABORATORIOS 2


  selectorActividad() {
    this.infolab.facilActivity = {
      extension: false,
      research: false,
      teaching: false
    };
    this.selecactividad.value.forEach(element => {

      for (let i = 0; i < this.listaActividad.length; i++) {
        if (this.listaActividad[i].name == element) {
          this.infolab.facilActivity[this.listaActividad[i].id] = true;
        }
      }

    });

  }


  // METODO QUE TRAE UN DIRECTOR ESPECIFICO DEPENDIENDO EL ID-DIRECTOR
  buscarDirector(iddirector) {
    return this.afs.doc('cfPers/' + iddirector).ref.get();
  }

  // METODO QUE TRAE UNA SEDE ESPECIFICA DEPENDIENDO EL ID-SEDE
  buscarSede(idsede) {
    return this.afs.doc('headquarter/' + idsede).ref.get();
  }

  // METODO QUE TRAE UNA SUBSEDE ESPECIFICA DEPENDIENDO EL ID-SUBSEDE
  buscarSubSede(idsub) {
    return this.afs.doc('cfPAddr/' + idsub).ref.get();
  }

  // METODO QUE TRAE UN ESPACIO ESPECIFICO DEPENDIENDO EL ID-ESPACIO
  buscarEspacio(idespacio) {
    let arr = [];
    for (let i = 0; i < 1; i++) {
      if (idespacio) {
        this.afs.doc('space/' + idespacio).ref.get().then(data => {

          arr.push(data.data());
        });
      }
    }

    return arr;;

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
          this.afs.doc('cfSrv/' + clave).ref.get().then(data => {

            const servicio = data.data();
            const serv = {
              nombre: servicio.cfName,
              descripcion: servicio.cfDesc,
              precio: servicio.cfPrice,
              activo: servicio.active,
              variaciones: this.variations(clave),
              residuos:servicio.residuos ? 'Si' : 'No',
              uid: data.id
            };
            arr.push(serv);

            this.getSolicitudes(clave).then(dataSol => {
              dataSol.forEach(doc => {
                const element = doc.data();

                const solicitud = {
                  nombreServ: servicio.cfName,
                  descripcionServ: servicio.cfDesc,
                  precioServ: element.cfPrice,
                  activoServ: servicio.active,
                  email: element.emailuser,
                  uidServ: doc.id,
                  fecha: element.createdAt.split('T')[0],
                  estado: element.status
                };

                arr2.push(solicitud);

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
  estructurarEquipos(item) {

    const arr = [];

    for (const clave in item) {
      // Controlando que json realmente tenga esa propiedad
      if (item.hasOwnProperty(clave)) {

        if (item[clave]) {
          this.afs.doc('cfEquip/' + clave).ref.get().then(data => {
            const equip = data.data();

            // funciona con una programacion, cuando hayan mas toca crear otro metodo
            const equipo = {
              nombre: equip.cfName,
              activo: equip.active,
              precio: equip.price,
              componentes: this.estructurarComponents(clave)
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

    this.afs.collection('cfEquip/' + item + '/components').ref.get().then(data => {
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


  // METODO QUE ESTRUCTURA LA DATA DE LAS PRACTICAS EN LA VISTA BUSQUEDA DE LABORATORIOS
  // RECIBE EL NODO DE LABORATORIO QUE CONTIENE LAS PRACTICAS ASOCIADOS
  estructurarPersonas(item) {

    const arr = [];

    for (const clave in item) {
      // Controlando que json realmente tenga esa propiedad
      if (item.hasOwnProperty(clave)) {

        if (item[clave]) {
          this.afs.doc('cfPers/' + clave).ref.get().then(data => {
            const pers = data.data();
            let persona = {};
            if (pers.user) {
              this.afs.doc('user/' + pers.user).ref.get().then(dataper => {
                // funciona con una programacion, cuando hayan mas toca crear otro metodo
                if (dataper.data()) {

                  persona = {
                    id: clave,
                    nombre: pers.cfFirstNames + ' ' + pers.cfFamilyNames,
                    activo: pers.active,
                    email: dataper.data().email,
                    idpers: clave,
                    iduser: pers.user
                  };

                  arr.push(persona);
                } else {

                  persona = {
                    id: clave,
                    nombre: pers.cfFirstNames + ' ' + pers.cfFamilyNames,
                    activo: pers.active,
                    email: '',
                    idpers: clave,
                    iduser: ''
                  };
                  arr.push(persona);

                }

              });
            }

          });
        }

      }
    }

    return arr;
  }


  // METODO QUE ESTRUCTURA LA DATA DE LAS PRACTICAS EN LA VISTA BUSQUEDA DE LABORATORIOS
  // RECIBE EL NODO DE LABORATORIO QUE CONTIENE LAS PRACTICAS ASOCIADOS
  estructurarProyectos(item) {

    const arr = [];

    for (const clave in item) {
      // Controlando que json realmente tenga esa propiedad
      if (item.hasOwnProperty(clave)) {

        if (item[clave]) {
          this.afs.doc('project/' + clave).snapshotChanges().subscribe(data => {
            const project = data.payload.data();

            // funciona con una programacion, cuando hayan mas toca crear otro metodo
            const proyecto = {
              nombre: project.projectName,
              descripcion: project.projectDesc,
              id: project.ciNumber
            };

            arr.push(proyecto);

          });
        }

      }
    }

    return arr;
  }

  // METODO QUE ESTRUCTURA LA DATA DE LAS FACULTADES EN LA VISTA BUSQUEDA DE LABORATORIOS
  // RECIBE EL NODO DE LABORATORIO QUE CONTIENE LAS PRACTICAS ASOCIADOS
  estructurarFacultades(item) {

    const arr = [];

    for (const clave in item) {
      // Controlando que json realmente tenga esa propiedad
      if (item.hasOwnProperty(clave)) {

        if (item[clave]) {
          this.afs.doc('faculty/' + clave).snapshotChanges().subscribe(data => {
            const facultad = data.payload.data();
            arr.push({ id: clave, nombre: facultad.facultyName });
          });
        }

      }
    }

    return arr;
  }

  // METODO QUE ESTRUCTURA LA DATA DE LAS FACULTADES EN LA VISTA BUSQUEDA DE LABORATORIOS
  // RECIBE EL NODO DE LABORATORIO QUE CONTIENE LAS PRACTICAS ASOCIADOS
  estructurarDepartamentos(facultades) {

    const arr = [];

    for (const clave in facultades) {
      if (facultades.hasOwnProperty(clave)) {
        for (const key in facultades[clave]) {
          if (facultades[clave].hasOwnProperty(key)) {
            if (facultades[clave][key]) {
              this.afs.doc('faculty/' + clave).collection('departments')
                .doc(key).snapshotChanges().subscribe(data => {
                  const departamento = data.payload.data();
                  arr.push({ idfacul: clave, id: key, nombre: departamento.departmentName });
                });
            }

          }
        }

      }
    }

    return arr;
  }

  estructuraTelefonos(idlab) {
    let tels = [];
    this.afs.doc('cfFacil/' + idlab).collection('cfEAddr').ref.get().then(data => {
      data.forEach(element => {
        tels.push({ id: element.id, nombre: element.data().cfEAddrValue });
      });
    });

    return tels;
  }

  estructurarSpace(item, keyprincipal) {

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

  actividades(actividad) {
    let arrayActividades = [];
    const actividades = {
      extension: 'Extension',
      research: 'Investigacion',
      teaching: 'Docencia'
    };
    for (const key in actividad) {
      if (actividad.hasOwnProperty(key)) {
        if (actividad[key]) {
          arrayActividades.push(actividades[key]);
        }

      }
    }

    return arrayActividades;
  }


  cargarSedes() {
    this.afs.collection('headquarter').snapshotChanges().subscribe(data => {
      for (let i = 0; i < data.length; i++) {
        const element = data[i].payload.doc.data();
        this.sedes.push({ id: data[i].payload.doc.id, nombre: element.cfName });
      }
    });
  }

  cargarSubsedes() {
    this.afs.collection('cfPAddr').snapshotChanges().subscribe(data => {
      for (let i = 0; i < data.length; i++) {
        const element = data[i].payload.doc.data();
        this.subsedes.push({ id: data[i].payload.doc.id, nombre: element.cfAddrline1 });
      }
    });
  }

  cargarFacultades() {
    this.afs.collection('faculty').snapshotChanges().subscribe(data => {
      for (let i = 0; i < data.length; i++) {
        const element = data[i].payload.doc.data();
        this.facultades.push({ id: data[i].payload.doc.id, nombre: element.facultyName });
        this.cargarDepartamentos(data[i].payload.doc.id);
      }
    });
  }


  cargarDepartamentos(idfacul) {
    this.afs.doc('faculty/' + idfacul).collection('departments').snapshotChanges().subscribe(data => {
      for (let i = 0; i < data.length; i++) {
        const element = data[i].payload.doc.data();
        this.departamentos.push({ id: data[i].payload.doc.id, idfacul: idfacul, nombre: element.departmentName });
      }
    });
  }



  // METODO QUE ESTRUCTURA LAS VARIACIONES DE UN SERVICIO
  variations(clave) {
    const variaciones = [];
    this.afs.doc('cfSrv/' + clave).collection('variations').snapshotChanges().subscribe(data => {
      if (data) {
        for (let i = 0; i < data.length; i++) {
          const element = data[i].payload.doc.data();
          variaciones.push(element);
        }
      } else {
        return variaciones;
      }

    });
    return variaciones;
  }


  getUserId() {
    this.user = JSON.parse(localStorage.getItem('usuario'));
  }

  getPersonId(userid) {
    return this.afs.doc('user/' + userid).snapshotChanges();
  }

  getPersona(persid) {
    return this.afs.doc('cfPers/' + persid).ref.get();
  }

  getSolicitudes(id) {
    const col = this.afs.collection('cfSrvReserv');
    const refer = col.ref.where('cfSrv', '==', id).where('status', '==', 'pendiente');

    return refer.get();
  }


  arregloEspacios() {
    this.espacios = [];
    this.service.listSpaceWithSubHq(this.infolab.subHq).subscribe(data => {

      for (let i = 0; i < data.length; i++) {
        const element = data[i].payload.doc.data().spaceData;
        this.espacios.push({ id: data[i].payload.doc.id, nombre: element.building + ' - ' + element.place });
      }
    });
  }


  editar() {

    if (this.moduloNivel3) {
      swal({

        type: 'warning',
        title: 'Esta seguro que desea enviar los cambios realizados',
        showCancelButton: true,
        confirmButtonText: 'Si, enviar',
        cancelButtonText: 'No, Cancelar'

      }).then((result) => {

        if (result.value) {

          swal({
            title: 'Cargando un momento...',
            text: 'espere mientras se ejecuta la solicitud',
            onOpen: () => {
              swal.showLoading();
            }
          });

          this.infolab.cfAvailability = this.listaDisponibilidad;
          this.infolab.faculties = this.estructurarEnvioSugerenciaFacDep(this.listaFacultades, 'faculties');
          this.infolab.departments = this.estructurarEnvioSugerenciaFacDep(this.listaDepartamentos, 'departments');
          this.selectorActividad();

          this.estructurarEnvioActividades();

          if (this.infolab.mainSpace) {
            this.infolab['active'] = this.activo;
          }


          this.serviceMod3.Trazability(
            this.user.uid, 'update', 'cfFacil', this.labestructurado.uid, this.infolab
          ).then(() => {
            this.afs.doc('cfFacil/' + this.labestructurado.uid).update(this.infolab).then(data => {

              swal.close();
              swal({
                type: 'success',
                title: 'Cambios Realizados',
                showConfirmButton: true
              }).then(() => {
                // this.obs.changeObjectLab({nombre:this.labestructurado.nombre.nom1 + this.labestructurado.nombre.nom2, uid: this.labestructurado.uid})
              });

            });
          });

        } else if (result.dismiss === swal.DismissReason.cancel) {
          swal(
            'Solicitud Cancelada',
            '',
            'error'
          );
        }

      });


    } else {
      let aux = {
        suggestedChanges: this.labestructurado.cambios
      };

      const dataEstructurada = this.estructurarDataCambios();

      if (dataEstructurada.length != 0) {

        swal({

          type: 'warning',
          title: 'Esta seguro que desea enviar la sugerencia de cambios',
          showCancelButton: true,
          confirmButtonText: 'Si, Solicitar',
          cancelButtonText: 'No, Cancelar'

        }).then((result) => {

          if (result.value) {
            swal({
              title: 'Cargando un momento...',
              text: 'espere mientras se ejecuta la solicitud',
              onOpen: () => {
                swal.showLoading();
              }
            });


            this.getPersona(JSON.parse(localStorage.getItem('persona')).cfPers).then(person => {
              aux.suggestedChanges.push({
                pos: this.labestructurado.cambios.length,
                data: dataEstructurada,
                uid: this.user.uid,
                fecha: this.fecha.getDate() + '/' + (this.fecha.getMonth() + 1) + '/' + this.fecha.getFullYear(),
                nombre: person.data().cfFirstNames + ' ' + person.data().cfFamilyNames,
                estado: 'pendiente'
              });

              this.serviceMod3.Trazability(
                this.user.uid, 'update', 'cfFacil', this.labestructurado.uid, aux
              ).then(() => {
                this.afs.doc('cfFacil/' + this.labestructurado.uid).set(aux, { merge: true }).then(() => {
                  swal.close();
                  swal({
                    type: 'success',
                    title: 'Sugerencia de cambios ingresada',
                    showConfirmButton: true
                  });
                });
              });
            });



          } else if (result.dismiss === swal.DismissReason.cancel) {
            swal(
              'Solicitud Cancelada',
              '',
              'error'
            );
          }

        });

      } else {
        swal({
          type: 'error',
          title: 'No ha sugerido ningun cambio',
          showConfirmButton: true
        });
      }

    }

  }


  enviarSugerencia() {

    swal({

      type: 'warning',
      title: 'Esta seguro que desea editar los datos actuales con la sugerencia seleccionada',
      showCancelButton: true,
      confirmButtonText: 'Si, Solicitar',
      cancelButtonText: 'No, Cancelar'

    }).then((result) => {

      if (result.value) {

        swal({
          title: 'Cargando un momento...',
          text: 'espere mientras se ejecuta la solicitud',
          onOpen: () => {
            swal.showLoading();
          }
        });

        let cont = 0;
        const cambio = JSON.parse(JSON.stringify(this.infolab));
        cambio['cfAvailability'] = this.listaDisponibilidad;
        cambio['facilActivity'] = {};
        for (const key in this.checks) {
          if (this.checks.hasOwnProperty(key)) {
            const element = this.checks[key];
            if (element) {
              const aux = this.sugerencia.data[cont].llave.split('.');

              if (aux.length != 2) {
                if (aux == 'faculties' || aux == 'departments') {
                  if (this.sugerencia.data[cont].quitar) {
                    const obj = {};
                    obj[aux] = this.estructurarEnvioSugerenciaFacDep(this.sugerencia.data[cont].info, aux);
                    cambio[aux[0]] = {};
                    this.servicioEditarFacDep(obj);
                  } else {
                    cambio[aux[0]] = this.estructurarEnvioSugerenciaFacDep(this.sugerencia.data[cont].info, aux);
                  }
                } else if (aux == 'cfAvailability') {

                  cambio[aux[0]] = this.estructurarEnvioSuferenciaDisponibilidad(this.sugerencia.data[cont].info, this.sugerencia.data[cont].quitar);

                } else if (aux == 'cfEAddr') {
                  if (this.sugerencia.data[cont].quitar) {
                    this.EnviarcfEAddr(this.sugerencia.data[cont].infoaux, false);
                  } else {
                    this.EnviarcfEAddr(this.sugerencia.data[cont].info, true);
                  }
                } else if (aux == 'facilActivity') {

                  if (this.sugerencia.data[cont].quitar) {
                    const obj = {};
                    obj[aux] = this.estructurarEnvioSugerenciaActividad(this.sugerencia.data[cont].infoaux, false);

                    this.serviceMod3.Trazability(
                      this.user.uid, 'update', 'cfFacil', this.labestructurado.uid, obj
                    ).then(() => {
                      this.servicioEditarActividad(obj);
                    });
                  } else {
                    cambio[aux[0]] = {};

                    cambio[aux[0]] = this.estructurarEnvioSugerenciaActividad(this.sugerencia.data[cont].info, true);
                  }
                } else {
                  cambio[aux[0]] = this.sugerencia.data[cont].info;
                }

              } else {
                cambio[aux[0]][aux[1]] = this.sugerencia.data[cont].info;
              }

            }
            cont++;
          }
        }
        cambio['suggestedChanges'] = this.cambiarEstadoSugerencia(this.sugerencia.pos, 'aprobado');

        this.serviceMod3.Trazability(
          this.user.uid, 'update', 'cfFacil', this.labestructurado.uid, cambio
        ).then(() => {
          this.afs.doc('cfFacil/' + this.labestructurado.uid).set(cambio, { merge: true }).then(data => {
            swal(
              'Cambios Aprobados',
              '',
              'success'
            );
            this.sugerencia = undefined;
            this.limpiarData();
            // this.obs.changeObject({nombre:this.labestructurado.nombre.nom1 + this.labestructurado.nombre.nom2, uid: this.labestructurado.uid})

          });
        });


      } else if (result.dismiss === swal.DismissReason.cancel) {
        swal(
          'Solicitud Cancelada',
          '',
          'error'
        );
      }

    });



  }

  estructurarEnvioSugerenciaFacDep(arr, tipo) {
    const obj = {};
    for (let i = 0; i < arr.length; i++) {
      if (tipo == 'faculties') {
        obj[arr[i].id] = true;
      } else {
        if (!obj[arr[i].idfacul]) {
          obj[arr[i].idfacul] = {};
          obj[arr[i].idfacul][arr[i].id] = true;
        } else {
          obj[arr[i].idfacul][arr[i].id] = true;
        }
      }
    }
    return obj;
  }

  estructurarEnvioSuferenciaDisponibilidad(arr, quitar) {
    let obj = [];
    if (!quitar) {
      obj = this.labestructurado.disponibilidad;
    }

    for (let i = 0; i < arr.length; i++) {
      obj.push(arr[i]);
    }
    return obj;
  }

  estructurarEnvioActividades() {
    const retirado = this.elementosRetirados(this.listaTelefonos, this.labestructurado.telefonos);
    this.EnviarcfEAddr(retirado, false)
    const agregado = this.elementosRetirados(this.labestructurado.telefonos, this.listaTelefonos);
    this.EnviarcfEAddr(agregado, true);
  }

  EnviarcfEAddr(data, accion) {
    for (let i = 0; i < data.length; i++) {
      const element = data[i];
      if (accion) {
        this.afs.doc('cfFacil/' + this.labestructurado.uid).collection('cfEAddr')
          .add({ cfClass: '', cfClassScheme: '', cfEAddrValue: element.nombre }).then(dato => {
            this.serviceMod3.TrazabilitySubCollection(
              this.user.uid, 'create', 'cfFacil', this.labestructurado.uid,
                'cfEAddr',dato.id, { cfClass: '', cfClassScheme: '', cfEAddrValue: element.nombre }
            );
          });
      } else {
        this.afs.doc('cfFacil/' + this.labestructurado.uid).collection('cfEAddr')
          .doc(element.id).delete().then(() => {
            this.serviceMod3.TrazabilitySubCollection(
              this.user.uid, 'delete', 'cfFacil', this.labestructurado.uid,
                'cfEAddr', element.id, {}
            );
          });
      }

    }
  }

  estructurarEnvioSugerenciaActividad(data, value) {
    let auxactiviti = {};

    for (let i = 0; i < data.length; i++) {
      auxactiviti[data[i].id] = value;
    }

    return auxactiviti;
  }

  servicioEditarFacDep(obj) {
    return this.afs.doc('cfFacil/' + this.labestructurado.uid).update(obj);
  }

  servicioEditarActividad(obj) {
    return this.afs.doc('cfFacil/' + this.labestructurado.uid).set(obj, { merge: true });
  }


  cambiarEstadoSugerencia(pos, estado) {
    const cam = this.labestructurado.cambios.slice();
    for (let i = 0; i < cam.length; i++) {
      const element = cam[i];

      if (element.pos == pos && element.estado == 'pendiente') {
        element.estado = estado;
        for (let j = 0; j < element.data.length; j++) {
          const element2 = element.data[j];

          element2.cambio = this.checks['checkbox' + j];

        }
      }
    }
    return cam;
  }

  desaprobarSugerencia() {
    swal({
      title: 'Cargando un momento...',
      text: 'espere mientras se ejecuta la solicitud',
      onOpen: () => {
        swal.showLoading();
      }
    });

    const cambio = {};
    cambio['suggestedChanges'] = this.cambiarEstadoSugerencia(this.sugerencia.pos, 'desaprobado');

    this.serviceMod3.Trazability(
      this.user.uid, 'update', 'cfFacil', this.labestructurado.uid, cambio
    ).then(() => {
      this.afs.doc('cfFacil/' + this.labestructurado.uid).update(cambio).then(data => {
        swal({
          type: 'success',
          title: 'Cambios Desaprobados',
          showConfirmButton: true
        });
        this.sugerencia = undefined;
        //this.obs.changeObject({nombre:this.labestructurado.nombre.nom1 + this.labestructurado.nombre.nom2, uid: this.labestructurado.uid})
      });
    });
  }

  estructurarDataCambios() {
    const aux1 = ['facultades', 'departamentos', 'disponibilidad', 'telefonos', 'actividad', 'descripcion', 'condiciones', 'sede', 'subsede', 'espacioPrincipal', 'info.email'];
    const aux2 = ['faculties', 'departments', 'cfAvailability', 'cfEAddr', 'facilActivity', 'cfDescr', 'cfConditions', 'headquarter', 'subHq', 'mainSpace', 'otros.email'];
    const aux3 = ['this.listaFaculSugeridos', 'this.listaDeparSugeridos', 'this.listaDispoSugeridos', 'this.listaTelSugeridos'];
    const aux4 = ['this.listaFacultades', 'this.listaDepartamentos', 'this.listaDisponibilidad', 'this.listaTelefonos'];
    const data = [];
    let element;
    let element2;

    for (let i = 0; i < aux1.length; i++) {

      element = aux1[i].split('.');
      element2 = aux2[i].split('.');
      let infoauxiliar = this.infolab[element2];

      if (element.length != 2) {
        if ((aux1[i] == 'facultades') || (aux1[i] == 'departamentos') || (aux1[i] == 'disponibilidad') || (aux1[i] == 'telefonos')) {
          const sugeridos = [];
          for (let j = 0; j < eval(aux3[i]).length; j++) {
            const element = eval(aux3[i])[j];
            sugeridos.push(element);
          }

          if (sugeridos.length != 0) {
            data.push({ llave: aux2[i], nombre: aux1[i], info: sugeridos, cambio: false });
          }

          const arr1 = eval(aux4[i]);
          const arr2 = eval('this.labestructurado.' + aux1[i]);
          const retirados = this.elementosRetirados(arr1, arr2);
          if (retirados.length != 0) {
            data.push({ llave: aux2[i], quitar: true, nombre: aux1[i], infoaux: retirados, info: arr1, cambio: false });
          }


        } else if (aux1[i] == 'actividad') {
          this.selectorActividad();

          const sugeridosAct = [];
          const retiradosAct = [];

          for (const key in this.infolab.facilActivity) {
            if (this.infolab.facilActivity.hasOwnProperty(key)) {

              if (this.infolab.facilActivity[key] != this.labestructurado.objectActividad[key]) {
                if (this.infolab.facilActivity[key]) {
                  sugeridosAct.push({ id: key, nombre: this.listaActividad.find(o => o.id == key).name });
                } else {
                  retiradosAct.push({ id: key, nombre: this.listaActividad.find(o => o.id == key).name });
                }
              }

            }
          }


          if (sugeridosAct.length != 0) {
            data.push({ llave: aux2[i], nombre: aux1[i], info: sugeridosAct, cambio: false });

          }

          if (retiradosAct.length != 0) {
            data.push({ llave: aux2[i], quitar: true, nombre: aux1[i], infoaux: retiradosAct, info: [], cambio: false });
          }
        } else {

          let auxiliar = this.labestructurado[element];
          let nombre = element2[0];


          if (aux1[i] == 'sede' || aux1[i] == 'subsede') {
            auxiliar = this.labestructurado[element].id;
            nombre = aux1[i];

            infoauxiliar = this.buscarArreglo(this.infolab[element2], aux1[i]);
          }
          if ((aux1[i] == 'descripcion') || aux1[i] == 'condiciones') {
            nombre = aux1[i];

          }

          if (aux1[i] == 'espacioPrincipal') {
            nombre = aux1[i];
            infoauxiliar = this.buscarArreglo(this.infolab[element2], aux1[i]);
          }

          if (auxiliar != this.infolab[element2]) {
            data.push({ llave: aux2[i], nombre: nombre, infoaux: infoauxiliar, info: this.infolab[element2], cambio: false });
          }
        }

      } else {
        infoauxiliar = this.infolab[element2[0]][element2[1]];
        if (this.labestructurado[element[0]][element[1]] != this.infolab[element2[0]][element2[1]]) {
          data.push({ llave: aux2[i], nombre: element2[1], infoaux: infoauxiliar, info: this.infolab[element2[0]][element2[1]], cambio: false });
        }

      }


    }


    return data;
  }

  buscarArreglo(id, arreglo) {
    let arr = '';
    if (arreglo == 'sede') {
      arr = 'this.sedes';
    } else if (arreglo == 'subsede') {
      arr = 'this.subsedes';
    } else {
      arr = 'this.espacios';
    }

    for (let i = 0; i < eval(arr).length; i++) {
      const element = eval(arr)[i];
      if (element.id == id) {
        return element.nombre;
      }

    }
  }

  elementosRetirados(arr1, arr2) {
    let arr = [];
    let encontro = false;

    for (let i = 0; i < arr2.length; i++) {
      encontro = false;

      if (arr1.length == 0) {
        arr.push(arr2[i]);

      } else {

        for (let j = 0; j < arr1.length; j++) {

          if (arr2[i].id) {
            if (arr2[i].id == arr1[j].id) {
              encontro = true;
              break;
            }
          }

        }

        if (!encontro) {
          arr.push(arr2[i]);
        }
      }
    }

    return arr;
  }

  elementosAgregados(arr1, arr2) {
    let arr = [];
    let encontro = false;

    for (let i = 0; i < arr2.length; i++) {
      encontro = false;

      for (let j = 0; j < arr1.length; j++) {

        if (arr2[i].id) {
          if (arr2[i].id == arr1[j].id) {
            encontro = true;
            break;
          }
        }

      }

      if (!encontro) {
        arr.push(arr2[i]);
      }

    }

    return arr;
  }

  pendientes(item) {
    const arr = [];
    for (let j = 0; j < item.length; j++) {
      const element = item[j];

      if (element.estado == 'pendiente') {
        arr.push(element);
      }

    }

    return arr;
  }

  cambiarSugerencia(item) {

    if (item != 'inicial') {
      this.sugerencia = this.buscarSugerencia(item);
      this.estructurarChecks(this.sugerencia.data);
    } else {
      this.sugerencia = undefined;
    }

  }

  // ESTRUCTURA OBJETO JSON QUE SE ENLAZA A LOS CHECKBOX DE LA VISTA DE MANERA DINAMICA
  estructurarChecks(item) {
    this.checks = {};
    for (let i = 0; i < item.length; i++) {
      //const element = condiciones[i];
      this.checks["checkbox" + i] = false;
    }
  }

  // METODO QUE BUSCA LA SUGERENCIA QUE COINCIDE CON EL ID ENVIADO DESDE LA VISTA
  buscarSugerencia(item) {
    for (let i = 0; i < this.labestructurado.cambios.length; i++) {
      const element = this.labestructurado.cambios[i];
      if (element.pos == item && element.estado == 'pendiente') {
        return element;
      }
    }
  }

  cambiarEspacioSel(item) {
    if (item != 'inicial') {
      this.espaciosel = this.buscarEspacioLocal(item);
    } else {
      this.espaciosel = undefined;
    }
  }

  /* este metodo carga la imagen desde firebase con un parametro nombre de la imagen */
  cargarImagen() {

    if (this.espaciosel.map) {
      swal({
        title: 'Cargando un momento...',
        text: 'espere mientras se cargan los datos',
        onOpen: () => {
          swal.showLoading();
        }
      });
      const ref = this.storage.ref('planos/' + this.espaciosel.map + '.png');
      this.plano = ref.getDownloadURL();
      if (this.plano) {
        swal.close();
      }
    }

  }

  // METODO QUE BUSCA LA VARIACION QUE COINCIDE CON EL ID ENVIADO DESDE LA VISTA
  buscarEspacioLocal(item) {
    for (let i = 0; i < this.labestructurado.espacios.length; i++) {
      const element = this.labestructurado.espacios[i];
      if (element.id_space == item) {
        return element;
      }
    }
  }

  limpiarData() {
    this.seleccionado = undefined;
    this.sugerencia = undefined;

    this.infolab.otros.email = this.labestructurado.info.email;

    this.infolab.cfName = this.labestructurado.nombre;
    this.infolab.headquarter = this.labestructurado.sede.id;
    this.infolab.subHq = this.labestructurado.subsede.id;
    this.infolab.cfDescr = this.labestructurado.descripcion;
    this.listaFacultades = this.labestructurado.facultades.slice();
    this.listaDepartamentos = this.labestructurado.departamentos.slice();
    this.infolab.mainSpace = this.labestructurado.espacioPrincipal;
    this.infolab.cfConditions = this.labestructurado.condiciones;
    this.listaDisponibilidad = this.labestructurado.disponibilidad.slice();
    this.listaTelefonos = this.labestructurado.telefonos.slice();

    this.selecactividad.setValue(this.labestructurado.actividad);

    this.listaFaculSugeridos = [];
    this.listaDeparSugeridos = [];
    this.listaDispoSugeridos = [];
    this.listaTelSugeridos = [];
    this.arregloEspacios();

  }

  cambiarIcono(box) {
    if (!this.iconos[box]) {
      this.iconos[box] = true;
    } else {
      this.iconos[box] = false;
    }
  }


  quitarelemento(id, list) {

    let lista;
    let sugerido;
    if (list == 'facultad') {
      lista = eval('this.listaFacultades');
      sugerido = eval('this.listaFaculSugeridos');
    } else {
      lista = eval('this.listaDepartamentos');
      sugerido = eval('this.listaDeparSugeridos');
    }
    const encontrado = lista.find((element, index) => {
      if (element.id == id) {
        lista.splice(index, 1);
        if (this.moduloPermiso) {
          sugerido.splice(index, 1);
        }
        return true;
      }
      return false;
    });

    swal({
      type: 'success',
      title: list + ' Eliminada',
      showConfirmButton: true
    });

  }

  agregarElemento(list) {
    let lista = '';

    let select = '';

    const objeto = {};

    if (list == 'facultad') {
      lista = 'this.listaFacultades';
      select = 'this.selectfacul';

    } else {
      lista = 'this.listaDepartamentos';
      select = 'this.selectdepar';
    }


    const selecsss = eval(select);

    const encontrado = eval(lista).find((element, index) => {

      if (element.id == selecsss) {
        return true;
      }
      return false;
    });

    if (!encontrado) {

      this.buscarElemento(list, select, lista);

      swal({
        type: 'success',
        title: list + ' agregada',
        showConfirmButton: true
      });
    } else {
      swal({
        type: 'error',
        title: 'Esta ' + list + ' ya se encuentra agregada',
        showConfirmButton: true
      });
    }
  }

  buscarElemento(list, select, lista) {
    let array = '';
    let sugerido = '';
    if (list == 'facultad') {
      array = 'this.facultades';
      sugerido = 'this.listaFaculSugeridos';
    } else {
      array = 'this.departamentos';
      sugerido = 'this.listaDeparSugeridos';
    }
    const selector = eval(select);
    const listafinal = eval(lista);
    const listasugerida = eval(sugerido);
    eval(array).find((element, index) => {

      if (element.id == selector) {
        listafinal.push(element);
        if (this.moduloPermiso) {
          listasugerida.push(element);
        }
      }

    });
  }

  agregarDisponibilidad() {
    const cadena = this.diassemana[this.selectdia - 1].nombre + ' : ' + this.selectHinicio + '-' + this.selectHFinal;
    this.listaDisponibilidad.push({ id: this.selectdia, nombre: cadena });
    if (this.moduloPermiso) {
      this.listaDispoSugeridos.push({ id: this.selectdia, nombre: cadena });
    }

    swal({
      type: 'success',
      title: 'disponibilidad agregada',
      showConfirmButton: true
    });

  }

  quitarDisponibilidad(id) {
    const encontrado = this.listaDisponibilidad.find((element, index) => {
      if (element.id == id) {
        this.listaDisponibilidad.splice(index, 1);
        if (this.moduloPermiso) {
          this.listaDispoSugeridos.splice(index, 1);
        }
        return true;
      }
      return false;
    });

    swal({
      type: 'success',
      title: 'Diponibilidad Eliminada',
      showConfirmButton: true
    });
  }

  agregarTelefonos() {
    this.listaTelefonos.push({ id: this.listaTelefonos.length, nombre: this.telefono });
    if (this.moduloPermiso) {
      this.listaTelSugeridos.push({ id: this.listaTelefonos.length, nombre: this.telefono });
    }

    swal({
      type: 'success',
      title: 'telefono agregado',
      showConfirmButton: true
    });
    this.telefono = '';

  }

  quitarTelefonos(id) {
    const encontrado = this.listaTelefonos.find((element, index) => {
      if (element.id == id) {
        this.listaTelefonos.splice(index, 1);
        if (this.moduloPermiso) {
          this.listaTelSugeridos.splice(index, 1);
        }
        return true;
      }
      return false;
    });

    swal({
      type: 'success',
      title: 'Telefono Eliminado',
      showConfirmButton: true
    });
  }



  // FILTADORES DE LAS TABLAS

  applyFilterEquipos(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSourceEquipos.filter = filterValue;
  }
  applyFilterPersonal(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSourcePersonal.filter = filterValue;
  }
  applyFilterServicios(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSourceServicios.filter = filterValue;
  }
  applyFilterProyectos(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSourceProyectos.filter = filterValue;
  }
  applyFilterPracticas(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSourcePracticas.filter = filterValue;
  }

  applyFilterSolicitudes(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSourceSolicitudes.filter = filterValue;
  }


  cerrarModal(modal) {
    $('#' + modal).modal('hide');
  }

  resetIconos() {
    this.iconos = {
      info: false,
      equipos: false,
      personal: false,
      espacio: false,
      espacioaso: false,
      servicio: false,
      proyecto: false,
      practica: false,
      solicitud: false
    };
  }


  // METODOS DE LA VISTA ESPACIOS
  // METODO QUE ME TRAE EL ROL DE ACCESSO A NIVEL 2
  getRoles() {

    this.role = JSON.parse(localStorage.getItem('rol'));
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
          espacios: this.estructurarSpaceVista(laboratorio.relatedSpaces),
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
    const arr4 = [];
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

                arr4.push(pract);
              }


            });

          });
        }

      }
    }

    return { arr, arr2, arr3, arr4 };
  }

  estructurarSpaceVista(item) {

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
  cambiardataEspace(item) {

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

    this.cargarImagenEspace(this.space.map);
    this.listPracticeforSpace(this.idsp).then((ok: any) => {

      console.log(ok['data']);
      this.getActividadAct(ok['data']).then((datos: any) => {

        this.actividadAct = datos['data'];

        this.totalOcupacion(datos['data2']);
      });

    });

  }

  /* este metodo carga la imagen desde firebase con un parametro nombre de la imagen */
  cargarImagenEspace(name: string) {

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

      this.serviceMod3.Trazability(
        this.user.uid, 'create', 'space', data.id, nuevoespacio
      );
      
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

    this.serviceMod3.Trazability(
      this.user.uid, 'update', 'space', this.idsp, nuevoespacio
    ).then(() => {

      this.afs.doc('space/' + this.idsp).set(nuevoespacio, { merge: true }).then(() => {

        this.serviceMod3.Trazability(
          this.user.uid, 'update', 'cfFacil', this.idlab, nuevoEstado
        ).then(() => {
          // actualiza el estado del espacio dentro del laboratorio
          this.afs.doc('cfFacil/' + this.idlab).set(nuevoEstado, { merge: true });

          swal({
            type: 'success',
            title: 'Actualizado Correctamente',
            showConfirmButton: true
          });
        });

      });

    });



    console.log(nuevoespacio);



  }


  listSubHq(sede) {

    console.log('si llego la sede', sede);
    this.service.listSubHq(sede).subscribe(res => {

      this.subsedesEsp = res;

      console.log('subsedes', res);

    });

  }

  // lista todas las sedes de la plataforma
  listHq() {

    this.service.listHq().subscribe((res) => {

      this.sedesEsp = res;
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
      this.serviceMod3.Trazability(
        this.user.uid, 'update', 'cfFacil', this.idlab, {relatedSpaces}
      ).then(() => {
        this.afs.collection('cfFacil').doc(this.idlab).set({ relatedSpaces }, { merge: true })
          .then(() => {

            swal({
              type: 'success',
              title: 'Creado Correctamente',
              showConfirmButton: true
            });
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
      console.log(now);
      let estudiantesPractica = 0;
      // recorrer cada una de las programaciones del espacio
      this.noEsPrac.forEach(programing => {
        // recorrer cada uno de los horarios de las programming
        programing.horario.forEach(fecha => {
          console.log('fech ob', fecha);
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

  totalOcupacion(estudiantesPract) {
    console.log(estudiantesPract, this.labestructurado.personal);
    const personalLab = this.labestructurado.personal.length;
    this.ocupacionAct = (personalLab ? personalLab : 0) + (estudiantesPract ? estudiantesPract : 0);
    // tslint:disable-next-line:radix

    if ( this.space.capacity === 0) {

      console.log(' capacidad igual a cero');

      this.space.indxSa = 0;

    } if (this.space.capacity > 0 ) {

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

  // METODOS DE LA VISTA PERSONAL 2

  // METODO QUE CONSULTA TODOS LOS ROLES NIVEL 2
  getRolesNivel2() {
    this.afs.collection('appRoles').snapshotChanges().subscribe(datos => {
      for (let i = 0; i < datos.length; i++) {
        const element = datos[i].payload.doc.data();
        if (element.lvl === 'perfiles2') {

          this.niveles.push({ id: datos[i].payload.doc.id, nombre: element.roleName });
          console.log(this.niveles);

        }


      }
    });
  }


  estructuraIdPers(key) {

    const promise = new Promise((resolve, reject) => {
      this.buscarLab(key).then(labo => {
        const laboratorio = labo.data();


        this.persestructurado = {
          personal: this.estructurarPers(laboratorio.relatedPers),
          personalInactivo: this.estructurarPersIna(laboratorio.relatedPers),
          estado: laboratorio.active,
          uid: key
        };

        resolve();

      });
    });

    return promise;

  }

  estructurarPers(item) {

    const arr1 = [];

    for (const clave in item) {
      // Controlando que json realmente tenga esa propiedad
      if (item.hasOwnProperty(clave)) {
        if (item[clave]) {
          console.log(item[clave]);
          this.afs.doc('cfPers/' + clave).snapshotChanges().subscribe(data => {
            const pers = data.payload.data();


            let persona = {};
            if (pers.user) {
              this.afs.doc('user/' + pers.user).snapshotChanges().subscribe(dataper => {
                const user = dataper.payload.data();
                persona = {
                  roles: user.appRoles,
                  nombre: pers.cfFirstNames,
                  apellidos: pers.cfFamilyNames,
                  cc: pers.cc ? pers.cc : 'ninguno',
                  activo: item[clave],
                  tipo: pers.type ? pers.type : 'ninguno',
                  email: user.email ? user.email : 'ninguno asociado',
                  idpers: clave,
                  iduser: pers.user,
                };

                arr1.push(persona);

              });
            } else {
              persona = {
                roles: '',
                cc: pers.cc ? pers.cc : 'ninguno',
                nombre: pers.cfFirstNames,
                apellidos: pers.cfFamilyNames,
                activo: item[clave],
                tipo: pers.type ? pers.type : ' ninguno',
                email: pers.email,
                idpers: clave,
                iduser: pers.user,
              };


              arr1.push(persona);

            }
          });

        }
      }
    }
    return arr1;
  }

  estructurarPersIna(item) {

    const arr1 = [];

    for (const clave in item) {
      // Controlando que json realmente tenga esa propiedad
      if (item.hasOwnProperty(clave)) {
        if (!item[clave]) {
          this.afs.doc('cfPers/' + clave).snapshotChanges().subscribe(data => {
            const pers = data.payload.data();
            let persona = {};
            if (pers.user) {
              this.afs.doc('user/' + pers.user).snapshotChanges().subscribe(dataper => {
                // funciona con una programacion, cuando hayan mas toca crear otro metodo
                persona = {
                  nombre: pers.cfFirstNames,
                  apellidos: pers.cfFamilyNames,
                  activo: item[clave],
                  cc: pers.cc ? pers.cc : 'ninguno',
                  tipo: pers.type ? pers.type : 'ninguno',
                  email: dataper.payload.data().email ? dataper.payload.data().email : 'ninguno asociado',
                  roles: dataper.payload.data().appRoles,
                  idpers: clave,
                  iduser: pers.user,
                };

                arr1.push(persona);


              });
            } else {
              persona = {
                nombre: pers.cfFirstNames,
                apellidos: pers.cfFamilyNames,
                activo: item[clave],
                tipo: pers.type,
                cc: pers.cc ? pers.cc : 'ninguno',
                email: 'ninguno',
                roles: 'ninguno',
                idpers: clave,
                iduser: pers.user,
              };

              arr1.push(persona);



            }
          });
        }
      }
    }
    return arr1;
  }



  consultarRol() {

    return new Promise((resolve, reject) => {
      this.afs.collection<any>('appRoles',
        ref => ref.where('roleName', '==', this.rolc))
        .snapshotChanges().subscribe(data => {
          const idnuevo = data[0].payload.doc.id;

          console.log(idnuevo);
          resolve(idnuevo);
        });
    });
  }

  applyFilterPersona(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSourcePers.filter = filterValue;
  }

  cambiardataPersona(item, table) {
    this.tablesel = table;
    console.log(item);
    this.nombre = item.nombre;
    this.estado = item.activo;
    this.email = item.email;
    this.type = item.tipo;

    this.apellido = item.apellidos;
    for (const key in item.roles) {
      if (item.roles.hasOwnProperty(key)) {
        this.rol = key;
      }
    }

    this.idp = item.idpers;
    this.idu = item.iduser;


    // this.seleccionado = item;

  }

  actualizarPers() {

    // $('#modal').modal('hide');

    /* objeto para persona  */
    const pers = {
      cfFirstNames: this.nombre,
      cfFamilyNames: this.apellido,
      type: this.type,
      updatedAt: new Date().toISOString()
    };
    /* objeto para usuario */
    const user = {
      appRoles: {}
    };

    const nuevoEstado = {
      relatedPers: {},
      updatedAt: new Date().toISOString()

    };

    console.log('usuario con el rol', user);
    console.log(' se va actualizar esta persona', pers);

    user.appRoles[this.rol] = true;
    nuevoEstado.relatedPers[this.idp] = this.estado;

    /* metodo firebase para subir un usuario actualizado */

    if (this.idu) {
      this.serviceMod3.Trazability(
        this.user.uid, 'update', 'user', this.idu, user
      ).then(() => {
      this.afs.collection('user').doc(this.idu).set(user, { merge: true })
        .then(() => {
        });
      });

    }
    this.serviceMod3.Trazability(
      this.user.uid, 'update', 'cfPers', this.idp, pers
    ).then(() => {
      this.afs.collection('cfPers/').doc(this.idp).set(pers, { merge: true }).then(
        () => {
          this.serviceMod3.Trazability(
            this.user.uid, 'update', 'cfFacil', this.idlab, nuevoEstado
          ).then(() => {
            this.afs.doc('cfFacil/' + this.idlab).set(nuevoEstado, { merge: true });
            swal({
              type: 'success',
              title: 'usuario actualizado correctamente',
              showConfirmButton: true
            });
          });

        });
      });

    /* metodo firebase para subir una persona actualizada */


  }



  /* metodo para crear una  nueva persona dentro dl lab*/

  setPers() {

    if (this.email && this.person.cc) {
      this.person.email = this.email;
      const pers = this.person;
      pers.cfFacil[this.idlab] = true;

      const collref = this.afs.collection('user').ref;
      const queryref = collref.where('email', '==', pers.email);
      queryref.get().then((snapShot) => {
        if (snapShot.empty) {

          this.afs.collection('cfPers').add(pers)
            .then(ok => {

              this.serviceMod3.Trazability(
                this.user.uid, 'create', 'cfPers', ok.id, pers
              );

              this.updateFacilitiPers(ok.id);

              swal({
                type: 'success',
                title: 'persona creada correctamente',
                showConfirmButton: true
              });

            });
        } else {

          pers.user = snapShot.docs[0].id;

          this.afs.collection('cfPers').add(pers)
            .then(ok => {

              this.serviceMod3.Trazability(
                this.user.uid, 'create', 'cfPers', ok.id, pers
              );

              this.updateFacilitiPers(ok.id);
              this.updatedUser(pers.user, ok.id);
              swal({
                type: 'success',
                title: 'persona creada correctamente',
                showConfirmButton: true
              });

            });
        }
      });



    } else {

      swal({
        type: 'error',
        title: 'Campos importantes vacios',
        showConfirmButton: true
      });

    }

  }

  updatedUser(path, cfPers) {

    const newUser = {
      cfPers,
      appRoles: {}
    };
    // asigna como boolean el id del rol al usuario
    newUser.appRoles[this.person.roleId] = true;
    console.log(newUser);
    this.serviceMod3.Trazability(
      this.user.uid, 'update', 'user', path, newUser
    ).then(() => {
      this.afs.doc('user/' + path).set(newUser, { merge: true });
    });

  }

  /* actualizar la coleccion cfPers con el nuevo id del usuario */

  updatePers(idU, pathP) {
    this.serviceMod3.Trazability(
      this.user.uid, 'update', 'cfPers', pathP, { user: idU }
    ).then(() => {
      this.afs.collection('cfPers').doc(pathP).update({ user: idU });
    });
   
  }

  /* actualizar el laboratorio con el nuevo id del document pers */

  updateFacilitiPers(idP) {

    console.log('entrooooooo');
    const facil = {
      relatedPers: {}
    };
    facil.relatedPers[idP] = true;


    console.log('revisar este lab', this.idlab);
    this.serviceMod3.Trazability(
      this.user.uid, 'update', 'cfFacil', this.idlab, facil
    ).then(() => {
      this.afs.collection('cfFacil').doc(this.idlab).set(facil, { merge: true });
    });

  }

  emailcheck($event) {
    this.addP = '';
    const q = $event.target.value;
    if (q.trim() === '') {
      this.status = 'Campo obligatorio';
      // this.dispo = false;
    } else {
      this.status = 'Confirmando disponibilidad';
      const collref = this.afs.collection('cfPers').ref;
      const queryref = collref.where('email', '==', q);
      queryref.get().then((snapShot) => {
        if (snapShot.empty) {
          this.status = 'Email disponible';
          this.dispo = true;
        } else {
          console.log(snapShot.docs[0].id);
          this.status = 'Ya existe un usuario en el sistema con el email ingresado, si desea vincularlo presione el boton vincular.';
          this.dispo = true;
          this.addP = snapShot.docs[0].id;
          this.person.cfFamilyNames = snapShot.docs[0].data().cfFamilyNames;
          this.person.cfFirstNames = snapShot.docs[0].data().cfFirstNames;
          this.person.roleId = snapShot.docs[0].data().roleId;
          this.person.type = snapShot.docs[0].data().type;
          console.log(this.person.type);
          this.person.cfGender = snapShot.docs[0].data().cfGender;
          this.person.cfBirthdate = snapShot.docs[0].data().cfBirthdate;
        }
      });
    }
  }

  addLabPers(id: string) {

    if (id) {
      const lab = {
        relatedPers: {}
      };


      lab.relatedPers[id] = true;

      this.serviceMod3.Trazability(
        this.user.uid, 'update', 'cfFacil', this.idlab, lab
      ).then(() => {
        this.afs.doc('cfFacil/' + this.idlab).set(lab, { merge: true })
          .then(() => {

            $('#modal1').modal('hide');
            this.toastr.success('Almacenado correctamente.', 'exito!');
          });
      });
    } else {

      this.toastr.warning('Ocurrio un error, intente ingresar el email otra vez.');

    }


  }


  setValue() {

    this.email = '';
  }
}
