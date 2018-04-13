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



  changeObject(object: any) {
    this.object.next(object);
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
