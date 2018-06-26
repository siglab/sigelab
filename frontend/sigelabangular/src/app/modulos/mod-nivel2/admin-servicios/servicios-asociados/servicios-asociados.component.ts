import { Observable } from 'rxjs/Observable';
import { ObservablesService } from './../../../../shared/services/observables.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from 'angularfire2/firestore';
import swal from 'sweetalert2';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';

@Component({
  selector: 'app-servicios-asociados',
  templateUrl: './servicios-asociados.component.html',
  styleUrls: ['./servicios-asociados.component.css']
})
export class ServiciosAsociadosComponent implements OnInit {

  itemsel:any;

  private collectionReserv: AngularFirestoreCollection<any>;

  servasocestructurados:any;

  // INICIALIZACION DATATABLE lABORATORIOS
  displayedColumns = ['nombreserv'];
  dataSource = new MatTableDataSource([]);
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('sort') sort: MatSort;

  campoCondicion = '';
  condicionesobjeto = {};
  variation:any;
  variacionSel = "";

  moduloinfo = false;

  iconos = {
    info:false,
    sabs:false
  }

  constructor(private obs: ObservablesService, private afs: AngularFirestore) { }

  ngOnInit() {
    this.obs.currentObjectServAsoc.subscribe(data => {
      console.log(data);
      this.getCollectionServ(data.uid).subscribe(servicios =>{
        console.log(servicios);
        this.servasocestructurados = this.estructurarDataServ(servicios);
        console.log(this.servasocestructurados);
        if(this.servasocestructurados){
          this.dataSource.data = this.servasocestructurados;

          setTimeout(() => {
            
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
            // cierra loading luego de cargados los datos
            swal.close();
          }, 1000);

        }

      });

    });
  }

  getCollectionServ(labid) {
    this.collectionReserv = this.afs.collection('cfSrv',
      ref => ref.where('cfFacil', '==', labid));

    return this.collectionReserv.snapshotChanges();
  }

  // METODO QUE ESTRUCTURA LA DATA PARA LA VISTA BUSQUEDA DE SERVICIOS
  estructurarDataServ(data: any) {

    this.servasocestructurados = [];

    for (let index = 0; index < data.length; index++) {
      const elemento = data[index].payload.doc.data();

      // convertir boolean a cadena de caracteres para estado del laboratorio
      let estadoServ;
      if(elemento.active == true) {
        estadoServ = 'Activo';
      } else if( elemento.active == false ) {
        estadoServ = 'Inactivo';
      }

      const servicios = {
        nombreserv: elemento.cfName,
        infoServ: {
          descripcion: elemento.cfDesc,
          precio: elemento.cfPrice,
          estado: estadoServ,
          variaciones: this.variations(data[index].payload.doc.id),
          condiciones: elemento.cfCondition,
          uid: data[index].payload.doc.id
        }
      };

      this.servasocestructurados.push(servicios);



    }

    return this.servasocestructurados;
  }

  // METODO QUE ESTRUCTURA LAS VARIACIONES DE UN SERVICIO
  variations(clave){

    const variaciones = [];
    this.afs.doc('cfSrv/' + clave).collection('variations').snapshotChanges().subscribe(data => {
      if(data){
        for (let i = 0; i < data.length; i++) {
          const element = data[i].payload.doc.data();

          variaciones.push({data: element, id: data[i].payload.doc.id});
        }
      } else {
        return variaciones;
      }

    });
    return variaciones;
  }

     // METODO QUE BUSCA LA VARIACION QUE COINCIDE CON EL ID ENVIADO DESDE LA VISTA
     buscarVariacion(item){
      for (let i = 0; i < this.itemsel.infoServ.variaciones.length; i++) {
        const element = this.itemsel.infoServ.variaciones[i];
        if(element.id == item){
          return element;
        }   
      }
    }
  
    cambiarVariacion(item){
  
      if(item != 'inicial'){
        this.variation = this.buscarVariacion(item);
        console.log(this.variation);
        this.estructurarVariaciones(this.variation.data.cfConditions);
      } else {
        this.variation = undefined;
      }
  
  
    }
  
    //METODO QUE ME ESTRUCTURA EL ARREGLO DE CONDICIONES PARA EL OBJETO RESERVAS DE SERVICIOS
    estructuraCondiciones(variations){
      const arr = [];
      for (let i = 0; i < variations.length; i++) {
        const element = variations[i];
  
        const vari = {
          conditionText: variations[i],
          aceptada: this.condicionesobjeto["checkbox"+i]
        }
        arr.push(vari);
      }
      return arr;
    }
  
    // ESTRUCTURA OBJETO JSON QUE SE ENLAZA A LOS CHECKBOX DE LA VISTA DE MANERA DINAMICA
    estructurarVariaciones(condiciones){
      this.condicionesobjeto = {};
      for (let i = 0; i < condiciones.length; i++) {
        //const element = condiciones[i];
        this.condicionesobjeto["checkbox"+i] = true;
      }
    }

    cambiardata(item) { 
      console.log(item);
      this.variation = undefined;
      this.campoCondicion = '';
       /*  navega hacia bajo para mostrar al usuario la posicion de los datos */
      this.itemsel = item;
  
      if(item.infoServ.variaciones.length == 0){
        if(item.infoServ.condiciones.length !== 0){
          this.estructurarVariaciones(item.infoServ.condiciones);
        }
  
      }
      this.moduloinfo = true;
      
    }


  cambiarIcono(box){
    if(!this.iconos[box]){
      this.iconos[box] = true;
    } else {
      this.iconos[box] = false;
    }
  }

}
