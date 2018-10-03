import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { Subscription } from 'rxjs';
import { ObservablesService } from '../../../shared/services/observables.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from '../../login/login-service/login.service';

import swal from 'sweetalert2';
import { Observable } from '@firebase/util';
import { element } from 'protractor';
import { QrService } from '../../mod-nivel2/services/qr.service';
import { ServicesNivel3Service } from '../services/services-nivel3.service';

declare var $: any;

@Component({
  selector: 'app-admin-usuarios',
  templateUrl: './admin-usuarios.component.html',
  styleUrls: ['./admin-usuarios.component.css']
})
export class AdminUsuariosComponent implements OnInit {
  permisions = {
    clientRoles: {}
  };

  permisions2 = {
    appRoles: {}
  };


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
    faculties: {},
    cfFirstNames: '',
    cfOrgUnit: 'i9dzCErPCO4n9WUfjxR9',
    cfClass: 'cf7799e0-3477-11e1-b86c-0800200c9a66',
    cfClassScheme: '6b2b7d24-3491-11e1-b86c-0800200c9a66',
    cfFacil: {},
    active: true,
    clientRoles: {},
    type: '',
    relatedEquipments: {},
    createdAt: this.fecha.toISOString(),
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

  @ViewChild('paginatorPers') paginatorPers: MatPaginator;
  @ViewChild('sortPers') sortPers: MatSort;

  // atributos tabla  laboratorios
  displayedColumnsFacil = ['nombre'];
  dataSourceFacil = new MatTableDataSource();
  @ViewChild('paginatorFacil') paginatorFacil: MatPaginator;
  @ViewChild('sortFacil') sortFacil: MatSort;


  // atributos tabla  facultades
  displayedColumnsFacul = ['nombre'];
  dataSourceFacul = new MatTableDataSource();
  @ViewChild('paginatorFacul') paginatorFacul: MatPaginator;
  @ViewChild('sortFacul') sortFacul: MatSort;



  status = '';
  dispo;

  sus: Subscription;

  role: any;
  moduloNivel2 = false;

  niveles = [];

  constructor(private obs: ObservablesService,
    private serviceMod3: ServicesNivel3Service,
    private _disabledU: LoginService,
    private userService: QrService) { }

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

      // validators email

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
        if ((clave === 'moduloNivel2')) {
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

          console.log(element.cfPers);


          this.serviceMod3.getPersona(element.cfPers ? element.cfPers : '123').then(data => {
            this.nombresRoles(element.appRoles).then(rol => {
              const persona = data.data() ? data.data() : ' ninguno';

              console.log(rol['role']);
              const usuario = {
                id: doc.id,
                nombre: persona['cfFirstNames'] ? persona['cfFirstNames'] : 'Ninguno',
                apellido: persona['cfFamilyNames'] ? persona['cfFamilyNames'] : 'Ninguno',
                idPers: element.cfPers,
                email: element.email,
                estado_p: persona['active'],
                estado_u: element.active,
                type: persona['type'],
                roles: rol['role'],
                llave: rol['llave']
              };

              usuarios.push(usuario);
              if (user.size === usuarios.length) {
                resolve({ user: usuarios });
              }
            });



          });
        });



      });
    });

    return promise;

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



              } if (sixe === 1) {

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

    // $('#modal').modal('hide');

    //  objeto para persona
    this.person.cfFirstNames = this.nombre;
    this.person.cfFamilyNames = this.apellido,
    this.person.type = this.type,
    this.person.active = this.estado_p,

      // objeto para usuario
    this.usuario.active = this.estado_u;


    console.log('usuario para subir al sistema', this.usuario);
    console.log(' se va actualizar esta persona', this.person);

    // inactiva la persona y los laboratorios que tiene asociados

    if (!this.person.active) {
      this.updateAllFacil();
    }

    if (! this.usuario.active) {

      this.disabledUserAuht();
    }

    /*
    // metodo firebase para subir un usuario actualizado
    if (this.idu) {
      this.afs.collection('user').doc(this.idu).set(this.usuario, { merge: true })
        .then(() => {
        });

    }
     // actualizar la persona
    if (this.idp) {
      this.afs.collection('cfPers/').doc(this.idp).set(this.person, { merge: true }).then(
        () => {


          // toca resetear en todos los laboratorios si el estado cambia
          swal({
            type: 'success',
            title: 'usuario actualizado correctamente',
            showConfirmButton: true
          });


          // this.afs.doc('cfFacil/' + this.idlab).set(nuevoEstado, { merge: true });
         //   swal({
         //   type: 'success',
         //   title: 'usuario actualizado correctamente',
         //   showConfirmButton: true
         // });


        });


    }
     */
    // metodo firebase para subir una persona actualizada
  }

  // Inactiva la persona de todos los laboratorios
  updateAllFacil() {

    this.serviceMod3.getLabsForIdPersona(this.idp).then(result => {

      const nuevoEstado = { relatedPers: {} };

      nuevoEstado.relatedPers[this.idp] = false;
      // inactiva el usuario dentro de la coleccion persona
      this.serviceMod3.setPersona(this.idlab, { active: false });

      // inactiva al usuario dentro de cada laboratorio
      result.forEach(doc => {
       this.serviceMod3.setLaboratorio(doc.id, nuevoEstado);
      });
    });
  }

  // inactiva un usuario y lo elimina de la auth
  disabledUserAuht() {

    this.serviceMod3.setUser(this.idu, { active: true });
    this._disabledU.disabledAuth(  this.idu ).subscribe( data =>   {

      console.log('exito al deshabilitar el usuario de auth');
       console.log(data.res);

    }, err => console.log('ocurrio un error al desact el usuario', err));

  }

  alertDisabled(a) {
    if (a === 'p' && this.person.active ) {
      swal({
        type: 'info',
        title: 'La persona sera desactivada de cada uno de los laboratorios.',
        showConfirmButton: true
      });
    } if (a === 'u'   && this.usuario.active ) {
      swal({
        type: 'info',
        title: 'El usuario una vez desactivado no podra acceder al sistema.',
        showConfirmButton: true
      });

    }
  }


  alertAddLab() {
    swal({
      type: 'info',
      title: 'Ahora seleccione un laboratorio al cual asociar el rol del boton +.',
      showConfirmButton: true
    });
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
   this.serviceMod3.setLaboratorio(this.idlab, facil);

  }



  addLabPers(id: string) {

    if (id) {
      const lab = {
        relatedPers: {}
      };


      lab.relatedPers[id] = true;

      this.serviceMod3.setLaboratorio(this.idlab, lab)
        .then(() => {

          $('#modal1').modal('hide');
          swal({
            type: 'success',
            title: 'Almacenado correctamente',
            showConfirmButton: true
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

        this.person.clientRoles[this.idlab] = {};
        this.person.clientRoles[this.idlab][this.rolSelect] = true;
        this.person.cfFacil[this.idlab] = true;

        console.log('mostrar usuario', this.usuario);

      }
      //  asigna roles al usuario nivel 2
      if (this.rolSelect === '6ITqecW7XrgTLaW6fpn6' ||
          this.rolSelect === 'FH5dgAP3EjI8rGKrX0mP' || this.rolSelect === 'yoVd80ZvcdgUf1a44ORB' ) {

        this.niveles.forEach(elemen => {

          if (elemen.id === this.rolSelect) {

            this.arrayPract.push(elemen);
          }

        });

        if (this.person.clientRoles[this.idlab]) {
          this.person.clientRoles[this.idlab][this.rolSelect] = true;


        } else {

          this.person.clientRoles[this.idlab] = {};
          this.person.clientRoles[this.idlab][this.rolSelect] = true;
        }

        console.log(this.person);

        // usuario de acceso nivel 2.5 -> agrega facultad
      } if (this.rolSelect === 'PFhLR4X2n9ybaZU3CR75') {


        this.niveles.forEach(elemen => {

          if (elemen.id === this.rolSelect) {

            this.arrayPract = [];

            this.arrayPract.push(elemen);
          }

        });

        this.usuario.appRoles[this.rolSelect] = true;
        this.person.faculties[this.idfacultad] = true;
        console.log(this.person);


        // usuario para administracion QR
      } if (this.rolSelect === 'k7uRIEzj99l7EjZ3Ppql') {


        this.niveles.forEach(elemen => {

          if (elemen.id === this.rolSelect) {

            this.arrayPract = [];

            this.arrayPract.push(elemen);
          }

        });

        this.usuario.appRoles[this.rolSelect] = true;


        console.log(this.usuario);

        // usuario comunicacion masiva
      } if (this.rolSelect === 'W6ihltvrx8Gc7jVucH8M') {


        this.niveles.forEach((elemen: any) => {

          if (elemen.id === this.rolSelect) {

            this.arrayPract = [];

            this.arrayPract.push(elemen);
          }

        });

        this.usuario.appRoles[this.rolSelect] = true;


        console.log(this.usuario);

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


}
