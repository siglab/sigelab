import { Observable } from 'rxjs/Observable';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ObservablesService } from '../../../shared/services/observables.service';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { AngularFirestore } from 'angularfire2/firestore';
import swal from 'sweetalert2';

@Component({
  selector: 'app-admin-proyectos',
  templateUrl: './admin-proyectos.component.html',
  styleUrls: ['./admin-proyectos.component.css']
})
export class AdminProyectosComponent implements OnInit {
  itemsel: Observable<Array<any>>;

  displayedColumnsProy = ['ci','nombre'];
  dataSourceProy = new MatTableDataSource([]);
  @ViewChild('paginatorProy') paginatorProy: MatPaginator;
  @ViewChild('sortProy') sortProy: MatSort;

  displayedColumnsPracIn = ['nombre', 'programacion.semestre', 'programacion.estudiantes', 'activo'];
  dataSourcePracIn = new MatTableDataSource([]);
  proyectos = {

  };

  proyestructurados:any;

  constructor(private obs: ObservablesService, private afs: AngularFirestore) { }

  ngOnInit() {
    this.obs.currentObjectProy.subscribe(data => {
      console.log(data);

      this.proyestructurados = undefined;

      if(data.length != 0){
        swal({
          title: 'Cargando un momento...',
          text: 'espere mientras se cargan los datos',
          onOpen: () => {
            swal.showLoading();
          }
        });
        if(!this.proyestructurados){
          this.estructurarLab(data.uid).then(() => {
            this.itemsel = Observable.of(this.proyestructurados.proyectos);
             console.log(this.proyestructurados);

            this.dataSourceProy.data = this.proyestructurados.proyectos;
   
            const ambiente = this;
      
             setTimeout(function() {
               if (ambiente.proyestructurados.proyectos != 0) {
                 ambiente.dataSourceProy.sort = ambiente.sortProy;
                 ambiente.dataSourceProy.paginator = ambiente.paginatorProy;
                  // cierra loading luego de cargados los datos               
               }
              
             }, 1500);
    
          });
        } else {
          swal.close();
        }
        
      
      }
      this.estructurarLab(data.uid).then(()=>{
        this.itemsel = Observable.of(this.proyestructurados);
        
      });




    });
  }


  estructurarLab(key){
    this.proyestructurados = {};
    let promise = new Promise((resolve,reject)=>{
      this.buscarLab(key).subscribe(labo => {
        const laboratorio = labo.payload.data();
        console.log(laboratorio);
        
        let estadoLab;
        if (laboratorio.active === true) {
          estadoLab = 'Activo';
        } else if ( laboratorio.active === false ) {
          estadoLab = 'Inactivo';
        }

        this.proyestructurados = {
          uid: labo.payload.id,
          nombre: laboratorio.cfName,
          personal: this.estructurarPersonas(laboratorio.relatedPers),
          proyectos: this.estructurarProyectos(laboratorio.relatedProjects),
          estado: estadoLab
        };


        resolve();

      })
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

    for (const clave in item) {
      // Controlando que json realmente tenga esa propiedad
      if (item.hasOwnProperty(clave)) {

        if (item[clave]) {
           this.afs.doc('project/' + clave).snapshotChanges().subscribe(data => {
            const project =  data.payload.data();

              // funciona con una programacion, cuando hayan mas toca crear otro metodo
              const proyecto = {
                nombre: project.projectName,
                descripcion: project.projectDesc,
                ci: project.ciNumber,
                personal: this.estructurarPersonas(project.relatedPers),
                uid: data.payload.id
              };

              arr.push(proyecto);

           });
        }

      }
    }

    return arr;
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
            const pers =  data.payload.data();
            if(pers){
              this.afs.doc('user/' + pers.user).snapshotChanges().subscribe(dataper => {
                // funciona con una programacion, cuando hayan mas toca crear otro metodo
                if(dataper.payload.data()){

                  const persona = {
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

}
