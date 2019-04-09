import { Component, OnInit } from '@angular/core';
import { LoginService } from './modulos/login/login-service/login.service';
import { Router } from '@angular/router';
import swal from 'sweetalert2';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  constructor(private login: LoginService, private ruta: Router) {
    // this.login.consultarAuth().subscribe(user => {
    //   const uri = this.ruta.url;
    //   if (user) {
    //     const spli = uri.split('/')[1];

    //     if (spli === 'login' || spli === 'inicio' || spli === 'registro') {
    //      // this.ruta.navigate(['principal']);
    //     } else {
    //       this.ruta.navigate([this.ruta.url]);
    //     }
    //   }
    // });

  }










}
