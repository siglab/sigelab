import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import swal from 'sweetalert2';

@Injectable()
export class LoginService {

  constructor( public afAuth: AngularFireAuth   ) { 


  }

  async login() {

   return   this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then();
      
  }
  logout() {
    this.afAuth.auth.signOut();
  }

}
