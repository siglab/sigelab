import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
declare var $: any;

@Injectable()
export class ObservablesService {

  constructor(private afs: AngularFirestore) { }

  consultarNotificaciones(id) {
    const col = this.afs.collection('user').doc(id).collection('notification',
     ref => ref.where('estado', '==', 'sinver'));
    return col.snapshotChanges();
  }

  finalizarNotificacion(user, id) {

    return this.afs.collection('user').doc(user).collection('notification').doc(id).update({estado: 'visto'});
  }

  private object = new BehaviorSubject<any>([]);
  currentObject = this.object.asObservable();

  private solserv = new BehaviorSubject<Array<any>>([]);
  currentSolServ = this.solserv.asObservable();

  private HistoSolserv = new BehaviorSubject<Array<any>>([]);
  currentHistoSolserv = this.HistoSolserv.asObservable();

  public objectEquip = new BehaviorSubject<any>([]);
  currentObjectequip = this.objectEquip.asObservable();

  public objectLab = new BehaviorSubject<any>([]);
  currentObjectLab = this.objectLab.asObservable();

  private objectPer = new BehaviorSubject<any>([]);
  currentObjectPer = this.objectPer.asObservable();

  private objectEsp = new BehaviorSubject<any>([]);
  currentObjectEsp = this.objectEsp.asObservable();

  private objectPra = new BehaviorSubject<any>([]);
  currentObjectPra = this.objectPra.asObservable();

  private objectSolServ = new BehaviorSubject<any>([]);
  currentObjectSolSer = this.objectSolServ.asObservable();

  private objectServAsoc = new BehaviorSubject<any>([]);
  currentObjectServAsoc = this.objectServAsoc.asObservable();

  private objectProy = new BehaviorSubject<any>([]);
  currentObjectProy = this.objectProy.asObservable();

  private objectSolMan = new BehaviorSubject<any>([]);
  currentObjectSolMan = this.objectSolMan.asObservable();

  private objectSolBaja = new BehaviorSubject<any>([]);
  currentObjectSolBaja = this.objectSolBaja.asObservable();

  changeObject(object: any) {
    this.object.next(object);
  }

  changeObjectEquip(object: any) {
    console.log('cambioequipo');
    this.objectEquip.next(object);
  }

  changeObjectLab(object2: any) {
    console.log('cambiolab');
    this.objectLab.next(object2);
  }

  changeObjectPer(object: any) {
    this.objectPer.next(object);
  }

  changeObjectEsp(object: any) {
    this.objectEsp.next(object);
  }

  changeObjectPra(object: any) {
    this.objectPra.next(object);
  }

  changeObjectSolServ(object: any) {
    this.objectSolServ.next(object);
  }

  changeObjectServAsoc(object: any) {
    this.objectServAsoc.next(object);
  }

  changeObjectProy(object: any) {
    this.objectProy.next(object);
  }

  changeObjectSolMante(object: any) {
    this.objectSolMan.next(object);
  }

  changeObjectSolBaja(object: any) {
    this.objectSolBaja.next(object);
  }

  getSolServ() {
    return this.currentSolServ;
  }

  // OBSERVABLES PERTENECIENTES AL COMPONENTE SOLICITUDES SERVICIO NIVEL 2

  changeSolServ(itemSolServ: Array<any>) {
    this.solserv.next(itemSolServ);
  }

  changeHistoSolserv(itemHistoSolserv: Array<any>) {
    this.HistoSolserv.next(itemHistoSolserv);
  }

  centerView( id ) {
    setTimeout(function() {
      $('html, body').animate(
        {
          scrollTop: $('#' + id).offset().top - 55
        },
        600
      );
    }, 200);
  }

}
