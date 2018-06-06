import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class QuerysAutenticadoService {

  // INICIALIZACION DE CONSULTAS PARA SERVICIOS RESERVADOS POR EL USUARIO
  private collectionReserv: AngularFirestoreCollection<any>;

  private collectionHisto: AngularFirestoreCollection<any>;


  constructor(private afs: AngularFirestore) {

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

          const Reserv = {
            status: elemento.status,
            nombre: servicio.cfName,
            descripcion: servicio.cfDesc,
            precio: servicio.cfPrice,
            activo: servicio.active,
            variaciones: this.estructurarVariaciones(elemento.cfSrv, elemento.selectedVariations),
            condiciones: elemento.conditionsLog,
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
            status: elemento.status,
            nombre: servicio.cfName,
            descripcion: servicio.cfDesc,
            precio: servicio.cfPrice,
            activo: servicio.active,
            variaciones: this.estructurarVariaciones(elemento.cfSrv, elemento.selectedVariations),
            condiciones: elemento.conditionsLog,
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

  cancerlarSolicitud(reservuid) {
    return this.afs.collection('cfSrvReserv').doc(reservuid).update({status: 'cancelada'});
  }



}
