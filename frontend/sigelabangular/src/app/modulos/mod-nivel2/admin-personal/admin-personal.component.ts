import { LoginService } from './../../login/login-service/login.service';
import { ObservablesService } from './../../../shared/services/observables.service';
import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from 'angularfire2/firestore';
declare var $: any;
@Component({
  selector: 'app-admin-personal',
  templateUrl: './admin-personal.component.html',
  styleUrls: ['./admin-personal.component.css']
})
export class AdminPersonalComponent implements OnInit, AfterViewInit, OnDestroy {

  itemsel: Observable<Array<any>>;
  tablesel = '';
  nombre;
  apellido;
  rol;
  email;
  estado;
  idu;
  idp;
  activos = [];
  inactivos = [];
  fecha = new Date();
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
    type: '',
    relatedEquipments: {},
    createdAt: this.fecha.toISOString(),
    updatedAt: this.fecha.toISOString()

  };
  // objeto usuario

  usuario = {
    email: '',
    cfOrgUnit: 'UK6cYXc1iYXCdSU30xmr',
    roles: { V3zDhknEIY0vbjok3Ntq: true   },
    cfPers: '',
    active: true,
    createdAt: this.fecha.toISOString(),
    updatedAt: this.fecha.toISOString()

  };


  // INICIALIZACION DATATABLE PERSONAL Activo
  displayedColumnsPers = ['nombre', 'email', 'tipo' ];
  dataSourcePers = new MatTableDataSource([]);

  @ViewChild('paginatorPers') paginatorPers: MatPaginator;
  @ViewChild('sortPers') sortPers: MatSort;

  // INICIALIZACION DATATABLE PERSONAL InActivo
  displayedColumnsPersIn = ['nombre', 'email', 'tipo'];
  dataSourcePersIn = new MatTableDataSource([]);

  @ViewChild('paginatorPersIn') paginatorPersIn: MatPaginator;
  @ViewChild('sortPersIn') sortPersIn: MatSort;








  constructor(private obs: ObservablesService,
              private afs: AngularFirestore,
              private register: LoginService) { }

  ngOnInit() {
    this.obs.currentObject.subscribe(data => {
      if (data.personal) {
        console.log(data);
        this.itemsel = Observable.of(data);

        data.personal.forEach(element => {

          if (element.activo === true) {

            if (element !== this.activos[0]) {
              this.activos.push(element);
            }

            console.log('is true', element);
          } else {

            if (element !== this.inactivos[0]) {
              this.inactivos.push(element);
            }
          }

        });


        console.log('entro');
        this.dataSourcePers.data = this.activos;
        this.dataSourcePersIn.data = this.inactivos;


      }


      console.log('datos personal', data);
      swal({
        title: 'Cargando un momento...',
        text: 'espere mientras se cargan los datos',
        onOpen: () => {
          swal.showLoading();
        }
      });

      const ambiente = this;
      setTimeout(function () {

        ambiente.dataSourcePers.sort = ambiente.sortPers;
        ambiente.dataSourcePers.paginator = ambiente.paginatorPers;
        ambiente.dataSourcePersIn.sort = ambiente.sortPersIn;
        ambiente.dataSourcePersIn.paginator = ambiente.paginatorPersIn;


        swal.close();

      }, 1000);

    });

  }

  ngOnDestroy() {
  }
  ngAfterViewInit(): void {
    // outputs `I am span`

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



    // this.actualizarPers( item.iduser, item.idpers, item.nombre, item.email, item.activo  );
    // this.seleccionado = item;

  }

  actualizarPers() {
    // cierra el model this.idu, this.idp,this.nombre, this.email,  this.estado
    $('#modal').modal('hide');

    let state: boolean;

    if ( this.estado === 'false') {

      state = false;

    } else {

      state = true;

    }

    /* validar  */
   //  console.log(idU, idP, nombre, email, estado);

    /* objeto para persona  */
    const pers = {
      active: state,
      cfFirstNames : this.nombre,
      cfFamilyNames: this.apellido
    };
    /* objeto para usuario */
    const user = {
      estado : state
    };

    /* metodo firebase para subir una persona actualizada */
    this.afs.collection('cfPers/').doc(this.idp).update(pers).then(
       () => {
        swal({
          type: 'success',
          title: 'usuario actualizado correctamente',
          showConfirmButton: true
        });

        /* elimina de array  inactivos <-> activos */
        this.setArray();
       }

    );
    /* metodo firebase para subir un usuario actualizado */
    // this.afs.collection('user/').doc( idU ).update (user);



  }


  /* metodo para crear una  nueva persona dentro dl lab*/

  setPers() {

    const pers = this.person;

    console.log(pers);
    this.afs.collection('cfPers').add(pers)
      .then(ok => {

        this.setUser(ok.id);

      });
  }

  /* metodo para crear un nuevo usuario relacionado a una persona */
  setUser(idP) {

    console.log(idP);
    const user = this.usuario;
    user.cfPers = idP;
    console.log( 'usuario pa subir',  user);

   const password = '123456';


   //  agrega un nuevo usuario a firestore
   this.afs.collection('user').add(user).then( ok => {
       // actualiza el campo idusuario en el document persona
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


  /* actualizar la coleccion cfPers con el nuevo id del usuario */

  updatePers( idU, pathP ) {

    this.afs.collection('cfPers' ).doc(pathP).update( { user: idU  } );

  }

  /* actualizar el laboratorio con el nuevo id del document pers */

  updateFaciliti( idP, pathF ) {

    const  relatedPers = this.register.setBoolean(  idP );

    console.log(relatedPers);
    this.afs.collection('cfFacil' ).doc(pathF).set({   relatedPers   }  , { merge: true });

  }

  /* metodo para mover personal inactivo a personal activo */
  setArray() {

    const activo = this.activos;
    const inactivo = this.inactivos;

    if (this.tablesel === 'activos') {

      activo.find((element, index) => {
        if (element.nombre === this.nombre) {

          console.log('se encontro el elemento', element, index);
          activo.splice(index, 1);
          inactivo.push(element);
          this.inactivos = inactivo;
          return true;

        }
      });

    } if (this.tablesel === 'inactivos') {

      inactivo.find((element, index) => {
        if (element.nombre === this.nombre) {

          console.log('se encontro el elemento', element, index);
          inactivo.splice(index, 1);
          activo.push(element);
          this.activos = activo;
          return true;

        }
      });



    }

  }
}


