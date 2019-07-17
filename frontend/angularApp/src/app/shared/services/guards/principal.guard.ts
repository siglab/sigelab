import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { LoginService } from '../../../modulos/login/login-service/login.service';

@Injectable()
export class PrincipalGuard implements CanActivate {
  constructor(private _loginService: LoginService) {
  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const rol = JSON.parse(sessionStorage.getItem('usuario'));
    if (rol) {
      return true;

    } else {
      return this._loginService.verificarUsuario().then(() => {
        return true;
      }).catch(() => {
        return true;
      });
    }
  }
}
