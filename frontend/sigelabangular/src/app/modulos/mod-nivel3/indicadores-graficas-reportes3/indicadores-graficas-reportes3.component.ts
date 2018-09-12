import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';

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

  singleBar: any[];

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
    prestados:0,
    monto:0
  };


  indprac = {
    pracactivas:0,
    estudiantes:0
  };

  indproy = {
    proyactivos:0,
    estudiantes:0
  };

 // VARIABLES DE LOS FILTROS

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



  constructor(private afs:AngularFirestore) {

  }

  ngOnInit() {
    $('html, body').animate({ scrollTop: '0px' }, 'slow');

    this.estructurarSedes();
    this.estructurarFacultades();

    //this.inicializarDonaLabs();
    //this.inicializarDonaServs();
    this.inicializarGraficoLineaServicios();
    this.inicializarGraficoBarra();
  }

  // METODOS PARA GENERAR LOS DATOS DE LOS GRAFICOS
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
    const arr = ['facultad','departamento', 'escuela'];

    console.log(item, filtro);
    this.objsel[filtro] = item;
    console.log(this.objsel);
    if(filtro == "sede"){
      for (let i = 0; i < arr.length; i++) {
        $('#'+arr[i]).prop('checked', false);
        this.checkBox[arr[i]] = false;
      }
      this.estructurarFacultadesWitSede(this.objsel.sede);
    } else if(filtro == "facultad"){
      for (let i = 1; i < arr.length; i++) {
        $('#'+arr[i]).prop('checked', false);
        $('#'+arr[i]).prop('disabled', false);
        this.checkBox[arr[i]] = false;
      }
      this.estructurarDeparamentos(this.objsel.facultad);
    }

    this.ejecutarGraficos();


  }

  ejecutarGraficos(){
    const servicios = [];
    const practicas = [];
    const proyectos = [];
    const query = this.estructurarQuery();
    this.buscaLaboratorios(query).subscribe(datos => {
      let contservact = 0;
      let contservinact = 0;
      console.log(datos);
      this.inicializarDonaLabs(datos);

      // INICIALIZO GRAFICO DE SERVICIOS
      for (let id = 0; id < datos.length; id++) {
        const element = datos[id];
        for (const key in element.relatedServices) {
          if (element.relatedServices.hasOwnProperty(key)) {
            if(element.relatedServices[key]){
              contservact++;
            }else{
              contservinact++;
            }
            servicios.push({id:key});
          }
        }
        for (const key in element.relatedPractices) {
          if (element.relatedPractices.hasOwnProperty(key)) {
            if(element.relatedPractices[key])
            practicas.push({id:key});
          }
        }
        for (const key in element.relatedProjects) {
          if (element.relatedProjects.hasOwnProperty(key)) {
            if(element.relatedProjects[key])
            proyectos.push({id:key});
          }
        }
      }
      this.inicializarDonaServs(contservact, contservinact);

      this.inicializarIndicadoresServicios(servicios);
      this.inicializarIndicadoresPracticas(practicas);
      this.inicializarIndicadoresProyectos(proyectos);
    });
  }

  controlChecks(item){
    const arr = ['sede','facultad','departamento', 'escuela'];
    console.log(item,this.checkBox);
    if(item == 'universidad'){
      if(this.checkBox[item]){
        for (let i = 0; i < arr.length; i++) {
          $('#'+arr[i]).prop('disabled', true);
          this.checkBox[arr[i]] = false;
          this.objsel[arr[i]] = 'inicial';
        }
        this.ejecutarGraficos();
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

  estructurarQuery(){

    //this.alertaCargando();

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
    };

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
    console.log(query);
    return query;

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



  // METODOS PARA LA INICIALIZACION DE LOS GRAFICOS

  inicializarDonaLabs(datos) {
    let activos = 0;
    let inactivos = 0;
    for (let i = 0; i < datos.length; i++) {
      const element = datos[i];
      if(element.active){
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

  inicializarIndicadoresServicios(array){
    const ano = new Date().toISOString().split('-')[0];
    let sus = false;
    let cont = 0;
    this.indserv.prestados = 0;
    this.indserv.monto = 0;
    const noduplicados = this.removeDuplicates(array,'id');

    for (let i = 0; i < noduplicados.length; i++) {
      const element = noduplicados[i];
      this.buscaServicioPrestado(element.id).subscribe(datos=>{
        console.log(datos);
        if(!sus){
          if(datos.length != 0){

            for (let j = 0; j < datos.length; j++) {
              if(datos[j]['createdAt'].split('-')[0] == ano){
                this.indserv.prestados++;
                this.indserv.monto += parseInt(datos[j]['price']);
              }

            }
          }
          cont++;

          if(cont == noduplicados.length-1){
            sus = true;
          }
        }


      });
    }

  }

  inicializarIndicadoresPracticas(array){
    this.indprac.estudiantes = 0;
    this.indprac.pracactivas = 0;
    const ano = new Date().toISOString().split('-');

    let semester = ano[0];
    if(parseInt(ano[1]) <= 6){
      semester += '-A';
    }else{
      semester += '-B';
    }
    let sus = false;
    let cont = 0;

    const noduplicados = this.removeDuplicates(array,'id');
    console.log(noduplicados, semester);
    for (let i = 0; i < noduplicados.length; i++) {
      const element = noduplicados[i];
      this.buscaPracticas(element.id, semester).subscribe(programacion=>{
        for (let j = 0; j < programacion.length; j++) {
          const element = programacion[j];
          this.indprac.pracactivas ++;
          this.indprac.estudiantes += element['noStudents'];
        }
      });
    }

  }

  inicializarIndicadoresProyectos(array){
    this.indproy.estudiantes = 0;
    this.indproy.proyactivos = 0;
    const ano = new Date().toISOString().split('-');

    let semester = ano[0];
    if(parseInt(ano[1]) <= 6){
      semester += '-A';
    }else{
      semester += '-B';
    }
    let sus = false;
    let cont = 0;

    let personal = 0;

    const noduplicados = this.removeDuplicates(array,'id');
    console.log(noduplicados, semester);
    for (let i = 0; i < noduplicados.length; i++) {
      const element = noduplicados[i];
      this.buscaProyectos(element.id).subscribe(proy => {
        this.indproy.proyactivos ++;

        for (const key in proy['relatedPers']) {
          if (proy['relatedPers'].hasOwnProperty(key)) {
            personal++;
          }
        }

        this.indproy.proyactivos = personal;
      });
    }

  }

  inicializarGraficoLineaServicios() {
    this.yAxisLabel = 'Servicios Acivos Año';
    this.multiLine = [
      {
        'name': 'Servicios Activos',
        'series': [
          {
            'name': new Date('2016-09-13'),
            'value': 1200
          },
          {
            'name': new Date('2016-10-13'),
            'value': 890
          },
          {
            'name': new Date('2016-11-13'),
            'value': 576
          },
          {
            'name': new Date('2016-12-13'),
            'value': 124
          }
        ]
      },
      {
        'name': 'Servicios Prestados',
        'series': [
          {
            'name': new Date('2016-09-11'),
            'value': 787
          },
          {
            'name': new Date('2016-10-20'),
            'value': 827
          },
          {
            'name': new Date('2016-11-13'),
            'value': 0
          },
          {
            'name': new Date('2016-12-13'),
            'value': 908
          }
        ]
      }
    ];
  }
  inicializarGraficoLineaPracticas() {
    this.yAxisLabel = 'Practicas Realizadas Semestre';
    this.multiLine = [
      {
        'name': 'Practicas Realizadas',
        'series': [
          {
            'name': new Date('2016-09-01'),
            'value': 432
          },
          {
            'name': new Date('2016-10-28'),
            'value': 343
          },
          {
            'name': new Date('2016-11-13'),
            'value': 57
          },
          {
            'name': new Date('2016-12-21'),
            'value': 12
          }
        ]
      },
      {
        'name': 'Estudiantes Asociados',
        'series': [
          {
            'name': new Date('2016-09-02'),
            'value': 785
          },
          {
            'name': new Date('2016-10-12'),
            'value': 82
          },
          {
            'name': new Date('2016-11-17'),
            'value': 0
          },
          {
            'name': new Date('2016-12-29'),
            'value': 23
          }
        ]
      }
    ];
  }
  inicializarGraficoLineaProyectos() {
    this.yAxisLabel = 'Servicios Acivos Año';
    this.multiLine = [
      {
        'name': 'Servicios Activos',
        'series': [
          {
            'name': new Date('2016-09-13'),
            'value': 1200
          },
          {
            'name': new Date('2016-10-13'),
            'value': 890
          },
          {
            'name': new Date('2016-11-13'),
            'value': 576
          },
          {
            'name': new Date('2016-12-13'),
            'value': 124
          }
        ]
      },
      {
        'name': 'Servicios Prestados',
        'series': [
          {
            'name': new Date('2016-09-11'),
            'value': 787
          },
          {
            'name': new Date('2016-10-20'),
            'value': 827
          },
          {
            'name': new Date('2016-11-13'),
            'value': 0
          },
          {
            'name': new Date('2016-12-13'),
            'value': 908
          }
        ]
      }
    ];
  }

  inicializarGraficoBarra() {
    this.singleBar = [
      {
        'name': 'Docencia',
        'series': [
          {
            'name': 'Activas',
            'value': 73
          },
          {
            'name': 'Inactivas',
            'value': 89
          }
        ]
      },

      {
        'name': 'Extension',
        'series': [
          {
            'name': 'Activas',
            'value': 78
          },
          {
            'name': 'Inactivas',
            'value': 8
          }
        ]
      },

      {
        'name': 'Investigacion',
        'series': [
          {
            'name': 'Activas',
            'value': 50
          },
          {
            'name': 'Inactivas',
            'value': 58
          }
        ]
      },
      {
        'name': '3 juntas',
        'series': [
          {
            'name': 'Activas',
            'value': 12
          },
          {
            'name': 'Inactivas',
            'value': 90
          }
        ]
      },
      {
        'name': 'docencia e investigacion',
        'series': [
          {
            'name': 'Activas',
            'value': 67
          },
          {
            'name': 'Inactivas',
            'value': 0
          }
        ]
      },
      {
        'name': 'extension e investigacion',
        'series': [
          {
            'name': 'Activas',
            'value': 45
          },
          {
            'name': 'Inactivas',
            'value': 30
          }
        ]
      },
      {
        'name': 'docencia y extension',
        'series': [
          {
            'name': 'Activas',
            'value': 20
          },
          {
            'name': 'Inactivas',
            'value': 2
          }
        ]
      }
    ];
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
      this.multiLine = [
        {
          'name': 'Montos Totales',
          'series': [
            {
              'name': new Date('2016-02-13'),
              'value': 12000000
            },
            {
              'name': new Date('2016-10-13'),
              'value': 8900000
            },
            {
              'name': new Date('2017-11-13'),
              'value': 57600000
            },
            {
              'name': new Date('2018-12-13'),
              'value': 1240000
            }
          ]
        }];
        this.cont = false;

    } else {
      this.inicializarGraficoLineaServicios();
      this.cont = true;
    }


  }

  cambiarGraficaLine(item) {
    if (item === 1) {
      this.inicializarGraficoLineaServicios();

    } else if (item === 2) {
      this.inicializarGraficoLineaPracticas();
    } else {

    }

  }


  // servicios

  buscaPracticas(keyprac, semester){
    return  this.afs.doc('practice/'+keyprac).collection('programmingData',
            ref=>ref.where('semester','==',semester)).valueChanges();
  }

  buscaProyectos(keyproy){
    return  this.afs.doc('project/'+keyproy).valueChanges();
  }

  buscaServicioPrestado(keyserv){
    return  this.afs.collection('cfSrvReserv', ref=>ref.where('cfSrv','==',keyserv)
            .where('status','==','terminada')).valueChanges();
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

}
