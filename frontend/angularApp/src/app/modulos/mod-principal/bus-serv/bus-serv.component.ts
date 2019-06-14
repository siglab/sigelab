import { MatSort, MatTableDataSource, MatPaginator } from '@angular/material';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import { ObserverPrincipalService } from '../services/observer-principal.service';
import { QuerysPrincipalService } from '../services/querys-principal.service';
import swal from 'sweetalert2';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { Http } from '@angular/http';
import { AngularFirestore } from 'angularfire2/firestore';
import { correoUnivalle } from '../../../config';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';

declare var $: any;
@Component({
  selector: 'app-bus-serv',
  templateUrl: './bus-serv.component.html',
  styleUrls: ['./bus-serv.component.css']
})
export class BusServComponent implements OnInit, AfterViewInit {
  @ViewChild(SpinnerComponent) alert: SpinnerComponent;

  // variables ci check
  status;
  disponible;
  nameProject;

  user: any;

  corx = 3.42158;
  cory = -76.5205;
  map: any;

  itemsel: any;

  moduloinfo = false;
  layer = null;

  llaveci: any;

  DefaultIcon = L.icon({
    iconUrl: 'assets/leaflet/images/marker-icon.png',
    shadowUrl: 'assets/leaflet/images/marker-shadow.png'
  });

  campoCondicion = '';
  condicionesobjeto = {};
  condicionesobjetoServ = {};

  parametros = {};
  parametrosServ = {};

  variation: any;
  variacionSel = '';

  preciototal = 0;
  descuento = 0;
  preciocondescuento = 0;

  // INICIALIZACION DATATABLE lABORATORIOS
  displayedColumns = ['nombreserv', 'nombrelab'];
  dataSource = new MatTableDataSource([]);
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('sort') sort: MatSort;

  listaVariaciones = [];
  iconos = {
    info: true,
    var: false
  };

  selecunivalle = new FormControl();
  univalle = ['Trabajo de grado', 'Maestria', 'Doctorado', 'Proyecto de investigacion'];
  habilitarci = false;
  valorci = '';
  usuariounivalle = false;

  constructor(private observer: ObserverPrincipalService,
    private query: QuerysPrincipalService, private afs: AngularFirestore,
    private ruta: Router, private http: Http) {
    if (sessionStorage.getItem('usuario')) {
      this.user = JSON.parse(sessionStorage.getItem('usuario'));
      if (this.user.email.split('@')[1] === correoUnivalle) {
        this.usuariounivalle = true;
      }
    }
  }

  ngOnInit() {
    $('html, body').animate({ scrollTop: '0px' }, 'slow');
    // abrer loading mientras se cargan los datos
    this.alert.show();

    this.query.getServicios().then(data => {

      this.query.estructurarDataServ(data).then(datos => {

        this.dataSource.data = datos['data'];
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        // cierra loading luego de cargados los datos
        this.alert.hide();

      }).catch(() => {
        this.alert.hide();
        swal({
          type: 'error',
          title: 'No existen servicios registrados a la fecha',
          showConfirmButton: true
        });
      });

    });
  }

  ngAfterViewInit(): void {


  }

  // METODO QUE BUSCA LA VARIACION QUE COINCIDE CON EL ID ENVIADO DESDE LA VISTA
  buscarVariacion(item) {
    for (let i = 0; i < this.itemsel.infoServ.variaciones.length; i++) {
      const element = this.itemsel.infoServ.variaciones[i];
      if (element.id === item) {
        return element;
      }
    }
  }

  cambiarVariacion(item) {

    if (item !== 'inicial') {
      this.variation = this.buscarVariacion(item);
      this.estructurarVariaciones(this.variation.data.cfConditions, this.variation.data.parametros);
    } else {
      this.variation = undefined;
    }


  }

  // METODO QUE ME ESTRUCTURA EL ARREGLO DE CONDICIONES PARA EL OBJETO RESERVAS DE SERVICIOS
  estructuraCondiciones(condiciones, tipo) {
    const arr = [];
    for (let i = 0; i < condiciones.length; i++) {

      let aux;
      if (tipo !== 'servicio') {
        aux = this.condicionesobjeto['checkbox' + i];
      } else {
        aux = this.condicionesobjetoServ['checkboxServ' + i];
      }
      const vari = {
        conditionText: condiciones[i],
        aceptada: aux
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
      this.condicionesobjeto['checkbox' + i] = true;
    }

    for (let i = 0; i < parametros.length; i++) {
      this.parametros['input' + i] = '';
    }
  }

  estructurarCondicionesServicio(condiciones, parametros) {
    this.condicionesobjetoServ = {};
    this.parametrosServ = {};
    for (let i = 0; i < condiciones.length; i++) {

      this.condicionesobjetoServ['checkboxServ' + i] = true;
    }

    for (let i = 0; i < parametros.length; i++) {
      // const element = condiciones[i];
      this.parametrosServ['inputServ' + i] = '';
    }
  }

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
        condiciones: this.estructuraCondiciones(this.variation.data.cfConditions, 'var'),
        parametros: auxiliar
      });
      this.preciototal += parseInt(this.variation.data.cfPrice, 10);
      if (this.usuariounivalle) {
        this.descuento = this.preciototal * (parseFloat(this.itemsel.infoServ.descuento) / 100);
        this.preciocondescuento = this.preciototal - this.descuento;
      }
      swal({
        type: 'success',
        title: 'Variación agregada',
        showConfirmButton: true
      });
    } else {
      swal({
        type: 'error',
        title: 'Esta variación ya se encuentra agregada',
        showConfirmButton: true
      });
    }

  }

  quitarVariacion(id) {
    const encontrado = this.listaVariaciones.find((element, index) => {


      if (element.data.id === id) {
        this.preciototal -= parseInt(element.data.data.cfPrice, 10);
        this.listaVariaciones.splice(index, 1);
        return true;
      }
      return false;
    });

    if (encontrado) {
      swal({
        type: 'success',
        title: 'Variación eliminada',
        showConfirmButton: true
      });
    }

  }

  enviarSolicitudServicio(reserva) {

    const fecha = new Date();

    if (this.user) {

      if (this.validancionCamposSolicitudServicio(reserva)
      ) {
        const cfSrvReserv = {
          cfFacil: this.itemsel.infoLab.uid,
          namelab: this.itemsel.nombrelab,
          cfSrv: this.itemsel.infoServ.uid,
          user: this.user.uid,
          selectedVariations: {},
          cfStartDate: '',
          cfEndDate: '',
          cfClass: '',
          cfClassScheme: '',
          cfPrice: this.itemsel.infoServ.precio,
          status: 'pendiente',
          createdAt: fecha.toISOString(),
          updatedAt: fecha.toISOString(),
          conditionsLog: [],
          comments: [],
          typeuser: 'externo',
          path: [],
          datauser: { type: [], ci: '', llaveci: '' },
          emailuser: this.user.email,
          acceptedBy: '',
          parametrosSrv: [],
          parametros: [],
          descuento: this.descuento,
          precioTotal: this.itemsel.infoServ.precio
        };

        if (this.usuariounivalle) {
          cfSrvReserv.cfPrice = '' + this.preciocondescuento;
        }

        swal({

          type: 'warning',
          title: '¿Está seguro que desea solicitar este servicio?',
          showCancelButton: true,
          confirmButtonText: 'Sí, Solicitar',
          cancelButtonText: 'No, Cancelar'

        }).then((result) => {

          if (result.value) {
            if (reserva === 'convariaciones') {

              for (let j = 0; j < this.listaVariaciones.length; j++) {
                const element = this.listaVariaciones[j];
                cfSrvReserv.selectedVariations[element.data.id] = true;
                cfSrvReserv.conditionsLog.push({ condicion: element.condiciones, idvariacion: element.data.id });

                cfSrvReserv.parametros.push({ parametros: element.parametros, id: element.data.id });
              }

              cfSrvReserv.precioTotal = '' + this.preciototal;

              if (this.usuariounivalle) {
                cfSrvReserv.cfPrice = '' + this.preciocondescuento;
              } else {
                cfSrvReserv.cfPrice = '' + this.preciototal;

              }

            }

            if (this.itemsel.infoServ.condiciones.length !== 0) {
              cfSrvReserv['conditionsLogServ'] = this.estructuraCondiciones(this.itemsel.infoServ.condiciones, 'servicio');
            } else {
              cfSrvReserv['conditionsLogServ'] = []
            }

            if (this.parametrosServ) {
              let cont = 0;
              for (const key in this.parametrosServ) {
                if (this.parametrosServ.hasOwnProperty(key)) {
                  const val = this.parametrosServ[key] || ''
                  cfSrvReserv.parametrosSrv.push({ id: cont, value:  val });
                  cont++;
                }
              }
            }
            if (this.usuariounivalle) {
              cfSrvReserv.typeuser = 'interno';
              cfSrvReserv.datauser.type = this.selecunivalle.value || '';
              cfSrvReserv.datauser.ci = this.valorci || '';
              cfSrvReserv.datauser.llaveci = this.llaveci || '';
            }

            cfSrvReserv.comments.push({
              commentText: this.campoCondicion,
              fecha: fecha.getDate() + '/' + (fecha.getMonth() + 1) + '/' + fecha.getFullYear(),
              autor: 'usuario',
              email: this.user.email,
              uid: this.user.uid
            });


            this.query.addSolicitudServicio(cfSrvReserv).then(() => {

              swal({
                type: 'success',
                title: 'Solicitud Creada Exitosamente',
                showConfirmButton: true
              }).then(() => {
                this.enviarNotificacionesCorreo();

                // tslint:disable-next-line:max-line-length
                this.query.enviarEmails(this.itemsel.nombreserv, this.user.email, this.itemsel.infoLab.emaildir, this.itemsel.infoLab.email, this.itemsel.infoLab.personal);

                this.limpiarDatos();

                this.moduloinfo = false;

                $('html, body').animate({ scrollTop: '0px' }, 'slow');
              });

            }).catch(error => {

              swal({
                type: 'error',
                title: error,
                showConfirmButton: true
              });

            });
          } else if (
            // Read more about handling dismissals
            result.dismiss === swal.DismissReason.cancel
          ) {
            swal(
              'Solicitud Cancelada',
              '',
              'error'
            );
          }

        });


      } else {
        swal({
          type: 'error',
          title: 'Debe llenar todos los parámetros ',
          showConfirmButton: true
        });
      }


    } else {

      swal({
        type: 'error',
        title: 'Debe ingresar al sistema para poder solicitar este servicio',
        showConfirmButton: true
      });

    }

  }

  enviarNotificacionesCorreo() {
    const ids = [];
    this.query.buscarDirector(this.itemsel.infoLab.iddirecto).then(doc => {
      this.query.enviarNotificaciones([doc.data().user], this.itemsel.nombreserv, this.user.email);
    });

    let cont = 0;
    for (let i = 0; i < this.itemsel.infoLab.personal.length; i++) {
      this.query.buscarUsuarioWithEmail(this.itemsel.infoLab.personal).then(docs => {
        docs.forEach(doc => {
          ids.push(doc.id);

          if (this.itemsel.personal.length === cont) {
            this.query.enviarNotificaciones(ids, this.itemsel.nombreserv, this.user.email);
          } else {
            cont++;
          }
        });
      });

    }

  }



  loadMap(item) {
    this.map = L.map('mapaaser').setView([this.corx, this.cory], 13);
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    this.agregarMarker(item);
  }

  cambiardata(item) {
    this.limpiarDatos();
    this.variation = undefined;

    this.variacionSel = '';
    this.iconos.var = false;
    this.iconos.info = true;

    /*  navega hacia bajo para mostrar al usuario la posicion de los datos */

    this.itemsel = item;

    if (item.infoServ.condiciones.length !== 0) {
      this.estructurarCondicionesServicio(item.infoServ.condiciones, item.infoServ.parametros);
    }

    if (this.usuariounivalle) {
      if (item.infoServ.variaciones.length === 0) {
        this.descuento = this.itemsel.infoServ.precio * (parseFloat(this.itemsel.infoServ.descuento) / 100);
        this.preciocondescuento = this.itemsel.infoServ.precio - this.descuento;
      }
    }


    if (!this.moduloinfo) {
      this.moduloinfo = true;
      const ambiente = this;
      setTimeout(function () {
        ambiente.loadMap(item);
        $('html, body').animate(
          {
            scrollTop: $('#detalle').offset().top - 55
          },
          1000
        );
      }, 1000);
    } else {
      $('html, body').animate(
        {
          scrollTop: $('#detalle').offset().top - 55
        },
        1000
      );
      this.removerMarker();
      this.agregarMarker(item);
    }
  }

  selectorunivalle() {
    this.habilitarci = false;
    this.selecunivalle.value.forEach(element => {
      if (element === 3) {
        this.habilitarci = true;
      }
    });
  }



  cambiarIcono(box) {
    if (!this.iconos[box]) {
      this.iconos[box] = true;
    } else {
      this.iconos[box] = false;
    }
  }


  agregarMarker(item) {
    this.layer = L.marker([item.coord.lat, item.coord.lon], { icon: this.DefaultIcon });
    this.layer.addTo(this.map)
      .bindPopup(item.nombrelab)
      .openPopup();
    this.map.setView([item.coord.lat, item.coord.lon], 17);
  }

  removerMarker() {
    if (this.layer != null) {
      this.layer.remove();
    }
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }


  cerrarModal(modal) {
    $('#' + modal).modal('hide');
  }

  limpiarDatos() {
    this.campoCondicion = '';
    this.listaVariaciones = [];
    this.preciototal = 0;
    this.descuento = 0;
    this.preciocondescuento = 0;
    this.habilitarci = false;
    this.selecunivalle.setValue([]);
  }

  ciCheck($event) {
    const q = $event.target.value;
    if (q.trim() === '') {
      this.status = 'Campo obligatorio';
      // this.dispo = false;
    } else {
      this.status = 'Confirmando disponibilidad';
      const collref = this.afs.collection('project').ref;
      const queryref = collref.where('ciNumber', '==', q);
      queryref.get().then((snapShot) => {
        if (snapShot.empty) {
          this.status = 'El CI ingresado no se encuentra asociado a ningún proyecto actual';
          this.disponible = true;
        } else {
          this.nameProject = snapShot.docs[0].data().projectName;
          this.status = 'Nombre del proyecto: ' + this.nameProject;
          this.llaveci = snapShot.docs[0].id;
        }
      });
    }
  }

  validancionCamposSolicitudServicio(reserva) {

    console.log('585', this.selecunivalle.value)
    if (this.usuariounivalle) {
      if (this.selecunivalle.value == undefined  || this.selecunivalle.value.length < 1) {
        return false
      } else {
        return true
      }
    } else {
      return true
    }
 

  }

}
