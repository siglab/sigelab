
import { ObservablesService } from './../../../../shared/services/observables.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { AfterViewInit, Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { AngularFirestoreCollection, AngularFirestore } from 'angularfire2/firestore';

declare var $: any;

@Component({
  selector: 'app-solicitudes-servicio',
  templateUrl: './solicitudes-servicio.component.html',
  styleUrls: ['./solicitudes-servicio.component.css']
})
export class SolicitudesServicioComponent implements OnInit, AfterViewInit, OnDestroy  {


moduloinfo = false;

itemsel: any;

// service: Observable<Array<any>>;
service: any;
histoservice: any;


servicioso = [{nombre:"QUIMICA",coord:{lat:"3.425906",lon:"-76.540446"},info:{dir: "cra54 cambulos",tel:"53454636",cel:"43656537",email:"jkhkhjk@univalle.edu.co"},estado:"NO ACEPTADO"},
                {nombre:"INVESTIGACION",coord: {lat:'3.419737',lon:'-76.540275'}, info:{dir: 'cra54 san fernado', tel:'53454543gdf636',cel:'43656537',email:'fdgfgjh@univalle.edu.co'},estado:'NO ACEPTADO'},
                {nombre:'MODELADO', coord: {lat: '3.420380', lon: '-76.510105'}, info: {dir: 'cra54 sfdfsdfs', tel: '35345435', cel: '436574676537', email: 'fgjh@univalle.edu.co'}, estado: 'NO ACEPTADO'},
                {nombre: 'YODURO', coord: {lat: '3.403437', lon: '-76.511292'}, info: {dir: 'cra54 dfsdfsdf', tel: '46363565', cel: '4357547656537', email: 'hkjkhjjh@univalle.edu.co'}, estado: 'ACEPTADO'}];


  displayedColumns = ['nombre', 'telefono', 'email', 'estado'];
  displayedColumns2 = ['nombre', 'telefono', 'email', 'fecha'];

  dataSource = new MatTableDataSource([]);
  dataSource2 = new MatTableDataSource([]);

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('sort') sort: MatSort;

  @ViewChild('paginator2') paginator2: MatPaginator;
  @ViewChild('sort2') sort2: MatSort;
  
   // INICIALIZACION DE CONSULTAS PARA SERVICIOS RESERVADOS POR EL USUARIO
   private collectionReserv: AngularFirestoreCollection<any>;

   private collectionHisto: AngularFirestoreCollection<any>;

   datos:any;
   histodatos:any;


constructor(private obs: ObservablesService, private afs: AngularFirestore) {
 //this.obs.changeSolServ(this.servicioso);
}

  ngOnInit() {

    this.obs.currentObject.subscribe(data => {

      this.getCollectionReserv(data.uid).subscribe(data1 => {
        this.datos = this.estructurarServiciosActivos(data1);
        console.log(this.datos);
      });

      this.getCollectionsHisto(data.uid).subscribe(data2 => {
        this.histodatos = this.estructurarHistoriaServicios(data2);
        console.log(this.histodatos);
      });

    });

    this.obs.currentSolServ.subscribe(data => {
     this.service = data;
     this.dataSource.data = this.estrucutrarArray(data);
    });

    this.obs.currentHistoSolserv.subscribe(data => {
      this.histoservice = data;
      this.dataSource2.data = this.estrucutrarArray2(data);
    });

  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

    this.dataSource2.sort = this.sort2;
    this.dataSource2.paginator = this.paginator2;

  }

  ngOnDestroy() {

  }


  getCollectionReserv(userid) {
    this.collectionReserv = this.afs.collection('cfSrvReserv',
      ref => ref.where('user', '==', userid).where('status', '==', 'pendiente'));

    return this.collectionReserv.snapshotChanges();
  }

  getCollectionsHisto(userid) {
    this.collectionHisto = this.afs.collection('cfSrvReserv',
      ref => ref.where('user', '==', userid));

    return this.collectionHisto.snapshotChanges();
  }

  estructurarServiciosActivos(data) {
    const datos = [];

    for (let index = 0; index < data.length; index++) {
      const elemento = data[index].payload.doc.data();
      this.afs.doc('cfSrv/' + elemento.cfSrv).snapshotChanges().subscribe(data2 => {
        const servicio =  data2.payload.data();
        console.log(elemento);
          const Reserv = {
           
            lab: elemento.cfFacil,
            status: elemento.status,
            nombre: servicio.cfName,
            descripcion: servicio.cfDesc,
            precio: servicio.cfPrice,
            activo: servicio.active,
            variaciones: this.estructurarVariaciones(elemento.cfSrv, elemento.selectedVariations),
            condiciones: elemento.conditionsLog,
            comentario: elemento.comments,
            uid: data2.payload.id,
            uidreserv: data[index].payload.doc.id
          };

          datos.push(Reserv);
        });

    }

    return datos;
  }

  estructurarHistoriaServicios(data) {
    const histodatos = [];

    for (let index = 0; index < data.length; index++) {
      const elemento = data[index].payload.doc.data();
      this.afs.doc('cfSrv/' + elemento.cfSrv).snapshotChanges().subscribe(data2 => {
        const servicio =  data2.payload.data();

        if(elemento.status != 'pendiente'){
          const HistoReserv = {
            
            lab: elemento.cfFacil,
            status: elemento.status,
            nombre: servicio.cfName,
            descripcion: servicio.cfDesc,
            precio: servicio.cfPrice,
            activo: servicio.active,
            variaciones: this.estructurarVariaciones(elemento.cfSrv, elemento.selectedVariations),
            condiciones: elemento.conditionsLog,
            comentario: elemento.comments,
            uid: data2.payload.id,
            uidreserv: data[index].payload.doc.id
          };

          histodatos.push(HistoReserv);
      
        }
      });

    }

    return histodatos;
  }

  estructurarVariaciones(idser,item){
    const arr = [];

    for (const clave in item) {
      // Controlando que json realmente tenga esa propiedad
      if (item.hasOwnProperty(clave)) {

        if (item[clave]) {        
          this.afs.doc('cfSrv/' + idser + '/variations/' + clave).snapshotChanges().subscribe(data => {
           const variacion =  data.payload.data();
       
            const vari = {
              id: clave,
              nombre: variacion.cfName,
              descripcion: variacion.cfDescription,
              precio: variacion.cfPrice,
              activo: variacion.active
              };

              arr.push(vari);      

           });
        }

      }
    }

    return arr;
  }



  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  applyFilter2(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource2.filter = filterValue;
  }


  estrucutrarArray(item: Array<any>): Array<any> {
    const informacion = [];
    for (let i = 0; i < item.length; i++) {
      informacion.push({
        nombre: item[i].nombre,
        telefono: item[i].info.tel,
        email: item[i].info.email,
        estado: item[i].estado
      });
    }
    return informacion;
  }

  estrucutrarArray2(item: Array<any>): Array<any> {
    const informacion = [];
    for (let i = 0; i < item.length; i++) {
      informacion.push({
        nombre: item[i].nombre,
        telefono: item[i].info.tel,
        email: item[i].info.email,
        fecha: item[i].fecha
      });
    }
    return informacion;
  }


  ocultar() {
   this.moduloinfo = false;
  }

  prueba() {
    // tslint:disable-next-line:max-line-length
    this.obs.changeSolServ([{nombre: 'YODURO', coord: {lat: '3.403437', lon: '-76.511292'}, info: {dir: 'cra54 dfsdfsdf', tel: '46363565', cel: '4357547656537', email: 'hkjkhjjh@univalle.edu.co'}, fecha: '08/03/2017'}]);
   }

  cambiarData() {
    // this.obs.changeSolServ([{nombre: 'YODURO', coord: {lat: '3.403437', lon: '-76.511292'}, info: {dir: 'cra54 dfsdfsdf', tel: '46363565', cel: '4357547656537', email: 'hkjkhjjh@univalle.edu.co'}, fecha: '08/03/2017'}]);
  }



  mostrardata(item) {

    for (let i = 0; i < this.service.length; i++) {
      if (this.service[i].nombre === item.nombre) {
        this.itemsel = this.service[i];
        break;
      }
    }

    this.moduloinfo = true;

    console.log(item);

  }



}


// export interface Element {
//   nombre: string;
//   telefono: string;
//   email: string;
//   estado: string;
// }

// const ELEMENT_DATA: Element[] = [
//   // tslint:disable-next-line:max-line-length
//   {nombre: 'QUIMICA',  telefono: '53454636', email: 'jkhkhjk@univalle.edu.co', estado: 'NO ACEPTADO'},
//                 // tslint:disable-next-line:max-line-length
//   {nombre: 'INVESTIGACION', telefono: '5345454636',  email: 'fdgfgjh@univalle.edu.co', estado: 'NO ACEPTADO'},
//   // tslint:disable-next-line:max-line-length
//   {nombre: 'MODELADO', telefono: '35345435', email: 'fgjh@univalle.edu.co', estado: 'NO ACEPTADO'},
//   // tslint:disable-next-line:max-line-length
//   {nombre: 'YODURO', telefono: '46363565',  email: 'hkjkhjjh@univalle.edu.co', estado: 'ACEPTADO'}
// ];


