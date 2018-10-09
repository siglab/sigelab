import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
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

declare var $: any;

@Component({
  selector: 'app-admin-usuarios',
  templateUrl: './admin-usuarios.component.html',
  styleUrls: ['./admin-usuarios.component.css']
})
export class AdminUsuariosComponent implements OnInit {
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
  displayedColumnsPers = ['nombre', 'email', 'perfiles'];
  dataSourcePers = new MatTableDataSource([]);

  @ViewChild('paginatorPers')
  paginatorPers: MatPaginator;
  @ViewChild('sortPers')
  sortPers: MatSort;

  // atributos tabla  laboratorios
  displayedColumnsFacil = [ 'select',  'nombre'];
  selection = new SelectionModel(true, []);

  dataSourceFacil = new MatTableDataSource();
  @ViewChild('paginatorFacil')
  paginatorFacil: MatPaginator;
  @ViewChild('sortFacil')
  sortFacil: MatSort;

  // atributos tabla  facultades
  displayedColumnsFacul = ['nombre'];
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

  constructor(private obs: ObservablesService,
    private serviceMod3: ServicesNivel3Service,
    private _disabledU: LoginService,
    private userService: QrService
  ) {}

  ngOnInit() {
    $('html, body').animate({ scrollTop: '0px' }, 'slow');

    this.getRolesNivel2();

    this.getRoles();

    this.userService.listCfFacil().subscribe(data => {
      console.log('data labs', data);
      this.dataSourceFacil.data = data;
    });

    this.userService.listCfFaculties().subscribe(data => {
      console.log('data labs', data);
      this.dataSourceFacul.data = data;
    });

    this.estructuraIdPers().then((data: any) => {
      console.log('entrooooooooooo al metodo');

      // validators email
      console.log('trae data', data);

      console.log('data de admin usuarios', data.user);

      this.dataSourcePers.data = data.user;
      // this.dataSourcePers.sort = this.sortPers;
      // this.dataSourcePers.paginator = this.paginatorPers;
      console.log('variable talb', this.dataSourcePers.data);

      swal({
        title: 'Cargando un momento...',
        text: 'espere mientras se cargan los datos',
        onOpen: () => {
          swal.showLoading();
        }
      });

      setTimeout(() => {
        if (data.user.length !== 0) {
          this.dataSourcePers.sort = this.sortPers;
          this.dataSourcePers.paginator = this.paginatorPers;

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

  // METODO QUE ME TRAE EL ROL DE ACCESSO A NIVEL 2
  getRoles() {
    this.role = JSON.parse(localStorage.getItem('rol'));
    console.log(this.role);
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
        const element = doc.data();

        if (element.lvl !== 'nivel1' && element.lvl !== 'nivel3') {
          this.niveles.push({ id: doc.id, nombre: element.roleName });
          console.log(this.niveles);
        }
      });
    });
  }

  estructuraIdPers() {
    const usuarios = [];
    const promise = new Promise((resolve, reject) => {
      this.serviceMod3.buscarUsuarios().then(user => {
        user.forEach(doc => {
          // tslint:disable-next-line:no-shadowed-variable

          const element = doc.data();

          let nodoUser = this.buscarRole(element.appRoles);

          if (element.cfPers === '') {
            nodoUser = true;
          }

          console.log(element.cfPers);

          this.serviceMod3
            .getPersona(element.cfPers ? element.cfPers : '123')
            .then(data => {
              const persona = data.data() ? data.data() : ' ninguno';

              this.nombresRoles(
                nodoUser
                  ? element.appRoles
                  : this.clientRole(persona['clientRole'])
              ).then(rol => {
                console.log(rol['llave']);
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
                  estado_p: persona['active'],
                  estado_u: element.active,
                  type: persona['type'],
                  roles: rol['role'],
                  llave: rol['llave']
                };
                console.log('usuario', usuario);
                usuarios.push(usuario);

                console.log('array de usuarios', usuarios);

                console.log('tam', user.size);
                if (user.size === usuarios.length) {
                  console.log('array final', usuarios);
                  resolve({ user: usuarios });
                }
              });
            });
        });
      });
    });

    return promise;
  }

  clientRole(arrlab) {
    const roles = {};
    for (const key in arrlab) {
      if (arrlab.hasOwnProperty(key)) {
        const element = arrlab[key];

        for (const clave in element) {
          if (element.hasOwnProperty(clave)) {
            const element2 = element[clave];
            // tslint:disable-next-line:no-unused-expression
            roles[clave] = true;
          }
        }
      }
    }

    return roles;
  }

  nombresRoles(roles) {
    let nameroles = '';
    const llaves = [];

    let sixe = 0;
    for (const key in roles) {
      if (roles.hasOwnProperty(key)) {
        if (roles[key]) {
          sixe++;
        }
      }
    }
    let contador = 0;
    const promise = new Promise((resolve, reject) => {
      for (const key in roles) {
        if (roles.hasOwnProperty(key)) {
          if (roles[key]) {
            this.serviceMod3.consultarNombreRol(key).then(doc => {
              if (doc.data().roleName !== 'nivel1') {
                llaves.push({ id: doc.id, nombre: doc.data().roleName });
              }

              if (sixe > 1) {
                nameroles += doc.data().roleName + ',';
              }
              if (sixe === 1) {
                nameroles = doc.data().roleName;
              }

              contador++;

              if (sixe === contador) {
                resolve({ role: nameroles, llave: llaves });
              }
            });
          }
        }
      }
    });

    return promise;
  }

  applyFilterPers(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSourcePers.filter = filterValue;
  }

  cambiardata(item, table) {
    this.arrayPract = item.llave;
    this.tablesel = table;
    console.log(item);
    this.apellido = item.apellido;
    this.nombre = item.nombre;
    this.estado_u = item.estado_u;
    this.estado_p = item.estado_p;
    this.email = item.email;
    this.type = item.type ? item.type : 'Ninguno';

    for (const key in item.roles) {
      if (item.roles.hasOwnProperty(key)) {
        this.rol = key;
      }
    }

    this.idp = item.idPers;

    console.log(this.idp);
    this.idu = item.id;
  }

  actualizarPers() {
       // valida la seleccion de un laboratorio o una facultad antes de ejecutar

        //  objeto para persona
      this.person.cfFirstNames = this.nombre;
     (this.person.cfFamilyNames = this.apellido),
      (this.person.type = this.type),
      (this.person.active = this.estado_p),
      // objeto para usuario
      (this.usuario.active = this.estado_u);


    if (this.arrayPract.length > 0) {
          // valida si el array contiene la llave de adminstrador
          const adm = this.includeAdmin();
       if ( adm ) {
             console.log('rol de administrador lab');
             // crea la llave del lab como objeto y agrega el rol dentro
            this.setKeyAdmin();
       } else {
           // otros approles
          this.arrayPract.forEach(obj => {
          this.usuario.appRoles[obj.id] = true;
        });
       }


    }

    console.log(this.idp);

    console.log('usuario para subir al sistema', this.usuario);
    console.log(' se va actualizar esta persona', this.person);

    // inactiva la persona y los laboratorios que tiene asociados

    if (!this.person.active) {
      this.updateAllFacil();
    }


    // metodo firebase para subir un usuario actualizado
    if (this.idu) {
      this.serviceMod3.Trazability(
        this.user.uid, 'update', 'user', this.idu, this.usuario
      ).then(() => {
        this.serviceMod3.updatedUser(this.idu, this.usuario)
          .then(() => {
          });
      });

    }
    // actualizar la persona
    if (this.idp) {
      this.serviceMod3.Trazability(
        this.user.uid, 'update', 'cfPers', this.idp, this.person
      ).then(() => {
        this.serviceMod3.updatedPersona(this.idp, this.person).then(
          () => {
          // toca resetear en todos los laboratorios si el estado cambia
            swal({
              type: 'success',
              title: 'usuario actualizado correctamente',
              showConfirmButton: true
            });
        });
      });


    }



    // metodo firebase para subir una persona actualizada
  }

  // Inactiva la persona de todos los laboratorios
  updateAllFacil() {
    this.serviceMod3.getLabsForIdPersona(this.idp).then(result => {
      const nuevoEstado = { relatedPers: {} };

      nuevoEstado.relatedPers[this.idp] = false;
      this.serviceMod3.Trazability(
        this.user.uid, 'update', 'cfPers', this.idlab, { active: false }
      ).then(() => {
        // inactiva el usuario dentro de la coleccion persona
        this.serviceMod3.setPersona(this.idlab, { active: false });
      });

      // inactiva al usuario dentro de cada laboratorio
      result.forEach(doc => {
        this.serviceMod3.Trazability(
          this.user.uid, 'update', 'cfFacil', doc.id, nuevoEstado
        ).then(( ) => {
          this.serviceMod3.setLaboratorio(doc.id, nuevoEstado);
        });
      });
    });
  }

  // inactiva un usuario y lo elimina de la auth
  disabledUserAuht() {

    this.serviceMod3.Trazability(
      this.user.uid, 'update', 'user', this.idu, { active: true }
    ).then(() => {
      this.serviceMod3.setUser(this.idu, { active: true });
      this._disabledU.disabledAuth(  this.idu ).subscribe( data =>   {

        console.log('exito al deshabilitar el usuario de auth');
        console.log(data.res);

      }, err => console.log('ocurrio un error al desact el usuario', err));

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

  /* actualizar la coleccion cfPers con el nuevo id del usuario */

  /* actualizar el laboratorio con el nuevo id del document pers */

  updateFaciliti(idP) {
    console.log('entrooooooo');
    const facil = {
      relatedPers: {}
    };
    facil.relatedPers[idP] = true;

    console.log('revisar este lab', this.idlab);
    this.serviceMod3.Trazability(
      this.user.uid, 'update', 'cfFacil', this.idlab, facil
    ).then(() => {
      this.serviceMod3.setLaboratorio(this.idlab, facil);
    });


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
      this.serviceMod3.setLaboratorio(this.idlab, lab)
        .then(() => {

          $('#modal1').modal('hide');
          swal({
            type: 'success',
            title: 'Almacenado correctamente',
            showConfirmButton: true
          });
        });
      });
    } else {
      swal({
        type: 'error',
        title: 'Intente ingresar el email denuevo',
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
      title: 'Fue eliminado con exito',
      showConfirmButton: true
    });

    console.log(this.arrayPract);
  }
  applyFilterLab(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSourceFacil.filter = filterValue;
  }

  cambiardataLab(row) {
    console.log(row.id);
    this.idlab = row.id;
  }

  cambiarDataFacultad(row) {
    console.log(row.id);
    this.idfacultad = row.id;
  }

  asignarRolaLaboratorio() {
    // valida si un rol fue seleccionado
    if (this.rolSelect) {
      // usuario administrador asigna permisos dentro de  client-roles pero tiene ese unico rol
      if (this.rolSelect === 'S9wr9uK5BBF4yQZ7CwqX') {
        this.niveles.forEach(elemen => {
          if (elemen.id === this.rolSelect) {
            this.arrayPract = [];

            this.arrayPract.push(elemen);
          }
        });

        this.person.clientRole[this.idlab] = {};
        this.person.clientRole[this.idlab][this.rolSelect] = true;
        this.person.cfFacil[this.idlab] = true;

        console.log('mostrar usuario', this.usuario);
      }
      //  asigna roles al usuario nivel 2
      if (
        this.rolSelect === '6ITqecW7XrgTLaW6fpn6' ||
        this.rolSelect === 'FH5dgAP3EjI8rGKrX0mP' ||
        this.rolSelect === 'yoVd80ZvcdgUf1a44ORB'
      ) {
        this.niveles.forEach(elemen => {
          if (elemen.id === this.rolSelect) {
            this.arrayPract.push(elemen);

            swal({
              type: 'success',
              title: 'Rol agregado con exito, ya puede actualizar.',
              showConfirmButton: true
            });
          }
        });

        if (this.person.clientRole[this.idlab]) {
          this.person.clientRole[this.idlab][this.rolSelect] = true;
        } else {
          this.person.clientRole[this.idlab] = {};
          this.person.clientRole[this.idlab][this.rolSelect] = true;
        }

        console.log(this.person);

        // usuario de acceso nivel 2.5 -> agrega facultad
      }
      if (this.rolSelect === 'PFhLR4X2n9ybaZU3CR75') {
        this.person.faculty[this.idfacultad] = true;
        console.log(this.person);

        swal({
          type: 'success',
          title: 'Facultad asignada, ya puede actualizar.',
          showConfirmButton: true
        });
      }
    } else {
      swal({
        type: 'info',
        title: 'Debe seleccionar el nuevo rol primero',
        showConfirmButton: true
      });
    }
  }

  applyFilterFac(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSourceFacil.filter = filterValue;
  }

  updatedAdminFacil() {
    // obtner referencia del director actual y borrarlo
    this.serviceMod3
      .getSingleLaboratorios(this.idlab)
      .subscribe((data: any) => {
        // const idPer = data.facilityAdmin;
        console.log(data);

        this.serviceMod3
          .getPersona(data.facilityAdmin)
          .then(result => {
            console.log(result.data());
            const admiUser = result.data();
            admiUser.clientRole = {};

            console.log(admiUser);

            this.serviceMod3.updatedPersona(data.facilityAdmin, admiUser);
          })
          .catch(err => {
            console.log(err);
          });

        // agregar la referencia actual del director al laboratorio

        this.serviceMod3.updatedLab(this.idlab, { facilityAdmin: this.idp });
      });
  }

  rolSelectQrCm() {
    let encontrado = false;

    this.niveles.forEach((elemen: any) => {
      if (elemen.id === this.rolSelect) {
        this.arrayPract.forEach(el => {
          if (el.id === this.rolSelect) {
            encontrado = true;
          }
        });

        if (!encontrado) {
          this.arrayPract.push(elemen);
          this.alertSuccess();

        } else {
          this.alertInfo();
        }
      }
    });
  }

  rolSelectTresCinco() {
    let encontrado = false;
    this.niveles.forEach((elemen: any) => {
      if (elemen.id === this.rolSelect) {
        this.arrayPract.forEach(el => {
          if (el.id === 'PFhLR4X2n9ybaZU3CR75' || el.id === this.rolSelect) {
            encontrado = true;
          }
        });
        if (!encontrado) {
          this.arrayPract.push(elemen);
          this.alertSuccess();

        } else {
           this.alertInfo();

        }
      }
    });
  }

  rolSelectDosCinco() {
    let encontrado = false;
    this.niveles.forEach((elemen: any) => {
      if (elemen.id === this.rolSelect) {
        this.arrayPract.forEach(el => {
          if (el.id === 'UlcSFw3BLPAdLa533QKP' || el.id === this.rolSelect) {
            encontrado = true;
          }
        });

        if (!encontrado) {
          this.arrayPract.push(elemen);
          this.alertSuccess();
        } else {
           this.alertInfo();
        }
      }
    });
  }

  rolSelectAdminLab() {
    let encontrado = false;
    this.niveles.forEach(elemen => {
      if (elemen.id === this.rolSelect) {

        this.arrayPract.forEach(el => {
          if (  el.id === this.rolSelect || el.id === '6ITqecW7XrgTLaW6fpn6'
                || el.id === 'yoVd80ZvcdgUf1a44ORB'  || el.id === 'FH5dgAP3EjI8rGKrX0mP') {
            encontrado = true;
          }
        });

        if (!encontrado) {
          this.arrayPract.push(elemen);
          this.alertSuccess();

        } else {

           this.alertInfo();
        }

      }
    });

  }

  rolSelectAnalistaAuxiliarAdmin() {


    let encontrado = false;
    this.niveles.forEach(elemen => {
      if (elemen.id === this.rolSelect) {

        this.arrayPract.forEach(el => {
          if (  el.id === this.rolSelect || el.id === 'S9wr9uK5BBF4yQZ7CwqX') {

            encontrado = true;

          }
        });

        if (!encontrado) {
          this.arrayPract.push(elemen);
          this.alertSuccess();

        } else {

           this.alertInfo();
        }

      }
    });

  }

  alertAddLab() {
    // Usuario seleccionado modulo Qr
    if (this.rolSelect === 'k7uRIEzj99l7EjZ3Ppql') {
      this.rolSelectQrCm();

      // usuario Comunicacion masiva
    }
    if (this.rolSelect === 'W6ihltvrx8Gc7jVucH8M') {
      this.rolSelectQrCm();

      // usuario Nivel 3.5 o Administrativo
    }
    if (this.rolSelect === 'UlcSFw3BLPAdLa533QKP') {
      this.rolSelectTresCinco();

      // usuario 2.5 o usuario por facultad
    }
    if (this.rolSelect === 'PFhLR4X2n9ybaZU3CR75') {
      this.rolSelectDosCinco();

      // usuario administrador de laboratorio
    } if (this.rolSelect === 'S9wr9uK5BBF4yQZ7CwqX') {

       this.rolSelectAdminLab();

      // usuario analista nivel2
    } if (this.rolSelect === '6ITqecW7XrgTLaW6fpn6') {

        this. rolSelectAnalistaAuxiliarAdmin();

        // usuario auxiliar nivel 2
   } if (this.rolSelect === 'FH5dgAP3EjI8rGKrX0mP') {

    this. rolSelectAnalistaAuxiliarAdmin();
      // usuario administrativo nivel 2
  } if (this.rolSelect === 'yoVd80ZvcdgUf1a44ORB') {

    this. rolSelectAnalistaAuxiliarAdmin();

  }

  }

  buscarRole(rol) {
    const role = ROLESARRAY;
    for (const key in rol) {
      if (rol.hasOwnProperty(key)) {
        if (rol[key]) {
          if (role.includes(key)) {
            return true;
          }
        }
      }
    }

    return false;
  }

  setKeyAdmin() {

    this.person.clientRole[this.idlab] = {};
    this.arrayPract.forEach( elemen => {
    this.person.clientRole[this.idlab][elemen.id] = true;
    });
    this.person.cfFacil[this.idlab] = true;

    this.updatedAdminFacil();
  }


  includeAdmin() {

    const rolesNivel2 = [ 'yoVd80ZvcdgUf1a44ORB',  '6ITqecW7XrgTLaW6fpn6',  'FH5dgAP3EjI8rGKrX0mP',  'S9wr9uK5BBF4yQZ7CwqX' ];

    let includ = false;
     this.arrayPract.forEach(elemen => {

      includ =  rolesNivel2.includes( elemen.id );

    });
     return includ;
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
}
