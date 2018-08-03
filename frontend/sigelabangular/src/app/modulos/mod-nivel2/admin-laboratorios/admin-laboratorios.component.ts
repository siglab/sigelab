import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { AngularFirestore } from 'angularfire2/firestore';
import { ObservablesService } from './../../../shared/services/observables.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import swal from 'sweetalert2';
import { AngularFireStorage } from 'angularfire2/storage';
import { Subscription } from 'rxjs';

declare var $: any;

@Component({
  selector: 'app-admin-laboratorios',
  templateUrl: './admin-laboratorios.component.html',
  styleUrls: ['./admin-laboratorios.component.css']
})
export class AdminLaboratoriosComponent implements OnInit, OnDestroy {


  itemsel: Observable<Array<any>>;

  tablesel = '';

  seleccionado: any;

    // INICIALIZACION DATATABLE EQUIPOS
    displayedColumnsEquipos = ['nombre'];
    dataSourceEquipos = new MatTableDataSource([]);
    @ViewChild('paginatorEquipos') paginatorEquipos: MatPaginator;
    @ViewChild('sortEquipos') sortEquipos: MatSort;

    // INICIALIZACION DATATABLE PERSONAL
    displayedColumnsPersonal = ['nombre'];
    dataSourcePersonal = new MatTableDataSource([]);
    @ViewChild('paginatorPersonal') paginatorPersonal: MatPaginator;
    @ViewChild('sortPersonal') sortPersonal: MatSort;

    // INICIALIZACION DATATABLE SERVICIOS
    displayedColumnsServicios = ['nombre'];
    dataSourceServicios = new MatTableDataSource([]);
    @ViewChild('paginatorServicios') paginatorServicios: MatPaginator;
    @ViewChild('sortServicios') sortServicios: MatSort;

    // INICIALIZACION DATATABLE PROYECTOS
    displayedColumnsProyectos = ['nombre'];
    dataSourceProyectos = new MatTableDataSource([]);
    @ViewChild('paginatorProyectos') paginatorProyectos: MatPaginator;
    @ViewChild('sortProyectos') sortProyectos: MatSort;

    // INICIALIZACION DATATABLE EQUIPOS
    displayedColumnsPracticas = ['nombre'];
    dataSourcePracticas = new MatTableDataSource([]);
    @ViewChild('paginatorPracticas') paginatorPracticas: MatPaginator;
    @ViewChild('sortPracticas') sortPracticas: MatSort;

    // INICIALIZACION DATATABLE SOLICITUDES
    displayedColumnsSolicitudes = ['nombre', 'email'];
    dataSourceSolicitudes = new MatTableDataSource([]);
    @ViewChild('paginatorSolicitudes') paginatorSolicitudes: MatPaginator;
    @ViewChild('sortSolicitudes') sortSolicitudes: MatSort;


    user:any;

    labestructurado:any;

    infolab = {
      facilityAdmin:'',
      otros: {
        direccion: '',
        email: '',
        telefono: ''
      }    
    };

   
    checks = {};

    cambios = [];

    sugerencia:any;

    encargado = '';

    moduloNivel2 = false;
    moduloPermiso = false;
    rol: any;


    iconos = {
      info:false,
      equipos:false,
      personal:false,
      espacio:false,
      espacioaso:false,
      servicio:false,
      proyecto:false,
      practica:false,
      solicitud:false
    };

    espaciosel:any;
    plano:Observable<any>;

    sus: Subscription;

  constructor(private obs: ObservablesService, private afs: AngularFirestore, private storage: AngularFireStorage) {
  }

  ngOnInit() {

    this.getUserId();
    this.getRoles();

    this.sus = this.obs.currentObjectLab.subscribe(data => {

      console.log(data);
      console.log(this.labestructurado);

      this.labestructurado = undefined;
      this.itemsel = Observable.of(this.labestructurado);
      if(data.length != 0){
        swal({
          title: 'Cargando un momento...',
          text: 'espere mientras se cargan los datos',
          onOpen: () => {
            swal.showLoading();
          }
        });

        if(!this.labestructurado){
          this.estructurarLab(data.uid).then(() => {
            this.itemsel = Observable.of(this.labestructurado);
            this.limpiarData();
            const ambiente = this;
            console.log(this.labestructurado);
          
            if(this.labestructurado){
                this.dataSourceEquipos.data = this.labestructurado.equipos;
                  
                this.dataSourcePersonal.data = this.labestructurado.personal;
        
                this.dataSourceServicios.data = this.labestructurado.servicios;
        
                this.dataSourceProyectos.data = this.labestructurado.proyectos;
        
                this.dataSourcePracticas.data = this.labestructurado.practicas;
        
                this.dataSourceSolicitudes.data = this.labestructurado.solicitudes;
  
                setTimeout(function() {
      
                  ambiente.dataSourceEquipos.sort = ambiente.sortEquipos;
                  ambiente.dataSourceEquipos.paginator = ambiente.paginatorEquipos;
          
                  ambiente.dataSourcePersonal.sort = ambiente.sortPersonal;
                  ambiente.dataSourcePersonal.paginator = ambiente.paginatorPersonal;
          
                  ambiente.dataSourceServicios.sort = ambiente.sortServicios;
                  ambiente.dataSourceServicios.paginator = ambiente.paginatorServicios;
          
                  ambiente.dataSourceProyectos.sort = ambiente.sortProyectos;
                  ambiente.dataSourceProyectos.paginator = ambiente.paginatorProyectos;
          
                  ambiente.dataSourcePracticas.sort = ambiente.sortPracticas;
                  ambiente.dataSourcePracticas.paginator = ambiente.paginatorPracticas;
          
                  ambiente.dataSourceSolicitudes.sort = ambiente.sortSolicitudes;
                  ambiente.dataSourceSolicitudes.paginator = ambiente.paginatorSolicitudes;
          
                  swal.close();
  
                }, 1500);
  
               
            }    
    
          });
        } else {
          swal.close();
        }
     
      }

    });
  }

  ngOnDestroy(){
    this.sus.unsubscribe();
 
  }

  cambiardata(item, table) {
    this.tablesel = table;
    this.seleccionado = item;
  }

  addEquipo() {
    const eq = {
     cfOrgUnit: '',
     ciNumber: '87696898',
     projectDesc: 'proyecto que busca la geomatizacion de zonas urbanas de cali',
     projectName: 'PROYECTO CARTOGRAPHER',
     relatedFacilities: {cfFacilId: true},
     relaedPers: {cfPersId: true}
    };

    this.afs.collection('project').add(eq);
  }


  estructurarLab(key){
    this.labestructurado = {};
   let promise = new Promise((resolve,reject)=>{
    this.buscarLab(key).subscribe(labo => {
      const laboratorio = labo.payload.data();
      console.log(laboratorio);
      this.buscarDirector(laboratorio.facilityAdmin).subscribe(dueno => {
        const duenoLab = dueno.payload.data();
        if (duenoLab) {

              // convertir boolean a cadena de caracteres para estado del laboratorio
            let estadoLab;
              if (laboratorio.active === true) {
              estadoLab = 'Activo';
              } else if ( laboratorio.active === false ) {
              estadoLab = 'Inactivo';
              }
            this.labestructurado = {
              uid: labo.payload.id,
              nombre: this.ajustarTexto(laboratorio.cfName),
              escuela: laboratorio.knowledgeArea,
              inves: laboratorio.researchGroup,
              director: duenoLab.cfFirstNames + ' ' + duenoLab.cfFamilyNames,
              iddueno: laboratorio.facilityAdmin,
              espacioPrin: this.buscarEspacio(laboratorio.mainSpace),
              info: {dir: laboratorio.otros.direccion, tel: laboratorio.otros.telefono, cel: '', email: laboratorio.otros.email},
              servicios: this.estructurarServicios(laboratorio.relatedServices).arr,
              practicas: this.estructurarPracticas(laboratorio.relatedPractices),
              equipos: this.estructurarEquipos(laboratorio.relatedEquipments),
              personal: this.estructurarPersonas(laboratorio.relatedPers),
              proyectos: this.estructurarProyectos(laboratorio.relatedProjects),
              solicitudes: this.estructurarServicios(laboratorio.relatedServices).arr2,
              espacios: this.estructurarSpace(laboratorio.relatedSpaces, laboratorio.mainSpace),
              cambios: laboratorio.suggestedChanges,
              estado: estadoLab
            };

            this.cambios = this.pendientes(laboratorio.suggestedChanges);

            if(this.labestructurado){
              resolve();
            } else {
              reject();
            }
           

     

        }
      });

    })
   });

   return promise;

  }



  // METODO QUE TRAE UN DIRECTOR ESPECIFICO DEPENDIENDO EL ID-DIRECTOR
  buscarLab(idlab) {
    return this.afs.doc('cfFacil/' + idlab).snapshotChanges();

  }

  // METODO QUE TRAE UN DIRECTOR ESPECIFICO DEPENDIENDO EL ID-DIRECTOR
  buscarDirector(iddirector) {
    return this.afs.doc('cfPers/' + iddirector).snapshotChanges();

  }

  // METODO QUE TRAE UN ESPACIO ESPECIFICO DEPENDIENDO EL ID-ESPACIO
  buscarEspacio(idespacio) {
    let arr = [];
    for (let i = 0; i < 1; i++) {
      if(idespacio){
        this.afs.doc('space/' + idespacio).snapshotChanges().subscribe(data=>{
          console.log(data);
         arr.push(data.payload.data());
        });
      }      
    }
    
    return arr;;
   
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
            const serv = {
              nombre: servicio.cfName,
              descripcion: servicio.cfDesc,
              precio: servicio.cfPrice,
              activo: servicio.active,
              variaciones: this.variations(clave),
              uid: data.payload.id
             };
             arr.push(serv);

            this.afs.collection<any>('cfSrvReserv',
            ref => ref.where('cfSrv', '==', clave).where('status', '==', 'pendiente'))
            .snapshotChanges().subscribe(dataSol => {

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


    // METODO QUE ESTRUCTURA LA DATA DE LAS PRACTICAS EN LA VISTA BUSQUEDA DE LABORATORIOS
  // RECIBE EL NODO DE LABORATORIO QUE CONTIENE LAS PRACTICAS ASOCIADOS
  estructurarPersonas(item) {

    const arr = [];

    for (const clave in item) {
      // Controlando que json realmente tenga esa propiedad
      if (item.hasOwnProperty(clave)) {

        if (item[clave]) {
           this.afs.doc('cfPers/' + clave).snapshotChanges().subscribe(data => {
            const pers =  data.payload.data();
            let persona = {};
            if(pers.user){
              this.afs.doc('user/' + pers.user).snapshotChanges().subscribe(dataper => {
                // funciona con una programacion, cuando hayan mas toca crear otro metodo
                if(dataper.payload.data()){

                  persona = {
                    id: clave,
                    nombre: pers.cfFirstNames + ' ' + pers.cfFamilyNames,
                    activo: pers.active,
                    email: dataper.payload.data().email,
                    idpers: clave,
                    iduser: pers.user
                  };
    
                  arr.push(persona);
                } else {

                  persona = {
                    id: clave,
                    nombre: pers.cfFirstNames + ' ' + pers.cfFamilyNames,
                    activo: pers.active,
                    email: '',
                    idpers: clave,
                    iduser: ''
                  };
                  arr.push(persona);
    
                }
              
              });
            }

           });
        }

      }
    }

    return arr;
  }


    // METODO QUE ESTRUCTURA LA DATA DE LAS PRACTICAS EN LA VISTA BUSQUEDA DE LABORATORIOS
  // RECIBE EL NODO DE LABORATORIO QUE CONTIENE LAS PRACTICAS ASOCIADOS
  estructurarProyectos(item) {

    const arr = [];

    for (const clave in item) {
      // Controlando que json realmente tenga esa propiedad
      if (item.hasOwnProperty(clave)) {

        if (item[clave]) {
           this.afs.doc('project/' + clave).snapshotChanges().subscribe(data => {
            const project =  data.payload.data();

              // funciona con una programacion, cuando hayan mas toca crear otro metodo
              const proyecto = {
                nombre: project.projectName,
                descripcion: project.projectDesc,
                id: project.ciNumber
              };

              arr.push(proyecto);

           });
        }

      }
    }

    return arr;
  }

  estructurarSpace(item, keyprincipal) {

    const arr = [];

    for (const clave in item) {
      // Controlando que json realmente tenga esa propiedad
      if (item.hasOwnProperty(clave)) {

        if (item[clave]) {
          this.afs.doc('space/' + clave).snapshotChanges().subscribe(data => {
            const espacio = data.payload.data();

              // funciona con una programacion, cuando hayan mas toca crear otro metodo
              if (espacio) {
                const space = {
                  id_space: data.payload.id,
                  capacity: espacio.capacity,
                  createdAt: espacio.createdAt,
                  freeArea: espacio.freeArea,
                  headquarter: espacio.headquarter,
                  indxSa: espacio.indxSa,
                  map: espacio.map,
                  minArea: espacio.minArea,
                  ocupedArea: espacio.ocupedArea,
                  totalArea: espacio.totalArea,
                  spaceData: espacio.spaceData,

                };

                arr.push(space);
              }

          });
        }

      }
    }

    return arr;
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


  getUserId() {
    this.user = JSON.parse(localStorage.getItem('usuario'));
  }

  getPersonId(userid) {
    return this.afs.doc('user/' + userid).snapshotChanges();
  }

  getPersona(persid) {
    return  this.afs.doc('cfPers/'+persid).snapshotChanges();
  }

  // METODO QUE TRAE LA COLECCION DE TODOS LOS LABORATORIOS
  getLaboratorios(persid) {
    return this.afs.collection<any>('cfFacil',
      ref => ref.where('facilityAdmin', '==', persid)).snapshotChanges();

  }



  // METODO QUE AJUSTA EL NOMBRE DEL LABORATORIO PARA EL SIDEBAR
  ajustarTexto(nombre) {
    const nombreArr = nombre.split(' ');
    let name1 = '';
    let name2 = '';
    for (let i = 0; i < nombreArr.length; i++) {
      if (i < 3) {
        name1 += nombreArr[i] + ' ';
      } else {
        name2 += nombreArr[i] + ' ';
      }
    }

    return {nom1: name1, nom2: name2};
  }

  // METODO QUE ME TRAE EL ROL DE ACCESSO A NIVEL 2
  getRoles() {

    this.rol = JSON.parse(localStorage.getItem('rol'));
    
    for (const clave in this.rol) {
      if (this.rol[clave]) {

        if ((clave === 'moduloNivel2')) {
          this.moduloNivel2 = true;
        }
        if ((clave === 'moduloDosPermiso')) {
          this.moduloPermiso = true;
        }
      }
    }
  }


  editar(){

    if(this.moduloNivel2){
      swal({
        title: 'Cargando un momento...',
        text: 'espere mientras se ejecuta la solicitud',
        onOpen: () => {
          swal.showLoading();
        }
      });
      this.afs.doc('cfFacil/' + this.labestructurado.uid).update(this.infolab).then(data=>{
        //this.obs.changeObjectLab({nombre:this.labestructurado.nombre.nom1 + this.labestructurado.nombre.nom2, uid: this.labestructurado.uid})
       
        swal.close();
        swal({
          type: 'success',
          title: 'Sugerencia de cambios ingresada',
          showConfirmButton: true
        }).then(()=>{
          $('#modal2').modal('hide');
        });

      });
    } else {
      let aux = {
        suggestedChanges: this.labestructurado.cambios
      };

      if(this.estructurarDataCambios().length != 0){

        swal({
          title: 'Cargando un momento...',
          text: 'espere mientras se ejecuta la solicitud',
          onOpen: () => {
            swal.showLoading();
          }
        });

        this.getPersona(JSON.parse(localStorage.getItem('persona')).cfPers).subscribe(person=>{
          console.log(person.payload.data());
          aux.suggestedChanges.push({
            data: this.estructurarDataCambios(),
            uid: this.user.uid,
            nombre: person.payload.data().cfFirstNames + ' ' + person.payload.data().cfFamilyNames,
            estado: 'desaprobado'
          });    
          
          this.afs.doc('cfFacil/' + this.labestructurado.uid).set(aux,{merge:true}).then(()=>{
              swal.close();
              swal({
                type: 'success',
                title: 'Sugerencia de cambios ingresada',
                showConfirmButton: true
              }).then(()=>{
                $('#modal2').modal('hide');
              });
          });
        });

      } else {
        swal({
          type: 'error',
          title: 'No ha sugerido ningun cambio',
          showConfirmButton: true
        });
      }

    }
    
  }

  enviarSugerencia(){

    let cont = 0;
    const cambio = this.infolab;
    for (const key in this.checks) {
      if (this.checks.hasOwnProperty(key)) {
        const element = this.checks[key];
        if(element){
          const aux = this.sugerencia.data[cont].llave.split('.');

          if(aux.length != 2){          
            cambio[aux[0]] = this.sugerencia.data[cont].info;          
          } else {           
            cambio[aux[0]][aux[1]] = this.sugerencia.data[cont].info;
          }
         
        }
        cont++;
      }
    }
   
   
    cambio['suggestedChanges'] =  this.cambiarEstadoSugerencia(this.sugerencia.uid, 'aprobado');


    console.log(cambio);

    this.afs.doc('cfFacil/' + this.labestructurado.uid).update(cambio).then(data=>{
      this.obs.changeObject({nombre:this.labestructurado.nombre.nom1 + this.labestructurado.nombre.nom2, uid: this.labestructurado.uid})
    });


    
  }

  cambiarEstadoSugerencia(uid, estado){
    const cam = this.labestructurado.cambios;
    for (let i = 0; i < cam.length; i++) {
      const element = cam[i];

      if(element.uid == uid){
        element.estado = estado;
        for (let j = 0; j < element.data.length; j++) {
          const element2 = element.data[j];
          
          element2.cambio = this.checks['checkbox'+j];

        }     
      }    
    }
    return cam;
  }

  desaprobarSugerencia(){
    const cambio = {};
    cambio['suggestedChanges'] = this.cambiarEstadoSugerencia(this.sugerencia.uid, 'desaprobado');

    console.log(cambio);
    this.afs.doc('cfFacil/' + this.labestructurado.uid).update(cambio).then(data=>{
      this.obs.changeObject({nombre:this.labestructurado.nombre.nom1 + this.labestructurado.nombre.nom2, uid: this.labestructurado.uid})
    });
  }

  estructurarDataCambios(){
    const aux1 = ['info.dir','info.email','info.tel'];
    const aux2 = ['otros.direccion', 'otros.email', 'otros.telefono'];
    const data = [];
    let element;
    let element2;

    for (let i = 0; i < aux1.length; i++) {

      element = aux1[i].split('.');  
      element2 = aux2[i].split('.');
     

      if(element.length != 2){

        if(this.labestructurado[element] != this.infolab[element2]){
           data.push({llave: aux2[i], nombre: element2[0], info:this.infolab[element2], cambio: false});
        }
      } else {
        
        if(this.labestructurado[element[0]][element[1]] != this.infolab[element2[0]][element2[1]]) {
          data.push({llave: aux2[i], nombre: element2[1], info: this.infolab[element2[0]][element2[1]], cambio: false});
        }

      }
     
      
    }
    console.log(data);
    return data;
  }

  pendientes(item){
   const arr = [];
    for (let j = 0; j < item.length; j++) {
      const element = item[j];

      if(element.estado == 'pendiente'){
        arr.push(element);
      }
      
    }

    return arr;
  }

  cambiarSugerencia(item){

    if(item != 'inicial'){
      this.sugerencia = this.buscarSugerencia(item);
      this.estructurarChecks(this.sugerencia.data);
    } else {
      this.sugerencia = undefined;
    }

  }

  // ESTRUCTURA OBJETO JSON QUE SE ENLAZA A LOS CHECKBOX DE LA VISTA DE MANERA DINAMICA
  estructurarChecks(item){
    this.checks = {};
    for (let i = 0; i < item.length; i++) {
      //const element = condiciones[i];
      this.checks["checkbox"+i] = false;
    }
  }

  // METODO QUE BUSCA LA SUGERENCIA QUE COINCIDE CON EL ID ENVIADO DESDE LA VISTA
  buscarSugerencia(item){
    for (let i = 0; i < this.labestructurado.cambios.length; i++) {
      const element = this.labestructurado.cambios[i];
      if(element.uid == item){
        return element;
      }   
    }
  }

  cambiarEspacioSel(item){
    if(item != 'inicial'){
      this.espaciosel = this.buscarEspacioLocal(item);
      console.log(this.espaciosel);
    } else {
      this.espaciosel = undefined;
    }
  }

  /* este metodo carga la imagen desde firebase con un parametro nombre de la imagen */
  cargarImagen() {

    if (this.espaciosel.map) {  
      swal({
        title: 'Cargando un momento...',
        text: 'espere mientras se cargan los datos',
        onOpen: () => {
          swal.showLoading();
        }
      });  
     const ref = this.storage.ref('planos/' + this.espaciosel.map + '.png');
      this.plano = ref.getDownloadURL();
      if(this.plano){
        swal.close();
      }
    } 

  }

  // METODO QUE BUSCA LA VARIACION QUE COINCIDE CON EL ID ENVIADO DESDE LA VISTA
  buscarEspacioLocal(item){
    for (let i = 0; i < this.labestructurado.espacios.length; i++) {
      const element = this.labestructurado.espacios[i];
      if(element.id_space == item){
        return element;
      }   
    }
  }

  limpiarData(){
    this.seleccionado = 'inicial';
    this.sugerencia = undefined;
    this.infolab.otros.email = this.labestructurado.info.email;
    this.infolab.otros.direccion = this.labestructurado.info.dir;
    this.infolab.otros.telefono = this.labestructurado.info.tel;
    this.infolab.facilityAdmin = this.labestructurado.iddueno;

  }

  cambiarIcono(box){
    if(!this.iconos[box]){
      this.iconos[box] = true;
    } else {
      this.iconos[box] = false;
    }
  }




  // FILTADORES DE LAS TABLAS

  applyFilterEquipos(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSourceEquipos.filter = filterValue;
  }
  applyFilterPersonal(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSourcePersonal.filter = filterValue;
  }
  applyFilterServicios(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSourceServicios.filter = filterValue;
  }
  applyFilterProyectos(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSourceProyectos.filter = filterValue;
  }
  applyFilterPracticas(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSourcePracticas.filter = filterValue;
  }

  applyFilterSolicitudes(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSourceSolicitudes.filter = filterValue;
  }
}
