import { Component, OnInit } from '@angular/core';
import { ShapeType } from '../svg/shape';
import { Polygon } from '../svg/polygon';
import { Rectangle } from '../svg/rectangle';

@Component({
  selector: 'app-front',
  templateUrl: './front.component.html',
  styleUrls: ['./front.component.css']
})
export class FrontComponent implements OnInit {
  private shapes: Array<ShapeType> = [];
  private initialShapes: Array<ShapeType> = [];
  private attributes: any;

  constructor() { }

  ngOnInit() {
    this.attributes = { 
                        fill: "transparent",
                        stroke: "black",
                        "stroke-width": "0",
                        'fill-over' : "rgba(0, 157, 223, 0.3)"
                      };
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
}
