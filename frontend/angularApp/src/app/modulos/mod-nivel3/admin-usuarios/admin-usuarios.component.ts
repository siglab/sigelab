import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
// tslint:disable-next-line:import-blacklist
import { Subscription } from 'rxjs';
import { ObservablesService } from '../../../shared/services/observables.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { LoginService } from '../../login/login-service/login.service';
import swal from 'sweetalert2';
import { Observable } from '@firebase/util';
import { element } from 'protractor';
import { QrService } from '../../mod-nivel2/services/qr.service';
import { ServicesNivel3Service } from '../services/services-nivel3.service';
import { ClassGetter } from '@angular/compiler/src/output/output_ast';
import { ROLESARRAY } from '../../../config';
import { SelectionModel } from '@angular/cdk/collections';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';
import { Modulo2Service } from "../../mod-nivel2/services/modulo2.service";

declare var $: any;

@Component({
  selector: 'app-admin-usuarios',
  templateUrl: './admin-usuarios.component.html',
  styleUrls: ['./admin-usuarios.component.css']
})
export class AdminUsuariosComponent implements OnInit {

  @ViewChild(SpinnerComponent) alert: SpinnerComponent;

  idfacultad;
  rolSelect;
  arrayPract = [];
  itemsel: Observable<Array<any>>;
  tablesel = '';
  nombre;
  apellido;
  email = '';
  rol;
  estado_u;
  estado_p;
  idu;
  idp;
  tipo = ['Funcionario', 'Estudiante', 'Contratista', 'Otro', 'Ninguno'];
  type;
  idlab;
  activos = [];
  inactivos = [];
  fecha = new Date();
  addP;
  // objeto persona:
  person = {
    cfFamilyNames: '',
    faculty: {},
    cfFirstNames: '',
    cfOrgUnit: 'i9dzCErPCO4n9WUfjxR9',
    cfClass: 'cf7799e0-3477-11e1-b86c-0800200c9a66',
    cfClassScheme: '6b2b7d24-3491-11e1-b86c-0800200c9a66',
    cfFacil: {},
    active: true,
    clientRole: {},
    type: '',
    relatedEquipments: {},
    updatedAt: this.fecha.toISOString()
  };

  genero: any;
  cedula: any;
  cumple: any;


  // objeto usuario

  usuario = {
    cfOrgUnit: 'UK6cYXc1iYXCdSU30xmr',
    appRoles: { npKRYaA0u9l4C43YSruA: true },
    active: true,
    createdAt: this.fecha.toISOString(),
    updatedAt: this.fecha.toISOString()
  };

  persestructurado: any;

  // INICIALIZACION DATATABLE PERSONAL Activo
  displayedColumnsPers = ['nombre', 'apellido', 'email', 'appRoles'];
  dataSourcePers = new MatTableDataSource([]);

  @ViewChild('paginatorPers')
  paginatorPers: MatPaginator;
  @ViewChild('sortPers')
  sortPers: MatSort;

  // atributos tabla  laboratorios
  displayedColumnsFacil = ['select', 'nombre'];
  selection = new SelectionModel(true, []);

  dataSourceFacil = new MatTableDataSource();
  @ViewChild('paginatorFacil')
  paginatorFacil: MatPaginator;
  @ViewChild('sortFacil')
  sortFacil: MatSort;

  // atributos tabla  facultades
  displayedColumnsFacul = ['select', 'nombre'];
  dataSourceFacul = new MatTableDataSource();
  @ViewChild('paginatorFacul')
  paginatorFacul: MatPaginator;
  @ViewChild('sortFacul')
  sortFacul: MatSort;

  status = '';
  dispo;

  sus: Subscription;

  role: any;
  moduloNivel2 = false;

  niveles = [];

  user = this.serviceMod3.getLocalStorageUser();

  laboraorios: any;
  facultades: any;


  editar = false;

  selectionList: any;

  nuevo = false;

  constructor(private obs: ObservablesService,
    private serviceMod3: ServicesNivel3Service,
    private _disabledU: LoginService,
    private userService: QrService,
    private _Modulo2Service:Modulo2Service
  ) { }

  ngOnInit() {
    $('html, body').animate({ scrollTop: '0px' }, 'slow');
    this.alert.show();
    this.getRolesNivel2();
    this.getRoles();
    this.userService.listCfFacil().subscribe(data => {
      this.dataSourceFacil.data = data;
      this.laboraorios = data;
    });
    this.userService.listCfFaculties().subscribe(data => {
      this.dataSourceFacul.data = data;
      this.facultades = data;
    });
    this.estructuraIdPers().then((data: any) => {
      this.dataSourcePers.data = data;
      setTimeout(() => {
        if (data.length !== 0) {
          this.dataSourcePers.sort = this.sortPers;
          this.dataSourcePers.paginator = this.paginatorPers;
          this.alert.hide();
        } else {
          this.alert.hide();
          swal({
            type: 'error',
            title: 'No existe personal ',
            showConfirmButton: true
          });
        }
      }, 2000);
    });
  }

  estructuraIdPers(){
    return this.serviceMod3.getusersCache().then(userssnap=>{
      return this.serviceMod3.estructurarDataUsersAdmin(userssnap.data())
    })
  }

  // METODO QUE ME TRAE EL ROL DE ACCESSO A NIVEL 2
  getRoles() {
    this.role = JSON.parse(sessionStorage.getItem('rol'));

    for (const clave in this.role) {
      if (this.role[clave]) {
        if (clave === 'moduloNivel2') {
          this.moduloNivel2 = true;
        }
      }
    }
  }

  // METODO QUE CONSULTA TODOS LOS ROLES NIVEL 2
  getRolesNivel2() {
    this.serviceMod3.getAppRoles().then(datos => {
      datos.forEach(doc => {
        // tslint:disable-next-line:no-shadowed-variable
        const element = doc.data();

        if (element.lvl !== 'nivel1') {
          this.niveles.push({ id: doc.id, nombre: element.roleName });
        }
      });
    });
  }

  selectRow(row,estado){
    this.alert.show();
    this.estructuradatausuario(row).then(data => {
      this.cambiardata(data, estado)
      this.alert.hide();
    }).catch(err=> {
      this.alert.hide();
    });
  }

  estructuradatausuario(row) {
    const promise = new Promise((resolve, reject) => {
      this.serviceMod3.getuser(row.uid).then(doc => {

          // tslint:disable-next-line:no-shadowed-variable
          const element = doc.data();

          this.serviceMod3
            .getPersona(element.cfPers ? element.cfPers : '123')
            .then(data => {
              const persona = data.data() ? data.data() : 'ninguno';
              console.log(data.data(),persona)
              var faculty = ''
              if (data.exists) {
                faculty = data.data().faculty 
              }
              let varconsulta;
              if (element.cfPers === '') {
                varconsulta = undefined;
              } else {
                varconsulta = this.clientRole(persona['clientRole']);
              }

              this.nombresRoles(element.appRoles,faculty
                ).then(rol => {

                  this.nombresClientRoles(varconsulta, rol['role'], rol['llave']).then(finalrol => {

                    const usuario = {
                      id: doc.id,
                      nombre: persona['cfFirstNames']
                        ? persona['cfFirstNames']
                        : 'Ninguno',
                      apellido: persona['cfFamilyNames']
                        ? persona['cfFamilyNames']
                        : 'Ninguno',
                      idPers: element.cfPers,
                      email: element.email,
                      fechana_n: persona['cfBirthdate'],
                      estado_p: persona['active'],
                      estado_u: element.active,
                      type: persona['type'],
                      cfGender: persona['cfGender'],
                      roles: finalrol['role'],
                      cc: persona['cc'],
                      llave: finalrol['llave']
                    };

                      resolve(usuario);
                  });

                });
            });
      });
    });

    return promise;
  }

  clientRole(arrlab) {
    const roles = {};
    const roleslabs = {};
    for (const key in arrlab) {
      if (arrlab.hasOwnProperty(key)) {
        // tslint:disable-next-line:no-shadowed-variable
        const element = arrlab[key];

        for (const clave in element) {
          if (element.hasOwnProperty(clave)) {
            const element2 = element[clave];
            // tslint:disable-next-line:no-unused-expression
            roles[clave] = true;
            if (!roleslabs[clave]) {
              roleslabs[clave] = [key];
            } else {
              roleslabs[clave].push(key);
            }

          }
        }
      }
    }


    return { roles, roleslabs };
  }

  appRole(facul) {
    const arr = [];
    for (const clave in facul) {
      if (facul.hasOwnProperty(clave)) {

        arr.push(clave);
      }
    }

    return arr;
  }

  nombresRoles(appRoles, faculty) {
    const nameroles = [];
    const llaves = [];

    let sixe = 0;
    for (const key in appRoles) {
      if (appRoles.hasOwnProperty(key)) {
        if (appRoles[key]) {
          sixe++;
        }
      }
    }
    let contador = 0;
    const promise = new Promise((resolve, reject) => {
      for (const key in appRoles) {
        if (appRoles.hasOwnProperty(key)) {
          if (appRoles[key]) {
            this.serviceMod3.consultarNombreRol(key).then(doc => {
              if (doc.data().roleName !== 'nivel1') {
                if (doc.id === 'PFhLR4X2n9ybaZU3CR75') {

                  llaves.push({
                    id: doc.id, fac: this.appRole(faculty),
                    nombre: doc.data().roleName, tipo: 'appRoles'
                  });
                } else {
                  llaves.push({ id: doc.id, nombre: doc.data().roleName, tipo: 'appRoles' });
                }

              }

              nameroles.push(doc.data().roleName);

              contador++;

              if (sixe === contador) {
                resolve({ role: nameroles.join(','), llave: llaves });
              }
            });
          }
        }
      }
    });

    return promise;
  }

  nombresClientRoles(varconsulta, nameroles, llaves) {
    const nameRols = [];
    const promise = new Promise((resolve, reject) => {
      if (varconsulta ? Object.keys(varconsulta.roles).length !== 0 : false) {
        const appRoles = varconsulta.roles;
        let size = 0;
        for (const key in appRoles) {
          if (appRoles.hasOwnProperty(key)) {
            if (appRoles[key]) {
              size++;
            }
          }
        }
        let contador = 0;
        for (const key in appRoles) {
          if (appRoles.hasOwnProperty(key)) {
            if (appRoles[key]) {
              this.serviceMod3.consultarNombreRol(key).then(doc => {
                if (doc.data().roleName !== 'nivel1') {
                  llaves.push({
                    id: doc.id, nombre: doc.data().roleName,
                    labs: varconsulta.roleslabs[doc.id], tipo: 'clientRole'
                  });
                }
                nameRols.push(doc.data().roleName);
                contador++;
                if (size === contador) {
                  resolve({ role: nameRols.join(','), llave: llaves });
                }
              });
            }
          }
        }
      } else {
        resolve({ role: nameroles, llave: llaves });
      }
    });

    return promise;
  }

  agregarRol() {
    this.editar = false;
    this.selection.clear();
    const appRoles = ['k7uRIEzj99l7EjZ3Ppql', 'W6ihltvrx8Gc7jVucH8M',
      'UlcSFw3BLPAdLa533QKP', 'lCpNW2BmPgMSHCD1EBpT'];
    const roleSup = ['UlcSFw3BLPAdLa533QKP', 'PFhLR4X2n9ybaZU3CR75', 'lCpNW2BmPgMSHCD1EBpT'];
    let bool = false;
    let boolroleSup = false;
    let indexroleSupe = 0;
    this.arrayPract.forEach((doc, index) => {
      if (doc.id === this.rolSelect) {
        bool = true;
      }
      if (roleSup.includes(doc.id)) {
        boolroleSup = true;
        indexroleSupe = index;
      }
    });
    if (bool) {
      swal({
        type: 'error',
        title: 'El rol ya se encuentra agregado, de clic sobre el para mas información',
        showConfirmButton: true
      });
    } else {
      if (appRoles.includes(this.rolSelect)) {
        if (boolroleSup) {
          if (roleSup.includes(this.rolSelect)) {
            swal({
              type: 'warning',
              title: 'Se agrego el rol seleccionado y se elimino el rol que opera sobre el mismo nivel.',
              showConfirmButton: true
            });
            this.arrayPract.splice(indexroleSupe, 1);
          }
        }
        this.arrayPract.push({ id: this.rolSelect, nombre: this.searchName(), tipo: 'appRoles' });
      } else {
        $('#modal').modal('show');
      }
    }
  }
  // metodo que me agrega el rol desde el modal
  agregarClienteRol() {
    const roleSup = ['UlcSFw3BLPAdLa533QKP', 'PFhLR4X2n9ybaZU3CR75', 'lCpNW2BmPgMSHCD1EBpT'];
    const arr = [];
    // tslint:disable-next-line:no-shadowed-variable
    this.selection.selected.forEach(element => {
      arr.push(element.id);
    });
    if (this.rolSelect === 'PFhLR4X2n9ybaZU3CR75') {
      let bool = false;
      let indexbool = 0;
      this.arrayPract.forEach((doc, index) => {
        if (roleSup.includes(doc.id)) {
          bool = true;
          indexbool = index;
        }
      });
      if (bool) {
        this.arrayPract.splice(indexbool, 1);
      }
      this.arrayPract.push({
        id: this.rolSelect, nombre: this.searchName(),
        fac: arr, tipo: 'appRoles'
      });
    } else {
      this.arrayPract.push({
        id: this.rolSelect, nombre: this.searchName(),
        labs: arr, tipo: 'clientRole'
      });
    }
    $('#modal').modal('hide');
  }

  // metodo que edita los laboratorios de los roles seleccionados
  editarAsignarLaboratorio() {
    const arr = [];
    // tslint:disable-next-line:no-shadowed-variable
    this.selection.selected.forEach(element => {
      arr.push(element.id);
    });
    if (this.selectionList === 'PFhLR4X2n9ybaZU3CR75') {
      this.arrayPract.find(o => o.id === this.selectionList).fac = arr;
    } else {
      this.arrayPract.find(o => o.id === this.selectionList).labs = arr;
    }
    $('#modal').modal('hide');
  }

  // metodo que dispara el modal para editar roles
  verLaboratoriosDelRol(item) {
    this.selection.clear();
    const arra = [];
    this.rolSelect = '';
    this.editar = true;
    if (item.tipo === 'clientRole') {
      for (let i = 0; i < item.labs.length; i++) {
        // tslint:disable-next-line:no-shadowed-variable
        const element = item.labs[i];
        for (let j = 0; j < this.laboraorios.length; j++) {
          const element2 = this.laboraorios[j];
          if (element === element2.id) {
            this.selection.select(element2);
          }
        }
      }
      $('#modal').modal('show');
      this.selectionList = item.id;
    } else {
      if (item.id === 'PFhLR4X2n9ybaZU3CR75') {
        this.rolSelect = 'PFhLR4X2n9ybaZU3CR75';
        for (let i = 0; i < item.fac.length; i++) {
          // tslint:disable-next-line:no-shadowed-variable
          const element = item.fac[i];
          for (let j = 0; j < this.facultades.length; j++) {
            const element2 = this.facultades[j];
            if (element === element2.id) {
              this.selection.select(element2);
            }
          }
        }
        $('#modal').modal('show');
        this.selectionList = item.id;
      } else {
        swal({
          type: 'success',
          title: 'Rol ' + item.nombre + ' es uno de los roles generales del sistema. ' +
            'por eso no requiere especificación de laboratorios al cual aplicarlo.',
          showConfirmButton: true
        });
      }
    }
  }

  searchName() {
    return this.niveles.find(o => o.id === this.rolSelect).nombre;
  }

  applyFilterPers(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSourcePers.filter = filterValue;
  }

  cambiardata(item, table) {
    this.nuevo = false;
    this.editar = false;
    this.selection.clear();
    this.idp = item.idPers;
    this.idu = item.id;
    this.arrayPract = item.llave;
    this.tablesel = table;
    this.apellido = item.apellido;
    this.nombre = item.nombre;
    this.genero = item.cfGender;
    this.estado_u = item.estado_u;
    this.estado_p = item.estado_p;
    this.email = item.email;
    this.cedula = item.cc;
    this.cumple = item.fechana_n;
    this.type = item.type ? item.type : 'Ninguno';
    for (const key in item.roles) {
      if (item.roles.hasOwnProperty(key)) {
        this.rol = key;
      }
    }
    $('html, body').animate(
      {
        scrollTop: $('#detalle').offset().top - 85
      },
      1000
    );
  }

  actualizarPers() {
    const clientRole = [
      '6ITqecW7XrgTLaW6fpn6', 'FH5dgAP3EjI8rGKrX0mP', 'yoVd80ZvcdgUf1a44ORB', 'SXYQVs5Re8exTghONg6j',
      'KMV8IWBtMoiDV21owDCj'];
    const coor = 'S9wr9uK5BBF4yQZ7CwqX';
    let adm = false;
    this.arrayPract.forEach((doc, index) => {
      if (doc.id === coor) {
        adm = true;
        this.arrayPract.forEach((doc2, index2) => {
          if (clientRole.includes(doc2.id)) {
            // tslint:disable-next-line:no-shadowed-variable
            doc.labs.forEach(element => {
              doc2.labs.forEach((element2, index3) => {
                if (element === element2) {
                  this.arrayPract[index2].labs.splice(index3, 1);
                }
              });
            });
          }
        });
        this.setKeyAdmin(doc.labs, this.idp);
      }
    });

    //  objeto para persona
    this.person.cfFirstNames = this.nombre;
    (this.person.cfFamilyNames = this.apellido),
      (this.person.type = this.type),
      (this.person.active = this.estado_p),
      // objeto para usuario
      (this.usuario.active = this.estado_u);
    const rolesUsuario = { 'npKRYaA0u9l4C43YSruA': true };
    const rolesPersona = {};
    const cfFacil = {};
    let boolfac = false;
    const facultades = {};
    if (this.arrayPract.length > 0) {
      // valida si el array contiene la llave de adminstrador
      this.arrayPract.forEach(doc => {
        if (doc.tipo === 'appRoles') {
          rolesUsuario[doc.id] = true;
          if (doc.id === 'PFhLR4X2n9ybaZU3CR75') {
            boolfac = true;
            // tslint:disable-next-line:no-shadowed-variable
            doc.fac.forEach(element => {
              facultades[element] = true;
            });
          }
        } else {
          doc.labs.forEach(lab => {
            cfFacil[lab] = true;
            if (rolesPersona[lab]) {
              rolesPersona[lab][doc.id] = true;
            } else {
              rolesPersona[lab] = {};
              rolesPersona[lab][doc.id] = true;
            }
          });
        }
      });
      this.person.clientRole = rolesPersona;
      this.person.cfFacil = cfFacil;
      if (boolfac) {
        this.person.faculty = facultades;
      }
      this.usuario.appRoles = rolesUsuario;
    }
    // inactiva la persona y los laboratorios que tiene asociados
    if (!this.person.active) {
      this.updateAllFacil();
    }
    // metodo firebase para subir un usuario actualizado
    this.serviceMod3.Trazability(
      this.user.uid, 'update', 'user', this.idu, this.usuario
    ).then(() => {
      this.serviceMod3.updatedUser(this.idu, this.usuario)
    });

    // actualizar la persona
    this.alert.show();
    this.serviceMod3.Trazability(
      this.user.uid, 'update', 'cfPers', this.idp, this.person
    ).then(() => {
      this.serviceMod3.updatedPersona(this.idp, this.person).then(
        () => {
          // toca resetear en todos los laboratorios si el estado cambia
          this.serviceMod3.updateCacheUser(this.idu,this.usuario,this.person)
          this.alert.hide();
          swal({
            type: 'success',
            title: 'Usuario actualizado correctamente',
            showConfirmButton: true
          }).then(() => {
            this.email = undefined;
          });
        });
    });
  }

  // Inactiva la persona de todos los laboratorios
  updateAllFacil() {
    this.serviceMod3.getLabsForIdPersona(this.idp).then(result => {
      const nuevoEstado = { relatedPers: {} };
      nuevoEstado.relatedPers[this.idp] = false;
      // inactiva al usuario dentro de cada laboratorio
      result.forEach(doc => {
        this.serviceMod3.Trazability(
          this.user.uid, 'update', 'cfFacil', doc.id, nuevoEstado
        ).then(() => {
          this.serviceMod3.setLaboratorio(doc.id, nuevoEstado);
        });
      });
    });
  }

  alertDisabled(a) {
    if (a === 'p' && this.person.active) {
      swal({
        type: 'info',
        title: 'La persona sera desactivada de cada uno de los laboratorios.',
        showConfirmButton: true
      });
    }
    if (a === 'u' && this.usuario.active) {
      swal({
        type: 'info',
        title: 'El usuario una vez desactivado no podra acceder al sistema.',
        showConfirmButton: true
      });
    }
  }

  alistarPersona() {
    this.arrayPract = [];
    this.cumple = undefined;
    this.genero = undefined;
    this.nombre = undefined;
    this.apellido = undefined;
    this.email = 'ejemplo@ejemplo.com';
    this.cedula = undefined;
    this.type = undefined;
    this.idu = '';
    this.idp = '';
    this.nuevo = true;
    $('html, body').animate(
      {
        scrollTop: $('#nuevoDet').offset().top - 55
      },
      1000
    );
  }

  crearPersona() {
    const person = {
      cfBirthdate: this.cumple,
      cfGender: this.genero,
      cfUri: '',
      cfFamilyNames: this.apellido,
      cfFirstNames: this.nombre,
      clientRole: {},
      cfOtherNames: '',
      cfOrgUnit: 'UK6cYXc1iYXCdSU30xmr',
      cfClass: 'cf7799e0-3477-11e1-b86c-0800200c9a66',
      cfClassScheme: '6b2b7d24-3491-11e1-b86c-0800200c9a66',
      cfFacil: {},
      active: true,
      user: this.idu,
      email: this.email,
      cc: this.cedula,
      type: this.type,
      relatedEquipments: {},
      createdAt: this.fecha.toISOString(),
      updatedAt: this.fecha.toISOString(),
      faculty: {},

    };

    swal({
      title: 'Cargando un momento...',
      text: 'espere mientras se cargan los datos',
      onOpen: () => {
        swal.showLoading();
      }
    });

    const rolesUsuario = { 'npKRYaA0u9l4C43YSruA': true };
    const rolesPersona = {};
    const cfFacil = {};
    let boolfac = false;
    const facultades = {};
    const clientRole = [
      '6ITqecW7XrgTLaW6fpn6', 'FH5dgAP3EjI8rGKrX0mP', 'yoVd80ZvcdgUf1a44ORB', 'SXYQVs5Re8exTghONg6j',
      'KMV8IWBtMoiDV21owDCj'];
    const coor = 'S9wr9uK5BBF4yQZ7CwqX';
    let adm = false;
    this.arrayPract.forEach((doc, index) => {
      if (doc.id === coor) {
        adm = true;
        this.arrayPract.forEach((doc2, index2) => {
          if (clientRole.includes(doc2.id)) {
            // tslint:disable-next-line:no-shadowed-variable
            doc.labs.forEach(element => {
              doc2.labs.forEach((element2, index3) => {
                if (element === element2) {
                  this.arrayPract[index2].labs.splice(index3, 1);
                }
              });
            });
          }
        });
      }
    });

    if (this.arrayPract.length > 0) {
      // valida si el array contiene la llave de adminstrador
      this.arrayPract.forEach(doc => {
        if (doc.tipo === 'appRoles') {
          rolesUsuario[doc.id] = true;
          if (doc.id === 'PFhLR4X2n9ybaZU3CR75') {
            boolfac = true;
            // tslint:disable-next-line:no-shadowed-variable
            doc.fac.forEach(element => {
              facultades[element] = true;
            });
          }
        } else {
          doc.labs.forEach(lab => {
            cfFacil[lab] = true;

            if (rolesPersona[lab]) {
              rolesPersona[lab][doc.id] = true;
            } else {
              rolesPersona[lab] = {};
              rolesPersona[lab][doc.id] = true;
            }
          });
        }
      });
      person.clientRole = rolesPersona;
      person.cfFacil = cfFacil;
      if (boolfac) {
        person.faculty = facultades;
      }
      if (this.nuevo) {
        person['appRoles'] = rolesUsuario;
        person['nouser'] = true;
      }
    } else {
      if (this.nuevo) {
        person['nouser'] = true;
        person['appRoles'] = {};
      }
    }
    let bool = false;
    for (const key in person) {
      if (person.hasOwnProperty(key) && person[key] === undefined) {
        bool = true;
      }
    }
    if (!bool) {
      this.alert.show();
      this.serviceMod3.agregarPersona(person).then(ok => {

        // actualizar referencia del usuario
        this.serviceMod3.setUser(this.idu, {cfPers : ok.id}).then(
          () => {
            // actualizar referencia de la persona dentro del laboratorio
            this.serviceMod3.setLaboratorio('', {relatedPers: ok.id}).then();
          }
        );
        //  this.serviceMod3.updateCacheUser(this.idu,this.usuario,person)

        this.serviceMod3.Trazability(
          this.user.uid, 'create', 'cfPers', ok.id, person
        );
        this.arrayPract.forEach((doc, index) => {
          if (doc.id === coor) {
            this.idp = ok.id;
            this.setKeyAdmin(doc.labs, ok.id);
          }
        });
        // ocultar loading
        this.alert.hide();
        // setear campos
        this.alistarPersona();
        swal.close();
        swal({
          type: 'success',
          title: 'Almacenado correctamente',
          text: 'Éxito al crear la persona. La persona solo se podrá editar una vez ingrese a la plataforma.',
          showConfirmButton: true
        });
      });
    } else {
      this.alert.hide();
      swal({
        type: 'error',
        title: 'Debe llenar todos los datos de la persona',
        showConfirmButton: true
      });
    }
  }
  /* actualizar la coleccion cfPers con el nuevo id del usuario */
  /* actualizar el laboratorio con el nuevo id del document pers */
  updateFaciliti(idP) {
    swal({
      title: 'Cargando un momento...',
      text: 'espere mientras se cargan los datos',
      onOpen: () => {
        swal.showLoading();
      }
    });
    const facil = {
      relatedPers: {}
    };
    facil.relatedPers[idP] = true;
    this.serviceMod3.Trazability(
      this.user.uid, 'update', 'cfFacil', this.idlab, facil
    ).then(() => {
      swal.close();
      this.serviceMod3.setLaboratorio(this.idlab, facil);
    });
  }

  addLabPers(id: string) {
    swal({
      title: 'Cargando un momento...',
      text: 'espere mientras se cargan los datos',
      onOpen: () => {
        swal.showLoading();
      }
    });
    if (id) {
      const lab = {
        relatedPers: {}
      };
      lab.relatedPers[id] = true;
      this.serviceMod3.Trazability(
        this.user.uid, 'update', 'cfFacil', this.idlab, lab
      ).then(() => {
        this.serviceMod3.setLaboratorio(this.idlab, lab)
          .then(() => {
            $('#modal1').modal('hide');
            swal.close();
            swal({
              type: 'success',
              title: 'Almacenado correctamente',
              showConfirmButton: true
            });
          });
      });
    } else {
      swal.close();
      swal({
        type: 'error',
        title: 'Intente ingresar el email de nuevo',
        showConfirmButton: true
      });
    }
  }

  cerrarModal(modal) {
    $('#' + modal).modal('hide');
  }

  setValue() {
    this.email = '';
  }

  quitarelemento(i) {
    this.arrayPract.splice(i, 1);
    swal({
      type: 'success',
      title: 'Fue eliminado con éxito',
      showConfirmButton: true
    });

  }
  applyFilterLab(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSourceFacil.filter = filterValue;
  }

  cambiardataLab(row) {
    this.idlab = row.id;
  }

  cambiarDataFacultad(row) {
    this.idfacultad = row.id;
  }


  applyFilterFac(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSourceFacil.filter = filterValue;
  }

  updatedAdminFacil(idlab, id) {
    // obtner referencia del director actual y borrarlo
    this.serviceMod3
      .getSingleLaboratorios(idlab)
      .then((doc: any) => {
        const laboratorio = doc.data();
        return this.serviceMod3.getPersona(laboratorio.facilityAdmin).then(snappersona=>{
          return ({snappersona,laboratorio})
        })
         
         
        // agregar la referencia actual del director al laboratorio
      }).then(data=>{
        const cfPersonAdmin = data.snappersona.data()
        if (cfPersonAdmin) {
          const aux = {};
          const aux2 = {};
          const admiUser = cfPersonAdmin.clientRole;
          const cfFacil = cfPersonAdmin.cfFacil;
          for (const key in admiUser) {
            if (admiUser.hasOwnProperty(key)) {
              if (key !== idlab) {
                aux[key] = admiUser[key];
              }
  
            }
          }
          for (const key in cfFacil) {
            if (cfFacil.hasOwnProperty(key)) {
              if (key !== idlab) {
                aux2[key] = true;
              }
            }
          }
          const persona = {
            clientRole: aux,
            cfFacil: aux2
          };
          if (data.laboratorio.facilityAdmin !== id) {
            this.serviceMod3.Trazability(
              this.user.uid, 'update', 'cfPers', data.laboratorio.facilityAdmin, persona
            ).then(() => {
              this.serviceMod3.updatedPersona(data.laboratorio.facilityAdmin, persona).then(()=>{
  
              })
            });
          }
        }
      
        this.serviceMod3.Trazability(
          this.user.uid, 'update', 'cfFacil', idlab, { facilityAdmin: id }
        ).then(() => {
          this.serviceMod3.updatedLab(idlab, { facilityAdmin: id }).then(resUpdate=>{
            if (cfPersonAdmin) {
              const director = `${cfPersonAdmin.cfFirstNames} ${cfPersonAdmin.cfFamilyNames}`
              const directoremail = cfPersonAdmin.email
              const updatedAt = cfPersonAdmin.updatedAt

              
              const laboratorio = {director,directoremail,updatedAt}
             this._Modulo2Service.updateCacheLaboratorios(idlab,laboratorio)

            }
          });
        });
      }) .catch(err => {
        console.log(err);
      });
  }


  setKeyAdmin(labs, id) {
    // tslint:disable-next-line:no-shadowed-variable
    labs.forEach(element => {
      this.updatedAdminFacil(element, id);
    });

  }

  alertSuccess() {
    swal({
      type: 'success',
      title: 'Nuevo rol agregado Correctamente.',
      showConfirmButton: true
    });
  }

  alertInfo() {
    swal({
      type: 'info',
      title: 'No se puede agregar el rol a la persona seleccionada.',
      showConfirmButton: true
    });
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.displayedColumnsFacil.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSourceFacil.data.forEach(row => this.selection.select(row));
  }

  crearComoPersona() {
    this.cumple = undefined;
    this.genero = undefined;
    this.nombre = undefined;
    this.apellido = undefined;
    this.cedula = undefined;
    this.type = undefined;
    this.idp = '';
    this.nuevo = true;
    $('html, body').animate({ scrollTop: '600px' }, 'slow');
  }
}
