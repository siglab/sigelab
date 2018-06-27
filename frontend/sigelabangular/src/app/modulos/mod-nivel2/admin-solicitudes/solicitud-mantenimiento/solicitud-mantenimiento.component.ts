import { ObservablesService } from './../../../../shared/services/observables.service';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import swal from 'sweetalert2';

@Component({
  selector: 'app-solicitud-mantenimiento',
  templateUrl: './solicitud-mantenimiento.component.html',
  styleUrls: ['./solicitud-mantenimiento.component.css']
})
export class SolicitudMantenimientoComponent implements OnInit {
  itemsel: Observable<Array<any>>;

  datos:any;
  histodatos:any;

  displayedColumns = ['nombre', 'fecha', 'email', 'estado'];
  displayedColumns2 = ['nombre', 'fecha', 'laboratorio', 'estado'];

  dataSource = new MatTableDataSource([]);
  dataSource2 = new MatTableDataSource([]);

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('sort') sort: MatSort;

  @ViewChild('paginator2') paginator2: MatPaginator;
  @ViewChild('sort2') sort2: MatSort;
  

  constructor(private obs: ObservablesService, private afs: AngularFirestore) {
   }

  ngOnInit() {
    this.obs.currentObjectSolMan.subscribe(data => {
      if(data.length != 0){
        this.alertaCargando();

        this.getCollectionSolicitudes(data.uid).subscribe(data1 => {
          this.datos = this.estructurarSolicitudesActivas(data1, data);
          this.histodatos = this.estructurarHistorialSolicitudes(data1, data);
          console.log(this.datos);
          this.dataSource.data = this.datos;
          this.dataSource2.data = this.histodatos;
          
            setTimeout(() => {
              if(this.datos){
                this.dataSource.sort = this.sort;
                this.dataSource.paginator = this.paginator;
              }

              if(this.histodatos){
                this.dataSource2.sort = this.sort2;
                this.dataSource2.paginator = this.paginator2;
              }
              this.cerrarAlerta();
            }, 1500);
                     
        });
      }
    });
  }

  getCollectionSolicitudes(labid) {
    return this.afs.collection('request',
      ref => ref.where('requestType', '==', 'mantenimiento')).snapshotChanges();
  }

  estructurarSolicitudesActivas(data, lab) {
    const activo = [];

    for (let index = 0; index < data.length; index++) {
      const elemento = data[index].payload.doc.data();

      const Solicitud = {
        uidlab: elemento.cfFacil,
        uidespacio: elemento.headquarter,
        nombrelab: lab.nombre.nom1 + ' ' + lab.nombre.nom2,
        status: elemento.status,
        tipo: elemento.maintenanceType,
        descripcion: elemento.requestDesc,
        usuario: elemento.createdBy,
        activo: elemento.active,
        equipos: this.estructurarEquipos(elemento.relatedEquipments),
        componentes: elemento.conditionsLog,
        fecha: elemento.createdAt.split('T')[0],
        proveedores: elemento.providersInfo
      };
      activo.push(Solicitud);

    }

    return activo;
  }

  estructurarHistorialSolicitudes(data, lab) {

    const historial = [];

    for (let index = 0; index < data.length; index++) {
      const elemento = data[index].payload.doc.data();
      const Solicitud = {
        uidlab: elemento.cfFacil,
        uidespacio: elemento.headquarter,
        nombrelab: lab.nombre.nom1 + ' ' + lab.nombre.nom2,
        status: elemento.status,
        tipo: elemento.maintenanceType,
        descripcion: elemento.requestDesc,
        usuario: elemento.createdBy,
        activo: elemento.active,
        equipos: this.estructurarEquipos(elemento.relatedEquipments),
        componentes: elemento.conditionsLog,
        fecha: elemento.createdAt.split('T')[0],
        proveedores: elemento.providersInfo
      };
      
      historial.push(Solicitud);

    }

    return historial;
  }


  // METODO QUE ESTRUCTURA LA DATA DE LAS PRACTICAS EN LA VISTA BUSQUEDA DE LABORATORIOS
  // RECIBE EL NODO DE LABORATORIO QUE CONTIENE LAS PRACTICAS ASOCIADOS
  estructurarEquipos(item) {

    const arr = [];

    for (const clave in item) {
      // Controlando que json realmente tenga esa propiedad
      if (item.hasOwnProperty(clave)) {

        if (item[clave]) {
           this.afs.doc('cfEquip/' + clave).snapshotChanges().subscribe(data => {
           const equip =  data.payload.data();

             // funciona con una programacion, cuando hayan mas toca crear otro metodo
                const equipo = {
                  id: data.payload.id,
                  nombre: equip.cfName,
                  activo: equip.active,
                  precio: equip.price,
                  componentes:this.estructurarComponents(clave),
                };
                
                arr.push(equipo);
           });
        }

      }
    }

    return arr;
  }


      // METODO QUE ESTRUCTURA LA DATA DE LOS COMPONENTES EN LA VISTA BUSQUEDA DE LABORATORIOS
  // RECIBE EL NODO DE LABORATORIO QUE CONTIENE LAS PRACTICAS ASOCIADOS
  estructurarComponents(item){
    const arr = [];

    this.afs.collection('cfEquip/' + item + '/components').snapshotChanges().subscribe(data => {
      for (let i = 0; i < data.length; i++) {
        const element = data[i].payload.doc.data();

          const componente = {
            id: data[i].payload.doc.id,
            nombre: element.cfName,
            descripcion: element.cfDescription,
            precio: element.cfPrice,
            marca: element.brand,
            modelo: element.model,
            estado: element.active
          };
  
          arr.push(componente);
          
      }

     });

     return arr;
  }


  alertaCargando(){
    swal({
      title: 'Cargando un momento...',
      text: 'espere mientras se cargan los datos',
      onOpen: () => {
        swal.showLoading();
      }
    });
  }

  alertaExito(mensaje){
    swal({
      type: 'success',
      title: mensaje,
      showConfirmButton: true
    });
  }

  alertaError(mensaje){
    swal({
      type: 'error',
      title: mensaje,
      showConfirmButton: true
    });
  }

  cerrarAlerta(){
    swal.close();
  }
}
