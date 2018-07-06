
import { Observable } from 'rxjs/Observable';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ObservablesService } from '../../../shared/services/observables.service';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { AngularFirestore } from 'angularfire2/firestore';
import swal from 'sweetalert2';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-admin-proyectos',
  templateUrl: './admin-proyectos.component.html',
  styleUrls: ['./admin-proyectos.component.css']
})
export class AdminProyectosComponent implements OnInit {
  itemsel: Observable<Array<any>>;
  button = true;
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
    email: '',
    relatedEquipments: {},
    createdAt: this.fecha.toISOString(),
    updatedAt: this.fecha.toISOString()

  };

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
  dispo;

  constructor(private obs: ObservablesService, private afs: AngularFirestore) { }

  ngOnInit() {
    this.obs.currentObjectProy.subscribe(data => {
      console.log(data);

      this.proyestructurados = undefined;

      if (data.length !== 0) {

        if (!this.proyestructurados) {
          this.estructurarLab(data.uid).then(() => {
            this.itemsel = Observable.of(this.proyestructurados.proyectos);
            console.log(this.proyestructurados);


            this.id_lab = this.proyestructurados.uid;
            this.dataSourceProy.data = this.proyestructurados.proyectos;
            // inactivos
            this.dataSourceProyIn.data = this.proyestructurados.proyectosInactivo;



            this.dataSourcePers.data = this.proyestructurados.personal;
            const ambiente = this;

            swal({
              title: 'Cargando un momento...',
              text: 'espere mientras se cargan los datos',
              onOpen: () => {
                swal.showLoading();
              }
            });

            setTimeout(function () {
              if (ambiente.proyestructurados.proyectos !== 0) {
                ambiente.dataSourceProy.sort = ambiente.sortProy;
                ambiente.dataSourceProy.paginator = ambiente.paginatorProy;

                ambiente.dataSourceProyIn.sort = ambiente.sortProyIn;
                ambiente.dataSourceProyIn.paginator = ambiente.paginatorProyIn;
                // cierra loading luego de cargados los datos

                ambiente.dataSourcePers.sort = ambiente.sortPers;
                ambiente.dataSourcePers.paginator = ambiente.paginatorPers;

              }
              swal.close();
            }, 1500);

          });
        } else {

        }

      }
      this.estructurarLab(data.uid).then(() => {
        this.itemsel = Observable.of(this.proyestructurados);

      });




    });
  }


  estructurarLab(key) {
    this.proyestructurados = {};
    const promise = new Promise((resolve, reject) => {
      this.buscarLab(key).subscribe(labo => {
        const laboratorio = labo.payload.data();
        //   console.log(laboratorio);
        if (laboratorio) {

          this.proyestructurados = {
            uid: labo.payload.id,
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

  // METODO QUE TRAE UN DIRECTOR ESPECIFICO DEPENDIENDO EL ID-DIRECTOR
  buscarLab(idlab) {
    return this.afs.doc('cfFacil/' + idlab).snapshotChanges();

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
          this.afs.doc('project/' + clave).snapshotChanges().subscribe(data => {
            const project = data.payload.data();

            // funciona con una programacion, cuando hayan mas toca crear otro metodo
            const proyecto = {
              nombre: project.projectName,
              descripcion: project.projectDesc,
              ci: project.ciNumber,
              personal: this.estructurarPersonas(project.relatedPers),
              id_proj: data.payload.id,
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
          this.afs.doc('cfPers/' + clave).snapshotChanges().subscribe(data => {
            const pers = data.payload.data();
            let persona = {};
            if (pers.user) {
              this.afs.doc('user/' + pers.user).snapshotChanges().subscribe(dataper => {
                // funciona con una programacion, cuando hayan mas toca crear otro metodo
                if (dataper.payload.data()) {

                  persona = {
                    id: clave,
                    nombre: pers.cfFirstNames + ' ' + pers.cfFamilyNames,
                    activo: pers.active,
                    email: dataper.payload.data().email,
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
    this.button = true;

    this.proyecto.nombre = item.nombre;
    this.proyecto.descripcion = item.descripcion;
    this.proyecto.ci = item.ci;
    this.proyecto.estado = item.active;
    this.proyecto.personal = item.personal;
    this.id_proj = item.id_proj;
    console.log(item);


  }

  addPerstoProject() {

    const aux = this.proyecto.personal;

    let encontrado = false;
    const arrayselect = this.selection.selected;
    arrayselect.forEach(element => {
      console.log(element);
      for (let i = 0; i < aux.length; i++) {
        console.log(aux);
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
          showConfirmButton: true
        });

        this.proyecto.personal.push(element);

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

    console.log(this.proyecto.personal);

    if (this.proyecto.personal.length === 0) {
      swal({
        type: 'info',
        title: 'Primero debe vincular personal al laboratorio',
        showConfirmButton: true
      });
    } else {

      const proyect = {
        projectName: this.proyecto.nombre,
        ciNumber: this.proyecto.ci,
        projectDesc: this.proyecto.descripcion,
        active: this.proyecto.estado,
        relatedPers: {},
        updatedAt: this.fecha.toISOString()
      };

      this.proyecto.personal.forEach((element) => {

        console.log(element);
        proyect.relatedPers[element.idpers] = true;

      });


      console.log(proyect);


      this.afs.collection('project').add(proyect)
        .then((ok) => {

          const lab = { relatedProjects: {} };
          lab.relatedProjects[ok.id] = true;

          this.afs.doc('cfFacil/' + this.id_lab).set(lab, { merge: true });

          swal({
            type: 'success',
            title: 'Usuario ya vinculado',
            showConfirmButton: true
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

      console.log(element);
      proyect.relatedPers[element.idpers] = true;

    });

    this.afs.doc('project/' + this.id_proj).set(proyect, { merge: true })
      .then(() => {
        swal({
          type: 'success',
          title: 'Actualizado correctamente',
          showConfirmButton: true
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

      this.afs.collection('cfPers').add(persona).then((ok) => {
        const pro = {
          projectName: this.proyecto.nombre,
          ciNumber: this.proyecto.ci,
          projectDesc: this.proyecto.descripcion,
          active: this.proyecto.estado,
          relatedPers: {},
          updatedAt: this.fecha.toISOString()

        };
        pro.relatedPers[ok.id] = true;
        this.afs.doc('project/' + this.id_proj).set(pro, { merge: true }).then(() => {


          swal({
            type: 'success',
            title: ' Proyecto agregado correctamente',
            showConfirmButton: true
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

      this.afs.collection('cfPers').add(persona).then((ok) => {

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
        this.afs.doc('cfFacil/' + this.id_lab).set(lab, { merge: true });

        swal({
          type: 'success',
          title: ' Personal agregado correctamente',
          showConfirmButton: true
        });


        /*         const pro = {
                  projectName: this.proyecto.nombre,
                  ciNumber: this.proyecto.ci,
                  projectDesc: this.proyecto.descripcion,
                  active: this.proyecto.estado,
                  relatedPers: {},
                  updatedAt: this.fecha.toISOString()

                };
                pro.relatedPers[ok.id] = true;
                this.afs.collection('project/').add (pro) .then ( () => {


                  swal({
                    type: 'success',
                    title: ' Proyecto agregado correctamente',
                    showConfirmButton: true
                  });
                } ); */
      });
    }
  }
  applyFilter(filterValue: string) {

    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSourceProy.filter = filterValue;
  }


  clearModal() {

    this.button = false;

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

    console.log(q);

    if (q.trim() === '') {
      this.status = 'Campo obligatorio';
      // this.dispo = false;
    } else {
      this.status = 'Confirmando disponibilidad';
      const collref = this.afs.collection('project').ref;
      const queryref = collref.where('ciNumber', '==', q);
      queryref.get().then((snapShot) => {
        if (snapShot.empty) {
          this.status = 'CI disponible';
          this.dispo = true;
        } else {
          console.log(snapShot.docs[0].id);
          this.status = 'Ya existe un proyecto en el sistema con el CI ingresado, si desea vincularlo presione el boton vincular.';
          this.dispo = false;
          this.addP = snapShot.docs[0].id;
        }
      });
    }
  }

}
