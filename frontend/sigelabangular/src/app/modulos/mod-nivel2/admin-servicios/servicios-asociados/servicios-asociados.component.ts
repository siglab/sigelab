import { Observable } from 'rxjs/Observable';
import { ObservablesService } from './../../../../shared/services/observables.service';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from 'angularfire2/firestore';
import swal from 'sweetalert2';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { Subscription } from 'rxjs';
import { Modulo2Service } from '../../services/modulo2.service';

declare var $: any;

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
    updatedAt:'',
    residuos:false,
    descuento:'0',
    parametros:[]
  };

  objectvariation = {
    active:true,
    cfConditions:[],
    cfDescription:'',
    cfName:'',
    cfPrice:'',
    createdAt:'',
    updateAt:'',
    residuos:false,
    parametros:[]
  };

  variaciones = [];
  variacionesCambiadas = [];

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

  parametro = '';
  listaParametrosServicio = [];

  parametroVar = '';
  listaParametrosVariacion = [];

  seleccion = false;
  constructor(private obs: ObservablesService, private servicioMod2:Modulo2Service) { }

  ngOnInit() {
  
    $('html, body').animate({ scrollTop: '0px' }, 'slow');

    this.sus =  this.obs.currentObjectServAsoc.subscribe(data => {
      this.getRoles(data.roles);
      this.seleccion = true;
      this.moduloinfo = false;
      this.resetIconos();
      swal({
        title: 'Cargando un momento...',
        text: 'espere mientras se cargan los datos',
        onOpen: () => {
          swal.showLoading();
        }
      });

        if(data.length != 0){

          this.lab_id = data.uid;
          this.servicioMod2.getCollectionServicios(data.uid).then(servicios =>{

            this.servasocestructurados = this.estructurarDataServ(servicios);
            this.servicioMod2.buscarLab(this.lab_id).then(labo => {
              this.equipos = this.estructurarEquipos(labo.data().relatedEquipments);
            
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
   getRoles(rol) {
    this.moduloNivel2 = false;
    for (const clave in rol) {
      if (rol[clave]) {
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


 

  // METODO QUE ESTRUCTURA LA DATA PARA LA VISTA BUSQUEDA DE SERVICIOS
  estructurarDataServ(data: any) {

    this.servasocestructurados = [];

    data.forEach( doc =>{
      // convertir boolean a cadena de caracteres para estado del laboratorio

      const elemento = doc.data();

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
          variaciones: this.variations(doc.id),
          condiciones: elemento.cfCondition,
          uid: doc.id,
          creado: elemento.createdAt,
          editado: elemento.updatedAt,
          active: elemento.active,
          residuos:elemento.residuos,
          descuento:elemento.descuento,
          parametros: elemento.parametros 
        }
      };

      this.servasocestructurados.push(servicios);
    });

    return this.servasocestructurados;
  }

  // METODO QUE ESTRUCTURA LAS VARIACIONES DE UN SERVICIO
  variations(clave){

    const variaciones = [];
    this.servicioMod2.getVariaciones(clave).then(data => {
      if(data){
        data.forEach(doc=>{
          const element = doc.data();

            variaciones.push({cfName:element.cfName, data: element, id: doc.id, active:element.active});

        });

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
          this.servicioMod2.buscarEquipo(clave).then(data => {
            const equip = data.data();

            // funciona con una programacion, cuando hayan mas toca crear otro metodo
            const equipo = {
              id: data.id,
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
    this.srv.residuos = this.itemsel.infoServ.residuos;
    this.srv.descuento = this.itemsel.infoServ.descuento;
    this.srv.parametros = this.itemsel.infoServ.parametros;

    this.variaciones = this.itemsel.infoServ.variaciones.slice();

    this.dataSourceEquipvin = new MatTableDataSource(this.itemsel.infoServ.equipos);

  }

  cambiarDataEditarVariacion(item){

    this.nuevaVar = false;
    this.objectvariation = item.data;

  }

  agregarServicio(){
    const fecha = new Date();
    this.srv.createdAt = fecha.toISOString();
    this.srv.updatedAt = fecha.toISOString();
    this.srv.cfFacil = this.lab_id;
  
    this.srv.parametros = this.listaParametrosServicio;
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


    this.servicioMod2.addServicio(this.srv).then(data =>{
      console.log(data);
      const objeto = {relatedServices:{}};
      objeto.relatedServices[data.id] = true;
      this.servicioMod2.setDocLaboratorio(this.lab_id, objeto);
      if(this.variaciones.length != 0){
        for (let i = 0; i < this.variaciones.length; i++) {
          const element = this.variaciones[i];
          this.servicioMod2.addVariaciones(data.id, element).then(()=>{
            //swal.close();

            if(i == this.variaciones.length-1){
              swal({
                type: 'success',
                title: 'creado correctamente',
                showConfirmButton: true
              }).then(()=>{
                this.cerrarModal('modal2');
              });;
            }

          });
        }
      } else {
        swal({
          type: 'success',
          title: 'creado correctamente',
          showConfirmButton: true
        }).then(()=>{
          this.cerrarModal('modal2');
        });
      }

      this.selection.selected.forEach((element) => {
        let srvEquip = {
          relatedSrv:{}
        };
        if (element.id) {
          srvEquip.relatedSrv[data.id] = true;
          this.servicioMod2.setEquipo(element.id, srvEquip);
        }
      });
     

    });

  }

  editarServicio(){
    const fecha = new Date();
    for (let i = 0; i < this.itemsel.infoServ.equipos.length; i++) {
      const equipo = this.itemsel.infoServ.equipos[i];
      this.srv.relatedEquipments[equipo.id] = true;

      let srvequip = {
        relatedSrv:{}
      };

      srvequip.relatedSrv[this.itemsel.infoServ.uid] = true;
      this.servicioMod2.setEquipo(equipo.id, srvequip);
    }
    this.srv.cfFacil = this.lab_id;
    this.srv.updatedAt = fecha.toISOString();


    swal({
      title: 'Cargando un momento...',
      text: 'espere mientras se cargan los datos',
      onOpen: () => {
        swal.showLoading();
      }
    });

    this.servicioMod2.updateServicio(this.itemsel.infoServ.uid, this.srv).then(()=>{


      for (let j = 0; j < this.variaciones.length; j++) {
        const variacion = this.variaciones[j];
        if(variacion.id == 'nuevo'){
          this.servicioMod2.addVariaciones(this.itemsel.infoServ.uid, variacion.data).then(()=>{
            swal({
              type: 'success',
              title: 'Editado correctamente',
              showConfirmButton: true
            }).then(()=>{
              this.variaciones = [];
              this.cerrarModal('modal1');
            });
          });
        } else {
          this.servicioMod2.
              updateVariciones(this.itemsel.infoServ.uid , variacion.id, variacion.data).then(()=>{

              });
        }


        if(j == this.variaciones.length-1){
          swal.close();
          swal({
            type: 'success',
            title: 'Editado correctamente',
            showConfirmButton: true
          }).then(()=>{
            this.variaciones = [];
            this.cerrarModal('modal1');
          });
         
        }

      }

      for (let i = 0; i < this.variacionesCambiadas.length; i++) {
        this.servicioMod2.setVariaciones(
          this.itemsel.infoServ.uid, 
          this.variacionesCambiadas[i].id, 
          {active:this.variacionesCambiadas[i].active});

          if(i == this.variacionesCambiadas.length-1){
            this.variacionesCambiadas = [];
          }
      }


    });



  }


  agregarCondicion(){
    this.srv.cfCondition.push(this.condicion);
    this.condicion = '';
  }

  quitarCondicion(index){
    this.srv.cfCondition.splice(index, 1);
  }

  agregarParametro(servar){
    if(servar == 'servicio'){
      this.listaParametrosServicio.push(this.parametro);
      this.parametro = '';
    } else {
      this.listaParametrosVariacion.push(this.parametroVar);
      this.parametroVar = '';
    }
  }

  quitarParametro(index, servar){
    if(servar == 'servicio'){
      this.listaParametrosServicio.splice(index,1);
    } else {
      this.listaParametrosVariacion.splice(index,1);
    }
  }

  agregarParametroEdit(servar){
    if(servar == 'servicio'){
      this.srv.parametros.push(this.parametro);
      this.parametro = '';
    } else {
      this.objectvariation.parametros.push(this.parametroVar);
      this.parametroVar = '';
    }
  }

  quitarParametroEdit(index, servar){
    if(servar == 'servicio'){
      this.srv.parametros.splice(index,1);
    } else {
      this.objectvariation.parametros.splice(index,1);
    }
  }

  agregarCondicionVariacion(){
    this.objectvariation.cfConditions.push(this.condicionvar);
    this.condicionvar = '';
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
    this.objectvariation.parametros = this.listaParametrosVariacion;
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
    this.variaciones.splice(index, 1);
  }

  cambiarEstadoVariacion(pos, active){
    let encontrado = false;
    let indice = 0;
    this.variacionesCambiadas.forEach((doc, index)=>{
      if(doc.id == this.variaciones[pos].id){
       encontrado = true;
       indice = index;
      }
    });

    if(!encontrado){
      this.variacionesCambiadas.push({id:this.variaciones[pos].id, active: !active});
    }else{
      this.variacionesCambiadas[indice].active = !active;
    }

    this.variaciones[pos].active = !active;

    swal({
      type: 'success',
      title: 'cambio de estado de variacion hecho',
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
      updateAt:'',
      residuos:false,
      parametros: []
    };

    this.listaParametrosVariacion = [];
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
      updatedAt:'',
      residuos:false,
      descuento:'0',
      parametros:[]
    };

    this.listaParametrosServicio = [];
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

  cerrarModal(modal){
    $('#'+modal).modal('hide');
  }

  resetIconos(){
    this.iconos.info = false;
    this.iconos.sabs = false;
  }

}
