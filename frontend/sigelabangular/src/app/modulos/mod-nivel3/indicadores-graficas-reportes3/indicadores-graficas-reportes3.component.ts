import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { FormControl } from '@angular/forms';

declare var $: any;

@Component({
  selector: 'app-indicadores-graficas-reportes3',
  templateUrl: './indicadores-graficas-reportes3.component.html',
  styleUrls: ['./indicadores-graficas-reportes3.component.css']
})
export class IndicadoresGraficasReportes3Component implements OnInit {



  //  PROPIEDADES DONA LABORATORIOS
  singleLabs = [];
  viewLabs: any[] = [600, 300];
  tituloLabs = 'Laboratorios Registrados';
  showLegendLabs = false;
  colorSchemeLabs = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };
  showLabelsLabs = true;
  explodeSlicesLabs = false;
  doughnutLabs = false;

  // PROPIEDADES DONA SERVICIOS
  singleServs = [];
  viewServs: any[] = [800, 300];
  tituloServs = 'Servicios Registrados';
  colorSchemeServs = {
    domain: ['#0000FF', '#33FFFF']
  };

  // PROPIEDADES GRAFICO LINEA
  multiLine = [];
  viewLine = [900, 400];
  showXAxis = true;
  showYAxis = true;
  gradientLine = false;
  showLegend = true;
  timeline = true;
  showXAxisLabel = true;
  xAxisLabel = 'Fechas';
  showYAxisLabel = true;
  yAxisLabel = 'Servicios Acivos Año';
  xAxisTickFormatting: Date;
  colorSchemeLine = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };
  // line, area
  autoScale = true;

  // PROPIEDADES GRAFICO VERTICAL

  singleBar = [];

  viewBar: any[] = [950, 400];

  // options
  showXAxisBar = true;
  showYAxisBar = true;
  schemeType = 'linear';
  gradientBar = false;
  showLegendBar = true;
  showXAxisLabelBar = true;
  xAxisLabelBar = 'Actividades';
  showYAxisLabelBar = true;
  yAxisLabelBar = 'Cantidad';

  colorSchemeBar = {
    domain: ['#4e31a5', '#9c25a7']
  };


  indserv = {
    prestados: 0,
    monto: 0
  };


  indprac = {
    pracactivas: 0,
    estudiantes: 0
  };

  indproy = {
    proyactivos: 0,
    estudiantes: 0
  };

  // VARIABLES DE LOS FILTROS

  objsel = {
    sede: 'inicial',
    facultad: 'inicial',
    departamento: 'inicial',
    escuela: 'inicial'
  };



  formCheckBox = {
    universidad: new FormControl({ value: false, disabled: false }),
    sede: new FormControl({ value: false, disabled: false }),
    subsede: new FormControl({ value: false, disabled: false }),
    facultad: new FormControl({ value: false, disabled: false }),
    departamento: new FormControl({ value: false, disabled: false }),
    escuela: new FormControl({ value: false, disabled: false })
  };

  formSelect = {
    sede: new FormControl({ value: '', disabled: true }),
    subsede: new FormControl({ value: '', disabled: true }),
    facultad: new FormControl({ value: '', disabled: true }),
    departamento: new FormControl({ value: '', disabled: true }),
    escuela: new FormControl({ value: '', disabled: true })
  };

  listSelect = {
    sede: [],
    subsede: [],
    facultad: [],
    departamento: [],
    escuela: []
  };


  servicios = [];
  practicas = [];
  proyectos = [];

  arregloBarra = {
    docencia:{ac:0, in:0},
    extension:{ac:0, in:0},
    investigacion:{ac:0, in:0},
    docext:{ac:0, in:0},
    docinv:{ac:0, in:0},
    extinv:{ac:0, in:0},
    doexin:{ac:0, in:0}
  };
  graficoBarras = false;

  role:any;
  moduloNivel3 = false;
  moduloNivel25 = false;

  persona:any;
  faculty:any;
  constructor(private afs: AngularFirestore) {

  }

  ngOnInit() {
    $('html, body').animate({ scrollTop: '0px' }, 'slow');
    this.persona = JSON.parse(localStorage.getItem('persona'));
    this.getRoles();
    this.estructurarSedes();
    this.estructurarTodasSubSedes();
    if(this.moduloNivel3){  
      this.estructurarFacultades();     
    }

    if(this.moduloNivel25){
      this.getFaculty().then(()=>{
        this.estructurarFacultad(this.faculty);

        this.formCheckBox.facultad.setValue(true);
        this.formCheckBox.facultad.disable();
        this.formSelect.facultad.setValue([this.faculty]);
        this.formSelect.facultad.disable();

        this.ejecutarGraficos();
      });
      
    }
   
  }

  getRoles() {

    this.role = JSON.parse(localStorage.getItem('rol'));
    for (const clave in this.role) {
      if (this.role[clave]) {
        if ((clave === 'moduloNivel3')) {
          this.moduloNivel3 = true;
        }

        if ((clave === 'moduloNivel25')) {
          this.moduloNivel25 = true;
        }
      }
    }
  }

  getFaculty(){
    let promise = new Promise((resolve, reject) => {
      this.getPersona(this.persona.cfPers).then(doc => {
        this.faculty = doc.data().faculty;
        resolve();
      });   
    });
    return promise;
  }
  getPersona(persid) {
    return this.afs.doc('cfPers/' + persid).ref.get();
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
          nombre: sede.cfAddrline1 + ' - ' + sede.cfCityTown
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

  estructurarFacultad(id){
    this.listSelect.facultad = [];
    this.buscaFacultad(id).then(doc=>{

      this.listSelect.facultad.push({
        id:doc.id,
        nombre: doc.data().facultyName
      });
       
      this.estructurarDeparamentos(doc.id);
     
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



  ejecutarGraficos() {
    const servicios = [];
    const practicas = [];
    const proyectos = [];

    this.graficoBarras = false;

    this.ejecutarFiltros().then(datos => {
      let contservact = 0;
      let contservinact = 0;
      console.log(datos['data']);
      this.inicializarDonaLabs(datos['data']);

      // INICIALIZO GRAFICO DE SERVICIOS
      for (let id = 0; id < datos['data'].length; id++) {
        const element = datos['data'][id];
        for (const key in element.relatedServices) {
          if (element.relatedServices.hasOwnProperty(key)) {
            if (element.relatedServices[key]) {
              contservact++;
            } else {
              contservinact++;
            }
            servicios.push({ id: key });
          }
        }
        for (const key in element.relatedPractices) {
          if (element.relatedPractices.hasOwnProperty(key)) {
            if (element.relatedPractices[key])
              practicas.push({ id: key });
          }
        }
        for (const key in element.relatedProjects) {
          if (element.relatedProjects.hasOwnProperty(key)) {
            if (element.relatedProjects[key])
              proyectos.push({ id: key });
          }
        }
      }


      this.inicializarDonaServs(contservact, contservinact);

      this.inicializarIndicadoresServicios(servicios);
      this.inicializarIndicadoresPracticas(practicas);
      this.inicializarIndicadoresProyectos(proyectos);

      this.inicializarGraficoLineaServicios(servicios);

      this.inicializarGraficoLineaPracticas(practicas);

      this.inicializarGraficoLineaProyectos(proyectos);

      this.inicializarGraficoBarra(datos['data']);
    });
  }


  ejecutarFiltros(){

    let promise = new Promise((resolve, reject) => {
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
            'coincidencias.push(element);}';
  
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
  
  
      this.buscaLaboratorios().then(datos=>{
  
        let cont = 1;
   
        datos.forEach(doc => {
          const element = doc.data();
  
          if(this.formCheckBox.universidad.value){

            coincidencias.push(element);
  
          } else {
  
           eval(ifquery);
  
          }
   
          if(datos.size != cont){
            cont++;
          } else {
            resolve({data:coincidencias});
          }
         
        });
  
  
      });
    });
  

    return promise;
  }



  removeDuplicates(originalArray, prop) {
    var newArray = [];
    var lookupObject = {};

    for (var i in originalArray) {
      lookupObject[originalArray[i][prop]] = originalArray[i];
    }

    for (i in lookupObject) {
      newArray.push(lookupObject[i]);
    }
    return newArray;
  }



  // METODOS PARA LA INICIALIZACION DE LOS GRAFICOS

  inicializarDonaLabs(datos) {
    let activos = 0;
    let inactivos = 0;
    for (let i = 0; i < datos.length; i++) {
      const element = datos[i];
      if (element.active) {
        activos++;
      } else {
        inactivos++;
      }
    }
    this.singleLabs = [
      {
        'name': 'Laboratorios Activos',
        'value': activos
      },
      {
        'name': 'Laboratorios Inactivos',
        'value': inactivos
      }
    ];

  }

  inicializarDonaServs(activos, inactivos) {
    this.singleServs = [
      {
        'name': 'Servicios Activos',
        'value': activos
      },
      {
        'name': 'Servicios Inactivos',
        'value': inactivos
      }
    ];

  }

  inicializarIndicadoresServicios(array) {
    const ano = new Date().toISOString().split('-')[0];
    let sus = false;
    let cont = 0;
    this.indserv.prestados = 0;
    this.indserv.monto = 0;
    const noduplicados = this.removeDuplicates(array, 'id');

    for (let i = 0; i < noduplicados.length; i++) {
      const element = noduplicados[i];
      this.buscaServicioPrestado(element.id).then(datos => {
        console.log(datos);
        if (datos.size != 0) {

          datos.forEach(doc => {
            if (doc.data().updatedAt.split('-')[0] == ano) {
              this.indserv.prestados++;
              this.indserv.monto += parseInt(doc.data().cfPrice);
            }
          })

        }
        cont++;

      });
    }

  }

  inicializarIndicadoresPracticas(array) {
    this.indprac.estudiantes = 0;
    this.indprac.pracactivas = 0;
    const ano = new Date().toISOString().split('-');

    let semester = ano[0];
    if (parseInt(ano[1]) <= 6) {
      semester += '-01';
    } else {
      semester += '-02';
    }
    let sus = false;
    let cont = 0;

    const noduplicados = this.removeDuplicates(array, 'id');
    console.log(noduplicados, semester);
    this.indprac.pracactivas = noduplicados.length;
    for (let i = 0; i < noduplicados.length; i++) {
      const element = noduplicados[i];
      this.buscaPracticas(element.id, semester).then(programacion => {
        programacion.forEach(element => {
          this.indprac.estudiantes += parseInt(element.data().noStudents);
        });

      });
    }

  }

  inicializarIndicadoresProyectos(array) {
    this.indproy.estudiantes = 0;
    this.indproy.proyactivos = 0;
    const ano = new Date().toISOString().split('-');

    let sus = false;
    let cont = 0;

    let personal = 0;

    const noduplicados = this.removeDuplicates(array, 'id');

    this.indproy.proyactivos = noduplicados.length;
    for (let i = 0; i < noduplicados.length; i++) {
      const element = noduplicados[i];
      this.buscaProyectos(element.id).then(proy => {
        
        for (const key in proy.data().relatedPers) {
          if (proy.data().relatedPers.hasOwnProperty(key)) {
            personal++;
          }
        }

        this.indproy.estudiantes = personal;
      });
    }

  }

  getDatosGraficoServicios(array) {
    let promise = new Promise((resolve, reject) => {
      const anio = new Date().toISOString();
      const ano = anio.split('-')[0];
  
      this.yAxisLabel = 'Servicios Activos Año';
  
      const servicios = [];
  
      let cont = 1;
  
      const arrayServicios = {
        anio0:[],
        anio1:[],
        anio2:[],
        anio3:[],
        anio4:[]
      };
     
      array.forEach(servicio => {
        this.getServicio(servicio.id).then(datos => {
          const aux2 = parseInt(datos.data().createdAt.split('-')[0]);
          let actual = parseInt(ano);
          for (let i = 0; i < 5; i++) {
            if(actual == aux2){
              arrayServicios['anio'+i].push(servicio.id);
            }
            actual--;
          }
          
          if(array.length == cont){
            actual = parseInt(ano);
            servicios.push({
              'name' : new Date(anio.split('T')[0]),
              'value': arrayServicios['anio0'].length
            });
            for (let i = 1; i < 5; i++) {
              actual--;
  
              servicios.push({
                'name' : new Date(actual+'-12-31'),
                'value': arrayServicios['anio'+i].length
              });
           
             if(i == 4){
             
              resolve({data:servicios});
             }
  
            }
  
          }else{
            cont++;
          }
  
        });
      });
    });
 

    return promise;

   
  }

  getDatosGraficoServiciosPrestados(array) {
    let promise = new Promise((resolve, reject) => {
      const anio = new Date().toISOString();
      const ano = anio.split('-')[0];

      const servicios = [];
      const montos = [];
  
      let cont = 1;
  
      const arrayServicios = {
        anio0:{1:[],2:[],3:[],4:[],5:[],6:[],7:[],8:[],9:[],10:[],11:[],12:[]},
        anio1:{1:[],2:[],3:[],4:[],5:[],6:[],7:[],8:[],9:[],10:[],11:[],12:[]},
        anio2:{1:[],2:[],3:[],4:[],5:[],6:[],7:[],8:[],9:[],10:[],11:[],12:[]},
        anio3:{1:[],2:[],3:[],4:[],5:[],6:[],7:[],8:[],9:[],10:[],11:[],12:[]},
        anio4:{1:[],2:[],3:[],4:[],5:[],6:[],7:[],8:[],9:[],10:[],11:[],12:[]}
      };

      const arrayMontos = {
        anio0:0,
        anio1:0,
        anio2:0,
        anio3:0,
        anio4:0
      };
     
      array.forEach(servicio => {
        this.getServicioPrestado(servicio.id).then(datos => {
          datos.forEach(sol => {
            const aux2 = parseInt(sol.data().updatedAt.split('-')[0]);
            let auxmes = parseInt(sol.data().updatedAt.split('-')[1]);

            let anioactual = parseInt(ano);
            for (let i = 0; i < 5; i++) {
              if(anioactual == aux2){
               
                for (let j = 12; j > 0; j--) {
                  if(auxmes == j){
                    arrayServicios['anio'+i][j].push(sol.id);
                  }
                 
                }
                arrayMontos['anio'+i] += parseFloat(sol.data().cfPrice);
              }
             
              anioactual--;       
            }

          });
         
                      
          if(array.length == cont){
            let anioactualaux = parseInt(ano);

            for (let i = 0; i < 5; i++) {
              anioactualaux--;
              for (let j = 12; j > 0; j--) {
                let auxmes = ''+j;
                if(j<10){auxmes = '0'+j;}
                
                servicios.push({
                  'name' : new Date(anioactualaux+'-'+auxmes+'-31'),
                  'value': arrayServicios['anio'+i][j].length
                });
                
              }

              montos.push({
                'name' : new Date(anioactualaux+'-12-31'),
                'value': arrayMontos['anio'+i]
              })
  
           
             if(i == 4){
             
              resolve({data:servicios, monto:montos});
             }
  
            }
  
          }else{
            cont++;
          }
  
        });
      });
    });
 

    return promise;

   
  }

  inicializarGraficoLineaServicios(array){
    this.multiLine = [];
    this.servicios = array;
    this.yAxisLabel = 'Servicios';
    this.getDatosGraficoServicios(array).then(datos => {
      this.getDatosGraficoServiciosPrestados(array).then(datos2 => {
        this.multiLine = [
          {
            'name': 'Servicios Activos',
            'series': datos['data']
          },
          {
            'name': 'Servicios Prestados',
            'series': datos2['data']
          }
        ];
      })

    });

  }

  // prueba(){
  //   for (let i = 1; i <= 12; i++) {
  //     let auxmes = ''+i;
  //     if(i<10){auxmes = '0'+i;}
  //     const obj = {
  //       updatedAt: '2015-'+auxmes+'-18T17:05:16.532Z',
  //       status: 'terminada',
  //       cfSrv:'wzg6bgxqDmNbYynKcqxr',
  //       cfPrice:'400'
  //     }
  
  //     this.afs.collection('cfSrvReserv').add(obj);
      
  //   }

  // }


  inicializarGraficoLineaPracticas(array) {
    this.multiLine = [];
    this.yAxisLabel = 'Practicas Realizadas Semestre';
    this.practicas = array;
    this.getDatosGraficoPracticas(array).then(datos => {
      this.multiLine = [
        {
          'name': 'Practicas Realizadas',
          'series': datos['data']
        },
        {
          'name': 'Estudiantes Asociados',
          'series': datos['estu']
        }
      ];

    });

  }

  inicializarGraficoLineaProyectos(array) {
    this.multiLine = [];
    this.yAxisLabel = 'Proyectos por Semestre';
    this.proyectos = array;
    this.getDatosGraficoProyectos(array).then(datos => {
      this.multiLine = [
        {
          'name': 'Proyectos',
          'series': datos['data']
        },
        {
          'name': 'Estudiantes Asociados',
          'series': datos['estu']
        }
      ];

    });

  }

  estructuraSemestres(){
    const anio = new Date().toISOString();
    const ano = anio.split('-')[0];
    const mes = anio.split('-')[1];
    let actual = parseInt(ano);

    const arraySeme = [];
  
      if(parseInt(mes) >= 6){
       
        for (let i = 0; i < 3; i++) {
          if(i!=2){
            arraySeme.push(actual+'-02');        
            arraySeme.push(actual+'-01'); 
          }else{
            arraySeme.push(actual+'-02');  
          }

            actual--;       
    
        }
      }else{
        for (let i = 0; i < 3; i++) {
          if(i==0){
            arraySeme.push(actual+'-01'); 
          }else{
            arraySeme.push(actual+'-02');        
            arraySeme.push(actual+'-01'); 
          } 
         
          actual--;       
    
        }
       
        
      }

      return arraySeme;
     
  }

  getDatosGraficoPracticas(array) {
    let promise = new Promise((resolve, reject) => {

      const practicas = [];
      const estudiantes = [];
  
      let cont = 1;
  
      const arrayPracticas = {};
      const arrayEstudiantes = {};

      const semestres = this.estructuraSemestres();

      for (let i = 0; i < semestres.length; i++) {
        arrayPracticas[semestres[i]] = 0;
        arrayEstudiantes[semestres[i]] = 0;           
      }
  
      array.forEach(practica => {

        this.getPracticaProgramacion(practica.id).then(datos2 => {            
            datos2.forEach(doc => {
              arrayPracticas[doc.data().semester]++;
              arrayEstudiantes[doc.data().semester] += parseInt(doc.data().noStudents);

              if(array.length == cont){

                for (let i = 0; i < semestres.length; i++) {
                  const aux = semestres[i].split('-');
                  let aux2 = '';
                  if(aux[1] == '01'){
                    aux2 = '06'
                  }else{
                    aux2 = '12'
                  }
      
                  practicas.push({
                    'name' : new Date(aux[0]+'-'+aux2+'-31'),
                    'value': arrayPracticas[semestres[i]]
                  });
      
                  estudiantes.push({
                    'name' : new Date(aux[0]+'-'+aux2+'-31'),
                    'value': arrayEstudiantes[semestres[i]]
                  });
          
                  if(i == 4){
                    resolve({data:practicas, estu:estudiantes});        
                  }
                 
                }
      
              }else{
                cont++;
              }
            });  
            
          
        });
        
    

      });
    });
 

    return promise;

   
  }

  getDatosGraficoProyectos(array) {
    let promise = new Promise((resolve, reject) => {

      const proyectos = [];
      const estudiantes = [];
  
      let cont = 1;
  
      const arrayProyectos = {};
      const arrayEstudiantes = {};

      const semestres = this.estructuraSemestres();

      for (let i = 0; i < semestres.length; i++) {
        arrayProyectos[semestres[i]] = 0;
        arrayEstudiantes[semestres[i]] = 0;           
      }
  
      array.forEach(proyecto => {

        this.getProyecto(proyecto.id).then(doc => {            
           let contador = 0;
          
          for (const key in doc.data().relatedPers) {
            contador++;
          }
          arrayProyectos[doc.data().semester]++;
          arrayEstudiantes[doc.data().semester] += contador;

          if(array.length == cont){

            for (let i = 0; i < semestres.length; i++) {
              const aux = semestres[i].split('-');
              let aux2 = '';
              if(aux[1] == '01'){
                aux2 = '06'
              }else{
                aux2 = '12'
              }
  
              proyectos.push({
                'name' : new Date(aux[0]+'-'+aux2+'-31'),
                'value': arrayProyectos[semestres[i]]
              });
  
              estudiantes.push({
                'name' : new Date(aux[0]+'-'+aux2+'-31'),
                'value': arrayEstudiantes[semestres[i]]
              });
      
              if(i == 4){
                resolve({data:proyectos, estu:estudiantes});        
              }
              
            }
  
          }else{
            cont++;
          }
             
            
          
        });
        
    

      });
    });
 

    return promise;

   
  }




  inicializarGraficoBarra(data) {
    this.singleBar = [];
    this.arregloBarra = {
      docencia:{ac:0, in:0},
      extension:{ac:0, in:0},
      investigacion:{ac:0, in:0},
      docext:{ac:0, in:0},
      docinv:{ac:0, in:0},
      extinv:{ac:0, in:0},
      doexin:{ac:0, in:0}
    };
    let cont  = 1;
    data.forEach(doc => {
      const axu = doc.facilActivity;
      if((axu['teaching']) && !(axu['extension'] || axu['research'])){
        if(doc.active){
          this.arregloBarra.docencia.ac++;
        }else{
          this.arregloBarra.docencia.in++;
        }
       
      }else if((axu['extension']) && !(axu['teaching'] || axu['research'])){
        if(doc.active){
          this.arregloBarra.extension.ac++;
        }else{
          this.arregloBarra.extension.in++;
        }
      }else if((axu['research']) && !(axu['extension'] || axu['teaching'])){
        if(doc.active){
          this.arregloBarra.investigacion.ac++;
        }else{
          this.arregloBarra.investigacion.in++;
        }
      }else if((axu['teaching'] && (axu['extension']) && !axu['research'])){
        if(doc.active){
          this.arregloBarra.docext.ac++;
        }else{
          this.arregloBarra.docext.in++;
        }
      }else if((axu['teaching'] && (axu['research']) && !axu['extension'])){
        if(doc.active){
          this.arregloBarra.docinv.ac++;
        }else{
          this.arregloBarra.docinv.in++;
        }
      }else if((axu['research'] && (axu['extension']) && !axu['teaching'])){
        if(doc.active){
          this.arregloBarra.extinv.ac++;
        }else{
          this.arregloBarra.extinv.in++;
        }
      }else if( axu['teaching'] && axu['extension'] && axu['research']){
        if(doc.active){
          this.arregloBarra.doexin.ac++;
        }else{
          this.arregloBarra.doexin.in++;
        }
      }


      if(data.length == cont){
        this.singleBar = [
          {
            'name': 'Docencia',
            'series': [{
              'name': 'Activas',
              'value': this.arregloBarra.docencia.ac
            },{
              'name': 'Inactivas',
              'value': this.arregloBarra.docencia.in
            }]
          },
    
          {
            'name': 'Extension',
            'series': [{
              'name': 'Activas',
              'value': this.arregloBarra.extension.ac
            },{
              'name': 'Inactivas',
              'value': this.arregloBarra.extension.in
            }]
          },
    
          {
            'name': 'Investigacion',
            'series': [{
              'name': 'Activas',
              'value': this.arregloBarra.investigacion.ac
            },{
              'name': 'Inactivas',
              'value': this.arregloBarra.investigacion.in
            }]
          },
          {
            'name': '3 juntas',
            'series': [{
              'name': 'Activas',
              'value': this.arregloBarra.doexin.ac
            },{
              'name': 'Inactivas',
              'value': this.arregloBarra.doexin.in
            }]
          },
          {
            'name': 'docencia e investigacion',
            'series': [{
              'name': 'Activas',
              'value': this.arregloBarra.docinv.ac
            },{
              'name': 'Inactivas',
              'value': this.arregloBarra.docinv.in
            }]
          },
          {
            'name': 'extension e investigacion',
            'series': [{
              'name': 'Activas',
              'value': this.arregloBarra.extinv.ac
            },{
              'name': 'Inactivas',
              'value': this.arregloBarra.extinv.in
            }]
          },
          {
            'name': 'docencia y extension',
            'series': [{
              'name': 'Activas',
              'value': this.arregloBarra.docext.ac
            },{
              'name': 'Inactivas',
              'value': this.arregloBarra.docext.in
            }]
          }
        ];

        this.graficoBarras = true;
      }else{
        cont++;
      }
    });
  
  
  }

  onSelectLabs(event) {
    console.log(event);
  }

  onSelectServs(event) {
    console.log(event);
  }

  onSelectLine(event) {
    console.log(event);
  }

  onSelectBar(event) {
    console.log(event);
  }

  // tslint:disable-next-line:member-ordering
  cont = true;
  monto() {
    if (this.cont) {
      this.yAxisLabel = 'Montos';

      this.getDatosGraficoServiciosPrestados(this.servicios).then(datos => {
        this.multiLine = [
          {
            'name': 'Montos Totales por Año',
            'series': datos['monto']
          }];

          this.cont = false;
      });

    } else {
      this.inicializarGraficoLineaServicios(this.servicios);
      this.cont = true;
    }


  }

   serv = true;
  cambiarGraficaLine(item) {
    if (item === 1) {
     this.inicializarGraficoLineaServicios(this.servicios);
     this.serv = true;

    } else if (item === 2) {
      this.inicializarGraficoLineaPracticas(this.practicas);
      this.serv = false;
    } else {
      this.inicializarGraficoLineaProyectos(this.proyectos);
      this.serv = false;
    }

  }

  getServicio(id){
    return this.afs.collection('cfSrv').doc(id).ref.get();
  }

  getPractica(id){
    return this.afs.collection('practice').doc(id).ref.get();
  }

  getProyecto(id){
    return this.afs.collection('project').doc(id).ref.get();
  }

  getPracticaProgramacion(id){
    return this.afs.collection('practice').doc(id).collection('programmingData').ref.get();
  }



  getServicioPrestado(id){
    const col = this.afs.collection('cfSrvReserv');
    const refer = col.ref.where('cfSrv','==',id).where('status','==','terminada');

    return refer.get();
  }


  // servicios

  buscaPracticas(keyprac, semester) {
    const col = this.afs.doc('practice/' + keyprac).collection('programmingData');
    const ref = col.ref.where('semester', '==', semester);
    return ref.get();
      
  }

  buscaProyectos(keyproy) {
    return this.afs.doc('project/' + keyproy).ref.get();
  }

  buscaServicioPrestado(keyserv) {
    const col = this.afs.collection('cfSrvReserv');
    const refer =  col.ref.where('cfSrv', '==', keyserv) .where('status', '==', 'terminada');
    return refer.get();
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
  

}
