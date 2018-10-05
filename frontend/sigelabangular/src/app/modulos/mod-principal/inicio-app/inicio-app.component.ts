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

      $('html, body').animate({ scrollTop: '400px' }, 'slow');


    }



    downAcerca() {

      $('html, body').animate({ scrollTop: '800px' }, 'slow');

    }
}
