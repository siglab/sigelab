import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ObservablesService } from '../../../shared/services/observables.service';

@Component({
  selector: 'app-indicadores-graficas-reportes',
  templateUrl: './indicadores-graficas-reportes.component.html',
  styleUrls: ['./indicadores-graficas-reportes.component.css']
})
export class IndicadoresGraficasReportesComponent implements OnInit {
  // tslint:disable-next-line:max-line-length
  convenios = [{nombre: 'LABORATORIO CIENCIAS', coord: {lat: '3.425906', lon: '-76.540446'}, info: {dir: 'cra54 cambulos', tel: '53454636', cel: '43656537', email: 'jkhkhjk@univalle.edu.co'},
              // tslint:disable-next-line:max-line-length
              servicios: [{nombre: 'QUIMICA'}, {nombre: 'TERMODINAMICA'}, {nombre: 'FISICA'}], practicas: [{nombre: 'EXSS'}, {nombre: 'FGFGFG'}]},
              // tslint:disable-next-line:max-line-length
              {nombre: 'LABORATORIO SOCIAES', coord: {lat: '3.419737', lon: '-76.540275'}, info: {dir: 'cra54 san fernado', tel: '53454543gdf636', cel: '43656537', email: 'fdgfgjh@univalle.edu.co'},
              servicios: [{nombre: 'CUANTICA'}, {nombre: 'MATE'}, {nombre: 'BIOLOGIA'}], practicas: [{nombre: 'DFGDFGDF'}]},
              // tslint:disable-next-line:max-line-length
              {nombre: 'LABORATORIO X', coord: {lat: '3.420380', lon: '-76.510105'}, info: {dir: 'cra54 sfdfsdfs', tel: '35345435', cel: '436574676537', email: 'fgjh@univalle.edu.co'},
              servicios: [{nombre: 'BUSQUEDA'}, {nombre: 'INVESTIGACION'}], practicas: [{nombre: 'HJGHJHJ'}]},
              // tslint:disable-next-line:max-line-length
              {nombre: 'LABORATORIO Y', coord: {lat: '3.403437', lon: '-76.511292'}, info: {dir: 'cra54 dfsdfsdf', tel: '46363565', cel: '4357547656537', email: 'hkjkhjjh@univalle.edu.co'},
              servicios: [], practicas: []}];

  itemsel: Observable<Array<any>>;

  constructor(private obs: ObservablesService) {
    // this.obs.changeObject({nombre:"SELECCIONE UN LABORATORIO",coord:{lat:"3.403437",lon:"-76.511292"},info:{dir:"",tel:"",cel:"4",email:""},
    // servicios:[],practicas:[],equipos:[],personal:[],proyectos:[],solicitudes:[]});
  }

  ngOnInit() {
    this.obs.currentObject.subscribe(data => {
      console.log(data);
      this.itemsel = Observable.of(data);
      console.log(this.itemsel);
    });
  }


}
