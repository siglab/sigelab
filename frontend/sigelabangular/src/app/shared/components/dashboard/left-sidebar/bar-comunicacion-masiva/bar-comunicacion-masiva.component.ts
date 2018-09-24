import { ObservablesService } from './../../../../services/observables.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bar-comunicacion-masiva',
  templateUrl: './bar-comunicacion-masiva.component.html',
  styleUrls: ['./bar-comunicacion-masiva.component.css']
})
export class BarComunicacionMasivaComponent implements OnInit {

 

  constructor(private obs: ObservablesService) { }

  ngOnInit() {
  }

}
