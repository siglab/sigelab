import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs/Subject';

export let mainModule: any;
export let l2Module: any;

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  public static updateUserStatus: Subject<boolean> = new Subject();
  photoDummie = './assets/img/userdummie.png';
  usuario;
  imgUsr;
  moduloPrincipal = false;
  moduloNivel2 = false;
  moduloNivel3 = false;
  moduloNivel35 = false;
  moduloNivel25 = false;
  moduloComMasiva = false;
  moduloQr = false;
  rolUser: any;
  roleNivel2: any;

  constructor() {
    // obtener usuario luego su rol
    this.getUser().then(() => this.getRol());
    mainModule = false;
    l2Module = false;
  }

  ngOnInit() {
    $(document).ready(() => {
      const trees: any = $('[data-widget="tree"]');
      trees.tree();
    });
  }

  getRol() {
    if (sessionStorage.getItem('rol')) {
      this.rolUser = JSON.parse(sessionStorage.getItem('rol'));
    }
    if (sessionStorage.getItem('laboratorios')) {
      sessionStorage.setItem('nivel2', JSON.stringify(true));
      this.roleNivel2 = JSON.parse(sessionStorage.getItem('laboratorios'));
    }
    if (this.rolUser) {
      for (const clave in this.rolUser) {
        if (this.rolUser[clave]) {
          if (clave === 'moduloPrincipal') {
            this.moduloPrincipal = true;
            mainModule = true;
          }
          if (clave === 'moduloNivel3') {
            this.moduloNivel3 = true;
          }
          if (clave === 'moduloNivel25') {
            this.moduloNivel25 = true;
          }
          if (clave === 'moduloQr') {
            this.moduloQr = true;
          }
          if (clave === 'moduloComMasiva') {
            this.moduloComMasiva = true;
          }
          if (clave === 'moduloNivel35') {
            this.moduloNivel35 = true;
          }
        }
      }
    }
    if (this.roleNivel2) {
      this.moduloNivel2 = true;
      l2Module = true;
    }
  }

  async getUser() {
    if (sessionStorage.getItem('usuario')) {
      this.usuario = JSON.parse(sessionStorage.getItem('usuario'));
      // se visualizan los elementos
      return (this.imgUsr = true);
    } else {
      // no se visualizan los elementos
      return (this.imgUsr = false);
      // console.log('no existe un usuario logueado');
    }
  }
}
