import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../../modulos/login/login-service/login.service';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  usuario;
  itemLogout: boolean; 
  itemNotificacion: boolean;

  constructor(private ruta: Router, private _loginService: LoginService ) { }



  ngOnInit() {
     
    if(   localStorage.getItem('usuario')  )
    {
  
      this.usuario = JSON.parse(localStorage.getItem('usuario'));

      console.log ( this.usuario );
         //se visualizan los elementos
      this.itemLogout = false;
      this.itemNotificacion = true;
      
    } else {
  // no se visualizan los elementos
      this.itemNotificacion = false;
      this.itemLogout = true;
     console.log('no existe un usuario logueado');
    }

  }

  salir() {
      
       this._loginService.logout().then( () =>
        { 
    
         // navegar al dashboard
         this.ruta.navigate(['/login']);


        }
       )
    }

}
