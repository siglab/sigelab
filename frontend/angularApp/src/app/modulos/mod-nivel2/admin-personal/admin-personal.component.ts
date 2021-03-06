import { LoginService } from './../../login/login-service/login.service';
import { ObservablesService } from './../../../shared/services/observables.service';
import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
import { map, take, debounceTime } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { AngularFirestore } from 'angularfire2/firestore';
// tslint:disable-next-line:import-blacklist
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Modulo2Service } from '../services/modulo2.service';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';
declare var $: any;
@Component({
  selector: 'app-admin-personal',
  templateUrl: './admin-personal.component.html',
  styleUrls: ['./admin-personal.component.css']
})
export class AdminPersonalComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(SpinnerComponent) alert: SpinnerComponent;

  rolc = '';
  rolSelect;
  itemsel: Observable<Array<any>>;
  tablesel = '';
  nombre;
  apellido;
  email;
  rol;
  estado;
  idu;
  idp;
  tipo = ['Funcionario', 'Estudiante', 'Contratista', 'Otro'];
  type;
  idlab;
  activos = [];
  cc;
  inactivos = [];
  fecha = new Date();
  fechanacimiento;
  addP;
  // objeto persona:
  person = {
    cfBirthdate: '',
    cfGender: '',
    cfUri: '',
    cfFamilyNames: '',
    cfFirstNames: '',
    clientRole : {},
    cfOtherNames: '',
    cfOrgUnit: 'UK6cYXc1iYXCdSU30xmr',
    cfClass: 'cf7799e0-3477-11e1-b86c-0800200c9a66',
    cfClassScheme: '6b2b7d24-3491-11e1-b86c-0800200c9a66',
    cfFacil: {},
    active: true,
    user: '',
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
  displayedColumnsPers = ['nombre', 'apellido', 'email', 'tipo', 'codigo', 'estado'];
  dataSourcePers = new MatTableDataSource([]);

  @ViewChild('paginatorPers') paginatorPers: MatPaginator;
  @ViewChild('sortPers') sortPers: MatSort;

  // INICIALIZACION DATATABLE PERSONAL InActivo
  displayedColumnsPersIn = ['nombre', 'email', 'tipo' , 'codigo', 'estado' ];
  dataSourcePersIn = new MatTableDataSource([]);

  @ViewChild('paginatorPersIn') paginatorPersIn: MatPaginator;
  @ViewChild('sortPersIn') sortPersIn: MatSort;




  status = '';
  dispo;

  sus: Subscription;

  role: any;
  moduloNivel2 = false;
  moduloNivel3 = false;
  moduloNivel25 = false;

  niveles = [];

  rolesAgregados = [];

  user = this.servicioMod2.getLocalStorageUser();


  constructor(private obs: ObservablesService,
    private toastr: ToastrService,
    private register: LoginService,
    private servicioMod2: Modulo2Service ) { }

  ngOnInit() {

    $('html, body').animate({ scrollTop: '0px' }, 'slow');

    this.getRolesNivel2();



    this.sus = this.obs.currentObjectPer.subscribe(data => {
      this.getRoles(data.roles);
      if (data.length !== 0) {


        this.initDataComponent(data.uid);
       /* this.estructuraIdPers(data.uid).then(() => {

          // validators email


          this.idlab = data.uid;

          this.itemsel = Observable.of(this.persestructurado.personal);

          this.dataSourcePers.data = this.persestructurado.personal;
          this.dataSourcePersIn.data = this.persestructurado.personalInactivo;

          const ambiente = this;

          swal({
            title: 'Cargando un momento...',
            text: 'Espere mientras se cargan los datos',
            onOpen: () => {
              swal.showLoading();
            }
          });


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

        }); */

      } else {
        swal({
          type: 'error',
          title: 'No se ha seleccionado ningún laboratorio',
          showConfirmButton: true
        });
      }




    });

  }



  initDataComponent(uid) {


    this.estructuraIdPers(uid).then(() => {


      this.idlab = uid;

      this.itemsel = Observable.of(this.persestructurado.personal);

      this.dataSourcePers.data = this.persestructurado.personal;
      this.dataSourcePersIn.data = this.persestructurado.personalInactivo;

      const ambiente = this;

      swal({
        title: 'Cargando un momento...',
        text: 'Espere mientras se cargan los datos',
        onOpen: () => {
          swal.showLoading();
        }
      });


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



  ngOnDestroy() {
    this.sus.unsubscribe();
  }
  ngAfterViewInit(): void {
    // outputs `I am span`

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

  // METODO QUE CONSULTA TODOS LOS ROLES NIVEL 2
  getRolesNivel2() {
    this.servicioMod2.getAppRoles().then(datos => {
      datos.forEach(doc => {
        if (doc.data().lvl === 'perfiles2') {

          this.niveles.push({ id: doc.id, nombre: doc.data().roleName });

        }
      });
    });
  }


  estructuraIdPers(key) {

    const promise = new Promise((resolve, reject) => {
      this.servicioMod2.buscarLab(key).then(labo => {
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
          this.servicioMod2.buscarPersona(clave).then(data => {
            const pers = data.data();


            let persona = {};
            if (pers.user) {
             this.servicioMod2.buscarUsuario(pers.user).then(dataper => {
                const user = dataper.data();
                persona = {
                  roles: user.appRoles,
                  rolesClient : pers.clientRole,
                  nombre: pers.cfFirstNames,
                  fechanacimiento: pers.cfBirthdate,
                  apellidos: pers.cfFamilyNames,
                  cc: pers.cc ? pers.cc : 'ninguno',
                  activo: item[clave],
                  tipo: pers.type ? pers.type : 'ninguno'  ,
                  email: user.email ? user.email : 'ninguno asociado' ,
                  idpers: clave,
                  iduser: pers.user,
                };

                arr1.push(persona);

              });
            } else {
              persona = {
                roles: '',
                rolesClient : pers.clientRole,
                cc: pers.cc ? pers.cc : 'ninguno',
                nombre: pers.cfFirstNames,
                apellidos: pers.cfFamilyNames,
                fechanacimiento: pers.cfBirthdate,

                activo: item[clave],
                tipo: pers.type ?  pers.type : ' ninguno' ,
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
          this.servicioMod2.buscarPersona(clave).then(data => {
            const pers = data.data();
            let persona = {};
            if (pers.user) {
             this.servicioMod2.buscarUsuario(pers.user).then(dataper => {
                // funciona con una programacion, cuando hayan mas toca crear otro metodo
                persona = {
                  rolesClient : pers.clientRole,
                  nombre: pers.cfFirstNames,
                  apellidos: pers.cfFamilyNames,
                  fechanacimiento: pers.cfBirthdate,

                  activo: item[clave],
                  cc: pers.cc ? pers.cc : 'ninguno' ,
                  tipo: pers.type ? pers.type : 'ninguno' ,
                  email: dataper.data().email ?  dataper.data().email : 'ninguno asociado',
                  roles: dataper.data().appRoles,
                  idpers: clave,
                  iduser: pers.user,
                };

                arr1.push(persona);


              });
            } else {
              persona = {
                rolesClient : pers.clientRole,
                nombre: pers.cfFirstNames,
                fechanacimiento: pers.cfBirthdate,
                apellidos: pers.cfFamilyNames,
                activo: item[clave],
                tipo: pers.type,
                cc: pers.cc ?  pers.cc : 'ninguno' ,
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


  nombreRoles(item) {
    this.rolesAgregados = [];
    for (const key in item[this.idlab]  ) {
      if (item[this.idlab].hasOwnProperty(key)) {
        this.rolesAgregados.push({ id: key,
          nombre: this.niveles.find(o => o.id === key).nombre});
      }
    }
  }



  consultarRol() {

    return new Promise((resolve, reject) => {
        this.servicioMod2.getAppRoleForName(this.rolc)
        .then(data => {
          data.forEach(doc => {
            const idnuevo = doc.id;

            resolve(idnuevo);
          });

        });
    });
  }

  applyFilterPers(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSourcePers.filter = filterValue;
  }

  cambiardata(item, table) {
    this.tablesel = table;
    this.nombre = item.nombre;
    this.estado = item.activo;
    this.email = item.email;
    this.fechanacimiento = item.fechanacimiento;
    this.type = item.tipo;
    this.cc = item.cc;

    this.apellido = item.apellidos;


    this.nombreRoles(item.rolesClient);


    this.idp = item.idpers;
    this.idu = item.iduser;


    // this.seleccionado = item;

  }

  quitarelemento(i) {
    this.rolesAgregados.splice(i, 1);
  }

  actualizarPers() {

    // $('#modal').modal('hide');

    /* objeto para persona  */
    const date = new Date();
    const pers = {
      cfFirstNames: this.nombre,
      cfFamilyNames: this.apellido,
      cc: this.cc,
      cfBirthdate : this.fechanacimiento,
      type: this.type,
      clientRole: {},
      updatedAt: date.toISOString()
    };
    /* objeto para usuario */


    const nuevoEstado = {
      relatedPers: {},
      updatedAt: date.toISOString()
    };

    pers.clientRole[this.idlab] = {};



    this.rolesAgregados.forEach(doc => {
      pers.clientRole[this.idlab][doc.id] = true;
    });


    nuevoEstado.relatedPers[this.idp] = this.estado;

    /* metodo firebase para subir un usuario actualizado */

    if (this.rolesAgregados.length > 0) {
      this.servicioMod2.Trazability(
        this.user.uid, 'update', 'cfPers', this.idp, pers
      ).then(() => {
        this.servicioMod2.updatePersona(this.idp, pers).then(
          () => {
            this.alert.show();

          this.servicioMod2.Trazability(
            this.user.uid, 'update', 'cfFacil', this.idlab, nuevoEstado
          ).then(() => {
           this.servicioMod2.setDocLaboratorio(this.idlab, nuevoEstado);

           this.alert.hide();

           this.clearValues();
           $('#modal').modal('hide');

           swal({
            type: 'success',
            title: 'Usuario actualizado',
            text:  'El usuario fue actualizado con éxito'
            // showConfirmButton: true
          });
          });

        });
      });

    } else {

      swal({
        type: 'error',
        title: 'Usuario sin ningun rol',
        text: 'Por favor agregue un nuevo rol al usuario para poder actualizar'
        // showConfirmButton: true
      });


    }


    /* metodo firebase para subir una persona actualizada */


  }



  /* metodo para crear una  nueva persona dentro dl lab*/

  setPers() {

    if (this.email && this.person.cc) {
      this.person.email = this.email;
      const pers = this.person;
      pers.cfFacil[this.idlab] = true;


      this.servicioMod2.getUserForEmail(pers.email).then((snapShot) => {

        if (snapShot.empty) {
          this.alert.show();

          this.servicioMod2.addPersona(pers)
            .then(ok => {

              this.servicioMod2.Trazability(
                this.user.uid, 'create', 'cfPers', ok.id, pers
              ).then(() => {
                this.updateFaciliti(ok.id);
                this.alert.hide();

                swal({
                  type: 'success',
                  title: 'Persona creada correctamente',
                  timer: 1000,
                  showConfirmButton: true
                }).then( () =>{

                  this.clearValues();
                  this.dispo = false;
                  $('#modal1Personal').modal('hide');
                  this.initDataComponent(this.idlab );


                });

              });


            });
        } else {

          pers.user = snapShot.docs[0].id;

          this.servicioMod2.addPersona(pers)
            .then(ok => {
              this.alert.show();

              this.updateFaciliti(ok.id);
              this.updatedUser(pers.user, ok.id);
              this.alert.hide();

              swal({
                type: 'success',
                title: 'Persona creada correctamente',
                timer: 1000,
                showConfirmButton: true
              }).then( () =>{

                this.clearValues();

                $('#modal1Personal').modal('hide');
                this.initDataComponent(this.idlab );


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
    this.servicioMod2.Trazability(
      this.user.uid, 'update', 'cfFacil', path, newUser
    ).then(() => {
      this.servicioMod2.setUser(path, newUser);
    });


  }


  /* actualizar el laboratorio con el nuevo id del document pers */

  updateFaciliti(idP) {

    const facil = {
      relatedPers: {}
    };
    facil.relatedPers[idP] = true;


    this.servicioMod2.Trazability(
      this.user.uid, 'update', 'cfFacil', this.idlab, facil
    ).then(() => {
      this.servicioMod2.setDocLaboratorio(this.idlab, facil);
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

      this.servicioMod2.getPersForEmail(q).then((snapShot) => {
        if (snapShot.empty) {
          this.status = 'Email disponible';
          this.dispo = true;
        } else {
          this.status = 'Ya existe un usuario en el sistema con el email ingresado, si desea vincularlo presione el botón vincular.';
          this.dispo = true;
          this.addP = snapShot.docs[0].id;
          this.person.cfFamilyNames = snapShot.docs[0].data().cfFamilyNames;
          this.person.cfFirstNames = snapShot.docs[0].data().cfFirstNames;
          this.person.type = snapShot.docs[0].data().type;
          this.person.cfGender = snapShot.docs[0].data().cfGender;
          this.person.cfBirthdate = snapShot.docs[0].data().cfBirthdate;
        }
      });
    }
  }

  addLabPers(id: string) {
    this.alert.show();

    if (id) {
      const lab = {
        relatedPers: {}
      };


      lab.relatedPers[id] = true;

      this.servicioMod2.Trazability(
        this.user.uid, 'update', 'cfFacil', this.idlab, lab
      ).then(() => {

        this.servicioMod2.setDocLaboratorio(this.idlab, lab)
        .then(() => {
          this.alert.hide();


          swal({
            type: 'success',
            title: 'Persona actualizada correctamente',
            timer: 1000,
            showConfirmButton: true
          }).then( () =>{

            this.clearValues();

            $('#modal1Personal').modal('hide');
            this.initDataComponent(this.idlab );


          });


      });
      });


    } else {

      this.toastr.warning('Ocurrio un error, intente ingresar el email otra vez.');

    }


  }

  agregarRol() {

    let bool = false;

    this.rolesAgregados.forEach((doc, index) => {
      if (doc.id === this.rolSelect) {
        bool = true;
      }
    });

    if (bool) {
      swal({
        type: 'error',
        title: 'El rol ya se encuentra agregado.',
        showConfirmButton: true
      });
    } else {
      this.rolesAgregados.push({id: this.rolSelect,
        nombre: this.niveles.find(o => o.id === this.rolSelect).nombre});
    }

  }

  setClientRol() {

    this.person.clientRole [this.idlab] = {};
    this.person.clientRole [this.idlab] [this.rolSelect] = true;

  }

  cerrarModal(modal) {
    $('#' + modal).modal('hide');
  }

  setValue() {

    this.email = '';
    this.dispo = false;
    this.status = '';
  }


  clearValues() {

    this.email = '';
    this.person.cfBirthdate = '';
    this.person.cfFirstNames = '';
    this.person.cc = '';
    this.person.cfFamilyNames = '';
    this.person.type = '';
    this.person.cfGender = '';
  }

}



