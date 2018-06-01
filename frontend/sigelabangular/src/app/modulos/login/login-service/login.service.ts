import { AngularFirestore } from 'angularfire2/firestore';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import swal from 'sweetalert2';

@Injectable()
export class LoginService {
  usuario;
  constructor(public afAuth: AngularFireAuth, private afs: AngularFirestore) {

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
          localStorage.setItem('usuario', JSON.stringify(this.usuario));

          this.consultarPermisos(this.usuario.uid).then(() => {
            resolve();
          }).catch(() => {
            swal({
              type: 'error',
              title: 'Ocurrio un error al intentar ingresar',
              showConfirmButton: true
            });

          });

        }).catch(error => {
          // alerta en caso de error
          swal({
            type: 'error',
            title: 'Ocurrio un error al intentar ingresar, intente de nuevo',
            showConfirmButton: true
          });
          console.log(error);
        });
    });

    return promise;
  }

  async logout() {

    localStorage.removeItem('usuario');
    localStorage.removeItem('rol');
    return this.afAuth.auth.signOut();

  }


  /* login usando email y password */
  loginEmail(email: string, pass: string) {

    // tslint:disable-next-line:prefer-const
    let promise = new Promise((resolve, reject) => {

      this.afAuth.auth.signInWithEmailAndPassword(email, pass)
        .then(data => {
          console.log('login');
          this.usuario = data;
          localStorage.setItem('usuario', JSON.stringify(data));

          resolve();
        });
    });
  }

  /* envia un email a un usuario para restablecer su pass*/

  sendEmail(email: string) {

    return new Promise((resolve, reject) => {
      this.afAuth.auth.sendPasswordResetEmail(email)
        .then(() => {
          swal({
            type: 'success',
            title: 'Se envio un correo al nuevo usuario para establece su contraseña ',
            showConfirmButton: true
          });
        });

    });

  }

  createUser(email: string, pass: string) {


    const promise = new Promise((resolve, reject) => {
      this.afAuth.auth.createUserWithEmailAndPassword(email, pass).then(
        () => {
          console.log('usuario creado');
          resolve();
        }).catch(function (error) {
          console.log(error.message);
        });
    });
    return promise;
  }



    /* convierte un id en un objeto id:true */

     setBoolean(campo) {

      const string = '{"' + campo + '":true}';
      return JSON.parse(string);

    }




  consultarPermisos(id) {
    const promise = new Promise((resolve, reject) => {
      this.getUser(id).subscribe(data => {
        localStorage.setItem('persona', JSON.stringify(data.payload.data()));
        if (data.payload.data()) {
          const use = data.payload.data().appRoles;
          console.log(use);
          for (const clave in use) {
            if (use[clave]) {
              this.getRol(clave).subscribe(datarol => {
                const rol = datarol.payload.data().permissions;
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
                    } else {
                      reject();
                    }
                  }
                } else {
                  this.consultarPermisos(id);
                }


              });
            }
          }

        } else {
          this.consultarPermisos(id);
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
