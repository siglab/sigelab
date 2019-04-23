
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireStorage } from 'angularfire2/storage';
import { Observable } from 'rxjs/Observable';
import { EDIFICIOSMELENDEZ } from '../../mod-nivel2/admin-espacios/edificios';

import * as moment from 'moment';

import swal from 'sweetalert2';
// tslint:disable-next-line:import-blacklist
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
import { Modulo2Service } from '../../mod-nivel2/services/modulo2.service';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';
import { ObservablesService } from '../../../shared/services/observables.service';

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


  @ViewChild(SpinnerComponent) alert: SpinnerComponent;

  // VARIABLES DE LA VISTA ADMIN LABORATORIOS 2

  itemsel: Observable<Array<any>>;

  tablesel = '';

  seleccionado: any;


  user: any;

  labestructurado: any;


  activo = true;


  checks = {};

  cambios = [];

  sugerencia: any;

  encargado = '';

  moduloNivel3 = false;
  moduloNivel25 = false;
  moduloPermiso = false;
  rol: any;

  role: any;


  fecha = new Date();


  constructor(private afs: AngularFirestore, private storage: AngularFireStorage,
    private service: EspaciosService, private toastr: ToastrService,
    private serviceMod3: ServicesNivel3Service, private servicioMod2: Modulo2Service,
    private obs: ObservablesService) {
  }

  ngOnInit() {
    this.persona = JSON.parse(sessionStorage.getItem('persona'));


    this.getRoles();


    const now = moment().format();

    $('html, body').animate({ scrollTop: '0px' }, 'slow');


    this.estructurarLaboratorios().then(() => {

      this.dataSource.data = this.laboratoriosEstructurados;
      setTimeout(() => {

        if (this.laboratoriosEstructurados.length !== 0) {
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
        }

      }, 1500);
    });



  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnDestroy() {

  }

  enviaritemEsp(esp) {
    this.obs.changeObjectEsp(esp);
  }

  enviaritemLab(lab) {
    this.obs.changeObjectLab(lab);
  }

  enviaritemPer(per) {
    this.obs.changeObjectPer(per);
  }

  // METODO QUE CAMBIA AL LABORATORIO SELECCIONADO
  cambiarLaboratorio(item) {

    const role = JSON.parse(sessionStorage.getItem('rol'));
    swal({
      title: 'Cargando un momento...',
      text: 'Espere mientras se cargan los datos',
      onOpen: () => {
        swal.showLoading();
      }
    });

    this.enviaritemLab({ roles: role, uid: item.uid });

    this.enviaritemEsp({ roles: role, uid: item.uid });

    this.enviaritemPer({ roles: role, uid: item.uid });


    this.idlab = item.uid;


    this.itemsel = Observable.of(item);
    this.labestructurado = item;
    console.log(item);
    this.activo = item.active;



    setTimeout(() => {
      $('html, body').animate(
        {
          scrollTop: $('#detalle').offset().top - 55
        },
        1000
      );

      $('#contenidowraper').removeClass('content-wrapper');

    }, 1500);




  }

  // METODOS DE LA VISTA ADMIN LABORATORIOS 3
  estructurarLaboratorios() {
    let laboratorioObject = {};
    this.laboratoriosEstructurados = [];

    const promise = new Promise((resolve, reject) => {

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
                      laboratorioObject = {
                        uid: doc.id,
                        nombre: laboratorio.cfName,
                        director: duenoLab.cfFirstNames + ' ' + duenoLab.cfFamilyNames,
                        iddueno: laboratorio.facilityAdmin,
                        emaildirector: duenoLab.email,
                        info: { email: laboratorio.otros.email },
                        estado: laboratorio.active ? 'Activo' : 'Inactivo',
                        active: laboratorio.active,
                        ultima: laboratorio.updatedAt.split('T')[0]
                      };



                      this.laboratoriosEstructurados.push(laboratorioObject);

                      console.log(this.laboratoriosEstructurados.length, contlabo);
                      if (this.laboratoriosEstructurados.length === contlabo) {
                        resolve();
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
                laboratorioObject = {
                  uid: doc.id,
                  nombre: laboratorio.cfName,
                  director: duenoLab.cfFirstNames + ' ' + duenoLab.cfFamilyNames,
                  iddueno: laboratorio.facilityAdmin,
                  emaildirector: duenoLab.email,
                  info: { email: laboratorio.otros.email },
                  estado: laboratorio.active ? 'Activo' : 'Inactivo',
                  active: laboratorio.active,
                  ultima: laboratorio.updatedAt.split('T')[0]
                };



                this.laboratoriosEstructurados.push(laboratorioObject);

                console.log(this.laboratoriosEstructurados.length, labo.size);
                if (this.laboratoriosEstructurados.length === labo.size) {
                  resolve();
                }


              }
            });


          });

        });
      }

    });

    return promise;

  }


  moverSpa() {
    setTimeout(() => {
      $('#contenidowraperSpace').removeClass('content-wrapper');
    }, 500);
  }

  moverPers() {
    setTimeout(() => {
      $('#contenidowraperPersonal').removeClass('content-wrapper');
    }, 500);
  }


  getFaculty() {
    const promise = new Promise((resolve, reject) => {
      this.getPersona(this.persona.cfPers).then(doc => {
        this.faculty = doc.data().faculty;
        resolve();
      });
    });
    return promise;
  }

  getPersona(persid) {
    return this.afs.doc('cfPers/' + persid).ref.get();
  }

  limpiarDatosNuevo() {
    this.labo.nombre = '';
    this.labo.email = ''
      ;
  }

  nuevoLaboratorio() {

    swal({
      title: 'Cargando un momento...',
      text: 'Espere mientras se crea el Laboratorio',
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
      if (data.size !== 0) {
        data.forEach(doc => {
          const keyDirector = doc.id;
          objFacil.facilityAdmin = keyDirector;

          this.afs.collection('cfFacil').add(objFacil).then(dato => {
            this.serviceMod3.Trazability(
              this.user.uid, 'create', 'cfFacil', dato.id, objFacil
            ).then(() => {
              swal.close();
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
          title: 'El correo ingresado no se encuentra en los registros',
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
    const refer = col.ref.where('active', '==', true);
    return refer.get();
  }

  getLaboratoriosFaculty(id) {
    const col = this.afs.collection('cfFacil');
    const refer = col.ref.where('active', '==', true).where('faculties.' + id, '==', true);
    return refer.get();
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


  // METODO QUE TRAE UN DIRECTOR ESPECIFICO DEPENDIENDO EL ID-DIRECTOR
  buscarDirector(iddirector) {
    return this.afs.doc('cfPers/' + iddirector).ref.get();
  }


}
