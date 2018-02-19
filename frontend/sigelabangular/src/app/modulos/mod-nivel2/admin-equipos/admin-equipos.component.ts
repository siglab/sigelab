import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ObservablesService } from '../../../shared/services/observables.service';

@Component({
  selector: 'app-admin-equipos',
  templateUrl: './admin-equipos.component.html',
  styleUrls: ['./admin-equipos.component.css']
})
export class AdminEquiposComponent implements OnInit {


  equipos = [{nombre:"PORTATIL HP", servicios:[{nombre:"QUIMICA"},{nombre:"TERMODINAMICA"},{nombre:"FISICA"}],practicas:[{nombre:"EXSS"},{nombre:"FGFGFG"}],componentes:[{nombre:"componente 1"},{nombre:"componente 2"}],info:{dir:"cra54 cambulos",tel:"53454636",cel:"43656537",email:"jkhkhjk@univalle.edu.co"}},
             {nombre:"TELESCOPIO", servicios:[{nombre:"CUANTICA"},{nombre:"MATE"},{nombre:"BIOLOGIA"}],practicas:[{nombre:"DFGDFGDF"}],componentes:[{nombre:"componente 3"},{nombre:"componente 4"}],info:{dir:"cra54 san fernado",tel:"53454543gdf636",cel:"43656537",email:"fdgfgjh@univalle.edu.co"}},
             {nombre:"MICROSCOPIO", servicios:[{nombre:"BUSQUEDA"},{nombre:"INVESTIGACION"}],practicas:[{nombre:"HJGHJHJ"}],componentes:[{nombre:"componente 5"}],info:{dir:"cra54 san fernado",tel:"53454543gdf636",cel:"43656537",email:"fdgfgjh@univalle.edu.co"}},
             {nombre:"MARACA",servicios:[{nombre:"CUANTICA"},{nombre:"MATE"},{nombre:"BIOLOGIA"}],practicas:[{nombre:"DFGDFGDF"}],componentes:[{nombre:"componente 6"},{nombre:"componente 7"}],info:{dir:"cra54 san fernado",tel:"53454543gdf636",cel:"43656537",email:"fdgfgjh@univalle.edu.co"}},
             {nombre:"YODO",servicios:[{nombre:"BUSQUEDA"},{nombre:"INVESTIGACION"}],practicas:[{nombre:"HJGHJHJ"}],componentes:[{nombre:"componente 8"}],info:{dir:"cra54 cambulos",tel:"53454636",cel:"43656537",email:"jkhkhjk@univalle.edu.co"}},
             {nombre:"CIANURO",servicios:[{nombre:"QUIMICA"},{nombre:"TERMODINAMICA"},{nombre:"FISICA"}],practicas:[{nombre:"EXSS"},{nombre:"FGFGFG"}],componentes:[],info:{dir:"cra54 cambulos",tel:"53454636",cel:"43656537",email:"jkhkhjk@univalle.edu.co"}},
             {nombre:"SODIO",servicios:[{nombre:"QUIMICA"},{nombre:"TERMODINAMICA"},{nombre:"FISICA"}],practicas:[{nombre:"EXSS"},{nombre:"FGFGFG"}],componentes:[{nombre:"componente 9"},{nombre:"componente 10"}],info:{dir:"cra54 cambulos",tel:"53454636",cel:"43656537",email:"jkhkhjk@univalle.edu.co"}},
             {nombre:"CREMA",servicios:[{nombre:"BUSQUEDA"},{nombre:"INVESTIGACION"}],practicas:[{nombre:"HJGHJHJ"}],componentes:[{nombre:"componente 1"},{nombre:"componente 2"}],info:{dir:"cra54 cambulos",tel:"53454636",cel:"43656537",email:"jkhkhjk@univalle.edu.co"}},
             {nombre:"BATOLA",servicios:[{nombre:"BUSQUEDA"},{nombre:"INVESTIGACION"}],practicas:[{nombre:"HJGHJHJ"}],componentes:[{nombre:"componente 1"},{nombre:"componente 2"}],info:{dir:"cra54 cambulos",tel:"53454636",cel:"43656537",email:"jkhkhjk@univalle.edu.co"}}];

  constructor(private obs:ObservablesService) { 
    this.obs.changeObject({nombre:"SELECCIONE UN LABORATORIO",coord:{lat:"3.403437",lon:"-76.511292"},info:{dir:"",tel:"",cel:"4",email:""},
    servicios:[],practicas:[],equipos:[],personal:[],proyectos:[],solicitudes:[]});
  }

  itemsel:Observable<Array<any>>;
  equiposel={nombre:"", servicios:[],practicas:[],componentes:[],info:{dir:"",tel:"",cel:"",email:""}};
  //equiposel:any;
  ngOnInit() {

    this.obs.currentObject.subscribe(data=>{
      console.log(data);
      this.itemsel = Observable.of(data);
      console.log(this.itemsel);
    });
  }


  cambiardataEquipos(item){
   this.equiposel = this.buscarDato(item);
  }


 buscarDato(item){
   for(let i=0;i<this.equipos.length;i++){
     if(item.nombre == this.equipos[i].nombre){
       return this.equipos[i];
     }
   }
 }

}
