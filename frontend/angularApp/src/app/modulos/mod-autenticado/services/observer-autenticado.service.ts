import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Injectable } from '@angular/core';

@Injectable()
export class ObserverAutenticadoService {

  private serviciosActivos = new BehaviorSubject<any>([]);
  currentDatatableServActi = this.serviciosActivos.asObservable();

  private histoServs = new BehaviorSubject<any>([]);
  currentDatatableHistoServs = this.histoServs.asObservable();

  constructor() { }


  changeDatatableServsAct(datatableservact: any) {
    this.serviciosActivos.next(datatableservact);
  }

  changeDatatableHistoServs(datatablehistoserv: any) {
    this.histoServs.next(datatablehistoserv);
  }

}
