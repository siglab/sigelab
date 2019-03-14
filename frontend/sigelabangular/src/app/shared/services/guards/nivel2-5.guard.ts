import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class Nivel25Guard implements CanActivate {
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

      const rol = JSON.parse(sessionStorage.getItem('rol'));
      console.log(rol);
      if (rol) {
        if (rol.hasOwnProperty('moduloComMasiva')) {
          return true;
        } else {
          return false;
        }

      } else {
        return false;
      }

  }
}
