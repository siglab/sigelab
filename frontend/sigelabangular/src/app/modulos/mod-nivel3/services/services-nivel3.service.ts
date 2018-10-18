import { Injectable, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from '@firebase/util';


const publicIp = require('public-ip');

@Injectable()
export class ServicesNivel3Service {

  // INICIALIZACION DE CONSULTAS PARA LABORATORIOS
  private labsCollection: AngularFirestoreCollection<any>;
  labs: Observable<any[]>;

  datosLabsEstructurados = [];

  constructor(private afs: AngularFirestore) { }


  // METODOS DE CONSULTA

  getLocalStorageUser(){
    return JSON.parse(localStorage.getItem('usuario'));
  }


  getLaboratorios() {
    this.labsCollection = this.afs.collection<any>('cfFacil');
    return this.labsCollection.snapshotChanges();
  }

  getSingleLaboratorios(id) {

   return  this.afs.doc('cfFacil/' + id).ref.get();

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



  getServicio(id) {
    return this.afs.collection('cfSrv').doc(id).ref.get();
  }

  getPractica(id) {
    return this.afs.collection('practice').doc(id).ref.get();
  }

  getProyecto(id) {
    return this.afs.collection('project').doc(id).ref.get();
  }

  getPracticaProgramacion(id) {
    return this.afs.collection('practice').doc(id).collection('programmingData').ref.get();
  }



  getServicioPrestado(id){
    const col = this.afs.collection('cfSrvReserv');
    const refer = col.ref.where('cfSrv', '==', id).where('status', '==', 'terminada');

    return refer.get();
  }

  getCollectionSolicitudes() {
    const col = this.afs.collection('request');
    const refer = col.ref.where('requestType', '==', 'mantenimiento');
    return refer.get();
  }

  getCollectionSolicitudesFacultad(id) {
    const col = this.afs.collection('request');
    const refer = col.ref.where('requestType', '==', 'mantenimiento').where('faculties.'+id, '==', true);

    return refer.get();
  }

  getUser(userid){
    return this.afs.doc('user/' + userid).ref.get();
  }

  getEquipo(equipid){
    return this.afs.doc('cfEquip/' + equipid).ref.get();
  }

  getLaboratorio(labid){
    return this.afs.doc('cfFacil/' + labid).ref.get();
  }

  getcomponents(id){
    return this.afs.collection('cfEquip/' + id + '/components').ref.get();
  }

  getComponenteForId(idequip, idcomp){
    return  this.afs.collection('cfEquip/' + idequip + '/components').doc(idcomp).ref.get();
  }







  // METODOS DE MODIFICACION

  setPersona(id, doc) {

    return this.afs.doc('cfPers/' + id).set(doc, { merge: true });

  }

  setLaboratorio(id, doc) {

    return this.afs.collection('cfFacil').doc(id).set(doc, { merge: true });

  }

  setUser(id, doc) {

    return this.afs.doc('user/' + id).set(doc, { merge: true });

  }

  updateSolicitudMantenimiento(id, doc){
    return  this.afs.collection('request').doc(id).update(doc);
  }

  updatedUser(id, doc) {

    return this.afs.doc('user/' + id).update(doc);

  }

  updatedLab(id, doc) {

    return this.afs.doc('cfFacil/' + id).update(doc);

  }

  updatedPersona(id, doc) {

    return this.afs.doc('cfPers/' + id).update(doc);

  }

  // METODOS DE CREACION

  agregarHistorial(obj) {
    return this.afs.collection('cfMailNotification').add(obj);
  }

  agregarPersona(obj) {
    return this.afs.collection('cfPers').add(obj);
  }



   // METODO TRAZABILIDAD DE CAMBIOS

   Trazability(user, type, collection, id, docIn){
    console.log('ejecuto');
    let size = 0;
    let cont = 1;
    for (const key in docIn) {
      size++;
    }
    let promise = new Promise((resolve, reject)=>{
      let docAfter = {};
      this.afs.collection(collection).doc(id).ref.get().then(doc => {
        const documento = doc.data();
        docAfter = doc.data();

        for (const key in docIn) {
          if (docIn.hasOwnProperty(key)) {
             docAfter[key] = docIn[key];
             console.log(cont, size);
             if(cont == size){

              console.log(documento, docAfter);

              this.addTrazability(user, type, collection, id, documento, docAfter).then(()=>{
                resolve();
              });

             }else{
              cont++;
             }

          }
        }


      });
    });

    return promise;

  }


  TrazabilitySubCollection(user, type, collection, idColl, subColl, idSub, docIn){
    console.log('ejecuto');
    let size = 0;
    let cont = 1;
    for (const key in docIn) {
      size++;
    }
    let promise = new Promise((resolve, reject)=>{
      if(type != 'create'){
        let docAfter = {};
        this.afs.collection(collection).doc(idColl).collection(subColl).doc(idSub)
          .ref.get().then(doc => {
          const documento = doc.data();
          docAfter = doc.data();

          if(type != 'delete'){
            for (const key in docIn) {
              if (docIn.hasOwnProperty(key)) {
                 docAfter[key] = docIn[key];
                 console.log(cont, size);
                 if(cont == size){

                  console.log(documento, docAfter);

                  this.addTrazability(
                    user, type, collection+'/'+idColl+'/'+subColl, idSub,
                    documento, docAfter).then(()=>{
                    resolve();
                  });

                 }else{
                  cont++;
                 }

              }
            }
          } else {
            console.log(documento);
            this.addTrazability(
              user, type, collection+'/'+idColl+'/'+subColl, idSub, documento, {}).then(()=>{
              resolve();
            });
          }


        });
      } else {
        this.addTrazability(
          user, type, collection+'/'+idColl+'/'+subColl, idSub,
          {}, docIn).then(()=>{
          resolve();
        });

      }

    });

    return promise;
  }


  addTrazability(user, type, collection, iddoc, docAnt, docDes){
    const promise = new Promise((resolve, reject) => {
      publicIp.v4().then(ip => {
        const logger = {
          user:user,
          type:type,
          ip: ip,
          relatedDoc: iddoc,
          collectionName:collection,
          currentVer: docDes,
          previousVer:docAnt,
          createdAt: new Date().toISOString()
        };

      console.log(logger);

      this.afs.collection('logger').add(logger).then(()=>{
        resolve();
      });
      });

    });

    return promise;


  }

}

