import { FormQrComponent } from './../modulos/mod-nivel2/admin-qr/form-qr/form-qr.component';
import { AdminQrComponent } from './../modulos/mod-nivel2/admin-qr/admin-qr.component';
import { ComunicacionMasivaComponent } from './../modulos/mod-nivel3/comunicacion-masiva/comunicacion-masiva.component';
import { AdminLaboratorios25Component } from './../modulos/mod-nivel2.5/admin-laboratorios-2-5/admin-laboratorios-2-5.component';

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
// tslint:disable-next-line:max-line-length
import { IndicadoresGraficasReportesComponent } from '../modulos/mod-nivel2.5/indicadores-graficas-reportes/indicadores-graficas-reportes.component';
import { SolicitudesNivel3Component } from '../modulos/mod-nivel3/solicitudes-nivel3/solicitudes-nivel3.component';
import { LoginComponent } from '../modulos/login/login.component';


const routes: Routes = [
  { path: 'login', component: LoginComponent},
  { path: 'principal', component: PrincipalComponent,
    children: [
      { path: 'busquedalaboratorio', component: BusLabComponent},
      { path: 'busquedaservicio', component: BusServComponent},
      { path: 'busquedaprueba', component: BusPruComponent},
      { path: 'adminsolicitudes', component: AdminSolicitudesComponent},
      { path: 'adminlaboratorios', component: AdminLaboratoriosComponent},
      { path: 'adminequipos', component: AdminEquiposComponent},
      { path: 'adminespacios', component: AdminEspaciosComponent},
      { path: 'adminpracticas', component: AdminPracticasComponent},
      { path: 'adminpersonal', component: AdminPersonalComponent},
      { path: 'adminqr', component: AdminQrComponent,
      },
      { path : 'qrinventario/:id', component: FormQrComponent   },
      { path: 'adminserviciosolicitud', component: SolicitudesServicioComponent},
      { path: 'adminserviciosasociados', component: ServiciosAsociadosComponent},
      { path: 'adminproyectos', component: AdminProyectosComponent},
      { path: 'adminsolicitudmantenimiento', component: SolicitudMantenimientoComponent},
      { path: 'adminsolicitudbaja', component: SolicitudBajaComponent},

      { path: 'adminlaboratorios25', component: AdminLaboratorios25Component},
      { path: 'indicadores25', component: IndicadoresGraficasReportesComponent},

      { path: 'comunicacionmasiva', component: ComunicacionMasivaComponent},
      { path: 'solicitudes3', component: SolicitudesNivel3Component},
      { path: '', pathMatch: 'full', redirectTo: 'busquedalaboratorio'}
    ]},
  { path: '', pathMatch: 'full', redirectTo: 'principal/busquedalaboratorio'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {  useHash: true  } )],
  exports: [RouterModule]
})
export class RouterRoutingModule { }
