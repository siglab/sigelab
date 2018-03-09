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
import { AdminProyectosComponent } from './modulos/mod-nivel2/admin-proyectos/admin-proyectos.component';
import { AdminPracticasComponent } from './modulos/mod-nivel2/admin-practicas/admin-practicas.component';


// Necesario para angularfire2
import { environment } from '../environments/environment';
import { AngularFireModule } from 'angularfire2';
import { firebase } from './tokens';
import { SolicitudesServicioComponent } from './modulos/mod-nivel2/admin-servicios/solicitudes-servicio/solicitudes-servicio.component';
import { ServiciosAsociadosComponent } from './modulos/mod-nivel2/admin-servicios/servicios-asociados/servicios-asociados.component';
import { AdminPersonalComponent } from './modulos/mod-nivel2/admin-personal/admin-personal.component';
import { SolicitudMantenimientoComponent } from './modulos/mod-nivel2/admin-solicitudes/solicitud-mantenimiento/solicitud-mantenimiento.component';
import { SolicitudBajaComponent } from './modulos/mod-nivel2/admin-solicitudes/solicitud-baja/solicitud-baja.component';
import { BarAdminLaboratorioSuperiorComponent } from './shared/components/dashboard/left-sidebar/bar-admin-laboratorio-superior/bar-admin-laboratorio-superior.component';
import { BarAdminUsuariosComponent } from './shared/components/dashboard/left-sidebar/bar-admin-usuarios/bar-admin-usuarios.component';
import { BarIndicadoresComponent } from './shared/components/dashboard/left-sidebar/bar-indicadores/bar-indicadores.component';
import { BarComunicacionMasivaComponent } from './shared/components/dashboard/left-sidebar/bar-comunicacion-masiva/bar-comunicacion-masiva.component';
import { AdminLaboratorios25Component } from './modulos/mod-nivel2.5/admin-laboratorios-2-5/admin-laboratorios-2-5.component';
import { ComunicacionMasivaComponent } from './modulos/mod-nivel3/comunicacion-masiva/comunicacion-masiva.component';


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
    AdminProyectosComponent,
    AdminPracticasComponent,
    SolicitudesServicioComponent,
    ServiciosAsociadosComponent,
    AdminPersonalComponent,
    SolicitudMantenimientoComponent,
    SolicitudBajaComponent,
    BarAdminLaboratorioSuperiorComponent,
    BarAdminUsuariosComponent,
    BarIndicadoresComponent,
    BarComunicacionMasivaComponent,
    AdminLaboratorios25Component,
    ComunicacionMasivaComponent
  ],
  imports: [

    BrowserModule,
    DataTablesModule,
    RouterRoutingModule,
    Ng2CompleterModule,
    AngularFireModule.initializeApp(firebase),
    FormsModule,

  ],
  providers: [ObservablesService],
  bootstrap: [AppComponent]
})
export class AppModule { }
