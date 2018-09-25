import { QrService } from './../../services/qr.service';
import { ActivatedRoute } from '@angular/router';
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
  moduloNivel2 = false;

  constructor(
    private _Activatedroute: ActivatedRoute,
    private qrser: QrService,
    private qrserv: QrService
  ) { }

  ngOnInit() {

    $('html, body').animate({ scrollTop: '0px' }, 'slow');

    this.qrserv.listCfFacil().subscribe(data => {

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

      this.qrser.postSabs(res['inventory']).subscribe(data => {

        console.log('datos sabs', data);

        this.fecha_Aceptacion = data.inventario.fechaAceptacion;
        this.responsable = data.inventario.responsable;
        this.ubicacion = data.inventario.ubicacion;
        this.edificio = data.inventario.edificio;
        this.cod_lab = data.inventario.codLab;
        this.inventario.costoinicial = data.inventario.costoInicial;

      }, err => console.log('error conectando sabs', err)

      );

    }).catch(err => { console.log(err); });
  }

  // METODO QUE ME TRAE EL ROL DE ACCESSO A NIVEL 2
  getRoles() {

    this.rol = JSON.parse(localStorage.getItem('rol'));

    for (const clave in this.rol) {
      if (this.rol[clave]) {
        if ((clave === 'moduloQr')) {
          this.moduloQr = true;
        }
        if ((clave === 'moduloNivel2')) {
          this.moduloNivel2 = true;
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
      this.status = 'Buscando codigo en SABS...';
      this.qrser.postSabs(q).subscribe(res => {
        console.log(res);
        if (res.inventario.encontrado === true) {
          this.status = 'Codigo de inventario encontrado.';
          this.formulario = true;
          this.formEdit = 'false';
          console.log(this.formEdit);
          // asignar valores de la consulta a formulario
          this.inventario.responsable = res.inventario.responsable;
          this.inventario.ubicacion = res.inventario.ubicacion;
          this.inventario.costoinicial = res.inventario.costoInicial;
          this.inventario.marca = res.inventario.nombreMarca;
          this.inventario.estado = res.inventario.estado;
        }
        if (res.inventario.encontrado === false) {
          this.status =
            'Codigo de inventario no encontrado, revise y vuelva a intentar.';
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
      this.statusComponent = 'Buscando codigo  componente  en SABS...';
      this.qrser.postSabs(q).subscribe(res => {
        console.log(res);
        if (res.inventario.encontrado === true) {
          this.statusComponent = 'Codigo componente de inventario encontrado.';
          this.formularioComp = true;
          console.log(this.formEdit);
          // asignar valores de la consulta a formulario
          this.componente.ubicacion_c = res.inventario.ubicacion;
          this.componente.costoinicial_c = res.inventario.costoInicial;
          this.componente.marca_c = res.inventario.nombreMarca;
          this.componente.estado_c = res.inventario.estado;
        }
        if (res.inventario.encontrado === false) {
          this.statusComponent = 'Codigo componente de inventario no encontrado, revise y vuelva a intentar.';
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

    const fecha = new Date();

    const cmp = {
      cfName: '',
      cfDescription: '',
      cfPrice: '',
      brand: this.componente.marca_c,
      conditions: [],
      active: '',
      inventory: this.componente.codeinventario_c,
      model: '',
      cfClass: '',
      cfClassScheme: '',
      createdAt: fecha.toISOString()
    };
    this.arrComponents.push(cmp);
    swal({
      type: 'success',
      title: 'Componente agregado correctamente.',
      showConfirmButton: true
    });

    console.log(this.arrComponents);

  }


  addEquipFirebase() {
    const fecha = new Date();

    if (this.idspace) {

      // construir objeto equipo cerif
      const cfEquip = {
        cfName: this.inventario.marca,
        cfDescr: '',
        cfFacil: this.idlab,
        cfClass: '',
        cfClassScheme: '',
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

    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSourceFacil.filter = filterValue;

  }

  cambiardataLab(row) {

    console.log(row.id);
    this.qrserv.getSpaces(row.relatedSpaces , row.id)
      .then((dataSpace: any) => {
        this.spaces = [];
        this.spaces = dataSpace;
        console.log('espacio asociado', dataSpace);

        this.seleccionLab = false;
      });
  }

}
