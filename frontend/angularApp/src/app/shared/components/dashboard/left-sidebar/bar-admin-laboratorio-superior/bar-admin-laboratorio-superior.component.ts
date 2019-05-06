import { ObservablesService } from './../../../../services/observables.service';
import { Component, OnInit } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from 'angularfire2/firestore';
import { Observable } from '@firebase/util';

@Component({
  selector: 'app-bar-admin-laboratorio-superior',
  templateUrl: './bar-admin-laboratorio-superior.component.html',
  styleUrls: ['./bar-admin-laboratorio-superior.component.css']
})
export class BarAdminLaboratorioSuperiorComponent implements OnInit {


  constructor(private obs: ObservablesService, private afs: AngularFirestore) { }

  ngOnInit() {
  }

}
