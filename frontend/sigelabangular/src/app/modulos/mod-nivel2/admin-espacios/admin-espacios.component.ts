import { ObservablesService } from './../../../shared/services/observables.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-admin-espacios',
  templateUrl: './admin-espacios.component.html',
  styleUrls: ['./admin-espacios.component.css']
})
export class AdminEspaciosComponent implements OnInit {

  dtTrigger = new Subject();
  dtTrigger1 = new Subject();

  dtOptions: DataTables.Settings = {};

  constructor(private obs:ObservablesService) { 
    this.obs.changeObject({nombre:"SELECCIONE UN LABORATORIO",coord:{lat:"3.403437",lon:"-76.511292"},info:{dir:"",tel:"",cel:"4",email:""},
    servicios:[],practicas:[],equipos:[],personal:[],proyectos:[],solicitudes:[],espacios:[]});
    this.loadTable();
  }

  itemsel:Observable<Array<any>>;

  espaciosel={edificio:"",planta:"",espacio:"",estado:"",info:{facultad:"",area:"",arealibre:"",capacidad:""}};

  espacios = [{edificio:"1",planta:"002",espacio:"9002",estado:"ACTIVO",s1:"30C",s2:"43%",aa:"PRACTICA X",oa:"23",
              info:{facultad:"INGENIERIA",area:"45 MT2",arealibre:"34MT2",capacidad:"12 PERSONAS"}},
              {edificio:"2",planta:"004",espacio:"9006",estado:"ACTIVO",s1:"40C",s2:"41%",aa:"PRACTICA Y",oa:"10",
              info:{facultad:"ARTES",area:"45 MT2",arealibre:"34MT2",capacidad:"17 PERSONAS"}},
              {edificio:"9",planta:"004",espacio:"9009",estado:"INACTIVO",s1:"50C",s2:"33%",aa:"PRACTICA D",oa:"21",
              info:{facultad:"BIOMEDICA",area:"45 MT2",arealibre:"34MT2",capacidad:"12 PERSONAS"}},
              {edificio:"1",planta:"002",espacio:"9002",estado:"ACTIVO",s1:"60C",s2:"67%",aa:"PRACTICA S",oa:"78",
              info:{facultad:"HUMANIDADES",area:"45 MT2",arealibre:"34MT2",capacidad:"16 PERSONAS"}},
              {edificio:"6",planta:"0FD2",espacio:"945302",estado:"ACTIVO",s1:"70C",s2:"68%",aa:"PRACTICA G",oa:"100",
              info:{facultad:"CIENCIA EXACTA",area:"45 MT2",arealibre:"34MT2",capacidad:"8 PERSONAS"}},
              {edificio:"8",planta:"00354",espacio:"92346",estado:"INACTIVO",s1:"80C",s2:"12%",aa:"PRACTICA J",oa:"4",
              info:{facultad:"INGENIERIA",area:"45 MT2",arealibre:"34MT2",capacidad:"17 PERSONAS"}},
              {edificio:"9",planta:"004",espacio:"9009",estado:"INACTIVO",s1:"20C",s2:"23%",aa:"PRACTICA E",oa:"56",
              info:{facultad:"INGENIERIA",area:"45 MT2",arealibre:"34MT2",capacidad:"10 PERSONAS"}}];

  indicadores = [{p1:"hora/mes",p2:"60",p3:"80",p4:"9"},{p1:"Ind Aprov",p2:"37%",p3:"57%",p4:"0"}]
 

  ngOnInit() {
    this.obs.currentObject.subscribe(data=>{
      this.itemsel = Observable.of(data);
      this.dtTrigger.next();
    });

    
    
  }

  loadTable(){
    this.dtOptions = {
      retrieve:true
    };
  }

  cambiardataEspacios(item){
    this.espaciosel = this.buscarDato(item);
  }


 buscarDato(item){
   for(let i=0;i<this.espacios.length;i++){
     if(item.espacio == this.espacios[i].espacio){
       return this.espacios[i];
     }
   }
 }


mostrardata(item){
  console.log(item);
}
}
