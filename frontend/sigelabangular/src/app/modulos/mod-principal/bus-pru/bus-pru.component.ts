import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bus-pru',
  templateUrl: './bus-pru.component.html',
  styleUrls: ['./bus-pru.component.css']
})
export class BusPruComponent implements OnInit {

  dtOptions: any = {};
  constructor() { }

  ngOnInit() {
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
}
