import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Http } from '@angular/http';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';

declare var $: any;

import swal from 'sweetalert2';
import { FormControl } from '@angular/forms';
import { URLCORREO } from '../../../config';

@Component({
  selector: 'app-comunicacion-masiva',
  templateUrl: './comunicacion-masiva.component.html',
  styleUrls: ['./comunicacion-masiva.component.css']
})


export class ComunicacionMasivaComponent implements OnInit {


  itemsel: any;

  arregloSinFiltros = [];

  objsel = {
    sede:'inicial',
    facultad:'inicial',
    departamento:'inicial',
    escuela:'inicial'
  };

  htmlContent:any;

  correo = {
    asunto:'',
    mensaje:''
  };

  notificacion:'';

  caracteres = 140;

  persona:any;

  historial = [];
  historialsel:any;

  displayedColumns = ['asunto', 'tipo', 'email', 'fecha'];
  dataSource = new MatTableDataSource([]);
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('sort') sort: MatSort;


  formCheckBox = {
    universidad: new FormControl({value:false, disabled:false}),
    sede: new FormControl({value:false, disabled:false}),
    subsede: new FormControl({value:false, disabled:false}),
    facultad: new FormControl({value:false, disabled:false}),
    departamento: new FormControl({value:false, disabled:false}),
    escuela: new FormControl({value:false, disabled:false})
  };

  formSelect = {
    sede: new FormControl({value:'', disabled:true}),
    subsede: new FormControl({value:'', disabled:true}),
    facultad: new FormControl({value:'',disabled:true}),
    departamento: new FormControl({value:'',disabled:true}),
    escuela: new FormControl({value:'',disabled:true})
  };

  listSelect = {
    sede:[],
    subsede:[],
    facultad:[],
    departamento:[],
    escuela:[]
  };


  constructor(private afs:AngularFirestore, private http:Http) {



  }

  ngOnInit() {

    this.persona = JSON.parse(localStorage.getItem('usuario'));

    $('html, body').animate({ scrollTop: '0px' }, 'slow');

    this.estructurarSedes();
    this.estructurarTodasSubSedes();
    this.estructurarFacultades();


    this.consultarHistorial().subscribe(datos => {
      this.historial = datos;
      this.dataSource.data = datos;

      setTimeout(()=>{
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },2000)
    });

  }


  estructurarSedes(){

    this.buscaSede().then(datos=>{
      datos.forEach(doc => {
        const sede = doc.data();
        this.listSelect.sede.push({
          id:doc.id,
          nombre: sede.cfName
        });
      });

    });


  }

  estructurarTodasSubSedes(){
    this.buscaTodasSubSede().then(datos=>{
      datos.forEach(doc => {
        const sede = doc.data();
        this.listSelect.subsede.push({
          id:doc.id,
          nombre: sede.cfAddrline2 ? sede.cfAddrline2 : sede.cfAddrline1
        });
      });
    });
  }

  estructurarSubSedes(sedes){
    this.listSelect.subsede = [];

      for (let i = 0; i < this.listSelect.sede.length; i++) {
        const element = this.listSelect.sede[i];

        this.buscaSubSede(element.id).then(datos=>{
          datos.forEach(doc => {
            const sede = doc.data();
            this.listSelect.subsede.push({
              id: doc.id,
              nombre: sede.cfAddrline1 + ' - ' + sede.cfCityTown
            });
          });

        });
      }

      for (let j = 0; j < this.listSelect.subsede.length; j++) {
        const element = this.listSelect.subsede[j];
        this.estructurarFacultadesWitSede(element.id);
      }


  }


  estructurarFacultades(){
    this.listSelect.facultad = [];
    this.buscaTodasFacultades().then(datos=>{

      datos.forEach(doc => {
        const facultad = doc.data();
        this.listSelect.facultad.push({
          id:doc.id,
          nombre: facultad.facultyName
        });

        this.estructurarDeparamentos(doc.id);
      });

    });
  }

  estructurarFacultadesWitSede(keysede){
    this.listSelect.facultad = [];
    this.buscaFacultadWitSede(keysede).then(datos=>{

      datos.forEach(doc => {
        const facultad = doc.data();
        this.listSelect.facultad.push({
          id:doc.id,
          nombre: facultad.facultyName
        });

        this.estructurarDeparamentos(doc.id);
      });

    });
  }


  estructurarDeparamentos(keyfacul){
    this.listSelect.departamento = [];
    this.listSelect.escuela = [];
    this.buscaDepartamento(keyfacul)
    .then(departamento => {
      departamento.forEach(doc => {

        const element = doc.data();

        if(element.type == 'department'){

          this.listSelect.departamento.push({
            id: doc.id,
            nombre: element.departmentName,
            facul: keyfacul
          });

        } else {

        this.listSelect.escuela.push({
          id: doc.id,
          nombre: element.departmentName,
          facul: keyfacul
        });

        }
      });


    });

  }



  aplicarFiltro(filtro){

   console.log(filtro);
   console.log(this.formSelect[filtro].value);

   for (let i = 0; i < this.formSelect[filtro].value.length; i++) {
     const element = this.formSelect[filtro].value[i];

     if(filtro == 'sede'){
       this.estructurarSubSedes(element.id);
     }
   }

  }

  controlChecks(item){
    const arr = ['sede','subsede','facultad','departamento', 'escuela'];
    if(item == 'universidad'){
      if(this.formCheckBox[item].value){
        arr.forEach(elemen=>{
          this.formCheckBox[elemen].setValue(false);
          this.formSelect[elemen].setValue('');
          this.formSelect[elemen].disable();
          this.formCheckBox[elemen].disable();
        });

      }else{
        arr.forEach(elemen=>{
          this.formCheckBox[elemen].enable();
        });
      }
    }else{
      if(this.formCheckBox[item].value){

        this.formSelect[item].enable();
      }else{
        this.formSelect[item].disable();
        this.formSelect[item].setValue('');
      }
    }

  }


  cambiarNumeroCaracteres(value){
    this.caracteres = 140;
    this.caracteres -= value.length;
  }


  enviarCorreoNotificacion(item){

    this.alertaCargando();

    let coincidencias = [];

    let seleccion = false;

    const arr = {
            sede:'headquarter',
            subsede:'subHq',
            facultad:'faculties',
            departamento:'departments',
            escuela:'departments'
          };


    let correos = '';
    let notificaciones = [];

    const inicio = 'if('
    const fin = '){'+
          'coincidencias.push({id: element["facilityAdmin"]});}';

    let ifquery = '';


    for (const key in this.formCheckBox) {
      if (this.formCheckBox.hasOwnProperty(key)) {
        const element2 = this.formCheckBox[key];
        if(element2.value && key != 'universidad'){

          if(this.formSelect[key].value.length != 0){
            seleccion = true;

            ifquery += '(';

            for (let i = 0; i < this.formSelect[key].value.length; i++) {
              const element3 = this.formSelect[key].value[i];

              if(i == this.formSelect[key].value.length-1){

                if(key == 'facultad'){
                  ifquery += 'element["'+arr[key]+'"].'+element3+' == true)';
                }else if(key=='departamento'){
                  if(this.formSelect['escuela'].value.length != 0){
                    ifquery += '(element["'+arr[key]+'"]["'+element3.facul+'"] == null ? false: element["'+arr[key]+'"]["'+element3.facul+'"]["'+element3.id+'"]) == true';
                  } else {
                    ifquery += '(element["'+arr[key]+'"]["'+element3.facul+'"] == null ? false: element["'+arr[key]+'"]["'+element3.facul+'"]["'+element3.id+'"]) == true)';
                  }

                }else if(key =="escuela"){
                  if(this.formSelect['departamento'].value.length != 0){
                    ifquery += '(element["'+arr[key]+'"]["'+element3.facul+'"] == null ? false: element["'+arr[key]+'"]["'+element3.facul+'"]["'+element3.id+'"]) == true))';
                  }else{
                    ifquery += '(element["'+arr[key]+'"]["'+element3.facul+'"] == null ? false: element["'+arr[key]+'"]["'+element3.facul+'"]["'+element3.id+'"]) == true)';
                  }

                }else{
                  ifquery += 'element["'+arr[key]+'"] == "'+element3+'")';
                }

              }else{
                if(key == 'facultad'){
                  ifquery += 'element["'+arr[key]+'"].'+element3+' == true || ';

                }else if(key=='departamento' || key =="escuela"){

                  ifquery += '(element["'+arr[key]+'"]["'+element3.facul+'"] == null ? false: element["'+arr[key]+'"]["'+element3.facul+'"]["'+element3.id+'"]) == true || ';
                }else{
                  ifquery += 'element["'+arr[key]+'"] == "'+element3+'" || ';
                }

              }
            }


            if(key != 'departamento'){
              ifquery += ' && ';
            } else {
              ifquery += ' || '
            }

            }
          }


        }

      }

      ifquery = ifquery.substr(0,ifquery.length-4);

      ifquery = inicio+ifquery+fin;
      console.log(ifquery);


    this.buscaLaboratorios().then(datos=>{

      datos.forEach(doc => {
        const element = doc.data();

        if(this.formCheckBox.universidad.value){
          coincidencias.push({id: element['facilityAdmin']});

        } else {

          if(seleccion){
            eval(ifquery);
          }else{
            swal({
              type: 'error',
              title:  'Por favor ingrese algun filtro primero',
              showConfirmButton: true
            });
          }

      


        }
      });

      console.log(coincidencias);
      let cont = 0;
      coincidencias.forEach(doc => {
        this.buscarDirector(doc.id).then(director => {
          const email = director.data().email;

          notificaciones.push(director.data().user);



          if(cont != coincidencias.length-1){
            correos += email + ','
          } else {
            correos += email
          }

          cont++;

        });
      });

        setTimeout(()=>{
        if(item == 'correo'){
          console.log(correos);
          if(correos.length != 0){
            this.servicioCorreo(correos);
          }
          
        } else {
          console.log(notificaciones);
          if(notificaciones.length != 0){
            this.servicioNotificacion(notificaciones);
          }
         
        }

        if(correos.length != 0 || notificaciones.length != 0){
          this.servicioalmacenarHistorial(item);
        }

      }, 2000);



    });

  
   
  }

  servicioCorreo(correos){

      const url = URLCORREO;

      this.http.post(url,
        {para: correos,
          asunto: this.correo.asunto,
          mensaje: this.correo.mensaje}).subscribe((res) => {
        if(res.status === 200){
          console.log('funco');
          //this.cerrarAlerta();
          this.limpiarDatos();
        } else {
          console.log('fallo al enviar correos');
        }
      });



  }

  servicioNotificacion(notificaciones){

    const obj = {
      asunto:'Correo masivo difusion',
      mensaje:this.notificacion,
      fecha: new Date().toISOString().split('T')[0],
      estado: 'sinver'
    };

    let cont = 0;

    for (let i = 0; i < notificaciones.length; i++) {
      const element = notificaciones[i];

      this.enviarNotificacion(element, obj).then(()=>{
       
        if(cont == notificaciones.length-1){
          this.limpiarDatos();

        }else{
          cont++;
        }

      });

    }

  }

  servicioalmacenarHistorial(tipo){
    const obj = {
      asunto: '',
      mensaje: '',
      type: tipo,
      fecha : new Date().toISOString(),
      email: this.persona.email,
      filtro:this.valoresCheckbox(),
      valores:this.valoresSelect(),
      texto: this.buscaObjectos()
    };

    if(tipo == 'correo'){
      obj.asunto = this.correo.asunto;
      obj.mensaje = this.correo.mensaje;
    } else {
      obj.asunto = 'notificacion'
      obj.mensaje = this.notificacion;
    }
    console.log(obj);
    this.agregarHistorial(obj).then(()=>{
      this.alertaHecho('Exito al enviar');
    });

  }



  editarFiltros(item){
    for (let i = 0; i < this.historialsel.filtro.length; i++) {
      const key = this.historialsel.filtro[i];
      this.formCheckBox[key].setValue(true);

      if(key != 'universidad'){
        this.formSelect[key].enable();
        this.formCheckBox['universidad'].setValue(false);
        if((key == 'escuela') || (key == 'departamento')){
          let valoresform = [];

          this.historialsel.valores[key].forEach(element => {

            const objenc = this.listSelect[key].find(o => o.id == element.id);

            valoresform.push(objenc);
          });

          this.formSelect[key].setValue(valoresform);

        }else{
          this.formSelect[key].setValue(this.historialsel.valores[key]);
        }
      }
    }

    if(item == 'reenviar'){
      this.notificacion = this.historialsel.mensaje;
      this.correo.asunto = this.historialsel.asunto;
      this.correo.mensaje = this.historialsel.mensaje;
      this.enviarCorreoNotificacion(this.historialsel.type);
    } else {
      $('#modal1').modal('hide');
      $('select').prop('disabled', false);
      if(this.historialsel.type == 'correo'){
        this.correo.asunto = this.historialsel.asunto;
        this.correo.mensaje = this.historialsel.mensaje;
        console.log(this.correo);
        $('.nav-tabs a[href="#home"]').tab('show');
      } else {
        this.notificacion = this.historialsel.mensaje;
        $('.nav-tabs a[href="#menu1"]').tab('show');
      }
    }
  }

  buscaObjectos(){
    let texto = {};
    for (const clave in this.formCheckBox) {

      const auxiliar = [];
      if (this.formCheckBox.hasOwnProperty(clave)) {
        const element = this.formCheckBox[clave].value;

        if(element){

          if(clave == 'universidad'){
            texto[clave] = 'Toda la universidad';
          } else {
            const array = this.listSelect[clave];
            const array2 = this.formSelect[clave].value;

            for (let i = 0; i < array2.length; i++) {
              let element = array2[i];
              if((clave == 'departamento')||(clave == 'escuela')){
                element = array2[i].id;
              }
              const enc = array.find(o => o.id == element);
              if(enc){
                auxiliar.push(enc.nombre);
              }

            }

            texto[clave] = auxiliar;
          }


        }
      }
    }
    return texto;
  }

  valoresSelect(){
    const valores = {};
    for (const clave in this.formCheckBox) {
      if (this.formCheckBox.hasOwnProperty(clave)) {
        const element = this.formCheckBox[clave].value;

        if(element){
          if(clave == 'universidad'){
            valores[clave] = 'universidad';
          }else{

            valores[clave] = this.formSelect[clave].value;

          }

        }
      }
    }

    return valores;
  }

  valoresCheckbox(){
    const valores = [];
    for (const clave in this.formCheckBox) {
      if (this.formCheckBox.hasOwnProperty(clave)) {
        const element = this.formCheckBox[clave].value;

        if(element){
          valores.push(clave);
        }
      }
    }

    return valores;
  }

  cambiarDataHistorial(item){
    console.log(item);
    this.historialsel = item;

    setTimeout(()=>{
      $("#mensajeHtml").html(this.historialsel.mensaje);
    }, 1000);


  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  limpiarDatos(){

    this.listSelect.sede = [];
    this.listSelect.subsede = [];
    this.listSelect.facultad = [];
    this.listSelect.departamento = [];
    this.listSelect.escuela = [];
    this.estructurarSedes();
    this.estructurarTodasSubSedes();
    this.estructurarFacultades();

    this.formSelect.sede.setValue([]);
    this.formSelect.subsede.setValue([]);
    this.formSelect.facultad.setValue([]);
    this.formSelect.departamento.setValue([]);
    this.formSelect.escuela.setValue([]);

    this.formCheckBox.sede.setValue(false);
    this.formCheckBox.subsede.setValue(false);
    this.formCheckBox.facultad.setValue(false);
    this.formCheckBox.departamento.setValue(false);
    this.formCheckBox.escuela.setValue(false);
    


    this.correo = {
      asunto:'',
      mensaje:''
    };

    this.notificacion = '';

  }

  alertaCargando(){
    swal({
      title: 'Cargando un momento...',
      text: 'espere mientras se procesa la transaccion',
      onOpen: () => {
        swal.showLoading();
      }
    });
  }

  alertaHecho(mensaje){
    swal({
      type: 'success',
      title:  mensaje,
      showConfirmButton: true
    });
  }


   // METODO QUE TRAE UN DIRECTOR ESPECIFICO DEPENDIENDO EL ID-DIRECTOR
  buscarDirector(iddirector) {
    return this.afs.doc('cfPers/' + iddirector).ref.get();
  }

  agregarHistorial(obj){
    return this.afs.collection('cfMailNotification').add(obj);
  }

  consultarNotificaciones(iduser){
    return this.afs.doc('user/'+iduser).ref.get();
  }

  enviarNotificacion(iduser, object){
    return this.afs.doc('user/'+iduser).collection('notification').add(object);
  }

  buscaSede(){
    return  this.afs.collection('headquarter').ref.get();
  }

  buscaSubSede(keysede){
    const col = this.afs.collection('cfPAddr');
    const ref = col.ref.where('headquarter','==',keysede);
    return  ref.get();
  }

  buscaTodasSubSede(){
    return  this.afs.collection('cfPAddr').ref.get();
  }

  buscaFacultad(keyfacul){
    return this.afs.doc('faculty/'+keyfacul).ref.get();
  }
  buscaTodasFacultades(){
    return  this.afs.collection('faculty').ref.get();
  }

  buscaFacultadWitSede(keysede){
    const col = this.afs.collection('faculty');
    const ref = col.ref.where('subHq.'+keysede, '==', true);
    return  ref.get();
  }

  buscaDepartamento(keyfacultad){
    return  this.afs.doc('faculty/'+keyfacultad).collection('departments').ref.get();
  }

  buscaLaboratorios(){
   return this.afs.collection('cfFacil').ref.get();
  }


  consultarHistorial(){
    return this.afs.collection('cfMailNotification').valueChanges();
  }

  removeDuplicates(originalArray, prop) {
    var newArray = [];
    var lookupObject  = {};

    for(var i in originalArray) {
       lookupObject[originalArray[i][prop]] = originalArray[i];
    }

    for(i in lookupObject) {
        newArray.push(lookupObject[i]);
    }
     return newArray;
  }


  prueba(){
    return this.afs.collection('cfFacil',
     ref => ref.where('headquarter','==','Vp0lIaYQJ8RGSEBwckdi').where('headquarter','==','hola'))
  }
}
