import { Component, OnInit } from '@angular/core';
import { ObservablesService } from '../../../shared/services/observables.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-admin-practicas',
  templateUrl: './admin-practicas.component.html',
  styleUrls: ['./admin-practicas.component.css']
})
export class AdminPracticasComponent implements OnInit {

  itemsel:Observable<Array<any>>;;

  constructor(private obs:ObservablesService) {
    this.obs.changeObject({nombre:"SELECCIONE UN LABORATORIO",coord:{lat:"3.403437",lon:"-76.511292"},info:{dir:"",tel:"",cel:"4",email:""},
    servicios:[],practicas:[],equipos:[],personal:[],proyectos:[],solicitudes:[]});
   }

  ngOnInit() {
    this.obs.currentObject.subscribe(data=>{
      console.log(data);
      this.itemsel = Observable.of(data);
      console.log(this.itemsel);
    });
  }

}
