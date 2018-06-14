import { ObservablesService } from './../../../../services/observables.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestoreCollection, AngularFirestore } from 'angularfire2/firestore';
import { Observable } from '@firebase/util';
import { AdminLaboratorios25Component } from '../../../../../modulos/mod-nivel2.5/admin-laboratorios-2-5/admin-laboratorios-2-5.component';

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
  rol: any;

  moduloNivel2 = false;
  moduloPermiso = false;

  constructor(private obs: ObservablesService, private route: Router, private afs: AngularFirestore) { }

  ngOnInit() {
    if (localStorage.getItem('usuario')) {
      this.getUserId();
      this.getRoles();
      this.getPersonId(this.user.uid).subscribe(person => {
        this.getLaboratorios(person.payload.data().cfPers).subscribe(labs => {
          this.laboratorios2 = this.estructuraIdLab(labs);

        });
        if(this.moduloNivel2){
          this.getLaboratorios(person.payload.data().cfPers).subscribe(labs => {
            this.laboratorios2 = this.estructuraIdLab(labs);
  
          });
        } 
        if(this.moduloPermiso){
          this.getPersona(person.payload.data().cfPers).subscribe(pers => {
            this.getLaboratoriosPermiso(pers.payload.data().cfFacil).subscribe(labs=>{
              this.laboratorios2 = this.estructuraIdLabPermisos(labs);
            })
            
            console.log(this.laboratorios2);
          });
        }


      });



    }
  }
  estructuraIdLab(data: any){
    this.datosLabsEstructurados = [];

    for (let index = 0; index < data.length; index++) {
      const elemento = data[index].payload.doc.data();

      const laboratorio = {

        nombre: this.ajustarTexto(elemento.cfName),
        uid: data[index].payload.doc.id
      };

        this.datosLabsEstructurados.push(laboratorio);


    }
    return this.datosLabsEstructurados;
  }

  estructuraIdLabPermisos(data: any){
    let laboratorio = [];
    console.log(data.payload.data());
    laboratorio = [{
      nombre: this.ajustarTexto(data.payload.data().cfName),
      uid: data.payload.id
    }];
    return laboratorio;;
  }

  getUserId() {
    this.user = JSON.parse(localStorage.getItem('usuario'));
  }

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


  getPersonId(userid) {
    return this.afs.doc('user/' + userid).snapshotChanges();
  }

  // METODO QUE TRAE LA COLECCION DE TODOS LOS LABORATORIOS
  getLaboratorios(persid) {
    this.labsColection = this.afs.collection<any>('cfFacil',
      ref => ref.where('facilityAdmin', '==', persid));
    return this.labsColection.snapshotChanges();
  }

  getPersona(persid) {
    return  this.afs.doc('cfPers/'+persid).snapshotChanges();
  }

  // METODO QUE TRAE LA COLECCION DE LOS LABORATORIOS DE LOS CUALES TIENE PERMISOS
  getLaboratoriosPermiso(labid) {
    return this.afs.doc('cfFacil/' + labid).snapshotChanges();
  }



  // METODO QUE AJUSTA EL NOMBRE DEL LABORATORIO PARA EL SIDEBAR
  ajustarTexto(nombre) {
    console.log(nombre);
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






}
