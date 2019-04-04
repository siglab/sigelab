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
        swal({
          type: 'error',
          title: 'Se ha cerrado su sesion, sera dirigido hacia el login',
          showConfirmButton: true
        }).then(() => {
          this.login.logout();
          this.ruta.navigate(['/login']);
        });
      }
    });

  }
  ngOnInit () {

  }



}
