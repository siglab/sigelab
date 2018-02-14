import { AdminLaboratoriosComponent } from './../modulos/mod-nivel2/admin-laboratorios/admin-laboratorios.component';
import { BusPruComponent } from './../modulos/mod-principal/bus-pru/bus-pru.component';
import { BusServComponent } from './../modulos/mod-principal/bus-serv/bus-serv.component';
import { PrincipalComponent } from './../shared/components/dashboard/principal/principal.component';

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BusLabComponent } from '../modulos/mod-principal/bus-lab/bus-lab.component';
import { AdminSolicitudesComponent } from '../modulos/mod-autenticado/admin-solicitudes/admin-solicitudes.component';
import { AdminEquiposComponent } from '../modulos/mod-nivel2/admin-equipos/admin-equipos.component';


const routes: Routes = [
  { path: 'principal', component: PrincipalComponent,
    children:[
      { path: 'busquedalaboratorio', component: BusLabComponent},
      { path: 'busquedaservicio', component: BusServComponent},
      { path: 'busquedaprueba', component: BusPruComponent},
      { path: 'adminsolicitudes', component: AdminSolicitudesComponent},
      { path: 'adminlaboratorios', component: AdminLaboratoriosComponent},
      { path: 'adminequipos', component: AdminEquiposComponent},
      { path: '', pathMatch: 'full', redirectTo: 'busquedalaboratorio'}
    ]},
  { path: '', pathMatch: 'full', redirectTo: 'principal/busquedalaboratorio'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class RouterRoutingModule { }
