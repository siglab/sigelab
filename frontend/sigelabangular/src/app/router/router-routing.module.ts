import { FormQrComponent } from './../modulos/mod-nivel2/admin-qr/form-qr/form-qr.component';
import { AdminQrComponent } from './../modulos/mod-nivel2/admin-qr/admin-qr.component';
import { ComunicacionMasivaComponent } from './../modulos/mod-nivel3/comunicacion-masiva/comunicacion-masiva.component';

import { AdminPracticasComponent } from './../modulos/mod-nivel2/admin-practicas/admin-practicas.component';
import { AdminEspaciosComponent } from './../modulos/mod-nivel2/admin-espacios/admin-espacios.component';
import { AdminLaboratoriosComponent } from './../modulos/mod-nivel2/admin-laboratorios/admin-laboratorios.component';
import { BusPruComponent } from './../modulos/mod-principal/bus-pru/bus-pru.component';
import { BusServComponent } from './../modulos/mod-principal/bus-serv/bus-serv.component';
import { PrincipalComponent } from './../shared/components/dashboard/principal/principal.component';

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BusLabComponent } from '../modulos/mod-principal/bus-lab/bus-lab.component';
import { AdminSolicitudesComponent } from '../modulos/mod-autenticado/admin-solicitudes/admin-solicitudes.component';
import { AdminEquiposComponent } from '../modulos/mod-nivel2/admin-equipos/admin-equipos.component';
import { AdminProyectosComponent } from '../modulos/mod-nivel2/admin-proyectos/admin-proyectos.component';
import { SolicitudesServicioComponent } from '../modulos/mod-nivel2/admin-servicios/solicitudes-servicio/solicitudes-servicio.component';
import { ServiciosAsociadosComponent } from '../modulos/mod-nivel2/admin-servicios/servicios-asociados/servicios-asociados.component';
import { AdminPersonalComponent } from '../modulos/mod-nivel2/admin-personal/admin-personal.component';
// tslint:disable-next-line:max-line-length
import { SolicitudMantenimientoComponent } from '../modulos/mod-nivel2/admin-solicitudes/solicitud-mantenimiento/solicitud-mantenimiento.component';
import { SolicitudBajaComponent } from '../modulos/mod-nivel2/admin-solicitudes/solicitud-baja/solicitud-baja.component';
import { SolicitudesNivel3Component } from '../modulos/mod-nivel3/solicitudes-nivel3/solicitudes-nivel3.component';
import { LoginComponent } from '../modulos/login/login.component';
import { AdminLaboratorios3Component } from '../modulos/mod-nivel3/admin-laboratorios-3/admin-laboratorios-3.component';
// tslint:disable-next-line:max-line-length
import { IndicadoresGraficasReportes3Component } from '../modulos/mod-nivel3/indicadores-graficas-reportes3/indicadores-graficas-reportes3.component';
import { RegistroComponent } from '../modulos/registro/registro.component';
import { AuthGuard } from '../shared/services/guards/auth.guard';
import { Nivel2Guard } from '../shared/services/guards/nivel2.guard';
import { Nivel25Guard } from '../shared/services/guards/nivel2-5.guard';
import { Nivel3Guard } from '../shared/services/guards/nivel3.guard';
import { InicioAppComponent } from '../modulos/mod-principal/inicio-app/inicio-app.component';
import { AdminUsuariosComponent } from '../modulos/mod-nivel3/admin-usuarios/admin-usuarios.component';


const routes: Routes = [
  { path: 'login', component: LoginComponent},
  { path: 'inicio', component: InicioAppComponent},
  { path: 'registro', component: RegistroComponent},
  { path: 'principal', component: PrincipalComponent,
    children: [
      { path: 'busquedalaboratorio', component: BusLabComponent},
      { path: 'busquedaservicio', component: BusServComponent},
      { path: 'busquedaprueba', component: BusPruComponent},
      { path: 'adminsolicitudes', component: AdminSolicitudesComponent, canActivate: [AuthGuard]},
      { path: 'adminlaboratorios', component: AdminLaboratoriosComponent, canActivate: [Nivel2Guard]},
      { path: 'adminequipos', component: AdminEquiposComponent, canActivate: [Nivel2Guard]},
      { path: 'adminespacios', component: AdminEspaciosComponent, canActivate: [Nivel2Guard]},
      { path: 'adminpracticas', component: AdminPracticasComponent, canActivate: [Nivel2Guard]},
      { path: 'adminpersonal', component: AdminPersonalComponent, canActivate: [Nivel2Guard]},
      { path: 'adminqr', component: AdminQrComponent},
      { path: 'qrinventario/:id', component: FormQrComponent},
      { path: 'adminserviciosolicitud', component: SolicitudesServicioComponent, canActivate: [Nivel2Guard]},
      { path: 'adminserviciosasociados', component: ServiciosAsociadosComponent, canActivate: [Nivel2Guard]},
      { path: 'adminproyectos', component: AdminProyectosComponent, canActivate: [Nivel2Guard]},
      { path: 'adminsolicitudmantenimiento', component: SolicitudMantenimientoComponent, canActivate: [Nivel2Guard]},


      { path: 'adminlaboratorios3', component: AdminLaboratorios3Component, canActivate: [Nivel3Guard]},
      { path: 'comunicacionmasiva', component: ComunicacionMasivaComponent, canActivate: [Nivel25Guard]},
      { path: 'usuarios', component: AdminUsuariosComponent, canActivate: [Nivel3Guard]},
      { path: 'indicadores3', component: IndicadoresGraficasReportes3Component, canActivate: [Nivel3Guard]},
      { path: 'solicitudes3', component: SolicitudesNivel3Component, canActivate: [Nivel3Guard]},
      { path: '', pathMatch: 'full', redirectTo: 'busquedalaboratorio'}
    ]},
  { path: '', pathMatch: 'full', redirectTo: 'inicio'},
  { path: '**', pathMatch: 'full', redirectTo: 'principal/busquedalaboratorio'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {  useHash: true  } )],
  exports: [RouterModule]
})
export class RouterRoutingModule { }
