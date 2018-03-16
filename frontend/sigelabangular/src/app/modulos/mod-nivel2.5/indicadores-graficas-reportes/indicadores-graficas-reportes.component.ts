import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ObservablesService } from '../../../shared/services/observables.service';


@Component({
  selector: 'app-indicadores-graficas-reportes',
  templateUrl: './indicadores-graficas-reportes.component.html',
  styleUrls: ['./indicadores-graficas-reportes.component.css']
})
export class IndicadoresGraficasReportesComponent implements OnInit {
  // tslint:disable-next-line:max-line-length
  convenios = [{nombre: 'LABORATORIO CIENCIAS', coord: {lat: '3.425906', lon: '-76.540446'}, info: {dir: 'cra54 cambulos', tel: '53454636', cel: '43656537', email: 'jkhkhjk@univalle.edu.co'},
              // tslint:disable-next-line:max-line-length
              servicios: [{nombre: 'QUIMICA'}, {nombre: 'TERMODINAMICA'}, {nombre: 'FISICA'}], practicas: [{nombre: 'EXSS'}, {nombre: 'FGFGFG'}]},
              // tslint:disable-next-line:max-line-length
              {nombre: 'LABORATORIO SOCIAES', coord: {lat: '3.419737', lon: '-76.540275'}, info: {dir: 'cra54 san fernado', tel: '53454543gdf636', cel: '43656537', email: 'fdgfgjh@univalle.edu.co'},
              servicios: [{nombre: 'CUANTICA'}, {nombre: 'MATE'}, {nombre: 'BIOLOGIA'}], practicas: [{nombre: 'DFGDFGDF'}]},
              // tslint:disable-next-line:max-line-length
              {nombre: 'LABORATORIO X', coord: {lat: '3.420380', lon: '-76.510105'}, info: {dir: 'cra54 sfdfsdfs', tel: '35345435', cel: '436574676537', email: 'fgjh@univalle.edu.co'},
              servicios: [{nombre: 'BUSQUEDA'}, {nombre: 'INVESTIGACION'}], practicas: [{nombre: 'HJGHJHJ'}]},
              // tslint:disable-next-line:max-line-length
              {nombre: 'LABORATORIO Y', coord: {lat: '3.403437', lon: '-76.511292'}, info: {dir: 'cra54 dfsdfsdf', tel: '46363565', cel: '4357547656537', email: 'hkjkhjjh@univalle.edu.co'},
              servicios: [], practicas: []}];

  itemsel: Observable<Array<any>>;

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




  constructor(private obs: ObservablesService) {
    // this.obs.changeObject({nombre:"SELECCIONE UN LABORATORIO",coord:{lat:"3.403437",lon:"-76.511292"},info:{dir:"",tel:"",cel:"4",email:""},
    // servicios:[],practicas:[],equipos:[],personal:[],proyectos:[],solicitudes:[]});

  }

  ngOnInit() {
    this.obs.currentObject.subscribe(data => {
      console.log(data);
      this.itemsel = Observable.of(data);
      console.log(this.itemsel);
    });

    this.inicializarDonaLabs();
    this.inicializarDonaServs();
    this.inicializarGraficoLineaServicios();
    this.inicializarGraficoBarra();
  }

  inicializarDonaLabs() {
    this.singleLabs = [
      {
        'name': 'Laboratorios Activos',
        'value': 170
      },
      {
        'name': 'Laboratorios Inactivos',
        'value': 68
      }
    ];

  }

  inicializarDonaServs() {
    this.singleServs = [
      {
        'name': 'Servicios Activos',
        'value': 350
      },
      {
        'name': 'Servicios Inactivos',
        'value': 100
      }
    ];

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

}
