import { element } from "protractor";
import {
  MatTableDataSource,
  MatPaginator,
  MatSort,
  MatDialog,
} from "@angular/material";
import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  TemplateRef,
} from "@angular/core";
import * as L from "leaflet";
import {
  AngularFirestoreCollection,
  AngularFirestore,
} from "angularfire2/firestore";
import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { ObserverPrincipalService } from "../services/observer-principal.service";
import { QuerysPrincipalService } from "../services/querys-principal.service";

import swal from "sweetalert2";
import { Router } from "@angular/router";
import { FormControl } from "@angular/forms";

import "fullcalendar";
import "fullcalendar-scheduler";
import * as $AB from "jquery";
import { correoUnivalle } from "../../../config";
import { SpinnerComponent } from "../../../shared/components/spinner/spinner.component";

declare var $: any;

@Component({
  selector: "app-bus-lab",
  templateUrl: "./bus-lab.component.html",
  styleUrls: ["./bus-lab.component.css"],
})
export class BusLabComponent implements OnInit, AfterViewInit {
  user: any;
  selectedRowIndex = -1;
  corx = 3.42158;
  cory = -76.5205;
  map: any;
  @ViewChild(SpinnerComponent) alert: SpinnerComponent;

  // VARIABLES QUE SE UTILIZAN PARA LOS DATATABLES DE SERVICIOS Y PRACTICAS
  itemsel: any;
  servsel: any;
  prubsel: any;
  equipsel: any;

  // variables ci check
  status = "Este campo es obligatorio";
  disponible;
  nameProject;

  moduloinfo = false;
  layer = null;

  campoCondicion = "";
  condiciones = [];
  condicionesobjeto = {};
  condicionesobjetoServ = {};

  parametros = {};
  parametrosServ = {};

  variation: any;
  variacionSel = "";

  preciototal = 0;
  descuento = 0;
  preciocondescuento = 0;

  // INICIALIZACION DATATABLE lABORATORIOS
  // displayedColumns = ['nombre', 'escuela', 'investigacion', 'director'];
  displayedColumns = ["nombre", "director"];
  dataSource = new MatTableDataSource([]);
  @ViewChild("paginator") paginator: MatPaginator;
  @ViewChild("sort") sort: MatSort;

  // INICIALIZACION DATATABLE SERVICIOS
  displayedColumns2 = ["nombre"];
  dataSource2 = new MatTableDataSource([]);
  @ViewChild("paginator2") paginator2: MatPaginator;
  @ViewChild("sort2") sort2: MatSort;

  // INICIALIZACION DATATABLE PRUEBAS
  displayedColumns3 = ["nombre"];
  dataSource3 = new MatTableDataSource([]);
  @ViewChild("paginator3") paginator3: MatPaginator;
  @ViewChild("sort3") sort3: MatSort;

  DefaultIcon = L.icon({
    iconUrl: "assets/leaflet/images/marker-icon.png",
    shadowUrl: "assets/leaflet/images/marker-shadow.png",
  });

  listaVariaciones = [];

  selecunivallelab = new FormControl();
  univalle = [
    "Trabajo de grado",
    "Maestria",
    "Doctorado",
    "Proyecto de investigacion",
    "Actividad docente",
    "Personal de laboratorio",
  ];
  habilitarci = false;
  valorci = "";
  llaveci = "";

  usuariounivalle = false;

  constructor(
    private observer: ObserverPrincipalService,
    private query: QuerysPrincipalService,
    private afs: AngularFirestore,
    private ruta: Router
  ) {
    if (sessionStorage.getItem("usuario")) {
      this.user = JSON.parse(sessionStorage.getItem("usuario"));
      if (this.user.email.split("@")[1] === correoUnivalle) {
        this.usuariounivalle = true;
      }
    }
  }

  ngOnInit() {
    $("html, body").animate({ scrollTop: "0px" }, "slow");
    this.alert.show();
    // trae los datos de los laboratorios
    this.query.getLaboratorios().then((data) => {
      this.query.estructurarDataLab(data).then((datos) => {
        this.dataSource.data = datos["data"];
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.alert.hide();
      });
    });
    // this.map = L.map('mapa').setView([this.corx, this.cory], 13);
  }

  ngAfterViewInit(): void {}

  agregarSolicitudServicio() {
    const encontrado = this.listaVariaciones.find((element, index) => {
      if (element.data.id === this.variation.id) {
        return true;
      }
      return false;
    });

    if (!encontrado) {
      const auxiliar = [];
      if (this.parametros) {
        let cont = 0;

        for (const key in this.parametros) {
          if (this.parametros.hasOwnProperty(key)) {
            auxiliar.push({ id: cont, value: this.parametros[key] });
            cont++;
          }
        }
      }
      this.listaVariaciones.push({
        data: this.variation,
        condiciones: this.estructuraCondiciones(
          this.variation.data.cfConditions,
          "var"
        ),
        parametros: auxiliar,
      });
      this.preciototal += parseInt(this.variation.data.cfPrice, 10);
      if (this.usuariounivalle) {
        this.descuento =
          this.preciototal * (parseFloat(this.servsel.descuento) / 100);
        this.preciocondescuento = this.preciototal - this.descuento;
      }
      swal({
        type: "success",
        title: "Variación agregada a su solicitud",
        showConfirmButton: true,
      });
    } else {
      swal({
        type: "error",
        title: "Esta variación ya fue agregada a su solicitud",
        showConfirmButton: true,
      });
    }
  }

  quitarVariacion(id) {
    const encontrado = this.listaVariaciones.find((element, index) => {
      if (element.data.id === id) {
        this.preciototal = parseInt(element.data.data.cfPrice, 10);
        this.listaVariaciones.splice(index, 1);
        return true;
      }
      return false;
    });

    if (encontrado) {
      swal({
        type: "success",
        title: "Variación Eliminada",
        showConfirmButton: true,
      });
    }
  }

  enviarSolicitudServicio(reserva) {
    const fecha = new Date();
    if (this.user) {
      if (this.validancionCamposSolicitudServicio(reserva)) {
        const cfSrvReserv = {
          cfFacil: this.itemsel.uid,
          namelab: this.itemsel.nombre,
          cfSrv: this.servsel.uid,
          user: this.user.uid,
          selectedVariations: {},
          cfStartDate: "",
          cfEndDate: "",
          cfClass: "",
          cfClassScheme: "",
          cfPrice: this.servsel.precio,
          status: "pendiente",
          createdAt: fecha.toISOString(),
          updatedAt: fecha.toISOString(),
          conditionsLog: [],
          comments: [],
          path: [],
          typeuser: "externo",
          datauser: { type: [], ci: "", llaveci: "" },
          emailuser: this.user.email,
          acceptedBy: "",
          parametrosSrv: [],
          parametros: [],
          descuento: this.descuento,
          precioTotal: this.servsel.precio,
        };
        if (this.usuariounivalle) {
          cfSrvReserv.cfPrice = "" + this.preciocondescuento;
        }
        swal({
          type: "warning",
          title: "¿Está seguro que desea solicitar este servicio?",
          showCancelButton: true,
          confirmButtonText: "Sí, Solicitar",
          cancelButtonText: "No, Cancelar",
        }).then((result) => {
          if (result.value) {
            if (reserva === "convariaciones") {
              for (let j = 0; j < this.listaVariaciones.length; j++) {
                // tslint:disable-next-line:no-shadowed-variable
                const element = this.listaVariaciones[j];
                cfSrvReserv.selectedVariations[element.data.id] = true;
                cfSrvReserv.conditionsLog.push({
                  condicion: element.condiciones,
                  idvariacion: element.data.id,
                });
                cfSrvReserv.parametros.push({
                  parametros: element.parametros,
                  id: element.data.id,
                });
              }
              cfSrvReserv.precioTotal = "" + this.preciototal;
              if (this.usuariounivalle) {
                cfSrvReserv.cfPrice = "" + this.preciocondescuento;
              } else {
                cfSrvReserv.cfPrice = "" + this.preciototal;
              }
            }
            if (this.servsel.condiciones.length !== 0) {
              cfSrvReserv["conditionsLogServ"] = this.estructuraCondiciones(
                this.servsel.condiciones,
                "servicio"
              );
            }
            if (this.parametrosServ) {
              let cont = 0;
              for (const key in this.parametrosServ) {
                if (this.parametrosServ.hasOwnProperty(key)) {
                  cfSrvReserv.parametrosSrv.push({
                    id: cont,
                    value: this.parametrosServ[key],
                  });
                  cont++;
                }
              }
            }
            if (this.usuariounivalle) {
              cfSrvReserv.typeuser = "interno";
              cfSrvReserv.datauser.type = this.selecunivallelab.value;
              cfSrvReserv.datauser.ci = this.valorci;
              cfSrvReserv.datauser.llaveci = this.llaveci;
            }
            if (this.campoCondicion && this.campoCondicion != "") {
              cfSrvReserv.comments.push({
                commentText: this.campoCondicion,
                fecha:
                  fecha.getDate() +
                  "/" +
                  (fecha.getMonth() + 1) +
                  "/" +
                  fecha.getFullYear(),
                autor: "usuario",
                email: this.user.email,
                uid: this.user.uid,
              });
            }
            this.query
              .addSolicitudServicio(cfSrvReserv)
              .then(() => {
                this.enviarNotificacionesCorreo();

                // tslint:disable-next-line:max-line-length
                this.query.enviarEmails(
                  this.servsel.nombre,
                  this.user.email,
                  this.itemsel.emaildir,
                  this.itemsel.info.email,
                  this.itemsel.personal
                );
                this.limpiarDatos();
                this.cerrarModal("myModalLabs");
                swal({
                  type: "success",
                  title: "Solicitud creada exitosamente!",
                  text:
                    'Toda la información relacionada a esta solicitud la encontrarás en el panel de "Mis solicitudes de servicio".',
                  showConfirmButton: true,
                });
              })
              .catch((error) => {
                swal({
                  type: "error",
                  title: "" + error,
                  showConfirmButton: true,
                });
              });
          } else if (
            // Read more about handling dismissals
            result.dismiss === swal.DismissReason.cancel
          ) {
            swal("Acción cancelada", "", "error");
          }
        });
      } else {
        swal({
          type: "error",
          title: "Hay campos requeridos sin diligenciar!",
          text:
            "Se requiere diligenciar todos los campos obligatorios para remitir la solicitud.",
          showConfirmButton: true,
        });
      }
    } else {
      swal({
        type: "error",
        title: "No es posible realizar el envío de la solicitud",
        html:
          "Para realizar la solicitud del servicio es indispensable iniciar sesión en el sistema.",
      });
    }
  }

  enviarNotificacionesCorreo() {
    const ids = [];
    this.query.buscarDirector(this.itemsel.iddirecto).then((doc) => {
      this.query.enviarNotificaciones(
        [doc.data().user],
        this.servsel.nombre,
        this.user.email
      );
    });
    let cont = 0;
    for (let i = 0; i < this.itemsel.personal.length; i++) {
      this.query.buscarUsuarioWithEmail(this.itemsel.personal).then((docs) => {
        docs.forEach((doc) => {
          ids.push(doc.id);
          if (this.itemsel.personal.length === cont) {
            this.query.enviarNotificaciones(
              ids,
              this.servsel.nombre,
              this.user.email
            );
          } else {
            cont++;
          }
        });
      });
    }
  }

  selectRow(row) {
    this.alert.show();
    this.query
      .getDataLab(row)
      .then((data) => {
        this.cambiardata(data);
        this.alert.hide();
      })
      .catch((err) => {
        console.log(err);
        this.alert.hide();
      });
  }

  cambiardata(item) {
    this.itemsel = item;
    this.dataSource2.data = item.servicios;
    this.dataSource3.data = item.practicas;
    const ambiente = this;
    if (!this.moduloinfo) {
      this.moduloinfo = true;
      setTimeout(function () {
        ambiente.loadMap(item);
        $("html, body").animate(
          {
            scrollTop: $("#detalle").offset().top - 55,
          },
          1000
        );
      }, 500);
    } else {
      this.removerMarker();
      if (item.coord.lat !== "" && item.coord.lon !== "") {
        this.agregarMarker(item);
      } else {
        swal({
          type: "warning",
          title:
            "El laboratorio seleccionado aún no tiene registrada la ubicación",
          showConfirmButton: true,
        });
      }
      $("html, body").animate(
        {
          scrollTop: $("#detalle").offset().top - 55,
        },
        1000
      );
    }

    setTimeout(function () {
      ambiente.dataSource2.sort = ambiente.sort2;
      ambiente.dataSource2.paginator = ambiente.paginator2;
      ambiente.dataSource3.sort = ambiente.sort3;
      ambiente.dataSource3.paginator = ambiente.paginator3;
    }, 1000);
  }

  cambiarVariacion(item) {
    if (item !== "inicial") {
      this.variation = this.buscarVariacion(item);
      this.estructurarVariaciones(
        this.variation.data.cfConditions,
        this.variation.data.parametros
      );
    } else {
      this.variation = undefined;
    }
  }

  cambiarDataServicio(item) {
    this.limpiarDatos();
    this.variation = undefined;
    this.variacionSel = "";
    this.servsel = item;
    if (!this.user) {
      swal({
        type: "warning",
        title:
          "Atención! Para solicitar este servicio se requiere ingresar al sistema",
        html:
          "Si diligencia el formulario de solicitud de servicio sin identificarse previamente en el sistema, <strong>perderá toda la información diligenciada hasta el momento que lo haga</strong>.",
      });
    }

    if (item.condiciones.length !== 0) {
      this.estructurarCondicionesServicio(item.condiciones, item.parametros);
    }
    if (this.usuariounivalle) {
      if (item.variaciones.length === 0) {
        this.descuento =
          this.servsel.precio * (parseFloat(this.servsel.descuento) / 100);
        this.preciocondescuento = this.servsel.precio - this.descuento;
      }
    }
  }

  cambiarDataPrueba(item) {
    this.prubsel = item;
    this.initCalendarModal(item.programacion.horario);
  }

  initCalendarModal(horario) {
    const containerEl: JQuery = $AB("#calendar2");

    if (containerEl.children().length > 0) {
      containerEl.fullCalendar("destroy");
    }

    containerEl.fullCalendar({
      // licencia
      schedulerLicenseKey: "GPL-My-Project-Is-Open-Source",
      // options here
      height: 450,
      header: {
        left: "month,agendaWeek,agendaDay",
        center: "title",
        right: "today prev,next",
      },
      events: horario,

      defaultView: "month",
      timeFormat: "H(:mm)",
    });
  }

  selectorunivalle() {
    this.habilitarci = false;
    this.selecunivallelab.value.forEach((elemento) => {
      if (elemento === 3) {
        this.habilitarci = true;
      }
    });
  }

  // METODO QUE BUSCA LA VARIACION QUE COINCIDE CON EL ID ENVIADO DESDE LA VISTA
  buscarVariacion(item) {
    for (let i = 0; i < this.servsel.variaciones.length; i++) {
      const element = this.servsel.variaciones[i];
      if (element.id === item) {
        return element;
      }
    }
  }

  // METODO QUE ME ESTRUCTURA EL ARREGLO DE CONDICIONES PARA EL OBJETO RESERVAS DE SERVICIOS
  estructuraCondiciones(condiciones, tipo) {
    const arr = [];
    for (let i = 0; i < condiciones.length; i++) {
      let aux;
      if (tipo !== "servicio") {
        aux = this.condicionesobjeto["checkbox" + i];
      } else {
        aux = this.condicionesobjetoServ["checkboxServ" + i];
      }
      const vari = {
        conditionText: condiciones[i],
        aceptada: aux,
      };
      arr.push(vari);
    }
    return arr;
  }

  // ESTRUCTURA OBJETO JSON QUE SE ENLAZA A LOS CHECKBOX DE LA VISTA DE MANERA DINAMICA
  estructurarVariaciones(condiciones, parametros) {
    this.condicionesobjeto = {};
    this.parametros = {};
    for (let i = 0; i < condiciones.length; i++) {
      this.condicionesobjeto["checkbox" + i] = true;
    }

    for (let i = 0; i < parametros.length; i++) {
      this.parametros["input" + i] = "";
    }
  }

  estructurarCondicionesServicio(condiciones, parametros) {
    this.condicionesobjetoServ = {};
    this.parametrosServ = {};
    for (let i = 0; i < condiciones.length; i++) {
      this.condicionesobjetoServ["checkboxServ" + i] = true;
    }

    for (let i = 0; i < parametros.length; i++) {
      // const element = condiciones[i];
      this.parametrosServ["inputServ" + i] = "";
    }
  }

  loadMap(item) {
    // this.map = L.map('mapa').setView([this.corx, this.cory], 13);
    // L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    //   attribution:
    //     '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    // }).addTo(this.map);
    // this.agregarMarker(item);
  }

  agregarMarker(item) {
    // this.layer = L.marker([item.coord.lat, item.coord.lon], {
    //   icon: this.DefaultIcon
    // });
    // this.layer
    //   .addTo(this.map)
    //   .bindPopup(item.nombre)
    //   .openPopup();
    // this.map.setView([item.coord.lat, item.coord.lon], 17);
  }

  removerMarker() {
    // if (this.layer != null) {
    //   this.layer.remove();
    // }
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
  applyFilter2(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource2.filter = filterValue;
  }
  applyFilter3(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource3.filter = filterValue;
  }

  cerrarModal(modal) {
    $("#" + modal).modal("hide");
  }

  limpiarDatos() {
    this.campoCondicion = "";
    this.listaVariaciones = [];
    this.descuento = 0;
    this.preciototal = 0;
    this.preciocondescuento = 0;
    this.habilitarci = false;
    this.selecunivallelab.setValue([]);
  }

  ciCheck($event) {
    const q = $event.target.value;
    if (q.trim() === "") {
      this.status = "Este campo obligatorio";
      // this.dispo = false;
    } else {
      this.status = null;
      // this.status = 'Confirmando disponibilidad';
      // const collref = this.afs.collection('project').ref;
      // const queryref = collref.where('ciNumber', '==', q);
      // queryref.get().then(snapShot => {
      //   if (snapShot.empty) {
      //     this.status =
      //       'El CI ingresado no se encuentra asociado a ningún proyecto actual';
      //     this.disponible = true;
      //   } else {
      //     this.nameProject = snapShot.docs[0].data().projectName;
      //     this.status = 'Nombre del proyecto: ' + this.nameProject;
      //     this.llaveci = snapShot.docs[0].id;
      //   }
      // });
    }
  }

  validancionCamposSolicitudServicio(reserva) {
    if (this.usuariounivalle) {
      if (
        this.selecunivallelab.value == undefined ||
        this.selecunivallelab.value.length < 1
      ) {
        return false;
      } else {
        let valoresFinaciacionUnivalle: Array<any> = this.selecunivallelab
          .value;
        var cont = 0;
        for (
          let index = 0;
          index < valoresFinaciacionUnivalle.length;
          index++
        ) {
          const element = valoresFinaciacionUnivalle[index];
          cont++;
          if (
            element == 3 &&
            (this.valorci == undefined || this.valorci.trim() == "")
          ) {
            return false;
          } else {
            if (cont == valoresFinaciacionUnivalle.length) {
              return true;
            }
          }
        }
      }
    } else {
      return true;
    }
  }
}
