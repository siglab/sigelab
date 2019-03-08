import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';

const publicIp = require('public-ip');

@Injectable()
export class Modulo2Service {

  constructor(private afs:AngularFirestore) { }

  //METODOS DE CONSULTA
  getLocalStorageUser(){
    return JSON.parse(localStorage.getItem('usuario'));
  }

  getLocalStoragePers(){
    return JSON.parse(localStorage.getItem('persona'));
  }

  // METODO QUE TRAE UN DIRECTOR ESPECIFICO DEPENDIENDO EL ID-DIRECTOR
  buscarLab(idlab) {
    return this.afs.doc('cfFacil/' + idlab).ref.get();
  }

  // METODO QUE TRAE UN DIRECTOR ESPECIFICO DEPENDIENDO EL ID-DIRECTOR
  buscarDirector(iddirector) {
    return this.afs.doc('cfPers/' + iddirector).ref.get();
  }

   // METODO QUE TRAE UNA SEDE ESPECIFICA DEPENDIENDO EL ID-SEDE
  buscarSede(idsede) {
    return this.afs.doc('headquarter/' + idsede).ref.get();
  }

  // METODO QUE TRAE UNA SUBSEDE ESPECIFICA DEPENDIENDO EL ID-SUBSEDE
  buscarSubSede(idsub) {
    return this.afs.doc('cfPAddr/' + idsub).ref.get();
  }

  buscarEspacio(idesp){
    return this.afs.doc('space/' + idesp).ref.get();
  }

  buscarServicio(idser){
    return this.afs.doc('cfSrv/' + idser).ref.get();
  }

  buscarVariacion(idser, idvar){
    return  this.afs.doc('cfSrv/' + idser + '/variations/' + idvar).ref.get();
  }

  buscarPractica(idprac){
    return this.afs.doc('practice/' + idprac).ref.get()
  }

  buscarProgramacion(idprac){
    return this.afs.doc('practice/' + idprac ).collection('programmingData').ref.get();
  }

  buscarEquipo(idequip){
    return this.afs.doc('cfEquip/' + idequip).ref.get();
  }

  buscarProyectos(idproy){
    return this.afs.doc('project/' + idproy).ref.get();
  }

  buscarFacultad(idfac){
    return this.afs.doc('faculty/' + idfac).ref.get();
  }

  buscarDepartamento(idfac, iddepar){
    return  this.afs.doc('faculty/' + idfac).collection('departments').doc(iddepar).ref.get();
  }

  buscarTelefono(idlab){
    return this.afs.doc('cfFacil/'+idlab).collection('cfEAddr').ref.get();
  }

  buscarComponente(idequip){
    return this.afs.collection('cfEquip/' + idequip + '/components').ref.get();
  }

  buscarPersona(idpers){
    return this.afs.doc('cfPers/' + idpers).ref.get();
  }

  buscarUsuario(iduser){
    return this.afs.doc('user/' + iduser).ref.get();
  }


  buscarUsuarioNivel3(){
    const col = this.afs.collection('user');
    const refer = col.ref.where('appRoles.lCpNW2BmPgMSHCD1EBpT','==',true);
    return refer.get();
  }

  buscarUsuarioNivel25(){
    const col = this.afs.collection('user');
    const refer = col.ref.where('appRoles.PFhLR4X2n9ybaZU3CR75','==',true);
    return refer.get();
  }


  getSedes(){
    return this.afs.collection('headquarter').ref.get();
  }


  getSubSedes(){
    return this.afs.collection('cfPAddr').ref.get();
  }

  getFacultades(){
    return this.afs.collection('faculty').ref.get();
  }

  getDepartamentos(idfac){
    return this.afs.doc('faculty/'+idfac).collection('departments').ref.get()
  }

  getVariaciones(idser){
    return this.afs.doc('cfSrv/' + idser).collection('variations').ref.get();
  }

  getLaboratoriosForAdmin(persid) {
    const col = this.afs.collection('cfFacil');
    const ref = col.ref.where('facilityAdmin', '==', persid);

    return ref.get();

  }


  getSolicitudesServiciosForId(id){
    const col = this.afs.collection('cfSrvReserv');
    const refer = col.ref.where('cfSrv', '==', id).where('status', '==', 'pendiente');

    return refer.get();
  }

  getPracticesForIdEquipo(idEquip){
    const col = this.afs.collection('practice');
    const refer = col.ref.where('relatedEquipments.' + idEquip, '==', true);
    return  refer.get()
  }

  getPracticesForIdEspacio(idSpace){
    const col = this.afs.collection('practice');
    const refer = col.ref.where('relatedSpaces.' + idSpace, '==', true);
    return refer.get();
  }

  getEspaceForBuildAndPlace(edificio: string , espacio: string ){


    const build = parseInt( edificio, 10 );
    const place = parseInt( espacio, 10 );
    const col = this.afs.collection('space');
    const refer = col.ref.where('spaceData.building', '==', build)
                          .where('spaceData.place', '==', place);
    return refer.get();
  }

  getAppRoles(){
    return  this.afs.collection('appRoles').ref.get();
  }

  getAppRoleForName(name){
    const col = this.afs.collection('appRoles');
    const refer = col.ref.where('roleName', '==',name);
    return refer.get();
  }

  getUserForEmail(email){

    const col = this.afs.collection('user').ref;
    const refer = col.where('email', '==', email);

    return refer.get();
  }

  getPersForEmail(email){
    const col = this.afs.collection('cfPers');
    const refer = col.ref.where('email', '==', email);

    return refer.get();
  }

  getProyectForCi(ci){
    const col = this.afs.collection('project');
    const refer = col.ref.where('ciNumber', '==', ci);

    return refer.get();
  }

  getCollectionServicios(labid) {
    const col = this.afs.collection('cfSrv');
    const refer = col.ref.where('cfFacil', '==', labid)

    return refer.get();
  }

  getCollectionReservasServicios(labid) {
    const col =  this.afs.collection('cfSrvReserv');
    const refer = col.ref.where('cfFacil', '==', labid);

    return refer.get();
  }

  getCollectionSolicitudesMantenimiento(labid) {
    const col = this.afs.collection('request');
    const refer = col.ref.where('requestType', '==', 'mantenimiento').where('cfFacil','==',labid)
    return refer.get();
  }

  getComponentForId(idequip, idcomp){
    return  this.afs.collection('cfEquip/' + idequip + '/components').doc(idcomp).ref.get();
  }




  // METODOS DE MODIFICACION

  updateDocLaboratorio(idlab, doc){
    return this.afs.doc('cfFacil/' + idlab).update(doc);
  }

  setDocLaboratorio(idlab, doc) {

    return  this.afs.doc('cfFacil/' + idlab).set(doc, {merge: true});
  }

  updateEquip(idEquip, doc){
    return this.afs.doc('cfEquip/'+idEquip).update(doc);
  }

  setEquipo(idEquip, doc){
    return  this.afs.doc('cfEquip/'+idEquip).set(doc,{merge:true});
  }

  setEspacio(idSpace, doc){
    return this.afs.doc('space/' + idSpace).set(doc, { merge: true });
  }

  setUser(iduser, doc){
    return this.afs.collection('user').doc(iduser).set(doc, { merge: true });
  }

  setPersona(idPers, doc){
    return this.afs.collection('cfPers/').doc(idPers).set(doc, { merge: true });
  }

  updatePersona(idPers, doc){
    return this.afs.collection('cfPers/').doc(idPers).update(doc);
  }

  setPractica(idprac, doc){
    return this.afs.doc('practice/' + idprac).set(doc, { merge: true });
  }

  setProgramacion(idprac, idprog, doc){
    return  this.afs.doc('practice/' + idprac + '/programmingData/' + idprog).set(doc, { merge: true });
  }

  setProyecto(idproy, doc){
    return this.afs.doc('project/' + idproy).set(doc, { merge: true });
  }

  updateServicio(idsrv, doc){
    return this.afs.doc('cfSrv/' + idsrv).update(doc);
  }

  updateVariciones(idsrv, idVar, doc){
    return this.afs.collection('cfSrv/' + idsrv + '/variations').doc(idVar).update(doc);
  }

  setVariaciones(idsrv, idVar, doc){
    return this.afs.collection('cfSrv/' + idsrv + '/variations').doc(idVar).set(doc,{merge:true});
  }

  updateReservasServicios(idreserv, doc){
    return this.afs.doc('cfSrvReserv/' + idreserv).update(doc);
  }


  // METODOS DE CREACION O ADICION
  addAddrLaboratorio(idlab, doc) {
    return  this.afs.doc('cfFacil/' + idlab).collection('cfEAddr')
                .add({cfClass: '68aa07f2-34c9-11e1-b86c-0800200c9a66',
                      cfClassScheme: '1227a225-db7a-444d-a74b-3dd4b438b420', cfEAddrValue: doc});
  }


  addESpacio(doc){
    return  this.afs.collection('space').add(doc);
  }

  addPersona(doc){
    return  this.afs.collection('cfPers').add(doc);
  }

  addPractica(doc){
    return  this.afs.collection('practice').add(doc);
  }

  addProgramacion(idprac, doc){
    return this.afs.doc('practice/' + idprac).collection('programmingData').add(doc);
  }

  addProyecto(doc){
    return  this.afs.collection('project').add(doc);
  }

  addServicio(doc){
    return this.afs.collection('cfSrv').add(doc);
  }

  addVariaciones(idsrv, doc){
    return  this.afs.collection('cfSrv/' + idsrv + '/variations').add(doc);
  }

  addSolicitudMantenimiento(doc){
    return  this.afs.collection('request').add(doc);
  }


  enviarNotificacion(iduser, object){
    return this.afs.doc('user/'+iduser).collection('notification').add(object);
  }


  // METODOS DE ELIMINACION

  deleteAddrLaboratorio(idlab, idAddr){
    return  this.afs.doc('cfFacil/'+idlab).collection('cfEAddr')
                .doc(idAddr).delete();
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
    let promise = new Promise((resolve, reject) => {
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
