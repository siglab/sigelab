import { Router } from '@angular/router';
import { QrService } from './../services/qr.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import * as QRCode from 'qrcode';
import * as JSZip from 'jszip';
import { saveAs } from 'file-saver/FileSaver';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { AngularFirestore } from 'angularfire2/firestore';
import swal from 'sweetalert2';
import { URLAPI, URLQR } from '../../../config';

@Component({
  selector: 'app-admin-qr',
  templateUrl: './admin-qr.component.html',
  styleUrls: ['./admin-qr.component.css']
})
export class AdminQrComponent implements OnInit {
  QRimage;
  QrCantidad;
  base64;
  zip = new JSZip();
  img = this.zip.folder('images');
  status;
  cod_qr;
  dispo = false;
  marca_equip;
  precio_equip;
  // almacena todas las url
  arrayCsv = [];
  // atributos tabla qr active
  displayedColumnsQr = ['SecuenciaQr'];
  dataSourceQr = new MatTableDataSource();
  @ViewChild('paginatorQr') paginatorQr: MatPaginator;
  @ViewChild('sortQr') sortQr: MatSort;


  // atributos tabla  laboratorios
  displayedColumnsFacil = ['nombre'];
  dataSourceFacil = new MatTableDataSource();
  @ViewChild('paginatorFacil') paginatorFacil: MatPaginator;
  @ViewChild('sortFacil') sortFacil: MatSort;


  // atributos tabla qr inactive
  displayedColumnsQrIn = ['SecuenciaQr'];
  dataSourceQrIn = new MatTableDataSource();
  @ViewChild('paginatorQrIn') paginatorQrIn: MatPaginator;
  @ViewChild('sortQrIn') sortQrIn: MatSort;

  role: any;
  moduloNivel3 = false;
  secQrUrl;

  constructor(private qrserv: QrService, private router: Router) { }

  ngOnInit() {
    $('html, body').animate({ scrollTop: '0px' }, 'slow');

    this.getRoles();
    //  consulta qr inactivos
    this.qrserv.listQrInactive().subscribe((data) => {
      this.dataSourceQrIn.data = data;

      console.log(this.dataSourceQr.data);

    });

    this.qrserv.listCfFacil().subscribe(data => {

      console.log('data labs', data);
      this.dataSourceFacil.data = data;
    });


    //  consulta qr activos
    this.qrserv.listQrActive().subscribe((data) => {
      this.dataSourceQr.data = data;

      console.log('qr activos', this.dataSourceQr.data);
    });
  }

  // METODO QUE ME TRAE EL ROL DE ACCESSO A NIVEL 2
  getRoles() {

    this.role = JSON.parse(localStorage.getItem('rol'));
    console.log(this.role);
    for (const clave in this.role) {
      if (this.role[clave]) {
        if ((clave === 'moduloNivel3')) {
          this.moduloNivel3 = true;
        }
      }
    }
  }
  genItQR(id: string, cantidad: number, index: number) {


    const urlQR = URLQR + id;
    this.arrayCsv.push(urlQR);
    return new Promise((resolve, reject) => {
      QRCode.toDataURL(urlQR, { errorCorrectionLevel: 'M' })
        .then(url => {
          this.QRimage = url;
          this.base64 = this.QRimage.split(',')[1];


          const image = this.img.file('qrcode' + id + '.png', this.base64, { base64: true });
          console.log('image content', image);

          console.log('cantidad :', cantidad, 'indice: ', index);

          if (cantidad === index) {

            this.zip.generateAsync({ type: 'blob' }).then((content) => {
              // see FileSaver.js

              console.log('este es el content', content);
              saveAs(content, 'qrcodes.zip');
            });
          }

          resolve();
          console.log(url);
        })
        .catch(err => {
          console.error(err);
          reject(err);
        });
    });
  }


  recuperarQr() {
    if (this.cod_qr) {

      this.zip = new JSZip();
      this.img = this.zip.folder('images');

      const urlQR = URLQR + this.cod_qr;

      return new Promise((resolve, reject) => {
        QRCode.toDataURL(urlQR, { errorCorrectionLevel: 'M' })
          .then(url => {
            this.QRimage = url;
            this.base64 = this.QRimage.split(',')[1];


            const image = this.img.file('qrcode' + this.cod_qr + '.png', this.base64, { base64: true });
            console.log('image content', image);



            this.zip.generateAsync({ type: 'blob' }).then((content) => {
              // see FileSaver.js

              console.log('este es el content', content);
              saveAs(content, 'qrcodes.zip');
            });


            resolve();
            console.log(url);
          })
          .catch(err => {
            console.error(err);
            reject(err);
          });
      });
    } else {
      swal({
        type: 'info',
        title: 'No existe el codigo QR ',
        showConfirmButton: true
      });

    }


  }


  searchInventory($event) {
    this.cod_qr = '';
    const q = $event.target.value;
    if (q.trim() === '') {
      this.status = 'Ingrese un numero de inventario valido.';
      // this.dispo = false;
    } else {
      this.status = 'Confirmando disponibilidad';
      this.qrserv.getEquipForInventory(q).then((snapShot) => {
        if (snapShot.empty) {
          this.status = 'El codigo de Inventario no fue encontrado';
          this.dispo = false;
        } else {
          console.log(snapShot.docs[0].id);
          this.status = 'Codigo de inventario encontrado puede Generar el codigo asociado';
          this.dispo = true;
          this.cod_qr = snapShot.docs[0].data().qr;
          this.marca_equip = snapShot.docs[0].data().brand;
          this.precio_equip = snapShot.docs[0].data().price;


        }
      });
    }
  }

  addNewQr(cantidad) {

    const newq = URLAPI;
    const zip = new JSZip();
    const img = zip.folder('images');
    if (cantidad > 0) {
      const fecha = new Date();
      const newqr = {
        cfOrgUnitId: '',
        cfEquip: '',
        secUrl: '',
        secQr: '',
        active: false,
        createdAt: fecha.toISOString(),
        updatedAt: ''
      };

      /*   */
      this.arrayCsv = [];
      for (let index = 1; index <= cantidad; index++) {
        this.qrserv.addQr(newqr).then(ok => {
            this.genItQR(ok.id, cantidad, index).then();


            console.log(ok.id);
            const qrmod = {
              secQr: ok.id
            };

            console.log('nuevo objeto', qrmod);
            this.qrserv.setQr(ok.id, qrmod);

            console.log('se agrego prro');
          });
      }



    } else {
      swal({
        type: 'info',
        title: 'Ingrese la cantidad de codigos que desea generar',
        showConfirmButton: true
      });
    }
  }

  cambiardata(row) {

    console.log(row);

    this.secQrUrl = row.secQr;

    // this.router.navigate( ['principal/qrinventario', row.secQr] );


  }


  cambiardataInac(row) {

    console.log(row);
    this.secQrUrl = row.secQr;
    this.router.navigate(['principal/qrinventario', row.secQr]);

  }

  cambiardataLab(row) {

    console.log(row);
    this.qrserv.getSpaces(row.relatedSpaces)
      .then(dataSpace => {

        console.log(dataSpace);
      });
  }

  applyFilterLab(filterValue: string) {

    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSourceFacil.filter = filterValue;
  }

  applyFilter(value) {

  }

   // crea un archivo csv a partir de un array de los QRS generados
  downloadCsvDoc() {

    console.log(this.arrayCsv);
    let csvContent = '';

    this.arrayCsv.forEach((element) => {
      csvContent += element + '\r\n';
    });

    const csvFile = new Blob([csvContent], { type: 'text/csv' });

    const url = window.URL.createObjectURL(csvFile);
    const save = document.createElement('a');
    save.href = url;
    save.target = '_blank';
    // aquí le damos nombre al archivo
    save.download = 'dataQrs' + '.csv';
    save.click();
  }

  // descarga todos los qrs de la tabla
  downloadAllTableCsv() {

    const csvTable = this.dataSourceQrIn.data;

    const arrayCsv = [];
    csvTable.forEach((element: any ) => {
      const newUrl = ' https://demosigelab.univalle.edu.co/principal/qrinventario/' + element.secQr ;
      arrayCsv.push( newUrl);
    });

    let csvContent = '';
    arrayCsv.forEach((element) => {
      csvContent += element + '\r\n';
    });

    const csvFile = new Blob([csvContent], { type: 'text/csv' });

    const url = window.URL.createObjectURL(csvFile);
    const save = document.createElement('a');
    save.href = url;
    save.target = '_blank';
    // aquí le damos nombre al archivo
    save.download = 'all-dataQrs' + '.csv';
    save.click();
  }
}
