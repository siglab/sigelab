import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css']
})
export class SpinnerComponent implements OnInit {

  showspinner = false;
  constructor() { }

  ngOnInit() {
  }


  public show() {
    this.showspinner = true;
  }

  public hide() {
    this.showspinner = false;
  }


}
