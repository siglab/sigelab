import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class Nivel2Guard implements CanActivate {
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

      const rol = JSON.parse(localStorage.getItem('rol'));

      console.log(rol);
      if(rol){
        for (const clave in rol) {
          if (rol[clave]) {
            if (clave == 'moduloNivel2' || clave == 'moduloDosPermiso' || clave == 'moduloServicios' || clave == 'moduloSolicitudes') {
              return true;
            } else {
              return false;
            }
          }
        }
      } else {
        return false;
      }
    
  }
}
