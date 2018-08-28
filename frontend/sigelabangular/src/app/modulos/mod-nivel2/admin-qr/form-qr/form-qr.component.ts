import { QrService } from './../../services/qr.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { variable } from '@angular/compiler/src/output/output_ast';
import swal from 'sweetalert2';

@Component({
  selector: 'app-form-qr',
  templateUrl: './form-qr.component.html',
  styleUrls: ['./form-qr.component.css']
})
export class FormQrComponent implements OnInit {
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
  constructor(
    private _Activatedroute: ActivatedRoute,
    private qrser: QrService
  ) { }

  ngOnInit() {

    this.qrser.getUser().then((res: Array<any> ) => {
      this.spaces = [];
      this.spaces = res;
    });

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
      this.formFirebase = true;
      this.inventario.codeinventario = res['inventory'];
      this.inventario.marca = res['brand'];
      this.inventario.costoinicial = res['price'];
      this.inventario.estado = res['active'];

    }).catch(err => { console.log(err); });
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
      });
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
        price: this.inventario.costoinicial,
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
}
