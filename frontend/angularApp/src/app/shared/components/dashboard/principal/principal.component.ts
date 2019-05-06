import { Component, OnInit } from '@angular/core';
// tslint:disable-next-line:import-blacklist
import { BehaviorSubject } from 'rxjs';

import swal from 'sweetalert2';
import { Router } from '@angular/router';
import { LoginService } from '../../../../modulos/login/login-service/login.service';


@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css']
})
export class PrincipalComponent implements OnInit {
  uri = '';

  constructor(private login: LoginService, private ruta: Router) {

    this.login.consultarAuth().subscribe(user => {
      if (!user) {
        console.log('entro siiii');
        if (localStorage.getItem('logout')) {
          const uri = this.ruta.url.split('/');
          console.log(uri);
          swal({
            type: 'error',
            title: 'Se ha cerrado su sesión, sera dirigido hacia el login',
            showConfirmButton: true
          }).then(() => {
            this.login.logout().then(() => {
              localStorage.removeItem('logout');
              if (uri[2] === 'qrinventario') {
                this.ruta.navigate(['/login'], { queryParams: { codigo: uri[3] } });
              } else {
                this.ruta.navigate(['/login']);
              }
            });

          });
        }

      }
    });

  }
  ngOnInit() {

  }



}
