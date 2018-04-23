import { Component, OnInit } from '@angular/core';
import { ObserverPrincipalService } from '../../../../../modulos/mod-principal/services/observer-principal.service';
import { QuerysPrincipalService } from '../../../../../modulos/mod-principal/services/querys-principal.service';

@Component({
  selector: 'app-bar-busqueda',
  templateUrl: './bar-busqueda.component.html',
  styleUrls: ['./bar-busqueda.component.css']
})
export class BarBusquedaComponent implements OnInit {

  constructor(private observer: ObserverPrincipalService, private query: QuerysPrincipalService) { }

  ngOnInit() {


  }

  cargarLabs() {
    this.query.getLaboratorios().subscribe(data => {

      this.observer.changeDatatableLabs(this.query.estructurarData(data));

    });
  }



}
