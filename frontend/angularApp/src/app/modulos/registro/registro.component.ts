import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { LoginService } from '../login/login-service/login.service';
import swal from 'sweetalert2';
import { Router } from '@angular/router';
import { ServicesNivel3Service } from '../mod-nivel3/services/services-nivel3.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  email: string;
  pass: string;
  pass2: string;
  addU: string;
  status: string;
  dispo = false;
  constructor(private afs: AngularFirestore,
              private regSrv: LoginService,
              private router: Router, private local: ServicesNivel3Service,
              private login: LoginService) { }

  ngOnInit() {
    if (this.local.getLocalStorageUser()) {
      this.router.navigate(['principal']);
    } else {
      this.login.verificarUsuario().then(() => {
        this.router.navigate(['principal']);
      });
    }
  }

  emailcheck($event, email) {
    this.addU = '';

    const q = $event.target.value;
    if (q.trim() === '') {

      // this.dispo = false;
      console.log('campo vacio');
    } if ( email.valid ) {

      console.log( ' entro', q );
      this.status = 'Confirmando disponibilidad';
       const collref = this.afs.collection('user').ref;
       const queryref = collref.where('email', '==', q);
       queryref.get().then((snapShot) => {
         if (snapShot.empty) {
           this.status = 'Email disponible';
          this.dispo = true;
         } else {
          console.log(snapShot.docs[0].id);
           this.status = 'Ya existe un usuario en el sistema con el email ingresado.';
           this.dispo = false;
           this.addU = snapShot.docs[0].id;
         }
      });
    }
  }

  createUser() {

    if (!this.email || !this.pass || this.addU) {
      swal({
        type: 'error',
        title: 'Hay campos importantes vacíos.',
        showConfirmButton: true
      });
    } if ( this.pass === this.pass2 ) {

      swal({
        title: 'Cargando un momento...',
        text: 'espere mientras se cargan los datos',
        onOpen: () => {
          swal.showLoading();
        }
      });

      this.regSrv.createUser(this.email, this.pass).then(
        (ok) => {
          // swal({
          //   type: 'success',
          //   title: 'Usuario creado correctamente.',
          //   showConfirmButton: true
          // });


          this.email = '' ;
          this.pass = '' ;
          this.pass2 = '';

          this.router.navigate(['/login']);

          console.log('usuario creado', ok);
        }
      );
    } else {

      swal({
         type: 'info',
          title: 'La contraseña no coincide .',
          showConfirmButton: true
        });
    }


  }
}
