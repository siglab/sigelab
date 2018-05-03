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

  constructor( private ruta: Router, private _loginService: LoginService  ) { }

  ngOnInit() {
  }


  ingresar() {
    // loading mientras se crea el usuario
    swal({
      title: 'Un momento estamos creando su cuenta de usuario , no cierre la pestaña ...',
      onOpen: () => {
        swal.showLoading();
      }

    });

     this._loginService.login().then( () => {
       // mensaje de bienvenida



          this.ruta.navigate(['principal' ]).then ( () => {
                swal.close();
          });



     }).catch(error => {
        // this.ingresar();
     });
  }
}
