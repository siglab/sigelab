import { AngularFirestore } from "angularfire2/firestore";
import { Injectable } from "@angular/core";
import { AngularFireAuth } from "angularfire2/auth";
import * as firebase from "firebase/app";
import swal from "sweetalert2";
import { map } from "rxjs/operators/map";
import { Router } from "@angular/router";
import { QrService } from "../../mod-nivel2/services/qr.service";
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs";
import { URLDISABLED, ROLESARRAY } from "../../../config";
import { URLUSER } from "../../../config";

@Injectable()
export class LoginService {
  usuario;
  urlDisabled = URLDISABLED;
  usersid = [];
  contExec = 0;
  URL = URLUSER;
  constructor(
    public afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private ruta: Router,
    private http: Http
  ) {
    if (sessionStorage.getItem("usuario")) {
      this.usuario = JSON.parse(sessionStorage.getItem("usuario"));
      // this.consultarPermisos(this.usuario.uid);
    }
  }

  verificarUsuario() {
    const promise = new Promise((resolve, reject) => {
      this.consultarAuth().subscribe((user) => {
        if (user && user["emailVerified"]) {
          this.restaurarSesion(user)
            .then(() => {
              resolve();
            })
            .catch(() => {
              reject();
            });
        } else {
          reject();
        }
      });
    });
    return promise;
  }

  consultarAuth() {
    return this.afAuth.authState;
  }

  restaurarSesion(data) {
    const promise = new Promise((resolve, reject) => {
      this.usuario = data;
      sessionStorage.setItem("usuario", JSON.stringify(data));
      if (this.usuario) {
        this.consultarTipoUsuario(this.usuario.uid)
          .then(() => {
            resolve(data);
          })
          .catch((err) => {
            reject();
          });
      } else {
        reject();
      }
    });
    return promise;
  }

  login() {
    const promise = new Promise((resolve, reject) => {
      this.afAuth.auth
        .signInWithPopup(new firebase.auth.GoogleAuthProvider())
        .then((response) => {
          if (response.additionalUserInfo.isNewUser) {
            this.postUserBackend(
              response.user.email,
              response.user.uid
            ).subscribe((res) => {
              if (res.status === 200) {
                this.consultarTipoUsuario(response.user.uid).then(() => {
                  this.usuario = response.user;
                  sessionStorage.setItem(
                    "usuario",
                    JSON.stringify(this.usuario)
                  );
                  resolve();
                });
              }
            });
          } else {
            this.consultarTipoUsuario(response.user.uid).then(() => {
              this.usuario = response.user;
              sessionStorage.setItem("usuario", JSON.stringify(this.usuario));
              resolve();
            });
          }
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    });
    return promise;
  }

  async logout() {
    sessionStorage.removeItem("usuario");
    sessionStorage.removeItem("persona");
    sessionStorage.removeItem("rol");
    sessionStorage.removeItem("laboratorios");
    sessionStorage.removeItem("permisos");
    sessionStorage.removeItem("nivel2");
    localStorage.setItem("logout", "true");
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
      this.afAuth.auth
        .signInWithEmailAndPassword(email, pass)
        .then((data) => {
          this.usuario = data;
          if (this.usuario && this.usuario["emailVerified"]) {
            sessionStorage.setItem("usuario", JSON.stringify(data));
            this.consultarTipoUsuario(this.usuario.uid)
              .then(() => {
                resolve(data);
              })
              .catch((err) => {
                reject();
              });
          } else {
            this.logout().then(() => {
              localStorage.removeItem("logout");
            });
            reject();
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
    return promise;
  }

  /* envia un email a un usuario para restablecer su pass*/
  sendEmail(email: string) {
    return new Promise((resolve, reject) => {
      this.afAuth.auth.sendPasswordResetEmail(email).then(() => {
        swal({
          type: "success",
          title:
            "Se envió un correo al nuevo usuario para establece su contraseña ",
          showConfirmButton: true,
        });
      });
    });
  }

  createUser(email: string, pass: string) {
    const promise = new Promise((resolve, reject) => {
      this.afAuth.auth
        .createUserWithEmailAndPassword(email, pass)
        .then((ok) => {
          const user: any = firebase.auth().currentUser;
          firebase.auth().signOut();
          user.sendEmailVerification();
          resolve(ok);
        })
        .catch(function (error) {
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
      this.getUser(id).then((doc) => {
        const data = doc.data();
        if (data) {
          if (data.active) {
            sessionStorage.setItem("persona", JSON.stringify(data));
            const rol = data["appRoles"];
            let roleAdmin = false;
            roleAdmin = this.buscarRole(rol);
            if (data["cfPers"] === "") {
              this.estructurarPermisos(rol).then((ok) => {
                sessionStorage.setItem("rol", JSON.stringify(ok["permisos"]));
                resolve();
              });
            }
            if (roleAdmin) {
              this.estructurarPermisos(rol).then((ok) => {
                sessionStorage.setItem("rol", JSON.stringify(ok["permisos"]));
              });
            }
            if (data["cfPers"] !== "") {
              const arr = {};
              const arrlab = {};
              this.getPersona(data["cfPers"]).then((doc) => {
                const clientRole = doc.data().clientRole;
                if (Object.keys(clientRole).length !== 0) {
                  const labs = doc.data().cfFacil;
                  let sizeLabs = Object.keys(labs).length
                    ? Object.keys(labs).length
                    : 0;
                  let cont = 1;
                  // for (const key in labs) {
                  //   console.log(key);
                  //   console.log(labs.hasOwnProperty(key));
                  //   if (labs.hasOwnProperty(key)) {
                  //     sizeLabs++;
                  //   }
                  // }
                  // if (Object.keys(labs).length > 0) {
                  //   sizeLabs = Object.keys(labs).length;
                  // }
                  for (const key in labs) {
                    // if (labs.hasOwnProperty(key)) {
                    if (labs[key]) {
                      arr[key] = true;
                      for (const llave in clientRole[key]) {
                        if (clientRole[key].hasOwnProperty(llave)) {
                          this.estructurarPermisos(clientRole[key]).then(
                            (ok) => {
                              arrlab[key] = ok["permisos"];
                              if (sizeLabs === cont) {
                                sessionStorage.setItem(
                                  "laboratorios",
                                  JSON.stringify(arr)
                                );
                                sessionStorage.setItem(
                                  "permisos",
                                  JSON.stringify(arrlab)
                                );
                                resolve();
                              } else {
                                cont++;
                              }
                            }
                          );
                        }
                      }
                    }
                    // }
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
          this.consultarTipoUsuario(id)
            .then(() => {
              resolve();
            })
            .catch(() => {
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

  estructurarPermisos(roles) {
    const promise = new Promise((resolve, reject) => {
      let rolelength = 0;
      for (const key in roles) {
        rolelength++;
      }
      const permisos = {};
      let cont = 0;
      for (const clave in roles) {
        if (roles[clave]) {
          this.getRol(clave)
            .then((datarol) => {
              const permission = datarol.data().permissions;
              let rollength = 0;
              let controle = 0;
              for (const key in permission) {
                rollength++;
              }
              if (permission) {
                for (const llave in permission) {
                  permisos[llave] = permission[llave];
                  controle++;
                  if (controle === rollength) {
                    cont++;
                    if (rolelength === cont) {
                      if (permisos) {
                        resolve({ permisos: permisos });
                      } else {
                        reject("error");
                      }
                    }
                  }
                }
              }
            })
            .catch((err) => console.log("error consultando el rol", err));
        }
      }
    });
    return promise;
  }

  getRol(idrol) {
    return this.afs.doc("appRoles/" + idrol).ref.get();
  }

  getUser(iduser) {
    return this.afs.doc("user/" + iduser).ref.get();
  }

  getPersona(idPers) {
    return this.afs.doc("cfPers/" + idPers).ref.get();
  }

  getModulo(idPermiso) {
    return this.afs.doc("permission/" + idPermiso).ref.get();
  }

  disabledAuth(id) {
    return this.http
      .post(this.urlDisabled, { id })
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

  getPersonforId(iduser: string, email: string) {
    const fecha = new Date();
    const usr = {
      cfOrgId: "i9dzCErPCO4n9WUfjxR9",
      active: true,
      cfPers: "",
      appRoles: {
        npKRYaA0u9l4C43YSruA: true,
      },
      createdAt: fecha.toISOString(),
      email: email,
    };
    return new Promise((resolve, reject) => {
      this.afs
        .collection("cfPers")
        .ref.where("email", "==", email)
        .get()
        .then((respers) => {
          if (respers.empty) {
            this.afs
              .doc("user/" + iduser)
              .set(usr)
              .then(() => {
                resolve();
              });
          } else {
            // asigna el id de la persona al usuario
            usr.cfPers = respers.docs[0].id;
            this.afs
              .doc("user/" + iduser)
              .set(usr)
              .then(() => {
                this.afs
                  .doc("cfPers/" + usr.cfPers)
                  .set({ user: iduser }, { merge: true })
                  .then(() => {
                    resolve();
                  });
              });
            // asigna el id del usuario a la persona
          }
        });
    });
  }

  postUserBackend(email: string, uid: string) {
    const peticion = {
      email,
      uid,
    };
    return this.http.post(this.URL, peticion);
  }

  getUserWithEmail(email: string) {
    return this.afs.collection("user").ref.where("email", "==", email).get();
  }
}
