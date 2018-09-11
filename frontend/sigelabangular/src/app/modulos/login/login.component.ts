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
  }


  ingresar() {
    // loading mientras se crea el usuario


     this._loginService.login();


    //  this._loginService.login().then( () => {
    //    // mensaje de bienvenida



    //       this.ruta.navigate(['principal' ]).then ( () => {
    //             swal.close();
    //       });

    //  }).catch(error => {
    //     // this.ingresar();
    //  });
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

        this.ruta.navigate(['principal']).then(() => {
          swal({
            type: 'success',
            title: 'Ingreso correcto',
            showConfirmButton: true
          });

        });

      });
    }

  }

}
