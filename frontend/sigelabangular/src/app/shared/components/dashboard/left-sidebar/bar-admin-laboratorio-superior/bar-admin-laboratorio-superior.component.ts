import { ObservablesService } from './../../../../services/observables.service';
import { Component, OnInit } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from 'angularfire2/firestore';
import { Observable } from '@firebase/util';

@Component({
  selector: 'app-bar-admin-laboratorio-superior',
  templateUrl: './bar-admin-laboratorio-superior.component.html',
  styleUrls: ['./bar-admin-laboratorio-superior.component.css']
})
export class BarAdminLaboratorioSuperiorComponent implements OnInit {

  laboratorios = [{nombre: 'LABORATORIO CIENCIAS', coord: {lat: '3.425906', lon: '-76.540446'}, info: {dir: 'cra54 cambulos', tel: '53454636', cel: '43656537', email: 'jkhkhjk@univalle.edu.co'},
                   servicios: [{nombre: 'QUIMICA'}, {nombre: 'TERMODINAMICA'}, {nombre: 'FISICA'}], practicas: [{nombre: 'EXSS'}, {nombre: 'FGFGFG'}],
                   equipos: [{nombre: 'PORTATIL HP'}, {nombre: 'TELESCOPIO'}, {nombre: 'MICROSCOPIO'}],
                   personal: [{nombre: 'MBAPPE HERNANDEZ'}, {nombre: 'SAMIR ALBERTO'}, {nombre: 'FRANCISCO JULIAN'}],
                   proyectos: [{nombre: 'PROYECTO X'}, {nombre: 'PROYECTO Y'}, {nombre: 'PROYECTO Z'}],
                   solicitudes: [{nombre: 'SUR CALI'}, {nombre: 'AUTONOMA'}, {nombre: 'ICESI'}],
                   espacios: [{edificio: '1', planta: '002', espacio: '9002', estado: 'ACTIVO'}, {edificio: '2', planta: '004', espacio: '9006', estado: 'ACTIVO'}, {edificio: '9', planta: '004', espacio: '9009', estado: 'INACTIVO'}]},
                {nombre: 'LABORATORIO SOCIAES', coord: {lat: '3.419737', lon: '-76.540275'}, info: {dir: 'cra54 san fernado', tel: '53454543gdf636', cel: '43656537', email: 'fdgfgjh@univalle.edu.co'},
                  servicios: [{nombre: 'CUANTICA'}, {nombre: 'MATE'}, {nombre: 'BIOLOGIA'}], practicas: [{nombre: 'DFGDFGDF'}],
                  equipos: [{nombre: 'MARACA'}, {nombre: 'YODO'}, {nombre: 'CIANURO'}],
                  personal: [{nombre: 'JHON DIAZ'}, {nombre: 'JUAN ROBERTO'}, {nombre: 'JULIAN'}],
                  proyectos: [{nombre: 'PROYECTO R'}, {nombre: 'PROYECTO D'}, {nombre: 'PROYECTO G'}],
                  solicitudes: [{nombre: 'SANTIAGO'}, {nombre: 'AUTONOMA'}, {nombre: 'SANBUENAVENTURA'}],
                  espacios: [{edificio: '1', planta: '002', espacio: '9002', estado: 'ACTIVO'}]},
                {nombre: 'LABORATORIO X', coord: {lat: '3.420380', lon: '-76.510105'}, info: {dir: 'cra54 sfdfsdfs', tel: '35345435', cel: '436574676537', email: 'fgjh@univalle.edu.co'},
                  servicios: [{nombre: 'BUSQUEDA'}, {nombre: 'INVESTIGACION'}], practicas: [{nombre: 'HJGHJHJ'}],
                  equipos: [{nombre: 'SODIO'}, {nombre: 'CREMA'}, {nombre: 'BATOLA'}],
                  personal: [{nombre: 'SEBASTIAN'}, {nombre: 'JIGGY DRAMA'}, {nombre: 'FRANCISCO'}],
                  proyectos: [{nombre: 'PROYECTO DFGDF'}, {nombre: 'PROYECTO GFD'}, {nombre: 'PROYECTO FUE'}],
                  solicitudes: [{nombre: 'SUR CALI'}, {nombre: 'AUTONOMA'}, {nombre: 'ICESI'}],
                  espacios: [{edificio: '6', planta: '0FD2', espacio: '945302', estado: 'ACTIVO'}, {edificio: '8', planta: '00354', espacio: '92346', estado: 'INACTIVO'}, {edificio: '9', planta: '004', espacio: '9009', estado: 'INACTIVO'}]},
                {nombre: 'LABORATORIO Y', coord: {lat: '3.403437', lon: '-76.511292'}, info: {dir: 'cra54 dfsdfsdf', tel: '46363565', cel: '4357547656537', email: 'hkjkhjjh@univalle.edu.co'},
                servicios: [], practicas: [], equipos: [], personal: [], proyectos: [], solicitudes: [], espacios: []}];


  constructor(private obs: ObservablesService, private afs: AngularFirestore) { }

  ngOnInit() {

  }




  enviaritem() {
    this.obs.changeObject(this.laboratorios);
  }
}
