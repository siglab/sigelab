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
      ref => ref.where('user', '==', userid).where('status', '==', 'creada'));

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

          const HistoReserv = {
            status: elemento.status,
            nombre: servicio.cfName,
            descripcion: servicio.cfDesc,
            precio: servicio.cfPrice,
            activo: servicio.active,
            uid: data2.payload.id,
            uidreserv: data[index].payload.doc.id
          };

          histodatos.push(HistoReserv);
        });

    }

    return histodatos;
  }

  cancerlarSolicitud(reservuid) {
    return this.afs.collection('cfSrvReserv').doc(reservuid).update({status: 'cancelada'});
  }



}
