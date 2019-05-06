import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { LoginService } from '../../../modulos/login/login-service/login.service';

@Injectable()
export class Nivel2Guard implements CanActivate {
  constructor(private _loginService: LoginService) {
  }
  
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

      if (sessionStorage.getItem('nivel2')) {
       return JSON.parse(sessionStorage.getItem('nivel2'));
      } else {
        return this._loginService.verificarUsuario().then(() => {
          return true;
        }).catch(() => {
          return false;
        });
      }


  }
}
