import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ObservablesService } from '../../../shared/services/observables.service';

import swal from 'sweetalert2';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { AngularFirestore } from 'angularfire2/firestore';
@Component({
  selector: 'app-admin-equipos',
  templateUrl: './admin-equipos.component.html',
  styleUrls: ['./admin-equipos.component.css']
})
export class AdminEquiposComponent implements OnInit, AfterViewInit {



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

  constructor(private obs: ObservablesService, private afs: AngularFirestore) {

  }

  ngOnInit() {
      // abre loading mientras se cargan los datos
      swal({
        title: 'Cargando un momento...',
        text: 'espere mientras se cargan los datos',
        onOpen: () => {
          swal.showLoading();
        }
      });


    this.obs.currentObject.subscribe(data => {

      this.iniciliazarTablas();

      if(data.length != 0){
        this.estructurarEquip(data.uid).then(() => {
         this.itemsel = Observable.of(this.equiestructurado.equipos);
          console.log(this.equiestructurado);
         this.dataSourceEquip.data = this.equiestructurado.equipos;

         const ambiente = this;
       
         swal({
           title: 'Cargando un momento...',
           text: 'espere mientras se cargan los datos',
           onOpen: () => {
             swal.showLoading();
           }
         });
   
          setTimeout(function() {
            if (ambiente.equiestructurado.equipos != 0) {
              ambiente.dataSourceEquip.sort = ambiente.sortEquip;
              ambiente.dataSourceEquip.paginator = ambiente.paginatorEquip;
               // cierra loading luego de cargados los datos
              swal.close();
            }
           
          }, 1500);
 
       });
      
      }

     });
  }

  ngAfterViewInit(): void {

  }

  estructurarEquip(key){

    let promise = new Promise((resolve,reject)=>{
     this.buscarLab(key).subscribe(labo => {
       const laboratorio = labo.payload.data();

       let estadoLab;
       if (laboratorio.active === true) {
          estadoLab = 'Activo';
       } else if ( laboratorio.active === false ) {
          estadoLab = 'Inactivo';
       }

        this.equiestructurado = {
          uid: labo.payload.id,
          nombre: laboratorio.cfName,
          equipos: this.estructurarEquipos(laboratorio.relatedEquipments),
          estado: estadoLab
        };

        resolve();
 
     })
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
            this.afs.doc('practice/' + clave ).collection('programmingData').valueChanges().subscribe(data2 => {

              // funciona con una programacion, cuando hayan mas toca crear otro metodo
              const prog = data2[0];

              if(prog){
                const pract = {
                  nombre: practica.practiceName,
                  programacion: {
                    estudiantes: prog['noStudents'],
                    diahora: prog['schedule'],
                    semestre: prog['semester']
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

    for (const clave in item) {
      // Controlando que json realmente tenga esa propiedad
      if (item.hasOwnProperty(clave)) {

        if (item[clave]) {
           this.afs.doc('cfEquip/' + clave).snapshotChanges().subscribe(data => {
           const equip =  data.payload.data();

             // funciona con una programacion, cuando hayan mas toca crear otro metodo
                const equipo = {
                  nombre: equip.cfName,
                  activo: equip.active,
                  precio: equip.price,
                  componentes:this.estructurarComponents(clave),
                  servicios:this.estructurarServicios(equip.relatedSrv).arr,
                  practicas:this.estructurarPracticas(equip.relatedPrac)
                };

              

                arr.push(equipo);


           });
        }

      }
    }

    return arr;
  }

      // METODO QUE ESTRUCTURA LA DATA DE LOS COMPONENTES EN LA VISTA BUSQUEDA DE LABORATORIOS
  // RECIBE EL NODO DE LABORATORIO QUE CONTIENE LAS PRACTICAS ASOCIADOS
  estructurarComponents(item){
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




 


  cambiardataEquipos(item) {
   this.equiposel = this.buscarDato(item);

  }

  cambiarDataEquipo(item) {
    console.log(item);
    const ambiente = this;
    this.equiposel = item;
    this.dataSourceComponentes.data = item.componentes;
    this.dataSourceServicios.data = item.servicios;
    this.dataSourcePracticas.data = item.practicas;
    console.log(this.dataSourceComponentes.data);
    setTimeout(function() {
      ambiente.dataSourceComponentes.sort = ambiente.sortComponentes;
      ambiente.dataSourceComponentes.paginator = ambiente.paginatorComponentes;

      ambiente.dataSourceServicios.sort = ambiente.sortServicios;
      ambiente.dataSourceServicios.paginator = ambiente.paginatorServicios;

      ambiente.dataSourcePracticas.sort = ambiente.sortPracticas;
      ambiente.dataSourcePracticas.paginator = ambiente.paginatorPracticas;
    }, 1000);


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
  }


 buscarDato(item) {
  //  for(let i=0;i<this.equipos.length;i++){
  //    if(item.nombre == this.equipos[i].nombre){
  //      return this.equipos[i];
  //    }
  //  }
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

  subir() {
    const equipos = {

      cfAcro: '',
      cfUri: '',
      cfName: '',
      cfDescr: '',
      cfKey: '',
      cfClass: '',
      cfClassScheme: '',
      cfFacil: '',
      cfPers: '',
      relatedSrv:  {} ,
      realatedPract: {},
      relatedMeas: {},
      qr: '',
      space: '',
      brand: '',
      model: '',
      price : 0,
      timeUnit: 'minutes',
      workingHours: '',
      timeBeforeBooking: '',
      cfConditions: [],
      active: true,
      createdAt: '',
      updatedAt: ''

    };




        // METODO QUE AGREGA UNA NUEVA SOLICITUD DE SERVICIO

        this.afs.collection('cfEquipment').add(equipos).then(data => {
          console.log(data);
          this.subirComp();
        });


  }

  subirComp() {

    const fecha = new Date();
    const components = {

      cfName: 'bola de iones',
      cfClass : '',
      cfClassScheme: '',
      cfConditions: [],
      cfDescription: 'elemento que se usa para contener la implosion',
      cfPrice: 12300000,
      brand: 'SAMSUNG',
      model: '2018',
      active: true,
      createdAt: fecha.toISOString(),
      updatedAt: fecha.toISOString()


    };
    this.afs.collection('cfEquip/YrqiRtkF6RGBg7Gvz5iG/components').add(components).then(dta => {
      console.log('se hizo menar');
    });
  }

  subirVar() {
    const fecha = new Date();
    const va = {
      cfName: 'servicio banda ancha',
      cfConditions: ['debe traer cedula', 'debe traer recibo'],
      cfDescription: 'para utilizar la sala de computo',
      cfPrice: '1200',
      active: true,
      createdAt: fecha.toISOString(),
      updateAt: fecha.toISOString()
    };

    this.afs.collection('cfSrv/IkDMCt1fpuP8xg2iIXwA/variations').add(va).then(dta => {
      console.log('se hizo menar');
    });
  }

}


