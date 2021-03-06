import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-qr-redirect',
  templateUrl: './qr-redirect.component.html',
  styleUrls: ['./qr-redirect.component.css']
})
export class QrRedirectComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {
    this.getUrl();
  }

  getUrl() {
    const url = window.location.href;
    console.log(url);

    const corte = url.split('=');

    console.log(corte[1]);
    this.router.navigate(['principal/qrinventario', corte[1]]);
  }
}
