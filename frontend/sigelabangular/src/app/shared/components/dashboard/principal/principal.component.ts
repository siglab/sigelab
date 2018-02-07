import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css']
})
export class PrincipalComponent implements OnInit {
  dtOptions: any = {};
  corx = 3.42158;
  cory = -76.5205;
  map: any;
  constructor() {}

  ngOnInit() {
    this.loadMap();
    this.loadtable();
  }

  loadtable() {
    this.dtOptions = {
      ajax: 'assets/data.json',
      columns: [{
        title: 'ID',
        data: 'id'
      }, {
        title: 'First name',
        data: 'firstName'
      }, {
        title: 'Last name',
        data: 'lastName'
      }],
      // Declare the use of the extension in the dom parameter
      dom: 'Bfrtip',
      // Configure the buttons
      buttons: [
        'print',
        'copy',
        'csv',
        'excel',
        'pdfHtml5'
      ]
    };
  }


  loadMap() {
    this.map = L.map('mapaa').setView([this.corx, this.cory], 13);

    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);
  }
}
