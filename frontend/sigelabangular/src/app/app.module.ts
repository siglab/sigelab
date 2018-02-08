import { PrincipalComponent } from './shared/components/dashboard/principal/principal.component';
import { RouterRoutingModule } from './router/router-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { DataTablesModule } from 'angular-datatables';
import { AppComponent } from './app.component';
import { DashCenterComponent } from './shared/layouts/dash-center/dash-center.component';
import { HeaderComponent } from './shared/layouts/header/header.component';
import { SidebarComponent } from './shared/layouts/sidebar/sidebar.component';
import { BarBusquedaComponent } from './shared/components/dashboard/left-sidebar/bar-busqueda/bar-busqueda.component';
import { BusLabComponent } from './modulos/mod-principal/bus-lab/bus-lab.component';
import { BusServComponent } from './modulos/mod-principal/bus-serv/bus-serv.component';
import { BusPruComponent } from './modulos/mod-principal/bus-pru/bus-pru.component';



@NgModule({
  declarations: [
    AppComponent,
    PrincipalComponent,
    DashCenterComponent,
    HeaderComponent,
    SidebarComponent,
    BarBusquedaComponent,
    BusLabComponent,
    BusServComponent,
    BusPruComponent
  ],
  imports: [
    BrowserModule,
    DataTablesModule,
    RouterRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
