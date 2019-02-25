import { Component, OnInit } from '@angular/core';
declare var $: any;
import * as AOS from 'aos';

@Component({
  selector: 'app-inicio-app',
  templateUrl: './inicio-app.component.html',
  styleUrls: ['./inicio-app.component.css'],
})
export class InicioAppComponent implements OnInit {

  constructor() { }

  ngOnInit() {

    $('html, body').animate({ scrollTop: '0px' }, 'slow');
  }


    down() {

      const alto = $(window).height() + 350;
       console.log(alto);

      $('html, body').animate({ scrollTop: alto }, 'slow');


    }



    downAcerca() {
      const alto = $(window).height() + 350;
      const mitad = alto / 2;
      $('html, body').animate({ scrollTop: mitad }, 'slow');

    }
    prueba() {
      console.log('botón');
    }
}
