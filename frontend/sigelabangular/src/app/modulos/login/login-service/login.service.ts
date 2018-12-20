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
import { URLDISABLED, ROLESARRAY } from '../../../config';

@Injectable()
export class LoginService {
  usuario;
  urlDisabled = URLDISABLED;
  usersid = [];
  contExec = 0;

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
    const promise = new Promise((resolve, reject) => {
      this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then(
        response => {

          console.log('entro a login');
          this.usuario = response.user;
          localStorage.setItem('usuario', JSON.stringify(this.usuario));


          this.consultarTipoUsuario(this.usuario.uid).then(() => {

            console.log('termino consultar el tipo de usuario');
            resolve();

          }).catch( err => {

            console.log(err);
            reject();
          });


        }).catch(error => {
          // alerta en caso de error
         reject();
          console.log(error);
        });
    });

    return promise;

  }

  async logout() {

    localStorage.removeItem('usuario');
    localStorage.removeItem('persona');
    localStorage.removeItem('rol');
    localStorage.removeItem('laboratorios');
    localStorage.removeItem('permisos');
    localStorage.removeItem('nivel2');
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

    const promise = new Promise((resolve, reject) => {

      this.afAuth.auth.signInWithEmailAndPassword(email, pass)
        .then(data => {
          console.log('login email');
          this.usuario = data;
          localStorage.setItem('usuario', JSON.stringify(data));

          if(this.usuario){
            this.consultarTipoUsuario(this.usuario.uid).then(() => {
              resolve(data);
            }).catch( err => {
              reject();
            });
          } else {
            reject();
          }
        }).catch(err => reject(err));
    });

    return promise;
  }

  /* envia un email a un usuario para restablecer su pass*/

  sendEmail(email: string) {

    return new Promise((resolve, reject) => {
      this.afAuth.auth.sendPasswordResetEmail(email)
        .then(() => {
          swal({
            type: 'success',
            title: 'Se envió un correo al nuevo usuario para establece su contraseña ',
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

  // disabled auth user



  consultarTipoUsuario(id) {

    const promise = new Promise((resolve, reject) => {

      this.getUser(id).then(doc => {
        const data = doc.data();

        console.log(data);

        if(data){
          if (data.active) {

            localStorage.setItem('persona', JSON.stringify(data));
            const rol = data['appRoles'];
            let roleAdmin = false;
  
              roleAdmin = this.buscarRole(rol);
  
            if(data['cfPers'] == ''){
              this.estructurarPermisos(rol).then(ok => {
  
                console.log('termino el metodo estructura permiso');
                localStorage.setItem('rol', JSON.stringify(ok['permisos']));
                resolve();
              });
            }
  
            if(roleAdmin){
              this.estructurarPermisos(rol).then(ok => {
                console.log('termino el metodo estructura permiso administrador');
                localStorage.setItem('rol', JSON.stringify(ok['permisos']));
              });
            }
  
            if(data['cfPers'] != ''){
              const arr = {};
              const arrlab = {};
              this.getPersona(data['cfPers']).then(doc => {
                const clientRole = doc.data().clientRole;
                console.log(clientRole);
                if(Object.keys(clientRole).length != 0){
                  const labs = doc.data().cfFacil;
                  let sizeLabs = 0;
                  let cont = 1;
                  for (const key in labs) {
                    if (labs.hasOwnProperty(key)) {
                      sizeLabs++;
                    }
                  }
    
                  for (const key in labs) {
                    if (labs.hasOwnProperty(key)) {
                     if(labs[key]){
    
                      arr[key] = true;
    
                      for (const llave in clientRole[key]) {
                        if (clientRole[key].hasOwnProperty(llave)) {
                         this.estructurarPermisos(clientRole[key]).then(ok => {
                          arrlab[key] = ok['permisos'];
                          
                          console.log(sizeLabs, cont);
                          if(sizeLabs == cont){
                            console.log('termino el metodo estructura permiso');
                            localStorage.setItem('laboratorios', JSON.stringify(arr));
                            localStorage.setItem('permisos', JSON.stringify(arrlab));
                            resolve();
                          } else {
                            cont++;
                          }
    
                         });
    
                        }
                      }
                     }
                    }
                  }
                } else {
     
                  resolve();
                }
  
              });
            }
  
  
  
  
          } else {
            reject();
          }
        } else {
          this.consultarTipoUsuario(id).then(()=>{
            resolve();
          }).catch(()=>{
            reject();
          });
        }


      });
    });

    return promise;

  }

  buscarRole(rol) {
    const role = ROLESARRAY;
    for (const key in rol) {
      if (rol.hasOwnProperty(key)) {
        if (rol[key]) {
          if (role.includes(key)) {
           return true;
          }
        }
      }
    }

    return false;
  }

  estructurarPermisos(roles){

    const promise = new Promise((resolve, reject) => {
      let rolelength = 0;
      // tslint:disable-next-line:forin
      for (const key in roles) {
        rolelength++;
      }

      const permisos = {};
      let cont = 0;
      for (const clave in roles) {
        if (roles[clave]) {
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

                  console.log('termino recorrer permisos');
                  cont++;

                  console.log(rolelength, cont);
                  if (rolelength === cont) {
                    console.log('termino de recorrer los roles');
                    if (permisos) {
                      console.log(permisos);

                      resolve({permisos : permisos});
                    } else {

                       reject( 'error'  );
                    }

                  }
                }
              }
            }


          }).catch(err => console.log('error consultando el rol', err));
        }


      }
    });

    return promise;

  }

  getRol(idrol) {
    return this.afs.doc('appRoles/' + idrol).ref.get();
  }

  getUser(iduser) {
    return this.afs.doc('user/' + iduser).ref.get();
  }

  getPersona(idPers) {
    return this.afs.doc('cfPers/' + idPers).ref.get();
  }

  getModulo(idPermiso) {
    return this.afs.doc('permission/' + idPermiso).ref.get();
  }




  disabledAuth(id) {
    return this.http.post(this.urlDisabled, {id})
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
