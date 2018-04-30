import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
   usuario;
   imgUsr;

   moduloPrincipal = false;

   rolUser: any;

  constructor() { }

  ngOnInit() {

    this.rolUser = JSON.parse(localStorage.getItem('rol'));

    for (const clave in this.rolUser) {
      if (this.rolUser[clave]) {
        if ((clave === 'moduloPrincipal') && this.rolUser[clave]) {
          this.moduloPrincipal = true;
        }
      }
    }

    console.log(this.moduloPrincipal);

    if(   localStorage.getItem('usuario')  )
    {

     this.usuario = JSON.parse(localStorage.getItem('usuario'));


        //se visualizan los elementos
     this.imgUsr = true;

    } else {

      // no se visualizan los elementos
      this.imgUsr = false;
      console.log('no existe un usuario logueado');
    }


  }

}
