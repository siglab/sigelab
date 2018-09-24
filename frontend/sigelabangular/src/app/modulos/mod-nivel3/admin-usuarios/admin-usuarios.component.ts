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

declare var $: any;

@Component({
  selector: 'app-admin-usuarios',
  templateUrl: './admin-usuarios.component.html',
  styleUrls: ['./admin-usuarios.component.css']
})
export class AdminUsuariosComponent implements OnInit {
  rolc = '';
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
  inactivos = [];
  fecha = new Date();
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
  displayedColumnsPers = ['nombre', 'email', 'perfiles'];
  dataSourcePers = new MatTableDataSource([]);

  @ViewChild('paginatorPers') paginatorPers: MatPaginator;
  @ViewChild('sortPers') sortPers: MatSort;

  // INICIALIZACION DATATABLE PERSONAL InActivo
  displayedColumnsPersIn = ['nombre', 'email', 'tipo', 'estado', 'codigo' ];
  dataSourcePersIn = new MatTableDataSource([]);

  @ViewChild('paginatorPersIn') paginatorPersIn: MatPaginator;
  @ViewChild('sortPersIn') sortPersIn: MatSort;




  status = '';
  dispo;

  sus: Subscription;

  role: any;
  moduloNivel2 = false;

  niveles = [];

  constructor(private obs: ObservablesService,
    private afs: AngularFirestore,
    private toastr: ToastrService,
    private register: LoginService) { }

  ngOnInit() {
    $('html, body').animate({ scrollTop: '0px' }, 'slow');

    this.getRolesNivel2();

    this.getRoles();

    this.estructuraIdPers().then(data => {

      // validators email

      console.log(data['user']);

      this.dataSourcePers.data = data['user'];
      this.dataSourcePersIn.data = this.persestructurado.personalInactivo;

      const ambiente = this;

      swal({
        title: 'Cargando un momento...',
        text: 'espere mientras se cargan los datos',
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
        const element = datos[i].payload.doc.data();
        if (element.lvl === 'perfiles2') {

          this.niveles.push({ id: datos[i].payload.doc.id, nombre: element.roleName });
          console.log(this.niveles);

        }


      }
    });
  }


  estructuraIdPers() {
    const usuarios = []
    const promise = new Promise((resolve, reject) => {
      this.buscarUsuarios().then(user => {

        user.forEach(doc => {
          const element = doc.data();
          console.log(element.cfPers);
          this.getPersona(element.cfPers).then(data => {
            this.nombresRoles(element.appRoles).then(rol => {
              console.log(rol['role']);
              const usuario  = {
                id:doc.id,
                nombre: data.data().cfFirstNames + ' ' + data.data().cfFamilyNames,
                idPers:element.cfPers,
                email:element.email,
                roles: rol['role']
              };

              usuarios.push(usuario);
            });

            console.log(user.size, usuarios.length);
            if(user.size == usuarios.length){
              resolve({user:usuarios});
            }

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

  getPersona(id){
    return this.afs.collection('cfPers').doc(id).ref.get();
  }

  nombresRoles(roles){
    let nameroles = '';
    let sixe = 0;
    for (const key in roles) {
      if (roles.hasOwnProperty(key)) {
       if(roles[key]){
        sixe++;
       }       
      }
    }
    let contador = 0;
    let promise = new Promise((resolve, reject) => {
      for (const key in roles) {
        if (roles.hasOwnProperty(key)) {
          if(roles[key]){
            this.consultarNombreRol(key).then(doc => {
              nameroles += doc.data().roleName + ',';
              contador++;
              if(sixe == contador){
                resolve({role:nameroles});
              }
            });
          }
          
        }
   
      }
      
    });

    return promise;
  }

  consultarNombreRol(id){
    return this.afs.collection('appRoles').doc(id).ref.get();
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

  applyFilterPers(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSourcePers.filter = filterValue;
  }

  cambiardata(item, table) {
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
      this.afs.collection('user').doc(this.idu).set(user, { merge: true })
        .then(() => {
        });

    }
    this.afs.collection('cfPers/').doc(this.idp).set(pers, { merge: true }).then(
      () => {

        this.afs.doc('cfFacil/' + this.idlab).set(nuevoEstado, { merge: true });
        swal({
          type: 'success',
          title: 'usuario actualizado correctamente',
          showConfirmButton: true
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

      this.afs.doc('cfFacil/' + this.idlab).set(lab, { merge: true })
        .then(() => {

          $('#modal1').modal('hide');
          this.toastr.success('Almacenado correctamente.', 'exito!');
        });
    } else {

      this.toastr.warning('Ocurrio un error, intente ingresar el email otra vez.');

    }


  }


  cerrarModal(modal) {
    $('#' + modal).modal('hide');
  }

  setValue() {

    this.email = '';
  }

}
