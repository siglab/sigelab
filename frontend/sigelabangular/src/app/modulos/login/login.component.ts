import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from './login-service/login.service';
import swal from 'sweetalert2';
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
    
     this._loginService.login().then( ()=>
     {    
      
     // navegar al dashboard
     this.ruta.navigate(['/principal']);
      // mensaje de bienvenida
     swal({
      type: 'success',
      title: '',
      showConfirmButton: true
     });

     });
  


  }
}
