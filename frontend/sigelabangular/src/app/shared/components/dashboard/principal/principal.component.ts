import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../../../modulos/login/login-service/login.service';


@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css']
})
export class PrincipalComponent implements OnInit {
  usuario;
  constructor(  private logServ: LoginService ) {}

  ngOnInit() {



  }


}
