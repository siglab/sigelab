import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Injectable } from '@angular/core';

@Injectable()
export class ObservablesService {



  constructor() { }


  private object = new BehaviorSubject<any>([]);
  currentObject = this.object.asObservable();

  private solserv = new BehaviorSubject<Array<any>>([]);
  currentSolServ = this.solserv.asObservable();


  private HistoSolserv = new BehaviorSubject<Array<any>>([]);
  currentHistoSolserv = this.HistoSolserv.asObservable();



  private objectEquip = new BehaviorSubject<any>([]);
  currentObjectequip = this.objectEquip.asObservable();

  private objectLab = new BehaviorSubject<any>([]);
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


  changeObject(object: any) {
    this.object.next(object);
  }

  changeObjectEquip(object: any) {
    this.objectEquip.next(object);
  }

  changeObjectLab(object: any) {
    this.objectLab.next(object);
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


}
