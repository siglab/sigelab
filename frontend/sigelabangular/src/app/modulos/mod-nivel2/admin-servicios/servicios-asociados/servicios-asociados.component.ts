import { Observable } from 'rxjs/Observable';
import { ObservablesService } from './../../../../shared/services/observables.service';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from 'angularfire2/firestore';
import swal from 'sweetalert2';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-servicios-asociados',
  templateUrl: './servicios-asociados.component.html',
  styleUrls: ['./servicios-asociados.component.css']
})
export class ServiciosAsociadosComponent implements OnInit, OnDestroy {

  itemsel:any;

  private collectionReserv: AngularFirestoreCollection<any>;

  servasocestructurados:any;

  // INICIALIZACION DATATABLE lABORATORIOS
  displayedColumns = ['nombreserv'];
  dataSource = new MatTableDataSource([]);
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('sort') sort: MatSort;


  // equipos
  displayedColumnsEquip = ['select', 'nombre'];
  dataSourceEquip = new MatTableDataSource([]);
  @ViewChild('paginatorEquip') paginatorEquip: MatPaginator;
  @ViewChild('sortEquip') sortEquip: MatSort;

  // EQUIPOS VINCULADOS AL SERVICIO
  displayedColumnsEquipVin = ['select', 'nombre'];
  dataSourceEquipvin = new MatTableDataSource([]);
  @ViewChild('paginatorEquipVin') paginatorEquipVin: MatPaginator;
  @ViewChild('sortEquipVin') sortEquipVin: MatSort;


  campoCondicion = '';
  condicionesobjeto = {};
  variation:any;
  variacionSel = "";

  moduloinfo = false;

  iconos = {
    info:false,
    sabs:false
  };

  iconosModal = {
    servicio:false,
    variacion:false,
    equipos:false,
    equipos2:false
  };

  srv = {
    active:true,
    cfAcro:'',
    cfClass:'',
    cfCondition:[],
    cfCurrCode:'CO',
    cfDesc:'',
    cfFacil:'',
    cfName:'',
    cfPrice:'',
    cfScheme:'',
    cfUri:'',
    createdAt:'',
    relatedEquipments:{},
    relatedMeasurement:{},
    relatedServices:{},
    updatedAt:''
  };

  objectvariation = {
    active:true,
    cfConditions:[],
    cfDescription:'',
    cfName:'',
    cfPrice:'',
    createdAt:'',
    updateAt:''
  }

  variaciones = [];
  variacionesRetiradas = [];

  condicion = '';
  condicionvar = '';

  lab_id = '';

  selection = new SelectionModel(true, []);
  selection2 = new SelectionModel(true, []);

  equipos:any;

  editar = false;
  botonEditar = false;
  nuevaVar = false;

  sus: Subscription;

  role:any;
  moduloNivel2 = false;

  constructor(private obs: ObservablesService, private afs: AngularFirestore) { }

  ngOnInit() {
    this.getRoles();
    swal({
      title: 'Cargando un momento...',
      text: 'espere mientras se cargan los datos',
      onOpen: () => {
        swal.showLoading();
      }
    });
    this.sus =  this.obs.currentObjectServAsoc.subscribe(data => {
        if(data.length != 0){

          this.lab_id = data.uid;
          this.getCollectionServ(data.uid).subscribe(servicios =>{

            this.servasocestructurados = this.estructurarDataServ(servicios);
            this.getLaboratorio(this.lab_id).subscribe(labo => {
              this.equipos = this.estructurarEquipos(labo.payload.data().relatedEquipments);
              console.log(this.equipos);
              if(this.servasocestructurados ){
                this.dataSource.data = this.servasocestructurados;
                this.dataSourceEquip = new MatTableDataSource(this.equipos);

                setTimeout(() => {

                  this.dataSource.sort = this.sort;
                  this.dataSource.paginator = this.paginator;
                  // cierra loading luego de cargados los datos

                  this.dataSourceEquip.sort = this.sortEquip;
                  this.dataSourceEquip.paginator = this.paginatorEquip;
                  if(this.servasocestructurados.length != 0){
                    swal.close();
                  }else {
                    swal({
                      type: 'error',
                      title: 'No existen servicios asociados al laboratorio',
                      showConfirmButton: true
                    });
                  }

                }, 1000);

              }
            });

          });
        } else{
          swal({
            type: 'error',
            title: 'No se ha seleccionado ningun laboratorio',
            showConfirmButton: true
          });
        }

      });
  }

  ngOnDestroy(){
    this.sus.unsubscribe();
  }

   // METODO QUE ME TRAE EL ROL DE ACCESSO A NIVEL 2
   getRoles() {

    this.role = JSON.parse(localStorage.getItem('rol'));
    console.log(this.role);
    for (const clave in this.role) {
      if (this.role[clave]) {
        if ((clave == 'moduloNivel2')) {
          this.moduloNivel2 = true;
        }
      }
    }
  }

  // TABLA EQUIPOS PERTENECIENTES AL LABORATORIO
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.displayedColumnsEquip.length;
    return numSelected === numRows;
  }
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSourceEquip.data.forEach(row => this.selection.select(row));
  }

  // TABLA EQUIPOS PERTENECIENTES AL LABORATORIO
  isAllSelected2() {
    const numSelected = this.selection2.selected.length;
    const numRows = this.displayedColumnsEquip.length;
    return numSelected === numRows;
  }
  masterToggle2() {
    this.isAllSelected2() ?
      this.selection2.clear() :
      this.dataSourceEquip.data.forEach(row => this.selection2.select(row));
  }


  getCollectionServ(labid) {
    this.collectionReserv = this.afs.collection('cfSrv',
      ref => ref.where('cfFacil', '==', labid));

    return this.collectionReserv.snapshotChanges();
  }

  getLaboratorio(labid){
    return this.afs.doc('cfFacil/' + labid).snapshotChanges();
  }

  // METODO QUE ESTRUCTURA LA DATA PARA LA VISTA BUSQUEDA DE SERVICIOS
  estructurarDataServ(data: any) {

    this.servasocestructurados = [];

    for (let index = 0; index < data.length; index++) {
      const elemento = data[index].payload.doc.data();

      // convertir boolean a cadena de caracteres para estado del laboratorio
      let estadoServ;
      if(elemento.active == true) {
        estadoServ = 'Activo';
      } else if( elemento.active == false ) {
        estadoServ = 'Inactivo';
      }

      const servicios = {
        nombreserv: elemento.cfName,
        infoServ: {
          descripcion: elemento.cfDesc,
          precio: elemento.cfPrice,
          estado: estadoServ,
          equipos: this.estructurarEquipos(elemento.relatedEquipments),
          variaciones: this.variations(data[index].payload.doc.id),
          condiciones: elemento.cfCondition,
          uid: data[index].payload.doc.id,
          creado: elemento.createdAt,
          editado: elemento.updatedAt,
          active: elemento.active
        }
      };

      this.servasocestructurados.push(servicios);


    }

    return this.servasocestructurados;
  }

  // METODO QUE ESTRUCTURA LAS VARIACIONES DE UN SERVICIO
  variations(clave){

    const variaciones = [];
    this.afs.doc('cfSrv/' + clave).collection('variations').snapshotChanges().subscribe(data => {
      if(data){
        for (let i = 0; i < data.length; i++) {
          const element = data[i].payload.doc.data();
          if(element.active){
            variaciones.push({cfName:element.cfName, data: element, id: data[i].payload.doc.id});
          }      
        }
      } else {
        return variaciones;
      }

    });
    return variaciones;
  }

  // METODO QUE BUSCA LA VARIACION QUE COINCIDE CON EL ID ENVIADO DESDE LA VISTA
  buscarVariacion(item){
    for (let i = 0; i < this.itemsel.infoServ.variaciones.length; i++) {
      const element = this.itemsel.infoServ.variaciones[i];
      if(element.id == item){
        return element;
      }
    }
  }

  cambiarVariacion(item){

    if(item != 'inicial'){
      this.variation = this.buscarVariacion(item);
      console.log(this.variation);
      this.estructurarVariaciones(this.variation.data.cfConditions);
    } else {
      this.variation = undefined;
    }


  }

  //METODO QUE ME ESTRUCTURA EL ARREGLO DE CONDICIONES PARA EL OBJETO RESERVAS DE SERVICIOS
  estructuraCondiciones(variations){
    const arr = [];
    for (let i = 0; i < variations.length; i++) {
      const element = variations[i];

      const vari = {
        conditionText: variations[i],
        aceptada: this.condicionesobjeto["checkbox"+i]
      }
      arr.push(vari);
    }
    return arr;
  }

  // ESTRUCTURA OBJETO JSON QUE SE ENLAZA A LOS CHECKBOX DE LA VISTA DE MANERA DINAMICA
  estructurarVariaciones(condiciones){
    this.condicionesobjeto = {};
    for (let i = 0; i < condiciones.length; i++) {
      //const element = condiciones[i];
      this.condicionesobjeto["checkbox"+i] = true;
    }
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
            const equip = data.payload.data();

            // funciona con una programacion, cuando hayan mas toca crear otro metodo
            const equipo = {
              id: data.payload.id,
              nombre: equip.cfName,
              activo: equip.active,
              precio: equip.price,
            };



            arr.push(equipo);


          });
        }

      }
    }

    return arr;
  }

  cambiardata(item) {
    console.log(item);
    this.variation = undefined;
    this.campoCondicion = '';
      /*  navega hacia bajo para mostrar al usuario la posicion de los datos */
    this.itemsel = item;

    if(item.infoServ.variaciones.length == 0){
      if(item.infoServ.condiciones.length !== 0){
        this.estructurarVariaciones(item.infoServ.condiciones);
      }

    }
    this.moduloinfo = true;

  }


  cambiarIcono(box){
    if(!this.iconos[box]){
      this.iconos[box] = true;
    } else {
      this.iconos[box] = false;
    }
  }

  cambiarIconoModal(box){
    if(!this.iconosModal[box]){
      this.iconosModal[box] = true;
    } else {
      this.iconosModal[box] = false;
    }
  }


  cambiarDatosEditar(){
    this.editar = true;
    this.botonEditar = true;
    this.srv.cfName = this.itemsel.nombreserv;
    this.srv.cfDesc = this.itemsel.infoServ.descripcion;
    this.srv.cfPrice = this.itemsel.infoServ.precio;
    this.srv.cfCondition = this.itemsel.infoServ.condiciones.slice();
    this.srv.createdAt = this.itemsel.infoServ.creado;
    this.srv.updatedAt = this.itemsel.infoServ.editado;
    this.srv.active = this.itemsel.infoServ.active;

    this.variaciones = this.itemsel.infoServ.variaciones.slice();

    this.dataSourceEquipvin = new MatTableDataSource(this.itemsel.infoServ.equipos);

  }

  cambiarDataEditarVariacion(item){
    console.log(this.variaciones);
    this.nuevaVar = false;
    this.objectvariation = item.data;

  }

  agregarServicio(){
    const fecha = new Date();
    this.srv.createdAt = fecha.toISOString();
    this.srv.updatedAt = fecha.toISOString();
    this.srv.cfFacil = this.lab_id;
    this.selection.selected.forEach((element) => {

      if (element.id) {
        this.srv.relatedEquipments[element.id] = true;
      }
    });
    swal({
      title: 'Cargando un momento...',
      text: 'espere mientras se cargan los datos',
      onOpen: () => {
        swal.showLoading();
      }
    });


    this.afs.collection('cfSrv').add(this.srv).then(data =>{
      console.log(data);
      const objeto = {relatedServices:{}};
      objeto.relatedServices[data.id] = true;
      this.afs.doc('cfFacil/' + this.lab_id).set(objeto,{merge:true});
      if(this.variaciones.length != 0){
        for (let i = 0; i < this.variaciones.length; i++) {
          const element = this.variaciones[i];
          this.afs.collection('cfSrv/' + data.id + '/variations').add(element).then(()=>{
            //swal.close();

            if(i == this.variaciones.length-1){
              swal({
                type: 'success',
                title: 'creado correctamente',
                showConfirmButton: true
              });
            }

          });
        }
      } else {
        swal({
          type: 'success',
          title: 'creado correctamente',
          showConfirmButton: true
        });
      }

    });

  }

  editarServicio(){
    const fecha = new Date();
    for (let i = 0; i < this.itemsel.infoServ.equipos.length; i++) {
      const equipo = this.itemsel.infoServ.equipos[i];
      this.srv.relatedEquipments[equipo.id] = true;
    }
    this.srv.cfFacil = this.lab_id;
    this.srv.updatedAt = fecha.toISOString();
    console.log(this.srv);

    swal({
      title: 'Cargando un momento...',
      text: 'espere mientras se cargan los datos',
      onOpen: () => {
        swal.showLoading();
      }
    });

    this.afs.doc('cfSrv/' + this.itemsel.infoServ.uid).update(this.srv).then(()=>{

      console.log(this.variaciones);

      for (let j = 0; j < this.variaciones.length; j++) {
        const variacion = this.variaciones[j];
        if(variacion.id == 'nuevo'){
          this.afs.collection('cfSrv/' + this.itemsel.infoServ.uid + '/variations').add(variacion.data).then(()=>{

          });
        } else {
          this.afs.collection('cfSrv/' + this.itemsel.infoServ.uid + '/variations')
          .doc(variacion.id).update(variacion.data).then(()=>{

          });
        }


        if(j == this.variaciones.length-1){
          swal.close();
          swal({
            type: 'success',
            title: 'creado correctamente',
            showConfirmButton: true
          });
          this.variaciones = [];
        }

      }

      for (let i = 0; i < this.variacionesRetiradas.length; i++) {
        this.afs.collection('cfSrv/' + this.itemsel.infoServ.uid + '/variations')
          .doc(this.variacionesRetiradas[i]).set({active:false},{merge:true});

          if(i == this.variacionesRetiradas.length-1){
            this.variacionesRetiradas = [];
          } 
      }
       

    });



  }


  agregarCondicion(){
    this.srv.cfCondition.push(this.condicion);
    this.condicion = '';
    console.log(this.srv.cfCondition);
  }

  quitarCondicion(index){
    this.srv.cfCondition.splice(index, 1);
  }

  agregarCondicionVariacion(){
    this.objectvariation.cfConditions.push(this.condicionvar);
    this.condicionvar = '';
    console.log(this.objectvariation.cfConditions);
  }

  quitarCondicionVariacion(index){
    this.objectvariation.cfConditions.splice(index, 1);
  }

  nuevaVariacion(){
    this.nuevaVar = true;
    this.inicializarVariacion();
  }

  agregarVariacion(){
    const fecha = new Date();
    this.objectvariation.createdAt = fecha.toISOString();
    this.objectvariation.updateAt = fecha.toISOString();
    if(!this.editar){
      this.variaciones.push(this.objectvariation);
    } else {
      this.variaciones.push({cfName: this.objectvariation.cfName, data:this.objectvariation, id:'nuevo'});
    }

    this.inicializarVariacion();
    
    swal({
      type: 'success',
      title: 'variacion agregada',
      showConfirmButton: true
    });


  }

  quitarVariacion(index){
    if(!this.editar){
      this.variaciones.splice(index, 1);
    }else{
       this.itemsel.infoServ.variaciones.forEach(element => {
        if(element.id == this.variaciones[index].id){
          console.log('si ');
          this.variacionesRetiradas.push(this.variaciones[index].id);
        }
      });

      this.variaciones.splice(index, 1);
    }

    swal({
      type: 'success',
      title: 'variacion retirada',
      showConfirmButton: true
    });

   
  }

  agregarEquipo(){
    this.selection.selected.forEach((element) => {

      this.itemsel.infoServ.equipos.push(element);
      this.dataSourceEquipvin = new MatTableDataSource(this.itemsel.infoServ.equipos);
    });

    swal({
      type: 'success',
      title: 'equipo agregado',
      showConfirmButton: true
    });

  }

  quitarEquipo(){
    this.selection2.selected.forEach((element) => {
      for (let i = 0; i < this.itemsel.infoServ.equipos.length; i++) {
        const equipo = this.itemsel.infoServ.equipos[i];

        if(element.id == equipo.id){
          this.itemsel.infoServ.equipos.splice(i, 1);
          this.dataSourceEquipvin = new MatTableDataSource(this.itemsel.infoServ.equipos);
          swal({
            type: 'error',
            title: 'equipo retirado',
            showConfirmButton: true
          });
        }

      }

    });
  }

  inicializarVariacion(){
    this.objectvariation = {
      active:true,
      cfConditions:[],
      cfDescription:'',
      cfName:'',
      cfPrice:'',
      createdAt:'',
      updateAt:''
    }
  }

  inicializarServicio(){
    this.srv = {
      active:true,
      cfAcro:'',
      cfClass:'',
      cfCondition:[],
      cfCurrCode:'CO',
      cfDesc:'',
      cfFacil:'',
      cfName:'',
      cfPrice:'',
      cfScheme:'',
      cfUri:'',
      createdAt:'',
      relatedEquipments:{},
      relatedMeasurement:{},
      relatedServices:{},
      updatedAt:''
    };
  }

  nuevoEspacio(){
    this.editar = false;
    this.variaciones = [];

    this.inicializarServicio();
    this.inicializarVariacion();


  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSourceEquip.filter = filterValue;
  }

}
