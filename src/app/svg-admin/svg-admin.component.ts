import { Component, OnInit } from '@angular/core';
import { Shape, ShapeType } from '../svg/shape';
import { Polygon } from '../svg/polygon';
import { Rectangle } from '../svg/rectangle';

@Component({
  selector: 'app-svg-admin',
  templateUrl: './svg-admin.component.html',
  styleUrls: ['./svg-admin.component.css']
})
export class SvgAdminComponent implements OnInit {

  constructor() { }

  private shapes: Array<ShapeType> = [];
  private initialShapes: Array<ShapeType> = [];
  private attributes: any = {};

  ngOnInit()
  {
    this.attributes["fill"] = "rgba(255, 128, 0, 0.5)";
    this.attributes["stroke-width"] = "1";
    this.attributes["stroke"] = "black";
    let p = new Polygon();
    p.addPoint(0, 0);
    p.addPoint(100, 0);
    p.addPoint(100, 100);
    this.initialShapes.push(p);
    this.initialShapes.push(new Rectangle(0, 100, 200, 50));
  }

  public updateShapes(event: Array<ShapeType>)
  {
    this.shapes = event;
    console.log("SHAPES", this.shapes);
  }

}
