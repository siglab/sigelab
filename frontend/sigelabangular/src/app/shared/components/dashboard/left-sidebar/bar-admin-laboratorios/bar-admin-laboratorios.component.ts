import { ObservablesService } from './../../../../services/observables.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bar-admin-laboratorios',
  templateUrl: './bar-admin-laboratorios.component.html',
  styleUrls: ['./bar-admin-laboratorios.component.css']
})
export class BarAdminLaboratoriosComponent implements OnInit {

  laboratorios = [{nombre:"LABORATORIO CIENCIAS",coord:{lat:"3.425906",lon:"-76.540446"},info:{dir:"cra54 cambulos",tel:"53454636",cel:"43656537",email:"jkhkhjk@univalle.edu.co"},
                   servicios:[{nombre:"QUIMICA"},{nombre:"TERMODINAMICA"},{nombre:"FISICA"}],practicas:[{nombre:"EXSS"},{nombre:"FGFGFG"}],
                   equipos:[{nombre:"PORTATIL HP"},{nombre:"TELESCOPIO"},{nombre:"MICROSCOPIO"}],
                   personal:[{nombre:"MBAPPE HERNANDEZ"},{nombre:"SAMIR ALBERTO"},{nombre:"FRANCISCO JULIAN"}],
                   proyectos:[{nombre:"PROYECTO X"},{nombre:"PROYECTO Y"},{nombre:"PROYECTO Z"}],
                   solicitudes:[{nombre:"SUR CALI"},{nombre:"AUTONOMA"},{nombre:"ICESI"}]},
                {nombre:"LABORATORIO SOCIAES",coord:{lat:"3.419737",lon:"-76.540275"},info:{dir:"cra54 san fernado",tel:"53454543gdf636",cel:"43656537",email:"fdgfgjh@univalle.edu.co"},
                  servicios:[{nombre:"CUANTICA"},{nombre:"MATE"},{nombre:"BIOLOGIA"}],practicas:[{nombre:"DFGDFGDF"}],
                  equipos:[{nombre:"MARACA"},{nombre:"YODO"},{nombre:"CIANURO"}],
                  personal:[{nombre:"JHON DIAZ"},{nombre:"JUAN ROBERTO"},{nombre:"JULIAN"}],
                  proyectos:[{nombre:"PROYECTO R"},{nombre:"PROYECTO D"},{nombre:"PROYECTO G"}],
                  solicitudes:[{nombre:"SANTIAGO"},{nombre:"AUTONOMA"},{nombre:"SANBUENAVENTURA"}]},
                {nombre:"LABORATORIO X",coord:{lat:"3.420380",lon:"-76.510105"},info:{dir:"cra54 sfdfsdfs",tel:"35345435",cel:"436574676537",email:"fgjh@univalle.edu.co"},
                  servicios:[{nombre:"BUSQUEDA"},{nombre:"INVESTIGACION"}],practicas:[{nombre:"HJGHJHJ"}],
                  equipos:[{nombre:"SODIO"},{nombre:"CREMA"},{nombre:"BATOLA"}],
                  personal:[{nombre:"SEBASTIAN"},{nombre:"JIGGY DRAMA"},{nombre:"FRANCISCO"}],
                  proyectos:[{nombre:"PROYECTO DFGDF"},{nombre:"PROYECTO GFD"},{nombre:"PROYECTO FUE"}],
                  solicitudes:[{nombre:"SUR CALI"},{nombre:"AUTONOMA"},{nombre:"ICESI"}]},
                {nombre:"LABORATORIO Y",coord:{lat:"3.403437",lon:"-76.511292"},info:{dir:"cra54 dfsdfsdf",tel:"46363565",cel:"4357547656537",email:"hkjkhjjh@univalle.edu.co"},
                servicios:[],practicas:[],equipos:[],personal:[],proyectos:[],solicitudes:[]}];


  constructor(private obs:ObservablesService) { }

  ngOnInit() {
  }

  enviaritem(item){
    this.obs.changeObject(item);
  }

}
