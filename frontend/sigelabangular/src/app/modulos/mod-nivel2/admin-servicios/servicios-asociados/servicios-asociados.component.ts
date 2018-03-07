import { Observable } from 'rxjs/Observable';
import { ObservablesService } from './../../../../shared/services/observables.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-servicios-asociados',
  templateUrl: './servicios-asociados.component.html',
  styleUrls: ['./servicios-asociados.component.css']
})
export class ServiciosAsociadosComponent implements OnInit {

  itemsel: Observable<Array<any>>;

  constructor(private obs: ObservablesService) { }

  ngOnInit() {
    this.obs.currentObject.subscribe(data => {
      console.log(data);
      this.itemsel = Observable.of(data);
      console.log(this.itemsel);
    });
  }

}
