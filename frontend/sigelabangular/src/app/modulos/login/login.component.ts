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

     this._loginService.login().then( () => {
       // mensaje de bienvenida



          this.ruta.navigate(['principal' ]).then ( () => {    swal({
            type: 'success',
            title: 'Acceso Exitoso',
            showConfirmButton: true
          });     }          );



     }).catch(error => {
        //this.ingresar();
     });
  }
}
