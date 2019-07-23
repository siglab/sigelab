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
      //  console.log(collref);
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
      console.log(this.email, this.pass, this.addU);
      swal({
        type: 'error',
        title: 'Hay campos requeridos vacíos!',
        text: 'Los campos de correo electrónico y contraseña se requieren para continuar',
        showConfirmButton: true
      });
    } else if ( this.pass === this.pass2 ) {
      swal({
        title: 'Cargando. Un momento...',
        text: 'espere mientras se cargan los datos',
        onOpen: () => {
          swal.showLoading();
        }
      });
      this.regSrv.createUser(this.email, this.pass).then(
        (ok) => {
          this.email = '' ;
          this.pass = '' ;
          this.pass2 = '';
          const userObject = ok;
          this.regSrv.postUserBackend(
            userObject['email'],
            userObject['uid']
          ).subscribe(res => {
            if (res.status === 200) {
              console.log('Usuario creado satisfactoriamente.');
              this.login.logout().then(()=>{
                localStorage.removeItem('logout');
                swal({
                  type: 'info',
                  title: 'Verificación de cuenta',
                  text: 'Para poder acceder a SigeLAB se hace necesario verificar su cuenta. Se ha enviado un link de verificación de cuenta al correo electrónico indicado.',
                  showConfirmButton: true
                }).then(() => {
                  this.router.navigate(['/login']);
                });
              });
            } else {
              swal({
                type: 'error',
                 title: 'No fue posible registrar la cuenta',
                 // tslint:disable-next-line: max-line-length
                 text: 'Es posible que no pueda acceder al sistema ni registrar una cuenta nueva con el mismo correo, de ser así comuníquese con laboratorios@correounivalle.edu.co',
                 showConfirmButton: true
              });
            }
          });
        }
      );
    } else {
      swal({
         type: 'info',
          title: 'Las contraseñas ingrersadas no coinciden.',
          showConfirmButton: true
        });
    }


  }
}
