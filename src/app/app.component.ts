import { Component } from '@angular/core';
import { Shape } from './svg/shape';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'svg-draw';
  coords: string;
  private shapes: Array<Shape> = [];

  public updateShapes(event: Array<Shape>)
  {
    this.shapes = event;
    console.log("SHAPES", this.shapes);
  }
}
