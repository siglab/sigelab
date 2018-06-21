import { Observable } from 'rxjs/Observable';
import { Component, OnInit } from '@angular/core';
import { ObservablesService } from '../../../shared/services/observables.service';

@Component({
  selector: 'app-admin-proyectos',
  templateUrl: './admin-proyectos.component.html',
  styleUrls: ['./admin-proyectos.component.css']
})
export class AdminProyectosComponent implements OnInit {
  itemsel: Observable<Array<any>>;

  proyectos = {

  };

  constructor(private obs: ObservablesService) { }

  ngOnInit() {
    this.obs.currentObject.subscribe(data => {
      console.log(data);
      this.itemsel = Observable.of(data);
      console.log(this.itemsel);



    });
  }

}
