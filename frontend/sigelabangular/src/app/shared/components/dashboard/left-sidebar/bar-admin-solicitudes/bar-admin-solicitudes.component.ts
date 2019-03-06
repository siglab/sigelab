import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bar-admin-solicitudes',
  templateUrl: './bar-admin-solicitudes.component.html',
  styleUrls: ['./bar-admin-solicitudes.component.css']
})
export class BarAdminSolicitudesComponent implements OnInit {

  constructor(public router: Router) { }

  ngOnInit() {
  }

}
