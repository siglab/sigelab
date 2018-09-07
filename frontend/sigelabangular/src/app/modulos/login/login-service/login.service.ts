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
    localStorage.removeItem('persona');
    localStorage.removeItem('rol');
    return this.afAuth.auth.signOut();

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
          resolve( ok );
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
    console.log('ejecuto');
    const promise = new Promise((resolve, reject) => {
      this.getUser(id).then(data => {
        console.log('ejecuto2');
        
        localStorage.setItem('persona', JSON.stringify(data.data()));
        if (data.data()) {
          const rol = data.data().appRoles;
          let rolelength = 0;
          for(const key in rol) {
            rolelength++;
          };

          let permisos = {};
          let cont = 0;
          for (const clave in rol) {
            if (rol[clave]) {
              this.getRol(clave).then(datarol => {
                const permission = datarol.data().permissions;
                let rollength = 0;
                let controle = 0;
                for (const key in permission) {
                  rollength++;
                };

                if (permission) {
                  // tslint:disable-next-line:forin
                  for (const llave in permission) {
                    permisos[llave] = permission[llave];  
                    controle++;

                    if(controle == rollength){
                      cont++;

                      console.log(rolelength, cont);
                      if(rolelength == cont){
                        console.log(permisos);
                        localStorage.setItem('rol', JSON.stringify(permisos));
          
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
    return promise;
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
