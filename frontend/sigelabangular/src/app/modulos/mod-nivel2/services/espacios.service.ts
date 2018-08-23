import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';

@Injectable()
export class EspaciosService {

  constructor(private afs: AngularFirestore) { }



  listHq() {

    return this.afs.collection('headquarter').snapshotChanges()
      .map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          data.id = a.payload.doc.id;
          return data;
        });


      });
  }


  listSubHq(sede) {

    return this.afs.collection('cfPAddr', ref => ref.where('headquarter', '==', sede )).snapshotChanges()
      .map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          data.id = a.payload.doc.id;
          return data;
        });

      });
  }



  listSpaceWithSubHq(space){
    return this.afs.collection('space', ref => ref.where('subHq','==',space)).snapshotChanges();
  }
}
