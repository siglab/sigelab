import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-solicitudes-servicio',
  templateUrl: './solicitudes-servicio.component.html',
  styleUrls: ['./solicitudes-servicio.component.css']
})
export class SolicitudesServicioComponent implements OnInit {


  servicios = [{nombre:"QUIMICA",coord:{lat:"3.425906",lon:"-76.540446"},info:{dir:"cra54 cambulos",tel:"53454636",cel:"43656537",email:"jkhkhjk@univalle.edu.co"},estado:"NO ACEPTADO"},
  {nombre:"INVESTIGACION",coord:{lat:"3.419737",lon:"-76.540275"},info:{dir:"cra54 san fernado",tel:"53454543gdf636",cel:"43656537",email:"fdgfgjh@univalle.edu.co"},estado:"NO ACEPTADO"},
  {nombre:"MODELADO",coord:{lat:"3.420380",lon:"-76.510105"},info:{dir:"cra54 sfdfsdfs",tel:"35345435",cel:"436574676537",email:"fgjh@univalle.edu.co"},estado:"NO ACEPTADO"},
  {nombre:"YODURO",coord:{lat:"3.403437",lon:"-76.511292"},info:{dir:"cra54 dfsdfsdf",tel:"46363565",cel:"4357547656537",email:"hkjkhjjh@univalle.edu.co"},estado:"ACEPTADO"}];


servicioshechos = [{nombre:"QUIMICA",coord:{lat:"3.425906",lon:"-76.540446"},info:{dir:"cra54 cambulos",tel:"53454636",cel:"43656537",email:"jkhkhjk@univalle.edu.co"},fecha:"08/09/2017"},
{nombre:"INVESTIGACION",coord:{lat:"3.419737",lon:"-76.540275"},info:{dir:"cra54 san fernado",tel:"53454543gdf636",cel:"43656537",email:"fdgfgjh@univalle.edu.co"},fecha:"18/09/2017"},
{nombre:"MODELADO",coord:{lat:"3.420380",lon:"-76.510105"},info:{dir:"cra54 sfdfsdfs",tel:"35345435",cel:"436574676537",email:"fgjh@univalle.edu.co"},fecha:"11/10/2017"},
{nombre:"YODURO",coord:{lat:"3.403437",lon:"-76.511292"},info:{dir:"cra54 dfsdfsdf",tel:"46363565",cel:"4357547656537",email:"hkjkhjjh@univalle.edu.co"},fecha:"08/03/2017"}];


dtOptions:any = {};
dtOptions1:any = {};

moduloinfo = false;

itemsel:any;

constructor() { }

ngOnInit() {
this.loadtable1();
this.loadtable2();
}

  loadtable1() {
    this.dtOptions = {
    data:this.servicios,
    columns: [{
    title: 'Nombre',
    data: 'nombre'
    }, {
    title: 'Email',
    data: 'info.email'
    }, {
    title: 'Telefono',
    data: 'info.tel'
    }, {
    title: 'Estado',
    data: 'estado'}],
    rowCallback: (row: Node, data: any[] | Object, index: number) => {
    const self = this;
    // Unbind first in order to avoid any duplicate handler
    // (see https://github.com/l-lin/angular-datatables/issues/87)
    $('td', row).unbind('click');
    $('td', row).bind('click', () => {
    self.mostrardata(data);
    });
    return row;
    },
    // Declare the use of the extension in the dom parameter
    dom: 'Bfrtip',
    // Configure the buttons
    buttons: [
    'print',
    'copy',
    'csv',
    'excel',
    'pdfHtml5'
    ],
    select:true
    };
  }

  loadtable2() {
    this.dtOptions1 = {
    data:this.servicioshechos,
    columns: [{
    title: 'Nombre',
    data: 'nombre'
    }, {
    title: 'Email',
    data: 'info.email'
    }, {
    title: 'Telefono',
    data: 'info.tel'
    }, {
    title: 'Fecha',
    data: 'fecha'}],
    rowCallback: (row: Node, data: any[] | Object, index: number) => {
    const self = this;
    // Unbind first in order to avoid any duplicate handler
    // (see https://github.com/l-lin/angular-datatables/issues/87)
    $('td', row).unbind('click');
    $('td', row).bind('click', () => {
    self.mostrardata(data);
    });
    return row;
    },
    // Declare the use of the extension in the dom parameter
    dom: 'Bfrtip',
    // Configure the buttons
    buttons: [
    'print',
    'copy',
    'csv',
    'excel',
    'pdfHtml5'
    ],
    select:true
    };
    }
    mostrardata(item){
    this.itemsel = item;
    this.moduloinfo = true;
    console.log(item);

  }

  ocultar(){
  this.moduloinfo = false;
  }

}
