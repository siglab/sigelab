import { Component, OnInit, OnDestroy } from '@angular/core';
import { ObserverPrincipalService } from '../../../../../modulos/mod-principal/services/observer-principal.service';
import { QuerysPrincipalService } from '../../../../../modulos/mod-principal/services/querys-principal.service';
import { Router } from '@angular/router';
import { mainModule } from '../../../../layouts/sidebar/sidebar.component';
import { l2Module } from '../../../../layouts/sidebar/sidebar.component';

@Component({
  selector: 'app-bar-busqueda',
  templateUrl: './bar-busqueda.component.html',
  styleUrls: ['./bar-busqueda.component.css']
})
export class BarBusquedaComponent implements OnInit, OnDestroy {
  hasMainModule;
  hasLevel2Module;
  constructor(public router: Router) { }
  ngOnInit() {
    this.hasMainModule = mainModule;
    this.hasLevel2Module = l2Module;

    console.log(this.hasMainModule);
    console.log(this.hasLevel2Module);

  }
  ngOnDestroy() {
    this.hasMainModule = null;
    this.hasLevel2Module = null;
  }
}
