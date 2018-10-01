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
    cfFirstNames: '',
    cfOrgUnit: 'i9dzCErPCO4n9WUfjxR9',
    cfClass: 'cf7799e0-3477-11e1-b86c-0800200c9a66',
    cfClassScheme: '6b2b7d24-3491-11e1-b86c-0800200c9a66',
    cfFacil: {},
    active: true,
    user: '',
    roleId: '',   // necesario consulta
    clientRoles : {},
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
    private afs: AngularFirestore,
    private toastr: ToastrService,
    private userService: QrService) { }

  ngOnInit() {
    $('html, body').animate({ scrollTop: '0px' }, 'slow');

    this.getRolesNivel2();

    this.getRoles();

    this.userService.listCfFacil().subscribe(data => {

      console.log('data labs', data);
      this.dataSourceFacil.data = data;
    });


    this.estructuraIdPers().then((data: any) => {

      // validators email

      console.log(data.user);

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
    this.afs.collection('appRoles').snapshotChanges().subscribe(datos => {
      for (let i = 0; i < datos.length; i++) {
        // tslint:disable-next-line:no-shadowed-variable
        const element = datos[i].payload.doc.data();


        if (element.lvl !== 'nivel1' && element.lvl !== 'nivel3') {

          this.niveles.push({ id: datos[i].payload.doc.id, nombre: element.roleName });
          console.log(this.niveles);

        }


      }
    });
  }


  estructuraIdPers() {
    const usuarios = [];
    const promise = new Promise((resolve, reject) => {
      this.buscarUsuarios().then(user => {

        user.forEach(doc => {
          // tslint:disable-next-line:no-shadowed-variable
          const element = doc.data();

          console.log(element.cfPers);


          this.getPersona(element.cfPers ? element.cfPers : '123').then(data => {
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

  // METODO QUE TRAE UN DIRECTOR ESPECIFICO DEPENDIENDO EL ID-DIRECTOR
  buscarUsuarios() {

    return this.afs.collection('user').ref.get();

  }

  getPersona(id) {
    return this.afs.collection('cfPers').doc(id).ref.get();
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

            this.consultarNombreRol(key).then(doc => {

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

  consultarNombreRol(id) {
    return this.afs.collection('appRoles').doc(id).ref.get();
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



    // this.seleccionado = item;

  }

  actualizarPers() {


    // $('#modal').modal('hide');

    //  objeto para persona
    const pers = {
      cfFirstNames: this.nombre,
      cfFamilyNames: this.apellido,
      type: this.type,
      clientRoles : this.permisions,
      active : this.estado_p,
      updatedAt: new Date().toISOString()
    };
    // objeto para usuario
    const user = {
      appRoles: this.permisions2,
      active : this.estado_u,
      updatedAt: new Date().toISOString()
    };

    // nuevo estado del laboratorio
    const nuevoEstado = {
      relatedPers: {},
      updatedAt: new Date().toISOString()

    };

    console.log('usuario con el rol', user);
    console.log(' se va actualizar esta persona', pers);

    user.appRoles[this.rol] = true;
    nuevoEstado.relatedPers[this.idp] = this.estado_p;

    // metodo firebase para subir un usuario actualizado

    if (this.idu) {
      this.afs.collection('user').doc(this.idu).set(user, { merge: true })
        .then(() => {
        });

    }

    if ( this.idp  ) {


      this.afs.collection('cfPers/').doc(this.idp).set(pers, { merge: true }).then(
        () => {


          // toca resetear en todos los laboratorios no solo

          this.afs.doc('cfFacil/' + this.idlab).set(nuevoEstado, { merge: true });
          swal({
            type: 'success',
            title: 'usuario actualizado correctamente',
            showConfirmButton: true
          });

        });


    }

    // metodo firebase para subir una persona actualizada


  }



  /* metodo para crear una  nueva persona dentro dl lab*/
/*
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

              this.updateFaciliti(ok.id);

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

              this.updateFaciliti(ok.id);
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
 */
  updatedUser(path, cfPers) {

    const newUser = {
      cfPers,
      appRoles: {}
    };
    // asigna como boolean el id del rol al usuario
    newUser.appRoles[this.person.roleId] = true;
    console.log(newUser);
    this.afs.doc('user/' + path).set(newUser, { merge: true });

  }

  /* actualizar la coleccion cfPers con el nuevo id del usuario */

  updatePers(idU, pathP) {

    this.afs.collection('cfPers').doc(pathP).update({ user: idU });

  }

  /* actualizar el laboratorio con el nuevo id del document pers */

  updateFaciliti(idP) {

    console.log('entrooooooo');
    const facil = {
      relatedPers: {}
    };
    facil.relatedPers[idP] = true;


    console.log('revisar este lab', this.idlab);
    this.afs.collection('cfFacil').doc(this.idlab).set(facil, { merge: true });

  }


  /*
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
  */
  addLabPers(id: string) {

    if (id) {
      const lab = {
        relatedPers: {}
      };


      lab.relatedPers[id] = true;

      this.afs.doc('cfFacil/' + this.idlab).set(lab, { merge: true })
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


  buscarElemento() {




  }

  asignarRolaLaboratorio() {



    if (this.rolSelect) {

      // pushar al array los roles nuevos
      this.niveles.forEach(  elemen => {

        if ( elemen.id === this.rolSelect) {

         this.arrayPract.push(elemen);
        }

     });


      // es administrador asigna permisos dentro de app roles pero tiene ese unico rol
      if (this.rolSelect === 'S9wr9uK5BBF4yQZ7CwqX') {

        if (this.person.clientRoles[this.idlab]) {
            this.person.clientRoles[this.idlab][this.rolSelect] = true;


        } else {

          this.usuario.appRoles[this.idlab] = {};
          this.usuario.appRoles[this.idlab][this.rolSelect] = true;
        }

      }
      //  si no es nivel 2.5 asigna roles dentro del objeto client roles y necesario agregar facultades
      if (this.rolSelect !== 'PFhLR4X2n9ybaZU3CR75'  &&  this.rolSelect !== 'S9wr9uK5BBF4yQZ7CwqX' ) {

        if (this.person.clientRoles[this.idlab]) {
          this.person.clientRoles[this.idlab][this.rolSelect] = true;


        } else {

          this.person.clientRoles[this.idlab] = {};
          this.person.clientRoles[this.idlab][this.rolSelect] = true;
        }

        console.log(this.permisions);

        // asigna permisos dentro de app - roles porque es nivel 2.5 como unico rol
      } else {

        if (this.usuario.appRoles[this.idlab]) {
          this.usuario.appRoles[this.idlab][this.rolSelect] = true;


        } else {

          this.usuario.appRoles[this.idlab] = {};
          this.usuario.appRoles[this.idlab][this.rolSelect] = true;
        }

        console.log(this.permisions2);

      }

      console.log(this.niveles);



    } else {

      swal({
        type: 'info',
        title: 'Debe seleccionar el nuevo rol primero',
        showConfirmButton: true
      });

    }





  }


}
