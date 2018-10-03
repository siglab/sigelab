import { ObservablesService } from './../../../../services/observables.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestoreCollection, AngularFirestore } from 'angularfire2/firestore';
import { Observable } from '@firebase/util';

@Component({
  selector: 'app-bar-admin-laboratorios',
  templateUrl: './bar-admin-laboratorios.component.html',
  styleUrls: ['./bar-admin-laboratorios.component.css']
})
export class BarAdminLaboratoriosComponent implements OnInit {

  laboratorios2 = [];
  // INICIALIZACION DE CONSULTAS PARA LABORATORIOS
  private labsColection: AngularFirestoreCollection<any>;
  labs: Observable<any[]>;

  datosLabsEstructurados = [];

  user: any;
  facultades: any;

  moduloNivel2 = false;
  moduloPermiso = false;

  permisos: any;

  constructor(private obs: ObservablesService, private route: Router, private afs: AngularFirestore) { }

  ngOnInit() {

    if (localStorage.getItem('usuario')) {
      this.getUserId();
      const labs =  JSON.parse(localStorage.getItem('laboratorios'));
      this.permisos = JSON.parse(localStorage.getItem('permisos'))
        this.estructurarLaboratorios(labs).then(() => {

          this.laboratorios2 = this.datosLabsEstructurados;

          console.log(this.laboratorios2);
        });
    }
  }


  estructurarLaboratorios(labs){
    this.datosLabsEstructurados = [];

    let size = 0;
    for (const key in labs) {
      if (labs.hasOwnProperty(key)) {
       size++;
        
      }
    }

    let promise = new Promise((resolve, reject) => {
      for (const key in labs) {
        if (labs.hasOwnProperty(key)) {
          this.getLaboratorio(key).then(doc => {
            const elemento = doc.data();
            const laboratorio = {
              nombre: this.ajustarTexto(elemento.cfName),
              uid: doc.id,
              labo: elemento,
              roles : this.permisos[key]
            };
      
            this.datosLabsEstructurados.push(laboratorio);

            if(size == this.datosLabsEstructurados.length){
              resolve();
            } 

          });
          
        }
      }
    });

    return promise;
  
  }

  getLaboratorio(id){
    return this.afs.collection('cfFacil').doc(id).ref.get();
  }


  getUserId() {
    this.user = JSON.parse(localStorage.getItem('usuario'));
  }



  getPersonId(userid) {
    return this.afs.doc('user/' + userid).ref.get();
  }


  getPersona(persid) {
    return  this.afs.doc('cfPers/' + persid).snapshotChanges();
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

    return { nom1: name1, nom2: name2 };
  }

  enviaritem(item) {
    this.obs.changeObject(item);
  }

  enviaritemEquip(equip) {
    this.obs.changeObjectEquip(equip);
  }

  enviaritemLab(lab) {
    this.obs.changeObjectLab(lab);
  }
  enviaritemPer(per) {
    this.obs.changeObjectPer(per);
  }
  enviaritemEsp(esp) {
    this.obs.changeObjectEsp(esp);
   }
  enviaritemPra(pra) {
    this.obs.changeObjectPra(pra);
  }
  enviaritemSolServ(solsrv) {
    this.obs.changeObjectSolServ(solsrv);
  }
  enviaritemServAsoc(srvasoc) {
    this.obs.changeObjectServAsoc(srvasoc);
  }
  enviaritemProy(proy) {
    this.obs.changeObjectProy(proy);
  }
  enviaritemSolMante(solman) {
    this.obs.changeObjectSolMante(solman);
  }
  enviaritemSolBaja(baja) {
    this.obs.changeObjectSolBaja(baja);
  }



  abrirEnlaceBaja() {
    const url = 'https://swebse12.univalle.edu.co/sabs/paquetes/formatos/fm_bajas.htm';

    window.open(url);
  }

  abrirEnlaceQuiUv() {
    const url = 'https://dfrq-quiuv.herokuapp.com/cuentas/login/';

    window.open(url);
  }






}
