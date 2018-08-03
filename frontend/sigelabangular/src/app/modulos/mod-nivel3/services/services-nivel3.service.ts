import { Injectable, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from '@firebase/util';

@Injectable()
export class ServicesNivel3Service {

  // INICIALIZACION DE CONSULTAS PARA LABORATORIOS
  private labsCollection: AngularFirestoreCollection<any>;
  labs: Observable<any[]>;

  datosLabsEstructurados = [];

  constructor(private afs:AngularFirestore) { }
  

  // METODO QUE TRAE LA COLECCION DE TODOS LOS LABORATORIOS
  getLaboratorios() {
    this.labsCollection = this.afs.collection<any>('cfFacil');
    return this.labsCollection.snapshotChanges();
  }



}

