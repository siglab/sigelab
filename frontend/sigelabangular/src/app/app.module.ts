import { QrService } from './modulos/mod-nivel2/services/qr.service';
import { QuerysPrincipalService } from './modulos/mod-principal/services/querys-principal.service';
import { ObserverPrincipalService } from './modulos/mod-principal/services/observer-principal.service';
import {AngularFirestoreModule} from 'angularfire2/firestore';
import { AngularFireStorageModule } from 'angularfire2/storage';

import { DataTablesModule } from 'angular-datatables';
import { ObservablesService } from './shared/services/observables.service';
import { PrincipalComponent } from './shared/components/dashboard/principal/principal.component';
import { RouterRoutingModule } from './router/router-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LocationStrategy, HashLocationStrategy} from '@angular/common';

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
// tslint:disable-next-line:max-line-length
import { SolicitudMantenimientoComponent } from './modulos/mod-nivel2/admin-solicitudes/solicitud-mantenimiento/solicitud-mantenimiento.component';
import { SolicitudBajaComponent } from './modulos/mod-nivel2/admin-solicitudes/solicitud-baja/solicitud-baja.component';
// tslint:disable-next-line:max-line-length
import { BarAdminLaboratorioSuperiorComponent } from './shared/components/dashboard/left-sidebar/bar-admin-laboratorio-superior/bar-admin-laboratorio-superior.component';
import { BarAdminUsuariosComponent } from './shared/components/dashboard/left-sidebar/bar-admin-usuarios/bar-admin-usuarios.component';
import { BarIndicadoresComponent } from './shared/components/dashboard/left-sidebar/bar-indicadores/bar-indicadores.component';
// tslint:disable-next-line:max-line-length
import { BarComunicacionMasivaComponent } from './shared/components/dashboard/left-sidebar/bar-comunicacion-masiva/bar-comunicacion-masiva.component';
import { AdminLaboratorios25Component } from './modulos/mod-nivel2.5/admin-laboratorios-2-5/admin-laboratorios-2-5.component';
import { ComunicacionMasivaComponent } from './modulos/mod-nivel3/comunicacion-masiva/comunicacion-masiva.component';
// tslint:disable-next-line:max-line-length
import { IndicadoresGraficasReportesComponent } from './modulos/mod-nivel2.5/indicadores-graficas-reportes/indicadores-graficas-reportes.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SolicitudesNivel3Component } from './modulos/mod-nivel3/solicitudes-nivel3/solicitudes-nivel3.component';
// tslint:disable-next-line:max-line-length
import { BarSolicitudesNivel3Component } from './shared/components/dashboard/left-sidebar/bar-solicitudes-nivel3/bar-solicitudes-nivel3.component';

import { MatNativeDateModule, MatTableModule, MatInputModule, MatPaginator, MatPaginatorModule, MatSortModule } from '@angular/material';

import { LoginComponent } from './modulos/login/login.component';
import { LoginService } from './modulos/login/login-service/login.service';

// angular fireauth
import { AngularFireAuth } from 'angularfire2/auth';
import { QuerysAutenticadoService } from './modulos/mod-autenticado/services/querys-autenticado.service';
import { ObserverAutenticadoService } from './modulos/mod-autenticado/services/observer-autenticado.service';

// librerias material
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatStepperModule} from '@angular/material/stepper';
  // alertas toast
import { ToastrModule } from 'ngx-toastr';
import { AdminLaboratorios3Component } from './modulos/mod-nivel3/admin-laboratorios-3/admin-laboratorios-3.component';
import { ServicesNivel3Service } from './modulos/mod-nivel3/services/services-nivel3.service';
import { IndicadoresGraficasReportes3Component } from './modulos/mod-nivel3/indicadores-graficas-reportes3/indicadores-graficas-reportes3.component';
import { BardAdminQrComponent } from './shared/components/dashboard/left-sidebar/bard-admin-qr/bard-admin-qr.component';
import { AdminQrComponent } from './modulos/mod-nivel2/admin-qr/admin-qr.component';
import { FormQrComponent } from './modulos/mod-nivel2/admin-qr/form-qr/form-qr.component';

import { EspaciosService } from './modulos/mod-nivel2/services/espacios.service';

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
    ComunicacionMasivaComponent,
    IndicadoresGraficasReportesComponent,
    SolicitudesNivel3Component,
    BarSolicitudesNivel3Component,
    LoginComponent,
    AdminLaboratorios3Component,
    IndicadoresGraficasReportes3Component,
    BardAdminQrComponent,
    AdminQrComponent,
    FormQrComponent,
  ],
  imports: [
    AngularFireStorageModule,
    BrowserModule,
    DataTablesModule,
    RouterRoutingModule,
    Ng2CompleterModule,
    NgxChartsModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(firebase),
    AngularFirestoreModule,
    FormsModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    MatTableModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    MatCheckboxModule,
    MatStepperModule,
    ToastrModule.forRoot()

  ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    ObservablesService,
    ObserverPrincipalService,
    QuerysPrincipalService,
    QuerysAutenticadoService,
    ObserverAutenticadoService,
    LoginService,
    AngularFireAuth,
<<<<<<< HEAD
    AngularFireStorage,
    ServicesNivel3Service
    ],
=======
    QrService,
    EspaciosService
  ],
>>>>>>> 9d42f30d42d7cc9077181ff769f5f9e779407a01
  bootstrap: [AppComponent]
})
export class AppModule { }
