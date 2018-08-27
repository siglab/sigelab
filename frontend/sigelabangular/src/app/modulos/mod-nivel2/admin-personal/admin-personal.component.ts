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
declare var $: any;
@Component({
  selector: 'app-admin-personal',
  templateUrl: './admin-personal.component.html',
  styleUrls: ['./admin-personal.component.css']
})
export class AdminPersonalComponent implements OnInit, AfterViewInit, OnDestroy {
  rolc = 'editar';
  itemsel: Observable<Array<any>>;
  tablesel = '';
  nombre;
  apellido;
  email;
  rol;
  estado;
  idu;
  idp;
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
    cfFacil: '',
    active: true,
    user: '',
    lvl: '',
    email: '',
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
  displayedColumnsPers = ['nombre', 'email', 'tipo'];
  dataSourcePers = new MatTableDataSource([]);

  @ViewChild('paginatorPers') paginatorPers: MatPaginator;
  @ViewChild('sortPers') sortPers: MatSort;

  // INICIALIZACION DATATABLE PERSONAL InActivo
  displayedColumnsPersIn = ['nombre', 'email', 'tipo'];
  dataSourcePersIn = new MatTableDataSource([]);

  @ViewChild('paginatorPersIn') paginatorPersIn: MatPaginator;
  @ViewChild('sortPersIn') sortPersIn: MatSort;




  status = '';
  dispo;

  sus: Subscription;

  constructor(private obs: ObservablesService,
    private afs: AngularFirestore,
    private toastr: ToastrService,
    private register: LoginService) { }

  ngOnInit() {

    this.sus = this.obs.currentObjectPer.subscribe(data => {

      if (data.length !== 0) {
        this.estructuraIdPers(data.uid).then(() => {


          // validators email


          this.idlab = data.uid;
          this.itemsel = Observable.of(this.persestructurado.personal);
          console.log(this.persestructurado);

          this.dataSourcePers.data = this.persestructurado.personal;
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


            }

            swal.close();

          }, 2000);

        });

      }




    });

  }

  ngOnDestroy() {
    this.sus.unsubscribe();
  }
  ngAfterViewInit(): void {
    // outputs `I am span`

  }



  estructuraIdPers(key) {

    const promise = new Promise((resolve, reject) => {
      this.buscarLab(key).subscribe(labo => {
        const laboratorio = labo.payload.data();

        let estadoLab;
        if (laboratorio.active === true) {
          estadoLab = 'Activo';
        } else if (laboratorio.active === false) {
          estadoLab = 'Inactivo';
        }

        this.persestructurado = {
          personal: this.estructurarPers(laboratorio.relatedPers),
          personalInactivo: this.estructurarPersIna(laboratorio.relatedPers),
          estado: estadoLab,
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
          this.afs.doc('cfPers/' + clave).snapshotChanges().subscribe(data => {
            const pers = data.payload.data();

            let persona = {};
            if (pers.user) {
              this.afs.doc('user/' + pers.user).snapshotChanges().subscribe(dataper => {
                const user = dataper.payload.data();
                // funciona con una programacion, cuando hayan mas toca crear otro metodo

                persona = {
                  roles: user.appRoles,
                  nombre: pers.cfFirstNames,
                  apellidos: pers.cfFamilyNames,
                  activo: pers.active,
                  tipo: pers.type,
                  email: user.email,
                  idpers: clave,
                  iduser: pers.user,
                };

                if (pers.active) {
                  arr1.push(persona);
                }

              });
            } else {

              persona = {
                roles: '',
                nombre: pers.cfFirstNames,
                apellidos: pers.cfFamilyNames,
                activo: pers.active,
                tipo: pers.type,
                email: pers.email,
                idpers: clave,
                iduser: pers.user,
              };

              if (pers.active) {
                arr1.push(persona);
              }
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
        if (item[clave]) {
          this.afs.doc('cfPers/' + clave).snapshotChanges().subscribe(data => {
            const pers = data.payload.data();
            let persona = {};

            if (pers.user) {
              this.afs.doc('user/' + pers.user).snapshotChanges().subscribe(dataper => {
                // funciona con una programacion, cuando hayan mas toca crear otro metodo
                persona = {
                  nombre: pers.cfFirstNames,
                  apellidos: pers.cfFamilyNames,
                  activo: pers.active,
                  tipo: pers.type,
                  email: dataper.payload.data().email,
                  roles: dataper.payload.data().appRoles,
                  idpers: clave,
                  iduser: pers.user,
                };

                if (!pers.active) {
                  arr1.push(persona);
                }

              });
            } else {
              persona = {
                nombre: pers.cfFirstNames,
                apellidos: pers.cfFamilyNames,
                activo: pers.active,
                tipo: pers.type,
                email: '',
                roles: '',
                idpers: clave,
                iduser: pers.user,
              };

              if (!pers.active) {
                arr1.push(persona);
              }


            }
          });
        }
      }
    }
    return arr1;
  }

  // METODO QUE TRAE UN DIRECTOR ESPECIFICO DEPENDIENDO EL ID-DIRECTOR
  buscarLab(idlab) {
    return this.afs.doc('cfFacil/' + idlab).snapshotChanges();

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
    this.apellido = item.apellidos;
    this.rol = item.tipo;
    this.idp = item.idpers;
    this.idu = item.iduser;


    // this.seleccionado = item;

  }

  actualizarPers() {


    if (!this.idu) {


      swal({
        type: 'info',
        title: 'La persona seleccionada aun no cuenta con un usuario asociado',
        showConfirmButton: true
      });
    } else {

      // $('#modal').modal('hide');

      /* objeto para persona  */
      const pers = {
        active: this.estado,
        cfFirstNames: this.nombre,
        cfFamilyNames: this.apellido,
        type: this.rol
      };
      /* objeto para usuario */
      const user = {
        active: this.estado,
        appRoles: ''
      };

      /* metodo que consulta el rol */

      console.log(' se va actualizar esta persona', pers);

      this.consultarRol().then((ok) => {

        user.appRoles = this.register.setBoolean(ok);
        /* metodo firebase para subir un usuario actualizado */

        this.afs.collection('user').doc(this.idu).set(user, { merge: true });

        console.log('usuario con el rol', user);

      }).then(() => {
        /* metodo firebase para subir una persona actualizada */
        this.afs.collection('cfPers/').doc(this.idp).update(pers).then(
          () => {
            swal({
              type: 'success',
              title: 'usuario actualizado correctamente',
              showConfirmButton: true
            });

          }

        );
      });

    }


  }



  /* metodo para crear una  nueva persona dentro dl lab*/

  setPers() {

    if (this.email) {
      this.person.email = this.email;
      const pers = this.person;
      pers.cfFacil = this.idlab;
      console.log(pers);
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

      this.toastr.info('Es necesario el campo email', 'Email requerido');

    }

  }

  /* metodo para crear un nuevo usuario relacionado a una persona */
  /*   setUser(idP) {

      console.log(idP);
      const user = this.usuario;
      user.cfPers = idP;
      console.log( 'usuario pa subir',  user);

      const password = '123456';


      //  agrega un nuevo usuario a firestore
      this.afs.collection('user').add(user).then( ok => {
          // actualiza el campo idusuario en el document persona
        this.updateFaciliti(  idP );
        this.updatePers( ok.id, idP  );
        }) ;

      // registra un usuario para logeuarse con mail
        this.register.createUser( user.email, password )
                .then(   () => {

                      // enviar email para que el usuario restablesca pass de inicio
                      this.register.sendEmail( user.email );
                      // cerrar modal
                      $('#modal1').modal('hide');


                });
    }
   */

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
          this.dispo = false;
          this.addP = snapShot.docs[0].id;
        }
      });
    }
  }

  addLabPers(id: string) {

    if (id) {
      const lab = {
        relatedPers: {}
      };


      const collref = this.afs.doc('cfFacil/' + this.idlab).ref;


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



}



