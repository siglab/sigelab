import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
   usuario;
   imgUsr;
  constructor() { }

  ngOnInit() {

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
