import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ObservablesService } from '../../../shared/services/observables.service';

import swal from 'sweetalert2';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { AngularFirestore } from 'angularfire2/firestore';
import { Http } from '@angular/http';
import { Subscription } from 'rxjs';

import 'fullcalendar';
import 'fullcalendar-scheduler';
import * as $AB from 'jquery';


@Component({
  selector: 'app-admin-equipos',
  templateUrl: './admin-equipos.component.html',
  styleUrls: ['./admin-equipos.component.css']
})
export class AdminEquiposComponent implements OnInit, AfterViewInit, OnDestroy {



    // INICIALIZACION DATATABLE PRUEBAS
    displayedColumnsEquip = ['nombre'];
    dataSourceEquip = new MatTableDataSource([]);
    @ViewChild('paginatorEquip') paginatorEquip: MatPaginator;
    @ViewChild('sortEquip') sortEquip: MatSort;

    // INICIALIZACION DATATABLE COMPONENTES
    displayedColumnsComponentes = ['nombre'];
    dataSourceComponentes = new MatTableDataSource([]);
    @ViewChild('paginatorComponentes') paginatorComponentes: MatPaginator;
    @ViewChild('sortComponentes') sortComponentes: MatSort;

    // INICIALIZACION DATATABLE SERVICIOS
    displayedColumnsServicios = ['nombre'];
    dataSourceServicios = new MatTableDataSource([]);
    @ViewChild('paginatorServicios') paginatorServicios: MatPaginator;
    @ViewChild('sortServicios') sortServicios: MatSort;

    // INICIALIZACION DATATABLE PRACTICAS
    displayedColumnsPracticas = ['nombre'];
    dataSourcePracticas = new MatTableDataSource([]);
    @ViewChild('paginatorPracticas') paginatorPracticas: MatPaginator;
    @ViewChild('sortPracticas') sortPracticas: MatSort;



    equiposel: any;
    tablesel: any;
    seleccionado: any;
    itemsel: Observable<Array<any>>;

    equiestructurado:any;
    infosabs = [];
    infosabsel:any;
    response:any;

    iconos = {
      info:false,
      componente:false,
      practica:false,
      servicio:false,
      sabs:false

    };

    modelEquipoSel = {
      cfName: '',
      price: ''
    };

    ventana = false;

    sus : Subscription;

    rol:any;
    moduloNivel2 = false;

  constructor(private obs: ObservablesService, private afs: AngularFirestore, private http: Http) {

  }

  ngOnInit() {
    // abre loading mientras se cargan los datos
    this.ventana = true;
    this.getRoles();
    this.sus = this.obs.currentObjectequip.subscribe(data => {

      console.log(data);
      this.equiestructurado = undefined;
      this.iniciliazarTablas();

      if(data.length != 0){
        swal({
          title: 'Cargando un momento...',
          text: 'espere mientras se cargan los datos',
          onOpen: () => {
            swal.showLoading();
          }
        });
        if(!this.equiestructurado){
          this.estructurarEquip(data.uid, data.labo).then(() => {
            this.itemsel = Observable.of(this.equiestructurado.equipos);
             console.log(this.equiestructurado);
             console.log(this.infosabs);
            this.dataSourceEquip.data = this.equiestructurado.equipos;

            const ambiente = this;

             setTimeout(function() {
               if (ambiente.equiestructurado.equipos != 0) {
                 ambiente.dataSourceEquip.sort = ambiente.sortEquip;
                 ambiente.dataSourceEquip.paginator = ambiente.paginatorEquip;
                  // cierra loading luego de cargados los datos

               }

             }, 1500);

          });
        } else {
          swal.close();
        }

      }

     });
  }

  ngAfterViewInit(): void {

  }

  ngOnDestroy(){
    this.sus.unsubscribe();
  }

  // METODO QUE ME TRAE EL ROL DE ACCESSO A NIVEL 2
  getRoles() {

    this.rol = JSON.parse(localStorage.getItem('rol'));
    
    for (const clave in this.rol) {
      if (this.rol[clave]) {
        if ((clave == 'moduloNivel2')) {
          this.moduloNivel2 = true;
        }
      }
    }
  }

  estructurarEquip(key, objeto){

    this.equiestructurado = {};
    let promise = new Promise((resolve,reject)=>{

       let estadoLab;
       if (objeto.active === true) {
          estadoLab = 'Activo';
       } else if ( objeto.active === false ) {
          estadoLab = 'Inactivo';
       }

        this.equiestructurado = {
          uid: key,
          nombre: objeto.cfName,
          equipos: this.estructurarEquipos(objeto.relatedEquipments),
          estado: estadoLab
        };

        resolve();
    });

    return promise;

  }

  // METODO QUE ESTRUCTURA LA DATA DE LOS SERVICIOS EN LA VISTA BUSQUEDA DE LABORATORIOS

  // RECIBE EL NODO DE LABORATORIO QUE CONTIENE LOS SERVICIOS ASOCIADOS
  estructurarServicios(item) {

    const arr = [];
    const arr2 = [];

    for (const clave in item) {
      // Controlando que json realmente tenga esa propiedad
      if (item.hasOwnProperty(clave)) {

        if (item[clave]) {
          this.afs.doc('cfSrv/' + clave).snapshotChanges().subscribe(data => {
            const servicio =  data.payload.data();

            this.afs.collection<any>('cfSrvReserv',
            ref => ref.where('cfSrv', '==', clave).where('status', '==', 'creada'))
            .snapshotChanges().subscribe(dataSol => {

              const serv = {
               nombre: servicio.cfName,
               descripcion: servicio.cfDesc,
               precio: servicio.cfPrice,
               activo: servicio.active,
               variaciones: this.variations(clave),
               uid: data.payload.id
              };
              arr.push(serv);

              for (let i = 0; i < dataSol.length; i++) {
                const element = dataSol[i].payload.doc.data();
                this.getPersonId(element.user).subscribe(usuario => {
                  const solicitud = {
                    nombreServ: servicio.cfName,
                    descripcionServ: servicio.cfDesc,
                    precioServ: servicio.cfPrice,
                    activoServ: servicio.active,
                    email: usuario.payload.data().email,
                    uidServ: dataSol[i].payload.doc.id,
                    estado: element.status
                  };

                  arr2.push(solicitud);
                });

              }


            });

           });
        }

      }
    }

    return {arr, arr2};
  }

  // METODO QUE ESTRUCTURA LA DATA DE LAS PRACTICAS EN LA VISTA BUSQUEDA DE LABORATORIOS
  // RECIBE EL NODO DE LABORATORIO QUE CONTIENE LAS PRACTICAS ASOCIADOS
  estructurarPracticas(item) {

    const arr = [];

    for (const clave in item) {
      // Controlando que json realmente tenga esa propiedad
      if (item.hasOwnProperty(clave)) {

        if (item[clave]) {
           this.afs.doc('practice/' + clave).snapshotChanges().subscribe(data => {
           const practica =  data.payload.data();
            this.afs.doc('practice/' + clave ).collection('programmingData').snapshotChanges().subscribe(data2 => {

              // funciona con una programacion, cuando hayan mas toca crear otro metodo
              const prog = data2[0].payload.doc.data();

              if(prog){
                const pract = {
                  nombre: practica.practiceName,
                  programacion: {
                    id_pro: data2[0].payload.doc.id,
                    estudiantes: prog.noStudents,
                    horario: prog.schedule,
                    semestre: prog.semester
                  },
                  activo: practica.active
                 };

                 arr.push(pract);
              }


              });

           });
        }

      }
    }

    return arr;
  }



   // METODO QUE ESTRUCTURA LA DATA DE LAS PRACTICAS EN LA VISTA BUSQUEDA DE LABORATORIOS
  // RECIBE EL NODO DE LABORATORIO QUE CONTIENE LAS PRACTICAS ASOCIADOS
  estructurarEquipos(item) {

    const arr = [];
    let cont = 0;
    for (const clave in item) {
      // Controlando que json realmente tenga esa propiedad
      if (item.hasOwnProperty(clave)) {

        if (item[clave]) {
           this.afs.doc('cfEquip/' + clave).snapshotChanges().subscribe(data => {
            const equip =  data.payload.data();

             // funciona con una programacion, cuando hayan mas toca crear otro metodo
                const equipo = {
                  id: data.payload.id,
                  nombre: equip.cfName,
                  activo: equip.active,
                  precio: equip.price,
                  // infoSab: this.consultarSabs(equip.inventory),
                  componentes: this.estructurarComponents(clave),
                  servicios:  this.estructurarServicios(equip.relatedSrv).arr,
                  practicas: this.estructurarPracticas(equip.relatedPrac)
                };

                arr.push(equipo);

                cont ++;
                this.consultarSabs(equip.inventory).then(() => {
                  this.infosabs.push(this.response);
                  swal.close();
                }).catch((error)=>{
                  console.log(cont, Object.keys(item).length);
                  if(cont == Object.keys(item).length){
                    swal.close();
                    swal({
                      type: 'error',
                      title: 'No se pudo conectar con SABS',
                      showConfirmButton: true
                    });
                  }
                });

           });
        }
      }
    }

    return arr;
  }

  // METODO QUE TRAE LOS DATOS EXISTENTES EN SABS
  consultarSabs(item) {

    this.infosabs = [];
    const promise = new Promise((resolve, reject) => {

      const url = 'http://localhost:1337/inventario/buscar';
      const body = {
        codInventario: item,
        codLab: '5646',
        nomLab: 'fgh',
        sede: 'fgh',
        edificio: '567',
        espacio: 'fghgf'
      };


      if (this.ventana) {


        this.http.post(url, body). subscribe((res) => {
          console.log(res.json());
          if (res.status === 200) {
            console.log('funco');
            this.response =  res.json().inventario;
            resolve();
          } else {
            reject();
          }

        }, (error) => {
            console.log('faio');
            this.response = {};
            reject();
        });
      }


    });


   return promise;
  }

    // METODO QUE ESTRUCTURA LA DATA DE LOS COMPONENTES EN LA VISTA BUSQUEDA DE LABORATORIOS
  // RECIBE EL NODO DE LABORATORIO QUE CONTIENE LAS PRACTICAS ASOCIADOS
  estructurarComponents(item) {
    const arr = [];

    this.afs.collection('cfEquip/' + item + '/components').snapshotChanges().subscribe(data => {
      for (let i = 0; i < data.length; i++) {
        const element = data[i].payload.doc.data();

          const componente = {
            id: data[i].payload.doc.id,
            nombre: element.cfName,
            descripcion: element.cfDescription,
            precio: element.cfPrice,
            marca: element.brand,
            modelo: element.model,
            estado: element.active
          };

          arr.push(componente);



      }

     });

     return arr;
  }

  // METODO QUE TRAE UN DIRECTOR ESPECIFICO DEPENDIENDO EL ID-DIRECTOR
  buscarLab(idlab) {
    return this.afs.doc('cfFacil/' + idlab).snapshotChanges();

  }

  getPersonId(userid) {
    return this.afs.doc('user/' + userid).snapshotChanges();
  }

  // METODO QUE ESTRUCTURA LAS VARIACIONES DE UN SERVICIO
  variations(clave){
    const variaciones = [];
    this.afs.doc('cfSrv/' + clave).collection('variations').snapshotChanges().subscribe(data => {
      if(data){
        for (let i = 0; i < data.length; i++) {
          const element = data[i].payload.doc.data();
          variaciones.push(element);
        }
      } else {
        return variaciones;
      }

    });
    return variaciones;
  }


  cambiarDataEquipo(item, index) {
    console.log(item);
    console.log(index);
    const ambiente = this;
    this.equiposel = item;

   

    this.infosabsel = this.infosabs[index];

    this.modelEquipoSel.cfName = this.equiposel.nombre;
    this.modelEquipoSel.price = this.equiposel.precio;


    this.dataSourceComponentes.data = item.componentes;
    this.dataSourceServicios.data = item.servicios;
    this.dataSourcePracticas.data = item.practicas;


    setTimeout(function() {
      ambiente.dataSourceComponentes.sort = ambiente.sortComponentes;
      ambiente.dataSourceComponentes.paginator = ambiente.paginatorComponentes;

      ambiente.dataSourceServicios.sort = ambiente.sortServicios;
      ambiente.dataSourceServicios.paginator = ambiente.paginatorServicios;

      ambiente.dataSourcePracticas.sort = ambiente.sortPracticas;
      ambiente.dataSourcePracticas.paginator = ambiente.paginatorPracticas;
    }, 1000);


  }

  editarEquipo(){
    swal({
      title: 'Cargando un momento...',
      text: 'espere por favor',
      onOpen: () => {
        swal.showLoading();
      }
    });
    this.afs.doc('cfEquip/'+this.equiposel.id).update(this.modelEquipoSel).then(()=>{
      swal.close();
      swal({
        type: 'success',
        title: 'Exito',
        showConfirmButton: true
      });
      this.obs.changeObjectEquip({nombre:this.equiestructurado.nombre, uid: this.equiestructurado.uid});
    });
  }

  iniciliazarTablas() {
    this.equiposel = undefined;
    this.dataSourceComponentes.data = [];
    this.dataSourcePracticas.data = [];
    this.dataSourceServicios.data = [];
  }

  cambiarInfoModal(row, table) {
    this.tablesel = table;
    this.seleccionado = row;
    if(table == 'practicas'){
      this.initCalendarModal(this.seleccionado.programacion.horario);
    }
   
  }


  applyFilterEquip(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSourceEquip.filter = filterValue;
  }

  applyFilterComponentes(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSourceComponentes.filter = filterValue;
  }

  applyFilterPracticas(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSourcePracticas.filter = filterValue;
  }

  applyFilterServicios(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSourceServicios.filter = filterValue;
  }

  initCalendarModal(horario) {

    const containerEl: JQuery = $AB('#calendar2');

    if(containerEl.children().length > 0){
 
      containerEl.fullCalendar('destroy');
    }

    containerEl.fullCalendar({
      // licencia
      schedulerLicenseKey: 'GPL-My-Project-Is-Open-Source',
      // options here
      height: 450,
      header: {
        left: 'month,agendaWeek,agendaDay',
        center: 'title',
        right: 'today prev,next'
      },
      events: horario,

      defaultView: 'month',
      timeFormat: 'H(:mm)'

    });
  }



  // subir() {
  //   const equipos = {

  //     cfAcro: '',
  //     cfUri: '',
  //     cfName: '',
  //     cfDescr: '',
  //     cfKey: '',
  //     cfClass: '',
  //     cfClassScheme: '',
  //     cfFacil: '',
  //     cfPers: '',
  //     relatedSrv:  {} ,
  //     realatedPract: {},
  //     relatedMeas: {},
  //     qr: '',
  //     space: '',
  //     brand: '',
  //     model: '',
  //     price : 0,
  //     timeUnit: 'minutes',
  //     workingHours: '',
  //     timeBeforeBooking: '',
  //     cfConditions: [],
  //     active: true,
  //     createdAt: '',
  //     updatedAt: ''

  //   };




  //       // METODO QUE AGREGA UNA NUEVA SOLICITUD DE SERVICIO

  //       this.afs.collection('cfEquipment').add(equipos).then(data => {
  //         console.log(data);
  //         this.subirComp();
  //       });


  // }

  // subirComp() {

  //   const fecha = new Date();
  //   const components = {

  //     cfName: 'bola de iones',
  //     cfClass : '',
  //     cfClassScheme: '',
  //     cfConditions: [],
  //     cfDescription: 'elemento que se usa para contener la implosion',
  //     cfPrice: 12300000,
  //     brand: 'SAMSUNG',
  //     model: '2018',
  //     active: true,
  //     createdAt: fecha.toISOString(),
  //     updatedAt: fecha.toISOString()


  //   };
  //   this.afs.collection('cfEquip/YrqiRtkF6RGBg7Gvz5iG/components').add(components).then(dta => {
  //     console.log('se hizo menar');
  //   });
  // }

  // subirVar() {
  //   const fecha = new Date();
  //   const va = {
  //     cfName: 'servicio banda ancha',
  //     cfConditions: ['debe traer cedula', 'debe traer recibo'],
  //     cfDescription: 'para utilizar la sala de computo',
  //     cfPrice: '1200',
  //     active: true,
  //     createdAt: fecha.toISOString(),
  //     updateAt: fecha.toISOString()
  //   };

  //   this.afs.collection('cfSrv/IkDMCt1fpuP8xg2iIXwA/variations').add(va).then(dta => {
  //     console.log('se hizo menar');
  //   });
  // }

  cambiarIcono(box){
    if(!this.iconos[box]){
      this.iconos[box] = true;
    } else {
      this.iconos[box] = false;
    }
  }


}


