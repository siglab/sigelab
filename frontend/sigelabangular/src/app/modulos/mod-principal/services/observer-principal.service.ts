import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class ObserverPrincipalService {

  constructor() { }


  private datatableLabs = new BehaviorSubject<any>([]);
  currentDatatableLab = this.datatableLabs.asObservable();

  private datatableServs = new BehaviorSubject<any>([]);
  currentDatatableServs = this.datatableServs.asObservable();

  private datatablePruebas = new BehaviorSubject<any>([]);
  currentDatatablePruebas = this.datatablePruebas.asObservable();

  private solserv = new BehaviorSubject<Array<any>>([]);
  currentSolServ = this.solserv.asObservable();



  private HistoSolserv = new BehaviorSubject<Array<any>>([]);
  currentHistoSolserv = this.HistoSolserv.asObservable();



  changeDatatableLabs(datatablelab: any) {
    this.datatableLabs.next(datatablelab);
  }

  changeDatatableServs(datatableserv: any) {
    this.datatableServs.next(datatableserv);
  }

  changeDatatablePrueba(datatableprueba: any) {
    this.datatablePruebas.next(datatableprueba);
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
