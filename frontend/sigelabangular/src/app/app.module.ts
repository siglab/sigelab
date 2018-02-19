import { ObservablesService } from './shared/services/observables.service';
import { PrincipalComponent } from './shared/components/dashboard/principal/principal.component';
import { RouterRoutingModule } from './router/router-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { DataTablesModule } from 'angular-datatables';
import { AppComponent } from './app.component';
import { DashCenterComponent } from './shared/layouts/dash-center/dash-center.component';
import { HeaderComponent } from './shared/layouts/header/header.component';
import { SidebarComponent } from './shared/layouts/sidebar/sidebar.component';
import { BarBusquedaComponent } from './shared/components/dashboard/left-sidebar/bar-busqueda/bar-busqueda.component';
import { BusLabComponent } from './modulos/mod-principal/bus-lab/bus-lab.component';
import { BusServComponent } from './modulos/mod-principal/bus-serv/bus-serv.component';
import { BusPruComponent } from './modulos/mod-principal/bus-pru/bus-pru.component';

import { Ng2CompleterModule } from 'ng2-completer';
// tslint:disable-next-line:max-line-length
import { BarAdminSolicitudesComponent } from './shared/components/dashboard/left-sidebar/bar-admin-solicitudes/bar-admin-solicitudes.component';
import { AdminSolicitudesComponent } from './modulos/mod-autenticado/admin-solicitudes/admin-solicitudes.component';
import { AdminLaboratoriosComponent } from './modulos/mod-nivel2/admin-laboratorios/admin-laboratorios.component';
// tslint:disable-next-line:max-line-length
import { BarAdminLaboratoriosComponent } from './shared/components/dashboard/left-sidebar/bar-admin-laboratorios/bar-admin-laboratorios.component';
import { AdminEquiposComponent } from './modulos/mod-nivel2/admin-equipos/admin-equipos.component';
import { AdminEspaciosComponent } from './modulos/mod-nivel2/admin-espacios/admin-espacios.component';
import { AdminServiciosComponent } from './modulos/mod-nivel2/admin-servicios/admin-servicios.component';
import { AdminProyectosComponent } from './modulos/mod-nivel2/admin-proyectos/admin-proyectos.component';
import { AdminPracticasComponent } from './modulos/mod-nivel2/admin-practicas/admin-practicas.component';


// Necesario para angularfire2
import { environment } from '../environments/environment';
import { AngularFireModule } from 'angularfire2';

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
    BusPruComponent,
    BarAdminSolicitudesComponent,
    AdminSolicitudesComponent,
    AdminLaboratoriosComponent,
    BarAdminLaboratoriosComponent,
    AdminEquiposComponent,
    AdminEspaciosComponent,
    AdminServiciosComponent,
    AdminProyectosComponent,
    AdminPracticasComponent
  ],
  imports: [

    BrowserModule,
    DataTablesModule,
    RouterRoutingModule,
    Ng2CompleterModule,
    AngularFireModule.initializeApp(environment.firebase),
    FormsModule,

  ],
  providers: [ObservablesService],
  bootstrap: [AppComponent]
})
export class AppModule { }
