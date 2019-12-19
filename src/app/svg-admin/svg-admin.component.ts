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
  private viewAttributes: any = {};

  ngOnInit()
  {
    this.viewAttributes = { fill: "transparent",
                        "stroke-width" : 0,
                        stroke : "black" };
    this.attributes = { fill: "rgba(255, 128, 0, 0.5)",
                        "stroke-width" : 1,
                        stroke : "black",
                        "fill-edited" : "rgba(255, 0, 0, 0.5)" };
    let p = new Polygon([ { x:262, y:121 },
                          { x:399, y:201 },
                          { x:400, y:253 },
                          { x:298, y:310 },
                          { x:293, y:308 },
                          { x:296, y:303 },
                          { x:295, y:258 },
                          { x:205, y:210 },
                          { x:163, y:233 },
                          { x:157, y:232 },
                          { x:157, y:179 } ]);
    this.initialShapes.push(p);
    this.initialShapes.push(new Rectangle(0, 100, 200, 50));
  }

  public updateShapes(event: Array<ShapeType>)
  {
    this.shapes = event;
    console.log("SHAPES", this.shapes);
  }

}
