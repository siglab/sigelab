import { QrService } from './../../services/qr.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { variable } from '@angular/compiler/src/output/output_ast';
import swal from 'sweetalert2';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-form-qr',
  templateUrl: './form-qr.component.html',
  styleUrls: ['./form-qr.component.css']
})
export class FormQrComponent implements OnInit {

  seleccionLab = true;
  // atributos tabla  laboratorios
  displayedColumnsFacil = ['nombre'];
  dataSourceFacil = new MatTableDataSource();
  @ViewChild('paginatorFacil') paginatorFacil: MatPaginator;
  @ViewChild('sortFacil') sortFacil: MatSort;

  id;
  idspace;
  idlab;
  iventory;
  formFirebase = false;
  data;
  status;
  formEdit;
  statusComponent;
  formularioComp = false;
  arrComponents = [];

  //  modelo inventario
  inventario = {
    codeinventario: '',
    responsable: '',
    ubicacion: '',
    costoinicial: '',
    marca: '',
    estado: '',
    espacio: ''
  };

  //  campos adicionales sabs
  fecha_Aceptacion;
  responsable;
  ubicacion;
  edificio;
  cod_lab;




  componente = {
    codeinventario_c: '',
    responsable_c: '',
    ubicacion_c: '',
    costoinicial_c: '',
    marca_c: '',
    estado_c: '',
    espacio_c: ''
  };
  spaces = [];

  formulario = false;


  rol: any;
  moduloQr = false;

  datos = {
    precio: '',
    descripcion: '',
    modelo: ''
  };


  constructor(
    private _Activatedroute: ActivatedRoute,
    private qrser: QrService, private route: Router
  ) { }

  ngOnInit() {

    $('html, body').animate({ scrollTop: '0px' }, 'slow');

    this.qrser.listCfFacil().subscribe(data => {

      console.log('data labs', data);
      this.dataSourceFacil.data = data;
    });

    this.getRoles();

    this._Activatedroute.params.subscribe(params => {
      this.id = params['id'];
    });

    this.qrser.getQr(this.id).subscribe(res => {
      this.data = res;

      console.log('qr', res);
    });

    this.formFirebase = false;

    this.qrser.getIdQr(this.id).then(res => {
      console.log('trae algo', res);

      // oculta o muestra partes del template si existen datos asociados
      this.formFirebase = true;
      this.seleccionLab = false;

      this.inventario.codeinventario = res['inventory'];
      this.inventario.marca = res['brand'];
      this.inventario.estado = res['active'];

      this.qrser.postSabs(res['inventory']).then(data => {

        console.log('datos sabs', data);

        this.fecha_Aceptacion = data.fechaAceptacion;
        this.responsable = data.responsable;
        this.ubicacion = data.ubicacion;
        this.edificio = data.edificio;
        this.cod_lab = data.codLab;
        this.inventario.costoinicial = data.inventario.costoInicial;

      }, err => console.log('error conectando sabs', err)

      );

    }).catch(err => { console.log(err); });
  }

  // METODO QUE ME TRAE EL ROL DE ACCESSO A NIVEL 2
  getRoles() {

    this.rol = JSON.parse(sessionStorage.getItem('rol'));

    for (const clave in this.rol) {
      if (this.rol[clave]) {
        if ((clave === 'moduloQr')) {
          this.moduloQr = true;
        }

      }
    }
  }

  codeCheck($event) {

    const q = $event.target.value;
    if (q.trim() === '') {
      this.status = 'Campo obligatorio.';
      console.log('se disparo invent');
      // this.dispo = false;
    } else {
      this.status = 'Buscando código en SABS...';
      this.qrser.postSabs(q).then(res => {
        console.log(res);
        if (res.encontrado === true) {
          this.status = 'Código de inventario encontrado.';
          this.formulario = true;
          this.formEdit = 'false';
          console.log(this.formEdit);
          // asignar valores de la consulta a formulario
          this.inventario.responsable = res.responsable;
          this.inventario.ubicacion = res.ubicacion;
          this.inventario.costoinicial = res.costoInicial;
          this.inventario.marca = res.nombreMarca;
          this.inventario.estado = res.estado;
        }
        if (res.encontrado === false) {
          this.status =
            'Código de inventario no encontrado, revise y vuelva a intentar.';
          this.formulario = true;
          this.formEdit = 'true';
          this.inventario.responsable = '';
          this.inventario.ubicacion = '';
          this.inventario.costoinicial = '';
          this.inventario.marca = '';
          this.inventario.estado = '';
        }
      }, err => swal({
        type: 'error',
        title: 'Error al conectar a SABS.',
        showConfirmButton: true
      }));
    }
  }


  codeCheckComponent($event) {

    const q = $event.target.value;
    if (q.trim() === '') {
      this.statusComponent = 'Campo obligatorio.';
      console.log('se disparo invent');
      // this.dispo = false;
    } else {
      this.statusComponent = 'Buscando código  componente  en SABS...';
      this.qrser.postSabs(q).then(res => {
        console.log(res);
        if (res.encontrado === true) {
          this.statusComponent = 'Código componente de inventario encontrado.';
          this.formularioComp = true;
          console.log(this.formEdit);
          // asignar valores de la consulta a formulario
          this.componente.ubicacion_c = res.ubicacion;
          this.componente.costoinicial_c = res.costoInicial;
          this.componente.marca_c = res.nombreMarca;
          this.componente.estado_c = res.estado;
          this.componente.codeinventario_c = q;
        }
        if (res.encontrado === false) {
          this.statusComponent = 'Código componente de inventario no encontrado, revise y vuelva a intentar.';
          this.formularioComp = true;

          this.componente.responsable_c = '';
          this.componente.ubicacion_c = '';
          this.componente.costoinicial_c = '';
          this.componente.marca_c = '';
          this.componente.estado_c = '';
        }
      });
    }
  }





  getSelectValueSpace(value) {
    console.log('este es el value', value);
    this.idspace = value;

    this.spaces.forEach(element => {
      if (element.id_space === value) {

        console.log(element.idlab);

        this.idlab = element.idlab;
      }
    });


  }

  addComponent() {

    if (this.validarDatos(this.datos)) {
      const fecha = new Date();

      const cmp = {
        cfName: this.componente.marca_c,
        cfDescription: this.datos.descripcion,
        cfPrice: this.datos.precio,
        brand: this.componente.marca_c,
        conditions: [],
        active: this.componente.estado_c,
        inventory: this.componente.codeinventario_c,
        model: this.datos.modelo,
        cfClass: '',
        cfClassScheme: '',
        createdAt: fecha.toISOString(),
        estado: this.componente.estado_c
      };
      this.arrComponents.push(cmp);
      swal({
        type: 'success',
        title: 'Componente agregado correctamente.',
        showConfirmButton: true
      }).then(() => {
        this.statusComponent = 'Campo obligatorio.';
        this.formularioComp = false;

        this.componente.responsable_c = '';
        this.componente.ubicacion_c = '';
        this.componente.costoinicial_c = '';
        this.componente.marca_c = '';
        this.componente.estado_c = '';

        this.datos.descripcion = '';
        this.datos.modelo = '';
        this.datos.precio = '';
        $('#comp').val('');

      });
    } else {
      swal({
        type: 'error',
        title: 'Debe llenar los datos del componente',
        showConfirmButton: true
      });
    }

  }

  validarDatos(object) {
    let vol = true;
    for (const key in object) {
      if (object.hasOwnProperty(key)) {
        const element = object[key];

        if (element.trim() === '') {
          vol = false;
        }

      }
    }

    return vol;
  }


  addEquipFirebase() {
    const fecha = new Date();

    if (this.idspace !== 'inicial' && this.idspace !== undefined && this.idspace !== null) {

      // construir objeto equipo cerif
      const cfEquip = {
        cfName: this.inventario.marca,
        cfDescr: '',
        cfFacil: this.idlab,
        cfClass: 'cf7799e8-3477-11e1-b86c-0800200c9a66',
        cfClassScheme: '623d2471-8d16-40c9-915a-df496da086be',
        cfPers: '',   // cual persona le asigno eto
        relatedSrv: {},
        relatedMeas: {},
        qr: this.id,
        inventory: this.iventory,
        space: this.idspace,
        brand: this.inventario.marca,
        model: '',
        price: '',
        active: true,
        createdAt: fecha.toISOString(),
        cfConditions: []
      };

      console.log(cfEquip);

      this.qrser.addEquipFirebase(cfEquip).then(path => {

        if (this.arrComponents.length > 0) {

          this.qrser.addComponents(this.arrComponents, path);
        }

        this.qrser.updatedLab(this.idlab, path);

        this.qrser.updatedQr(path, this.id);

        swal({
          type: 'success',
          title: 'Guardado exitoso',
          showConfirmButton: true
        }).then(() => {
          this.route.navigate(['principal/adminqr']);
        });

      });

    } else {

      swal({
        type: 'info',
        title: 'El campo espacio es obligatorio',
        showConfirmButton: true
      });
    }
  }

  viewComp() {
    if (this.formularioComp) {

      this.formularioComp = false;

    } else {

      this.formularioComp = true;
    }
  }

  applyFilterLab(filterValue: string) {
    console.log(filterValue);
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSourceFacil.filter = filterValue;

  }

  cambiardataLab(row) {

    console.log(row.id);
    this.qrser.getSpaces(row.relatedSpaces, row.id)
      .then((dataSpace: any) => {
        this.spaces = [];
        this.spaces = dataSpace;
        console.log('espacio asociado', dataSpace);

        this.seleccionLab = false;
      });
  }

}
