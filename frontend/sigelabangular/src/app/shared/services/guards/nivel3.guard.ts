import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class Nivel3Guard implements CanActivate {
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

      const rol = JSON.parse(localStorage.getItem('rol'));
      if (rol) {
        console.log(rol);
        if ( rol.hasOwnProperty('moduloNivel3') ||  rol.hasOwnProperty('moduloNivel25') ||  rol.hasOwnProperty('moduloNivel35')) {

          return true;

        } else {
          return false;
        }


      } else {
        return false;
      }

  }
}
