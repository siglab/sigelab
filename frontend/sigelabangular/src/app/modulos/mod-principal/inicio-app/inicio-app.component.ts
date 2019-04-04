import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
declare var $: any;
import * as AOS from 'aos';
import { SabsService } from '../../../shared/services/sabs/sabs.service';

@Component({
  selector: 'app-inicio-app',
  templateUrl: './inicio-app.component.html',
  styleUrls: ['./inicio-app.component.css']
})
export class InicioAppComponent implements OnInit {
  constructor(private router: Router, private servicioSabs: SabsService) {
    console.log('Prueba Servicio SABS');
  
  }

  ngOnInit() {
    $('html, body').animate({ scrollTop: '0px' }, 'slow');
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
