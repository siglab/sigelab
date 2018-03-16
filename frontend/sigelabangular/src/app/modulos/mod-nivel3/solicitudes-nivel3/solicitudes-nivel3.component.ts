import { Observable } from 'rxjs/Observable';
import { Component, OnInit } from '@angular/core';
import { ObservablesService } from '../../../shared/services/observables.service';

@Component({
  selector: 'app-solicitudes-nivel3',
  templateUrl: './solicitudes-nivel3.component.html',
  styleUrls: ['./solicitudes-nivel3.component.css']
})
export class SolicitudesNivel3Component implements OnInit {

  itemsel: Observable<Array<any>>;

  constructor(private obs: ObservablesService) {
   }

  ngOnInit() {
    this.obs.currentObject.subscribe(data => {
      console.log(data);
      this.itemsel = Observable.of(data);
      console.log(this.itemsel);
    });
  }
}
