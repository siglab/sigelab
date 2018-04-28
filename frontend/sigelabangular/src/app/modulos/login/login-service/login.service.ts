import { AngularFirestore } from 'angularfire2/firestore';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import swal from 'sweetalert2';

@Injectable()
export class LoginService {
    usuario;
  constructor( public afAuth: AngularFireAuth, private afs: AngularFirestore ) {

    if (localStorage.getItem('usuario')) {
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
      this.consultarPermisos(this.usuario.uid);
    }
  }

login() {
  const promise = new Promise((resolve, reject) => {
    this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then(
      response => {

        this.usuario = response.user;

          this.consultarPermisos(this.usuario.uid).then(() => {
           localStorage.setItem('usuario', JSON.stringify(this.usuario));
          resolve();
          }).catch(() => {
          swal({
            type: 'error',
            title: 'Ocurrio un error al intentar ingresar',
            showConfirmButton: true
          });
        });

      }).catch( () => {
       // alerta en caso de error
        swal({
          type: 'error',
          title: 'Ocurrio un error al intentar ingresar',
          showConfirmButton: true
        });

     });
  });

  return promise;
}

  async logout() {

    localStorage.removeItem('usuario');
     return  this.afAuth.auth.signOut();

  }

  consultarPermisos(id) {
    const promise = new Promise((resolve, reject) => {
      this.getUser(id).subscribe(data => {
        const use = data.payload.data().appRoles;
        for (const clave in use) {
          if (use[clave]) {
            this.getRol(clave).subscribe( datarol => {
              const rol = datarol.payload.data().permissions;
              console.log(rol);
              if (rol) {
                // tslint:disable-next-line:forin
                for (const llave in rol) {

                  if (rol[llave]) {
                     localStorage.setItem('rol', JSON.stringify(rol));
                    // this.getModulo(llave).subscribe( datamod => {
                    //   const modulo = datamod.payload.data().value;

                    //   console.log(modulo);
                    // });
                    resolve();
                  }
                }
              } else {
                this.consultarPermisos(id);
              }


            });
          }
        }

      });
    });
   return promise;
  }

  getRol(idrol) {
    return this.afs.doc('appRoles/' + idrol).snapshotChanges();
  }

  getUser(iduser) {
    return this.afs.doc('user/' + iduser).snapshotChanges();
  }

  getModulo(idPermiso) {
    return this.afs.doc('permission/' + idPermiso).snapshotChanges();
  }



}
