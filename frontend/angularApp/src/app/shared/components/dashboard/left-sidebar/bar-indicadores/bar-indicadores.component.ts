import { Component, OnInit } from '@angular/core';
import { ObservablesService } from '../../../../services/observables.service';

@Component({
  selector: 'app-bar-indicadores',
  templateUrl: './bar-indicadores.component.html',
  styleUrls: ['./bar-indicadores.component.css']
})
export class BarIndicadoresComponent implements OnInit {

  laboratorios = {nombre: 'LABORATORIO CIENCIAS', coord: {lat: '3.425906', lon: '-76.540446'}, info: {dir: 'cra54 cambulos', tel: '53454636', cel: '43656537', email: 'jkhkhjk@univalle.edu.co'},
                  // tslint:disable-next-line:max-line-length
                  servicios: [{nombre: 'QUIMICA'}, {nombre: 'TERMODINAMICA'}, {nombre: 'FISICA'}], practicas: [{nombre: 'EXSS'}, {nombre: 'FGFGFG'}],
                  equipos: [{nombre: 'PORTATIL HP'}, {nombre: 'TELESCOPIO'}, {nombre: 'MICROSCOPIO'}],
                  personal: [{nombre: 'MBAPPE HERNANDEZ'}, {nombre: 'SAMIR ALBERTO'}, {nombre: 'FRANCISCO JULIAN'}],
                  proyectos: [{nombre: 'PROYECTO X'}, {nombre: 'PROYECTO Y'}, {nombre: 'PROYECTO Z'}],
                  solicitudes: [{nombre: 'SUR CALI'}, {nombre: 'AUTONOMA'}, {nombre: 'ICESI'}],
                  espacios: [{edificio: '1', planta: '002', espacio: '9002', estado: 'ACTIVO'}, {edificio: '2', planta: '004', espacio: '9006', estado: 'ACTIVO'}, {edificio: '9', planta: '004', espacio: '9009', estado: 'INACTIVO'}]};


  constructor(private obs: ObservablesService) { }

  ngOnInit() {
  }

  enviaritem() {
    this.obs.changeObject(this.laboratorios);
  }

}
