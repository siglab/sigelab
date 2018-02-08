import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-bus-lab',
  templateUrl: './bus-lab.component.html',
  styleUrls: ['./bus-lab.component.css']
})
export class BusLabComponent implements OnInit {

  corx = 3.42158;
  cory = -76.5205;
  map: any;

  convenios = [{nombre:"LABORATORIO CIENCIAS",coord:{lat:"3.425906",lon:"-76.540446"},info:{dir:"cra54 cambulos",tel:"53454636",cel:"43656537",email:"jkhkhjk@univalle.edu.co"},
               servicios:[{nombre:"QUIMICA"},{nombre:"TERMODINAMICA"},{nombre:"FISICA"}],practicas:[{nombre:"EXSS"},{nombre:"FGFGFG"}]},
               {nombre:"LABORATORIO SOCIAES",coord:{lat:"3.419737",lon:"-76.540275"},info:{dir:"cra54 san fernado",tel:"53454543gdf636",cel:"43656537",email:"fdgfgjh@univalle.edu.co"},
               servicios:[{nombre:"CUANTICA"},{nombre:"MATE"},{nombre:"BIOLOGIA"}],practicas:[{nombre:"DFGDFGDF"}]},
               {nombre:"LABORATORIO X",coord:{lat:"3.420380",lon:"-76.510105"},info:{dir:"cra54 sfdfsdfs",tel:"35345435",cel:"436574676537",email:"fgjh@univalle.edu.co"},
               servicios:[{nombre:"BUSQUEDA"},{nombre:"INVESTIGACION"}],practicas:[{nombre:"HJGHJHJ"}]},
               {nombre:"LABORATORIO Y",coord:{lat:"3.403437",lon:"-76.511292"},info:{dir:"cra54 dfsdfsdf",tel:"46363565",cel:"4357547656537",email:"hkjkhjjh@univalle.edu.co"},
               servicios:[],practicas:[]}];
  
  itemsel:any;

  moduloinfo = false;
  layer=null;

  DefaultIcon = L.icon({
    iconUrl: 'assets/leaflet/images/marker-icon.png',
    shadowUrl: 'assets/leaflet/images/marker-shadow.png'
  });

  constructor() { 
  }

  ngOnInit() {
    
  }

  



  loadMap(item) {
    this.map = L.map('mapaa').setView([this.corx, this.cory], 13);
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    this.agregarMarker(item);
  }

  cambiardata(item){
    this.itemsel = item;
    if(!this.moduloinfo){
      this.moduloinfo = true;
      var ambiente = this;
      setTimeout(function(){
        ambiente.loadMap(item);    
      },1000);
     }else{
      
      this.removerMarker();
      this.agregarMarker(item);
     }
  }


  agregarMarker(item){
    this.layer = L.marker([item.coord.lat, item.coord.lon],{icon:this.DefaultIcon});
    this.layer.addTo(this.map)
    .bindPopup(item.nombre)
    .openPopup();
  }

  removerMarker(){
    if(this.layer!=null){
      console.log("remover");
      this.layer.remove();
    }
  }
}
