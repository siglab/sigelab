import { Component, OnInit } from '@angular/core';
import { LoginService } from './modulos/login/login-service/login.service';
import { Router } from '@angular/router';
import swal from 'sweetalert2';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  constructor(private login: LoginService, private ruta: Router) { }
}
