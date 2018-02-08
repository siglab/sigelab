import { BusPruComponent } from './../modulos/mod-principal/bus-pru/bus-pru.component';
import { BusServComponent } from './../modulos/mod-principal/bus-serv/bus-serv.component';
import { PrincipalComponent } from './../shared/components/dashboard/principal/principal.component';

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BusLabComponent } from '../modulos/mod-principal/bus-lab/bus-lab.component';


const routes: Routes = [
  { path: 'principal', component: PrincipalComponent,
    children:[
      { path: 'busquedalaboratorio', component: BusLabComponent},
      { path: 'busquedaservicio', component: BusServComponent},
      { path: 'busquedaprueba', component: BusPruComponent},
      { path: '', pathMatch: 'full', redirectTo: 'busquedalaboratorio'}
    ]},
  { path: '', pathMatch: 'full', redirectTo: 'principal/busquedalaboratorio'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class RouterRoutingModule { }
