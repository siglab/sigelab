
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

servicioActivoSel:any;
histoServicioSel:any;

comentario = '';



  displayedColumns = ['nombre', 'fecha', 'email', 'estado'];
  displayedColumns2 = ['nombre', 'fecha', 'laboratorio', 'estado'];

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

   variation:any;
   condicion:any;

   condicionesobjeto = {};

   buttons = true;

   user:any;

constructor(private obs: ObservablesService, private afs: AngularFirestore) {
 //this.obs.changeSolServ(this.servicioso);
}

  ngOnInit() {

    if (localStorage.getItem('usuario')) {
      this.user = JSON.parse(localStorage.getItem('usuario'));   
    }

    this.obs.currentObjectSolSer.subscribe(data => {

      if(data.length != 0){
       
        this.getCollectionReserv(data.uid).subscribe(data1 => {
          this.datos = this.estructurarServiciosActivos(data1, data);
          this.histodatos = this.estructurarHistorialServicios(data1, data);
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
            }, 1500);
                     
        });
      }


    });

  }

  ngAfterViewInit(): void {



  }

  ngOnDestroy() {

  }


  getCollectionReserv(labid) {
    this.collectionReserv = this.afs.collection('cfSrvReserv',
      ref => ref.where('cfFacil', '==', labid));

    return this.collectionReserv.snapshotChanges();
  }

  estructurarServiciosActivos(data, lab) {
    const activo = [];

    for (let index = 0; index < data.length; index++) {
      const elemento = data[index].payload.doc.data();
      this.afs.doc('cfSrv/' + elemento.cfSrv).snapshotChanges().subscribe(data2 => {
        const servicio =  data2.payload.data();     

            if(elemento.status != 'rechazada' && elemento.status != 'cancelada'){
              this.getEmailUser(elemento.user).subscribe(email =>{
                const Reserv = {
                  uidlab: elemento.cfFacil,
                  nombrelab: lab.nombre.nom1 + ' ' + lab.nombre.nom2,
                  status: elemento.status,
                  nombre: servicio.cfName,
                  descripcion: servicio.cfDesc,
                  precio: servicio.cfPrice,
                  activo: servicio.active,
                  variaciones: this.estructurarVariaciones(elemento.cfSrv, elemento.selectedVariations),
                  condiciones: elemento.conditionsLog,
                  comentario: elemento.comments,
                  usuario: email.payload.data().email,
                  fecha: elemento.createdAt.split('T')[0],
                  uidserv: data2.payload.id,
                  uidreserv: data[index].payload.doc.id
                };
                activo.push(Reserv);
              });
            } 

      });

    }

    return activo;
  }

  estructurarHistorialServicios(data, lab) {

    const historial = [];

    for (let index = 0; index < data.length; index++) {
      const elemento = data[index].payload.doc.data();
      this.afs.doc('cfSrv/' + elemento.cfSrv).snapshotChanges().subscribe(data2 => {
        const servicio =  data2.payload.data();     

            if(elemento.status != 'pendiente'){
              this.getEmailUser(elemento.user).subscribe(email =>{
                this.getLab(lab.uid).subscribe(laboratorio => {
                  const Reserv = {
                    uidlab: elemento.cfFacil,
                    nombrelab: lab.nombre.nom1 + ' ' + lab.nombre.nom2,
                    infolab:laboratorio.payload.data(),
                    status: elemento.status,
                    nombre: servicio.cfName,
                    descripcion: servicio.cfDesc,
                    precio: servicio.cfPrice,
                    activo: servicio.active,
                    variaciones: this.estructurarVariaciones(elemento.cfSrv, elemento.selectedVariations),
                    condiciones: elemento.conditionsLog,
                    comentario: elemento.comments,
                    usuario: email.payload.data().email,
                    fecha: elemento.createdAt.split('T')[0],
                    uidserv: data2.payload.id,
                    uidreserv: data[index].payload.doc.id
                  };
                  historial.push(Reserv);

                });
     
              });
            } 

      });

    }

    return historial;
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

  getEmailUser(userid){
    return this.afs.doc('user/' + userid).snapshotChanges();
  }

  getLab(labid){
    return this.afs.doc('cfFacil/' + labid).snapshotChanges();
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



  cambiarDataServicio(item, table) {
    this.servicioActivoSel = item;
    this.variation = undefined;
    this.condicion = undefined;
    this.estructurarCondiciones(item.condiciones);
    
    this.moduloinfo = true;
    console.log(item);  
    if(table == 'activo'){
      this.buttons = true;
      console.log('activpo');
    } else {
      this.buttons = false;
      console.log('historia');
    }
   
  }

  cambiarVariacion(item){

    if(item != 'inicial'){
      this.variation = this.buscarVariacion(item);
      this.condicion =  this.buscarCondicion(item);
      console.log(this.condicion);
      this.estructurarCondiciones(this.condicion.condicion);
    } else {
      this.variation = undefined;
      this.condicion = undefined;
    }

    console.log(item);

  }

  // METODO QUE BUSCA LA VARIACION QUE COINCIDE CON EL ID ENVIADO DESDE LA VISTA
  buscarVariacion(item){
    for (let i = 0; i < this.servicioActivoSel.variaciones.length; i++) {
      const element = this.servicioActivoSel.variaciones[i];
      if(element.id == item){
        return element;
      }   
    }
  }

  buscarCondicion(item){
    for (let i = 0; i < this.servicioActivoSel.condiciones.length; i++) {
      const element = this.servicioActivoSel.condiciones[i];
      if(element.idvariacion == item){
        return element;
      }   
    }
  }

  // ESTRUCTURA OBJETO JSON QUE SE ENLAZA A LOS CHECKBOX DE LA VISTA DE MANERA DINAMICA
  estructurarCondiciones(condiciones){
    this.condicionesobjeto = {};
    for (let i = 0; i < condiciones.length; i++) {
      //const element = condiciones[i];
      this.condicionesobjeto["checkbox"+i] = condiciones[i].accepted;
    }
  }

  // ESTRUCTURA OBJETO JSON QUE SE ENLAZA A LOS CHECKBOX DE LA VISTA DE MANERA DINAMICA
  estructurarVariacionesCond(condiciones){
    this.condicionesobjeto = {};
    for (let i = 0; i < condiciones.length; i++) {
      //const element = condiciones[i];
      this.condicionesobjeto["checkbox"+i] = condiciones[i].accepted;
    }
  }

  // ENVIA UN COMENTARIO A LA RESERVA DE SERVICIO CORRESPONDIENTE
  enviarComentario(){
    const fecha = new Date();
    let cfSrvReserv = {
      comments:this.servicioActivoSel.comentario
    };
    console.log(this.comentario);
    console.log(this.servicioActivoSel);
    cfSrvReserv.comments.push({
      commentText: this.comentario, 
      fecha: fecha.getDate() + '/' + (fecha.getMonth()+1) + '/' + fecha.getFullYear(), 
      uid: 'hgyuhvguhv'});

      console.log(cfSrvReserv);
    this.afs.doc('cfSrvReserv/' + this.servicioActivoSel.uidreserv).update( cfSrvReserv).then(()=>{
      console.log('comentario guardado');
    });

     
  }


  aceptarSolicitud(){

  }

  rechazarSolicitud(){

  }




}


