import { AngularFirestore } from 'angularfire2/firestore';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import swal from 'sweetalert2';
import { map } from 'rxjs/operators/map';
import { Router } from '@angular/router';
import { QrService } from '../../mod-nivel2/services/qr.service';
import { Http, Response } from '@angular/http';

// tslint:disable-next-line:import-blacklist
import { Observable } from 'rxjs';

@Injectable()
export class LoginService {
  usuario;
  url2 = '';
  usersid = [];
  constructor(public afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private ruta: Router,
    private http: Http) {

    if (localStorage.getItem('usuario')) {
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
      // this.consultarPermisos(this.usuario.uid);
    }
  }

  login() {

    return this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then(
      response => {
        swal({
          title: 'Cargando un momento...',
          text: 'espere mientras se cargan los datos',
          onOpen: () => {
            swal.showLoading();
          }
        });

        console.log('entro a login');
        this.usuario = response.user;
        localStorage.setItem('usuario', JSON.stringify(this.usuario));

        // this.postCloudFunction(this.usuario).subscribe(data => {
        //   console.log(data);
        //   console.log(data.body);
        // }, err => console.log(err));


          this.consultarPermisos(this.usuario.uid).then(() => {

            setTimeout(() => {

              this.ruta.navigate(['principal']);
              swal.close();
            }, 3000);


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


  }

  async logout() {

    localStorage.removeItem('usuario');
    localStorage.removeItem('persona');
    localStorage.removeItem('rol');
    return this.afAuth.auth.signOut();

  }


  recoverPassword(email) {
    return this.afAuth.auth.sendPasswordResetEmail(email);

  }
  sendVerificationemail() {
    const user = this.afAuth.auth.currentUser;

    return user.sendEmailVerification();
  }





  /* login usando email y password */
  loginEmail(email: string, pass: string) {

    return new Promise((resolve, reject) => {

      this.afAuth.auth.signInWithEmailAndPassword(email, pass)
        .then(data => {
          console.log('login email');
          this.usuario = data;
          localStorage.setItem('usuario', JSON.stringify(data));

          resolve(data);
        }).catch(err => reject(err));
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
          const user: any = firebase.auth().currentUser;
          user.sendEmailVerification().then((success) => {
            swal({
              type: 'info',
              title: 'Un mensaje de verificacion fue enviado a su correo',
              showConfirmButton: true
            });
          });
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


  async consultarPermisos(id) {

    this.getUser(id).subscribe(data => {
      console.log('entro al metodo consultar permisos', this.usuario.uid);

      console.log('data valuechanges', data);

      if (data) {
        console.log('resultado de la data', data);
        localStorage.setItem('persona', JSON.stringify(data));
        const rol = data['appRoles'];
        let rolelength = 0;
        // tslint:disable-next-line:forin
        for (const key in rol) {
          rolelength++;
        }

        const permisos = {};
        let cont = 0;
        for (const clave in rol) {
          if (rol[clave]) {
            return this.getRol(clave).then(datarol => {
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
                      console.log('termino el metodo de rols');

                      return localStorage.setItem('rol', JSON.stringify(permisos));


                    }
                  }
                }
              }


            }).catch(err => console.log('error consultando el rol', err));
          }


        }

      }

    });

  }

  getRol(idrol) {
    return this.afs.doc('appRoles/' + idrol).ref.get();
  }

  getUser(iduser) {
    return this.afs.doc('user/' + iduser).valueChanges();
  }

  getModulo(idPermiso) {
    return this.afs.doc('permission/' + idPermiso).ref.get();
  }


  postCloudFunction(usuario) {
    return this.http.post(this.url2, usuario)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  extractData(res: Response) {
    const body = res.json();
    return body || {};
  }

  handleErrorObservable(error: Response | any) {
    return Observable.throw(error.message || error);
  }

}
