import { Component, OnInit } from '@angular/core';
import { Shape } from './svg/shape';
import { Polygon } from './svg/polygon';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'svg-draw';
  coords: string;
  private shapes: Array<Shape> = [];
  private initialPolygons: Array<Polygon> = [];

  ngOnInit()
  {
    let p = new Polygon();
    p.addPoint(0, 0);
    p.addPoint(100, 0);
    p.addPoint(100, 100);
    this.initialPolygons.push(p);
  }

  public updateShapes(event: Array<Shape>)
  {
    this.shapes = event;
    console.log("SHAPES", this.shapes);
  }
}
