import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import swal from 'sweetalert2';

@Injectable()
export class LoginService {
    usuario;
  constructor( public afAuth: AngularFireAuth   ) { 

    if (localStorage.getItem('usuario')) {
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
    }
  }

  async login() {

    return   this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then(
    response => {
      console.log(response);
      this.usuario = response.user;
      console.log(this.usuario.uid);
      localStorage.setItem('usuario', JSON.stringify(this.usuario));

    } 
    
   ).catch( ()=> { 
     // alerta en caso de error
    swal({
      type: 'error',
      title: 'Ocurrio un error al intentar ingresar',
      showConfirmButton: true
    });

   }
   );
      
   

  }
  async logout() {

    localStorage.removeItem('usuario');
     return  this.afAuth.auth.signOut();

  }

}
