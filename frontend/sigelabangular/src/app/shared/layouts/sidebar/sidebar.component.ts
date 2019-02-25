import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs/Subject';

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



  }


  ngOnInit() {
    $(document).ready(() => {
      const trees: any = $('[data-widget="tree"]');
      trees.tree();
    });
  }



  getRol() {

    if (localStorage.getItem('rol')) {
      console.log(localStorage.getItem('rol'));
      this.rolUser = JSON.parse(localStorage.getItem('rol'));
    }

    if (localStorage.getItem('laboratorios')) {
      localStorage.setItem('nivel2', JSON.stringify(true));

      this.roleNivel2 = JSON.parse(localStorage.getItem('laboratorios'));
      console.log(this.roleNivel2);
    }


    if (this.rolUser) {
      for (const clave in this.rolUser) {
        if (this.rolUser[clave]) {
          if ((clave === 'moduloPrincipal')) {
            this.moduloPrincipal = true;
          }

          if ((clave === 'moduloNivel3')) {
            this.moduloNivel3 = true;

          }

          if ((clave === 'moduloNivel25')) {
            this.moduloNivel25 = true;
          }

          if ((clave === 'moduloQr')) {
            this.moduloQr = true;
          }


          if ((clave === 'moduloComMasiva')) {
            this.moduloComMasiva = true;
          }

          if ((clave === 'moduloNivel35')) {
            this.moduloNivel35 = true;
          }
        }
      }
    }

    if (this.roleNivel2) {
      this.moduloNivel2 = true;
    }


    console.log(this.moduloNivel2);

  }

  async getUser() {

    if (localStorage.getItem('usuario')) {

      this.usuario = JSON.parse(localStorage.getItem('usuario'));


      // se visualizan los elementos
      return this.imgUsr = true;

    } else {

      // no se visualizan los elementos
      return this.imgUsr = false;
      // console.log('no existe un usuario logueado');
    }


  }




}
