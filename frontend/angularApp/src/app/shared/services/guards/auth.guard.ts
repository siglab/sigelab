import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { LoginService } from '../../../modulos/login/login-service/login.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private _loginService: LoginService) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

      const rol = JSON.parse(sessionStorage.getItem('rol'));
      console.log(rol);
      if (rol) {
        if (rol.hasOwnProperty('moduloPrincipal')) {
          return true;
        } else {
          return false;
        }
      } else {
        return this._loginService.verificarUsuario().then(() => {
          return true;
        }).catch(() => {
          return false;
        });
      }


  }

}
