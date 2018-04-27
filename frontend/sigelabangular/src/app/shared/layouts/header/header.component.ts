import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  usuario;
  itemsHeader:boolean; 

  constructor() { 
   if(   localStorage.getItem('usuario')  )
        {
      
         this.usuario = JSON.parse(localStorage.getItem('usuario'));

         console.log( this.usuario );
            //se visualizan los elementos
         this.itemsHeader = false;
          
        } else {
          
          // no se visualizan los elementos
          this.itemsHeader = true;
          console.log('no existe un usuario logueado');
        }
  }

  ngOnInit() {
     
    if(   localStorage.getItem('usuario')  )
    {
  
     this.usuario = JSON.parse(localStorage.getItem('usuario'));
     console.log( this.usuario );
        //se visualizan los elementos
     this.itemsHeader = false;
      
    } else {
      // no se visualizan los elementos
      this.itemsHeader = true;
    
      console.log('no existe un usuario logueado');
    }

  }

}
