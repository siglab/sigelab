
import { Observable } from 'rxjs/Observable';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ObservablesService } from '../../../shared/services/observables.service';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import swal from 'sweetalert2';
import { SelectionModel } from '@angular/cdk/collections';
// tslint:disable-next-line:import-blacklist
import { Subscription } from 'rxjs';
import { Modulo2Service } from '../services/modulo2.service';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';

declare var $: any;
@Component({
  selector: 'app-admin-proyectos',
  templateUrl: './admin-proyectos.component.html',
  styleUrls: ['./admin-proyectos.component.css']
})
export class AdminProyectosComponent implements OnInit, OnDestroy {
  @ViewChild(SpinnerComponent) alert: SpinnerComponent;

  itemsel: Observable<Array<any>>;
  tableselect = false;
  button = true;
  fecha = new Date();
  semester;
  rolSelect;
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

  niveles = [];

  // proyectos activos
  newp = true;
  displayedColumnsProy = ['ci', 'nombre'];
  dataSourceProy = new MatTableDataSource([]);
  @ViewChild('paginatorProy') paginatorProy: MatPaginator;
  @ViewChild('sortProy') sortProy: MatSort;
  // proyectos inactivos
  displayedColumnsProyIn = ['ci', 'nombre'];
  dataSourceProyIn = new MatTableDataSource([]);
  @ViewChild('paginatorProyIn') paginatorProyIn: MatPaginator;
  @ViewChild('sortProyIn') sortProyIn: MatSort;


  displayedColumnsPers = ['nombre', 'email', 'estado', 'select'];
  dataSourcePers = new MatTableDataSource([]);
  @ViewChild('paginatorPers') paginatorPers: MatPaginator;
  @ViewChild('sortPers') sortPers: MatSort;

  selection = new SelectionModel(true, []);
  proyecto = {

    nombre: '',
    ci: '',
    descripcion: '',
    estado: false,
    personal: [],
    relatedPers: {}

  };

  id_lab;
  id_proj;
  proyestructurados: any;
  status;
  addP;
  dispo = true;

  sus: Subscription;

  role:any;
  moduloNivel2 = false;

  rolesAgregados = [];


  user = this.servicioMod2.getLocalStorageUser();

  constructor(private obs: ObservablesService,
              private servicioMod2: Modulo2Service) { }

  ngOnInit() {
    $('html, body').animate({ scrollTop: '0px' }, 'slow');
    this.getRolesNivel2();
    this.sus = this.obs.currentObjectProy.subscribe(data => {
      this.getRoles(data.roles);
      this.proyestructurados = undefined;

      if (data.length !== 0) {

        if (!this.proyestructurados) {
          this.estructurarLab(data.uid).then(() => {
            this.itemsel = Observable.of(this.proyestructurados.proyectos);


            this.dataSourcePers.data = this.proyestructurados.personal;
            this.id_lab = this.proyestructurados.uid;
            this.dataSourceProy.data = this.proyestructurados.proyectos;
            // inactivos
            this.dataSourceProyIn.data = this.proyestructurados.proyectosInactivo;

            swal({
              title: 'Cargando un momento...',
              text: 'Espere mientras se cargan los datos',
              onOpen: () => {
                swal.showLoading();
              }
            });

            setTimeout( () => {
              if (this.proyestructurados.proyectos != 0) {
                this.dataSourceProy.sort = this.sortProy;
                this.dataSourceProy.paginator = this.paginatorProy;

                this.dataSourceProyIn.sort = this.sortProyIn;
                this.dataSourceProyIn.paginator = this.paginatorProyIn;
                // cierra loading luego de cargados los datos

                this.dataSourcePers.sort = this.sortPers;
                this.dataSourcePers.paginator = this.paginatorPers;

                swal.close();
              } else {
                swal({
                  type: 'error',
                  title: 'No existen proyectos asociados al laboratorio',
                  showConfirmButton: true
                });
              }

            }, 1500);

          });
        }
      } else {

        swal({
          type: 'error',
          title: 'No se ha seleccionado ningún laboratorio',
          showConfirmButton: true
        });

      }
      this.estructurarLab(data.uid).then(() => {
        this.itemsel = Observable.of(this.proyestructurados);

      });




    });
  }

   // METODO QUE ME TRAE EL ROL DE ACCESSO A NIVEL 2
   getRoles(rol) {
    this.moduloNivel2 = false;
    for (const clave in rol) {
      if (rol[clave]) {
        if ((clave === 'moduloNivel2')) {
          this.moduloNivel2 = true;
        }
      }
    }
  }

  agregarRol(){

    let bool = false;

    this.rolesAgregados.forEach((doc, index) => {
      if (doc.id === this.rolSelect) {
        bool = true;
      }
    });

    if(bool){
      swal({
        type: 'error',
        title: 'El rol ya se encuentra agregado.',
        showConfirmButton: true
      });
    } else {
      this.rolesAgregados.push({id: this.rolSelect,
        nombre: this.niveles.find(o => o.id == this.rolSelect).nombre});
    }

  }

  quitarelemento(i){
    this.rolesAgregados.splice(i, 1);
  }

  nombreRoles(item){
    this.rolesAgregados = [];
    for (const key in item[this.id_lab]  ) {
      if (item[this.id_lab].hasOwnProperty(key)) {
        this.rolesAgregados.push({ id: key,
          nombre: this.niveles.find(o => o.id == key).nombre});
      }
    }
  }


  ngOnDestroy() {
    this.sus.unsubscribe();
  }

  estructurarLab(key) {
    this.proyestructurados = {};
    const promise = new Promise((resolve, reject) => {
      this.servicioMod2.buscarLab(key).then(labo => {
        const laboratorio = labo.data();
        if (laboratorio) {

          this.proyestructurados = {
            uid: labo.id,
            nombre: laboratorio.cfName,
            personal: this.estructurarPersonas(laboratorio.relatedPers),
            proyectos: this.estructurarProyectos(laboratorio.relatedProjects).arr,
            proyectosInactivo: this.estructurarProyectos(laboratorio.relatedProjects).arr2,
            estado: laboratorio.active
          };

        }
        resolve();

      });
    });

    return promise;

  }


  // METODO QUE ESTRUCTURA LA DATA DE LAS PRACTICAS EN LA VISTA BUSQUEDA DE LABORATORIOS
  // RECIBE EL NODO DE LABORATORIO QUE CONTIENE LAS PRACTICAS ASOCIADOS
  estructurarProyectos(item) {

    const arr = [];
    const arr2 = [];

    for (const clave in item) {
      // Controlando que json realmente tenga esa propiedad
      if (item.hasOwnProperty(clave)) {

        if (item[clave]) {
          this.servicioMod2.buscarProyectos(clave).then(data => {
            const project = data.data();

            // funciona con una programacion, cuando hayan mas toca crear otro metodo
            const proyecto = {
              nombre: project.projectName,
              descripcion: project.projectDesc,
              ci: project.ciNumber,
              personal: this.estructurarPersonas(project.relatedPers),
              id_proj: data.id,
              active: project.active
            };
            if (project.active) {

              arr.push(proyecto);

            } else {

              arr2.push(proyecto);
            }


          });
        }

      }
    }

    return { arr, arr2 };
  }

  // METODO QUE ESTRUCTURA LA DATA DE LAS PRACTICAS EN LA VISTA BUSQUEDA DE LABORATORIOS
  // RECIBE EL NODO DE LABORATORIO QUE CONTIENE LAS PRACTICAS ASOCIADOS
  estructurarPersonas(item) {

    const arr = [];

    for (const clave in item) {
      // Controlando que json realmente tenga esa propiedad
      if (item.hasOwnProperty(clave)) {

        if (item[clave]) {
          this.servicioMod2.buscarPersona(clave).then(data => {
            const pers = data.data();
            let persona = {};
            if (pers.user) {
              this.servicioMod2.buscarUsuario(pers.user).then(dataper => {
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
                }

              });
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

      }
    }

    return arr;
  }


  applyFilterProy(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSourceProy.filter = filterValue;
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.displayedColumnsPers.length;
    return numSelected === numRows;
  }
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSourcePers.data.forEach(row => this.selection.select(row));
  }

  cambiardata(item) {
    this.button = false;

    this.proyecto.nombre = item.nombre;
    this.proyecto.descripcion = item.descripcion;
    this.proyecto.ci = item.ci;
    this.proyecto.estado = item.active;
    this.proyecto.personal = item.personal;
    this.id_proj = item.id_proj;


  }

  addPerstoProject() {

    const aux = this.proyecto.personal;

    let encontrado = false;
    const arrayselect = this.selection.selected;
    arrayselect.forEach(element => {
      for (let i = 0; i < aux.length; i++) {
        const persona = aux[i];
        if (persona.id === element.id) {
          encontrado = true;
          break;
        }
      }

      if (!encontrado) {

        swal({
          type: 'success',
          title: 'Agregado correctamente',
          showConfirmButton: true,
          timer: 3000
        });

        this.proyecto.personal.push(element);

        this.tableselect = false;

      } else {

        swal({
          type: 'info',
          title: 'Usuario ya vinculado',
          showConfirmButton: true
        });

      }

    });

  }



  addProject() {
    if (this.proyecto.personal.length === 0) {
      swal({
        type: 'info',
        title: 'Primero debe vincular personal al proyecto',
        showConfirmButton: true
      });
    } else {

      const proyect = {
        projectName: this.proyecto.nombre,
        ciNumber: this.proyecto.ci,
        projectDesc: this.proyecto.descripcion,
        active: this.proyecto.estado,
        relatedPers: {},
        semester: this.semester,
        updatedAt: this.fecha.toISOString()
      };

      this.proyecto.personal.forEach((element) => {

        proyect.relatedPers[element.idpers] = true;

      });
      this.servicioMod2.addProyecto(proyect).then((ok) => {

        this.alert.show();
        this.servicioMod2.Trazability(
          this.user.uid, 'create', 'project', ok.id, proyect
        ).then(() => {
          const lab = { relatedProjects: {} };
          lab.relatedProjects[ok.id] = true;

          this.servicioMod2.Trazability(
            this.user.uid, 'update', 'cfFacil', this.id_lab, lab
          ).then(() => {
            this.servicioMod2.setDocLaboratorio(this.id_lab, lab);
            this.alert.hide();

            swal({
              type: 'success',
              title: ' ¡Éxito!',
              text: 'Datos almacenados con éxito!',
              showConfirmButton: true
            });

            this.cerrarModal('modal');
          });

      });
    });


    }


  }


  updateProject() {
    const proyect = {
      projectName: this.proyecto.nombre,
      ciNumber: this.proyecto.ci,
      projectDesc: this.proyecto.descripcion,
      active: this.proyecto.estado,
      relatedPers: {},
      updatedAt: this.fecha.toISOString()

    };

    this.proyecto.personal.forEach((element) => {
      proyect.relatedPers[element.idpers] = true;

    });

    this.servicioMod2.Trazability(
      this.user.uid, 'update', 'project', this.id_proj, proyect
    ).then( () => {
      this.alert.show();

      this.servicioMod2.setProyecto(this.id_proj, proyect)
        .then(() => {

          this.alert.hide();

          swal({
            type: 'success',
            title: 'Actualizado correctamente',
            showConfirmButton: true
          });
      });

    });

  }

  updatedSingleProject() {

    if (!this.person.email) {
      swal({
        type: 'info',
        title: 'Es necesario el email',
        showConfirmButton: true
      });
    } else {
      const persona = this.person;

      this.servicioMod2.addPersona(persona).then((ok) => {
        this.servicioMod2.Trazability(
          this.user.uid, 'create', 'cfPers', ok.id, persona
        ).then(()=>{
          const pro = {
            projectName: this.proyecto.nombre,
            ciNumber: this.proyecto.ci,
            projectDesc: this.proyecto.descripcion,
            active: this.proyecto.estado,
            relatedPers: {},
            updatedAt: this.fecha.toISOString()

          };
          pro.relatedPers[ok.id] = true;
          this.servicioMod2.Trazability(
            this.user.uid, 'update', 'project', this.id_proj, pro
          ).then(()=>{
            this.servicioMod2.setProyecto(this.id_proj, pro).then(() => {

              swal({
                type: 'success',
                title: ' Proyecto agregado correctamente',
                showConfirmButton: true
              });
            });
          });
        });

      });
    }
  }


  addSingleProject() {

    if (!this.person.email) {
      swal({
        type: 'info',
        title: 'Es necesario el email',
        showConfirmButton: true
      });
    } else {
      const persona = this.person;

      persona.clientRole[this.id_lab] = {};

      this.rolesAgregados.forEach(doc => {
        persona.clientRole[this.id_lab][doc.id] = true;
      });

     this.servicioMod2.addPersona(persona).then((ok) => {

      this.servicioMod2.Trazability(
        this.user.uid, 'create', 'cfPers', ok.id, persona
      ).then(()=>{
        const per = {
          activo: persona.active,
          idpers: ok.id,
          email: persona.email,
          iduser: '',
          nombre: persona.cfFirstNames + ' ' + persona.cfFamilyNames
        };

        this.proyecto.personal.push(per);

        const lab = { relatedPers: {} };

        lab.relatedPers[ok.id] = true;

        this.servicioMod2.Trazability(
          this.user.uid, 'update', 'project', this.id_proj, lab
        ).then(()=>{
          this.servicioMod2.setDocLaboratorio(this.id_lab, lab);
          swal({
            type: 'success',
            title: ' Personal agregado correctamente',
            showConfirmButton: true
          });
        });
      });

     });


    }
  }
  applyFilter(filterValue: string) {

    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSourceProy.filter = filterValue;
  }


  clearModal() {


    this.button = true;
    this.proyecto.ci = '';
    this.proyecto.descripcion = '';
    this.proyecto.estado = true;
    this.proyecto.nombre = '';
    this.proyecto.personal = [];

  }

  editPers(item) {
    console.log(item);
  }

  ciCheck($event) {

    this.addP = '';
    const q = $event.target.value;
    if (q.trim() === '') {

      this.status = 'Campo obligatorio';
      // this.dispo = false;
    } else {
      this.status = 'Confirmando disponibilidad';

      this.servicioMod2.getProyectForCi(q).then((snapShot) => {
        if (snapShot.empty) {
          this.status = 'CI no encontrado, ingrese los datos del nuevo proyecto';
          this.dispo = true;
        } else {
          this.status = 'Ya existe un proyecto en el sistema con el CI ingresado, si desea vincularlo presione el botón vincular.';
          this.dispo = false;
          this.addP = snapShot.docs[0].id;
        }
      });
    }
  }

  cerrarModal(modal) {
    $('#' + modal).modal('hide');
  }

  getRolesNivel2() {
    this.servicioMod2.getAppRoles().then(datos => {
      datos.forEach(doc => {
        if (doc.data().lvl === 'perfiles2') {

          this.niveles.push({ id: doc.id, nombre: doc.data().roleName });
        }
      });
    });
  }

  setClientRol() {

    this.person.clientRole [this.id_lab] = {};
    this.person.clientRole [this.id_lab] [this.rolSelect] = true;
  }

}
