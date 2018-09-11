import { AngularFirestore } from 'angularfire2/firestore';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import swal from 'sweetalert2';
import { map } from 'rxjs/operators/map';
import { Router } from '@angular/router';

@Injectable()
export class LoginService {
  usuario;
  usersid = [];
  constructor(public afAuth: AngularFireAuth, private afs: AngularFirestore, private ruta: Router) {

    if (localStorage.getItem('usuario')) {
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
      // this.consultarPermisos(this.usuario.uid);
    }
  }

  login() {
    this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then(
      response => {
        console.log('entro a login');
        this.usuario = response.user;
        localStorage.setItem('usuario', JSON.stringify(this.usuario));


          // this.stateChangesUser().then( (res) => {
          //   setTimeout(() => {
          //     console.log(res);

          //   }, 2000);
          // } );
         this.ruta.navigate(['principal']);
         this.consultarPermisos( this.usuario.uid).then( () => {

          });

        // this.consultarPermisos(this.usuario.uid).then(() => {



        // }).catch(() => {
        //   swal({
        //     type: 'error',
        //     title: 'Ocurrio un error al intentar ingresar',
        //     showConfirmButton: true
        //   });

        // });

      }).catch(error => {
        // alerta en caso de error
        swal({
          type: 'error',
          title: 'Ocurrio un error al intentar ingresar, intente de nuevo',
          showConfirmButton: true
        });
        console.log(error);
      });


  }

  async logout() {

    localStorage.removeItem('usuario');
    localStorage.removeItem('persona');
    localStorage.removeItem('rol');
    return this.afAuth.auth.signOut();

  }



  stateChangesUser() {

    const array = [];

    return new Promise((resolve, reject) => {
      let indice;
      const refe = this.afs.collection('user').ref;
      refe.onSnapshot((snapshot) => {

        snapshot.docChanges.forEach((change) => {
          if (change.type === 'added') {

            console.log(change.newIndex);
            // agrega todos los ids de la coleccion usuario por primera vez
             indice = change.newIndex;
          }
        });
        resolve( indice );
      });


    });


  }




  /* login usando email y password */
  loginEmail(email: string, pass: string) {

    return new Promise((resolve, reject) => {

      this.afAuth.auth.signInWithEmailAndPassword(email, pass)
        .then(data => {
          console.log('login email');
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
        (ok) => {
          console.log('usuario creado');
          resolve(ok);
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
    return new Promise((resolve, reject) => {
      return this.getUser(id).then(data => {
        console.log('entro al metodo', this.usuario.uid);

        localStorage.setItem('persona', JSON.stringify(data.data()));
        if (data.data()) {
          const rol = data.data().appRoles;
          let rolelength = 0;
          // tslint:disable-next-line:forin
          for (const key in rol) {
            rolelength++;
          }

          const permisos = {};
          let cont = 0;
          for (const clave in rol) {
            if (rol[clave]) {
              this.getRol(clave).then(datarol => {
                const permission = datarol.data().permissions;
                let rollength = 0;
                let controle = 0;
                // tslint:disable-next-line:forin
                for (const key in permission) {
                  rollength++;
                }

                if (permission) {
                  // tslint:disable-next-line:forin
                  for (const llave in permission) {
                    permisos[llave] = permission[llave];
                    controle++;

                    if (controle === rollength) {
                      cont++;

                      console.log(rolelength, cont);
                      if (rolelength === cont) {
                        console.log(permisos);
                        localStorage.setItem('rol', JSON.stringify(permisos));
                        console.log('termino el metodo de rols');
                        resolve();
                      }
                    }
                  }
                }


              });
            }


          }

        }

      });
    });
  }

  getRol(idrol) {
    return this.afs.doc('appRoles/' + idrol).ref.get();
  }

  getUser(iduser) {
    return this.afs.doc('user/' + iduser).ref.get();
  }

  getModulo(idPermiso) {
    return this.afs.doc('permission/' + idPermiso).ref.get();
  }



}
