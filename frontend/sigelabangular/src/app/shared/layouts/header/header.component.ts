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
  imgUsr;
  itemLogout: boolean;
  itemNotificacion: boolean;
  photoDummie = './assets/img/userdummie.png';

  notifications = [];

  constructor(
    private ruta: Router,
    private _loginService: LoginService,
    private obs: ObservablesService
  ) {
    this.getUser();
  }

  ngOnInit() {
    if (sessionStorage.getItem('usuario')) {
      this.usuario = JSON.parse(sessionStorage.getItem('usuario'));

      console.log(this.usuario);
      // se visualizan los elementos
      this.itemLogout = true;
      this.itemNotificacion = true;

      this.obs.consultarNotificaciones(this.usuario.uid).subscribe(datos => {
        this.notifications = [];
        for (let index = 0; index < datos.length; index++) {
          const element = datos[index].payload.doc;
          this.notifications.push({
            id: element.id,
            mensaje: element.data().mensaje,
            asunto: element.data().asunto,
            fecha: element.data().fecha
          });
        }
      });
    } else {
      // no se visualizan los elementos
      this.itemNotificacion = false;
      this.itemLogout = false;
    }
  }


  routerLogin() {
    const uri = this.ruta.url.split('/');

    if (uri[2] === 'qrinventario') {
      this.ruta.navigate(['/login'], { queryParams: { codigo: uri[3] } });
    } else {
      this.ruta.navigate(['/login']);
    }
  }

  salir() {
    this._loginService.logout().then(() => {
      this.itemLogout = false;
      // navegar al dashboard
      // this.ruta.navigate(['/login']);
    });
  }

  cerrarModal(modal) {
    $('#' + modal).modal('hide');
  }

  finalizar(id, index) {
    this.obs.finalizarNotificacion(this.usuario.uid, id);

    this.notifications.splice(index, 1);
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
