import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from './login-service/login.service';
import swal from 'sweetalert2';
import { SidebarComponent } from '../../shared/layouts/sidebar/sidebar.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email: string;
  pass: string;

  constructor(private ruta: Router,
    private _loginService: LoginService) { }

  ngOnInit() {

    if(localStorage.getItem('usuario')){
      this.ruta.navigate(['principal']);
    }
  }


  ingresar() {
    // loading mientras se crea el usuario
    swal({
      title: 'Cargando un momento...',
      text: 'espere mientras se cargan los datos',
      onOpen: () => {
        swal.showLoading();
      }
    });

     this._loginService.login().then( () => {
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
          title: 'Ocurrio un error al intentar ingresar, intente de nuevo.'
                +'(si el error persiste es posible que su usuario haya sido desactivado)',
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


        console.log('respuesta log', ok);


      }).catch(err => {
        this.ingresarEmail(em, ps);

      });
    }

  }

}
