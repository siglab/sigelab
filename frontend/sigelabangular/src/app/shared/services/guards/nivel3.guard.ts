import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class Nivel3Guard implements CanActivate {
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    
      const rol = JSON.parse(localStorage.getItem('rol'));
      if(rol){
        for (const clave in rol) {
          if (rol[clave]) {
            if (clave == 'moduloNivel3') {
              return true;
            } else {
              return false;
            }
          }
        }
      } else {
        return false;
      }
    return true;
  }
}
