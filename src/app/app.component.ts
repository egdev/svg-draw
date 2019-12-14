import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'svg-draw';
  coords: string;

  public updateCoords(event: string)
  {
    console.log(event);
    this.coords = event;
  }
}
