import { Component, OnInit, style } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { FormControl } from '@angular/forms';

const domtoimage = require('dom-to-image');
import { saveAs } from 'file-saver/FileSaver';
import { ServicesNivel3Service } from '../services/services-nivel3.service';
import swal from 'sweetalert2';

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
    docencia: {ac: 0, in: 0},
    extension: {ac: 0, in: 0},
    investigacion: {ac: 0, in: 0},
    docext: {ac: 0, in: 0},
    docinv: {ac: 0, in: 0},
    extinv: {ac: 0, in: 0},
    doexin: {ac: 0, in: 0}
  };
  graficoBarras = false;

  role: any;
  moduloNivel3 = false;
  moduloNivel25 = false;

  persona: any;
  faculty: any;
  constructor(private serviceMod3: ServicesNivel3Service) {

  }

  ngOnInit() {
    $('html, body').animate({ scrollTop: '0px' }, 'slow');
    this.persona = JSON.parse(sessionStorage.getItem('persona'));
    this.getRoles();
    this.estructurarSedes();
    this.estructurarTodasSubSedes();
    if (this.moduloNivel3) {
      this.estructurarFacultades();
    }

    if (this.moduloNivel25) {
      this.getFaculty().then(() => {
        const val = [];
        for (const key in this.faculty) {
          if (this.faculty.hasOwnProperty(key)) {
            this.estructurarFacultad(key);
            val.push(key);
          }
        }
        this.formSelect.facultad.setValue(val);
        this.formCheckBox.facultad.setValue(true);
        this.formCheckBox.facultad.disable();

        this.formSelect.facultad.disable();

        this.ejecutarGraficos();
      });

    }

  }

  getRoles() {

    this.role = JSON.parse(sessionStorage.getItem('rol'));
    for (const clave in this.role) {
      if (this.role[clave]) {
        if ((clave === 'moduloNivel3') || (clave === 'moduloNivel35')) {
          this.moduloNivel3 = true;
        }

        if ((clave === 'moduloNivel25')) {
          this.moduloNivel25 = true;
        }
      }
    }
  }

  getFaculty() {
    const promise = new Promise((resolve, reject) => {
      this.serviceMod3.buscarDirector(this.persona.cfPers).then(doc => {
        this.faculty = doc.data().faculty;
        resolve();
      });
    });
    return promise;
  }


  estructurarSedes() {

    this.serviceMod3.buscaSede().then(datos => {
      datos.forEach(doc => {
        const sede = doc.data();
        this.listSelect.sede.push({
          id: doc.id,
          nombre: sede.cfName
        });
      });

    });


  }

  estructurarTodasSubSedes() {
    this.serviceMod3.buscaTodasSubSede().then(datos => {
      datos.forEach(doc => {
        const sede = doc.data();
        this.listSelect.subsede.push({
          id: doc.id,
          nombre: sede.cfAddrline2 ? sede.cfAddrline2 : sede.cfAddrline1
        });
      });
    });
  }


  estructurarFacultades() {
    this.listSelect.facultad = [];
    this.serviceMod3.buscaTodasFacultades().then(datos => {

      datos.forEach(doc => {
        const facultad = doc.data();
        this.listSelect.facultad.push({
          id: doc.id,
          nombre: facultad.facultyName
        });

        this.estructurarDeparamentos(doc.id);
      });

    });
  }

  estructurarFacultad(id) {
    // this.listSelect.facultad = [];
    this.serviceMod3.buscaFacultad(id).then(doc => {

      this.listSelect.facultad.push({
        id: doc.id,
        nombre: doc.data().facultyName
      });

      this.estructurarDeparamentos(doc.id);

    });
  }


  estructurarDeparamentos(keyfacul) {
    if (this.moduloNivel3) {
      this.listSelect.departamento = [];
      this.listSelect.escuela = [];
    }

    this.serviceMod3.buscaDepartamento(keyfacul)
    .then(departamento => {
      departamento.forEach(doc => {

        const element = doc.data();

        if (element.type === 'department') {

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

  controlChecks(item) {
    const arr = ['sede', 'subsede', 'facultad', 'departamento', 'escuela'];
    if (item === 'universidad') {
      if (this.formCheckBox[item].value) {

        arr.forEach(elemen => {
          this.formCheckBox[elemen].setValue(false);
          this.formSelect[elemen].setValue('');
          this.formSelect[elemen].disable();
          this.formCheckBox[elemen].disable();
        });

        this.ejecutarGraficos();

      } else {
        arr.forEach(elemen => {
          this.formCheckBox[elemen].enable();
        });
      }
    } else {
      if (this.formCheckBox[item].value) {

        this.formSelect[item].enable();
      } else {
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
            if (element.relatedPractices[key]) {
              practicas.push({ id: key });
            }
          }
        }
        for (const key in element.relatedProjects) {
          if (element.relatedProjects.hasOwnProperty(key)) {
            if (element.relatedProjects[key]) {
              proyectos.push({ id: key });
            }
          }
        }
      }


      this.inicializarDonaServs(contservact, contservinact);

      this.inicializarIndicadoresServicios(servicios);
      this.inicializarIndicadoresPracticas(practicas);
      this.inicializarIndicadoresProyectos(proyectos);

      this.inicializarGraficoLineaServicios(servicios);

      this.practicas = practicas;
      this.proyectos = proyectos;

      // this.inicializarGraficoLineaPracticas(practicas);

      // this.inicializarGraficoLineaProyectos(proyectos);

      this.inicializarGraficoBarra(datos['data']);
    });
  }


  ejecutarFiltros() {

    const promise = new Promise((resolve, reject) => {
      const coincidencias = [];

      const arr = {
              sede: 'headquarter',
              subsede: 'subHq',
              facultad: 'faculties',
              departamento: 'departments',
              escuela: 'departments'
            };

      const correos = '';
      const notificaciones = [];

      const inicio = 'if(';
      const fin = '){' +
            'coincidencias.push(element);}';

      let ifquery = '';


      for (const key in this.formCheckBox) {
        if (this.formCheckBox.hasOwnProperty(key)) {
          const element2 = this.formCheckBox[key];
          if (element2.value && key !== 'universidad') {

            if (this.formSelect[key].value.length !== 0) {
              ifquery += '(';

              for (let i = 0; i < this.formSelect[key].value.length; i++) {
                const element3 = this.formSelect[key].value[i];

                if (i === this.formSelect[key].value.length - 1) {

                  if (key === 'facultad') {
                    ifquery += 'element["' + arr[key] + '"].' + element3 + ' == true)';
                  } else if (key === 'departamento') {
                    if (this.formSelect['escuela'].value.length !== 0) {
                      ifquery += '(element["' + arr[key] + '"]["' + element3.facul + '"] == null ? false: element["' + arr[key] + '"]["' + element3.facul + '"]["' + element3.id + '"]) == true';
                    } else {
                      ifquery += '(element["' + arr[key] + '"]["' + element3.facul + '"] == null ? false: element["' + arr[key] + '"]["' + element3.facul + '"]["' + element3.id + '"]) == true)';
                    }

                  } else if (key === 'escuela') {
                    if (this.formSelect['departamento'].value.length !== 0) {
                      ifquery += '(element["' + arr[key] + '"]["' + element3.facul + '"] == null ? false: element["' + arr[key] + '"]["' + element3.facul + '"]["' + element3.id + '"]) == true))';
                    } else {
                      ifquery += '(element["' + arr[key] + '"]["' + element3.facul + '"] == null ? false: element["' + arr[key] + '"]["' + element3.facul + '"]["' + element3.id + '"]) == true)';
                    }

                  } else {
                    ifquery += 'element["' + arr[key] + '"] == "' + element3 + '")';
                  }

                } else {
                  if (key === 'facultad') {
                    ifquery += 'element["' + arr[key] + '"].' + element3 + ' == true || ';

                  } else if (key === 'departamento' || key === 'escuela') {

                    ifquery += '(element["' + arr[key] + '"]["' + element3.facul + '"] == null ? false: element["' + arr[key] + '"]["' + element3.facul + '"]["' + element3.id + '"]) == true || ';
                  } else {
                    ifquery += 'element["' + arr[key] + '"] == "' + element3 + '" || ';
                  }

                }
              }


              if (key !== 'departamento') {
                ifquery += ' && ';
              } else {
                ifquery += ' || ';
              }

              }
            }


          }

        }

        ifquery = ifquery.substr(0, ifquery.length - 4);

        ifquery = inicio + ifquery + fin;


      this.serviceMod3.buscaLaboratorios().then(datos => {

        let cont = 1;

        datos.forEach(doc => {
          const element = doc.data();

          if (this.formCheckBox.universidad.value) {

            coincidencias.push(element);

          } else {

           // tslint:disable-next-line:no-eval
           eval(ifquery);

          }

          if (datos.size !== cont) {
            cont++;
          } else {
            resolve({data: coincidencias});
          }

        });


      });
    });


    return promise;
  }



  removeDuplicates(originalArray, prop) {
    const newArray = [];
    const lookupObject = {};

    // tslint:disable-next-line:forin
    for (const i in originalArray) {
      lookupObject[originalArray[i][prop]] = originalArray[i];
    }

    // tslint:disable-next-line:forin
    for (const i in lookupObject) {
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
    const sus = false;
    let cont = 0;
    this.indserv.prestados = 0;
    this.indserv.monto = 0;
    const noduplicados = this.removeDuplicates(array, 'id');

    for (let i = 0; i < noduplicados.length; i++) {
      const element = noduplicados[i];
      this.serviceMod3.buscaServicioPrestado(element.id).then(datos => {
        console.log(datos);
        if (datos.size !== 0) {

          datos.forEach(doc => {
            if (doc.data().updatedAt.split('-')[0] === ano) {
              this.indserv.prestados++;
              this.indserv.monto += parseInt(doc.data().cfPrice, 10);
            }
          });

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
    if (parseInt(ano[1], 10) <= 6) {
      semester += '-01';
    } else {
      semester += '-02';
    }
    const sus = false;
    const cont = 0;

    const noduplicados = this.removeDuplicates(array, 'id');
    console.log(noduplicados, semester);
    this.indprac.pracactivas = noduplicados.length;
    for (let i = 0; i < noduplicados.length; i++) {
      const element = noduplicados[i];
      this.serviceMod3.buscaPracticas(element.id, semester).then(programacion => {
        programacion.forEach(element2 => {
          this.indprac.estudiantes += parseInt(element2.data().noStudents, 10);
        });

      });
    }

  }

  inicializarIndicadoresProyectos(array) {
    this.indproy.estudiantes = 0;
    this.indproy.proyactivos = 0;
    const ano = new Date().toISOString().split('-');

    const sus = false;
    const cont = 0;

    let personal = 0;

    const noduplicados = this.removeDuplicates(array, 'id');

    this.indproy.proyactivos = noduplicados.length;
    for (let i = 0; i < noduplicados.length; i++) {
      const element = noduplicados[i];
      this.serviceMod3.buscaProyectos(element.id).then(proy => {

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
    const promise = new Promise((resolve, reject) => {
      const anio = new Date().toISOString();
      const ano = anio.split('-')[0];

      this.yAxisLabel = 'Servicios Activos Año';

      const servicios = [];

      let cont = 1;

      const arrayServicios = {
        anio0: [],
        anio1: [],
        anio2: [],
        anio3: [],
        anio4: []
      };

      array.forEach(servicio => {
        this.serviceMod3.getServicio(servicio.id).then(datos => {
          const aux2 = parseInt(datos.data().createdAt.split('-')[0], 10);
          let actual = parseInt(ano, 10);
          for (let i = 0; i < 5; i++) {
            if (actual === aux2) {
              arrayServicios['anio' + i].push(servicio.id);
            }
            actual--;
          }

          if (array.length === cont) {
            actual = parseInt(ano, 10);
            servicios.push({
              'name' : new Date(anio.split('T')[0]),
              'value': arrayServicios['anio0'].length
            });
            for (let i = 1; i < 5; i++) {
              actual--;

              servicios.push({
                'name' : new Date(actual + '-12-31'),
                'value': arrayServicios['anio' + i].length
              });

             if (i === 4) {

              resolve({data: servicios});
             }

            }

          } else {
            cont++;
          }

        });
      });
    });


    return promise;


  }

  getDatosGraficoServiciosPrestados(array) {
    const promise = new Promise((resolve, reject) => {
      const anio = new Date().toISOString();
      const ano = anio.split('-')[0];

      const servicios = [];
      const montos = [];

      let cont = 1;

      const arrayServicios = {
        anio0: {1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: [], 10: [], 11: [], 12: []},
        anio1: {1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: [], 10: [], 11: [], 12: []},
        anio2: {1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: [], 10: [], 11: [], 12: []},
        anio3: {1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: [], 10: [], 11: [], 12: []},
        anio4: {1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: [], 10: [], 11: [], 12: []}
      };

      const arrayMontos = {
        anio0: 0,
        anio1: 0,
        anio2: 0,
        anio3: 0,
        anio4: 0
      };

      array.forEach(servicio => {
        this.serviceMod3.getServicioPrestado(servicio.id).then(datos => {
          datos.forEach(sol => {
            const aux2 = parseInt(sol.data().updatedAt.split('-')[0], 10);
            const auxmes = parseInt(sol.data().updatedAt.split('-')[1], 10);

            let anioactual = parseInt(ano, 10);
            for (let i = 0; i < 5; i++) {
              if (anioactual === aux2) {

                for (let j = 12; j > 0; j--) {
                  if (auxmes === j) {
                    arrayServicios['anio' + i][j].push(sol.id);
                  }

                }
                arrayMontos['anio' + i] += parseFloat(sol.data().cfPrice);
              }

              anioactual--;
            }

          });


          if (array.length === cont) {
            let anioactualaux = parseInt(ano, 10);

            for (let i = 0; i < 5; i++) {
              anioactualaux--;
              for (let j = 12; j > 0; j--) {
                let auxmes = '' + j;
                if (j < 10) {auxmes = '0' + j; }

                servicios.push({
                  'name' : new Date(anioactualaux + '-' + auxmes + '-31'),
                  'value': arrayServicios['anio' + i][j].length
                });

              }

              montos.push({
                'name' : new Date(anioactualaux + '-12-31'),
                'value': arrayMontos['anio' + i]
              });


             if (i === 4) {

              resolve({data: servicios, monto: montos});
             }

            }

          } else {
            cont++;
          }

        });
      });
    });


    return promise;


  }

  inicializarGraficoLineaServicios(array) {
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
      });

    });

  }



  inicializarGraficoLineaPracticas(array) {
    this.multiLine = [];
    this.yAxisLabel = 'Prácticas Realizadas Semestre';
    this.practicas = array;
    this.getDatosGraficoPracticas(array).then(datos => {
      console.log(datos['data'], datos['estu']);
      this.multiLine = [
        {
          'name': 'Prácticas Realizadas',
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

  estructuraSemestres() {
    const anio = new Date().toISOString();
    const ano = anio.split('-')[0];
    const mes = anio.split('-')[1];
    let actual = parseInt(ano, 10);

    const arraySeme = [];

      if (parseInt(mes, 10) >= 6) {

        for (let i = 0; i < 3; i++) {
          if (i !== 2) {
            arraySeme.push(actual + '-02');
            arraySeme.push(actual + '-01');
          } else {
            arraySeme.push(actual + '-02');
          }

            actual--;

        }
      } else {
        for (let i = 0; i < 3; i++) {
          if (i === 0) {
            arraySeme.push(actual + '-01');
          } else {
            arraySeme.push(actual + '-02');
            arraySeme.push(actual + '-01');
          }

          actual--;

        }


      }

      return arraySeme;

  }

  getDatosGraficoPracticas(array) {
    const promise = new Promise((resolve, reject) => {

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
      console.log(array);
      array.forEach(practica => {

        this.serviceMod3.getPracticaProgramacion(practica.id).then(datos2 => {
          console.log(datos2);
            datos2.forEach(doc => {
              arrayPracticas[doc.data().semester]++;
              arrayEstudiantes[doc.data().semester] += parseInt(doc.data().noStudents, 10);

              if (array.length === cont) {

                for (let i = 0; i < semestres.length; i++) {
                  const aux = semestres[i].split('-');
                  let aux2 = '';
                  if (aux[1] === '01') {
                    aux2 = '06';
                  } else {
                    aux2 = '12';
                  }

                  practicas.push({
                    'name' : new Date(aux[0] + '-' + aux2 + '-31'),
                    'value': arrayPracticas[semestres[i]]
                  });

                  estudiantes.push({
                    'name' : new Date(aux[0] + '-' + aux2 + '-31'),
                    'value': arrayEstudiantes[semestres[i]]
                  });


                  if (i === 4) {
                    console.log(practicas, estudiantes);
                    resolve({data: practicas, estu: estudiantes});
                  }

                }

              } else {
                cont++;
              }
            });


        });



      });
    });


    return promise;


  }

  getDatosGraficoProyectos(array) {
    const promise = new Promise((resolve, reject) => {

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

        this.serviceMod3.getProyecto(proyecto.id).then(doc => {
           let contador = 0;

          // tslint:disable-next-line:forin
          for (const key in doc.data().relatedPers) {
            contador++;
          }
          arrayProyectos[doc.data().semester]++;
          arrayEstudiantes[doc.data().semester] += contador;

          if (array.length === cont) {

            for (let i = 0; i < semestres.length; i++) {
              const aux = semestres[i].split('-');
              let aux2 = '';
              if (aux[1] === '01') {
                aux2 = '06';
              } else {
                aux2 = '12';
              }

              proyectos.push({
                'name' : new Date(aux[0] + '-' + aux2 + '-31'),
                'value': arrayProyectos[semestres[i]]
              });

              estudiantes.push({
                'name' : new Date(aux[0] + '-' + aux2 + '-31'),
                'value': arrayEstudiantes[semestres[i]]
              });

              if (i === 4) {
                resolve({data: proyectos, estu: estudiantes});
              }

            }

          } else {
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
      docencia: {ac: 0, in: 0},
      extension: {ac: 0, in: 0},
      investigacion: {ac: 0, in: 0},
      docext: {ac: 0, in: 0},
      docinv: {ac: 0, in: 0},
      extinv: {ac: 0, in: 0},
      doexin: {ac: 0, in: 0}
    };
    let cont  = 1;
    data.forEach(doc => {
      const axu = doc.facilActivity;
      if ((axu['teaching']) && !(axu['extension'] || axu['research'])) {
        if (doc.active) {
          this.arregloBarra.docencia.ac++;
        } else {
          this.arregloBarra.docencia.in++;
        }

      } else if ((axu['extension']) && !(axu['teaching'] || axu['research'])) {
        if (doc.active) {
          this.arregloBarra.extension.ac++;
        } else {
          this.arregloBarra.extension.in++;
        }
      } else if ((axu['research']) && !(axu['extension'] || axu['teaching'])) {
        if (doc.active) {
          this.arregloBarra.investigacion.ac++;
        } else {
          this.arregloBarra.investigacion.in++;
        }
      } else if ((axu['teaching'] && (axu['extension']) && !axu['research'])) {
        if (doc.active) {
          this.arregloBarra.docencia.ac++;
          this.arregloBarra.extension.ac++;
          this.arregloBarra.docext.ac++;
        } else {
          this.arregloBarra.docencia.in++;
          this.arregloBarra.extension.in++;
          this.arregloBarra.docext.in++;
        }
      } else if ((axu['teaching'] && (axu['research']) && !axu['extension'])) {
        if (doc.active) {
          this.arregloBarra.docencia.ac++;
          this.arregloBarra.investigacion.ac++;
          this.arregloBarra.docinv.ac++;
        } else {
          this.arregloBarra.docencia.in++;
          this.arregloBarra.investigacion.in++;
          this.arregloBarra.docinv.in++;
        }
      } else if ((axu['research'] && (axu['extension']) && !axu['teaching'])) {
        if (doc.active) {
          this.arregloBarra.extension.ac++;
          this.arregloBarra.investigacion.ac++;
          this.arregloBarra.extinv.ac++;
        } else {
          this.arregloBarra.extension.in++;
          this.arregloBarra.investigacion.in++;
          this.arregloBarra.extinv.in++;
        }
      } else if ( axu['teaching'] && axu['extension'] && axu['research']) {
        if (doc.active) {
          this.arregloBarra.docencia.ac++;
          this.arregloBarra.extension.ac++;
          this.arregloBarra.investigacion.ac++;
          this.arregloBarra.doexin.ac++;
        } else {
          this.arregloBarra.docencia.in++;
          this.arregloBarra.extension.in++;
          this.arregloBarra.investigacion.in++;
          this.arregloBarra.doexin.in++;
        }
      }


      if (data.length === cont) {
        this.singleBar = [
          {
            'name': 'Docencia',
            'series': [{
              'name': 'Activas',
              'value': this.arregloBarra.docencia.ac
            }, {
              'name': 'Inactivas',
              'value': this.arregloBarra.docencia.in
            }]
          },

          {
            'name': 'Extension',
            'series': [{
              'name': 'Activas',
              'value': this.arregloBarra.extension.ac
            }, {
              'name': 'Inactivas',
              'value': this.arregloBarra.extension.in
            }]
          },

          {
            'name': 'Investigacion',
            'series': [{
              'name': 'Activas',
              'value': this.arregloBarra.investigacion.ac
            }, {
              'name': 'Inactivas',
              'value': this.arregloBarra.investigacion.in
            }]
          },
          {
            'name': '3 juntas',
            'series': [{
              'name': 'Activas',
              'value': this.arregloBarra.doexin.ac
            }, {
              'name': 'Inactivas',
              'value': this.arregloBarra.doexin.in
            }]
          },
          {
            'name': 'docencia e investigacion',
            'series': [{
              'name': 'Activas',
              'value': this.arregloBarra.docinv.ac
            }, {
              'name': 'Inactivas',
              'value': this.arregloBarra.docinv.in
            }]
          },
          {
            'name': 'extension e investigacion',
            'series': [{
              'name': 'Activas',
              'value': this.arregloBarra.extinv.ac
            }, {
              'name': 'Inactivas',
              'value': this.arregloBarra.extinv.in
            }]
          },
          {
            'name': 'docencia y extension',
            'series': [{
              'name': 'Activas',
              'value': this.arregloBarra.docext.ac
            }, {
              'name': 'Inactivas',
              'value': this.arregloBarra.docext.in
            }]
          }
        ];

        this.graficoBarras = true;
      } else {
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

   // tslint:disable-next-line:member-ordering
   serv = true;
  cambiarGraficaLine(item) {
    if (item === 1) {
     this.inicializarGraficoLineaServicios(this.servicios);
     this.serv = true;

    } else if (item === 2) {
      console.log(this.practicas);
      this.inicializarGraficoLineaPracticas(this.practicas);
      this.serv = false;
    } else {
      this.inicializarGraficoLineaProyectos(this.proyectos);
      this.serv = false;
    }

  }




  buscaObjectos() {
    let texto = '';
    // tslint:disable-next-line:forin
    for (const clave in this.formCheckBox) {

      const auxiliar = [];
      if (this.formCheckBox.hasOwnProperty(clave)) {
        const element = this.formCheckBox[clave].value;

        if (element) {

          if (clave === 'universidad') {
            texto += '<h3>Toda la universidad</h3>';
          } else {
            const array = this.listSelect[clave];
            let nombre = '';
            if (clave === 'sede') {
              nombre = 'seccional';
              texto += '<h3>' + nombre + '</h3>';
            } else if (clave === 'subsede') {
              nombre = 'sede';
              texto += '<h3>' + nombre + '</h3>';
            } else {
              texto += '<h3>' + clave + '</h3>';
            }

            const array2 = this.formSelect[clave].value;
            texto += '<p>';
            for (let i = 0; i < array2.length; i++) {
              let element2 = array2[i];
              if ((clave === 'departamento') || (clave === 'escuela')) {
                element2 = array2[i].id;
              }
              const enc = array.find(o => o.id === element2);
              if (enc) {
                texto += enc.nombre + ', ';
              }

            }

            texto += '</p>';


          }


        }
      }
    }
    return texto;
  }



   prueba() {
    swal({
      title: 'Cargando un momento...',
      text: 'Espere mientras se procesa la transacción',
      onOpen: () => {
        swal.showLoading();
      }
    });
    const f = new Date();
    const cad = f.getHours() + ':' + f.getMinutes() + ':' + f.getSeconds();
    const ambiente = this;
    const scale = 'scale(0.85)';
    const filtros = this.buscaObjectos();
    domtoimage.toPng(document.getElementById('grafica'))
    .then(function (dataUrl) {
        const img = new Image();
        img.src = dataUrl;

        const printWindow = window.open('', '', 'height=400,width=800');
        printWindow.document.write('<html><head><title>REPORTE</title>');
        printWindow.document.write('</head><body style="height:100%; width:100%;">');
        printWindow.document.write('<strong> Hora de Generación: ' + cad + ' </strong>');
        printWindow.document.body.appendChild(img);
        printWindow.document.write('<br><strong> Correo del generador: : ' + ambiente.persona.email + ' </strong>');
        printWindow.document.write('<h1>FILTROS USADOS</h1>');
        printWindow.document.write(filtros);
        printWindow.document.write('</body></html>');

        printWindow.document.head.style.transform = scale;
        printWindow.document.body.style.transform = scale;

        printWindow.document.close();

        setTimeout(() => {
          swal.close();
          printWindow.print();
        }, 1000);


    })
    .catch(function (error) {
        console.error('oops, something went wrong!', error);
    });

   }


}
