import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Http } from '@angular/http';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';

declare var $: any;

import swal from 'sweetalert2';

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


  sedes = [];
  facultads = [];
  departamentos = [];
  escuelas = [];

  checkBox = {
    universidad:false,
    sede:false,
    facultad:false,
    departamento:false,
    escuela:false
  };

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



  constructor(private afs:AngularFirestore, private http:Http) {
   
  }

  ngOnInit() {

    this.persona = JSON.parse(localStorage.getItem('usuario'));


    this.estructurarSedes();
    this.estructurarFacultades();
  
    $('select').prop('disabled', true);

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

    this.buscaSede().subscribe(datos=>{
      for (let i = 0; i < datos.length; i++) {
        const sede = datos[i].payload.doc.data();
        this.sedes.push({
          id:datos[i].payload.doc.id, 
          nombre: sede.cfAddrline1 + ' - ' + sede.cfCityTown
        });        
      }
    });

    
  }

  estructurarFacultades(){
    this.facultads = [];
    this.buscaTodasFacultades().subscribe(datos=>{
      for (let i = 0; i < datos.length; i++) {
        const facultad = datos[i].payload.doc.data();     
        this.facultads.push({
          id:datos[i].payload.doc.id, 
          nombre: facultad.facultyName
        });

        this.estructurarDeparamentos(datos[i].payload.doc.id);
      }
    });
  }

  estructurarFacultadesWitSede(keysede){
    this.facultads = [];
    this.buscaFacultadWitSede(keysede).subscribe(datos=>{
      
      
      for (let i = 0; i < datos.length; i++) {
        const facultad = datos[i].payload.doc.data(); 
        this.facultads.push({
          id:datos[i].payload.doc.id, 
          nombre: facultad.facultyName
        });

        this.estructurarDeparamentos(datos[i].payload.doc.id);
    
      }
     
    });
  }


  estructurarDeparamentos(keyfacul){
   this.departamentos = [];
   this.escuelas = [];
    this.buscaDepartamento(keyfacul)
    .subscribe(departamento => {
      for (let j = 0; j < departamento.length; j++) {

        const element = departamento[j].payload.doc.data();

        if(element.type == 'department'){
  
          this.departamentos.push({
            id: departamento[j].payload.doc.id, 
            nombre: element.departmentName
          });
  
        } else {
  
        this.escuelas.push({
          id: departamento[j].payload.doc.id, 
          nombre: element.departmentName
        });
  
        }
      }

    });    
     
  }



  aplicarFiltro(item, filtro){
    console.log(item, filtro);
    this.objsel[filtro] = item;
    console.log(this.objsel);
    if(filtro == "sede"){
      this.estructurarFacultadesWitSede(this.objsel.sede);
    } else if(filtro == "facultad"){
      this.estructurarDeparamentos(this.objsel.facultad);
    }
   
  }

  controlChecks(item){
    const arr = ['sede','facultad','departamento', 'escuela'];
    console.log(item,this.checkBox);
    if(item == 'universidad'){
      if(this.checkBox[item]){
        for (let i = 0; i < arr.length; i++) {      
          $('#'+arr[i]).prop('disabled', true);
        }
        $('select').prop('disabled', true);
      } else {
        for (let i = 0; i < arr.length; i++) {      
          $('#'+arr[i]).prop('disabled', false);
        }
      }

    } else {
      if(this.checkBox[item]){
        $('#variatio'+item).prop('disabled', false);

        if(item == 'departamento'){

          $('#escuela').prop('disabled', true);
          $('#variatioescuela').prop('disabled', true);

        } else if (item == 'escuela'){
          $('#departamento').prop('disabled', true);
          $('#variatiodepartamento').prop('disabled', true);
        }
       
     
      }else{
        $('#variatio'+item).prop('disabled', true);
        if(item == 'departamento'){

          $('#escuela').prop('disabled', false);

        } else if (item == 'escuela'){
          $('#departamento').prop('disabled', false);

        }
      }
    }
   
  }

  cambiarNumeroCaracteres(value){
    this.caracteres = 140;
    this.caracteres -= value.length;
  }


  enviarCorreoNotificacion(item){

    this.alertaCargando();

    let query = '';

    let correos = '';
    let notificaciones = [];

    const inicio = "this.afs.collection('cfFacil'";
    const final = ").valueChanges();";
    const ref = ", ref=>ref";

    const objQuery = {
      sede : ".where('subHq', '==', '"+this.objsel.sede+"')",
      facultad : ".where('faculties."+this.objsel.facultad+"','==',true)",
      departamento : ".where('departments."+this.objsel.facultad+"."+this.objsel.departamento+"','==', true)",
      escuela : ".where('departments."+this.objsel.facultad+"."+this.objsel.escuela+"','==', true)"
    }
   
    if(this.checkBox.universidad){
      query = inicio + final;    
    } else {
      query = inicio+ref;
      for (const key in this.checkBox) {
        if (this.checkBox.hasOwnProperty(key)) {
          const element = this.checkBox[key];
          if(element){         
           query += objQuery[key];                   
          }         
        }
      }
      query += final;     
    }

    this.buscaLaboratorios(query).subscribe(datos => {

      console.log(datos);
      const sinduplicado = this.removeDuplicates(datos,'facilityAdmin');
      console.log(sinduplicado);
      for (let i = 0; i < sinduplicado.length; i++) {
        const element = sinduplicado[i].facilityAdmin;

        this.buscarDirector(element).subscribe(director => {
          const email = director.payload.data().email;

          notificaciones.push(director.payload.data().user);

          if(i != sinduplicado.length-1){
            correos += email + ','
          } else {
            correos += email
          }
         
        });
       
      }
      setTimeout(()=>{
        if(item == 'correo'){
          console.log(correos);
          //this.servicioCorreo(correos);
        } else {
          console.log(notificaciones);
          this.servicioNotificacion(notificaciones);
        }
       
      }, 2000);
      
    });

    this.servicioalmacenarHistorial(item);
  }

  servicioCorreo(correos){

      const url = 'https://us-central1-develop-univalle.cloudfunctions.net/enviarCorreo';
      
      this.http.post(url,
        {para: correos, 
          asunto: this.correo.asunto, 
          mensaje: this.correo.mensaje}).subscribe((res) => {
        if(res.status == 200){
          //this.cerrarAlerta();
          this.limpiarDatos();
        } else {
          console.log('fallo al enviar correos');
        }
      });
  
   
    
  }

  servicioNotificacion(notificaciones){

    const obj = {
      mensaje:this.notificacion, 
      fecha: new Date().toISOString(),
      estado: 'sinver'
    };

    let cont = 0;

    for (let i = 0; i < notificaciones.length; i++) {
      const element = notificaciones[i];

      this.enviarNotificacion(element, obj).then(()=>{
        cont++;
        if(cont == notificaciones.length-1){
          this.limpiarDatos();
          
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
      filtro:this.checkBox,
      valores:this.objsel,
      texto: this.buscaObjectos()
    };

    if(tipo == 'correo'){
      obj.asunto = this.correo.asunto;
      obj.mensaje = this.correo.mensaje;
    } else {
      obj.mensaje = this.notificacion;
    }
    console.log(obj);
    this.agregarHistorial(obj).then(()=>{
      console.log('se agrego hsitorial');
      this.alertaHecho(tipo+' enviado');
    });

  }

  editarFiltros(item){
    console.log(item);
    this.checkBox = this.historialsel.filtro;
    this.objsel = this.historialsel.valores;
  
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
    let texto = [];
    for (const clave in this.checkBox) {
      if (this.checkBox.hasOwnProperty(clave)) {
        const element = this.checkBox[clave];

        if(element){
          if(clave == 'universidad'){
            texto.push({key:'universidad', nombre:'universidad'});
          } else {
            const array = eval('this.'+clave+'s');

            for (let i = 0; i < array.length; i++) {
              const element2 = array[i];
              if(this.objsel[clave] == element2.id){
                texto.push({key:clave, nombre:element2.nombre});
              }
            }
          }      
        }   
      }
    }
    return texto;
  }

  cambiarDataHistorial(item){
    console.log(item);
    this.historialsel = item;
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  limpiarDatos(){
    this.sedes = [];
    this.facultads = [];
    this.departamentos = [];
    this.escuelas = [];
    this.estructurarSedes();
    this.estructurarFacultades();
    $('select').prop('disabled', true);
    $('input[type="checkbox"]').prop('checked', false);
    $('input[type="checkbox"]').prop('disabled', false);
    this.checkBox = {
      universidad:false,
      sede:false,
      facultad:false,
      departamento:false,
      escuela:false
    };

    this.objsel = {
      sede:'inicial',
      facultad:'inicial',
      departamento:'inicial',
      escuela:'inicial'
    };

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
    return this.afs.doc('cfPers/' + iddirector).snapshotChanges();
  }

  agregarHistorial(obj){
    return this.afs.collection('cfMailNotification').add(obj);
  }

  consultarNotificaciones(iduser){
    return this.afs.doc('user/'+iduser).valueChanges();
  }

  enviarNotificacion(iduser, object){
    return this.afs.doc('user/'+iduser).collection('notification').add(object);
  }

  buscaSede(){
    return  this.afs.collection('cfPAddr').snapshotChanges();
  }

  buscaFacultad(keyfacul){
    return this.afs.doc('faculty/'+keyfacul).snapshotChanges();
  }
  buscaTodasFacultades(){
    return  this.afs.collection('faculty').snapshotChanges();
  }

  buscaFacultadWitSede(keysede){
    return  this.afs.collection('faculty', ref=>ref.where('subHq.'+keysede, '==', true)).snapshotChanges();
  }
 
  buscaDepartamento(keyfacultad){
    return  this.afs.doc('faculty/'+keyfacultad).collection('departments').snapshotChanges();
  }

  buscaLaboratorios(query){
   return eval(query);
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
}
