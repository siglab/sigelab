import { Injectable, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from '@firebase/util';

@Injectable()
export class ServicesNivel3Service {

  // INICIALIZACION DE CONSULTAS PARA LABORATORIOS
  private labsCollection: AngularFirestoreCollection<any>;
  labs: Observable<any[]>;

  datosLabsEstructurados = [];

  constructor(private afs: AngularFirestore) { }


  // METODOS DE CONSULTA
  getLaboratorios() {
    this.labsCollection = this.afs.collection<any>('cfFacil');
    return this.labsCollection.snapshotChanges();
  }

  getAppRoles() {
    return this.afs.collection('appRoles').ref.get();
  }

  buscarUsuarios() {

    return this.afs.collection('user').ref.get();
  }



  getPersona(id) {
    return this.afs.collection('cfPers').doc(id).ref.get();
  }


  consultarNombreRol(id) {
    return this.afs.collection('appRoles').doc(id).ref.get();
  }

  getLabsForIdPersona(id) {
    const col = this.afs.collection('cfFacil');
    const refer = col.ref.where('relatedPers.' + id, '==', true);
    return refer.get();
  }


  buscarDirector(iddirector) {
    return this.afs.doc('cfPers/' + iddirector).ref.get();
  }


  consultarNotificaciones(iduser) {
    return this.afs.doc('user/' + iduser).ref.get();
  }

  enviarNotificacion(iduser, object) {
    return this.afs.doc('user/' + iduser).collection('notification').add(object);
  }

  buscaSede() {
    return this.afs.collection('headquarter').ref.get();
  }

  buscaSubSede(keysede) {
    const col = this.afs.collection('cfPAddr');
    const ref = col.ref.where('headquarter', '==', keysede);
    return ref.get();
  }

  buscaTodasSubSede() {
    return this.afs.collection('cfPAddr').ref.get();
  }

  buscaFacultad(keyfacul) {
    return this.afs.doc('faculty/' + keyfacul).ref.get();
  }
  buscaTodasFacultades() {
    return this.afs.collection('faculty').ref.get();
  }

  buscaFacultadWitSede(keysede) {
    const col = this.afs.collection('faculty');
    const ref = col.ref.where('subHq.' + keysede, '==', true);
    return ref.get();
  }

  buscaDepartamento(keyfacultad) {
    return this.afs.doc('faculty/' + keyfacultad).collection('departments').ref.get();
  }

  buscaLaboratorios() {
    return this.afs.collection('cfFacil').ref.get();
  }


  consultarHistorial() {
    return this.afs.collection('cfMailNotification').valueChanges();
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



  // METODOS DE MODIFICACION

  setPersona(id, doc) {
    return this.afs.doc('cfPers/' + id).set(doc, { merge: true });
  }

  setLaboratorio(id, doc) {
    return this.afs.collection('cfFacil').doc(id).set(doc, { merge: true });
  }

  setUser(id, doc) {
    return this.afs.doc('user' + id).set(doc, { merge: true });
  }


  // METODOS DE CREACION

  agregarHistorial(obj) {
    return this.afs.collection('cfMailNotification').add(obj);
  }



}

