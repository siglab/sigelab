import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { LoginService } from "./login-service/login.service";
import swal from "sweetalert2";
import { SidebarComponent } from "../../shared/layouts/sidebar/sidebar.component";
import { ServicesNivel3Service } from "../mod-nivel3/services/services-nivel3.service";
import { shallowEqual } from "@angular/router/src/utils/collection";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  email: string;
  pass: string;
  rutadeQR: any;
  institutionalAccount: boolean = true;

  constructor(
    private ruta: Router,
    private rout: ActivatedRoute,
    private _loginService: LoginService,
    private local: ServicesNivel3Service
  ) {}

  ngOnInit() {
    this.rout.queryParams.subscribe((re) => {
      this.rutadeQR = re["codigo"];
    });
    if (this.local.getLocalStorageUser()) {
      if (this.rutadeQR) {
        this.ruta.navigate(["principal/qrinventario/" + this.rutadeQR]);
      } else {
        this.ruta.navigate(["principal"]);
      }
    }
  }

  ingresar() {
    // loading mientras se crea el usuario
    swal({
      title: "Cargando...",
      text: "Espera un momento, el sistema está cargando la información",
      onBeforeOpen: () => {
        swal.showLoading();
      },
    });
    this._loginService
      .login()
      .then(() => {
        // mensaje de bienvenida
        swal({
          type: "success",
          title: "Ingreso correcto",
          showConfirmButton: true,
        });
        if (this.rutadeQR) {
          this.ruta.navigate(["principal/qrinventario/" + this.rutadeQR]);
        } else {
          this.ruta.navigate(["principal"]);
        }
      })
      .catch((error) => {
        console.log(error);
        swal({
          type: "error",
          html: this.mensajesError(error.code),
          showConfirmButton: true,
          showLoaderOnConfirm: false,
        });
      });
  }

  ingresarEmail(em, ps) {
    this.rutadeQR = this.rout.snapshot.paramMap.get("codigo");
    if (em.invalid || ps.invalid) {
      swal({
        type: "error",
        title: "Se encontraron campos requeridos sin información.",
        html:
          "Se requiere del correo electrónico y la contraseña para iniciar sesión en el sistema.",
        showConfirmButton: true,
      });
    } else {
      this._loginService.getUserWithEmail(this.email).then((data) => {
        if (data.empty) {
          swal({
            type: "error",
            title: "El correo ingresado no tiene registro en la plataforma.",
            showConfirmButton: true,
          });
        } else {
          this._loginService
            .loginEmail(this.email, this.pass)
            .then((ok) => {
              if (ok["emailVerified"]) {
                swal({
                  type: "success",
                  title: "Ingreso correcto",
                  showConfirmButton: true,
                });
                if (this.rutadeQR) {
                  this.ruta.navigate([
                    "principal/qrinventario/" + this.rutadeQR,
                  ]);
                } else {
                  this.ruta.navigate(["principal"]);
                }
              }
            })
            .catch(() => {
              swal({
                type: "info",
                title: "Cuenta sin verificar!",
                text:
                  "Para ingresar al sistema hace falta verificar tu cuenta. Busca el mensaje de verificación de cuenta en tu correo electrónico y haz click en el link que encontrarás en él.",
                showConfirmButton: true,
              });
            });
        }
      });
      swal({
        title: "Cargando...",
        text: "Espera un momento, el sistema está cargando la información",
        onOpen: () => {
          swal.showLoading();
        },
      });
    }
  }

  mensajesError(message) {
    switch (message) {
      case "auth/app-not-authorized":
        return "Acceso no autorizado.";
      case "auth/argument-error":
        return "Datos Invalidos.";
      case "auth/invalid-api-key":
        return "API KEY invalido.";
      case "auth/invalid-user-token":
        return "TOKEN de acceso invalido.";
      case "auth/network-request-failed":
        return "Ocurrió un error al intentar ingresar. Por favor compruebe su conexión a internet e intente nuevamente.";
      case "auth/operation-not-allowed":
        return "Proovedor invalido.";
      case "auth/too-many-requests":
        return "Actividad inusual.";
      case "auth/unauthorized-domain":
        return "Dominio invalido.";
      case "auth/user-disabled":
        return "Usuario deshabilitado.";
      case "auth/user-token-expired":
        return "Token de acceso expirado.";
      case "auth/web-storage-unsupported":
        return "El navegador no permite almacenamiento web.";
      case "auth/wrong-password":
        return "El password ingresado es inválido o la cuenta registrada solo accede por medio de Google";
      case "auth/user-not-found":
        return "El correo electrónico ingresado no se encuentra registrado en el sistema.";
      case "auth/popup-closed-by-user":
        return "La ventana de selección de cuenta de inicio de sesión a través de Google se ha cerrado por el usuario. <br> Seleccione nuevamente su método de incio de sesión.";
      default:
        return (
          "Ocurrió un error al intentar ingresar. Por favor compruebe su conexión a internet e intente nuevamente. <br>" +
          "Si el error persiste es posible que su usuario haya sido inhabilitado para utilizar el sistema."
        );
    }
  }

  noInstitutionalAccount() {
    this.institutionalAccount = false;
  }
}
