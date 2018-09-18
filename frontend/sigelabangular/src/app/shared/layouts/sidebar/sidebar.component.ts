import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  public static updateUserStatus: Subject<boolean> = new Subject();
  photoDummie =  './assets/img/userdummie.png';
  usuario;
  imgUsr;
  moduloPrincipal = false;
  moduloNivel2 = false;
  moduloNivel3 = false;
  moduloPermiso = false;
  moduloServicios = false;
  moduloSolicitudes = false;
  rolUser: any;

  constructor() {

  // obtener usuario luego su rol
    this.getUser().then(  () => this.getRol()  );



  }


  ngOnInit() {
    $(document).ready(() => {
      const trees: any = $('[data-widget="tree"]');
      trees.tree();
    });
  }



  getRol() {

    this.rolUser = JSON.parse(localStorage.getItem('rol'));


    for (const clave in this.rolUser) {
      if (this.rolUser[clave]) {
        if ((clave === 'moduloPrincipal')) {
          this.moduloPrincipal = true;

        }
        if ((clave === 'moduloNivel2')) {
          this.moduloNivel2 = true;

        }
        if ((clave === 'moduloDosPermiso')) {
          this.moduloPermiso = true;

        }
        if ((clave === 'moduloServicios')) {
          this.moduloServicios = true;

        }
        if ((clave === 'moduloSolicitudes')) {
          this.moduloSolicitudes = true;

        }
        if ((clave === 'moduloNivel3')) {
          this.moduloNivel3 = true;

        }
      }
    }

  //  console.log(this.moduloPrincipal);

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
