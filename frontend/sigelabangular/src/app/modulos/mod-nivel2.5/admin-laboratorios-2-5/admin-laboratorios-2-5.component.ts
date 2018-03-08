import { ObservablesService } from './../../../shared/services/observables.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-admin-laboratorios-2-5',
  templateUrl: './admin-laboratorios-2-5.component.html',
  styleUrls: ['./admin-laboratorios-2-5.component.css']
})
export class AdminLaboratorios25Component implements OnInit {

  itemsel: Observable<Array<any>>;
  convenios: any;

  constructor(private obs: ObservablesService) {
    // this.obs.changeObject({nombre:"SELECCIONE UN LABORATORIO",coord:{lat:"3.403437",lon:"-76.511292"},info:{dir:"",tel:"",cel:"4",email:""},
    // servicios:[],practicas:[],equipos:[],personal:[],proyectos:[],solicitudes:[]});
  }
  ngOnInit() {
    this.obs.currentObject.subscribe(data => {
      console.log(data);
      this.convenios = Observable.of(data);
      console.log(this.itemsel);
    });
  }

}
