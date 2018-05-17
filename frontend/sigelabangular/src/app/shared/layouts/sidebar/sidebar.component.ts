import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  public static updateUserStatus: Subject<boolean> = new Subject();

  usuario;
  imgUsr;
  moduloPrincipal = false;
  moduloNivel2 = false;
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
          console.log('modulo prin');
        }
        if ((clave === 'moduloNivel2')) {
          this.moduloNivel2 = true;
          console.log('modulo nivel2');
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
