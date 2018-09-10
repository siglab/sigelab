import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Http } from '@angular/http';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';

declare var $: any;

import swal from 'sweetalert2';
import { FormControl } from '@angular/forms';

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

  toppings = new FormControl();
  toppingList = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];

  disableSelect = new FormControl(false);

  constructor(private afs:AngularFirestore, private http:Http) {
   

  
  }

  ngOnInit() {

    this.persona = JSON.parse(localStorage.getItem('usuario'));


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

    this.buscaSede().subscribe(datos=>{
      for (let i = 0; i < datos.length; i++) {
        const sede = datos[i].payload.doc.data();
        this.listSelect.sede.push({
          id:datos[i].payload.doc.id, 
          nombre: sede.cfName
        });        
      }
    });

    
  }

  estructurarTodasSubSedes(){
    this.buscaTodasSubSede().subscribe(datos=>{
      for (let i = 0; i < datos.length; i++) {
        const sede = datos[i].payload.doc.data();
        this.listSelect.subsede.push({
          id:datos[i].payload.doc.id, 
          nombre: sede.cfAddrline1 + ' - ' + sede.cfCityTown
        });        
      }
    });
  }

  estructurarSubSedes(sedes){
    this.listSelect.subsede = [];

      for (let i = 0; i < this.listSelect.sede.length; i++) {
        const element = this.listSelect.sede[i];
  
        this.buscaSubSede(element.id).subscribe(datos=>{
          for (let i = 0; i < datos.length; i++) {
            const sede = datos[i].payload.doc.data();
            this.listSelect.subsede.push({
              id:datos[i].payload.doc.id, 
              nombre: sede.cfAddrline1 + ' - ' + sede.cfCityTown
            });        
          }
        });
      }
      
      for (let j = 0; j < this.listSelect.subsede.length; j++) {
        const element = this.listSelect.subsede[j];
        this.estructurarFacultadesWitSede(element.id);
      }
      
    
  }

  estructurarFacultades(){
    this.listSelect.facultad = [];
    this.buscaTodasFacultades().subscribe(datos=>{
      for (let i = 0; i < datos.length; i++) {
        const facultad = datos[i].payload.doc.data();     
        this.listSelect.facultad.push({
          id:datos[i].payload.doc.id, 
          nombre: facultad.facultyName
        });

        this.estructurarDeparamentos(datos[i].payload.doc.id);
      }
    });
  }

  estructurarFacultadesWitSede(keysede){
    this.listSelect.facultad = [];
    this.buscaFacultadWitSede(keysede).subscribe(datos=>{
      
      
      for (let i = 0; i < datos.length; i++) {
        const facultad = datos[i].payload.doc.data(); 
        this.listSelect.facultad.push({
          id:datos[i].payload.doc.id, 
          nombre: facultad.facultyName
        });

        this.estructurarDeparamentos(datos[i].payload.doc.id);
    
      }
     
    });
  }


  estructurarDeparamentos(keyfacul){
    this.listSelect.departamento = [];
    this.listSelect.escuela = [];
    this.buscaDepartamento(keyfacul)
    .subscribe(departamento => {
      for (let j = 0; j < departamento.length; j++) {

        const element = departamento[j].payload.doc.data();

        if(element.type == 'department'){
  
          this.listSelect.departamento.push({
            id: departamento[j].payload.doc.id, 
            nombre: element.departmentName,
            facul: keyfacul
          });
  
        } else {
  
        this.listSelect.escuela.push({
          id: departamento[j].payload.doc.id, 
          nombre: element.departmentName,
          facul: keyfacul
        });
  
        }
      }

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
            ifquery += '(';

            for (let i = 0; i < this.formSelect[key].value.length; i++) {
              const element3 = this.formSelect[key].value[i];
                            
              if(i == this.formSelect[key].value.length-1){
  
                if(key == 'facultad'){
                  ifquery += 'element["'+arr[key]+'"].'+element3+' == true)';
                }else if(key=='departamento' || key =="escuela"){
        
                  ifquery += '(element["'+arr[key]+'"]["'+element3.facul+'"] == null ? false: element["'+arr[key]+'"]["'+element3.facul+'"]["'+element3.id+'"]) == true)';
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
            if((key != 'departamento') && (key != 'escuela')){
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

         eval(ifquery);

          // setTimeout(()=>{
          //   const dupli = this.removeDuplicates(coincidencias,'id');
          //   console.log(coincidencias);
          //   console.log(dupli);
            
          // }, 4000);
    
            
        }
      });

      console.log(coincidencias);
    

    });
  

    // this.buscaLaboratorios(query).subscribe(datos => {

    //   console.log(datos);
    //   const sinduplicado = this.removeDuplicates(datos,'facilityAdmin');
    //   console.log(sinduplicado);
    //   for (let i = 0; i < sinduplicado.length; i++) {
    //     const element = sinduplicado[i].facilityAdmin;

    //     this.buscarDirector(element).subscribe(director => {
    //       const email = director.payload.data().email;

    //       notificaciones.push(director.payload.data().user);

    //       if(i != sinduplicado.length-1){
    //         correos += email + ','
    //       } else {
    //         correos += email
    //       }
         
    //     });
       
    //   }
    //   setTimeout(()=>{
    //     if(item == 'correo'){
    //       console.log(correos);
    //       //this.servicioCorreo(correos);
    //     } else {
    //       console.log(notificaciones);
    //       this.servicioNotificacion(notificaciones);
    //     }
       
    //   }, 2000);
      
    // });

    //this.servicioalmacenarHistorial(item);
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
      filtro:this.formCheckBox.toString(),
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
    this.formCheckBox = eval(this.historialsel.filtro);
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
    for (const clave in this.formCheckBox) {
      if (this.formCheckBox.hasOwnProperty(clave)) {
        const element = this.formCheckBox[clave].value;

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
    this.listSelect.sede = [];
    this.listSelect.subsede = [];
    this.listSelect.facultad = [];
    this.listSelect.departamento = [];
    this.listSelect.escuela = [];
    this.estructurarSedes();
    this.estructurarFacultades();
    $('select').prop('disabled', true);
    $('input[type="checkbox"]').prop('checked', false);
    $('input[type="checkbox"]').prop('disabled', false);
    

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
    return  this.afs.collection('headquarter').snapshotChanges();
  }

  buscaSubSede(keysede){
    return  this.afs.collection('cfPAddr', 
                ref=>ref.where('headquarter','==',keysede)).snapshotChanges();
  }

  buscaTodasSubSede(){
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
