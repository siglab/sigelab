import { Component, OnInit } from '@angular/core';
declare var $: any;
import * as AOS from 'aos';

@Component({
  selector: 'app-inicio-app',
  templateUrl: './inicio-app.component.html',
  styleUrls: ['./inicio-app.component.css']
})
export class InicioAppComponent implements OnInit {
  constructor() {}

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

  goAboutSec() {
    $('html, body').animate(
      {
        scrollTop: $('#aboutSec').offset().top - $('#topDiv').height() + 5
      },
      1000
    );
  }

}
