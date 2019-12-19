import { Component, OnInit, OnDestroy, Input, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import { Polygon } from './polygon';
import { Shape, ShapeType } from './shape';
import { Rectangle } from './rectangle';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-svg',
  templateUrl: './svg.component.html',
  styleUrls: ['./svg.component.css']
})

export class SvgComponent implements OnInit {
  @Input() initialShapes: Array<ShapeType>;
  @Input() image: string;
  @Input() fill: string;
  @Input() fillEdited: string;
  @Input() stroke: string;
  @Input() strokeWidth: number;

  @Output() updateShapes = new EventEmitter<ShapeType[]>(true); 

  private activePoint: number;
  private moveHandler = null;
  private shapes: Array<ShapeType> = [];
  private currentShape: ShapeType;
  private editShape: boolean = false;

  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.shapes = this.initialShapes;
    this.updateShapes.emit(this.shapes.slice());
    this.moveHandler = this.move.bind(this);
  }

  add(type:string)
  {
    if (this.currentShape)
      this.record();

    switch (type)
    {
      case 'polygon':
        this.addPolygon();
        break;
      case 'rectangle':
        this.addRectangle();
        break;        
    }
  }

  addPolygon()
  {
    this.currentShape = new Polygon();
  }

  addRectangle()
  {
    console.log('add rectangle');
    this.currentShape = new Rectangle(0, 0, 0, 0);
  }

  isPolygon(shape: ShapeType) : shape is Polygon
  {
    return shape instanceof Polygon;
  }

  isRectangle(shape: ShapeType) : shape is Rectangle
  {
    return shape instanceof Rectangle;
  }

  getHtml(shape)
  {
    return this.sanitizer.bypassSecurityTrustHtml(shape.buildHtml({fill: this.fill, stroke: this.stroke, "stroke-wdith": this.strokeWidth }));
  }

  move(e) {
    const coords = this.getRelativeCoordinates(e);
    
    if (this.isPolygon(this.currentShape))
    {
      this.currentShape.xpoints[this.activePoint] = Math.round(coords.x);
      this.currentShape.ypoints[this.activePoint] = Math.round(coords.y);
    }
    else if (this.isRectangle(this.currentShape))
    {
      let w, h, x, y;

      console.log("EDIT RECTANGLE");
      // found which corner has been clicked
      if (this.activePoint == 0)
      {
        // top left corner
        x = Math.round(coords.x);
        y = Math.round(coords.y);
        w = Math.round(this.currentShape.xpoints[1] - x);
        h = Math.round(this.currentShape.ypoints[3] - y);
      }
      else if (this.activePoint == 1)
      {
        // top right corner
        x = this.currentShape.x;
        y = Math.round(coords.y);
        w = Math.round(coords.x - x);
        h = Math.round(this.currentShape.ypoints[2] - y);
     }
      else if (this.activePoint == 2)
      {
        x = this.currentShape.x;
        y = this.currentShape.y;
        // bottom right corner
        w = coords.x - x;
        h = coords.y - y;
      }
      else if (this.activePoint == 3)
      {
        // bottom left corner
        x = Math.round(coords.x);
        y = this.currentShape.y;
        w = Math.round(this.currentShape.xpoints[1] - x);
        h = Math.round(coords.y - this.currentShape.ypoints[0]);

      }

      if (w > 4)
      {
        this.currentShape.xpoints[this.activePoint] = Math.round(coords.x);
        this.currentShape.x = x;
        this.currentShape.width = w;
      }

      if (h > 4)
      {
        this.currentShape.ypoints[this.activePoint] = Math.round(coords.y);
        this.currentShape.y = y;
        this.currentShape.height = h;
      }

      this.currentShape.updatePoints();
    }
  };

  stopdrag(e) {
    console.log("STOP DRAG");
    e.currentTarget.removeEventListener('mousemove', this.moveHandler);
    this.activePoint = null;
  };

  public managePoint(event: any)
  { 
    if (!this.currentShape)
    {
      alert('You must add a shape !');
      return;
    }

    if (event.which === 3)  
      return false;

    event.preventDefault();
    
    const coords = this.getRelativeCoordinates(event);
    const index = this.findClickedPointIndex(coords);
    if (index != -1) // click on a point
    {
      this.activePoint = index;
      console.log("Click on point " + this.activePoint);
      event.currentTarget.addEventListener('mousemove', this.moveHandler);       
      return false;
    }

    console.log("x = " + coords.x + ", y = " + coords.y);
    
    if (this.isPolygon(this.currentShape))
    {
      this.currentShape.addPoint(Math.round(coords.x), Math.round(coords.y));
      this.activePoint = (this.currentShape.npoints - 1);
      event.currentTarget.addEventListener('mousemove', this.moveHandler);
    }
    else if (this.isRectangle(this.currentShape))
    {
      this.currentShape.addPoint(Math.round(coords.x), Math.round(coords.y));
    }
  }

  edit(event)
  {
    event.stopPropagation();
    this.editShape = true;
    const idx = parseInt(event.currentTarget.getAttribute('data-index'));
    this.currentShape = this.shapes[idx];//JSON.parse(JSON.stringify(this.shapes[idx]));    
  }

  public record() 
  {
    if (!this.currentShape)
      return;

    if (!this.currentShape.canSave())
    {
      console.log("Cannot save shape !");
      return;
    }

    this.activePoint = null;
    if (this.editShape)    
      this.editShape = false;
    else
      this.shapes.push(this.currentShape);
    this.currentShape = null;
    this.updateShapes.emit(this.shapes);
    console.log("AFTER SIZE", this.shapes.length);
  }

  public deleteShape()
  {
    if (!this.currentShape)
      return;

    if (this.editShape)
    {
      this.shapes.splice(this.shapes.indexOf(this.currentShape), 1);
      this.updateShapes.emit(this.shapes);
      this.editShape = false;
    }
    this.currentShape = null;
    this.activePoint = null;
  }

  public rightClick(event: any)
  {
    event.preventDefault();
    console.log("rightCLick");

    const coords = this.getRelativeCoordinates(event);
    const index = this.findClickedPointIndex(coords);
    if (index == -1)
      return false;

    if (this.isPolygon(this.currentShape))
      (this.currentShape as Polygon).removePoint(index);
  }

  private getRelativeCoordinates(event: any)
  {
    const rect = (event.currentTarget || event.target).getBoundingClientRect();
    const win = (event.currentTarget || event.target).ownerDocument.defaultView;
    const top = (rect.top + win.pageYOffset);
    const left = (rect.left + win.pageXOffset);
    const offsetX = (event.pageX - left);
    const offsetY = (event.pageY - top);

    return { x: offsetX, y: offsetY };
  }

  private findClickedPointIndex(coords: any): number
  {
    for (let i = 0; i < this.currentShape.npoints; i++) {
      const dis = Math.sqrt(Math.pow(coords.x - this.currentShape.xpoints[i], 2) + Math.pow(coords.y - this.currentShape.ypoints[i], 2));
      if ( dis < 6 ) {
        console.log("Point found at coordinates (" + this.currentShape.xpoints[i] + "," + this.currentShape.ypoints[i] + ")");
        return i;
      }
    }
    console.log("No point found !");
    return -1;
  }
}
