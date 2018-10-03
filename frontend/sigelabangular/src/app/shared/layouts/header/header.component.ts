import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../../modulos/login/login-service/login.service';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { ObservablesService } from '../../services/observables.service';

declare var $: any;
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  usuario;
  itemLogout: boolean;
  itemNotificacion: boolean;

  notifications = [];

  constructor(private ruta: Router, private _loginService: LoginService, private obs:ObservablesService) { }



  ngOnInit() {

    if (localStorage.getItem('usuario')) {

      this.usuario = JSON.parse(localStorage.getItem('usuario'));

      console.log(this.usuario);
      // se visualizan los elementos
      this.itemLogout = true;
      this.itemNotificacion = true;

      this.obs.consultarNotificaciones(this.usuario.uid).subscribe(datos => {
        this.notifications = [];
        for (let index = 0; index < datos.length; index++) {
          const element = datos[index].payload.doc;
          this.notifications.push({
            id:element.id,
            mensaje:element.data().mensaje,
            asunto:element.data().asunto,
            fecha:element.data().fecha
          });
        }
      });
      

    } else {
      // no se visualizan los elementos
      this.itemNotificacion = false;
      this.itemLogout = false;

    }

  }

  salir() {

    this._loginService.logout().then(() => {
      this.itemLogout = false;
      // navegar al dashboard
      this.ruta.navigate(['/login']);


    });
  }

  cerrarModal(modal){
    $('#'+modal).modal('hide');
  }

  finalizar(id, index){
    this.obs.finalizarNotificacion(this.usuario.uid, id);

    this.notifications.splice(index, 1);
  }

}
