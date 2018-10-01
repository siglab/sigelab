import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';

@Injectable()
export class UsuariosService {

  constructor( private afs: AngularFirestore ) { }

  updatedUser( usuario, id ) {
    this.afs.doc( 'cfPers/' + id  ).set( usuario, { merge: true} ).then( ok => {
    });

  }



}
