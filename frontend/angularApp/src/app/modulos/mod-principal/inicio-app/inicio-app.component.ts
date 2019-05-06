import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
declare var $: any;
import * as AOS from 'aos';
import { SabsService } from '../../../shared/services/sabs/sabs.service';
import { ServicesNivel3Service } from '../../mod-nivel3/services/services-nivel3.service';
import { LoginService } from '../../login/login-service/login.service';

@Component({
  selector: 'app-inicio-app',
  templateUrl: './inicio-app.component.html',
  styleUrls: ['./inicio-app.component.css']
})
export class InicioAppComponent implements OnInit {
  constructor(private router: Router, private servicioSabs: SabsService, private local: ServicesNivel3Service,
              private login: LoginService) {
    console.log('Prueba Servicio SABS');
  }

  ngOnInit() {
    $('html, body').animate({ scrollTop: '0px' }, 'slow');
    if (this.local.getLocalStorageUser()) {
      this.router.navigate(['principal']);
    } else {
      this.login.verificarUsuario().then(() => {
        console.log('VERIFICO');
        setTimeout(() => {
          console.log('la ruta se va');
          this.router.navigate(['principal']);
        }, 1000);
      });
    }

  }

  goContactSec(): void {
    $('html, body').animate(
      {
        scrollTop: $('#contactInfoSec').offset().top - $('#topDiv').height() + 5
      },
      1000
    );
  }

  goAboutSec(): void {
    $('html, body').animate(
      {
        scrollTop: $('#aboutSec').offset().top - $('#topDiv').height() + 5
      },
      1000
    );
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

}
