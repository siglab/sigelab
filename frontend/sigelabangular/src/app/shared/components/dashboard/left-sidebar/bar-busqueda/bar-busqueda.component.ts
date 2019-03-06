import { Component, OnInit, OnDestroy } from '@angular/core';
import { ObserverPrincipalService } from '../../../../../modulos/mod-principal/services/observer-principal.service';
import { QuerysPrincipalService } from '../../../../../modulos/mod-principal/services/querys-principal.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bar-busqueda',
  templateUrl: './bar-busqueda.component.html',
  styleUrls: ['./bar-busqueda.component.css']
})
export class BarBusquedaComponent implements OnInit, OnDestroy {
  constructor(public router: Router) { }
  ngOnInit() { }
  ngOnDestroy() { }
}
