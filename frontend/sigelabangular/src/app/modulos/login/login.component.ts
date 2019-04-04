import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from './login-service/login.service';
import swal from 'sweetalert2';
import { SidebarComponent } from '../../shared/layouts/sidebar/sidebar.component';
import { ServicesNivel3Service } from '../mod-nivel3/services/services-nivel3.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email: string;
  pass: string;

  constructor(private ruta: Router,
    private _loginService: LoginService, private local: ServicesNivel3Service) { }

  ngOnInit() {

    if (this.local.getLocalStorageUser()) {
      this.ruta.navigate(['principal']);
    }

  }


  // verificarUsuario() {
  //   const promise = new Promise((resolve, reject) => {
  //     this._loginService.consultarAuth().subscribe((user) => {
  //       if (user) {
  //         this._loginService.restaurarSesion(user).then(() => {
  //           resolve();
  //         }).catch(() => {
  //          reject();
  //         });
  //       } else {
  //        reject();
  //       }
  //     });
  //   });

  //   return promise;

  // }


  ingresar() {
    // loading mientras se crea el usuario
    swal({
      title: 'Cargando un momento...',
      text: 'espere mientras se cargan los datos',
      onOpen: () => {
        swal.showLoading();
      }
    });

    this._loginService.login().then(() => {
      // mensaje de bienvenida
      swal({
        type: 'success',
        title: 'Ingreso correcto',
        showConfirmButton: true
      });

      console.log('enrutameitno');

      this.ruta.navigate(['principal']);


    }).catch(error => {
      // this.ingresar();

      swal({
        type: 'error',
        text: 'Ocurrio un error al intentar ingresar, intente de nuevo.'
          + 'Si el error persiste es posible que su usuario haya sido desactivado.',
        showConfirmButton: true
      });
    });
  }



  ingresarEmail(em, ps) {

    if (em.invalid || ps.invalid) {

      swal({
        type: 'error',
        title: 'Hay campos importantes vacios',
        showConfirmButton: true
      });

    } else {

      this._loginService.getUserWithEmail(this.email).then(data => {
        if (data.empty) {
          swal({
            type: 'error',
            title: 'El correo ingresado no tiene registro en la plataforma.',
            showConfirmButton: true
          });
        } else {
          this._loginService.loginEmail(this.email, this.pass).then(ok => {

            if (ok['emailVerified']) {

              swal({
                type: 'success',
                title: 'Ingreso correcto',
                showConfirmButton: true
              });

              this.ruta.navigate(['principal']);

            } else {

              swal({
                type: 'info',
                title: 'Hace falta verificar su cuenta',
                showConfirmButton: true
              });

            }

          }).catch(err => {

            swal({
              type: 'error',
              title: this.mensajesError(err.code),
              showConfirmButton: true
            });

          });
        }
      });

      swal({
        title: 'Cargando un momento...',
        text: 'espere mientras se cargan los datos',
        onOpen: () => {
          swal.showLoading();
        }
      });


    }

  }



  mensajesError(message) {
    switch (message) {
      case 'auth/app-not-authorized': return 'Acceso no autorizado.';
      case 'auth/argument-error': return 'Datos Invalidos.';
      case 'auth/invalid-api-key': return 'API KEY invalido.';
      case 'auth/invalid-user-token': return 'TOKEN de acceso invalido.';
      case 'auth/network-request-failed': return 'Error de red, por favor revise su internet.';
      case 'auth/operation-not-allowed': return 'Proovedor invalido.';
      case 'auth/too-many-requests': return 'Actividad inusual.';
      case 'auth/unauthorized-domain': return 'Dominio invalido.';
      case 'auth/user-disabled': return 'Usuario deshabilitado.';
      case 'auth/user-token-expired': return 'Token de acceso expirado.';
      case 'auth/web-storage-unsupported': return 'El navegador no permite almacenamiento web.';
      case 'auth/wrong-password': return 'Password invalido o la cuenta registrada solo accede por medio de Google';
      case 'auth/user-not-found': return 'El correo electrónico ingresado no está registrado.';
    }
  }

}
